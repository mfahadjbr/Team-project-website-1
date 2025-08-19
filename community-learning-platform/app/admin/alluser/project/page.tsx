"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { projects } from "@/app/projects/data"

export default function AdminProjectsList() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">All Projects</h1>
        <Link href="/admin/alluser">
          <Button variant="outline">Back to Users</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.slug} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{project.title}</span>
                <Badge variant="outline">{project.skill.split(",")[0]}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <img src={project.thumbnail || "/placeholder.jpg"} alt={project.title} className="w-full h-40 object-cover rounded-md mb-3" />
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{project.summary}</p>
              <div className="flex gap-2">
                <Link href={`/projects/${project.slug}`}>
                  <Button size="sm">Open</Button>
                </Link>
                <Link href={`/admin/alluser/project/${project.slug}`}>
                  <Button size="sm" variant="outline">Open (Admin)</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}


