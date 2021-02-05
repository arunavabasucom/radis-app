import { Story, Meta } from "@storybook/react/types-6-0";
import { Species, SpeciesProps } from "../Species";

export default {
  title: "Fields/Species",
  component: Species,
} as Meta;

const Template: Story<SpeciesProps> = (args) => <Species {...args} />;

export const Primary = Template.bind({});
Primary.args = {
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
  setParams: (_: any) => undefined, // Stub
  validationErrors: { molecule: [], mole_fraction: [] },
  moleculeOptions: ["H2O", "H2O2", "CO", "CO2", "COCl2", "CF4", "SF6"],
};
Primary.argTypes = {
  setParams: { table: { disable: true } },
};
