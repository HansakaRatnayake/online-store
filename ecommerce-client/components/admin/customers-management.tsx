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


// const mockCustomers = [
//   {
//     id: 1,
//     name: "John Doe",
//     email: "john@example.com",
//     phone: "+1 (555) 123-4567",
//     avatar: "/placeholder.svg?height=40&width=40",
//     status: "active",
//     joinDate: "2024-01-15",
//     lastOrder: "2024-01-20",
//     totalOrders: 12,
//     totalSpent: 2459.88,
//     address: "123 Main St, New York, NY 10001",
//     orders: [
//       { id: "ORD-001", date: "2024-01-20", total: 299.99, status: "delivered" },
//       { id: "ORD-015", date: "2024-01-10", total: 159.99, status: "delivered" },
//     ],
//   },
//   {
//     id: 2,
//     name: "Sarah Smith",
//     email: "sarah@example.com",
//     phone: "+1 (555) 987-6543",
//     avatar: "/placeholder.svg?height=40&width=40",
//     status: "active",
//     joinDate: "2024-01-10",
//     lastOrder: "2024-01-18",
//     totalOrders: 8,
//     totalSpent: 1299.92,
//     address: "456 Oak Ave, Los Angeles, CA 90210",
//     orders: [
//       { id: "ORD-002", date: "2024-01-18", total: 199.99, status: "delivered" },
//       { id: "ORD-012", date: "2024-01-05", total: 89.99, status: "delivered" },
//     ],
//   },
//   {
//     id: 3,
//     name: "Mike Johnson",
//     email: "mike@example.com",
//     phone: "+1 (555) 456-7890",
//     avatar: "/placeholder.svg?height=40&width=40",
//     status: "inactive",
//     joinDate: "2023-12-20",
//     lastOrder: "2024-01-16",
//     totalOrders: 15,
//     totalSpent: 3299.85,
//     address: "789 Pine St, Chicago, IL 60601",
//     orders: [
//       { id: "ORD-003", date: "2024-01-16", total: 249.99, status: "delivered" },
//       { id: "ORD-008", date: "2023-12-28", total: 399.99, status: "delivered" },
//     ],
//   },
//   {
//     id: 4,
//     name: "Emily Brown",
//     email: "emily@example.com",
//     phone: "+1 (555) 321-0987",
//     avatar: "/placeholder.svg?height=40&width=40",
//     status: "blocked",
//     joinDate: "2023-11-15",
//     lastOrder: "2024-01-12",
//     totalOrders: 3,
//     totalSpent: 189.97,
//     address: "321 Elm St, Miami, FL 33101",
//     orders: [{ id: "ORD-004", date: "2024-01-12", total: 89.99, status: "cancelled" }],
//   },
// ]

