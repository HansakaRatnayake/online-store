"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { User, Mail, Phone, MapPin, Calendar, ShoppingBag, Bell, Shield, Camera, Save, Edit } from "lucide-react"
import { useAuth } from "@/components/providers/auth-provider"
import { useToast } from "@/hooks/use-toast"

export default function UserProfile() {
  const { user, token } = useAuth()
  const { toast } = useToast()

  const [profile, setProfile] = useState({

    id: "",
    name: "",
    email: "",
    mobileNo: "",
    dob: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    role: "" as "customer" | "admin" | "seller",
    notificationPreferences: {
      emailNotifications: true,
      smsNotifications: false,
      marketingEmails: true,
      orderUpdates: true,
    },
    avatar: null as string | null,
    createdAt: "",

  })
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [orders, setOrders] = useState<any[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("personal")

  useEffect(() => {
    if (!token) {
      setError("Authentication required")
      setIsLoading(false)
      return
    }

    async function fetchProfile() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        if (!res.ok) throw new Error("Failed to fetch profile")
        const data = await res.json()
        setProfile({
          id: data.id,
          name: data.name,
          email: data.email,
          mobileNo: data.mobileNo || "",
          dob: data.dob ? new Date(data.dob).toISOString().split("T")[0] : "",
          address: data.address ? data.address.split(", ")[0] || "" : "",
          city: data.address ? data.address.split(", ")[1] || "" : "",
          state: data.address ? data.address.split(", ")[2] || "" : "",
          zipCode: data.address ? data.address.split(", ")[3] || "" : "",
          country: data.country || "",
          role: data.role || "customer",
          notificationPreferences: data.notificationPreferences || {
            emailNotifications: true,
            smsNotifications: false,
            marketingEmails: true,
            orderUpdates: true,
          },
          avatar: data.avatar,
          createdAt: data.createdAt || "",
        })
        setIsLoading(false)
      } catch (err: any) {
        setError(err.message || "Failed to fetch profile")
        setIsLoading(false)
      }
    }

    async function fetchOrders() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/customer?page=1&limit=10`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        if (!res.ok) throw new Error("Failed to fetch orders")
        const data = await res.json()
        setOrders(data.orders)
      } catch (err: any) {
        console.error("Error fetching orders:", err)
      }
    }

    fetchProfile()
    fetchOrders()
  }, [token])

  useEffect(() => {
    if (avatarFile) {
      const previewUrl = URL.createObjectURL(avatarFile)
      setAvatarPreview(previewUrl)
      return () => URL.revokeObjectURL(previewUrl) // Clean up URL on unmount or file change
    } else {
      setAvatarPreview(null)
    }
  }, [avatarFile])

  const handleInputChange = (key: string, value: any) => {
    setProfile((prev) => ({ ...prev, [key]: value }))
  }

  const handleNotificationChange = (key: string, value: boolean) => {
    setProfile((prev) => ({
      ...prev,
      notificationPreferences: { ...prev.notificationPreferences, [key]: value },
    }))
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0])
    }
  }

  const handleAvatarUpload = async () => {
    if (!avatarFile) {
      toast({ title: "Error", description: "No file selected", variant: "destructive" })
      return
    }

    const formData = new FormData()
    formData.append("avatar", avatarFile)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/upload-avatar`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Failed to upload avatar")
      }
      const data = await res.json()
      setProfile((prev) => ({ ...prev, avatar: data.avatar }))
      setAvatarFile(null)
      setAvatarPreview(null)
      toast({ title: "Success", description: "Avatar uploaded successfully" })
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to upload avatar", variant: "destructive" })
    }
  }

  const handleSave = async () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
      toast({ title: "Error", description: "Invalid email format", variant: "destructive" })
      return
    }

    try {
      const address = `${profile.address}, ${profile.city}, ${profile.state}, ${profile.zipCode}`
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${profile.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: profile.name,
          email: profile.email,
          mobileNo: profile.mobileNo,
          country: profile.country,
          dob: profile.dob,
          address,
          notificationPreferences: profile.notificationPreferences,
        }),
      })
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Failed to update profile")
      }
      setIsEditing(false)
      toast({ title: "Success", description: "Profile updated successfully" })
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to update profile", variant: "destructive" })
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast({ title: "Error", description: "New password and confirm password do not match", variant: "destructive" })
      return
    }
    if (passwords.newPassword.length < 8) {
      toast({ title: "Error", description: "New password must be at least 8 characters long", variant: "destructive" })
      return
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword,
        }),
      })
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Failed to change password")
      }
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" })
      toast({ title: "Success", description: "Password changed successfully" })
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to change password", variant: "destructive" })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800"
      case "shipped":
        return "bg-blue-100 text-blue-800"
      case "processing":
        return "bg-yellow-100 text-yellow-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (isLoading) return <div>Loading profile...</div>
  if (error) return <div className="text-red-600">{error}</div>

  return (

      <div className="space-y-6">
        {/* Profile Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <Image
                    src={profile.avatar || "/placeholder-user.jpg?height=100&width=100"}
                    alt={profile.name}
                    width={100}
                    height={100}
                    className="rounded-full object-cover"
                />
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="icon" className="absolute bottom-0 right-0 rounded-full w-8 h-8">
                      <Camera className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Change Profile Picture</DialogTitle>
                      <DialogDescription>Upload a new profile picture</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      {avatarPreview && (
                          <div className="flex justify-center">
                            <Image
                                src={avatarPreview}
                                alt="Avatar Preview"
                                width={100}
                                height={100}
                                className="rounded-full object-cover"
                            />
                          </div>
                      )}
                      <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Camera className="w-8 h-8 mb-4 text-gray-500" />
                            <p className="mb-2 text-sm text-gray-500">
                              <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-gray-500">PNG, JPG or GIF (MAX. 5MB)</p>
                          </div>
                          <input type="file" className="hidden" accept="image/png,image/jpeg,image/gif" onChange={handleAvatarChange} />
                        </label>
                      </div>
                      <Button onClick={handleAvatarUpload} disabled={!avatarFile}>Upload Picture</Button>

                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
                  <Badge variant="secondary">{profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}</Badge>
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {profile.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    {profile.mobileNo || "Not provided"}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {profile.city && profile.state ? `${profile.city}, ${profile.state}` : "Not provided"}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Member since {new Date(profile.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long" })}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <Button variant={isEditing ? "default" : "outline"} onClick={() => setIsEditing(!isEditing)}>
                  <Edit className="w-4 h-4 mr-2" />
                  {isEditing ? "Cancel" : "Edit Profile"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="address">Address</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                        id="name"
                        value={profile.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="mobileNo">Phone Number</Label>
                    <Input
                        id="mobileNo"
                        value={profile.mobileNo}
                        onChange={(e) => handleInputChange("mobileNo", e.target.value)}
                        disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input
                        id="dob"
                        type="date"
                        value={profile.dob}
                        onChange={(e) => handleInputChange("dob", e.target.value)}
                        disabled={!isEditing}
                    />
                  </div>
                </div>

                {isEditing && (
                    <Button onClick={handleSave} className="w-full">
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="address" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Address Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Street Address</Label>
                  <Input
                      id="address"
                      value={profile.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      disabled={!isEditing}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                        id="city"
                        value={profile.city}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                        disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                        id="state"
                        value={profile.state}
                        onChange={(e) => handleInputChange("state", e.target.value)}
                        disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input
                        id="zipCode"
                        value={profile.zipCode}
                        onChange={(e) => handleInputChange("zipCode", e.target.value)}
                        disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                        id="country"
                        value={profile.country}
                        onChange={(e) => handleInputChange("country", e.target.value)}
                        disabled={!isEditing}
                    />
                  </div>
                </div>

                {isEditing && (
                    <Button onClick={handleSave} className="w-full">
                      <Save className="w-4 h-4 mr-2" />
                      Save Address
                    </Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  Order History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.map((order) => (
                      <div key={order._id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{order.orderNumber}</p>
                          <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                          <p className="text-sm text-gray-500">{order.items.length} items</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${order.total.toFixed(2)}</p>
                          <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                        </div>
                      </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
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
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-gray-500">Receive email updates about your orders</p>
                    </div>
                    <Switch
                        checked={profile.notificationPreferences.emailNotifications}
                        onCheckedChange={(checked) => handleNotificationChange("emailNotifications", checked)}
                        disabled={!isEditing}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>SMS Notifications</Label>
                      <p className="text-sm text-gray-500">Receive SMS alerts for important updates</p>
                    </div>
                    <Switch
                        checked={profile.notificationPreferences.smsNotifications}
                        onCheckedChange={(checked) => handleNotificationChange("smsNotifications", checked)}
                        disabled={!isEditing}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Marketing Emails</Label>
                      <p className="text-sm text-gray-500">Receive promotional emails and offers</p>
                    </div>
                    <Switch
                        checked={profile.notificationPreferences.marketingEmails}
                        onCheckedChange={(checked) => handleNotificationChange("marketingEmails", checked)}
                        disabled={!isEditing}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Order Updates</Label>
                      <p className="text-sm text-gray-500">Get notified about order status changes</p>
                    </div>
                    <Switch
                        checked={profile.notificationPreferences.orderUpdates}
                        onCheckedChange={(checked) => handleNotificationChange("orderUpdates", checked)}
                        disabled={!isEditing}
                    />
                  </div>
                </div>

                {isEditing && (
                    <Button onClick={handleSave} className="w-full">
                      <Save className="w-4 h-4 mr-2" />
                      Save Preferences
                    </Button>
                )}
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
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                        id="currentPassword"
                        type="password"
                        value={passwords.currentPassword}
                        onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                        id="newPassword"
                        type="password"
                        value={passwords.newPassword}
                        onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                        id="confirmPassword"
                        type="password"
                        value={passwords.confirmPassword}
                        onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                    />
                  </div>
                  <Button type="submit" className="w-full">Change Password</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
  )
}