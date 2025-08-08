"use client"

import {useEffect, useState} from "react"
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
import {useAuth} from "@/components/providers/auth-provider";

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
  const [orders, setOrders] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const { user, token } = useAuth();

  async function fetchData() {
    try {

      const query = new URLSearchParams({
        page: page.toString(),
        limit: "10",
      }).toString()

      // Fetch Orders
      const OrderResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders?${query}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!OrderResponse.ok) {
        throw new Error("Failed to fetch orders!");
      }
      const orderData = await OrderResponse.json();

      setOrders(orderData.orders);

      setTotalPages(orderData.totalPages);

      setIsLoading(false);
    } catch (err) {
      setError("Error fetching data");
      setIsLoading(false);
      console.error(err);
    }
  }

  useEffect(() => {

    if (!token) return;
    fetchData();
  }, [page,token]);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.userId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleStatusUpdate = async (order:any, newStatus:any) => {
    // setOrders((prev) =>
    //     prev.map((order) =>
    //         order.orderNumber === orderNumber ? { ...order, status: newStatus } : order
    //     )
    // )



    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/${order._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: newStatus }),
    })
    toast({
      title: "Order updated",
      description: `Order ${order.orderNumber} status changed to ${newStatus}`,
    })
    await fetchData();
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
                  <TableHead>Order #</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                    <TableRow key={order.orderNumber}>
                      <TableCell className="font-medium">{order.orderNumber}</TableCell>
                      <TableCell className="text-sm text-gray-600">{order.userId}</TableCell>
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
                      <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
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
                                <DialogTitle>Order Details - {order.orderNumber}</DialogTitle>
                                <DialogDescription>Full order breakdown</DialogDescription>
                              </DialogHeader>
                              {selectedOrder && (
                                  <Tabs defaultValue="details" className="w-full mt-4">
                                    <TabsList className="grid grid-cols-3">
                                      <TabsTrigger value="details">Details</TabsTrigger>
                                      <TabsTrigger value="items">Items</TabsTrigger>
                                      <TabsTrigger value="shipping">Shipping</TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="details" className="space-y-4">
                                      <div className="text-sm space-y-1">
                                        <p><strong>User ID:</strong> {selectedOrder.userId}</p>
                                        <p><strong>Total:</strong> ${selectedOrder.total.toFixed(2)}</p>
                                        <p><strong>Status:</strong> {selectedOrder.status}</p>
                                        <p><strong>Created:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                                      </div>
                                      <div>
                                        <h4 className="font-medium mt-4 mb-2">Update Status</h4>
                                        <Select
                                            value={selectedOrder.status}
                                            onValueChange={(value) =>
                                                handleStatusUpdate(selectedOrder.orderNumber, value)
                                            }
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

                                    <TabsContent value="items" className="space-y-3">
                                      {selectedOrder.items.map((item: any, idx: number) => (
                                          <div key={idx} className="flex justify-between border p-2 rounded">
                                            <div>
                                              <p className="font-medium">{item.name}</p>
                                              <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                            </div>
                                            <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                                          </div>
                                      ))}
                                    </TabsContent>

                                    <TabsContent value="shipping" className="space-y-2 text-sm">
                                      <p>
                                        <strong>To:</strong> {selectedOrder.shippingAddress.name}
                                      </p>
                                      <p>
                                        {selectedOrder.shippingAddress.street}, {selectedOrder.shippingAddress.city},{" "}
                                        {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}
                                      </p>
                                      <p>{selectedOrder.shippingAddress.country}</p>
                                      <p>
                                        <strong>Tracking Number:</strong>{" "}
                                        {selectedOrder.trackingNumber || "Not assigned"}
                                      </p>
                                    </TabsContent>
                                  </Tabs>
                              )}
                            </DialogContent>
                          </Dialog>

                          <Select value={order.status} onValueChange={(val) => handleStatusUpdate(order,val)}>
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
            {/* Pagination Controls */}
            {orders.length > 0 && (
                <div className="flex justify-center items-center gap-4 mt-6 mb-2">
                  <Button
                      variant="outline"
                      disabled={page === 1}
                      onClick={() => setPage(page - 1)}
                  >
                    Previous
                  </Button>
                  <span className="text-gray-600">
                                    Page {page} of {totalPages}
                                </span>
                  <Button
                      variant="outline"
                      disabled={page === totalPages}
                      onClick={() => setPage(page + 1)}
                  >
                    Next
                  </Button>
                </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
