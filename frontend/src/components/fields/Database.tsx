import Option from "@mui/joy/Option";
import Select from "@mui/joy/Select";
import FormLabel from "@mui/joy/FormLabel";
import FormControl from "@mui/joy/FormControl";
import { Control, Controller } from "react-hook-form";
import { Database as TDatabase, FormValues } from "../types";

interface DatabaseProps {
  control: Control<FormValues>;
}

export const Database: React.FC<DatabaseProps> = ({ control }) => {
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
