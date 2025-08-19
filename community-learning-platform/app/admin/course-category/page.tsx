"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { storageService, CourseCategory } from "@/lib/storage"
import Link from "next/link"

export default function AdminCourseCategoryPage() {
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState("")
  const [link, setLink] = useState("")
  const [image, setImage] = useState("")
  const [list, setList] = useState<CourseCategory[]>([])

  useEffect(() => {
    storageService.getCourseCategories().then(setList)
  }, [])

  const add = async () => {
    if (!title.trim() || !link.trim() || !image.trim()) return
    const created = await storageService.addCourseCategory({ title: title.trim(), link: link.trim(), image })
    setList((prev) => [created, ...prev])
    setShowForm(false)
    setTitle("")
    setLink("")
    setImage("")
  }

  const remove = async (id: string) => {
    const ok = await storageService.deleteCourseCategory(id)
    if (ok) setList((prev) => prev.filter((c) => c.id !== id))
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Course Categories</h1>
        <div className="flex gap-2">
          <Button onClick={() => setShowForm((s) => !s)}>{showForm ? "Close" : "Add Category"}</Button>
          <Link href="/admin/alluser">
            <Button variant="outline">Back</Button>
          </Link>
        </div>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>New Course Category</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm">Title</label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Web Development" />
            </div>
            <div>
              <label className="text-sm">Link</label>
              <Input value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://example.com/courses/web" />
            </div>
            <div>
              <label className="text-sm">Course Image</label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const f = e.currentTarget.files?.[0]
                  if (!f) return
                  if (f.size > 5 * 1024 * 1024) return
                  setImage(f.name)
                }}
              />
              {image && <p className="text-xs text-muted-foreground mt-1">Selected: {image}</p>}
            </div>
            <div className="flex justify-end">
              <Button onClick={add}>Create</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Categories</CardTitle>
        </CardHeader>
        <CardContent>
          {list.length === 0 ? (
            <p className="text-sm text-muted-foreground">No categories yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {list.map((c) => (
                <div key={c.id} className="border rounded-md p-4">
                  <img src={`/uploads/${c.image}`} alt={c.title} className="w-full h-32 object-cover rounded mb-2" />
                  <div className="font-medium">{c.title}</div>
                  <a className="text-sm text-primary underline break-all" href={c.link} target="_blank" rel="noreferrer">
                    {c.link}
                  </a>
                  <div className="flex justify-end mt-2">
                    <Button variant="outline" onClick={() => remove(c.id)}>Delete</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}


