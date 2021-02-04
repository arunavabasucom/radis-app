import { Story, Meta } from "@storybook/react/types-6-0";
import { MoleculeSelector, MoleculeSelectorProps } from "..";

export default {
  title: "Fields/MoleculeSelector",
  component: MoleculeSelector,
} as Meta;

const Template: Story<MoleculeSelectorProps> = (args) => (
  <MoleculeSelector {...args} />
);

export const Primary = Template.bind({});

Primary.args = {
  index: 0,
  params: {
    species: [{ molecule: "CO", mole_fraction: 0.1 }],
    min_wavenumber_range: 1000,
    max_wavenumber_range: 3000,
    tgas: 400,
    tvib: null,
    trot: null,
    pressure: 1.01325,
    path_length: 1,
    simulate_slit: false,
  },
  setParams: (_) => null,
  moleculeValidationErrors: [],
  moleculeOptions: ["H2O", "H2O2", "CO", "CO2", "COCl2", "CF4", "SF6"],
};
