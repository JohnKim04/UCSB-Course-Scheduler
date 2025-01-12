import { create } from 'zustand'
import { Course, Department, PlanYear } from '../types/course'
import courseData1 from '../../backend/data/20241_CMPSC.json'
import courseData2 from '../../backend/data/20241_Lower_GE.json'

// Combine all course data
const allCourseData = {
  classes: [
    ...courseData1.classes,
    ...courseData2.classes,
  ]
}

// Helper function to transform the json data into our Course format
const transformCourses = (): Course[] => {
  return allCourseData.classes.map(classData => ({
    id: classData.courseId.trim().toLowerCase().replace(/\s+/g, ''),
    code: classData.courseId.trim(),
    title: classData.title,
    credits: classData.unitsFixed || classData.unitsVariableLow || 0,
    category: determineCategory(classData.courseId),
    description: classData.description,
    prerequisites: classData.prereqs,
    generalEducation: classData.generalEducation.map(ge => ge.geCode.trim())
  }))
}

// Helper function to determine course category GONNA NEED NEW LOGIC
const determineCategory = (courseId: string): string => {
  const code = courseId.trim()
  if (code.startsWith('CMPSC')) {
    if (parseInt(code.match(/\d+/)?.[0] || '0') < 100) {
      return 'Lower Division'
    } else if (parseInt(code.match(/\d+/)?.[0] || '0') < 200) {
      return 'Upper Division'
    }
  }
  return 'General Education'
}

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
  // Initialize courses using the transformed JSON data
  courses: transformCourses(),
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
    const requiredCourses = state.courses.filter(course => 
      course.category === 'Core Course' || course.category === 'Lower Division' || 
      course.category === 'Upper Division'
    ).length
    
    const completedCourses = state.yearPlans
      .flatMap((year) =>
        Object.values(year.terms).flatMap((courses) => courses.map((c) => c.code))
      )
    const uniqueCompletedCourses = Array.from(new Set(completedCourses))
    return {
      percentage: Math.round((uniqueCompletedCourses.length / requiredCourses) * 100),
      completedCourses: uniqueCompletedCourses,
    }
  },
  selectedMajor: 'All',
  setSelectedMajor: (major) => set({ selectedMajor: major }),
}))