import { create } from "zustand";

interface TFromState {
  isNonEquilibrium: boolean;
  toggleIsNonEquilibrium: (value: boolean) => void;
}
const useFromStore = create<TFromState>()((set) => ({
  isNonEquilibrium: false,
  toggleIsNonEquilibrium: (value: any) =>
    set((state) => ({
      isNonEquilibrium: !state.isNonEquilibrium,
    })),
}));

export default useFromStore;
