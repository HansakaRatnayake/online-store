"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Package, Truck, CheckCircle, XCircle, RefreshCw } from "lucide-react"
import { useAuth } from "@/components/providers/auth-provider"

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800"
    case "processing":
      return "bg-blue-100 text-blue-800"
    case "shipped":
      return "bg-purple-100 text-purple-800"
    case "delivered":
      return "bg-green-100 text-green-800"
    case "cancelled":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "pending":
      return <Package className="w-3 h-3" />
    case "processing":
      return <RefreshCw className="w-3 h-3" />
    case "shipped":
      return <Truck className="w-3 h-3" />
    case "delivered":
      return <CheckCircle className="w-3 h-3" />
    case "cancelled":
      return <XCircle className="w-3 h-3" />
    default:
      return <Package className="w-3 h-3" />
  }
}

export default function RecentOrders() {
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { token } = useAuth()

  useEffect(() => {
    if (!token) {
      setError("Authentication required")
      setIsLoading(false)
      return
    }

    async function fetchData() {
      try {
        const query = new URLSearchParams({ page: "1", limit: "5" }).toString()
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders?${query}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })

        if (!res.ok) throw new Error("Failed to fetch orders")
        const data = await res.json()
        setRecentOrders(data.orders)
        setIsLoading(false)
      } catch (err: any) {
        console.error(err)
        setError(err.message || "Failed to fetch orders")
        setIsLoading(false)
      }
    }

    fetchData()
  }, [token])

  if (isLoading) return <div>Loading orders...</div>
  if (error) return <div className="text-red-600">{error}</div>

  return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentOrders.map((order) => (
                <div key={order._id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-medium w-24 truncate">#{order.orderNumber}</span>
                      <Badge className={getStatusColor(order.status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(order.status)}
                          {order.status}
                        </div>
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>{order.shippingAddress.name}</p>
                      <p className="truncate">{order.userId}</p>
                      <p>{order.items.length} items • {new Date(order.createdAt).toISOString().split("T")[0]}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-lg">${order.total.toFixed(2)}</p>
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
            ))}
          </div>
        </CardContent>
      </Card>
  )
}