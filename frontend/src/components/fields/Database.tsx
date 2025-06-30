import React from "react";
import Option from "@mui/joy/Option";
import Select from "@mui/joy/Select";
import FormLabel from "@mui/joy/FormLabel";
import FormControl from "@mui/joy/FormControl";
import { Controller, useFormContext } from "react-hook-form";
import { Database as TDatabase } from "../types";
import useFromStore from "../../store/form";

export const Database: React.FC = () => {
  const { control } = useFormContext();
  const { formMode } = useFromStore();

  return (
    <FormControl>
      <FormLabel>Database</FormLabel>
      <Controller
        name={formMode === "calc" ? "database" : "experimental_conditions.database"}
        defaultValue={TDatabase.HITRAN}
        control={control}
        render={({ field, formState }) => (
          <Select
            {...field}
            {...formState}
            onChange={(_, value) => {
              field.onChange(value);
            }}
            value={field.value}
          >
            <Option value={TDatabase.HITRAN}>HITRAN</Option>
            <Option value={TDatabase.GEISA}>GEISA</Option>
            <Option value={TDatabase.HITEMP}>HITEMP</Option>
            <Option value={TDatabase.EXOMOL}>EXOMOL</Option>
            <Option value={TDatabase.NIST}>NIST</Option>
          </Select>
        )}
      />
    </FormControl>
  );
};
