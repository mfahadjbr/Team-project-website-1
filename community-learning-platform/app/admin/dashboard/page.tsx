"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Shield,
  Users,
  BookOpen,
  Award,
  TrendingUp,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Ban,
  CheckCircle,
  AlertTriangle,
  Activity,
  DollarSign,
  UserPlus,
  Settings,
  Bell,
  LogOut,
  Home,
  BarChart3,
  PieChart,
  LineChart,
} from "lucide-react"
import Link from "next/link"

interface PlatformStats {
  totalUsers: number
  activeUsers: number
  totalProjects: number
  totalCourses: number
  revenue: number
  newSignups: number
  completionRate: number
  avgRating: number
}

interface User {
  id: number
  name: string
  email: string
  avatar: string
  role: string
  joinDate: string
  status: string
  projects: number
  courses: number
  lastActive: string
}

interface Project {
  id: number
  title: string
  author: string
  category: string
  status: string
  likes: number
  views: number
  createdAt: string
  flagged: boolean
}

const platformStats: PlatformStats = {
  totalUsers: 2847,
  activeUsers: 1923,
  totalProjects: 1456,
  totalCourses: 89,
  revenue: 45670,
  newSignups: 156,
  completionRate: 78,
  avgRating: 4.6,
}

const recentUsers: User[] = [
  {
    id: 1,
    name: "Sarah Chen",
    email: "sarah.chen@example.com",
    avatar: "/placeholder-ebi58.png",
    role: "Student",
    joinDate: "2024-01-15",
    status: "active",
    projects: 5,
    courses: 8,
    lastActive: "2 hours ago",
  },
  {
    id: 2,
    name: "Marcus Johnson",
    email: "marcus.j@example.com", 
    avatar: "/black-designer-glasses.png",
    role: "Instructor",
    joinDate: "2023-12-20",
    status: "active",
    projects: 12,
    courses: 3,
    lastActive: "1 day ago",
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    email: "elena.r@example.com",
    avatar: "/latina-data-scientist.png",
    role: "Student", 
    joinDate: "2024-01-10",
    status: "suspended",
    projects: 2,
    courses: 15,
    lastActive: "1 week ago",
  },
  {
    id: 4,
    name: "David Kim",
    email: "david.kim@example.com",
    avatar: "/asian-mobile-developer.png",
    role: "Mentor",
    joinDate: "2023-11-05", 
    status: "active",
    projects: 18,
    courses: 6,
    lastActive: "30 minutes ago",
  },
]

const recentProjects: Project[] = [
  {
    id: 1,
    title: "E-commerce Dashboard",
    author: "Sarah Chen",
    category: "Web Development",
    status: "published",
    likes: 24,
    views: 156,
    createdAt: "2024-01-12",
    flagged: false,
  },
  {
    id: 2,
    title: "Mobile Banking App",
    author: "David Kim",
    category: "Mobile Development", 
    status: "under-review",
    likes: 18,
    views: 89,
    createdAt: "2024-01-10",
    flagged: true,
  },
  {
    id: 3,
    title: "AI Chatbot System",
    author: "Elena Rodriguez",
    category: "AI/ML",
    status: "published",
    likes: 31,
    views: 203,
    createdAt: "2024-01-08",
    flagged: false,
  },
]

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [searchTerm, setSearchTerm] = useState("")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "suspended":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getProjectStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800"
      case "under-review":
        return "bg-yellow-100 text-yellow-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      {/* <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-8 w-8 text-destructive" />
                <div>
                  <h1 className="text-xl font-sans font-bold">Admin Dashboard</h1>
                  <p className="text-xs text-muted-foreground">LearnTogether Platform</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <Home className="h-4 w-4 mr-2" />
                  View Site
                </Button>
              </Link>
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Avatar className="h-6 w-6 mr-2">
                      <AvatarImage src="/placeholder-ebi58.png" alt="Admin" />
                      <AvatarFallback>AD</AvatarFallback>
                    </Avatar>
                    Admin
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header> */}

      <div className="container mx-auto px-4 py-8">
        {/* Platform Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{platformStats.totalUsers.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Total Users</p>
                  <p className="text-xs text-green-600">+{platformStats.newSignups} this week</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-secondary" />
                <div>
                  <p className="text-2xl font-bold">{platformStats.totalProjects.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Total Projects</p>
                  <p className="text-xs text-blue-600">78% completion rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
            
        </motion.div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
         
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
          
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-sans font-bold">User Management</h2>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Projects</TableHead>
                      <TableHead>Courses</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Active</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                              <AvatarFallback>
                                {user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{user.role}</Badge>
                        </TableCell>
                        <TableCell>{user.projects}</TableCell>
                        <TableCell>{user.courses}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{user.lastActive}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                View Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit User
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Ban className="h-4 w-4 mr-2" />
                                Suspend
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-sans font-bold">Project Management</h2>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Engagement</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentProjects.map((project) => (
                      <TableRow key={project.id}>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <div>
                              <p className="font-medium">{project.title}</p>
                              {project.flagged && (
                                <Badge variant="destructive" className="text-xs mt-1">
                                  <AlertTriangle className="h-3 w-3 mr-1" />
                                  Flagged
                                </Badge>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{project.author}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{project.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getProjectStatusColor(project.status)}>{project.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p>
                              {project.likes} likes • {project.views} views
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{project.createdAt}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                View Project
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Approve
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Ban className="h-4 w-4 mr-2" />
                                Reject
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
