"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package, Eye, Download } from "lucide-react"

const salesData = [
  { month: "Jan", revenue: 12000, orders: 145, customers: 89 },
  { month: "Feb", revenue: 15000, orders: 178, customers: 112 },
  { month: "Mar", revenue: 18000, orders: 210, customers: 134 },
  { month: "Apr", revenue: 22000, orders: 245, customers: 156 },
  { month: "May", revenue: 19000, orders: 198, customers: 143 },
  { month: "Jun", revenue: 25000, orders: 289, customers: 178 },
]

const topProducts = [
  { name: "Premium Wireless Headphones", sales: 145, revenue: 43350, growth: 12.5 },
  { name: "Smart Fitness Watch", sales: 89, revenue: 22225, growth: -5.2 },
  { name: "Designer Leather Jacket", sales: 67, revenue: 13399, growth: 8.7 },
  { name: "Organic Skincare Set", sales: 156, revenue: 14044, growth: 15.3 },
  { name: "Professional Camera Lens", sales: 34, revenue: 20396, growth: 3.1 },
]

const topCategories = [
  { name: "Electronics", sales: 45, revenue: 89500, percentage: 35 },
  { name: "Fashion", sales: 32, revenue: 64000, percentage: 25 },
  { name: "Beauty", sales: 28, revenue: 42000, percentage: 20 },
  { name: "Sports", sales: 18, revenue: 27000, percentage: 12 },
  { name: "Home", sales: 12, revenue: 18000, percentage: 8 },
]

const customerMetrics = [
  { metric: "New Customers", value: 234, change: 12.5, period: "This month" },
  { metric: "Returning Customers", value: 456, change: 8.2, period: "This month" },
  { metric: "Customer Lifetime Value", value: 285.5, change: 15.7, period: "Average" },
  { metric: "Churn Rate", value: 3.2, change: -2.1, period: "This month" },
]

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState("6months")

  const currentMonth = salesData[salesData.length - 1]
  const previousMonth = salesData[salesData.length - 2]
  const revenueGrowth = ((currentMonth.revenue - previousMonth.revenue) / previousMonth.revenue) * 100
  const ordersGrowth = ((currentMonth.orders - previousMonth.orders) / previousMonth.orders) * 100
  const customersGrowth = ((currentMonth.customers - previousMonth.customers) / previousMonth.customers) * 100

  const totalRevenue = salesData.reduce((sum, data) => sum + data.revenue, 0)
  const totalOrders = salesData.reduce((sum, data) => sum + data.orders, 0)
  const totalCustomers = salesData.reduce((sum, data) => sum + data.customers, 0)

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="3months">Last 3 months</SelectItem>
              <SelectItem value="6months">Last 6 months</SelectItem>
              <SelectItem value="1year">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button>
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${totalRevenue.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  {revenueGrowth >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
                  )}
                  <span className={`text-sm ${revenueGrowth >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {Math.abs(revenueGrowth).toFixed(1)}%
                  </span>
                </div>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{totalOrders.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  {ordersGrowth >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
                  )}
                  <span className={`text-sm ${ordersGrowth >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {Math.abs(ordersGrowth).toFixed(1)}%
                  </span>
                </div>
              </div>
              <ShoppingCart className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Customers</p>
                <p className="text-2xl font-bold text-gray-900">{totalCustomers.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  {customersGrowth >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
                  )}
                  <span className={`text-sm ${customersGrowth >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {Math.abs(customersGrowth).toFixed(1)}%
                  </span>
                </div>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
                <p className="text-2xl font-bold text-gray-900">${(totalRevenue / totalOrders).toFixed(2)}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-600">5.2%</span>
                </div>
              </div>
              <Package className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="sales" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="sales">Sales Analytics</TabsTrigger>
          <TabsTrigger value="products">Product Performance</TabsTrigger>
          <TabsTrigger value="customers">Customer Insights</TabsTrigger>
          <TabsTrigger value="traffic">Traffic & Conversion</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sales Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {salesData.map((data, index) => {
                    const maxRevenue = Math.max(...salesData.map((d) => d.revenue))
                    const width = (data.revenue / maxRevenue) * 100

                    return (
                      <div key={data.month} className="flex items-center gap-3">
                        <span className="w-8 text-sm font-medium">{data.month}</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                          <div
                            className="bg-blue-600 h-6 rounded-full flex items-center justify-end pr-2"
                            style={{ width: `${width}%` }}
                          >
                            <span className="text-white text-xs font-medium">${data.revenue.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Top Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Top Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topCategories.map((category) => (
                    <div key={category.name} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{category.name}</span>
                        <span className="text-sm text-gray-600">${category.revenue.toLocaleString()}</span>
                      </div>
                      <Progress value={category.percentage} className="h-2" />
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>{category.sales}% of sales</span>
                        <span>{category.percentage}% of revenue</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={product.name} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-500">{product.sales} units sold</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${product.revenue.toLocaleString()}</p>
                      <div className="flex items-center">
                        {product.growth >= 0 ? (
                          <TrendingUp className="w-3 h-3 text-green-600 mr-1" />
                        ) : (
                          <TrendingDown className="w-3 h-3 text-red-600 mr-1" />
                        )}
                        <span className={`text-sm ${product.growth >= 0 ? "text-green-600" : "text-red-600"}`}>
                          {Math.abs(product.growth).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {customerMetrics.map((metric) => (
              <Card key={metric.metric}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{metric.metric}</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {metric.metric === "Customer Lifetime Value" ? "$" : ""}
                        {metric.value}
                        {metric.metric === "Churn Rate" ? "%" : ""}
                      </p>
                      <div className="flex items-center mt-1">
                        {metric.change >= 0 ? (
                          <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
                        )}
                        <span className={`text-sm ${metric.change >= 0 ? "text-green-600" : "text-red-600"}`}>
                          {Math.abs(metric.change).toFixed(1)}%
                        </span>
                        <span className="text-sm text-gray-500 ml-1">{metric.period}</span>
                      </div>
                    </div>
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="traffic" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Page Views</p>
                    <p className="text-2xl font-bold text-gray-900">45,231</p>
                    <div className="flex items-center mt-1">
                      <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                      <span className="text-sm text-green-600">12.5%</span>
                    </div>
                  </div>
                  <Eye className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                    <p className="text-2xl font-bold text-gray-900">3.2%</p>
                    <div className="flex items-center mt-1">
                      <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                      <span className="text-sm text-green-600">0.8%</span>
                    </div>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Bounce Rate</p>
                    <p className="text-2xl font-bold text-gray-900">42.1%</p>
                    <div className="flex items-center mt-1">
                      <TrendingDown className="w-4 h-4 text-green-600 mr-1" />
                      <span className="text-sm text-green-600">2.3%</span>
                    </div>
                  </div>
                  <TrendingDown className="w-8 h-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
