import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface TFromState {
  isNonEquilibrium: boolean; // trot tvib inputs
  showNonEquilibriumSwitch: boolean; // equilibrium switch
  useSlit: boolean; // slit input
  useSimulateSlitFunction: boolean; // slit switch
  simulateSlitUnit: boolean; // slit unit
  disableDownloadButton: boolean; // disableDownloadButton
  disableAddToPlotButton: boolean;
  formMode: "calc" | "fit"
  localBackend: boolean;
}

interface TFromActions {
  toggleIsNonEquilibrium: (value: boolean) => void; // to show the trot and tvib fields
  toggleshowNonEquilibriumSwitch: (value: boolean) => void; // to show the  equilibrium switch
  setUseSlit: (value: boolean) => void; // to show slit input
  setUseSimulateSlitFunction: (value: boolean) => void; // to show the slit switch
  setSimulateSlitUnit: (value: boolean) => void; // change the unit according to the wavelength unit selected
  setDisableDownloadButton: (value: boolean) => void;
  setDisableAddToPlotButton: (value: boolean) => void;

  setFormMode: (mode: "calc" | "fit") => void;
  resetFormState: () => void;
  setLocalBackend: (value: boolean) => void;

}

const initialState = {
  isNonEquilibrium: false,
  showNonEquilibriumSwitch: false,
  useSlit: false,
  useSimulateSlitFunction: false,
  simulateSlitUnit: false,
  disableDownloadButton: true,
  disableAddToPlotButton: true,
  formMode: "calc" as "calc" | "fit",
};

const useFromStore = create<TFromState & TFromActions>()(
  devtools((set) => ({

    ...initialState,
    isNonEquilibrium: false,
    showNonEquilibriumSwitch: false,
    useSlit: false,
    useSimulateSlitFunction: false,
    simulateSlitUnit: false,
    disableDownloadButton: true,
    disableAddToPlotButton: true,
    localBackend: false,
    toggleIsNonEquilibrium: (value: boolean) =>
      set(() => ({
        isNonEquilibrium: value,
      })),

    toggleshowNonEquilibriumSwitch: (value: boolean) =>
      set(() => ({
        showNonEquilibriumSwitch: value,
      })),

    setUseSlit: (value: boolean) =>
      set(() => ({
        useSlit: value,
      })),
    setUseSimulateSlitFunction: (value: boolean) =>
      set(() => ({
        useSimulateSlitFunction: value,
      })),
    setSimulateSlitUnit: (value: boolean) =>
      set(() => ({
        simulateSlitUnit: value,
      })),
    setDisableDownloadButton: (value: boolean) =>
      set(() => ({
        disableDownloadButton: value,
      })),
    setDisableAddToPlotButton: (value: boolean) =>
      set(() => ({
        disableAddToPlotButton: value,
      })),

    setFormMode: (mode: "calc" | "fit") =>
      set(() => ({
        formMode: mode,
      })),
    resetFormState: () => set(() => ({ ...initialState })),

    setLocalBackend: (value: boolean) =>
      set(() => ({
        localBackend: value,
      })),

  }))
);

export default useFromStore;
