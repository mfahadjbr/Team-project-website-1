"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

// Mock profile data; replace with real data source later
const profile = {
  profileImage: "/placeholder-ebi58.png",
  name: "John Doe",
  profession: "Senior Full Stack Developer",
  skill: "React, Node.js, TypeScript, Python, AWS, Docker",
  description: "Passionate developer with over 5 years of experience building scalable web applications and microservices. Strong expertise in modern JavaScript frameworks and cloud technologies. Love contributing to open source and mentoring fellow developers.",
  yearsOfExperience: 5,
  location: "San Francisco, CA",
  email: "john.doe@example.com",
  linkedin: "https://linkedin.com/in/johndoe",
  github: "https://github.com/johndoe",
  fiverr: "https://www.fiverr.com/johndoe",
  whatsapp: "+1234567890",
  certificates: [
    "/assets/card-carousel/1.webp", 
    "/assets/card-carousel/2.webp",
    "/assets/card-carousel/3.webp",
  ],
  achievements: [
    "AWS Certified Solutions Architect",
    "Google Cloud Professional Developer",
    "MongoDB Certified Developer"
  ]
}

export default function ViewProfilePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-sans font-bold">Developer Profile</h1>
          <Link href="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Professional Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="relative">
                <img
                  src={profile.profileImage}
                  alt="Profile"
                  className="h-48 w-48 rounded-full object-cover border-4 border-primary/20"
                />
                <Badge className="absolute bottom-2 right-2" variant="secondary">
                  {profile.yearsOfExperience}+ YOE
                </Badge>
              </div>
              
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">{profile.name}</h2>
                <p className="text-lg text-primary">{profile.profession}</p>
                <p className="text-muted-foreground">{profile.location}</p>
              </div>

              <div className="max-w-2xl">
                <h3 className="font-semibold mb-2">About Me</h3>
                <p className="text-muted-foreground">{profile.description}</p>
              </div>

              <div className="w-full max-w-2xl">
                <h3 className="font-semibold mb-2">Skills</h3>
                <div className="flex flex-wrap gap-2 justify-center">
                  {profile.skill.split(", ").map((skill, idx) => (
                    <Badge key={idx} variant="outline">{skill}</Badge>
                  ))}
                </div>
              </div>

              <div className="w-full max-w-2xl">
                <h3 className="font-semibold mb-2">Achievements</h3>
                <div className="flex flex-wrap gap-2 justify-center">
                  {profile.achievements.map((achievement, idx) => (
                    <Badge key={idx} variant="secondary">{achievement}</Badge>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-3">
                <Button asChild variant="outline" size="sm">
                  <a href={`mailto:${profile.email}`}>
                    Email
                  </a>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <a href={profile.github} target="_blank" rel="noopener noreferrer">GitHub</a>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <a href={profile.fiverr} target="_blank" rel="noopener noreferrer">Fiverr</a>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <a href={`https://wa.me/${profile.whatsapp}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>
                </Button>
              </div>
            </div>

            <div>
              <h3 className="text-center font-semibold mb-4">Certifications & Achievements</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
                {profile.certificates.map((img, idx) => (
                  <div key={idx} className="relative group">
                    <img 
                      src={img} 
                      alt={`Certificate ${idx+1}`} 
                      className="w-full h-48 object-cover rounded-lg shadow-md transition-transform group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <Button variant="secondary" size="sm">View Certificate</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
