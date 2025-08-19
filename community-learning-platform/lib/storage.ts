// Simple storage utility to simulate Chasha storage
// In a real application, this would connect to your Chasha database

export interface Project {
  id: string
  title: string
  summary: string
  description: string
  skills: string[]
  link: string
  thumbnail: string
  images: string[]
  createdAt: string
}

export interface UserProfile {
  id: string
  profession?: string
  fullName: string
  username: string
  email: string
  skills: string
  description: string
  yearsOfExperience: string
  linkedin: string
  github: string
  fiverr: string
  whatsapp: string
  profileImage: string | null
  certificateImages: string[]
  // Additional fields from backend /profile/me
  userId?: string
  certificates?: string[]
  createdAt?: string
  updatedAt?: string
}

export interface CarouselConfig {
  images: string[]
}

export interface CourseCategory {
  id: string
  title: string
  link: string
  image: string
}

class StorageService {
  private projects: Project[] = []
  private userProfile: UserProfile | null = null
  private carousel: CarouselConfig = { images: [] }
  private categories: CourseCategory[] = []

  // Initialize with sample data
  constructor() {
    this.loadFromLocalStorage()
  }

  // Projects methods
  async getProjects(): Promise<Project[]> {
    return this.projects
  }

  async addProject(project: Omit<Project, 'id' | 'createdAt'>): Promise<Project> {
    const newProject: Project = {
      ...project,
      id: `${Date.now()}-${Math.random().toString(36).slice(2,8)}`,
      createdAt: new Date().toISOString().split('T')[0]
    }
    
    this.projects.unshift(newProject)
    this.saveToLocalStorage()
    return newProject
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
    const index = this.projects.findIndex(p => p.id === id)
    if (index === -1) return null

    this.projects[index] = { ...this.projects[index], ...updates }
    this.saveToLocalStorage()
    return this.projects[index]
  }

  async deleteProject(id: string): Promise<boolean> {
    const index = this.projects.findIndex(p => p.id === id)
    if (index === -1) return false

    this.projects.splice(index, 1)
    this.saveToLocalStorage()
    return true
  }

  // Profile methods
  async getUserProfile(): Promise<UserProfile | null> {
    return this.userProfile
  }

  async updateUserProfile(profile: Partial<UserProfile>): Promise<UserProfile | null> {
    if (!this.userProfile) {
      this.userProfile = {
        id: Date.now().toString(),
        fullName: '',
        username: '',
        email: '',
        skills: '',
        description: '',
        yearsOfExperience: '',
        linkedin: '',
        github: '',
        fiverr: '',
        whatsapp: '',
        profileImage: null,
        certificateImages: [],
        userId: '',
        certificates: [],
        createdAt: '',
        updatedAt: '',
        ...profile
      }
    } else {
      this.userProfile = { ...this.userProfile, ...profile }
    }
    
    this.saveToLocalStorage()
    return this.userProfile
  }

  // Carousel methods
  async getCarousel(): Promise<CarouselConfig> {
    return this.carousel
  }

  async setCarousel(images: string[]): Promise<CarouselConfig> {
    this.carousel = { images: images.slice(0, 3) }
    this.saveToLocalStorage()
    return this.carousel
  }

  // Course categories
  async getCourseCategories(): Promise<CourseCategory[]> {
    return this.categories
  }

  async addCourseCategory(category: Omit<CourseCategory, 'id'>): Promise<CourseCategory> {
    const newCategory: CourseCategory = {
      ...category,
      id: `${Date.now()}-${Math.random().toString(36).slice(2,8)}`,
    }
    this.categories.unshift(newCategory)
    this.saveToLocalStorage()
    return newCategory
  }

  async deleteCourseCategory(id: string): Promise<boolean> {
    const index = this.categories.findIndex(c => c.id === id)
    if (index === -1) return false
    this.categories.splice(index, 1)
    this.saveToLocalStorage()
    return true
  }

  // Local storage methods
  private saveToLocalStorage() {
    try {
      localStorage.setItem('chasha_projects', JSON.stringify(this.projects))
      localStorage.setItem('chasha_profile', JSON.stringify(this.userProfile))
      localStorage.setItem('chasha_carousel', JSON.stringify(this.carousel))
      localStorage.setItem('chasha_categories', JSON.stringify(this.categories))
    } catch (error) {
      console.error('Failed to save to localStorage:', error)
    }
  }

  private loadFromLocalStorage() {
    try {
      const projectsData = localStorage.getItem('chasha_projects')
      const profileData = localStorage.getItem('chasha_profile')
      const carouselData = localStorage.getItem('chasha_carousel')
      const categoriesData = localStorage.getItem('chasha_categories')
      
      if (projectsData) {
        this.projects = JSON.parse(projectsData)
      }
      
      if (profileData) {
        this.userProfile = JSON.parse(profileData)
      }

      if (carouselData) {
        this.carousel = JSON.parse(carouselData)
      }

      if (categoriesData) {
        this.categories = JSON.parse(categoriesData)
      }
    } catch (error) {
      console.error('Failed to load from localStorage:', error)
    }
  }

  // Clear all data (for logout)
  clearAll() {
    this.projects = []
    this.userProfile = null
    this.carousel = { images: [] }
    this.categories = []
    localStorage.removeItem('chasha_projects')
    localStorage.removeItem('chasha_profile')
    localStorage.removeItem('chasha_carousel')
    localStorage.removeItem('chasha_categories')
  }
}

// Export singleton instance
export const storageService = new StorageService()
