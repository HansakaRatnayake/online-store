"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Eye, Package, Truck, CheckCircle, XCircle, RefreshCw, Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const mockOrders = [
  {
    id: "ORD-001",
    customer: {
      name: "John Doe",
      email: "john@example.com",
      phone: "+1 (555) 123-4567",
    },
    items: [
      { name: "Premium Wireless Headphones", quantity: 1, price: 299.99 },
      { name: "Phone Case", quantity: 2, price: 19.99 },
    ],
    total: 339.97,
    status: "processing",
    paymentStatus: "paid",
    shippingAddress: "123 Main St, New York, NY 10001",
    orderDate: "2024-01-15T10:30:00Z",
    estimatedDelivery: "2024-01-20",
    trackingNumber: "TRK123456789",
  },
  {
    id: "ORD-002",
    customer: {
      name: "Sarah Smith",
      email: "sarah@example.com",
      phone: "+1 (555) 987-6543",
    },
    items: [{ name: "Designer Leather Jacket", quantity: 1, price: 199.99 }],
    total: 199.99,
    status: "shipped",
    paymentStatus: "paid",
    shippingAddress: "456 Oak Ave, Los Angeles, CA 90210",
    orderDate: "2024-01-14T14:20:00Z",
    estimatedDelivery: "2024-01-18",
    trackingNumber: "TRK987654321",
  },
  {
    id: "ORD-003",
    customer: {
      name: "Mike Johnson",
      email: "mike@example.com",
      phone: "+1 (555) 456-7890",
    },
    items: [
      { name: "Smart Fitness Watch", quantity: 1, price: 249.99 },
      { name: "Watch Band", quantity: 1, price: 29.99 },
      { name: "Screen Protector", quantity: 2, price: 9.99 },
    ],
    total: 299.96,
    status: "delivered",
    paymentStatus: "paid",
    shippingAddress: "789 Pine St, Chicago, IL 60601",
    orderDate: "2024-01-12T09:15:00Z",
    estimatedDelivery: "2024-01-16",
    trackingNumber: "TRK456789123",
  },
  {
    id: "ORD-004",
    customer: {
      name: "Emily Brown",
      email: "emily@example.com",
      phone: "+1 (555) 321-0987",
    },
    items: [{ name: "Organic Skincare Set", quantity: 1, price: 89.99 }],
    total: 89.99,
    status: "pending",
    paymentStatus: "pending",
    shippingAddress: "321 Elm St, Miami, FL 33101",
    orderDate: "2024-01-16T16:45:00Z",
    estimatedDelivery: "2024-01-22",
    trackingNumber: null,
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
    case "cancelled":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
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

export default function OrdersManagement() {
  const [orders, setOrders] = useState(mockOrders)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const { toast } = useToast()

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))
    toast({
      title: "Order updated",
      description: `Order ${orderId} status changed to ${newStatus}`,
    })
  }

  const orderStats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    processing: orders.filter((o) => o.status === "processing").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{orderStats.total}</p>
              <p className="text-sm text-gray-600">Total Orders</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">{orderStats.pending}</p>
              <p className="text-sm text-gray-600">Pending</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{orderStats.processing}</p>
              <p className="text-sm text-gray-600">Processing</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{orderStats.shipped}</p>
              <p className="text-sm text-gray-600">Shipped</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{orderStats.delivered}</p>
              <p className="text-sm text-gray-600">Delivered</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders Management */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>Orders</CardTitle>
            <Button>
              <Download className="w-4 h-4 mr-2" />
              Export Orders
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Orders Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{order.customer.name}</p>
                        <p className="text-sm text-gray-500">{order.customer.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>{order.items.length} items</TableCell>
                    <TableCell className="font-medium">${order.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(order.status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(order.status)}
                          {order.status}
                        </div>
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => setSelectedOrder(order)}>
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Order Details - {order.id}</DialogTitle>
                              <DialogDescription>Complete order information and management</DialogDescription>
                            </DialogHeader>
                            {selectedOrder && (
                              <div className="space-y-6">
                                <Tabs defaultValue="details" className="w-full">
                                  <TabsList className="grid w-full grid-cols-3">
                                    <TabsTrigger value="details">Details</TabsTrigger>
                                    <TabsTrigger value="items">Items</TabsTrigger>
                                    <TabsTrigger value="shipping">Shipping</TabsTrigger>
                                  </TabsList>

                                  <TabsContent value="details" className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <h4 className="font-medium mb-2">Customer Information</h4>
                                        <div className="space-y-1 text-sm">
                                          <p>
                                            <strong>Name:</strong> {selectedOrder.customer.name}
                                          </p>
                                          <p>
                                            <strong>Email:</strong> {selectedOrder.customer.email}
                                          </p>
                                          <p>
                                            <strong>Phone:</strong> {selectedOrder.customer.phone}
                                          </p>
                                        </div>
                                      </div>
                                      <div>
                                        <h4 className="font-medium mb-2">Order Information</h4>
                                        <div className="space-y-1 text-sm">
                                          <p>
                                            <strong>Order Date:</strong>{" "}
                                            {new Date(selectedOrder.orderDate).toLocaleString()}
                                          </p>
                                          <p>
                                            <strong>Total:</strong> ${selectedOrder.total.toFixed(2)}
                                          </p>
                                          <p>
                                            <strong>Payment:</strong> {selectedOrder.paymentStatus}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                    <div>
                                      <h4 className="font-medium mb-2">Update Status</h4>
                                      <Select
                                        value={selectedOrder.status}
                                        onValueChange={(value) => handleStatusUpdate(selectedOrder.id, value)}
                                      >
                                        <SelectTrigger className="w-48">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="pending">Pending</SelectItem>
                                          <SelectItem value="processing">Processing</SelectItem>
                                          <SelectItem value="shipped">Shipped</SelectItem>
                                          <SelectItem value="delivered">Delivered</SelectItem>
                                          <SelectItem value="cancelled">Cancelled</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </TabsContent>

                                  <TabsContent value="items" className="space-y-4">
                                    <div className="space-y-3">
                                      {selectedOrder.items.map((item: any, index: number) => (
                                        <div
                                          key={index}
                                          className="flex justify-between items-center p-3 border rounded"
                                        >
                                          <div>
                                            <p className="font-medium">{item.name}</p>
                                            <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                                          </div>
                                          <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                      ))}
                                    </div>
                                  </TabsContent>

                                  <TabsContent value="shipping" className="space-y-4">
                                    <div>
                                      <h4 className="font-medium mb-2">Shipping Address</h4>
                                      <p className="text-sm">{selectedOrder.shippingAddress}</p>
                                    </div>
                                    <div>
                                      <h4 className="font-medium mb-2">Delivery Information</h4>
                                      <div className="space-y-1 text-sm">
                                        <p>
                                          <strong>Estimated Delivery:</strong> {selectedOrder.estimatedDelivery}
                                        </p>
                                        <p>
                                          <strong>Tracking Number:</strong>{" "}
                                          {selectedOrder.trackingNumber || "Not assigned"}
                                        </p>
                                      </div>
                                    </div>
                                  </TabsContent>
                                </Tabs>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Select value={order.status} onValueChange={(value) => handleStatusUpdate(order.id, value)}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
