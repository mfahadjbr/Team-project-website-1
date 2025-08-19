"use client"

import * as React from "react"
import { motion } from "framer-motion"

export function TestimonialCard({
  handleShuffle,
  testimonial,
  position,
  id,
  author,
}: {
  handleShuffle: () => void
  testimonial: string
  position: string
  id: number
  author: string
}) {
  const dragRef = React.useRef(0)
  const isFront = position === "front"

  return (
    <motion.div
      style={{
        zIndex: position === "front" ? "2" : position === "middle" ? "1" : "0",
      }}
      animate={{
        rotate: position === "front" ? "-6deg" : position === "middle" ? "0deg" : "6deg",
        x: position === "front" ? "0%" : position === "middle" ? "33%" : "66%",
        scale: position === "front" ? 1 : position === "middle" ? 0.95 : 0.9,
      }}
      drag={true}
      dragElastic={0.35}
      dragListener={isFront}
      dragConstraints={{
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
      onDragStart={(e) => {
        dragRef.current = e.clientX
      }}
      onDragEnd={(e) => {
        if (dragRef.current - e.clientX > 150) {
          handleShuffle()
        }
        dragRef.current = 0
      }}
      transition={{ duration: 0.35 }}
      whileHover={isFront ? { scale: 1.02, rotate: "-4deg" } : {}}
      className={`absolute left-0 top-0 grid h-[450px] w-[350px] select-none place-content-center space-y-6 rounded-2xl border-2 border-emerald-200 bg-white/90 backdrop-blur-md p-6 shadow-xl ${
        isFront ? "cursor-grab active:cursor-grabbing shadow-2xl" : "shadow-lg"
      }`}
    >
      <div className="relative">
        <img
          src={`https://i.pravatar.cc/128?img=${id}`}
          alt={`Avatar of ${author}`}
          className="pointer-events-none mx-auto h-32 w-32 rounded-full border-4 border-emerald-200 bg-emerald-50 object-cover shadow-lg"
        />
        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          >
            ✨
          </motion.div>
        </div>
      </div>
      <div className="text-center space-y-4">
        <span className="text-lg italic text-emerald-800 leading-relaxed block">"{testimonial}"</span>
        <div className="flex justify-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              ⭐
            </motion.div>
          ))}
        </div>
        <span className="text-sm font-medium text-emerald-600 block">{author}</span>
      </div>
      {isFront && (
        <motion.div
          className="absolute bottom-4 right-4 text-emerald-400 text-sm"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        >
          Drag to see more →
        </motion.div>
      )}
    </motion.div>
  )
}

const testimonials = [
  {
    id: 1,
    testimonial:
      "This learning platform transformed my career. The community-driven approach made complex topics accessible and engaging.",
    author: "Sarah M. - Software Engineer",
  },
  {
    id: 2,
    testimonial:
      "The interactive courses and peer collaboration features are outstanding. I've learned more here than anywhere else.",
    author: "David L. - Product Manager",
  },
  {
    id: 3,
    testimonial:
      "Amazing platform with incredible instructors. The project-based learning approach really works for practical skills.",
    author: "Maria R. - UX Designer",
  },
]

export function ShuffleCards() {
  const [positions, setPositions] = React.useState(["front", "middle", "back"])

  const handleShuffle = () => {
    const newPositions = [...positions]
    newPositions.unshift(newPositions.pop()!)
    setPositions(newPositions)
  }

  return (
    <div className="grid place-content-center overflow-hidden bg-gradient-to-br from-emerald-50 to-teal-100 px-8 py-24 text-slate-800 min-h-screen h-full w-full relative">
      <motion.div
        className="absolute top-10 left-10 w-4 h-4 bg-emerald-300 rounded-full opacity-60"
        animate={{
          y: [0, -20, 0],
          x: [0, 10, 0],
        }}
        transition={{
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-20 right-20 w-6 h-6 bg-teal-300 rounded-full opacity-40"
        animate={{
          y: [0, 15, 0],
          x: [0, -15, 0],
        }}
        transition={{
          duration: 5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 1,
        }}
      />
      <motion.div
        className="absolute bottom-20 left-20 w-3 h-3 bg-emerald-400 rounded-full opacity-50"
        animate={{
          y: [0, -10, 0],
          x: [0, 20, 0],
        }}
        transition={{
          duration: 6,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      <div className="relative -ml-[100px] h-[450px] w-[350px] md:-ml-[175px]">
        {testimonials.map((testimonial, index) => (
          <TestimonialCard
            key={testimonial.id}
            {...testimonial}
            handleShuffle={handleShuffle}
            position={positions[index]}
          />
        ))}
      </div>
    </div>
  )
}
