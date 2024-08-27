import Switch from "@mui/joy/Switch";
import useFromStore from "../../store/form";

function UseNonEquilibriumCalculationsSwitch() {
  const { isNonEquilibrium, toggleIsNonEquilibrium } = useFromStore(); //zustand

  return (
    <Switch
      endDecorator="Use non-equilibrium calculations"
      data-testid="non-equilibrium-switch-testid"
      checked={isNonEquilibrium}
      onChange={(event) => toggleIsNonEquilibrium(event.target.checked)}
    />
  );
}

export default UseNonEquilibriumCalculationsSwitch;
