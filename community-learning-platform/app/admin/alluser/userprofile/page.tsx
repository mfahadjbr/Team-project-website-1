"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function AdminUserProfile() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">User Profile</h1>
        <Link href="/admin/alluser">
          <Button variant="outline">Back</Button>
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <img src="/placeholder-user.jpg" alt="User" className="h-32 w-32 rounded-full object-cover" />
            <div className="space-y-2">
              <p className="text-lg font-semibold">Sarah Chen</p>
              <p className="text-muted-foreground">Full Stack Developer</p>
              <p className="text-sm">Passionate developer with expertise in modern web technologies</p>
              <div className="flex gap-2">
                <Link href="/projects">
                  <Button size="sm">View Projects</Button>
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


