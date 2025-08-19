// "use client"

// import { useState, useEffect } from "react"
// import { motion } from "framer-motion"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { storageService, UserProfile } from "@/lib/storage"
// import { toast } from "@/hooks/use-toast"

// import {
//   MapPin,
//   Calendar,
//   Globe,
//   Github,
//   Linkedin,
//   Twitter,
//   Edit,
//   Save,
//   X,
//   Star,
//   Award,
//   BookOpen,
//   Code,
//   Heart,
//   Eye,
//   MessageCircle,
//   Share2,
//   ArrowLeft,
//   Settings,
//   Shield,
//   Bell,
//   User,
//   FolderOpen,
//   Moon,
//   Plus,
// } from "lucide-react"
// import Link from "next/link"
// import axios from "axios"

// export default function ProfilePage() {
//   const [isEditing, setIsEditing] = useState(true)
//   const [activeTab, setActiveTab] = useState("about")
//   const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
//   const [profileId, setProfileId] = useState<string | null>(null)
//   const [profileForm, setProfileForm] = useState<UserProfile & {
//     profileImageFile: File | null;
//     certificateImageFiles: File[];
//   }>({
//     id: "",
//     fullName: "Muhammad Fahad Jabbar",
//     username: "mfahadjbr",
//     email: "mfahadjbr@gmail.com",
//     skills: "Full Stack Developer",
//     description: "Passionate developer with expertise in modern web technologies",
//     yearsOfExperience: "3",
//     linkedin: "https://linkedin.com/in/mfahadjbr",
//     github: "https://github.com/mfahadjbr",
//     fiverr: "https://fiverr.com/mfahadjbr",
//     whatsapp: "+1234567890",
//     profileImage: null,
//     certificateImages: [],
//     profileImageFile: null, // New state for actual File object
//     certificateImageFiles: [], // New state for actual File objects
//   })

//   // Load current user's profile from backend (fallback to local storage)
//   useEffect(() => {
//     const loadProfile = async () => {
//       try {
//         const token = localStorage.getItem('accessToken')
//         if (token) {
//           const res = await axios.get(`${API_URL}/api/v1/profile/me`, {
//             headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
//             withCredentials: true,
//           })
//           const data = res.data?.data || res.data
//           const p = data?.profile || data
//           if (p) {
//             setProfileId(p._id)
//             setProfileForm((prev) => ({
//               ...prev,
//               fullName: p?.userId?.fullName || prev.fullName,
//               email: p?.userId?.email || prev.email,
//               skills: Array.isArray(p.skills) ? p.skills.join(', ') : (p.skills || prev.skills),
//               description: p.description || prev.description,
//               yearsOfExperience: String(p.yearsOfExperience ?? prev.yearsOfExperience),
//               linkedin: p.linkedin || prev.linkedin,
//               github: p.github || prev.github,
//               fiverr: p.fiverr || prev.fiverr,
//               whatsapp: p.whatsapp || prev.whatsapp,
//               profileImage: p.profileImage || prev.profileImage,
//               certificateImages: p.certificates || prev.certificateImages,
//               profileImageFile: null,
//               certificateImageFiles: [],
//             }))
//             setIsEditing(false)
//             return
//           }
//         }
//       } catch (e) {
//         // ignore and fallback to local storage
//       }
//       const profile = await storageService.getUserProfile()
//       if (profile) {
//         setProfileForm({
//           ...profile,
//           profileImageFile: null,
//           certificateImageFiles: [],
//         })
//         setIsEditing(false)
//       }
//     }
//     loadProfile()
//   }, [])

//   const handleSave = async () => {
//     try {
//       const token = localStorage.getItem('accessToken')

//       if (!token) {
//         toast({
//           title: "Authentication Error",
//           description: "No access token found. Please log in.",
//           variant: "destructive",
//         })
//         return
//       }

//       const formData = new FormData()

