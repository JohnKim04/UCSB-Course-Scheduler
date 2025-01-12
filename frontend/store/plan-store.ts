import { create } from 'zustand'
import { Course, Department, PlanYear } from '../types/course'

interface PlanStore {
  courses: Course[]
  searchQuery: string
  selectedDepartment: Department
  selectedTerm: string
  yearPlans: PlanYear[]
  coursesInPlan: Set<string>
  setSearchQuery: (query: string) => void
  setSelectedDepartment: (department: Department) => void
  setSelectedTerm: (term: string) => void
  addCourseToYear: (course: Course, year: number, term: string) => void
  removeCourseFromYear: (courseId: string, year: number, term: string) => void
  getProgress: () => { percentage: number; completedCourses: string[] }
  selectedMajor: string
  setSelectedMajor: (major: string) => void
}

export const usePlanStore = create<PlanStore>((set, get) => ({
  courses: [
    {
      id: 'cs101',
      code: 'CS101',
      title: 'Introduction to Programming 1',
      credits: 3,
      category: 'Core Course',
      major: 'Computer Science',
    },
    {
      id: 'cs130a',
      code: 'CS130A',
      title: 'Data Structures and Algorithms I',
      credits: 4,
      category: 'Core Course',
      major: 'Computer Science',
    },
    {
      id: 'cs130b',
      code: 'CS130B',
      title: 'Data Structures and Algorithms II',
      credits: 4,
      category: 'Core Course',
      major: 'Computer Science',
    },
    {
      id: 'cs154',
      code: 'CS154',
      title: 'Computer Architecture',
      credits: 4,
      category: 'Core Course',
      major: 'Computer Science',
    },
    {
      id: 'cs160',
      code: 'CS160',
      title: 'Translation of Programming Languages',
      credits: 4,
      category: 'Core Course',
      major: 'Computer Science',
    },
    {
      id: 'cs170',
      code: 'CS170',
      title: 'Operating Systems',
      credits: 4,
      category: 'Core Course',
      major: 'Computer Science',
    },
    {
      id: 'cs176a',
      code: 'CS176A',
      title: 'Introduction to Computer Communication Networks',
      credits: 4,
      category: 'Elective',
      major: 'Computer Science',
    },
    {
      id: 'cs180',
      code: 'CS180',
      title: 'Computer Graphics',
      credits: 4,
      category: 'Elective',
      major: 'Computer Science',
    },
    {
      id: 'asam1',
      code: 'ASAM1',
      title: 'Introduction to Asian American Studies',
      credits: 4,
      category: 'General Education',
      major: 'Asian American Studies',
    },
    {
      id: 'arth2',
      code: 'ARTH2',
      title: 'American Art History',
      credits: 4,
      category: 'General Education',
      major: 'Art History',
    },
    {
      id: 'eng2',
      code: 'ENG2',
      title: 'English Composition',
      credits: 4,
      category: 'General Education',
      major: 'English',
    },
    {
      id: 'music15',
      code: 'MUSIC15',
      title: 'Music Appreciation',
      credits: 4,
      category: 'General Education',
      major: 'Music',
    },
    {
      id: 'phys1',
      code: 'PHYS1',
      title: 'Basic Physics',
      credits: 4,
      category: 'General Education',
      major: 'Physics',
    },
    {
      id: 'math3a',
      code: 'MATH3A',
      title: 'Calculus with Applications, First Course',
      credits: 4,
      category: 'Core Course',
      major: 'Mathematics',
    },
    {
      id: 'math3b',
      code: 'MATH3B',
      title: 'Calculus with Applications, Second Course',
      credits: 4,
      category: 'Core Course',
      major: 'Mathematics',
    },
    {
      id: 'math4a',
      code: 'MATH4A',
      title: 'Linear Algebra with Applications',
      credits: 4,
      category: 'Core Course',
      major: 'Mathematics',
    },
    {
      id: 'pstat120a',
      code: 'PSTAT120A',
      title: 'Probability and Statistics',
      credits: 4,
      category: 'Core Course',
      major: 'Statistics',
    },
    {
      id: 'writ50',
      code: 'WRIT50',
      title: 'Writing for Science and Technology',
      credits: 4,
      category: 'General Education',
      major: 'Writing',
    },
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
    {
      year: 2,
      terms: { Fall: [], Winter: [], Spring: [], Summer: [] },
    },
    {
      year: 3,
      terms: { Fall: [], Winter: [], Spring: [], Summer: [] },
    },
    {
      year: 4,
      terms: { Fall: [], Winter: [], Spring: [], Summer: [] },
    },
  ],
  coursesInPlan: new Set<string>(),
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
      const coursesInPlan = new Set(state.coursesInPlan)
      coursesInPlan.add(course.id)
      return { yearPlans, coursesInPlan }
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
      const coursesInPlan = new Set(state.coursesInPlan)
      coursesInPlan.delete(courseId)
      return { yearPlans, coursesInPlan }
    }),
  getProgress: () => {
    const state = get()
    const totalRequiredCourses = 12 // Adjust based on your curriculum
    const completedCourses = state.yearPlans
      .flatMap((year) =>
        Object.values(year.terms).flatMap((courses) => courses.map((c) => c.code))
      )
    const uniqueCompletedCourses = Array.from(new Set(completedCourses))
    return {
      percentage: Math.round((uniqueCompletedCourses.length / totalRequiredCourses) * 100),
      completedCourses: uniqueCompletedCourses,
    }
  },
  selectedMajor: 'All',
  setSelectedMajor: (major) => set({ selectedMajor: major }),
}))

