import React from "react";
import Input from "@mui/joy/Input";
import FormControl from "@mui/joy/FormControl";
import FormHelperText from "@mui/joy/FormHelperText";
import { Controller, useFormContext } from "react-hook-form";
import FormLabel from "@mui/joy/FormLabel";

export const MaxLoops: React.FC = () => {
    const { control } = useFormContext();
    return (
        <Controller
            name="fit_properties.max_loops"
            control={control}
            defaultValue={200}
            render={({ field, fieldState }) => (
                <FormControl>
                    <FormLabel>Max Loops</FormLabel>
                    <Input
                        {...field}
                        id="max-loops-input"
                        data-testid="max-loops-testid"
                        type="number"
                        onChange={field.onChange}
                        value={field.value}
                        error={!!fieldState.error}
                        onKeyPress={(event: React.KeyboardEvent<HTMLInputElement>) => {
                            if (event?.key === "-" || event?.key === "+") {
                                event.preventDefault();
                            }
                        }}
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
