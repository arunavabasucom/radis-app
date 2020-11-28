const SUBSCRIPTS = "₁₂₃₄₅₆₇₈₉".split("");

const addSubscriptsToMolecule = (molecule: string): string => {
  return molecule
    .split("")
    .map((char) => (/^\d+$/.test(char) ? SUBSCRIPTS[parseInt(char) - 1] : char))
    .join("");
};

const removeSubscriptsFromMolecule = (molecule: string): string => {
  return molecule
    .split("")
    .map((char) =>
      SUBSCRIPTS.includes(char)
        ? (SUBSCRIPTS.indexOf(char) + 1).toString()
        : char
    )
    .join("");
};

export { addSubscriptsToMolecule, removeSubscriptsFromMolecule };
