import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Package, Truck } from "lucide-react"

const recentOrders = [
  {
    id: "#ORD-001",
    customer: "John Doe",
    email: "john@example.com",
    total: 299.99,
    status: "processing",
    date: "2024-01-15",
    items: 2,
  },
  {
    id: "#ORD-002",
    customer: "Sarah Smith",
    email: "sarah@example.com",
    total: 159.99,
    status: "shipped",
    date: "2024-01-14",
    items: 1,
  },
  {
    id: "#ORD-003",
    customer: "Mike Johnson",
    email: "mike@example.com",
    total: 89.99,
    status: "delivered",
    date: "2024-01-13",
    items: 3,
  },
  {
    id: "#ORD-004",
    customer: "Emily Brown",
    email: "emily@example.com",
    total: 449.99,
    status: "pending",
    date: "2024-01-12",
    items: 1,
  },
]

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
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "processing":
      return <Package className="w-3 h-3" />
    case "shipped":
      return <Truck className="w-3 h-3" />
    case "delivered":
      return <Package className="w-3 h-3" />
    default:
      return null
  }
}

export default function RecentOrders() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentOrders.map((order) => (
            <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-medium">{order.id}</span>
                  <Badge className={getStatusColor(order.status)}>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(order.status)}
                      {order.status}
                    </div>
                  </Badge>
                </div>
                <div className="text-sm text-gray-600">
                  <p>{order.customer}</p>
                  <p>{order.email}</p>
                  <p>
                    {order.items} items • {order.date}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-lg">${order.total}</p>
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
