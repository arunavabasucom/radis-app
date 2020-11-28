const subscripts = "₁₂₃₄₅₆₇₈₉".split("");

const addSubscriptsToMolecule = (molecule: string): string => {
  return molecule
    .split("")
    .map((char) => (/^\d+$/.test(char) ? subscripts[parseInt(char) - 1] : char))
    .join("");
};

const removeSubscriptsFromMolecule = (molecule: string): string => {
  return molecule
    .split("")
    .map((char) =>
      subscripts.includes(char)
        ? (subscripts.indexOf(char) + 1).toString()
        : char
    )
    .join("");
};

export { addSubscriptsToMolecule, removeSubscriptsFromMolecule };
