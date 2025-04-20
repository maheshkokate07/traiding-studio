// Create a store to manage strategies data
import { create } from "zustand"
import { persist } from "zustand/middleware"

// Mock data for initial strategies
const initialStrategies = [
    {
        id: "1",
        name: "NSE Equity Growth Strategy",
        status: "completed",
        lastModified: "2023-12-15T10:30:00",
        performance: "+12.5%",
    },
    {
        id: "2",
        name: "Market Cap Leaders",
        status: "in_progress",
        lastModified: "2023-12-18T14:45:00",
        performance: "N/A",
    },
    {
        id: "3",
        name: "Moving Average Crossover",
        status: "draft",
        lastModified: "2023-12-20T09:15:00",
        performance: "N/A",
    },
    {
        id: "4",
        name: "Trailing Stoploss Strategy",
        status: "completed",
        lastModified: "2023-12-10T16:20:00",
        performance: "-2.3%",
    },
    {
        id: "5",
        name: "High Volume Breakouts",
        status: "draft",
        lastModified: "2023-12-21T11:05:00",
        performance: "N/A",
    },
]

// Update the Strategy type to include all required fields
export type Strategy = {
    id: string
    name: string
    description?: string
    status: "draft" | "in_progress" | "completed"
    lastModified: string
    performance: string
    scannerRules?: any
    buyRules?: any
    sellRules?: any
    simulationConfig?: any
    results?: any
}

// Add a function to simulate strategy execution
// This would be replaced by actual backend calls in a real implementation
const simulateExecution = (strategy: Strategy): Promise<Partial<Strategy>> => {
    return new Promise((resolve) => {
        // Simulate a delay for processing
        setTimeout(() => {
            // Generate mock results
            const mockResults = {
                totalReturn: (Math.random() * 20 - 5).toFixed(1) + "%",
                annualizedReturn: (Math.random() * 15 - 3).toFixed(1) + "%",
                maxDrawdown: "-" + (Math.random() * 20 + 5).toFixed(1) + "%",
                sharpeRatio: (Math.random() * 2 + 0.5).toFixed(1),
                trades: [
                    { date: "2022-01-15", instrument: "RELIANCE", action: "BUY", price: 2500, quantity: 10 },
                    { date: "2022-01-20", instrument: "HDFCBANK", action: "BUY", price: 1500, quantity: 15 },
                    { date: "2022-02-05", instrument: "RELIANCE", action: "SELL", price: 2700, quantity: 10 },
                    { date: "2022-02-15", instrument: "INFY", action: "BUY", price: 1800, quantity: 12 },
                    { date: "2022-03-01", instrument: "HDFCBANK", action: "SELL", price: 1450, quantity: 15 },
                    { date: "2022-03-10", instrument: "INFY", action: "SELL", price: 1900, quantity: 12 },
                ],
            }

            // Return updated strategy data
            resolve({
                status: "completed",
                performance: mockResults.totalReturn.startsWith("-") ? mockResults.totalReturn : "+" + mockResults.totalReturn,
                results: mockResults,
            })
        }, 2000) // Simulate 2 second processing time
    })
}

// Add this to the StrategyStore type
type StrategyStore = {
    strategies: Strategy[]
    addStrategy: (strategy: Omit<Strategy, "id">) => string
    updateStrategy: (id: string, strategy: Partial<Strategy>) => void
    deleteStrategy: (id: string) => void
    copyStrategy: (id: string) => string | undefined
    getStrategy: (id: string) => Strategy | undefined
    runSimulation: (id: string) => Promise<void>
}

// Add the runSimulation function to the store implementation
export const useStrategyStore = create<StrategyStore>()(
    persist(
        (set, get) => ({
            strategies: initialStrategies as Strategy[],

            addStrategy: (strategy) => {
                const newStrategy = {
                    ...strategy,
                    id: Date.now().toString(),
                    lastModified: new Date().toISOString(),
                }
                set((state) => ({
                    strategies: [...state.strategies, newStrategy as Strategy],
                }))
                return newStrategy.id
            },

            updateStrategy: (id, updatedStrategy) => {
                set((state) => ({
                    strategies: state.strategies.map((strategy) =>
                        strategy.id === id ? { ...strategy, ...updatedStrategy, lastModified: new Date().toISOString() } : strategy,
                    ),
                }))
            },

            deleteStrategy: (id) => {
                set((state) => ({
                    strategies: state.strategies.filter((strategy) => strategy.id !== id),
                }))
            },

            copyStrategy: (id) => {
                const strategyToCopy = get().strategies.find((s) => s.id === id)
                if (strategyToCopy) {
                    const newStrategy = {
                        ...strategyToCopy,
                        id: Date.now().toString(),
                        name: `${strategyToCopy.name} (Copy)`,
                        status: "draft",
                        lastModified: new Date().toISOString(),
                        performance: "N/A",
                    }
                    set((state: any) => ({
                        strategies: [...state.strategies, newStrategy],
                    }))
                    return newStrategy.id
                }
            },

            getStrategy: (id) => {
                return get().strategies.find((strategy) => strategy.id === id)
            },

            runSimulation: async (id) => {
                // First update status to in_progress
                set((state) => ({
                    strategies: state.strategies.map((strategy) =>
                        strategy.id === id
                            ? { ...strategy, status: "in_progress", lastModified: new Date().toISOString() }
                            : strategy,
                    ),
                }))

                // Get the strategy
                const strategy = get().getStrategy(id)
                if (!strategy) return

                // Simulate execution (this would be a backend call in a real app)
                const result = await simulateExecution(strategy)

                // Update the strategy with results
                set((state) => ({
                    strategies: state.strategies.map((s) =>
                        s.id === id ? { ...s, ...result, lastModified: new Date().toISOString() } : s,
                    ),
                }))
            },
        }),
        {
            name: "trading-studio-storage",
        },
    ),
)
