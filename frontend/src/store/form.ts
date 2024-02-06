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
}

interface TFromActions {
  toggleIsNonEquilibrium: (value: boolean) => void; // to show the trot and tvib fields
  toggleshowNonEquilibriumSwitch: (value: boolean) => void; // to show the  equilibrium switch
  setUseSlit: (value: boolean) => void; // to show slit input
  setUseSimulateSlitFunction: (value: boolean) => void; // to show the slit switch
  setSimulateSlitUnit: (value: boolean) => void; // change the unit according to the wavelength unit selected
  setDisableDownloadButton: (value: boolean) => void;
  setDisableAddToPlotButton: (value: boolean) => void;
}

const useFromStore = create<TFromState & TFromActions>()(
  devtools((set) => ({
    isNonEquilibrium: false,
    showNonEquilibriumSwitch: false,
    useSlit: false,
    useSimulateSlitFunction: false,
    simulateSlitUnit: false,
    disableDownloadButton: true,
    disableAddToPlotButton: true,
    toggleIsNonEquilibrium: (value: boolean) =>
      set((_) => ({
        isNonEquilibrium: value,
      })),

    toggleshowNonEquilibriumSwitch: (value: boolean) =>
      set((_) => ({
        showNonEquilibriumSwitch: value,
      })),

    setUseSlit: (value: boolean) =>
      set((_) => ({
        useSlit: value,
      })),
    setUseSimulateSlitFunction: (value: boolean) =>
      set((_) => ({
        useSimulateSlitFunction: value,
      })),
    setSimulateSlitUnit: (value: boolean) =>
      set((_) => ({
        simulateSlitUnit: value,
      })),
    setDisableDownloadButton: (value: boolean) =>
      set((_) => ({
        disableDownloadButton: value,
      })),
    setDisableAddToPlotButton: (value: boolean) =>
      set((_) => ({
        disableAddToPlotButton: value,
      })),
  }))
);

export default useFromStore;
