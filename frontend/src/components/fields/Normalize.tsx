import React from "react";
import Checkbox from "@mui/joy/Checkbox";
import FormControl from "@mui/joy/FormControl";
import FormHelperText from "@mui/joy/FormHelperText";
import { Controller, useFormContext } from "react-hook-form";
import FormLabel from "@mui/joy/FormLabel";

export const Normalize: React.FC = () => {
    const { control } = useFormContext();
    return (
        <Controller
            name="fit_properties.normalize"
            control={control}
            defaultValue={false}
            render={({ field, fieldState }) => (
                <FormControl
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                    }}
                >
                    <FormLabel>Normalize</FormLabel>
                    <Checkbox
                        {...field}
                        id="normalize-input"
                        data-testid="normalize-testid"
                        onChange={field.onChange}
                        value={field.value}
                    />
                    {fieldState.error ? (
                        <FormHelperText
                            sx={{
                                color: "red",
                            }}
                        >
                            {fieldState.error.message}
                        </FormHelperText>
                    ) : null}
                </FormControl>
            )}
        />
    );
};
