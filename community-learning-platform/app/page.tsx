"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ChevronLeft,
  ChevronRight,
  Leaf,
  Code,
  Palette,
  Camera,
  Music,
  Calculator,
  Heart,
  Star,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"
import { TestimonialCard } from "@/components/ui/testimonial-cards"

const heroSlides = [
  {
    id: 1,
    title: "Learn Together, Grow Together",
    subtitle: "Join our vibrant community of learners and discover new skills through collaborative education",
    image: "/diverse-students-green-classroom.png",
    cta: "Start Learning",
  },
  {
    id: 2,
    title: "Expert-Led Courses",
    subtitle: "Learn from industry professionals and gain practical skills that matter in today's world",
    image: "/coding-instructor-classroom.png",
    cta: "Browse Courses",
  },
  {
    id: 3,
    title: "Build Your Future",
    subtitle: "Transform your passion into expertise with our comprehensive learning paths and community support",
    image: "/graduation-celebration.png",
    cta: "Get Started",
  },
]

const categories = [
  {
    name: "Node.js",
    icon: Code,
    count: 156,
    color: "bg-emerald-100 text-emerald-700",
    image: "/react-development-coding.png",
    url: "https://www.youtube.com/watch?v=EfWlJ9-1fVw&t=21494s",
  },
  {
    name: "React",
    icon: Palette,
    count: 89,
    color: "bg-green-100 text-green-700",
    image: "/ui-ux-design-interface.png",
    url: "https://www.youtube.com/watch?v=EfWlJ9-1fVw&t=21494s",
  },
  {
    name: "Python",
    icon: Camera,
    count: 67,
    color: "bg-teal-100 text-teal-700",
    image: "/python-data-science-analytics.png",
    url: "https://www.youtube.com/watch?v=EfWlJ9-1fVw&t=21494s",
  },
  {
    name: "Java",
    icon: Music,
    count: 45,
    color: "bg-emerald-100 text-emerald-700",
    image: "/python-data-science-analytics.png",
    url: "https://www.youtube.com/watch?v=EfWlJ9-1fVw&t=21494s",
  },
  {
    name: "Next.js",
    icon: Calculator,
    count: 78,
    color: "bg-green-100 text-green-700",
    image: "/python-data-science-analytics.png",
    url: "https://www.youtube.com/watch?v=EfWlJ9-1fVw&t=21494s",
  },
  {
    name: "C++",
    icon: Heart,
    count: 92,
    color: "bg-teal-100 text-teal-700",
    image: "/python-data-science-analytics.png",
    url: "https://www.youtube.com/watch?v=EfWlJ9-1fVw&t=21494s",
  },
]

const featuredUsers = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Full Stack Developer",
    avatar: "/black-designer-glasses.png"
  },
  {
    id: 2,
    name: "Marcus Johnson", 
    role: "UX Designer",
    avatar: "/black-designer-glasses.png"
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    role: "Data Scientist",
    avatar: "/latina-data-scientist.png"
  },
  {
    id: 4,
    name: "David Kim",
    role: "Mobile Developer",
    avatar: "/asian-mobile-developer.png"
  },
]

const testimonials = [
  {
    id: 1,
    testimonial:
      "This platform transformed my career. The community support and expert guidance helped me land my dream job in tech.",
    author: "Jennifer Martinez - Software Engineer @ Google",
  },
  {
    id: 2,
    testimonial:
      "The collaborative learning approach here is incredible. I've learned more in 6 months than I did in years of self-study.",
    author: "Alex Thompson - Product Designer @ Spotify",
  },
  {
    id: 3,
    testimonial:
      "The mentorship and project-based learning gave me real-world skills. I'm now running my own successful design agency.",
    author: "Priya Patel - Founder @ Creative Studios",
  },
]

