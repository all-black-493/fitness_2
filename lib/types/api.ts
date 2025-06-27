export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  username: string
  createdAt: string
}

export interface Workout {
  id: string
  userId: string
  name: string
  date: string
  duration?: number
  exercises: Exercise[]
  tags: string[]
  notes?: string
  friends?: string[]
  completed: boolean
  createdAt: string
}

export interface Exercise {
  id: string
  name: string
  type: "strength" | "cardio" | "flexibility" | "bodyweight"
  sets: Set[]
}

export interface Set {
  reps?: number
  weight?: number
  duration?: string
  distance?: number
  completed: boolean
}

export interface Community {
  id: string
  name: string
  description: string
  members: number
  posts: number
  category: string
  avatar?: string
  isJoined: boolean
}

export interface Challenge {
  id: string
  name: string
  description: string
  participants: number
  daysLeft: number
  progress: number
  isJoined: boolean
  difficulty: string
  category: string
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}
