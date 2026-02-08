"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout";
import {
    Button,
    Card,
    TextInput,
    NumberInput,
    Select,
    Checkbox,
    CheckboxGroup,
    Slider,
    SelectionCard,
    Badge,
} from "@/components/ui";
import {
    useSetupStore,
    CompanyType,
    NelsonComplexity,
    Benchmark,
    CrudeStream,
} from "@/lib/store";

type DataSource = "manual" | "weatherford" | "scada" | "enverus";

/**
 * Setup Page - Company Profile Configuration
 * Responsive: Mobile-first with adaptive layouts
 */
export default function SetupPage() {
    const router = useRouter();
    const store = useSetupStore();
    const [dataSource, setDataSource] = useState<DataSource | null>(null);
    const [currentStep, setCurrentStep] = useState(1);

    // Determine which sections are needed
    const showProduction = store.companyType === "producer" || store.companyType === "integrated";
    const showRefining = store.companyType === "refiner" || store.companyType === "integrated";

    // Calculate total steps
    const needsDataSource = showProduction || showRefining;
    const totalSteps = 1 + (needsDataSource ? 1 : 0) + (showProduction ? 1 : 0) + (showRefining ? 1 : 0) + 1;

    // Stream percentage validation
    const totalStreamPercent = store.getTotalStreamPercentage();
    const streamsValid = totalStreamPercent === 100;

    // Can proceed checks for each step
    const canProceedStep1 = !!(store.companyName && store.companyType);
    const canProceedStep2 = dataSource === "manual";
    const canProceedStep3 = store.dailyProduction > 0 && streamsValid;
    const canProceedStep4 = store.refiningCapacity > 0;

    const handleNext = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = () => {
        if (store.validate()) {
            console.log("=== STRATA SETUP COMPLETE ===");
            router.push("/dashboard");
        }
    };

    const companyTypes: { type: CompanyType; title: string; description: string }[] = [
        { type: "producer", title: "Producer", description: "We produce crude oil" },
        { type: "refiner", title: "Refiner", description: "We buy crude and refine it" },
        { type: "integrated", title: "Integrated", description: "We do both" },
        { type: "trader", title: "Trader", description: "We trade without assets" },
    ];

    const complexityOptions = [
        { value: "simple", label: "Simple (1-5): Basic processing" },
        { value: "moderate", label: "Moderate (6-9): Can handle some heavy oil" },
        { value: "complex", label: "Complex (10+): Can process anything" },
    ];

    const benchmarkOptions = [
        { value: "WTI", label: "WTI (West Texas Intermediate)" },
        { value: "Brent", label: "Brent (North Sea)" },
        { value: "Dubai", label: "Dubai (Middle East)" },
        { value: "WCS", label: "WCS (Western Canadian Select)" },
    ];

    // Map current step to actual section
    const getStepContent = () => {
        const stepIndex = currentStep;

        // Step 1: Company Profile
        if (stepIndex === 1) return "company";

        // Step 2: Data Source (only if producer/refiner/integrated)
        if (needsDataSource && stepIndex === 2) return "datasource";
        if (!needsDataSource && stepIndex === 2) return "market";

        // Adjust for conditional steps
        let offset = needsDataSource ? 2 : 1;

        if (showProduction && stepIndex === offset + 1) return "production";
        if (showProduction) offset++;

        if (showRefining && stepIndex === offset + 1) return "refining";
        if (showRefining) offset++;

        if (stepIndex === offset + 1) return "market";

        return "company";
    };

    const section = getStepContent();

    return (
        <MainLayout>
            {/* Page Header */}
            <div className="mb-4 md:mb-6">
                <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-tight mb-1">
                    Company Setup
                </h1>
                <p className="text-concrete-gray uppercase tracking-wider text-xs md:text-sm">
                    Step {currentStep} of {totalSteps} — Configure your trading profile
                </p>
            </div>

            <div className="max-w-4xl">
                {/* ===== COMPANY PROFILE ===== */}
                {section === "company" && (
                    <Card padding="lg">
                        <h2 className="text-xl md:text-2xl font-bold uppercase tracking-tight mb-3 md:mb-4 border-b-2 border-black pb-2">
                            Company Profile
                        </h2>

                        <div className="space-y-4">
                            <TextInput
                                label="Company Name"
                                value={store.companyName}
                                onChange={(e) => store.setCompanyName(e.target.value)}
                                placeholder="Enter company name"
                                error={store.errors.companyName}
                            />

                            <div>
                                <span className="text-xs font-semibold uppercase tracking-widest text-concrete-gray block mb-2">
                                    Company Type
                                </span>
                                {store.errors.companyType && (
                                    <span className="text-xs text-safety-red mb-2 block">{store.errors.companyType}</span>
                                )}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                                    {companyTypes.map((item) => (
                                        <SelectionCard
                                            key={item.type}
                                            title={item.title}
                                            description={item.description}
                                            selected={store.companyType === item.type}
                                            onSelect={() => store.setCompanyType(item.type)}
                                            error={!!store.errors.companyType}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 md:gap-4 pt-4 md:pt-6 mt-4 md:mt-6 border-t-2 border-black">
                            <Button
                                variant="primary"
                                size="lg"
                                onClick={handleNext}
                                disabled={!canProceedStep1}
                                className="w-full sm:w-auto"
                            >
                                Next →
                            </Button>
                        </div>
                    </Card>
                )}

                {/* ===== DATA SOURCE ===== */}
                {section === "datasource" && (
                    <Card padding="lg">
                        <h2 className="text-xl md:text-2xl font-bold uppercase tracking-tight mb-3 md:mb-4 border-b-2 border-black pb-2">
                            Data Source
                        </h2>
                        <p className="text-concrete-gray text-xs md:text-sm mb-4">
                            Connect your production data or enter manually
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3 mb-4">
                            <button
                                onClick={() => {/* placeholder */ }}
                                className="p-3 md:p-4 border-2 border-gray-300 hover:border-black text-left opacity-50 cursor-not-allowed"
                                disabled
                            >
                                <p className="font-bold uppercase text-xs md:text-sm">Weatherford</p>
                                <p className="text-xs text-concrete-gray">Production Optimization</p>
                                <span className="text-[10px] uppercase tracking-wider text-concrete-gray mt-2 block">Coming Soon</span>
                            </button>
                            <button
                                onClick={() => {/* placeholder */ }}
                                className="p-3 md:p-4 border-2 border-gray-300 hover:border-black text-left opacity-50 cursor-not-allowed"
                                disabled
                            >
                                <p className="font-bold uppercase text-xs md:text-sm">SCADA System</p>
                                <p className="text-xs text-concrete-gray">Real-time Field Data</p>
                                <span className="text-[10px] uppercase tracking-wider text-concrete-gray mt-2 block">Coming Soon</span>
                            </button>
                            <button
                                onClick={() => {/* placeholder */ }}
                                className="p-3 md:p-4 border-2 border-gray-300 hover:border-black text-left opacity-50 cursor-not-allowed"
                                disabled
                            >
                                <p className="font-bold uppercase text-xs md:text-sm">Enverus</p>
                                <p className="text-xs text-concrete-gray">Production Analytics</p>
                                <span className="text-[10px] uppercase tracking-wider text-concrete-gray mt-2 block">Coming Soon</span>
                            </button>
                            <button
                                onClick={() => {/* placeholder */ }}
                                className="p-3 md:p-4 border-2 border-gray-300 hover:border-black text-left opacity-50 cursor-not-allowed"
                                disabled
                            >
                                <p className="font-bold uppercase text-xs md:text-sm">OFS Portal</p>
                                <p className="text-xs text-concrete-gray">Oilfield Services Data</p>
                                <span className="text-[10px] uppercase tracking-wider text-concrete-gray mt-2 block">Coming Soon</span>
                            </button>
                        </div>

                        <Button
                            variant={dataSource === "manual" ? "primary" : "secondary"}
                            size="lg"
                            className="w-full mb-4 md:mb-6"
                            onClick={() => setDataSource("manual")}
                        >
                            {dataSource === "manual" ? "✓ Manual Entry Selected" : "Enter Data Manually"}
                        </Button>

                        <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 md:gap-4 pt-4 md:pt-6 border-t-2 border-black">
                            <Button variant="secondary" size="lg" onClick={handlePrevious} className="w-full sm:w-auto">
                                ← Previous
                            </Button>
                            <Button
                                variant="primary"
                                size="lg"
                                onClick={handleNext}
                                disabled={!canProceedStep2}
                                className="w-full sm:w-auto"
                            >
                                Next →
                            </Button>
                        </div>
                    </Card>
                )}

                {/* ===== PRODUCTION DETAILS ===== */}
                {section === "production" && (
                    <Card padding="lg">
                        <h2 className="text-xl md:text-2xl font-bold uppercase tracking-tight mb-3 md:mb-4 border-b-2 border-black pb-2">
                            Production Details
                        </h2>

                        <div className="space-y-4 md:space-y-6">
                            <NumberInput
                                label="Total Daily Production Rate"
                                value={store.dailyProduction}
                                onChange={store.setDailyProduction}
                                unit="BPD"
                                min={0}
                                error={store.errors.dailyProduction}
                            />

                            {/* Crude Streams Section */}
                            <div>
                                <div className="flex justify-between items-center mb-2 md:mb-3">
                                    <span className="text-xs font-semibold uppercase tracking-widest text-concrete-gray">
                                        Crude Streams
                                    </span>
                                    <span className={`text-xs font-mono ${streamsValid ? "text-forest-green" : "text-signal-amber"}`}>
                                        {totalStreamPercent}% / 100%
                                    </span>
                                </div>

                                {/* Stream List */}
                                <div className="space-y-3 md:space-y-4">
                                    {store.crudeStreams.map((stream, index) => (
                                        <CrudeStreamRow
                                            key={stream.id}
                                            stream={stream}
                                            index={index}
                                            canDelete={store.crudeStreams.length > 1}
                                            onUpdate={(updates) => store.updateCrudeStream(stream.id, updates)}
                                            onDelete={() => store.removeCrudeStream(stream.id)}
                                        />
                                    ))}
                                </div>

                                {/* Add Stream Button */}
                                {store.crudeStreams.length < 5 && totalStreamPercent < 100 && (
                                    <Button
                                        variant="secondary"
                                        size="md"
                                        className="w-full mt-3 md:mt-4"
                                        onClick={store.addCrudeStream}
                                    >
                                        + Add Crude Stream ({100 - totalStreamPercent}% remaining)
                                    </Button>
                                )}

                                {!streamsValid && (
                                    <p className="text-xs md:text-sm text-signal-amber mt-2">
                                        ⚠ Adjust percentages to total 100%
                                    </p>
                                )}
                            </div>

                            {/* Blended Classification Display */}
                            {store.crudeClassification && (
                                <div className="border-2 border-forest-green bg-forest-green/5 p-3 md:p-4">
                                    <span className="text-xs font-semibold uppercase tracking-widest text-concrete-gray block mb-1">
                                        Blended Crude Classification (Weighted Average)
                                    </span>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                                        <span className="font-mono font-bold text-xl md:text-2xl text-forest-green">
                                            {store.crudeClassification.label}
                                        </span>
                                        <div className="flex gap-2">
                                            <Badge variant={store.crudeClassification.density === "Light" ? "light" : store.crudeClassification.density === "Heavy" ? "heavy" : "default"}>
                                                {store.crudeClassification.density}
                                            </Badge>
                                            <Badge variant={store.crudeClassification.sulfur === "Sweet" ? "sweet" : "sour"}>
                                                {store.crudeClassification.sulfur}
                                            </Badge>
                                        </div>
                                    </div>
                                    <p className="text-xs md:text-sm text-concrete-gray mt-1 font-mono">
                                        Weighted Avg: API {store.apiGravity}°, Sulfur {store.sulfurContent.toFixed(2)}%
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 md:gap-4 pt-4 md:pt-6 mt-4 md:mt-6 border-t-2 border-black">
                            <Button variant="secondary" size="lg" onClick={handlePrevious} className="w-full sm:w-auto">
                                ← Previous
                            </Button>
                            <Button
                                variant="primary"
                                size="lg"
                                onClick={handleNext}
                                disabled={!canProceedStep3}
                                className="w-full sm:w-auto"
                            >
                                Next →
                            </Button>
                        </div>
                    </Card>
                )}

                {/* ===== REFINING CAPABILITIES ===== */}
                {section === "refining" && (
                    <Card padding="lg">
                        <h2 className="text-xl md:text-2xl font-bold uppercase tracking-tight mb-3 md:mb-4 border-b-2 border-black pb-2">
                            Refining Capabilities
                        </h2>

                        <div className="space-y-4">
                            <NumberInput
                                label="Daily Refining Capacity"
                                value={store.refiningCapacity}
                                onChange={store.setRefiningCapacity}
                                unit="BPD"
                                min={0}
                                error={store.errors.refiningCapacity}
                            />

                            <Select
                                label="Nelson Complexity Index"
                                value={store.nelsonComplexity}
                                onChange={(v) => store.setNelsonComplexity(v as NelsonComplexity)}
                                options={complexityOptions}
                            />

                            <CheckboxGroup
                                label="Preferred Crude Types"
                                error={store.errors.crudePreferences}
                            >
                                <Checkbox
                                    label="Light Sweet"
                                    checked={store.crudePreferences.includes("light-sweet")}
                                    onChange={() => store.toggleCrudePreference("light-sweet")}
                                />
                                <Checkbox
                                    label="Medium"
                                    checked={store.crudePreferences.includes("medium")}
                                    onChange={() => store.toggleCrudePreference("medium")}
                                />
                                <Checkbox
                                    label="Heavy Sour"
                                    checked={store.crudePreferences.includes("heavy-sour")}
                                    onChange={() => store.toggleCrudePreference("heavy-sour")}
                                />
                            </CheckboxGroup>
                        </div>

                        <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 md:gap-4 pt-4 md:pt-6 mt-4 md:mt-6 border-t-2 border-black">
                            <Button variant="secondary" size="lg" onClick={handlePrevious} className="w-full sm:w-auto">
                                ← Previous
                            </Button>
                            <Button
                                variant="primary"
                                size="lg"
                                onClick={handleNext}
                                disabled={!canProceedStep4}
                                className="w-full sm:w-auto"
                            >
                                Next →
                            </Button>
                        </div>
                    </Card>
                )}

                {/* ===== MARKET SETTINGS ===== */}
                {section === "market" && (
                    <Card padding="lg">
                        <h2 className="text-xl md:text-2xl font-bold uppercase tracking-tight mb-3 md:mb-4 border-b-2 border-black pb-2">
                            Market Settings
                        </h2>

                        <div className="space-y-4">
                            <Select
                                label="Primary Benchmark"
                                value={store.primaryBenchmark}
                                onChange={(v) => store.setPrimaryBenchmark(v as Benchmark)}
                                options={benchmarkOptions}
                            />

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                                <TextInput
                                    label="Known Quality Differential (Optional)"
                                    value={store.qualityDifferential}
                                    onChange={(e) => store.setQualityDifferential(e.target.value)}
                                    placeholder="+$2.50/bbl"
                                />

                                <NumberInput
                                    label="Storage Capacity (Optional)"
                                    value={store.storageCapacity}
                                    onChange={store.setStorageCapacity}
                                    unit="BBL"
                                    min={0}
                                />
                            </div>

                            <CheckboxGroup label="Alert Preferences">
                                <Checkbox
                                    label="Email"
                                    checked={store.alertChannels.includes("email")}
                                    onChange={() => store.toggleAlertChannel("email")}
                                />
                                <Checkbox
                                    label="SMS"
                                    checked={store.alertChannels.includes("sms")}
                                    onChange={() => store.toggleAlertChannel("sms")}
                                />
                                <Checkbox
                                    label="Slack"
                                    checked={store.alertChannels.includes("slack")}
                                    onChange={() => store.toggleAlertChannel("slack")}
                                />
                            </CheckboxGroup>
                        </div>

                        <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 md:gap-4 pt-4 md:pt-6 mt-4 md:mt-6 border-t-2 border-black">
                            <Button variant="secondary" size="lg" onClick={handlePrevious} className="w-full sm:w-auto">
                                ← Previous
                            </Button>
                            <Button variant="primary" size="lg" onClick={handleSubmit} className="w-full sm:w-auto">
                                Complete Setup →
                            </Button>
                        </div>
                    </Card>
                )}
            </div>
        </MainLayout>
    );
}

/**
 * Crude Stream Row Component - Responsive
 */
function CrudeStreamRow({
    stream,
    index,
    canDelete,
    onUpdate,
    onDelete,
}: {
    stream: CrudeStream;
    index: number;
    canDelete: boolean;
    onUpdate: (updates: Partial<Omit<CrudeStream, "id" | "classification">>) => void;
    onDelete: () => void;
}) {
    return (
        <div className="border-2 border-black p-3 md:p-4 space-y-3 md:space-y-4">
            <div className="flex justify-between items-start gap-2">
                <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
                    <span className="bg-black text-white text-xs font-bold px-2 py-1 flex-shrink-0">
                        {index + 1}
                    </span>
                    <input
                        type="text"
                        value={stream.name}
                        onChange={(e) => onUpdate({ name: e.target.value })}
                        className="font-semibold bg-transparent border-b border-gray-300 focus:border-black outline-none min-w-0 flex-1 text-sm md:text-base"
                        placeholder="Stream name"
                    />
                </div>
                <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
                    <Badge variant={stream.classification.density === "Light" ? "light" : stream.classification.density === "Heavy" ? "heavy" : "default"}>
                        <span className="hidden sm:inline">{stream.classification.density}</span>
                        <span className="sm:hidden">{stream.classification.density[0]}</span>
                    </Badge>
                    <Badge variant={stream.classification.sulfur === "Sweet" ? "sweet" : "sour"}>
                        <span className="hidden sm:inline">{stream.classification.sulfur}</span>
                        <span className="sm:hidden">{stream.classification.sulfur[0]}</span>
                    </Badge>
                    {canDelete && (
                        <button
                            onClick={onDelete}
                            className="text-safety-red hover:bg-safety-red/10 px-2 py-1 text-xs font-bold"
                        >
                            ✕
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                {/* Percentage */}
                <div>
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-concrete-gray block mb-1">
                        % of Production
                    </span>
                    <Slider
                        value={stream.percentage}
                        min={0}
                        max={100}
                        step={1}
                        unit="%"
                        onChange={(val) => onUpdate({ percentage: val })}
                    />
                </div>

                {/* API Gravity */}
                <div>
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-concrete-gray block mb-1">
                        API Gravity
                    </span>
                    <Slider
                        value={stream.apiGravity}
                        min={10}
                        max={50}
                        step={0.5}
                        unit="°"
                        onChange={(val) => onUpdate({ apiGravity: val })}
                    />
                </div>

                {/* Sulfur */}
                <div>
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-concrete-gray block mb-1">
                        Sulfur Content
                    </span>
                    <Slider
                        value={stream.sulfurContent}
                        min={0}
                        max={5}
                        step={0.1}
                        unit="%"
                        formatValue={(v) => v.toFixed(1)}
                        onChange={(val) => onUpdate({ sulfurContent: val })}
                    />
                </div>
            </div>
        </div>
    );
}
