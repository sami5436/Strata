"use client";

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
    CrudePreference,
    AlertChannel,
} from "@/lib/store";

/**
 * Setup Page - Company Profile Configuration
 * Single page with 4 sections, conditional visibility
 */
export default function SetupPage() {
    const router = useRouter();
    const store = useSetupStore();

    // Show production section for Producer or Integrated
    const showProduction = store.companyType === "producer" || store.companyType === "integrated";

    // Show refining section for Refiner or Integrated
    const showRefining = store.companyType === "refiner" || store.companyType === "integrated";

    const handleSubmit = () => {
        if (store.validate()) {
            console.log("=== STRATA SETUP COMPLETE ===");
            console.log({
                company: {
                    name: store.companyName,
                    type: store.companyType,
                },
                production: showProduction ? {
                    dailyVolume: store.dailyProduction,
                    apiGravity: store.apiGravity,
                    sulfurContent: store.sulfurContent,
                    classification: store.crudeClassification,
                } : null,
                refining: showRefining ? {
                    capacity: store.refiningCapacity,
                    complexity: store.nelsonComplexity,
                    preferences: store.crudePreferences,
                } : null,
                market: {
                    benchmark: store.primaryBenchmark,
                    differential: store.qualityDifferential,
                    storage: store.storageCapacity,
                    alerts: store.alertChannels,
                },
            });
            router.push("/");
        }
    };

    const companyTypes: { type: CompanyType; title: string; description: string; icon: string }[] = [
        { type: "producer", title: "Producer", description: "We produce crude oil", icon: "⛽" },
        { type: "refiner", title: "Refiner", description: "We buy crude and refine it", icon: "🏭" },
        { type: "integrated", title: "Integrated", description: "We do both", icon: "◈" },
        { type: "trader", title: "Trader", description: "We trade without assets", icon: "📊" },
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

    return (
        <MainLayout>
            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold uppercase tracking-tight mb-1">
                    Company Setup
                </h1>
                <p className="text-concrete-gray uppercase tracking-wider text-sm">
                    Configure your trading profile — 3 minutes to complete
                </p>
            </div>

            <div className="max-w-4xl space-y-6">
                {/* ===== SECTION 1: COMPANY PROFILE ===== */}
                <Card padding="lg">
                    <h2 className="text-2xl font-bold uppercase tracking-tight mb-4 border-b-2 border-black pb-2">
                        1. Company Profile
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
                            <div className="grid grid-cols-2 gap-3">
                                {companyTypes.map((item) => (
                                    <SelectionCard
                                        key={item.type}
                                        title={item.title}
                                        description={item.description}
                                        icon={item.icon}
                                        selected={store.companyType === item.type}
                                        onSelect={() => store.setCompanyType(item.type)}
                                        error={!!store.errors.companyType}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </Card>

                {/* ===== SECTION 2: PRODUCTION DETAILS ===== */}
                {showProduction && (
                    <Card padding="lg">
                        <h2 className="text-2xl font-bold uppercase tracking-tight mb-4 border-b-2 border-black pb-2">
                            2. Production Details
                        </h2>

                        <div className="space-y-6">
                            <NumberInput
                                label="Daily Production Volume"
                                value={store.dailyProduction}
                                onChange={store.setDailyProduction}
                                unit="BPD"
                                min={0}
                                error={store.errors.dailyProduction}
                            />

                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <span className="text-xs font-semibold uppercase tracking-widest text-concrete-gray block mb-2">
                                        API Gravity
                                    </span>
                                    <Slider
                                        value={store.apiGravity}
                                        min={10}
                                        max={50}
                                        step={0.5}
                                        unit="°"
                                        onChange={store.setApiGravity}
                                    />
                                </div>

                                <div>
                                    <span className="text-xs font-semibold uppercase tracking-widest text-concrete-gray block mb-2">
                                        Sulfur Content
                                    </span>
                                    <Slider
                                        value={store.sulfurContent}
                                        min={0}
                                        max={5}
                                        step={0.1}
                                        unit="%"
                                        formatValue={(v) => v.toFixed(1)}
                                        onChange={store.setSulfurContent}
                                    />
                                </div>
                            </div>

                            {/* Live Classification Display */}
                            {store.crudeClassification && (
                                <div className="border-2 border-forest-green bg-forest-green/5 p-4">
                                    <span className="text-xs font-semibold uppercase tracking-widest text-concrete-gray block mb-1">
                                        Crude Classification
                                    </span>
                                    <div className="flex items-center gap-3">
                                        <span className="font-mono font-bold text-2xl text-forest-green">
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
                                    <p className="text-sm text-concrete-gray mt-1 font-mono">
                                        API {store.apiGravity}°, Sulfur {store.sulfurContent.toFixed(1)}%
                                    </p>
                                </div>
                            )}
                        </div>
                    </Card>
                )}

                {/* ===== SECTION 3: REFINING CAPABILITIES ===== */}
                {showRefining && (
                    <Card padding="lg">
                        <h2 className="text-2xl font-bold uppercase tracking-tight mb-4 border-b-2 border-black pb-2">
                            {showProduction ? "3" : "2"}. Refining Capabilities
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
                    </Card>
                )}

                {/* ===== SECTION 4: MARKET SETTINGS ===== */}
                <Card padding="lg">
                    <h2 className="text-2xl font-bold uppercase tracking-tight mb-4 border-b-2 border-black pb-2">
                        {showProduction && showRefining ? "4" : showProduction || showRefining ? "3" : "2"}. Market Settings
                    </h2>

                    <div className="space-y-4">
                        <Select
                            label="Primary Benchmark"
                            value={store.primaryBenchmark}
                            onChange={(v) => store.setPrimaryBenchmark(v as Benchmark)}
                            options={benchmarkOptions}
                        />

                        <div className="grid grid-cols-2 gap-4">
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
                </Card>

                {/* ===== SUBMIT BUTTON ===== */}
                <div className="flex justify-end gap-4 pt-4 border-t-2 border-black">
                    <Button variant="secondary" size="lg" onClick={() => store.reset()}>
                        Reset Form
                    </Button>
                    <Button variant="primary" size="lg" onClick={handleSubmit}>
                        Complete Setup →
                    </Button>
                </div>
            </div>
        </MainLayout>
    );
}
