"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { storageService, type CourseCategory } from "@/lib/storage"

export default function CoursesPage() {
  const [courses, setCourses] = useState<CourseCategory[]>([])

  useEffect(() => {
    storageService.getCourseCategories().then(setCourses)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-sans font-bold">Courses</h1>
        </div>

        {courses.length === 0 ? (
          <p className="text-muted-foreground">No courses available yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((c) => (
              <Card key={c.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{c.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <img
                    src={c.image ? `/uploads/${c.image}` : "/placeholder.jpg"}
                    alt={c.title}
                    className="w-full h-40 object-cover rounded-md mb-4"
                  />
                  <Button asChild>
                    <Link href={c.link} target="_blank" rel="noopener noreferrer">
                      Open Course
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
