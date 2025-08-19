"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { storageService, UserProfile } from "@/lib/storage"
import {
  BookOpen,
  Users,
  Award,
  TrendingUp,
  Calendar,
  Clock,
  Star,
  Plus,
  Settings,
  Bell,
  Search,
  Filter,
  MoreHorizontal,
  Play,
  CheckCircle,
  Target,
  Zap,
  Heart,
  MessageCircle,
  Eye,
  User,
  FolderOpen,
  LogOut,
  Moon,
  X,
} from "lucide-react"
import Link from "next/link"
import axios from "axios"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("profile")
  const [profileForm, setProfileForm] = useState<UserProfile>({
    id: "",
    profession: "Software Engineer",
    fullName: "Muhammad Fahad Jabbar",
    username: "mfahadjbr",
    email: "mfahadjbr@gmail.com",
    skills: "Full Stack Developer",
    description: "Passionate developer with expertise in modern web technologies",
    yearsOfExperience: "3",
    linkedin: "https://linkedin.com/in/mfahadjbr",
    github: "https://github.com/mfahadjbr",
    fiverr: "https://fiverr.com/mfahadjbr",
    whatsapp: "+1234567890",
    profileImage: null,
    certificateImages: [],
  })

  // Load profile on mount: try backend first, fallback to local storage
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = localStorage.getItem('accessToken')
        if (token) {
          const meRes = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/v1/profile/me`,
            {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
              },
              withCredentials: true,
            }
          )
          console.log(meRes.data)
          const meData = meRes.data?.data || meRes.data
          const p = meData?.profile || meData
          if (p) {
            const mapped: UserProfile = {
              id: p._id || "",
              profession: p.profession || "",
              fullName: p?.userId?.fullName || "",
              username: profileForm.username,
              email: p?.userId?.email || "",
              skills: Array.isArray(p.skills) ? p.skills.join(', ') : (p.skills || ""),
              description: p.description || "",
              yearsOfExperience: String(p.yearsOfExperience ?? ""),
              linkedin: p.linkedin || "",
              github: p.github || "",
              fiverr: p.fiverr || "",
              whatsapp: p.whatsapp || "",
              profileImage: p.profileImage || null,
              certificateImages: Array.isArray(p.certificates) ? p.certificates : [],
              userId: p?.userId?._id || "",
              certificates: Array.isArray(p.certificates) ? p.certificates : [],
              createdAt: p.createdAt || "",
              updatedAt: p.updatedAt || "",
            }

            setProfileForm(mapped)
            await storageService.updateUserProfile(mapped)
            return
          }
        }
      } catch (_) {
        // Ignore and fallback to storage
      }

      const storedProfile = await storageService.getUserProfile()
      if (storedProfile) {
        setProfileForm(storedProfile)
      }
    }

    loadProfile()
  }, [])

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (
      !profileForm.profession ||
      !profileForm.fullName ||
      !profileForm.username ||
      !profileForm.skills ||
      !profileForm.description ||
      !profileForm.yearsOfExperience ||
      !profileForm.linkedin ||
      !profileForm.whatsapp
    ) {
      toast({ title: "Missing fields", description: "Please fill all required fields.", })
      return
    }
    if (profileForm.certificateImages.length > 3) {
      toast({ title: "Too many certificates", description: "Maximum 3 certificate images allowed.", })
      return
    }

    try {
      const token = localStorage.getItem('accessToken')
      
      const formData = new FormData()
      formData.append('profession', profileForm.profession)
      formData.append('skills', profileForm.skills)
      formData.append('github', profileForm.github)
      formData.append('fiverr', profileForm.fiverr)
      formData.append('whatsapp', profileForm.whatsapp)
      formData.append('yearsOfExperience', profileForm.yearsOfExperience)
      formData.append('description', profileForm.description)
      formData.append('linkedin', profileForm.linkedin)
      
      if (profileForm.profileImage) {
        formData.append('profileImage', profileForm.profileImage)
      }

      if (profileForm.certificateImages.length > 0) {
        profileForm.certificateImages.forEach(cert => {
          formData.append('certificates', cert)
        })
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/v1/profile/add`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          },
          withCredentials: true
        }
      )
      console.log(response.data)

      // Immediately fetch the freshly saved profile from backend
      const meRes = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/v1/profile/me`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
          withCredentials: true,
        }
      )

      const meData = meRes.data?.data || meRes.data
      const p = meData?.profile || meData
      if (p) {
        const mapped: UserProfile = {
          id: p._id || profileForm.id,
          profession: p.profession || profileForm.profession,
          fullName: p?.userId?.fullName || profileForm.fullName,
          username: profileForm.username,
          email: p?.userId?.email || profileForm.email,
          skills: Array.isArray(p.skills) ? p.skills.join(', ') : (p.skills || profileForm.skills),
          description: p.description || profileForm.description,
          yearsOfExperience: String(p.yearsOfExperience ?? profileForm.yearsOfExperience),
          linkedin: p.linkedin || profileForm.linkedin,
          github: p.github || profileForm.github,
          fiverr: p.fiverr || profileForm.fiverr,
          whatsapp: p.whatsapp || profileForm.whatsapp,
          profileImage: p.profileImage || profileForm.profileImage,
          certificateImages: Array.isArray(p.certificates) ? p.certificates : (profileForm.certificateImages || []),
          userId: p?.userId?._id || profileForm.userId,
          certificates: Array.isArray(p.certificates) ? p.certificates : profileForm.certificates,
          createdAt: p.createdAt || profileForm.createdAt,
          updatedAt: p.updatedAt || profileForm.updatedAt,
        }

        setProfileForm(mapped)
        await storageService.updateUserProfile(mapped)
      }

      toast({ title: "Profile saved", description: "Your profile has been updated and synced." })
    } catch (error) {
      console.error('Profile update error:', error)
      toast({ title: "Error", description: "Failed to save profile. Please try again." })
    }
  }

  const handleLogout = () => {
    // Clear Chasha storage
    storageService.clearAll()
    // Clear any stored user data/tokens
    localStorage.removeItem('user')
    localStorage.removeItem('accessToken')
    sessionStorage.clear()
    // Redirect to home page
    window.location.href = '/'
    toast({ title: "Logged out", description: "You have been successfully logged out." })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-sans font-bold text-primary">Programming Community</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Avatar className="h-6 w-6 mr-2">
                      <AvatarImage src={profileForm.profileImage || "/placeholder.jpg"} alt="User" />
                      <AvatarFallback>{(profileForm.fullName || 'User').split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    {profileForm.fullName || 'User'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setActiveTab("profile")}>
                    <User className="h-4 w-4 mr-2" />
                    <Link href="/user-dashboard"> Profile </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveTab("projects")}>
                    <FolderOpen className="h-4 w-4 mr-2" />
                    <Link href="/user-dashboard/project"> Projects </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-background border-r border-border min-h-screen">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-6">Dashboard</h2>
            <nav className="space-y-2 grid grid-cols-1">
              <Link href="/user-dashboard">
                <Button 
                  variant={activeTab === "profile" ? "default" : "ghost"} 
                  className="w-full justify-start"
                  onClick={() => setActiveTab("profile")}
                >
                  <User className="h-4 w-4 mr-3" />
                  Profile
                </Button>
              </Link>
              <Link href="/user-dashboard/project">
                <Button 
                  variant={activeTab === "projects" ? "default" : "ghost"} 
                  className="w-full justify-start"
                  onClick={() => setActiveTab("projects")}
                >
                  <FolderOpen className="h-4 w-4 mr-3" />
                  Projects
                </Button>
              </Link>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {/* Welcome Section */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-sans font-bold text-foreground mb-2">Welcome back, {profileForm.fullName?.split(' ')[0] || 'User'}! 👋</h1>
                <p className="text-muted-foreground">Continue your learning journey and explore new opportunities</p>
              </div>
            </div>
          </motion.div>

          {/* Profile Form */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Personal Information Card */}
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <p className="text-sm text-muted-foreground">Update your personal details here</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="profession">Profession</Label>
                    <Input
                      id="profession"
                      value={profileForm.profession}
                      onChange={(e) => setProfileForm((p) => ({ ...p, profession: e.target.value }))}
                      placeholder="Full Stack Developer"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={profileForm.fullName}
                      onChange={(e) => setProfileForm((p) => ({ ...p, fullName: e.target.value }))}
                      placeholder="Full Name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={profileForm.username}
                      onChange={(e) => setProfileForm((p) => ({ ...p, username: e.target.value }))}
                      placeholder="Username"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={profileForm.email}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground">Email address cannot be changed</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="skills">Skills/Expertise</Label>
                    <Input
                      id="skills"
                      value={profileForm.skills}
                      onChange={(e) => setProfileForm((p) => ({ ...p, skills: e.target.value }))}
                      placeholder="Full Stack Developer"
                      required
                    />
                    <p className="text-xs text-muted-foreground">Separate multiple skills with commas</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      rows={3}
                      value={profileForm.description}
                      onChange={(e) => setProfileForm((p) => ({ ...p, description: e.target.value }))}
                      placeholder="Tell us about yourself"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="yearsOfExperience">Years of Experience</Label>
                      <Input
                        id="yearsOfExperience"
                        type="number"
                        min={0}
                        value={profileForm.yearsOfExperience}
                        onChange={(e) => setProfileForm((p) => ({ ...p, yearsOfExperience: e.target.value }))}
                        placeholder="e.g. 3"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="linkedin">LinkedIn Link</Label>
                      <Input
                        id="linkedin"
                        type="url"
                        value={profileForm.linkedin}
                        onChange={(e) => setProfileForm((p) => ({ ...p, linkedin: e.target.value }))}
                        placeholder="https://linkedin.com/in/username"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="github">GitHub</Label>
                      <Input
                        id="github"
                        type="url"
                        value={profileForm.github}
                        onChange={(e) => setProfileForm((p) => ({ ...p, github: e.target.value }))}
                        placeholder="https://github.com/username"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fiverr">Fiverr</Label>
                      <Input
                        id="fiverr"
                        type="url"
                        value={profileForm.fiverr}
                        onChange={(e) => setProfileForm((p) => ({ ...p, fiverr: e.target.value }))}
                        placeholder="https://www.fiverr.com/username"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp">WhatsApp</Label>
                    <Input
                      id="whatsapp"
                      type="tel"
                      value={profileForm.whatsapp}
                      onChange={(e) => setProfileForm((p) => ({ ...p, whatsapp: e.target.value }))}
                      placeholder="e.g. +1234567890"
                      required
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button type="submit">Submit</Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Profile Picture Card */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Picture</CardTitle>
                <p className="text-sm text-muted-foreground">Update your profile image</p>
              </CardHeader>
              <CardContent className="text-center">
                <div className="relative inline-block mb-4">
                  <Avatar className="h-32 w-32">
                    <AvatarImage src={profileForm.profileImage || "/placeholder-ebi58.png"} alt={profileForm.fullName || "Profile"} />
                    <AvatarFallback className="text-2xl">
                      {profileForm.fullName?.split(' ').map((name: string) => name[0]).join('') || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-2 -right-2 bg-primary rounded-full p-2 cursor-pointer">
                    <Settings className="h-4 w-4 text-primary-foreground" />
                  </div>
                </div>
                <Button variant="outline" className="w-full mb-2">
                  <Plus className="h-4 w-4 mr-2" />
                  Change Avatar
                </Button>
                <p className="text-xs text-muted-foreground">PNG, JPG up to 5MB</p>
              </CardContent>
            </Card>

            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Certificate Images</CardTitle>
                <p className="text-sm text-muted-foreground">Upload your certificates and achievements</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {profileForm.certificateImages?.map((image, index) => (
                    <div key={index} className="relative aspect-square">
                      <img 
                        src={image} 
                        alt={`Certificate ${index + 1}`}
                        className="object-cover w-full h-full rounded-lg"
                      />
                      <Button 
                        variant="destructive" 
                        size="icon"
                        className="absolute top-2 right-2"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" className="aspect-square flex flex-col items-center justify-center">
                    <Plus className="h-8 w-8 mb-2" />
                    Add Certificate
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
