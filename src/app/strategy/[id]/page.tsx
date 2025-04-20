"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Copy, Play } from "lucide-react"
import { useStrategyStore } from "@/app/lib/store"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import toast from "react-hot-toast"

// Mock data for strategy details
const mockStrategyDetails = {
  id: "1",
  name: "NSE Equity Growth Strategy",
  description: "A strategy focused on NSE equities with consistent growth",
  status: "completed",
  lastModified: "2023-12-15T10:30:00",
  performance: "+12.5%",
  scannerRules: {
    type: "group",
    operator: "AND",
    rules: [
      { type: "rule", field: "exchange", operator: "equals", value: "NSE" },
      { type: "rule", field: "instrument_type", operator: "equals", value: "EQUITY" },
      {
        type: "group",
        operator: "OR",
        rules: [
          {
            type: "group",
            operator: "AND",
            rules: [
              { type: "rule", field: "price_growth", operator: "greater_than", value: "0", period: 300 },
              { type: "rule", field: "price", operator: "greater_than", value: "99" },
            ],
          },
          {
            type: "group",
            operator: "AND",
            rules: [
              { type: "rule", field: "market_cap_rank", operator: "top_percent", value: "10" },
              {
                type: "rule",
                field: "avg_daily_transaction",
                operator: "greater_than",
                value: "300000000",
                period: 90,
              },
            ],
          },
        ],
      },
    ],
  },
  buyRules: {
    type: "group",
    operator: "AND",
    rules: [
      { type: "rule", field: "last_price", operator: "greater_than_equals", value: "last_close" },
      { type: "rule", field: "last_price", operator: "greater_than_equals", value: "moving_average", period: 30 },
    ],
  },
  sellRules: {
    type: "group",
    operator: "AND",
    rules: [
      { type: "rule", field: "trailing_stoploss", operator: "equals", value: "10" },
      { type: "rule", field: "hold_days", operator: "greater_than_equals", value: "5" },
    ],
  },
  simulationConfig: {
    startMargin: 100000,
    startDate: "2000-01-01",
    endDate: "2025-03-20",
    maxPositions: 20,
    maxPositionsPerInstrument: 1,
    orderSortingType: "300-days-top-gainer-first",
  },
  results: {
    totalReturn: "+12.5%",
    annualizedReturn: "+8.2%",
    maxDrawdown: "-15.3%",
    sharpeRatio: "1.2",
    trades: [
      { date: "2022-01-15", instrument: "RELIANCE", action: "BUY", price: 2500, quantity: 10 },
      { date: "2022-01-20", instrument: "HDFCBANK", action: "BUY", price: 1500, quantity: 15 },
      { date: "2022-02-05", instrument: "RELIANCE", action: "SELL", price: 2700, quantity: 10 },
      { date: "2022-02-15", instrument: "INFY", action: "BUY", price: 1800, quantity: 12 },
      { date: "2022-03-01", instrument: "HDFCBANK", action: "SELL", price: 1450, quantity: 15 },
      { date: "2022-03-10", instrument: "INFY", action: "SELL", price: 1900, quantity: 12 },
    ],
  },
}

