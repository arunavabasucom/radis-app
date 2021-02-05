import { Story, Meta } from "@storybook/react/types-6-0";
import { useArgs } from "@storybook/client-api";
import { MoleculeSelector, MoleculeSelectorProps } from "../MoleculeSelector";

export default {
  title: "Fields/MoleculeSelector",
  component: MoleculeSelector,
} as Meta;

const Template: Story<MoleculeSelectorProps> = (args) => {
  const [, updateArgs] = useArgs();
  const handleChange = (_: any, value: string | null) => {
    updateArgs({ molecule: value || "" });
  };
  return <MoleculeSelector {...args} handleChange={handleChange} />;
};

export const Primary = Template.bind({});
Primary.args = {
  moleculeOptions: ["H2O", "H2O2", "CO", "CO2", "COCl2", "CF4", "SF6"],
};
Primary.argTypes = {
  handleChange: { table: { disable: true } },
};

export const PreFilled = Template.bind({});
PreFilled.args = {
  ...Primary.args,
  molecule: "H2O",
};
PreFilled.argTypes = { ...Primary.argTypes };

export const ValidationError = Template.bind({});
ValidationError.args = {
  ...Primary.args,
  validationError: "It's no good",
};
ValidationError.argTypes = { ...Primary.argTypes };
