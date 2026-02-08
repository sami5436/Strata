import { create } from "zustand";
import { persist } from "zustand/middleware";

// === TYPES ===

export type CompanyType = "producer" | "refiner" | "integrated" | "trader" | null;
export type NelsonComplexity = "simple" | "moderate" | "complex";
export type Benchmark = "WTI" | "Brent" | "Dubai" | "WCS";
export type CrudePreference = "light-sweet" | "medium" | "heavy-sour";
export type AlertChannel = "email" | "sms" | "slack";

// Production basin for location-aware pricing
export type ProductionBasin =
    | "permian_midland"
    | "permian_delaware"
    | "eagle_ford"
    | "bakken"
    | "dj_basin"
    | "gulf_coast"
    | "cushing";

// Derived crude classification
export type DensityClass = "Light" | "Medium" | "Heavy";
export type SulfurClass = "Sweet" | "Sour";

export interface CrudeClassification {
    density: DensityClass;
    sulfur: SulfurClass;
    label: string; // e.g., "Light Sweet Crude"
}

// Crude stream (multiple streams per company)
export interface CrudeStream {
    id: string;
    name: string;
    percentage: number; // 0-100
    apiGravity: number;
    sulfurContent: number;
    classification: CrudeClassification;
}

export interface SetupState {
    // Section 1: Company Profile
    companyName: string;
    companyType: CompanyType;

    // Section 2: Production Details
    dailyProduction: number;
    productionBasin: ProductionBasin; // Location for pricing
    crudeStreams: CrudeStream[]; // Multiple crude streams

    // Legacy single-value fields (computed from streams)
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

    // Derived (weighted average from streams)
    crudeClassification: CrudeClassification | null;
}

export interface SetupActions {
    // Setters
    setCompanyName: (name: string) => void;
    setCompanyType: (type: CompanyType) => void;
    setDailyProduction: (bpd: number) => void;
    setProductionBasin: (basin: ProductionBasin) => void;

    // Crude stream actions
    addCrudeStream: () => void;
    updateCrudeStream: (id: string, updates: Partial<Omit<CrudeStream, "id" | "classification">>) => void;
    removeCrudeStream: (id: string) => void;

    // Legacy (for backwards compatibility)
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

    // Computed helpers
    getTotalStreamPercentage: () => number;
    getWeightedApiGravity: () => number;
    getWeightedSulfurContent: () => number;
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

// Generate unique ID
function generateId(): string {
    return Math.random().toString(36).substring(2, 9);
}

// Create default stream
function createDefaultStream(name: string = "Stream 1"): CrudeStream {
    const api = 35;
    const sulfur = 0.3;
    return {
        id: generateId(),
        name,
        percentage: 100,
        apiGravity: api,
        sulfurContent: sulfur,
        classification: classifyCrude(api, sulfur),
    };
}

// === INITIAL STATE ===

const initialState: SetupState = {
    companyName: "",
    companyType: null,
    dailyProduction: 10000,
    productionBasin: "permian_midland",
    crudeStreams: [createDefaultStream("Stream 1")],
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

// Helper to recalculate weighted averages
function recalculateWeightedAverages(streams: CrudeStream[]) {
    if (streams.length === 0) {
        return { apiGravity: 35, sulfurContent: 0.3, classification: classifyCrude(35, 0.3) };
    }

    const totalPercent = streams.reduce((sum, s) => sum + s.percentage, 0);
    if (totalPercent === 0) {
        return { apiGravity: 35, sulfurContent: 0.3, classification: classifyCrude(35, 0.3) };
    }

    const weightedApi = streams.reduce((sum, s) => sum + (s.apiGravity * s.percentage), 0) / totalPercent;
    const weightedSulfur = streams.reduce((sum, s) => sum + (s.sulfurContent * s.percentage), 0) / totalPercent;

    return {
        apiGravity: parseFloat(weightedApi.toFixed(1)),
        sulfurContent: parseFloat(weightedSulfur.toFixed(2)),
        classification: classifyCrude(weightedApi, weightedSulfur),
    };
}

// === STORE ===

export const useSetupStore = create<SetupState & SetupActions>()(
    persist(
        (set, get) => ({
            ...initialState,

            setCompanyName: (name) => set({ companyName: name }),

            setCompanyType: (type) => set({ companyType: type }),

            setDailyProduction: (bpd) => set({ dailyProduction: bpd }),

            setProductionBasin: (basin) => set({ productionBasin: basin }),

            // === CRUDE STREAM ACTIONS ===

            addCrudeStream: () => {
                const streams = get().crudeStreams;
                if (streams.length >= 5) return; // Max 5 streams

                const totalPercent = streams.reduce((sum, s) => sum + s.percentage, 0);
                const remaining = Math.max(0, 100 - totalPercent);

                const newStream: CrudeStream = {
                    id: generateId(),
                    name: `Stream ${streams.length + 1}`,
                    percentage: remaining,
                    apiGravity: 35,
                    sulfurContent: 0.3,
                    classification: classifyCrude(35, 0.3),
                };

                const newStreams = [...streams, newStream];
                const weighted = recalculateWeightedAverages(newStreams);

                set({
                    crudeStreams: newStreams,
                    apiGravity: weighted.apiGravity,
                    sulfurContent: weighted.sulfurContent,
                    crudeClassification: weighted.classification,
                });
            },

            updateCrudeStream: (id, updates) => {
                const streams = get().crudeStreams.map((stream) => {
                    if (stream.id !== id) return stream;

                    const updated = { ...stream, ...updates };
                    // Recalculate classification for this stream
                    updated.classification = classifyCrude(updated.apiGravity, updated.sulfurContent);
                    return updated;
                });

                const weighted = recalculateWeightedAverages(streams);

                set({
                    crudeStreams: streams,
                    apiGravity: weighted.apiGravity,
                    sulfurContent: weighted.sulfurContent,
                    crudeClassification: weighted.classification,
                });
            },

            removeCrudeStream: (id) => {
                const streams = get().crudeStreams.filter((s) => s.id !== id);

                // If no streams left, add a default one
                if (streams.length === 0) {
                    streams.push(createDefaultStream("Stream 1"));
                }

                const weighted = recalculateWeightedAverages(streams);

                set({
                    crudeStreams: streams,
                    apiGravity: weighted.apiGravity,
                    sulfurContent: weighted.sulfurContent,
                    crudeClassification: weighted.classification,
                });
            },

            // Legacy setters (update first stream for backwards compatibility)
            setApiGravity: (api) => {
                const streams = get().crudeStreams;
                if (streams.length > 0) {
                    get().updateCrudeStream(streams[0].id, { apiGravity: api });
                }
            },

            setSulfurContent: (sulfur) => {
                const streams = get().crudeStreams;
                if (streams.length > 0) {
                    get().updateCrudeStream(streams[0].id, { sulfurContent: sulfur });
                }
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

                    // Validate stream percentages sum to 100
                    const totalPercent = state.crudeStreams.reduce((sum, s) => sum + s.percentage, 0);
                    if (totalPercent !== 100) {
                        errors.crudeStreams = `Stream percentages must total 100% (currently ${totalPercent}%)`;
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

            // Computed helpers
            getTotalStreamPercentage: () => {
                return get().crudeStreams.reduce((sum, s) => sum + s.percentage, 0);
            },

            getWeightedApiGravity: () => get().apiGravity,

            getWeightedSulfurContent: () => get().sulfurContent,
        }),
        {
            name: "strata-setup",
        }
    )
);
