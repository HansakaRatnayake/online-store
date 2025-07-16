"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Store, Mail, Bell, Shield, CreditCard, Truck, Globe, Palette, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function AdminSettings() {
  const { toast } = useToast()
  const [settings, setSettings] = useState({
    // Store Settings
    storeName: "EliteStore",
    storeDescription: "Premium e-commerce platform for quality products",
    storeEmail: "admin@elitestore.com",
    storePhone: "+1 (555) 123-4567",
    storeAddress: "123 Commerce St, Business City, BC 12345",
    currency: "USD",
    timezone: "America/New_York",

    // Email Settings
    emailNotifications: true,
    orderNotifications: true,
    marketingEmails: false,
    smtpHost: "smtp.gmail.com",
    smtpPort: "587",
    smtpUsername: "",
    smtpPassword: "",

    // Notification Settings
    pushNotifications: true,
    smsNotifications: false,
    lowStockAlerts: true,
    newOrderAlerts: true,

    // Security Settings
    twoFactorAuth: false,
    sessionTimeout: "30",
    passwordPolicy: "strong",

    // Payment Settings
    stripeEnabled: true,
    paypalEnabled: true,
    codEnabled: false,

    // Shipping Settings
    freeShippingThreshold: "100",
    standardShippingRate: "9.99",
    expressShippingRate: "19.99",

    // SEO Settings
    metaTitle: "EliteStore - Premium E-Commerce",
    metaDescription: "Discover premium products with secure shopping experience",
    metaKeywords: "ecommerce, shopping, premium products",

    // Theme Settings
    primaryColor: "#3B82F6",
    secondaryColor: "#8B5CF6",
    darkMode: false,
  })

  const handleSave = (section: string) => {
    toast({
      title: "Settings saved",
      description: `${section} settings have been updated successfully.`,
    })
  }

  const handleInputChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <Tabs defaultValue="store" className="w-full">
      <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
        <TabsTrigger value="store">Store</TabsTrigger>
        <TabsTrigger value="email">Email</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
        <TabsTrigger value="payments">Payments</TabsTrigger>
        <TabsTrigger value="shipping">Shipping</TabsTrigger>
        <TabsTrigger value="seo">SEO</TabsTrigger>
        <TabsTrigger value="theme">Theme</TabsTrigger>
      </TabsList>

      <TabsContent value="store" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="w-5 h-5" />
              Store Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="storeName">Store Name</Label>
                <Input
                  id="storeName"
                  value={settings.storeName}
                  onChange={(e) => handleInputChange("storeName", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="storeEmail">Store Email</Label>
                <Input
                  id="storeEmail"
                  type="email"
                  value={settings.storeEmail}
                  onChange={(e) => handleInputChange("storeEmail", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="storeDescription">Store Description</Label>
              <Textarea
                id="storeDescription"
                value={settings.storeDescription}
                onChange={(e) => handleInputChange("storeDescription", e.target.value)}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="storePhone">Phone Number</Label>
                <Input
                  id="storePhone"
                  value={settings.storePhone}
                  onChange={(e) => handleInputChange("storePhone", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select value={settings.currency} onValueChange={(value) => handleInputChange("currency", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD - US Dollar</SelectItem>
                    <SelectItem value="EUR">EUR - Euro</SelectItem>
                    <SelectItem value="GBP">GBP - British Pound</SelectItem>
                    <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="storeAddress">Store Address</Label>
              <Textarea
                id="storeAddress"
                value={settings.storeAddress}
                onChange={(e) => handleInputChange("storeAddress", e.target.value)}
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select value={settings.timezone} onValueChange={(value) => handleInputChange("timezone", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/New_York">Eastern Time</SelectItem>
                  <SelectItem value="America/Chicago">Central Time</SelectItem>
                  <SelectItem value="America/Denver">Mountain Time</SelectItem>
                  <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                  <SelectItem value="UTC">UTC</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={() => handleSave("Store")} className="w-full">
              <Save className="w-4 h-4 mr-2" />
              Save Store Settings
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="email" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Email Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-gray-500">Receive email notifications for important events</p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => handleInputChange("emailNotifications", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Order Notifications</Label>
                  <p className="text-sm text-gray-500">Get notified when new orders are placed</p>
                </div>
                <Switch
                  checked={settings.orderNotifications}
                  onCheckedChange={(checked) => handleInputChange("orderNotifications", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Marketing Emails</Label>
                  <p className="text-sm text-gray-500">Send promotional emails to customers</p>
                </div>
                <Switch
                  checked={settings.marketingEmails}
                  onCheckedChange={(checked) => handleInputChange("marketingEmails", checked)}
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="font-medium">SMTP Configuration</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtpHost">SMTP Host</Label>
                  <Input
                    id="smtpHost"
                    value={settings.smtpHost}
                    onChange={(e) => handleInputChange("smtpHost", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPort">SMTP Port</Label>
                  <Input
                    id="smtpPort"
                    value={settings.smtpPort}
                    onChange={(e) => handleInputChange("smtpPort", e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtpUsername">SMTP Username</Label>
                  <Input
                    id="smtpUsername"
                    value={settings.smtpUsername}
                    onChange={(e) => handleInputChange("smtpUsername", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPassword">SMTP Password</Label>
                  <Input
                    id="smtpPassword"
                    type="password"
                    value={settings.smtpPassword}
                    onChange={(e) => handleInputChange("smtpPassword", e.target.value)}
                  />
                </div>
              </div>
            </div>

            <Button onClick={() => handleSave("Email")} className="w-full">
              <Save className="w-4 h-4 mr-2" />
              Save Email Settings
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="notifications" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notification Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Push Notifications</Label>
                  <p className="text-sm text-gray-500">Receive browser push notifications</p>
                </div>
                <Switch
                  checked={settings.pushNotifications}
                  onCheckedChange={(checked) => handleInputChange("pushNotifications", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>SMS Notifications</Label>
                  <p className="text-sm text-gray-500">Receive SMS alerts for critical events</p>
                </div>
                <Switch
                  checked={settings.smsNotifications}
                  onCheckedChange={(checked) => handleInputChange("smsNotifications", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Low Stock Alerts</Label>
                  <p className="text-sm text-gray-500">Get notified when products are running low</p>
                </div>
                <Switch
                  checked={settings.lowStockAlerts}
                  onCheckedChange={(checked) => handleInputChange("lowStockAlerts", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>New Order Alerts</Label>
                  <p className="text-sm text-gray-500">Instant notifications for new orders</p>
                </div>
                <Switch
                  checked={settings.newOrderAlerts}
                  onCheckedChange={(checked) => handleInputChange("newOrderAlerts", checked)}
                />
              </div>
            </div>

            <Button onClick={() => handleSave("Notifications")} className="w-full">
              <Save className="w-4 h-4 mr-2" />
              Save Notification Settings
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="security" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Security Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                </div>
                <Switch
                  checked={settings.twoFactorAuth}
                  onCheckedChange={(checked) => handleInputChange("twoFactorAuth", checked)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) => handleInputChange("sessionTimeout", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="passwordPolicy">Password Policy</Label>
                <Select
                  value={settings.passwordPolicy}
                  onValueChange={(value) => handleInputChange("passwordPolicy", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weak">Weak - Minimum 6 characters</SelectItem>
                    <SelectItem value="medium">Medium - 8 characters with numbers</SelectItem>
                    <SelectItem value="strong">Strong - 8 characters with mixed case and symbols</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button onClick={() => handleSave("Security")} className="w-full">
              <Save className="w-4 h-4 mr-2" />
              Save Security Settings
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="payments" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Payment Methods
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-6 bg-blue-600 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">S</span>
                  </div>
                  <div>
                    <Label>Stripe</Label>
                    <p className="text-sm text-gray-500">Accept credit and debit cards</p>
                  </div>
                </div>
                <Switch
                  checked={settings.stripeEnabled}
                  onCheckedChange={(checked) => handleInputChange("stripeEnabled", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-6 bg-blue-500 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">PP</span>
                  </div>
                  <div>
                    <Label>PayPal</Label>
                    <p className="text-sm text-gray-500">Accept PayPal payments</p>
                  </div>
                </div>
                <Switch
                  checked={settings.paypalEnabled}
                  onCheckedChange={(checked) => handleInputChange("paypalEnabled", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-6 bg-green-600 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">COD</span>
                  </div>
                  <div>
                    <Label>Cash on Delivery</Label>
                    <p className="text-sm text-gray-500">Accept cash payments on delivery</p>
                  </div>
                </div>
                <Switch
                  checked={settings.codEnabled}
                  onCheckedChange={(checked) => handleInputChange("codEnabled", checked)}
                />
              </div>
            </div>

            <Button onClick={() => handleSave("Payments")} className="w-full">
              <Save className="w-4 h-4 mr-2" />
              Save Payment Settings
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="shipping" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="w-5 h-5" />
              Shipping Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="freeShippingThreshold">Free Shipping Threshold ($)</Label>
                <Input
                  id="freeShippingThreshold"
                  type="number"
                  value={settings.freeShippingThreshold}
                  onChange={(e) => handleInputChange("freeShippingThreshold", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="standardShippingRate">Standard Shipping Rate ($)</Label>
                <Input
                  id="standardShippingRate"
                  type="number"
                  step="0.01"
                  value={settings.standardShippingRate}
                  onChange={(e) => handleInputChange("standardShippingRate", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expressShippingRate">Express Shipping Rate ($)</Label>
                <Input
                  id="expressShippingRate"
                  type="number"
                  step="0.01"
                  value={settings.expressShippingRate}
                  onChange={(e) => handleInputChange("expressShippingRate", e.target.value)}
                />
              </div>
            </div>

            <Button onClick={() => handleSave("Shipping")} className="w-full">
              <Save className="w-4 h-4 mr-2" />
              Save Shipping Settings
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="seo" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              SEO Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="metaTitle">Meta Title</Label>
              <Input
                id="metaTitle"
                value={settings.metaTitle}
                onChange={(e) => handleInputChange("metaTitle", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="metaDescription">Meta Description</Label>
              <Textarea
                id="metaDescription"
                value={settings.metaDescription}
                onChange={(e) => handleInputChange("metaDescription", e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="metaKeywords">Meta Keywords</Label>
              <Input
                id="metaKeywords"
                value={settings.metaKeywords}
                onChange={(e) => handleInputChange("metaKeywords", e.target.value)}
                placeholder="Separate keywords with commas"
              />
            </div>

            <Button onClick={() => handleSave("SEO")} className="w-full">
              <Save className="w-4 h-4 mr-2" />
              Save SEO Settings
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="theme" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Theme Customization
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="primaryColor">Primary Color</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="primaryColor"
                    type="color"
                    value={settings.primaryColor}
                    onChange={(e) => handleInputChange("primaryColor", e.target.value)}
                    className="w-16 h-10"
                  />
                  <Input
                    value={settings.primaryColor}
                    onChange={(e) => handleInputChange("primaryColor", e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="secondaryColor">Secondary Color</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="secondaryColor"
                    type="color"
                    value={settings.secondaryColor}
                    onChange={(e) => handleInputChange("secondaryColor", e.target.value)}
                    className="w-16 h-10"
                  />
                  <Input
                    value={settings.secondaryColor}
                    onChange={(e) => handleInputChange("secondaryColor", e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Dark Mode</Label>
                <p className="text-sm text-gray-500">Enable dark theme for the admin panel</p>
              </div>
              <Switch
                checked={settings.darkMode}
                onCheckedChange={(checked) => handleInputChange("darkMode", checked)}
              />
            </div>

            <Button onClick={() => handleSave("Theme")} className="w-full">
              <Save className="w-4 h-4 mr-2" />
              Save Theme Settings
            </Button>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
