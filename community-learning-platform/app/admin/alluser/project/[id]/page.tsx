"use client"

import { useEffect, useState } from "react"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

export default function ProjectDetails({ params }: { params: { id: string } }) {
  const [project, setProject] = useState<any>(null)

  useEffect(() => {
    // Fetch project data
    const fetchProject = async () => {
      const response = await fetch(`/api/projects/${params.id}`)
      const data = await response.json()
      setProject(data)
    }
    fetchProject()
  }, [params.id])

  if (!project) return <div>Loading...</div>

  return (
    <div className="flex flex-col gap-8 p-6">
      {/* Carousel */}
      <div className="w-full">
        <Carousel className="w-full">
          <CarouselContent>
            {project.images?.map((image: string, index: number) => (
              <CarouselItem key={index}>
                <img src={image} alt={`Project image ${index + 1}`} className="w-full h-80 object-cover rounded-md" />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>

      {/* Summary */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-2">Summary</h2>
        <p>{project.summary}</p>
      </div>

      {/* Description */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-2">Description</h2>
        <p>{project.description}</p>
      </div>

      {/* Skills */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-2">Skills</h2>
        <div className="flex flex-wrap gap-2">
          {project.skills?.map((skill: string, index: number) => (
            <span key={index} className="bg-gray-200 px-3 py-1 rounded">
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Links */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-2">Links</h2>
        <div className="flex flex-col gap-2">
          {project.links?.map((link: any, index: number) => (
            <a 
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {link.title}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
