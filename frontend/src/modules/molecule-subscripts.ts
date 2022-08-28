const subscripts = "₁₂₃₄₅₆₇₈₉".split("");

export const addSubscriptsToMolecule = (molecule: string): string => {
  return molecule
    .split("")
    .map((char) => (/^\d+$/.test(char) ? subscripts[parseInt(char) - 1] : char))
    .join("");
};

export const removeSubscriptsFromMolecule = (molecule: string): string => {
  return molecule
    .split("")
    .map((char) =>
      subscripts.includes(char)
        ? (subscripts.indexOf(char) + 1).toString()
        : char
    )
    .join("");
};
