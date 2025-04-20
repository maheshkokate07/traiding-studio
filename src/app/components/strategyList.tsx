"use client"
import Link from "next/link"
import { Copy, MoreHorizontal, Pencil, Play, Trash } from "lucide-react"
import { Button } from "./ui/button"
import { useStrategyStore } from "../lib/store"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import toast from "react-hot-toast"

export default function StrategiesList() {
  const { strategies, deleteStrategy, copyStrategy, runSimulation } = useStrategyStore()

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
            Completed
          </span>
        )
      case "in_progress":
        return (
          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800">
            In Progress
          </span>
        )
      case "draft":
        return (
          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-secondary text-secondary-foreground">
            Draft
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-secondary text-secondary-foreground">
            Unknown
          </span>
        )
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const handleCopyStrategy = (id: string) => {
    copyStrategy(id)
    toast.success("Strategy copied");
  }

  const handleDeleteStrategy = (id: string) => {
    deleteStrategy(id)
    toast.success("Strategy deleted")
  }

  const handleRunSimulation = async (id: string) => {
    await toast.promise(
      runSimulation(id),
      {
        loading: "Running simulation...",
        success: "Simulation completed!",
        error: "Failed to run simulation. Please try again.",
      }
    )
  }

  if (strategies.length === 0) {
    return (
      <div className="border border-gray-200 rounded-lg p-5 transition-all hover:border-primary/20 hover:shadow-sm flex flex-col items-center justify-center py-12">
        <p className="text-muted-foreground mb-4">No strategies found. Create your first strategy to get started.</p>
        <Link href="/create-strategy">
          <Button className="cursor-pointer">Create New Strategy</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="border border-gray-200 rounded-lg">
      <table className="w-full">
        <thead className="border-b border-gray-200">
          <tr className="text-sm text-gray-600">
            <th className="font-medium py-3 px-4 text-start">
              Strategy Name
            </th>
            <th className="font-medium py-3 px-4 text-center">
              Status
            </th>
            <th className="font-medium py-3 px-4 text-center">
              Last Modified
            </th>
            <th className="font-medium py-3 px-4 text-center">
              Performance
            </th>
            <th className="font-medium py-3 px-4 text-center">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {strategies.map((strategy) => (
            <tr key={strategy.id} className="hover:bg-gray-50 border-b border-gray-200">
              <td className="py-3 px-4 text-start">
                <Link href={`/strategy/${strategy.id}`} className="font-medium hover:text-primary">
                  {strategy.name}
                </Link>
              </td>
              <td className="py-3 px-4 text-center">{getStatusBadge(strategy.status)}</td>
              <td className="py-3 px-4 text-sm text-muted-foreground text-center">
                {formatDate(strategy.lastModified)}
              </td>
              <td className="py-3 px-4 text-center">
                {strategy.performance === "N/A" ? (
                  <span className="text-muted-foreground text-sm">N/A</span>
                ) : (
                  <span className={strategy.performance.startsWith("+") ? "text-green-600" : "text-red-600"}>
                    {strategy.performance}
                  </span>
                )}
              </td>
              <td className="py-3 px-4 text-center">
                <DropdownMenu>
                  <DropdownMenuContent align="end" className="w-[160px]">
                    <div className="h-8 w-8 p-0 bg-transparent text-zinc-950 text-center hover:bg-gray-100 m-auto flex items-center justify-center rounded-md">
                      <MoreHorizontal className="w-5 h-5" />
                    </div>
                    <Link href={`/edit-strategy/${strategy.id}`}>
                      <DropdownMenuItem>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem onClick={() => handleCopyStrategy(strategy.id)}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </DropdownMenuItem>
                    {strategy.status !== "in_progress" && (
                      <DropdownMenuItem onClick={() => handleRunSimulation(strategy.id)}>
                        <Play className="h-4 w-4 mr-2" />
                        Run Simulation
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onClick={() => handleDeleteStrategy(strategy.id)}
                      className="text-red-600 hover:bg-red-50"
                    >
                      <Trash className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}