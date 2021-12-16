import json
import traceback
import os
import shutil

if not os.path.exists("/tmp/radis.json"):
    shutil.copy("/root/radis.json", "/tmp/radis.json")

import radis
from radis.misc.config import get_config
print(get_config())


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
            # TODO: Hard-coding "1,2,3" as the isotopologue for the time-being
            isotope={species["molecule"]
                : "1,2,3" for species in payload["species"]},
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

        # Reduce payload size
        if len(spectrum) * 8 * 2 > 3e6:
            print("Reducing the payload size")
            # payload limit is 6 MB, we set a limit at ~4 MB here
            # one float is about 8 bytes
            # we return 2 arrays (w, I)
            #     (note: we could avoid returning the full w-range, and recompute it on the client
            #     from the x min, max and step --> less data transfer. TODO )
            resample = int(len(spectrum) * 8 * 2 // 3e6)
            x, y = x[::resample], y[::resample]

        result = json.dumps(
            {
                "data": {
                    "x": list(x),
                    "y": list(y),
                    "units": spectrum.units[payload["mode"]],
                },
            }
        )
        print("Size of result", len(result.encode('utf-8')))

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
