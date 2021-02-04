import { Story, Meta } from "@storybook/react/types-6-0";
import { useState } from "react";
import { MoleculeSelector, MoleculeSelectorProps } from "..";

export default {
  title: "Fields/MoleculeSelector",
  component: MoleculeSelector,
} as Meta;

const Template: Story<MoleculeSelectorProps> = (args) => {
  const [molecule, setMolecule] = useState("CO2");
  const handleChange = (_: any, value: string | null) => {
    setMolecule(value || "");
  };
  return (
    <MoleculeSelector
      {...args}
      molecule={molecule}
      handleChange={handleChange}
    />
  );
};

export const Primary = Template.bind({});
Primary.args = {
  moleculeOptions: ["H2O", "H2O2", "CO", "CO2", "COCl2", "CF4", "SF6"],
};
// TODO: Can I set this at the template-level?
Primary.argTypes = {
  molecule: { table: { disable: true } },
  handleChange: { table: { disable: true } },
};
