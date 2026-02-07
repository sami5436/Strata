import { create } from "zustand";
import { persist } from "zustand/middleware";

// === TYPES ===

export type CompanyType = "producer" | "refiner" | "integrated" | "trader" | null;
export type NelsonComplexity = "simple" | "moderate" | "complex";
export type Benchmark = "WTI" | "Brent" | "Dubai" | "WCS";
export type CrudePreference = "light-sweet" | "medium" | "heavy-sour";
export type AlertChannel = "email" | "sms" | "slack";

// Derived crude classification
export type DensityClass = "Light" | "Medium" | "Heavy";
export type SulfurClass = "Sweet" | "Sour";

export interface CrudeClassification {
    density: DensityClass;
    sulfur: SulfurClass;
    label: string; // e.g., "Light Sweet Crude"
}

export interface SetupState {
    // Section 1: Company Profile
    companyName: string;
    companyType: CompanyType;

    // Section 2: Production Details
    dailyProduction: number;
    apiGravity: number;
    sulfurContent: number;

    // Section 3: Refining Capabilities
    refiningCapacity: number;
    nelsonComplexity: NelsonComplexity;
    crudePreferences: CrudePreference[];

    // Section 4: Market Settings
    primaryBenchmark: Benchmark;
    qualityDifferential: string;
    storageCapacity: number;
    alertChannels: AlertChannel[];

    // Validation
    errors: Record<string, string>;

    // Derived
    crudeClassification: CrudeClassification | null;
}

export interface SetupActions {
    // Setters
    setCompanyName: (name: string) => void;
    setCompanyType: (type: CompanyType) => void;
    setDailyProduction: (bpd: number) => void;
    setApiGravity: (api: number) => void;
    setSulfurContent: (sulfur: number) => void;
    setRefiningCapacity: (bpd: number) => void;
    setNelsonComplexity: (complexity: NelsonComplexity) => void;
    toggleCrudePreference: (pref: CrudePreference) => void;
    setPrimaryBenchmark: (benchmark: Benchmark) => void;
    setQualityDifferential: (diff: string) => void;
    setStorageCapacity: (capacity: number) => void;
    toggleAlertChannel: (channel: AlertChannel) => void;

    // Validation
    validate: () => boolean;
    clearErrors: () => void;

    // Reset
    reset: () => void;
}

// === CLASSIFICATION LOGIC ===

export function classifyCrude(apiGravity: number, sulfurContent: number): CrudeClassification {
    // API Gravity classification
    let density: DensityClass;
    if (apiGravity < 22) {
        density = "Heavy";
    } else if (apiGravity <= 31) {
        density = "Medium";
    } else {
        density = "Light";
    }

    // Sulfur classification
    const sulfur: SulfurClass = sulfurContent < 0.5 ? "Sweet" : "Sour";

    return {
        density,
        sulfur,
        label: `${density} ${sulfur} Crude`,
    };
}

// === INITIAL STATE ===

const initialState: SetupState = {
    companyName: "",
    companyType: null,
    dailyProduction: 10000,
    apiGravity: 35,
    sulfurContent: 0.3,
    refiningCapacity: 50000,
    nelsonComplexity: "moderate",
    crudePreferences: ["light-sweet"],
    primaryBenchmark: "WTI",
    qualityDifferential: "",
    storageCapacity: 0,
    alertChannels: ["email"],
    errors: {},
    crudeClassification: classifyCrude(35, 0.3),
};

// === STORE ===

export const useSetupStore = create<SetupState & SetupActions>()(
    persist(
        (set, get) => ({
            ...initialState,

            setCompanyName: (name) => set({ companyName: name }),

            setCompanyType: (type) => set({ companyType: type }),

            setDailyProduction: (bpd) => set({ dailyProduction: bpd }),

            setApiGravity: (api) => {
                const sulfur = get().sulfurContent;
                set({
                    apiGravity: api,
                    crudeClassification: classifyCrude(api, sulfur),
                });
            },

            setSulfurContent: (sulfur) => {
                const api = get().apiGravity;
                set({
                    sulfurContent: sulfur,
                    crudeClassification: classifyCrude(api, sulfur),
                });
            },

            setRefiningCapacity: (bpd) => set({ refiningCapacity: bpd }),

            setNelsonComplexity: (complexity) => set({ nelsonComplexity: complexity }),

            toggleCrudePreference: (pref) => {
                const current = get().crudePreferences;
                if (current.includes(pref)) {
                    set({ crudePreferences: current.filter((p) => p !== pref) });
                } else {
                    set({ crudePreferences: [...current, pref] });
                }
            },

            setPrimaryBenchmark: (benchmark) => set({ primaryBenchmark: benchmark }),

            setQualityDifferential: (diff) => set({ qualityDifferential: diff }),

            setStorageCapacity: (capacity) => set({ storageCapacity: capacity }),

            toggleAlertChannel: (channel) => {
                const current = get().alertChannels;
                if (current.includes(channel)) {
                    set({ alertChannels: current.filter((c) => c !== channel) });
                } else {
                    set({ alertChannels: [...current, channel] });
                }
            },

            validate: () => {
                const state = get();
                const errors: Record<string, string> = {};

                // Required: Company name
                if (!state.companyName.trim()) {
                    errors.companyName = "Company name is required";
                }

                // Required: Company type
                if (!state.companyType) {
                    errors.companyType = "Select a company type";
                }

                // Production details required for Producer/Integrated
                if (state.companyType === "producer" || state.companyType === "integrated") {
                    if (state.dailyProduction <= 0) {
                        errors.dailyProduction = "Enter daily production volume";
                    }
                }

                // Refining details required for Refiner/Integrated
                if (state.companyType === "refiner" || state.companyType === "integrated") {
                    if (state.refiningCapacity <= 0) {
                        errors.refiningCapacity = "Enter refining capacity";
                    }
                    if (state.crudePreferences.length === 0) {
                        errors.crudePreferences = "Select at least one crude type";
                    }
                }

                set({ errors });
                return Object.keys(errors).length === 0;
            },

            clearErrors: () => set({ errors: {} }),

            reset: () => set(initialState),
        }),
        {
            name: "strata-setup",
        }
    )
);
