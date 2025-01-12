import { create } from 'zustand'
import { Course, Department, PlanYear } from '../types/course'

// Helper function to dynamically load and merge JSON files from different terms
const loadCourseData = (): Course[] => {
  const context = require.context('../../backend/data', true, /\.json$/)
  const courseSet = new Map<string, Course>()

  const termMapping: { [key: string]: string } = {
    '20241': 'Winter',
    '20242': 'Spring',
    '20243': 'Summer',
    '20244': 'Fall',
  }

  context.keys().forEach((key) => {
    const termMatch = key.match(/2024\d{1}/)
    const term = termMatch ? termMapping[termMatch[0]] : 'All'
    const fileData = context(key)?.classes || []

    if (Array.isArray(fileData)) {
      fileData.forEach((classData: any) => {
        const courseId = classData.courseId.trim().toLowerCase().replace(/\s+/g, '')
        if (!courseSet.has(courseId)) {
          courseSet.set(courseId, {
            id: courseId,
            code: classData.courseId.trim(),
            title: classData.title,
            credits: classData.unitsFixed || classData.unitsVariableLow || 0,
            category: determineCategory(classData.courseId),
            description: classData.description,
            prerequisites: classData.prereqs,
            generalEducation: classData.generalEducation?.map((ge: any) => ge.geCode.trim()) || [],
            terms: new Set([term]),
          })
        } else {
          courseSet.get(courseId)?.terms.add(term)
        }
      })
    }
  })

  // Convert Set to Array for the terms field and sort courses alphabetically by code
  return Array.from(courseSet.values()).map(course => ({
    ...course,
    terms: Array.from(course.terms),
  })).sort((a, b) => a.code.localeCompare(b.code))
}

// Helper function to determine course category
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

export const usePlanStore = create<PlanStore>((set, get) => {
  const courses = loadCourseData()

  const filteredCourses = (term: string, searchQuery: string, selectedDepartment: Department): Course[] => {
    let filtered = courses

    // Filter by term
    if (term !== 'All') {
      filtered = filtered.filter(course => course.terms.includes(term))
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(course =>
        course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by department
    if (selectedDepartment !== 'All') {
      filtered = filtered.filter(course => course.code.startsWith(selectedDepartment))
    }

    // Sort alphabetically by course code
    return filtered.sort((a, b) => a.code.localeCompare(b.code))
  }

  return {
    courses,
    searchQuery: '',
    selectedDepartment: 'All',
    selectedTerm: 'All',
    yearPlans: [
      {
        year: 1,
        terms: { Fall: [], Winter: [], Spring: [], Summer: [] },
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
    setSelectedTerm: (term) => set((state) => ({
      selectedTerm: term,
      courses: filteredCourses(term, state.searchQuery, state.selectedDepartment),
    })),
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
      const requiredCourses = state.courses.filter(
        (course) =>
          course.category === 'Core Course' ||
          course.category === 'Lower Division' ||
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
  }
})
