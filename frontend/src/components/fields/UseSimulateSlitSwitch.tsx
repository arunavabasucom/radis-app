import { Switch } from "@mui/joy";
import {  Controller, useFormContext } from "react-hook-form";
import useFromStore from "../../store/form";

function UseSimulateSlitSwitch() {
  const { useSlit, setUseSlit } = useFromStore(); 
  const { control, setValue } = useFormContext();

  return (
    <Controller
      name="use_simulate_slit"
      defaultValue={false}
      control={control}
      render={({ field }) => (
        <Switch
          endDecorator="Apply Instrumental Slit Function"
          data-testid="slit-switch-testid"
          checked={useSlit}
          onChange={(event: any) => {
            console.log(event.target.checked);
            setUseSlit(event.target.checked);
            field.onChange(event.target.checked);
            if (event.target.checked) {
              setValue("simulate_slit", 5);
            } else {
              setValue("simulate_slit", undefined);
            }
          }}
        />
      )}
    />
  );
}

export default UseSimulateSlitSwitch;