//       // Append text fields
//       formData.append('skills', profileForm.skills)
//       formData.append('description', profileForm.description)
//       formData.append('yearsOfExperience', String(profileForm.yearsOfExperience))
//       formData.append('linkedin', profileForm.linkedin)
//       if (profileForm.github) formData.append('github', profileForm.github)
//       if (profileForm.fiverr) formData.append('fiverr', profileForm.fiverr)
//       if (profileForm.whatsapp) formData.append('whatsapp', profileForm.whatsapp)
//       // Required by backend
//       formData.append('profession', "Software Engineer")

//       // Append image files
//       if (profileForm.profileImageFile) {
//         formData.append('profileImage', profileForm.profileImageFile)
//       }

//       profileForm.certificateImageFiles.forEach((file) => {
//         formData.append('certificates', file) // Append each certificate file
//       })

//       // Create or update depending on whether profile exists
//       let response
//       // if (profileId) {
//       //   response = await axios.put(
//       //     `${API_URL}/api/v1/profile/update/${profileId}`,
//       //     formData,
//       //     {
//       //       headers: {
//       //         Authorization: `Bearer ${token}`,
//       //       },
//       //       withCredentials: true,
//       //     }
//       //   )
//       // }
//       response = await axios.post(
//         `${API_URL}/api/v1/profile/add`,
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//           withCredentials: true,
//         }
//       )
//       console.log(response.data)
//       if (response.status === 201 || response.status === 200) {
//         const resData = response.data?.data || response.data
//         const p = resData?.profile || resData
//         if (p?._id) setProfileId(p._id)
//         setIsEditing(false)
//         toast({ title: "Profile saved", description: "Your profile has been successfully updated and posted." })
//       } else {
//         toast({ title: "Error", description: `Failed to save profile: ${response.statusText}` })
//       }
//     } catch (error: any) {
//       console.error("Error saving profile:", error)
//       toast({
//         title: "Error",
//         description: `Failed to save profile: ${error.response?.data?.message || error.message}. Please try again.`,
//         variant: "destructive",
//       })
//     }
//   }

//   const handleCancel = () => {
//     setIsEditing(false)
//     // Optionally, reload the profile from storage to revert changes
//     const loadProfile = async () => {
//       const profile = await storageService.getUserProfile()
//       if (profile) {
//         setProfileForm({
//           ...profile,
//           profileImageFile: null,
//           certificateImageFiles: [],
//         })
//       }
//     }
//     loadProfile()
//   }

//   const handleEdit = () => {
//     setIsEditing(true)
//   }

//   const handleLogout = () => {
//     storageService.clearAll()
//     localStorage.removeItem('user')
//     localStorage.removeItem('token') // Clear the token
//     sessionStorage.clear()
//     window.location.href = '/'
//     toast({ title: "Logged out", description: "You have been successfully logged out." })
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       {/* Header */}
//       <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
//         <div className="container mx-auto px-4 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-4">
//               <Link href="/" className="flex items-center space-x-2">
//                 <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
//                   <BookOpen className="h-5 w-5 text-primary-foreground" />
//                 </div>
//                 <span className="text-xl font-sans font-bold text-primary">ProjectPortal</span>
//               </Link>
//             </div>
//             <div className="flex items-center space-x-4">
//               <Button variant="outline" size="sm">
//                 My Portfolio
//               </Button>
//               <Button size="sm">
//                 Edit Portfolio
//               </Button>
//               <Button variant="destructive" size="sm" onClick={handleLogout}>
//                 Logout
//               </Button>
//               <Button variant="ghost" size="sm">
//                 <Moon className="h-4 w-4" />
//               </Button>
//             </div>
//           </div>
//         </div>
//       </header>

//       <div className="flex">
//         {/* Sidebar */}
//         <aside className="w-64 bg-background border-r border-border min-h-screen">
//           <div className="p-6">
//             <h2 className="text-lg font-semibold mb-6">Dashboard</h2>
//             <nav className="space-y-2">
//               <Link href="/user-dashboard">
//                 <Button variant="default" className="w-full justify-start">
//                   <User className="h-4 w-4 mr-3" />
//                   Profile
//                 </Button>
//               </Link>
//               <Link href="/user-dashboard/project">
//                 <Button variant="ghost" className="w-full justify-start">
//                   <FolderOpen className="h-4 w-4 mr-3" />
//                   Projects
//                 </Button>
//               </Link>
//             </nav>
//           </div>
//         </aside>

