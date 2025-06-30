import FormControl from "@mui/joy/FormControl";
import FormHelperText from "@mui/joy/FormHelperText";
import React from "react";
import Grid from "@mui/joy/Grid";
import Input from "@mui/joy/Input";
import { FitCheckbox } from "../FitCheckbox";
import { Controller, Control } from "react-hook-form";
import { MoleculeSelector } from "../MoleculeSelector/MoleculeSelector";
import { Database, FitFormValues, FormValues } from "../../types";
import { BoundingRanges } from "../BoundingRanges";
import useFitFormStore from "../../../store/fitForm";

export interface SpeciesProps {
    control: Control<FitFormValues>;
    isNonEquilibrium: boolean;
    databaseWatch: Database;
}

export const Specie: React.FC<SpeciesProps> = ({
    control,
    isNonEquilibrium,
    databaseWatch,
}) => {
    const { selected_fit_parameters } = useFitFormStore();

    return (
        <Grid container spacing={3}>
            <Grid xs={12} sm={6} md={4} xl={2}>
                <Controller
                    name="experimental_conditions.specie.molecule"
                    control={control}
                    render={({ field, formState }) => (
                        <MoleculeSelector
                            validationError={formState.errors?.experimental_conditions?.specie?.molecule}
                            control={control as Control<FormValues | FitFormValues>}
                            value={field.value}
                            onChange={(value) => {
                                field.onChange(value);
                            }}
                            autofocus={false}
                            isNonEquilibrium={isNonEquilibrium}
                            databaseWatch={databaseWatch}
                        />
                    )}
                />
            </Grid>
            <Grid xs={12} sm={6} md={8} xl={selected_fit_parameters?.mole_fraction ? 4 : 10}>
                <Controller
                    name={selected_fit_parameters?.mole_fraction ? "fit_parameters.mole_fraction" : "experimental_conditions.specie.mole_fraction"}
                    control={control}
                    render={({ field: { onChange, value }, formState }) => (
                        <FormControl>
                            <FitCheckbox fitParameter="mole_fraction" />
                            <Input
                                id="mole-fraction-input"
                                error={!!formState.errors?.experimental_conditions?.specie?.mole_fraction}
                                value={value || ""}
                                type="number"
                                onChange={(e) => {
                                    onChange(parseFloat(e.target.value));
                                }}
                            />
                            {formState.errors?.experimental_conditions?.specie?.mole_fraction ? (
                                <FormHelperText
                                    sx={{
                                        color: "red",
                                    }}
                                >
                                    {
                                        formState.errors?.experimental_conditions?.specie?.mole_fraction
                                            ?.message
                                    }
                                </FormHelperText>
                            ) : null}
                        </FormControl>
                    )}
                />
            </Grid>
            {selected_fit_parameters?.mole_fraction && (
                <Grid xs={12} sm={12} md={12} xl={6}>
                    <BoundingRanges fitParameter="mole_fraction" />
                </Grid>
            )}
        </Grid>
    );
};
