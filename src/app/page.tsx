import Link from "next/link"
import { PlusCircle } from "lucide-react"
import StrategiesList from "./components/strategyList"
import { Button } from "./components/ui/button"

export default function Home() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-medium">Trading Studio</h1>
          <p className="text-muted-foreground mt-1 text-sm">Create and manage your trading strategies</p>
        </div>
        <Link href="/create-strategy">
          <Button className="flex items-center gap-2 cursor-pointer">
            <PlusCircle className="h-4 w-4" />
            New Strategy
          </Button>
        </Link>
      </div>

      <StrategiesList />
    </div>
  )
}
