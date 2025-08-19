"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const users = [
  {
    id: "sarah-chen",
    name: "Sarah Chen",
    role: "Full Stack Developer",
    avatar: "/black-designer-glasses.png",
  },
  {
    id: "marcus-johnson",
    name: "Marcus Johnson",
    role: "UX Designer",
    avatar: "/black-designer-glasses.png",
  },
  {
    id: "elena-rodriguez",
    name: "Elena Rodriguez",
    role: "Data Scientist",
    avatar: "/latina-data-scientist.png",
  },
  {
    id: "david-kim",
    name: "David Kim",
    role: "Mobile Developer",
    avatar: "/asian-mobile-developer.png",
  },
]

export default function AdminAllUsersPage() {
  return (
    <div className="min-h-screen bg-background p-6">
      <h1 className="text-2xl font-bold mb-6">All Users</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {users.map((user) => (
          <Card key={user.id} className="border-primary/20">
            <CardContent className="p-6 text-center">
              <div className="mx-auto h-24 w-24 rounded-full overflow-hidden ring-4 ring-primary/20 mb-4">
                <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
              </div>
              <div className="space-y-1 mb-4">
                <p className="text-lg font-semibold">{user.name}</p>
                <p className="text-muted-foreground">{user.role}</p>
              </div>
              <div className="flex items-center justify-center gap-3">
                <Link href="/admin/alluser/userprofile">
                  <Button variant="outline" size="sm">View Profile</Button>
                </Link>
                <Link href="/admin/alluser/project">
                  <Button size="sm">View Projects</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}


