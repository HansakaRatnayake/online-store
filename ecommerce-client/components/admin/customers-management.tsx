"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
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
import { Search, Eye, Mail, Phone, MapPin, ShoppingBag, Calendar, Ban, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "../providers/auth-provider"


export default function CustomersManagement() {
  const [customers, setCustomers] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null)
  const { toast } = useToast()
  const { token } = useAuth()
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [customerStats, setCustomerStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    blocked: 0,
    totalRevenue: 0,
  })


  useEffect(() => {
    if (!token) {
      setError("Authentication required")
      setIsLoading(false)
      return
    }

    async function fetchData() {
      try {
        setIsLoading(true)

        // Fetch customers
        const query = new URLSearchParams({
          page: page.toString(),
          limit: "10",
          search: searchTerm,
          status: statusFilter,
        }).toString()

        const customerResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/customers?${query}`, {

          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        if (!customerResponse.ok) {
          throw new Error("Failed to fetch customers")

        }
        const customerData = await customerResponse.json()
        setCustomers(customerData.users)
        setTotalPages(customerData.totalPages)


        // Fetch stats
        const statsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/customers/stats`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        if (!statsResponse.ok) {
          throw new Error("Failed to fetch stats")
        }
        const statsData = await statsResponse.json()
        setCustomerStats(statsData)


        setIsLoading(false)
      } catch (err: any) {
        setError(err.message || "Error fetching data")
        setIsLoading(false)
        console.error(err)
      }
    }


    fetchData()
  }, [page, token, searchTerm, statusFilter])

  const handleStatusUpdate = async (customerId: string, newStatus: string) => {
    try {

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${customerId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!response.ok) {
        throw new Error("Failed to update status")
      }
      const updatedCustomer = await response.json()
      setCustomers(customers.map((customer) =>
          customer.id === customerId ? { ...customer, status: newStatus } : customer
      ))
      if (selectedCustomer?.id === customerId) {
        setSelectedCustomer({ ...selectedCustomer, status: newStatus })
      }
      toast({
        title: "Customer status updated",
        description: `Customer status changed to ${newStatus}`,
      })

      // Refresh stats
      const statsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/customers/stats`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setCustomerStats(statsData)
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to update customer status",
        variant: "destructive",
      })
    }
  }

  const handleSendEmail = async (customerId: string, email: string) => {
    try {
      const subject = prompt("Enter email subject:")
      const message = prompt("Enter email message:")
      if (!subject || !message) {
        toast({
          title: "Error",
          description: "Subject and message are required",
          variant: "destructive",
        })
        return
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${customerId}/send-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ subject, message }),
      })
      if (!response.ok) {
        throw new Error("Failed to send email")
      }
      toast({
        title: "Success",
        description: `Email sent to ${email}`,
      })
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to send email",
        variant: "destructive",
      })
    }
  }

  const handleResetPassword = async (customerId: string, email: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${customerId}/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      if (!response.ok) {
        throw new Error("Failed to reset password")
      }
      toast({
        title: "Success",
        description: `Password reset email sent to ${email}`,
      })
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to reset password",
        variant: "destructive",
      })
    }

  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800"
      case "Inactive":
        return "bg-gray-100 text-gray-800"
      case "Blocked":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Active":
        return <CheckCircle className="w-3 h-3" />
      case "Blocked":
        return <Ban className="w-3 h-3" />
      default:
        return <Ban className="w-3 h-3" />
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div className="text-red-600">{error}</div>
  }

  return (

      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{customerStats.total}</p>
                <p className="text-sm text-gray-600">Total Customers</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{customerStats.active}</p>
                <p className="text-sm text-gray-600">Active</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-600">{customerStats.inactive}</p>
                <p className="text-sm text-gray-600">Inactive</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">{customerStats.blocked}</p>
                <p className="text-sm text-gray-600">Blocked</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">${customerStats.totalRevenue.toFixed(2)}</p>
                <p className="text-sm text-gray-600">Total Revenue</p>
              </div>
            </CardContent>
          </Card>
        </div>


        {/* Customers Management */}
        <Card>
          <CardHeader>
            <CardTitle>Customers</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                    placeholder="Search customers..."
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
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                </SelectContent>
              </Select>
            </div>


            {/* Customers Table */}
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Total Spent</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Image
                                src={customer.avatar || "/placeholder.svg"}
                                alt={customer.name}
                                width={40}
                                height={40}
                                className="rounded-full"
                            />
                            <div>
                              <p className="font-medium">{customer.name}</p>
                              <p className="text-sm text-gray-500">ID: {customer.id}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-sm">
                              <Mail className="w-3 h-3" />
                              {customer.email}
                            </div>
                            <div className="flex items-center gap-1 text-sm">
                              <Phone className="w-3 h-3" />
                              {customer.phone || "N/A"}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-center">
                            <p className="font-medium">{customer.totalOrders}</p>
                            <p className="text-sm text-gray-500">orders</p>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">${customer.totalSpent.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(customer.status)}>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(customer.status)}
                              {customer.status}
                            </div>
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(customer.joinDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={() => setSelectedCustomer(customer)}>
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Customer Details - {selectedCustomer?.name}</DialogTitle>
                                  <DialogDescription>Complete customer information and order history</DialogDescription>
                                </DialogHeader>
                                {selectedCustomer && (
                                    <div className="space-y-6">
                                      <Tabs defaultValue="profile" className="w-full">
                                        <TabsList className="grid w-full grid-cols-3">
                                          <TabsTrigger value="profile">Profile</TabsTrigger>
                                          <TabsTrigger value="orders">Orders</TabsTrigger>
                                          <TabsTrigger value="settings">Settings</TabsTrigger>
                                        </TabsList>

                                        <TabsContent value="profile" className="space-y-4">
                                          <div className="flex items-center gap-4">
                                            <Image
                                                src={selectedCustomer.avatar || "/placeholder.svg"}
                                                alt={selectedCustomer.name}
                                                width={80}
                                                height={80}
                                                className="rounded-full"
                                            />
                                            <div>
                                              <h3 className="text-lg font-semibold">{selectedCustomer.name}</h3>
                                              <p className="text-gray-600">Customer ID: {selectedCustomer.id}</p>
                                              <Badge className={getStatusColor(selectedCustomer.status)}>
                                                {selectedCustomer.status}
                                              </Badge>
                                            </div>
                                          </div>
                                          <div className="grid grid-cols-2 gap-4">
                                            <div>
                                              <h4 className="font-medium mb-2">Contact Information</h4>
                                              <div className="space-y-2 text-sm">
                                                <div className="flex items-center gap-2">
                                                  <Mail className="w-4 h-4" />
                                                  {selectedCustomer.email}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                  <Phone className="w-4 h-4" />
                                                  {selectedCustomer.phone || "N/A"}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                  <MapPin className="w-4 h-4" />
                                                  {selectedCustomer.address || "N/A"}
                                                </div>
                                              </div>
                                            </div>
                                            <div>
                                              <h4 className="font-medium mb-2">Account Statistics</h4>
                                              <div className="space-y-2 text-sm">
                                                <div className="flex items-center gap-2">
                                                  <Calendar className="w-4 h-4" />
                                                  Joined: {new Date(selectedCustomer.joinDate).toLocaleDateString()}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                  <ShoppingBag className="w-4 h-4" />
                                                  {selectedCustomer.totalOrders} total orders
                                                </div>
                                                <p>
                                                  <strong>Total Spent:</strong> ${selectedCustomer.totalSpent.toFixed(2)}
                                                </p>
                                                <p>
                                                  <strong>Last Order:</strong>{" "}
                                                  {selectedCustomer.lastOrder ? new Date(selectedCustomer.lastOrder).toLocaleDateString() : "N/A"}
                                                </p>
                                              </div>
                                            </div>
                                          </div>
                                        </TabsContent>

                                        <TabsContent value="orders" className="space-y-4">
                                          <div className="space-y-3">
                                            {selectedCustomer.orders.map((order: any) => (
                                                <div
                                                    key={order.id}
                                                    className="flex justify-between items-center p-3 border rounded"
                                                >
                                                  <div>
                                                    <p className="font-medium">{order.id}</p>
                                                    <p className="text-sm text-gray-500">
                                                      {new Date(order.date).toLocaleDateString()}
                                                    </p>
                                                  </div>
                                                  <div className="text-right">
                                                    <p className="font-medium">${order.total.toFixed(2)}</p>
                                                    <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                                                  </div>
                                                </div>
                                            ))}
                                          </div>
                                        </TabsContent>

                                        <TabsContent value="settings" className="space-y-4">
                                          <div>
                                            <h4 className="font-medium mb-2">Account Status</h4>
                                            <Select
                                                value={selectedCustomer.status}
                                                onValueChange={(value) => handleStatusUpdate(selectedCustomer.id, value)}
                                            >
                                              <SelectTrigger className="w-48">
                                                <SelectValue />
                                              </SelectTrigger>
                                              <SelectContent>
                                                <SelectItem value="active">Active</SelectItem>
                                                <SelectItem value="inactive">Inactive</SelectItem>
                                                <SelectItem value="blocked">Blocked</SelectItem>
                                              </SelectContent>
                                            </Select>
                                          </div>
                                          <div className="space-y-2">
                                            <Button
                                                variant="outline"
                                                className="w-full bg-transparent"
                                                onClick={() => handleSendEmail(selectedCustomer.id, selectedCustomer.email)}
                                            >
                                              <Mail className="w-4 h-4 mr-2" />
                                              Send Email
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="w-full text-red-600 hover:text-red-700 bg-transparent"
                                                onClick={() => handleResetPassword(selectedCustomer.id, selectedCustomer.email)}
                                            >
                                              Reset Password
                                            </Button>
                                          </div>
                                        </TabsContent>
                                      </Tabs>
                                    </div>
                                )}
                              </DialogContent>
                            </Dialog>
                            <Select
                                value={customer.status}
                                onValueChange={(value) => handleStatusUpdate(customer.id, value)}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                                <SelectItem value="blocked">Blocked</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </TableCell>
                      </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
              <Button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
              >
                Previous
              </Button>
              <span>
              Page {page} of {totalPages}
            </span>
              <Button
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

  )
}