//         {/* Main Content */}
//         <main className="flex-1 p-8">
//           {/* Header Section */}
//           <div className="flex items-center justify-between mb-8">
//             <div>
//               <h1 className="text-3xl font-sans font-bold text-foreground mb-2">Profile Settings</h1>
//               <p className="text-muted-foreground">Manage your profile information</p>
//             </div>
//             {!isEditing && (
//               <Button onClick={handleEdit}>
//                 <Edit className="h-4 w-4 mr-2" />
//                 Edit Profile
//               </Button>
//             )}
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//             {/* Left Side - Form or Profile Display */}
//             <div>
//               {isEditing ? (
//                 // Profile Form
//                 <Card>
//                   <CardHeader>
//                     <CardTitle>Personal Information</CardTitle>
//                     <p className="text-sm text-muted-foreground">Update your personal details here</p>
//                   </CardHeader>
//                   <CardContent>
//                     <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-4">
//                       <div className="space-y-2">
//                         <Label htmlFor="fullName">Full Name *</Label>
//                         <Input
//                           id="fullName"
//                           value={profileForm.fullName}
//                           onChange={(e) => setProfileForm((p) => ({ ...p, fullName: e.target.value }))}
//                           placeholder="Full Name"
//                           required
//                         />
//                       </div>
//                       <div className="space-y-2">
//                         <Label htmlFor="skills">Skills *</Label>
//                         <Input
//                           id="skills"
//                           value={profileForm.skills}
//                           onChange={(e) => setProfileForm((p) => ({ ...p, skills: e.target.value }))}
//                           placeholder="Full Stack Developer, React, Node.js"
//                           required
//                         />
//                         <p className="text-xs text-muted-foreground">Separate multiple skills with commas</p>
//                       </div>
//                       <div className="space-y-2">
//                         <Label htmlFor="description">Description *</Label>
//                         <Textarea
//                           id="description"
//                           rows={3}
//                           value={profileForm.description}
//                           onChange={(e) => setProfileForm((p) => ({ ...p, description: e.target.value }))}
//                           placeholder="Tell us about yourself"
//                           required
//                         />
//                       </div>
//                       <div className="space-y-2">
//                         <Label htmlFor="yearsOfExperience">Years of Experience *</Label>
//                         <Input
//                           id="yearsOfExperience"
//                           type="number"
//                           min={0}
//                           value={profileForm.yearsOfExperience}
//                           onChange={(e) => setProfileForm((p) => ({ ...p, yearsOfExperience: e.target.value }))}
//                           placeholder="e.g. 3"
//                           required
//                         />
//                       </div>
//                       <div className="space-y-2">
//                         <Label htmlFor="linkedin">LinkedIn *</Label>
//                         <Input
//                           id="linkedin"
//                           type="url"
//                           value={profileForm.linkedin}
//                           onChange={(e) => setProfileForm((p) => ({ ...p, linkedin: e.target.value }))}
//                           placeholder="https://linkedin.com/in/username"
//                           required
//                         />
//                       </div>
//                       <div className="space-y-2">
//                         <Label htmlFor="github">GitHub</Label>
//                         <Input
//                           id="github"
//                           type="url"
//                           value={profileForm.github || ""} // Ensure it's not undefined
//                           onChange={(e) => setProfileForm((p) => ({ ...p, github: e.target.value }))}
//                           placeholder="https://github.com/username"
//                         />
//                       </div>
//                       <div className="space-y-2">
//                         <Label htmlFor="fiverr">Fiverr</Label>
//                         <Input
//                           id="fiverr"
//                           type="url"
//                           value={profileForm.fiverr || ""} // Ensure it's not undefined
//                           onChange={(e) => setProfileForm((p) => ({ ...p, fiverr: e.target.value }))}
//                           placeholder="https://www.fiverr.com/username"
//                         />
//                       </div>
//                       <div className="space-y-2">
//                         <Label htmlFor="whatsapp">WhatsApp</Label>
//                         <Input
//                           id="whatsapp"
//                           type="tel"
//                           value={profileForm.whatsapp || ""} // Ensure it's not undefined
//                           onChange={(e) => setProfileForm((p) => ({ ...p, whatsapp: e.target.value }))}
//                           placeholder="e.g. +1234567890"
//                         />
//                       </div>
//                       <div className="space-y-2">
//                         <Label htmlFor="profileImage">Profile Image</Label>
//                         <Input
//                           id="profileImage"
//                           type="file"
//                           accept="image/*"
//                           onChange={(e) => {
//                             const file = e.currentTarget.files?.[0]
//                             if (file) {
//                               if (file.size > 5 * 1024 * 1024) {
//                                 toast({ title: "File too large", description: "Profile image must be under 5MB" })
//                                 e.currentTarget.value = "" // Clear the input
//                                 return
//                               }
//                               setProfileForm((p) => ({ ...p, profileImageFile: file, profileImage: file.name })) // Store the File object and its name
//                             } else {
//                               setProfileForm((p) => ({ ...p, profileImageFile: null, profileImage: null }))
//                             }
//                           }}
//                         />
//                         <p className="text-xs text-muted-foreground">Max 5MB</p>
//                       </div>
//                       <div className="space-y-2">
//                         <Label htmlFor="certificates">Certificates</Label>
//                         <Input
//                           id="certificates"
//                           type="file"
//                           accept="image/*"
//                           multiple
//                           onChange={(e) => {
//                             const files = Array.from(e.currentTarget.files ?? [])
//                             if (files.length > 5) {
//                               toast({ title: "Too many files", description: "Maximum 5 certificate files allowed" })
//                               e.currentTarget.value = "" // Clear the input
//                               return
//                             }
//                             const validFiles = files.filter(file => file.size <= 5 * 1024 * 1024)
//                             if (validFiles.length !== files.length) {
//                               toast({ title: "Some files too large", description: "Certificate files must be under 5MB each" })
//                             }
//                             setProfileForm((p) => ({
//                               ...p,
//                               certificateImageFiles: validFiles, // Store the File objects
//                               certificateImages: validFiles.map(f => f.name) // Store names for display
//                             }))
//                           }}
//                         />
//                         <p className="text-xs text-muted-foreground">Max 5 files, 5MB each</p>
//                       </div>
//                       <div className="flex justify-end space-x-2">
//                         <Button type="button" variant="outline" onClick={handleCancel}>
//                           Cancel
//                         </Button>
//                         <Button type="submit">
//                           Submit
//                         </Button>
//                       </div>
//                     </form>
//                   </CardContent>
//                 </Card>
//               ) : (
//                 // Profile Display
//                 <Card>
//                   <CardHeader>
//                     <CardTitle>Profile Information</CardTitle>
//                   </CardHeader>
//                   <CardContent className="space-y-4">
//                     <div>
//                       <p className="text-sm text-muted-foreground">Full Name</p>
//                       <p className="font-medium">{profileForm.fullName}</p>
//                     </div>
//                     <div>
//                       <p className="text-sm text-muted-foreground">Skills</p>
//                       <p className="font-medium">{profileForm.skills}</p>
//                     </div>
//                     <div>
//                       <p className="text-sm text-muted-foreground">Description</p>
//                       <p className="text-muted-foreground">{profileForm.description}</p>
//                     </div>
//                     <div>
//                       <p className="text-sm text-muted-foreground">Years of Experience</p>
//                       <p className="font-medium">{profileForm.yearsOfExperience}</p>
//                     </div>
//                     <div>
//                       <p className="text-sm text-muted-foreground">LinkedIn</p>
//                       <a href={profileForm.linkedin} className="text-primary underline" target="_blank" rel="noopener noreferrer">
//                         {profileForm.linkedin}
//                       </a>
//                     </div>
//                     {profileForm.github && (
//                       <div>
//                         <p className="text-sm text-muted-foreground">GitHub</p>
//                         <a href={profileForm.github} className="text-primary underline" target="_blank" rel="noopener noreferrer">
//                           {profileForm.github}
//                         </a>
//                       </div>
//                     )}
//                     {profileForm.fiverr && (
//                       <div>
//                         <p className="text-sm text-muted-foreground">Fiverr</p>
//                         <a href={profileForm.fiverr} className="text-primary underline" target="_blank" rel="noopener noreferrer">
//                           {profileForm.fiverr}
//                         </a>
//                       </div>
//                     )}
//                     {profileForm.whatsapp && (
//                       <div>
//                         <p className="text-sm text-muted-foreground">WhatsApp</p>
//                         <p className="font-medium">{profileForm.whatsapp}</p>
//                       </div>
//                     )}
//                     {profileForm.profileImage && (
//                       <div>
//                         <p className="text-sm text-muted-foreground">Profile Image</p>
//                         <p className="font-medium text-green-600">✓ {profileForm.profileImage}</p>
//                       </div>
//                     )}
//                     {profileForm.certificateImages.length > 0 && (
//                       <div>
//                         <p className="text-sm text-muted-foreground">Certificates</p>
//                         <div className="space-y-1">
//                           {profileForm.certificateImages.map((cert, idx) => (
//                             <p key={idx} className="text-sm text-green-600">✓ {cert}</p>
//                           ))}
//                         </div>
//                       </div>
//                     )}
//                   </CardContent>
//                 </Card>
//               )}
//             </div>

