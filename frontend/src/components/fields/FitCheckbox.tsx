import React, { useEffect } from "react";
import FormLabel from "@mui/joy/FormLabel";
import { Controller, useFormContext } from "react-hook-form";
import Checkbox from "@mui/joy/Checkbox";
import useFromStore from "../../store/form";
import useFitFormStore from "../../store/fitForm";
import { FitFormValues } from "../types";
import Box from "@mui/joy/Box";

type FitParameter = keyof FitFormValues["fit_parameters"];

function capitalizeFirstLetter(text: string): string {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1);
}

export const FitCheckbox: React.FC<{ fitParameter: FitParameter }> = ({ fitParameter }) => {
    const { control, setValue } = useFormContext();
    const { formMode } = useFromStore();
    const {
        selected_fit_parameters,
        setFitTgas,
        setFitTvib,
        setFitTrot,
        setFitMoleFraction,
        setFitPressure,
        setTgasSelected,
        setTvibSelected,
        setTrotSelected,
        setMoleFractionSelected,
        setPressureSelected
    } = useFitFormStore();

    useEffect(() => {
        console.log("its", selected_fit_parameters?.[fitParameter as keyof typeof selected_fit_parameters]);
    }, [selected_fit_parameters]);

    const setFitParameter = (e: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = e.target.checked;
        console.log("isChecked", isChecked);
        // Update the selection state
        switch (fitParameter) {
            case "tgas":
                setTgasSelected(isChecked);
                setFitTgas(isChecked ? 300 : undefined);
                setValue("fit_parameters.tgas", isChecked ? 300 : undefined);
                break;
            case "tvib":
                setTvibSelected(isChecked);
                setFitTvib(isChecked ? 300 : undefined);
                setValue("fit_parameters.tvib", isChecked ? 300 : undefined);
                break;
            case "trot":
                setTrotSelected(isChecked);
                setFitTrot(isChecked ? 300 : undefined);
                setValue("fit_parameters.trot", isChecked ? 300 : undefined);
                break;
            case "mole_fraction":
                setMoleFractionSelected(isChecked);
                setFitMoleFraction(isChecked ? 0.1 : undefined);
                setValue("fit_parameters.mole_fraction", isChecked ? 0.1 : undefined);
                break;
            case "pressure":
                setPressureSelected(isChecked);
                setFitPressure(isChecked ? 1.01325 : undefined);
                setValue("fit_parameters.pressure", isChecked ? 1.01325 : undefined);
                break;
            default:
                break;
        }
    }

    return (
        <Box sx={{ display: "flex", alignItems: "center" }}>
            <FormLabel>{capitalizeFirstLetter(fitParameter)}</FormLabel>
            {formMode === "fit" ? (
                <Controller
                    name={`${fitParameter}_checkbox`}
                    control={control}
                    render={({ field }) => (
                        <Checkbox
                            data-testid={`${fitParameter}_checkbox_testid`}
                            sx={{ ml: 1, mb: 1 }}
                            checked={selected_fit_parameters?.[fitParameter as keyof typeof selected_fit_parameters]}
                            onChange={(e) => {
                                field.onChange(e.target.checked);
                                setFitParameter(e);
                            }}
                        />
                    )}
                />
            ) : null}
        </Box>
    );
};