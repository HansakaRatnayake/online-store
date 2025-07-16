"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown } from "lucide-react"

// Mock sales data
const salesData = [
  { month: "Jan", sales: 12000, orders: 145 },
  { month: "Feb", sales: 15000, orders: 178 },
  { month: "Mar", sales: 18000, orders: 210 },
  { month: "Apr", sales: 22000, orders: 245 },
  { month: "May", sales: 19000, orders: 198 },
  { month: "Jun", sales: 25000, orders: 289 },
]

export default function SalesChart() {
  const currentMonth = salesData[salesData.length - 1]
  const previousMonth = salesData[salesData.length - 2]
  const salesGrowth = ((currentMonth.sales - previousMonth.sales) / previousMonth.sales) * 100
  const ordersGrowth = ((currentMonth.orders - previousMonth.orders) / previousMonth.orders) * 100

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-600">Monthly Sales</span>
                <Badge className={`${salesGrowth >= 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                  {salesGrowth >= 0 ? (
                    <TrendingUp className="w-3 h-3 mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-1" />
                  )}
                  {Math.abs(salesGrowth).toFixed(1)}%
                </Badge>
              </div>
              <p className="text-2xl font-bold text-blue-900">${currentMonth.sales.toLocaleString()}</p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-green-600">Monthly Orders</span>
                <Badge className={`${ordersGrowth >= 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                  {ordersGrowth >= 0 ? (
                    <TrendingUp className="w-3 h-3 mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-1" />
                  )}
                  {Math.abs(ordersGrowth).toFixed(1)}%
                </Badge>
              </div>
              <p className="text-2xl font-bold text-green-900">{currentMonth.orders}</p>
            </div>
          </div>

          {/* Simple Bar Chart */}
          <div className="space-y-3">
            <h4 className="font-medium">Sales by Month</h4>
            {salesData.map((data, index) => {
              const maxSales = Math.max(...salesData.map((d) => d.sales))
              const width = (data.sales / maxSales) * 100

              return (
                <div key={data.month} className="flex items-center gap-3">
                  <span className="w-8 text-sm font-medium">{data.month}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                    <div
                      className="bg-blue-600 h-6 rounded-full flex items-center justify-end pr-2"
                      style={{ width: `${width}%` }}
                    >
                      <span className="text-white text-xs font-medium">${data.sales.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
