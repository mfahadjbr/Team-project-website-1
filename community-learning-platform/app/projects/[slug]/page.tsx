"use client"

import { notFound, useRouter } from "next/navigation"
import Link from "next/link"
import { projects } from "../data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { use, useEffect, useState } from "react"

type PageProps = {
  params: Promise<{ slug: string }>
}

export default function ProjectDetailPage({ params }: PageProps) {
  const { slug } = use(params)
  const project = projects.find((p) => p.slug === slug)
  if (!project) return notFound()

  const storageKey = `comments:${project.slug}`
  const [comments, setComments] = useState<{ id: string; user: string; text: string; createdAt: string }[]>([])
  const [newComment, setNewComment] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) setComments(JSON.parse(saved))
      setIsLoggedIn(!!localStorage.getItem("user") || !!localStorage.getItem("admin_logged_in"))
    } catch {}
  }, [storageKey])

  const addComment = () => {
    if (!newComment.trim()) return
    if (!isLoggedIn) {
      // Redirect to login and come back after login
      router.push(`/login?redirect=/projects/${project.slug}`)
      return
    }
    const user = (typeof window !== "undefined" && localStorage.getItem("user")) || "Logged User"
    const comment = { id: Date.now().toString(), user: user as string, text: newComment.trim(), createdAt: new Date().toISOString() }
    const next = [comment, ...comments]
    setComments(next)
    setNewComment("")
    try {
      localStorage.setItem(storageKey, JSON.stringify(next))
    } catch {}
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-sans font-bold">{project.title}</h1>
          <Link href="/projects">
            <Button variant="outline">Back to Projects</Button>
          </Link>
        </div>

        <Card>
          <CardHeader className="pb-0">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{project.skill}</Badge>
              <Link href={project.link} target="_blank" className="text-sm text-primary underline">
                Visit Link
              </Link>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <Carousel className="w-full">
                <CarouselContent>
                  {project.images.slice(0, 3).map((img, idx) => (
                    <CarouselItem key={idx}>
                      <img src={img || "/placeholder.jpg"} alt={`Image ${idx + 1}`} className="w-full h-80 object-cover rounded-md" />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
            <div>
              <CardTitle className="mb-2">Summary</CardTitle>
              <p className="text-muted-foreground mb-4">{project.summary}</p>
              <CardTitle className="mb-2">Description</CardTitle>
              <p className="text-muted-foreground whitespace-pre-wrap">{project.description}</p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Comments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex gap-2">
                <input
                  className="flex-1 border rounded-md px-3 py-2 bg-background"
                  placeholder={isLoggedIn ? "Add a comment..." : "Login to comment – your text will not be saved until you login"}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addComment()}
                />
                <Button onClick={addComment}>{isLoggedIn ? "Post" : "Login"}</Button>
              </div>
              <div className="space-y-3">
                {comments.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Be the first to comment on this project!</p>
                ) : (
                  comments.map((c) => (
                    <div key={c.id} className="border rounded-md p-3 bg-card hover:bg-accent/50 transition-colors">
                      <div className="flex justify-between items-start">
                        <p className="text-sm font-medium">{c.user}</p>
                        <p className="text-xs text-muted-foreground">{new Date(c.createdAt).toLocaleString()}</p>
                      </div>
                      <p className="mt-2 text-sm">{c.text}</p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
