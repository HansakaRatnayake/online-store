"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSign, ShoppingCart, Users, Package } from "lucide-react"
import { useAuth } from "@/components/providers/auth-provider"

const iconMap = {
  DollarSign: <DollarSign className="w-4 h-4 text-gray-400" />,
  ShoppingCart: <ShoppingCart className="w-4 h-4 text-gray-400" />,
  Users: <Users className="w-4 h-4 text-gray-400" />,
  Package: <Package className="w-4 h-4 text-gray-400" />,
}

export default function DashboardStats() {
  const [stats, setStats] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { token } = useAuth()

  useEffect(() => {
    if (!token) {
      setError("Authentication required")
      setIsLoading(false)
      return
    }

    async function fetchStats() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/stats`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        if (!res.ok) throw new Error("Failed to fetch stats")
        const data = await res.json()
        setStats(data)
        setIsLoading(false)
      } catch (err: any) {
        setError(err.message || "Failed to fetch stats")
        setIsLoading(false)
        console.error(err)
      }
    }

    fetchStats()
  }, [token])

  if (isLoading) return <div>Loading stats...</div>
  if (error) return <div className="text-red-600">{error}</div>

  return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                {iconMap[stat.icon as keyof typeof iconMap]}
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
                    {stat.trend === "up" ? (
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                    ) : (
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    )}
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