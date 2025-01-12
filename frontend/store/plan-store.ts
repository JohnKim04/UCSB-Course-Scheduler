import { create } from 'zustand'
import { Course, Department, PlanYear } from '../types/course'

interface PlanStore {
  courses: Course[]
  searchQuery: string
  selectedDepartment: Department
  selectedTerm: string
  yearPlans: PlanYear[]
  setSearchQuery: (query: string) => void
  setSelectedDepartment: (department: Department) => void
  setSelectedTerm: (term: string) => void
  addCourseToYear: (course: Course, year: number, term: string) => void
  removeCourseFromYear: (courseId: string, year: number, term: string) => void
  getProgress: () => { percentage: number; completedCourses: string[] }
}

export const usePlanStore = create<PlanStore>((set, get) => ({
  courses: [
    {
      id: 'cs101',
      code: 'CS101',
      title: 'Introduction to Programming 1',
      credits: 3,
      category: 'Core Course',
    },
    // Add more courses here...
  ],
  searchQuery: '',
  selectedDepartment: 'All',
  selectedTerm: 'All',
  yearPlans: [
    {
      year: 1,
      terms: {
        Fall: [],
        Winter: [],
        Spring: [],
        Summer: [],
      },
    },
    // Add more years as needed
  ],
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedDepartment: (department) => set({ selectedDepartment: department }),
  setSelectedTerm: (term) => set({ selectedTerm: term }),
  addCourseToYear: (course, year, term) =>
    set((state) => {
      const yearPlans = [...state.yearPlans]
      const yearIndex = yearPlans.findIndex((p) => p.year === year)
      if (yearIndex !== -1) {
        yearPlans[yearIndex].terms[term].push(course)
      }
      return { yearPlans }
    }),
  removeCourseFromYear: (courseId, year, term) =>
    set((state) => {
      const yearPlans = [...state.yearPlans]
      const yearIndex = yearPlans.findIndex((p) => p.year === year)
      if (yearIndex !== -1) {
        yearPlans[yearIndex].terms[term] = yearPlans[yearIndex].terms[term].filter(
          (c) => c.id !== courseId
        )
      }
      return { yearPlans }
    }),
  getProgress: () => {
    const state = get()
    const totalRequiredCourses = 10 // Example: adjust based on actual requirements
    const completedCourses = state.yearPlans
      .flatMap((year) =>
        Object.values(year.terms).flatMap((courses) => courses.map((c) => c.code))
      )
    return {
      percentage: Math.round((completedCourses.length / totalRequiredCourses) * 100),
      completedCourses,
    }
  },
}))