export default function LandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [email, setEmail] = useState("")
  const [testimonialPositions, setTestimonialPositions] = useState(["front", "middle", "back"])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
  }

  const handleTestimonialShuffle = () => {
    const newPositions = [...testimonialPositions]
    newPositions.unshift(newPositions.pop() as string)
    setTestimonialPositions(newPositions)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Left side - Logo and name */}
            <div className="flex items-center space-x-2">
              <Link href="/" className="flex items-center space-x-2">
                <motion.div whileHover={{ rotate: 360, scale: 1.1 }} transition={{ duration: 0.5 }}>
                  <Leaf className="h-8 w-8 text-primary" />
                </motion.div>
                <span className="text-2xl font-sans font-bold text-foreground">Programming Community</span>
              </Link>
            </div>

            {/* Center - Navigation links */}
            <nav className="hidden md:flex items-center space-x-8 flex-1 justify-center">
              <motion.a
                href="/courses"
                className="text-muted-foreground hover:text-primary transition-colors relative group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Courses
                <span className="absolute left-0 bottom-0 w-full h-0.5 bg-primary transform scale-x-0 transition-transform group-hover:scale-x-100"></span>
              </motion.a>
              <motion.a
                href="#testimonials" 
                className="text-muted-foreground hover:text-primary transition-colors relative group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Testimonials
                <span className="absolute left-0 bottom-0 w-full h-0.5 bg-primary transform scale-x-0 transition-transform group-hover:scale-x-100"></span>
              </motion.a>
              <motion.a
                href="#about"
                className="text-muted-foreground hover:text-primary transition-colors relative group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                About
                <span className="absolute left-0 bottom-0 w-full h-0.5 bg-primary transform scale-x-0 transition-transform group-hover:scale-x-100"></span>
              </motion.a>
            </nav>

            {/* Right side - Auth buttons */}
            <div className="hidden md:flex items-center space-x-2">
              <Link href="/login">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" className="bg-transparent">
                    Login
                  </Button>
                </motion.div>
              </Link>
              <Link href="/signup">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button>Sign Up</Button>
                </motion.div>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Carousel */}
      <section className="relative h-[600px] overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => {
            // Create stable random values for each dot
            const left = 10 + (i * 15) % 80; // Distribute dots evenly
            const top = 20 + (i * 12) % 60; // Distribute dots evenly
            const xOffset = (i % 3 - 1) * 8; // Small x movement
            const duration = 4 + (i % 3) * 0.5; // Vary duration slightly
            
            return (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-emerald-300 rounded-full opacity-30"
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  x: [0, xOffset, 0],
                  opacity: [0.3, 0.7, 0.3],
                }}
                transition={{
                  duration: duration,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: i * 0.5,
                }}
              />
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <div className="relative h-full bg-gradient-to-r from-primary/10 to-secondary/10">
              <motion.img
                src={heroSlides[currentSlide].image || "/placeholder.svg"}
                alt={heroSlides[currentSlide].title}
                className="absolute inset-0 w-full h-full object-cover"
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent" />
              <div className="relative container mx-auto px-4 h-full flex items-center">
                <div className="max-w-2xl ml-5">
                  <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-5xl md:text-6xl font-sans font-bold text-foreground mb-6"
                  >
                    {heroSlides[currentSlide].title}
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-xl text-muted-foreground mb-8 leading-relaxed"
                  >
                    {heroSlides[currentSlide].subtitle}
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Link href="/signup">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button size="lg" className="text-lg px-8 py-6">
                          {heroSlides[currentSlide].cta}
                          <motion.div
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                          >
                            <ArrowRight className="ml-2 h-5 w-5" />
                          </motion.div>
                        </Button>
                      </motion.div>
                    </Link>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel Controls */}
        {/* <motion.button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background p-2 rounded-full transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronLeft className="h-6 w-6" />
        </motion.button>
        <motion.button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background p-2 rounded-full transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronRight className="h-6 w-6" />
        </motion.button> */}

        {/* Slide Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {heroSlides.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? "bg-primary" : "bg-background/50"
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.8 }}
            />
          ))}
        </div>
      </section>

      {/* Course Categories */}
      <section className="py-20 bg-muted/30 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23059669' fillOpacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl font-sans font-bold text-foreground mb-4"
            >
              Explore Courses Categories
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              Discover courses across various disciplines and find your passion
            </motion.p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <a href={category.url} target="_blank" rel="noopener noreferrer" className="block">
                  <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group border-emerald-100">
                    <CardContent className="p-4 text-center">
                      <motion.img
                        src={category.image || "/placeholder.jpg"}
                        alt={category.name}
                        className="w-full h-28 md:h-32 object-cover rounded-lg mb-3"
                        whileHover={{ scale: 1.03 }}
                        transition={{ duration: 0.3 }}
                      />
                      <h3 className="font-sans font-semibold text-foreground">{category.name}</h3>
                    </CardContent>
                  </Card>
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Users */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl font-sans font-bold text-foreground mb-4"
            >
              Meet Our Community
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              Connect with talented learners and mentors from around the world
            </motion.p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredUsers.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <Card className="hover:shadow-xl transition-all duration-300 border-emerald-100">
                  <CardContent className="p-6 text-center">
                    <motion.img
                      src={user.avatar || "/placeholder.svg"}
                      alt={user.name}
                      className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-emerald-100"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    />
                    <h3 className="font-sans font-semibold text-foreground mb-1">{user.name}</h3>
                    <p className="text-muted-foreground mb-3">{user.role}</p>
                    
                    
                    <div className="flex space-x-2">
                      <motion.div className="flex-1" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link href="/view-profile">
                          <Button variant="outline" size="sm" className="w-full bg-transparent border-emerald-200">
                            View Profile
                          </Button>
                        </Link>
                      </motion.div>
                      <motion.div className="flex-1" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link href="/projects">
                          <Button size="sm" className="w-full">
                            View Projects
                          </Button>
                        </Link>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-muted/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-teal-50/50" />
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl font-sans font-bold text-foreground mb-4"
            >
              What Our Learners Say
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              Real stories from our community members who transformed their careers
            </motion.p>
          </div>
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative h-[450px] w-[350px] md:w-[400px]">
              {testimonials.map((testimonial, index) => (
                <TestimonialCard
                  key={testimonial.id}
                  {...testimonial}
                  handleShuffle={handleTestimonialShuffle}
                  position={testimonialPositions[index]}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>
      

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0">
          {[...Array(8)].map((_, i) => {
            // Create stable random values for each dot
            const left = 5 + (i * 12) % 90; // Distribute dots evenly
            const top = 15 + (i * 10) % 70; // Distribute dots evenly
            const duration = 3 + (i % 3) * 0.5; // Vary duration slightly
            
            return (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full opacity-20"
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                }}
                animate={{
                  y: [0, -50, 0],
                  opacity: [0.2, 0.8, 0.2],
                }}
                transition={{
                  duration: duration,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: i * 0.3,
                }}
              />
            );
          })}
        </div>

        <div className="container mx-auto px-4 text-center relative">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl font-sans font-bold mb-4">Ready to Start Your Learning Journey?</h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of learners who are already building their future with our community-driven platform
            </p>
            <Link href="/signup">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="secondary" size="lg" className="text-lg px-8 py-6">
                  Get Started
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                  >
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </motion.div>
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="flex items-center space-x-2 mb-4">
                <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
                  <Leaf className="h-8 w-8 text-primary" />
                </motion.div>
                <span className="text-2xl font-sans font-bold">Programming Community</span>
              </div>
              <p className="text-muted-foreground">
                Empowering learners worldwide through community-driven education and collaborative growth.
              </p>
            </motion.div>
            <div>
              <h3 className="font-sans font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Courses
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Community
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Mentorship
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Projects
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-sans font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-sans font-semibold mb-4">Connect</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Discord
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    GitHub
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-12 pt-8 text-center text-muted-foreground">
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              &copy; 2025 Programming Community. All rights reserved.
            </motion.p>
          </div>
        </div>
      </footer>
    </div>
  )
}
