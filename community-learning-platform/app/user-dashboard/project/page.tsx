"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { toast } from "@/hooks/use-toast"
import { storageService, Project } from "@/lib/storage"
import {
  Plus,
  Edit,
  Trash2,
  ArrowLeft,
  FolderOpen,
  User,
  Moon,
  BookOpen,
  LogOut,
} from "lucide-react"
import Link from "next/link"
import { DropdownMenu, DropdownMenuItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function ProjectPage() {
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [deletingProject, setDeletingProject] = useState<Project | null>(null)
  const [projects, setProjects] = useState<Project[]>([])

  // Load projects from storage on component mount
  useEffect(() => {
    const loadProjects = async () => {
      const storedProjects = await storageService.getProjects()
      if (storedProjects.length === 0) {
        // Add sample projects if none exist
        const sampleProjects = [
          {
            title: "AI Resume Application",
            summary: "AI-powered resume builder creating tailored, professional resumes in seconds.",
            description: "The AI Resume Application is an intelligent resume-building platform powered by Next.js and Google Gemini API, designed to help users create professional, optimized, and ATS-friendly resumes effortlessly. Using AI-driven content generation, users can input their basic information and receive comprehensive, industry-specific resume suggestions that highlight their skills and experience effectively.",
            skills: ["Next.js", "Tailwind CSS", "Vercel Blob", "Google Gemini API"],
            link: "https://ai-resume-app.vercel.app",
            thumbnail: "/python-data-science-analytics.png",
            images: ["/python-data-science-analytics.png", "/react-development-coding.png"],
          },
          {
            title: "Agentia World Website",
            summary: "AI-powered toolkit hub empowering users with versatile intelligent digital solutions.",
            description: "The Agentia World Website is an advanced AI-driven platform built with Next.js, integrating LangChain and CrewAI to power intelligent, multi-agent workflows. Designed for automation, AI collaboration, and smart decision-making, this platform offers a comprehensive suite of tools for developers, businesses, and individuals looking to leverage cutting-edge AI technology.",
            skills: ["Next.js", "Tailwind CSS", "Vercel Blob", "LangChain", "CrewAI"],
            link: "https://agentia-world.vercel.app",
            thumbnail: "/ui-ux-design-interface.png",
            images: ["/ui-ux-design-interface.png", "/machine-learning-algorithms.png"],
          }
        ]
        
        for (const project of sampleProjects) {
          await storageService.addProject(project)
        }
        
        const updatedProjects = await storageService.getProjects()
        setProjects(updatedProjects)
      } else {
        setProjects(storedProjects)
      }
    }
    
    loadProjects()
  }, [])

  const [projectForm, setProjectForm] = useState({
    title: "",
    summary: "",
    description: "",
    skills: "",
    link: "",
    thumbnail: null as File | null,
    images: [] as File[],
  })

  const resetForm = () => {
    setProjectForm({
      title: "",
      summary: "",
      description: "",
      skills: "",
      link: "",
      thumbnail: null,
      images: [],
    })
  }

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (
      !projectForm.title ||
      !projectForm.summary ||
      !projectForm.description ||
      !projectForm.skills ||
      !projectForm.link ||
      !projectForm.thumbnail
    ) {
      toast({ title: "Missing fields", description: "Please fill all required fields." })
      return
    }
    if (projectForm.images.length > 3) {
      toast({ title: "Too many images", description: "Maximum 3 project images allowed." })
      return
    }

    try {
      const newProject = await storageService.addProject({
        title: projectForm.title,
        summary: projectForm.summary,
        description: projectForm.description,
        skills: projectForm.skills.split(",").map(skill => skill.trim()),
        link: projectForm.link,
        thumbnail: URL.createObjectURL(projectForm.thumbnail),
        images: projectForm.images.map(img => URL.createObjectURL(img)),
      })

      setProjects([newProject, ...projects])
      resetForm()
      setShowAddForm(false)
      toast({ title: "Project added", description: "Your project has been created successfully and saved to Chasha." })
    } catch (error) {
      toast({ title: "Error", description: "Failed to save project. Please try again." })
    }
  }

  const handleEditProject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProject) return

    if (
      !projectForm.title ||
      !projectForm.summary ||
      !projectForm.description ||
      !projectForm.skills ||
      !projectForm.link
    ) {
      toast({ title: "Missing fields", description: "Please fill all required fields." })
      return
    }

    try {
      const updatedProject = await storageService.updateProject(editingProject.id, {
        title: projectForm.title,
        summary: projectForm.summary,
        description: projectForm.description,
        skills: projectForm.skills.split(",").map(skill => skill.trim()),
        link: projectForm.link,
        ...(projectForm.thumbnail && { thumbnail: URL.createObjectURL(projectForm.thumbnail) }),
        ...(projectForm.images.length > 0 && { images: projectForm.images.map(img => URL.createObjectURL(img)) })
      })

      if (updatedProject) {
        const updatedProjects = projects.map(project => 
          project.id === editingProject.id ? updatedProject : project
        )
        setProjects(updatedProjects)
        setEditingProject(null)
        resetForm()
        toast({ title: "Project updated", description: "Your project has been updated successfully and saved to Chasha." })
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to update project. Please try again." })
    }
  }

  const handleDeleteProject = async () => {
    if (!deletingProject) return

    try {
      const success = await storageService.deleteProject(deletingProject.id)
      if (success) {
        const updatedProjects = projects.filter(project => project.id !== deletingProject.id)
        setProjects(updatedProjects)
        setDeletingProject(null)
        toast({ title: "Project deleted", description: "Your project has been deleted successfully from Chasha." })
      } else {
        toast({ title: "Error", description: "Failed to delete project. Please try again." })
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete project. Please try again." })
    }
  }

  const startEdit = (project: Project) => {
    setEditingProject(project)
    setProjectForm({
      title: project.title,
      summary: project.summary,
      description: project.description,
      skills: project.skills.join(", "),
      link: project.link,
      thumbnail: null,
      images: [],
    })
  }

  const handleLogout = () => {
    storageService.clearAll()
    localStorage.removeItem('user')
    sessionStorage.clear()
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
                      <AvatarImage src="/placeholder.jpg" alt="User" />
                      <AvatarFallback>MU</AvatarFallback>
                    </Avatar>
                    Muhammad
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <Link href="/user-dashboard">
                    <DropdownMenuItem>
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/user-dashboard/project">
                    <DropdownMenuItem>
                      <FolderOpen className="h-4 w-4 mr-2" />
                      Projects
                    </DropdownMenuItem>
                  </Link>
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
            <nav className="space-y-2">
              <Link href="/user-dashboard">
                <Button variant="ghost" className="w-full justify-start">
                  <User className="h-4 w-4 mr-3" />
                  Profile
                </Button>
              </Link>
              <Link href="/user-dashboard/project">
                <Button variant="default" className="w-full justify-start">
                  <FolderOpen className="h-4 w-4 mr-3" />
                  Projects
                </Button>
              </Link>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-sans font-bold text-foreground mb-2">Projects</h1>
              <p className="text-muted-foreground">Manage and showcase your projects</p>
            </div>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Project
            </Button>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {projects.map((project, index) => (
              <Card key={`${project.id}-${index}`} className="overflow-hidden">
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={project.thumbnail}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-semibold">{project.title}</h3>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.skills.slice(0, 3).map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {project.skills.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{project.skills.length - 3} more
                      </Badge>
                    )}
                  </div>

                  <p className="text-muted-foreground mb-4">{project.summary}</p>
                  <p className="text-sm text-muted-foreground mb-6 line-clamp-3">
                    {project.description}
                  </p>

                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => startEdit(project)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setDeletingProject(project)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete your project
                              "{project.title}" and remove it from your portfolio.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteProject}>
                              Delete Project
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Add/Edit Project Dialog */}
          <Dialog open={showAddForm || !!editingProject} onOpenChange={() => {
            setShowAddForm(false)
            setEditingProject(null)
            resetForm()
          }}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingProject ? "Edit Project" : "Add New Project"}
                </DialogTitle>
                <DialogDescription>
                  {editingProject 
                    ? "Update your project information below." 
                    : "Fill in the details to add a new project to your portfolio."
                  }
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={editingProject ? handleEditProject : handleAddProject} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={projectForm.title}
                      onChange={(e) => setProjectForm((p) => ({ ...p, title: e.target.value }))}
                      placeholder="Awesome Project"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="skills">Skills</Label>
                    <Input
                      id="skills"
                      value={projectForm.skills}
                      onChange={(e) => setProjectForm((p) => ({ ...p, skills: e.target.value }))}
                      placeholder="react, node, typescript"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="summary">Summary</Label>
                  <Textarea
                    id="summary"
                    rows={2}
                    value={projectForm.summary}
                    onChange={(e) => setProjectForm((p) => ({ ...p, summary: e.target.value }))}
                    placeholder="A short summary of the project"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    rows={4}
                    value={projectForm.description}
                    onChange={(e) => setProjectForm((p) => ({ ...p, description: e.target.value }))}
                    placeholder="What is this project about?"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="link">Link</Label>
                    <Input
                      id="link"
                      type="url"
                      value={projectForm.link}
                      onChange={(e) => setProjectForm((p) => ({ ...p, link: e.target.value }))}
                      placeholder="https://example.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="thumbnail">Thumbnail</Label>
                    <Input
                      id="thumbnail"
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setProjectForm((p) => ({ ...p, thumbnail: e.currentTarget.files?.[0] ?? null }))
                      }
                      required={!editingProject}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="images">Images (max 3)</Label>
                  <Input
                    id="images"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.currentTarget.files ?? [])
                      const limited = files.slice(0, 3)
                      if (files.length > 3) {
                        toast({ title: "Limited to 3 images", description: "Only first 3 selected files will be used." })
                      }
                      setProjectForm((p) => ({ ...p, images: limited }))
                    }}
                  />
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowAddForm(false)
                      setEditingProject(null)
                      resetForm()
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingProject ? "Update Project" : "Add Project"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  )
}
