"use client"

import { ReactNode, useCallback, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Shield, Users, LayoutDashboard, Folder, LogOut, Images, Layers } from "lucide-react"

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  const isActive = useCallback(
    (href: string) => pathname === href || pathname?.startsWith(`${href}/`),
    [pathname]
  )

  const isAuthPage = pathname === "/admin/login"

  // Redirect unauthenticated users away from admin pages (except login)
  useEffect(() => {
    if (!isAuthPage) {
      try {
        const logged = localStorage.getItem("admin_logged_in")
        if (!logged) {
          router.replace("/admin/login")
        }
      } catch {}
    }
  }, [isAuthPage, router])

  const handleLogout = () => {
    try {
      localStorage.removeItem("admin_logged_in")
    } catch {}
    router.push("/admin/login")
  }

  if (isAuthPage) {
    return <>{children}</>
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2 py-1">
            <Shield className="h-5 w-5 text-primary" />
            <span className="text-sm font-semibold">Admin Panel</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <Link href="/admin/dashboard">
                    <SidebarMenuButton isActive={isActive("/admin/dashboard")}>
                      <LayoutDashboard />
                      <span>Dashboard</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <Link href="/admin/alluser">
                    <SidebarMenuButton isActive={isActive("/admin/alluser")}>
                      <Users />
                      <span>All Users</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <Link href="/admin/alluser/project">
                    <SidebarMenuButton isActive={isActive("/admin/alluser/project")}>
                      <Folder />
                      <span>Projects</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <Link href="/admin/carousel">
                    <SidebarMenuButton isActive={isActive("/admin/carousel")}>
                      <Images />
                      <span>Carousel</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <Link href="/admin/course-category">
                    <SidebarMenuButton isActive={isActive("/admin/course-category")}>
                      <Layers />
                      <span>Course Category</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarSeparator />
        <SidebarFooter>
          <Button variant="ghost" onClick={handleLogout} className="justify-start">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <div className="border-b flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <span className="text-sm text-muted-foreground">Programming Community • Admin</span>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}


