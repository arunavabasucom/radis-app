import json
import traceback

import radis


def lambda_handler(event, context):
    payload = json.loads(event["body"])
    print("Payload", payload)

    if payload.get("prewarm", False):
        print("Warming the Lambda container")
        return {
            "statusCode": 200,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": True,
            },
        }

    try:
        spectrum = radis.calc_spectrum(
            payload["min_wavenumber_range"],
            payload["max_wavenumber_range"],
            molecule=[species["molecule"] for species in payload["species"]],
            mole_fraction={
                species["molecule"]: species["mole_fraction"]
                for species in payload["species"]
            },
            isotope={species["molecule"]: "all" for species in payload["species"]},
            pressure=payload["pressure"],
            Tgas=payload["tgas"],
            Tvib=payload["tvib"],
            Trot=payload["trot"],
            path_length=payload["path_length"],
            export_lines=False,
            warnings={
                # Do not raise error if grid too coarse. Discard once we have wstep='auto'. https://github.com/radis/radis/issues/184
                "AccuracyError": "warn",
            },
            use_cached=True,
        )
    except radis.misc.warning.EmptyDatabaseError:
        return {
            "statusCode": 200,
            "body": json.dumps({"error": "No line in the specified wavenumber range"}),
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": True,
            },
        }
    except Exception as exc:
        traceback.print_exc()
        return {
            "statusCode": 200,
            "body": json.dumps({"error": str(exc)}),
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": True,
            },
        }
    else:
        if payload["simulate_slit"]:
            spectrum.apply_slit(1.5, "nm")

        wunit = spectrum.get_waveunit()
        iunit = "default"
        x, y = spectrum.get(payload["mode"], wunit=wunit, Iunit=iunit)

        return {
            "statusCode": 200,
            "body": json.dumps(
                {
                    "data": {
                        "x": list(x),
                        "y": list(y),
                        "units": spectrum.units[payload["mode"]],
                    },
                }
            ),
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": True,
            },
        }
