import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package } from "lucide-react"

const stats = [
  {
    title: "Total Revenue",
    value: "$45,231.89",
    change: "+20.1%",
    trend: "up",
    icon: DollarSign,
    description: "from last month",
  },
  {
    title: "Orders",
    value: "2,350",
    change: "+15.3%",
    trend: "up",
    icon: ShoppingCart,
    description: "from last month",
  },
  {
    title: "Customers",
    value: "1,429",
    change: "+8.2%",
    trend: "up",
    icon: Users,
    description: "from last month",
  },
  {
    title: "Products",
    value: "573",
    change: "-2.4%",
    trend: "down",
    icon: Package,
    description: "from last month",
  },
]

export default function DashboardStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
            <stat.icon className="w-4 h-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
            <div className="flex items-center space-x-2">
              <Badge
                variant={stat.trend === "up" ? "default" : "destructive"}
                className={`flex items-center space-x-1 ${
                  stat.trend === "up"
                    ? "bg-green-100 text-green-800 hover:bg-green-100"
                    : "bg-red-100 text-red-800 hover:bg-red-100"
                }`}
              >
                {stat.trend === "up" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                <span>{stat.change}</span>
              </Badge>
              <span className="text-xs text-gray-500">{stat.description}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