//             {/* Right Side - Profile Picture */}
//             <Card>
//               <CardHeader>
//                 <CardTitle>Profile Picture</CardTitle>
//                 <p className="text-sm text-muted-foreground">Update your profile image</p>
//               </CardHeader>
//               <CardContent className="text-center">
//                 <div className="relative inline-block mb-4">
//                   <Avatar className="h-32 w-32">
//                     <AvatarImage
//                       src={profileForm.profileImage ? profileForm.profileImage : "/placeholder-ebi58.png"}
//                       alt="Profile"
//                     />
//                     <AvatarFallback className="text-2xl">
//                       {profileForm.fullName ? profileForm.fullName.split(' ').map(n => n[0]).join('') : 'MF'}
//                     </AvatarFallback>
//                   </Avatar>
//                   {isEditing && (
//                     <div className="absolute -bottom-2 -right-2 bg-primary rounded-full p-2 cursor-pointer">
//                       <Settings className="h-4 w-4 text-primary-foreground" />
//                     </div>
//                   )}
//                 </div>
//                 {isEditing ? (
//                   <Button variant="outline" className="w-full mb-2" onClick={() => document.getElementById('profileImage')?.click()}>
//                     <Plus className="h-4 w-4 mr-2" />
//                     Change Avatar
//                   </Button>
//                 ) : (
//                   <div className="text-center">
//                     <p className="text-sm text-muted-foreground mb-2">Profile Image</p>
//                     {profileForm.profileImage && (
//                       <p className="text-xs text-green-600">✓ Image uploaded</p>
//                     )}
//                   </div>
//                 )}
//                 <p className="text-xs text-muted-foreground">PNG, JPG up to 5MB</p>

//                 {/* Certificates Section */}
//                 {!isEditing && profileForm.certificateImages.length > 0 && (
//                   <div className="mt-6 pt-6 border-t">
//                     <p className="text-sm font-medium mb-3">Certificates</p>
//                     <div className="grid grid-cols-2 gap-2">
//                       {profileForm.certificateImages.map((cert, idx) => (
//                         <div key={idx} className="text-center p-2 bg-muted rounded">
//                           <p className="text-xs text-muted-foreground">Certificate {idx + 1}</p>
//                           <p className="text-xs text-green-600">✓ Uploaded</p>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           </div>
//         </main>
//       </div>
//     </div>
//   )
// }