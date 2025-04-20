"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Save } from "lucide-react";
import { useStrategyStore } from "@/app/lib/store";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/app/components/ui/tabs";
import RuleBuilder from "@/app/components/rule-builder";
import RulePreview from "@/app/components/rule-preview";
import SimulationConfig from "@/app/components/simulation-config";
import toast from "react-hot-toast";

export default function EditStrategy({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { getStrategy, updateStrategy, runSimulation } = useStrategyStore();
  const [activeTab, setActiveTab] = useState("general");
  const [isLoading, setIsLoading] = useState(true);
  const [strategyName, setStrategyName] = useState("");
  const [strategyDescription, setStrategyDescription] = useState("");
  const [scannerRules, setScannerRules] = useState<any>({ type: "group", operator: "AND", rules: [] });
  const [buyRules, setBuyRules] = useState<any>({ type: "group", operator: "AND", rules: [] });
  const [sellRules, setSellRules] = useState<any>({ type: "group", operator: "AND", rules: [] });
  const [simulationConfig, setSimulationConfig] = useState({
    startMargin: 100000,
    startDate: "2000-01-01",
    endDate: "2025-03-20",
    maxPositions: 20,
    maxPositionsPerInstrument: 1,
    orderSortingType: "300-days-top-gainer-first",
  });

  useEffect(() => {
    const strategy = getStrategy(params.id);
    if (strategy) {
      setStrategyName(strategy.name);
      setStrategyDescription(strategy.description || "");
      if (strategy.scannerRules) setScannerRules(strategy.scannerRules);
      if (strategy.buyRules) setBuyRules(strategy.buyRules);
      if (strategy.sellRules) setSellRules(strategy.sellRules);
      if (strategy.simulationConfig) setSimulationConfig(strategy.simulationConfig);
    } else {
      toast.error("Strategy not found");
      router.push("/");
    }
    setIsLoading(false);
  }, [params.id, getStrategy, router]);

  const handleSaveStrategy = () => {
    if (!strategyName.trim()) {
      toast.error("Strategy name is required");
      setActiveTab("general");
      return;
    }
    updateStrategy(params.id, {
      name: strategyName,
      description: strategyDescription,
      scannerRules,
      buyRules,
      sellRules,
      simulationConfig,
    });
    toast.success("Strategy updated");
    router.push("/");
  };

  const handleSubmitSimulation = () => {
    if (!strategyName.trim()) {
      toast.error("Strategy name is required");
      setActiveTab("general");
      return;
    }
    if (scannerRules.rules.length === 0) {
      toast.error("Scanner rules are required");
      setActiveTab("scanner");
      return;
    }
    if (buyRules.rules.length === 0) {
      toast.error("Buy rules are required");
      setActiveTab("buy");
      return;
    }
    if (sellRules.rules.length === 0) {
      toast.error("Sell rules are required");
      setActiveTab("sell");
      return;
    }
    if (!simulationConfig.startMargin || simulationConfig.startMargin <= 0) {
      toast.error("Start margin must be greater than 0");
      return;
    }
    if (!simulationConfig.startDate || !simulationConfig.endDate) {
      toast.error("Simulation start and end dates are required");
      return;
    }
    if (new Date(simulationConfig.startDate) >= new Date(simulationConfig.endDate)) {
      toast.error("End date must be after start date");
      return;
    }
    if (!simulationConfig.maxPositions || simulationConfig.maxPositions <= 0) {
      toast.error("Maximum positions must be greater than 0");
      return;
    }
    updateStrategy(params.id, {
      name: strategyName,
      description: strategyDescription,
      scannerRules,
      buyRules,
      sellRules,
      simulationConfig,
    });
    runSimulation(params.id);
    toast.success("Simulation submitted");
    router.push("/");
  };

  const handleNextTab = () => {
    switch (activeTab) {
      case "general":
        setActiveTab("scanner");
        break;
      case "scanner":
        setActiveTab("buy");
        break;
      case "buy":
        setActiveTab("sell");
        break;
      case "sell":
        setActiveTab("simulation");
        break;
      default:
        break;
    }
  };

  const handlePreviousTab = () => {
    switch (activeTab) {
      case "scanner":
        setActiveTab("general");
        break;
      case "buy":
        setActiveTab("scanner");
        break;
      case "sell":
        setActiveTab("buy");
        break;
      case "simulation":
        setActiveTab("sell");
        break;
      default:
        break;
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500 text-sm">Loading strategy...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center mb-6">
        <button
          onClick={() => router.push("/")}
          className="mr-4 h-8 px-3 flex items-center border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-100 text-sm font-medium cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Strategies
        </button>
        <h1 className="text-xl font-medium">Edit Strategy</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="border-b border-gray-200 grid grid-cols-5 w-full mb-6">
          <TabsTrigger value="general" className="cursor-pointer">General</TabsTrigger>
          <TabsTrigger value="scanner" className="cursor-pointer">Scanner</TabsTrigger>
          <TabsTrigger value="buy" className="cursor-pointer">Buy</TabsTrigger>
          <TabsTrigger value="sell" className="cursor-pointer">Sell</TabsTrigger>
          <TabsTrigger value="simulation" className="cursor-pointer">Simulation</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <div className="border border-gray-200 rounded-lg bg-white">
            <div className="pt-6 px-6 pb-6">
              <div className="space-y-4">
                <div className="space-y-2 mb-4">
                  <label htmlFor="strategy-name" className="text-sm font-medium text-gray-900">
                    Strategy Name
                  </label>
                  <input
                    id="strategy-name"
                    placeholder="Enter strategy name"
                    value={strategyName}
                    onChange={(e) => setStrategyName(e.target.value)}
                    className="h-9 w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2 mb-4">
                  <label htmlFor="strategy-description" className="text-sm font-medium text-gray-900">
                    Description (Optional)
                  </label>
                  <input
                    id="strategy-description"
                    placeholder="Enter strategy description"
                    value={strategyDescription}
                    onChange={(e) => setStrategyDescription(e.target.value)}
                    className="h-9 w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Briefly describe what this strategy aims to achieve
                  </p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="scanner">
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg bg-white">
              <div className="pt-6 px-6 pb-6">
                <h2 className="text-base font-medium mb-2">Scanner Rules</h2>
                <p className="text-sm text-gray-500 mb-4">
                  Define rules to identify financial instruments that meet your criteria on a given day.
                </p>
                <RuleBuilder rules={scannerRules} onChange={setScannerRules} ruleType="scanner" />
              </div>
            </div>
            {scannerRules.rules.length > 0 && <RulePreview rules={scannerRules} ruleType="scanner" />}
          </div>
        </TabsContent>

        <TabsContent value="buy">
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg bg-white">
              <div className="pt-6 px-6 pb-6">
                <h2 className="text-base font-medium mb-2">Buy Rules</h2>
                <p className="text-sm text-gray-500 mb-4">
                  Define rules to identify when to buy instruments that have been shortlisted in the scanner step.
                </p>
                <RuleBuilder rules={buyRules} onChange={setBuyRules} ruleType="buy" />
              </div>
            </div>
            {buyRules.rules.length > 0 && <RulePreview rules={buyRules} ruleType="buy" />}
          </div>
        </TabsContent>

        <TabsContent value="sell">
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg bg-white">
              <div className="pt-6 px-6 pb-6">
                <h2 className="text-base font-medium mb-2">Sell Rules</h2>
                <p className="text-sm text-gray-500 mb-4">
                  Define rules to identify when to sell instruments that have been bought.
                </p>
                <RuleBuilder rules={sellRules} onChange={setSellRules} ruleType="sell" />
              </div>
            </div>
            {sellRules.rules.length > 0 && <RulePreview rules={sellRules} ruleType="sell" />}
          </div>
        </TabsContent>

        <TabsContent value="simulation">
          <div className="border border-gray-200 rounded-lg bg-white">
            <div className="pt-6 px-6 pb-6">
              <h2 className="text-base font-medium mb-2">Simulation Configuration</h2>
              <p className="text-sm text-gray-500 mb-4">
                Configure parameters for simulating your strategy on historical data.
              </p>
              <SimulationConfig config={simulationConfig} onChange={setSimulationConfig} />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between mt-6">
        <button
          onClick={handlePreviousTab}
          disabled={activeTab === "general"}
          className={`h-8 px-3 flex items-center border border-gray-300 rounded-md bg-white text-gray-700 text-sm font-medium cursor-pointer ${
            activeTab === "general" ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"
          }`}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </button>

        <div className="flex gap-2">
          <button
            onClick={handleSaveStrategy}
            className="h-8 px-3 flex items-center border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-100 text-sm font-medium cursor-pointer"
          >
            <Save className="h-4 w-4 mr-2" />
            Save as Draft
          </button>

          {activeTab === "simulation" ? (
            <button
              onClick={handleSubmitSimulation}
              className="h-8 px-3 flex items-center rounded-md bg-blue-600 text-white hover:bg-blue-700 text-sm font-medium cursor-pointer"
            >
              Submit for Simulation
            </button>
          ) : (
            <button
              onClick={handleNextTab}
              className="h-8 px-3 flex items-center rounded-md bg-blue-600 text-white hover:bg-blue-700 text-sm font-medium cursor-pointer"
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}