export default function CustomersManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null)
  const { toast } = useToast();
  const { token } =useAuth();

  const [activeCount, setActiveCount] = useState(0);
  const [inactiveCount, setInactiveCount] = useState(0);
  const [blockedCount, setBlockedCount] = useState(0);


  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true)
  const [customers, setCustomers] = useState<any[]>([]);

  useEffect(() => {

    if (!token) return;

    async function fetchData() {
      try {

        const query = new URLSearchParams({
          page: page.toString(),
          limit: "10",
        }).toString()

        // Fetch Customers
        const customerResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/customers?${query}`, {
          // method: "GET",
          // headers: {
          //   "Content-Type": "application/json",
          //   Authorization: `Bearer ${token}`,
          // },
        });
        if (!customerResponse.ok) {
          throw new Error("Failed to fetch Customers!");
        }
        const customerData = await customerResponse.json();

        setCustomers(customerData.customers);

        setTotalPages(customerData.totalPages);
        setTotalCustomers(customerData.totalCount);

        // Fetch Status Count
        const customerStatusResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/status-count`, {
          // method: "GET",
          // headers: {
          //   "Content-Type": "application/json",
          //   Authorization: `Bearer ${token}`,
          // },
        });
        if (!customerStatusResponse.ok) {
          throw new Error("Failed to fetch Customer Status!");
        }
        const customerStatusData = await customerStatusResponse.json();

        setActiveCount(customerStatusData.Active ?? 0);
        setBlockedCount(customerStatusData.Blocked ?? 0);
        setInactiveCount(customerStatusData.Inactive ?? 0);

        setIsLoading(false);
      } catch (err) {
        setError("Error fetching data");
        setIsLoading(false);
        console.error(err);
      }
    }

    fetchData();
  }, [page,token,customers]);

  // const filteredCustomers = customerss.filter((customer) => {
  //   const matchesSearch =
  //     customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  //   const matchesStatus = statusFilter === "all" || customer.status === statusFilter
  //   return matchesSearch && matchesStatus
  // })

  const handleStatusUpdate = async (customerId: string, newStatus: string) => {
    try {
      // Make API call to update user status
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${customerId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // assuming you get token from useAuth
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update customer status");
      }

      const updatedCustomer = await response.json();

      // Update local state
      setCustomers(prev =>
          prev.map((customer) =>
              customer._id === customerId ? { ...customer, status: updatedCustomer.status } : customer
          )
      );

      toast({
        title: "Customer status updated",
        description: `Customer status changed to ${updatedCustomer.status}`,
      });
    } catch (error) {
      console.error("Error updating customer status:", error);
      toast({
        title: "Update failed",
        description: "Could not update customer status. Please try again.",
        variant: "destructive",
      });
    }
  };


  const customerStats = {
    total: customers.length,
    active: customers.filter((c) => c.status === "Active").length,
    inactive: customers.filter((c) => c.status === "Inactive").length,
    blocked: customers.filter((c) => c.status === "Blocked").length,
    totalRevenue: customers.reduce((sum, c) => sum + c.totalSpent, 0),
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



  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{totalCustomers}</p>
              <p className="text-sm text-gray-600">Total Customers</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{activeCount}</p>
              <p className="text-sm text-gray-600">Active</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-600">{inactiveCount}</p>
              <p className="text-sm text-gray-600">Inactive</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{blockedCount}</p>
              <p className="text-sm text-gray-600">Blocked</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">$0</p>
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
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="Blocked">Blocked</SelectItem>
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
                  {/*<TableHead>Orders</TableHead>*/}
                  {/*<TableHead>Total Spent</TableHead>*/}
                  <TableHead>Status</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow key={customer._id}>
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
                          <p className="text-sm text-gray-500 truncate">ID: {customer._id}</p>
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
                          {customer.mobileNo ?? "+94 76 652 9831"}
                        </div>
                      </div>
                    </TableCell>
                    {/*<TableCell>*/}
                    {/*  <div className="text-center">*/}
                    {/*    <p className="font-medium">{customer.totalOrders}</p>*/}
                    {/*    <p className="text-sm text-gray-500">orders</p>*/}
                    {/*  </div>*/}
                    {/*</TableCell>*/}
                    {/*<TableCell className="font-medium">${customer.totalSpent.toFixed(2)}</TableCell>*/}
                    <TableCell>
                      <Badge className={getStatusColor(customer.status ?? "Active" )}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(customer.status ?? "Active")}
                          {customer.status ?? "Active"}
                        </div>
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(customer.createdAt).toLocaleDateString()}</TableCell>
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
                              <DialogTitle>Customer Details - {customer.name}</DialogTitle>
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
                                        <p className="text-gray-600">Customer ID: {selectedCustomer._id}</p>
                                        <Badge className={getStatusColor(selectedCustomer.status ?? "Active")}>
                                          {selectedCustomer.status ?? "Active"}
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
                                            {selectedCustomer.mobileNo ?? "+94 234 1829"}
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4" />
                                            {/*{selectedCustomer.address}*/}
                                          </div>
                                        </div>
                                      </div>
                                      <div>
                                        <h4 className="font-medium mb-2">Account Statistics</h4>
                                        <div className="space-y-2 text-sm">
                                          <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            Joined: {new Date(selectedCustomer.createdAt).toLocaleDateString()}
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <ShoppingBag className="w-4 h-4" />
                                            {/*{selectedCustomer.totalOrders} total orders*/}
                                          </div>
                                          <p>
                                            {/*<strong>Total Spent:</strong> ${selectedCustomer.totalSpent.toFixed(2)}*/}
                                          </p>
                                          <p>
                                            <strong>Last Order:</strong>{" "}
                                            {/*{new Date(selectedCustomer.lastOrder).toLocaleDateString()}*/}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </TabsContent>

                                  {/*<TabsContent value="orders" className="space-y-4">*/}
                                  {/*  <div className="space-y-3">*/}
                                  {/*    {selectedCustomer.orders.map((order: any) => (*/}
                                  {/*      <div*/}
                                  {/*        key={order.id}*/}
                                  {/*        className="flex justify-between items-center p-3 border rounded"*/}
                                  {/*      >*/}
                                  {/*        <div>*/}
                                  {/*          <p className="font-medium">{order.id}</p>*/}
                                  {/*          <p className="text-sm text-gray-500">*/}
                                  {/*            {new Date(order.date).toLocaleDateString()}*/}
                                  {/*          </p>*/}
                                  {/*        </div>*/}
                                  {/*        <div className="text-right">*/}
                                  {/*          <p className="font-medium">${order.total.toFixed(2)}</p>*/}
                                  {/*          <Badge className={getStatusColor(order.status)}>{order.status}</Badge>*/}
                                  {/*        </div>*/}
                                  {/*      </div>*/}
                                  {/*    ))}*/}
                                  {/*  </div>*/}
                                  {/*</TabsContent>*/}

                                  <TabsContent value="settings" className="space-y-4">
                                    <div>
                                      <h4 className="font-medium mb-2">Account Status</h4>
                                      <Select
                                        value={selectedCustomer.status ?? "Active"}
                                        onValueChange={(value) => handleStatusUpdate(selectedCustomer._id, value)}
                                      >
                                        <SelectTrigger className="w-48">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="Active">Active</SelectItem>
                                          <SelectItem value="Inactive">Inactive</SelectItem>
                                          <SelectItem value="Blocked">Blocked</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="space-y-2">
                                      <Button variant="outline" className="w-full bg-transparent">
                                        <Mail className="w-4 h-4 mr-2" />
                                        Send Email
                                      </Button>
                                      <Button
                                        variant="outline"
                                        className="w-full text-red-600 hover:text-red-700 bg-transparent"
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
                          value={customer.status ?? "Active"}
                          onValueChange={(value) => handleStatusUpdate(customer._id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Inactive">Inactive</SelectItem>
                            <SelectItem value="Blocked">Blocked</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {/* Pagination Controls */}
            {customers.length > 0 && (
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
