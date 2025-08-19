export type Project = {
  slug: string
  title: string
  summary: string
  description: string
  skill: string
  link: string
  thumbnail: string
  images: string[]
}

export const projects: Project[] = [
  {
    slug: "ecommerce-dashboard",
    title: "E-commerce Dashboard",
    summary: "Admin dashboard with analytics and inventory management",
    description:
      "A comprehensive admin dashboard for managing online stores with real-time analytics, inventory, and order tracking.",
    skill: "React, Node.js, TypeScript",
    link: "https://example.com/ecommerce-dashboard",
    thumbnail: "/assets/card-carousel/1.webp",
    images: [
      "/assets/card-carousel/1.webp",
      "/assets/card-carousel/2.webp",
      "/assets/card-carousel/3.webp",
    ],
  },
  {
    slug: "mobile-banking-app",
    title: "Mobile Banking App",
    summary: "Secure and intuitive mobile banking experience",
    description:
      "A mobile app featuring biometric authentication, real-time transactions, and modern UI for digital banking.",
    skill: "Flutter, Firebase",
    link: "https://example.com/mobile-banking",
    thumbnail: "/asian-mobile-developer.png",
    images: [
      "/asian-mobile-developer.png",
      "/coding-instructor-classroom.png",
      "/diverse-students-green-classroom.png",
    ],
  },
  {
    slug: "ai-chatbot",
    title: "AI-Powered Chatbot",
    summary: "Customer service bot using NLP and ML",
    description:
      "Intelligent chatbot leveraging NLP for natural conversations, integrated with customer support workflows.",
    skill: "Python, FastAPI, TensorFlow",
    link: "https://example.com/ai-chatbot",
    thumbnail: "/machine-learning-algorithms.png",
    images: [
      "/machine-learning-algorithms.png",
      "/python-data-science-analytics.png",
      "/react-development-coding.png",
    ],
  },
]


