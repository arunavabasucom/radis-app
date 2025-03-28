import Option from "@mui/joy/Option";
import Select from "@mui/joy/Select";
import FormLabel from "@mui/joy/FormLabel";
import FormControl from "@mui/joy/FormControl";
import { Controller, useFormContext } from "react-hook-form";
import { Database as TDatabase } from "../types";

export interface DatabaseProps {
  updateFieldValue: (key: string, value: any) => void;
}

export const Database: React.FC<DatabaseProps> = ({updateFieldValue}) => {
  const { control } = useFormContext();
  return (
    <FormControl>
      <FormLabel>Database</FormLabel>
      <Controller
        name="database"
        defaultValue={TDatabase.HITRAN}
        control={control}
        render={({ field, formState }) => (
          <Select
            {...field}
            {...formState}
            onChange={(_, value) => {
              field.onChange(value);
              updateFieldValue("database", value);
            }}
            value={field.value}
          >
            <Option value={TDatabase.HITRAN}>HITRAN</Option>
            <Option value={TDatabase.GEISA}>GEISA</Option>
            <Option value={TDatabase.HITEMP}>HITEMP</Option>
          </Select>
        )}
      />
    </FormControl>
  );
};