// Update the component to destructure runSimulation from the store
export default function StrategyDetails({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { getStrategy, copyStrategy, updateStrategy, runSimulation } = useStrategyStore()
  const [strategy, setStrategy] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Get the strategy from our store
    const foundStrategy = getStrategy(params.id)

    if (foundStrategy) {
      // If we don't have detailed data for this strategy, use the mock data for demo purposes
      if (!foundStrategy.scannerRules) {
        setStrategy({
          ...foundStrategy,
          scannerRules: mockStrategyDetails.scannerRules,
          buyRules: mockStrategyDetails.buyRules,
          sellRules: mockStrategyDetails.sellRules,
          simulationConfig: mockStrategyDetails.simulationConfig,
          results: mockStrategyDetails.results,
        })
      } else {
        setStrategy(foundStrategy)
      }
    } else {
      // Fallback to mock data if strategy not found
      setStrategy(mockStrategyDetails)
    }

    setIsLoading(false)
  }, [params.id, getStrategy])

  const handleCopyStrategy = () => {
    if (strategy) {
      copyStrategy(strategy.id)
      toast.success("Strategy copied")
      router.push("/")
    }
  }

  // Update the handleRunSimulation function to use the store's runSimulation method
  const handleRunSimulation = async () => {
    if (strategy) {
      toast.promise(
        runSimulation(strategy.id),
        {
          loading: "Running simulation...",
          success: "Simulation completed!",
          error: "Failed to start simulation. Please try again.",
        }
      ).then(() => {
        router.push("/")
      })
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <p>Loading strategy details...</p>
        </div>
      </div>
    )
  }

  if (!strategy) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <p>Strategy not found</p>
        </div>
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <span className="bg-green-500 px-3 py-1 rounded-xl text-sm">Completed</span>
      case "in_progress":
        return <span className="bg-yellow-500 px-3 py-1 rounded-xl text-sm">In Progress</span>
      case "draft":
        return <span className="p-2 bg-gray-200 rounded-xl text-sm">Draft</span>
      default:
        return <span className="p-2 bg-gray-200 rounded-xl text-sm">Unknown</span>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center mb-8">
        <button
          onClick={() => router.push("/")}
          className="mr-4 h-8 px-3 flex items-center border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-100 text-sm font-medium cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Strategies
        </button>
        <h1 className="text-3xl font-bold">{strategy.name}</h1>
        <div className="ml-4">{getStatusBadge(strategy.status)}</div>

        <div className="ml-auto flex gap-2">
          <Button onClick={handleCopyStrategy} className="flex items-center bg-gray-500 text-sm hover:bg-gray-600 cursor-pointer">
            <Copy className="h-4 w-4 mr-2" />
            Copy Strategy
          </Button>
          {strategy.status !== "in_progress" && (
            <Button onClick={handleRunSimulation} className="flex items-center bg-gray-500 text-sm hover:bg-gray-600 cursor-pointer">
              <Play className="h-4 w-4 mr-2" />
              Run Simulation
            </Button>
          )}
        </div>
      </div>

      {strategy.description && <p className="text-muted-foreground mb-6">{strategy.description}</p>}

      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card className="border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Last Modified</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatDate(strategy.lastModified)}</p>
          </CardContent>
        </Card>
        <Card className="border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <p
              className={`text-2xl font-bold ${strategy.performance.startsWith("+") ? "text-green-600" : "text-red-600"}`}
            >
              {strategy.performance}
            </p>
          </CardContent>
        </Card>
        <Card className="border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Simulation Period</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {new Date(strategy.simulationConfig.startDate).getFullYear()} -{" "}
              {new Date(strategy.simulationConfig.endDate).getFullYear()}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 w-full mb-8">
          <TabsTrigger value="overview" className="cursor-pointer">Overview</TabsTrigger>
          <TabsTrigger value="rules" className="cursor-pointer">Strategy Rules</TabsTrigger>
          <TabsTrigger value="results" className="cursor-pointer">Simulation Results</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-2 gap-6">
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle>Strategy Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Return</p>
                    <p
                      className={`text-xl font-bold ${strategy.results.totalReturn.startsWith("+") ? "text-green-600" : "text-red-600"}`}
                    >
                      {strategy.results.totalReturn}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Annualized Return</p>
                    <p
                      className={`text-xl font-bold ${strategy.results.annualizedReturn.startsWith("+") ? "text-green-600" : "text-red-600"}`}
                    >
                      {strategy.results.annualizedReturn}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Max Drawdown</p>
                    <p className="text-xl font-bold text-red-600">{strategy.results.maxDrawdown}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Sharpe Ratio</p>
                    <p className="text-xl font-bold">{strategy.results.sharpeRatio}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle>Simulation Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Start Margin</p>
                      <p className="text-xl font-bold">₹{strategy.simulationConfig.startMargin.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Max Positions</p>
                      <p className="text-xl font-bold">{strategy.simulationConfig.maxPositions}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Simulation Period</p>
                    <p className="text-xl font-bold">
                      {new Date(strategy.simulationConfig.startDate).toLocaleDateString()} -{" "}
                      {new Date(strategy.simulationConfig.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Order Sorting</p>
                    <p className="text-xl font-bold">
                      {strategy.simulationConfig.orderSortingType
                        .split("-")
                        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(" ")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="rules">
          <div className="grid gap-6">
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle>Scanner Rules</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-md overflow-auto text-sm">
                  {JSON.stringify(strategy.scannerRules, null, 2)}
                </pre>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle>Buy Rules</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-md overflow-auto text-sm">
                  {JSON.stringify(strategy.buyRules, null, 2)}
                </pre>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle>Sell Rules</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-md overflow-auto text-sm">
                  {JSON.stringify(strategy.sellRules, null, 2)}
                </pre>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="results">
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle>Trade History</CardTitle>
            </CardHeader>
            <CardContent>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="text-sm font-medium text-gray-500 border-b text-left border-gray-200">
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Instrument</th>
                    <th className="py-3 px-4">Action</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Quantity</th>
                    <th className="py-3 px-4">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {strategy.results.trades.map((trade: any, index: number) => (
                    <tr key={index} className="hover:bg-gray-50 border-b border-gray-200 text-sm text-gray-900">
                      <td className="py-3 px-4">
                        {new Date(trade.date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 font-medium">
                        {trade.instrument}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium text-white ${trade.action === "BUY" ? "bg-green-500" : "bg-red-500"
                            }`}
                        >
                          {trade.action}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        ₹{trade.price.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">{trade.quantity}</td>
                      <td className="py-3 px-4">
                        ₹{(trade.price * trade.quantity).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}