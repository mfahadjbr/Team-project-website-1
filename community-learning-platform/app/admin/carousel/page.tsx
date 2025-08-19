"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { storageService } from "@/lib/storage"
import Link from "next/link"

export default function AdminCarouselPage() {
  const [images, setImages] = useState<string[]>(["", "", ""]) // 3 slots

  useEffect(() => {
    storageService.getCarousel().then((c) => {
      if (c?.images?.length) {
        const next = ["", "", ""]
        c.images.slice(0, 3).forEach((img, idx) => (next[idx] = img))
        setImages(next)
      }
    })
  }, [])

  const onChange = (idx: number, file?: File | null) => {
    if (!file) return
    if (file.size > 5 * 1024 * 1024) return
    const next = [...images]
    next[idx] = file.name
    setImages(next)
  }

  const onSave = async () => {
    await storageService.setCarousel(images.filter(Boolean))
    alert("Carousel saved")
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Carousel</h1>
        <Link href="/admin/alluser">
          <Button variant="outline">Back</Button>
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Upload 3 Carousel Images</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[0, 1, 2].map((idx) => (
              <div key={idx} className="border rounded-md p-4">
                <div className="aspect-video bg-muted rounded mb-3 flex items-center justify-center overflow-hidden">
                  {images[idx] ? (
                    <img src={`/uploads/${images[idx]}`} alt={`Image ${idx + 1}`} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-muted-foreground text-sm">No image</span>
                  )}
                </div>
                <input type="file" accept="image/*" onChange={(e) => onChange(idx, e.currentTarget.files?.[0])} />
              </div>
            ))}
          </div>
          <div className="flex justify-end">
            <Button onClick={onSave}>Save Carousel</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


