"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { LogOut, AlertTriangle } from "lucide-react"
import { useAuth } from "@/components/providers/auth-provider"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface LogoutDialogProps {
  isOpen: boolean;
  onOpenChange: any;
  onClose: () => void
  onLogout: () => void
}

export default function LogoutDialog({ isOpen,onOpenChange,onLogout, onClose }: LogoutDialogProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const { logout, user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const handleLogout = async () => {
    setIsLoggingOut(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call
      logout()
      onClose()
      router.push("/")
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      })
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "There was an error logging you out. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            Confirm Logout
          </DialogTitle>
          <DialogDescription>Are you sure you want to log out of your account?</DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-semibold text-sm">{user?.name?.charAt(0) || "U"}</span>
          </div>
          <div>
            <p className="font-medium text-gray-900">{user?.name}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoggingOut}
            className="w-full sm:w-auto bg-transparent"
          >
            Cancel
          </Button>
          <Button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full sm:w-auto bg-red-600 hover:bg-red-700"
          >
            {isLoggingOut ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Logging out...
              </>
            ) : (
              <>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
