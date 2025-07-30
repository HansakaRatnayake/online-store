"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/providers/auth-provider"

export default function SalesChart() {
  const [salesData, setSalesData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { token } = useAuth()

  useEffect(() => {
    if (!token) {
      setError("Authentication required")
      setIsLoading(false)
      return
    }

    async function fetchSales() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/sales`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        if (!res.ok) throw new Error("Failed to fetch sales data")
        const data = await res.json()
        setSalesData(data)
        setIsLoading(false)
      } catch (err: any) {
        setError(err.message || "Failed to fetch sales data")
        setIsLoading(false)
        console.error(err)
      }
    }

    fetchSales()
  }, [token])

  if (isLoading) return <div>Loading sales data...</div>
  if (error) return <div className="text-red-600">{error}</div>

  const currentMonth = salesData[salesData.length - 1] || { sales: 0, orders: 0 }
  const previousMonth = salesData[salesData.length - 2] || { sales: 0, orders: 0 }
  const salesGrowth = previousMonth.sales
      ? ((currentMonth.sales - previousMonth.sales) / previousMonth.sales * 100).toFixed(1)
      : "0.0"
  const ordersGrowth = previousMonth.orders
      ? ((currentMonth.orders - previousMonth.orders) / previousMonth.orders * 100).toFixed(1)
      : "0.0"

  return (
      <Card>
        <CardHeader>
          <CardTitle>Sales Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-600">Monthly Sales</span>
                  <Badge className={`${parseFloat(salesGrowth) >= 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                    {parseFloat(salesGrowth) >= 0 ? (
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                    ) : (
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    )}
                    {Math.abs(parseFloat(salesGrowth))}%
                  </Badge>
                </div>
                <p className="text-2xl font-bold text-blue-900">${currentMonth.sales.toLocaleString()}</p>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-green-600">Monthly Orders</span>
                  <Badge className={`${parseFloat(ordersGrowth) >= 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                    {parseFloat(ordersGrowth) >= 0 ? (
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                    ) : (
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    )}
                    {Math.abs(parseFloat(ordersGrowth))}%
                  </Badge>
                </div>
                <p className="text-2xl font-bold text-green-900">{currentMonth.orders}</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Sales by Month</h4>
              {salesData.map((data, index) => {
                const maxSales = Math.max(...salesData.map((d) => d.sales), 1)
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