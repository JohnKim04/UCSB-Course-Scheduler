"use client"

import { useState } from "react"
import { DragDropContext, DropResult } from "@hello-pangea/dnd"
import { CourseList } from "./course-list"
import { YearPlanner } from "./year-planner"
import { GraduationProgress } from "./graduation-progress"

export type Course = {
  id: string
  code: string
  title: string
  credits: number
  description: string
  type?: "Core Course" | "General Education"
}

export type YearPlan = {
  [key: number]: {
    [key: string]: Course[]
  }
}

export type Requirements = {
  coreCourses: { code: string; title: string; completed: boolean }[]
  electives: { code: string; title: string; completed: boolean }[]
  generalEducation: { code: string; title: string; completed: boolean }[]
}

const sampleCourses: Course[] = [
  { 
    id: "cs101", 
    code: "CS101", 
    title: "Introduction to Programming 1", 
    credits: 3, 
    description: "Learn the basics of programming",
    type: "Core Course"
  },
  { 
    id: "asam1", 
    code: "ASAM1", 
    title: "Intro to Asian American Studies", 
    credits: 4, 
    description: "Introduction to Asian American Studies",
    type: "General Education"
  },
  { 
    id: "cs154", 
    code: "CS154", 
    title: "Hardware", 
    credits: 4, 
    description: "Computer Hardware fundamentals",
    type: "Core Course"
  },
  { 
    id: "phys61", 
    code: "PHYS61", 
    title: "Introduction to Physics", 
    credits: 4, 
    description: "Fundamental principles of physics",
    type: "Core Course"
  },
]

export function CoursePlanner() {
  const [selectedYear, setSelectedYear] = useState<number>(1)
  const [yearPlans, setYearPlans] = useState<YearPlan>({
    1: { fall: [], winter: [], spring: [], summer: [] },
    2: { fall: [], winter: [], spring: [], summer: [] },
    3: { fall: [], winter: [], spring: [], summer: [] },
    4: { fall: [], winter: [], spring: [], summer: [] },
  })
  const [availableCourses, setAvailableCourses] = useState<Course[]>(sampleCourses)
  const [requirements, setRequirements] = useState<Requirements>({
    coreCourses: [
      { code: "CS32", title: "Object-Oriented Design", completed: false },
      { code: "CS64", title: "Computer Organization", completed: false },
      { code: "CS130A", title: "Data Structures and Algorithms", completed: false },
      { code: "CS130B", title: "Data Structures and Algorithms II", completed: false },
      { code: "CS16", title: "Problem Solving I", completed: false },
      { code: "CS24", title: "Problem Solving II", completed: false },
    ],
    electives: [
      { code: "CS32", title: "Object-Oriented Design", completed: false },
      { code: "CS64", title: "Computer Organization", completed: false },
      { code: "CS130A", title: "Data Structures and Algorithms", completed: false },
      { code: "CS130B", title: "Data Structures and Algorithms II", completed: false },
      { code: "CS154", title: "Hardware", completed: false },
    ],
    generalEducation: [
      { code: "Area A", title: "English Reading & Composition", completed: false },
      { code: "Area D", title: "Social Sciences", completed: false },
      { code: "Area E", title: "Culture & Thought", completed: false },
      { code: "Area F", title: "Arts", completed: false },
      { code: "Area G", title: "Literature", completed: false },
      { code: "Special-Writing", title: "Writing Requirement", completed: false },
      { code: "Special-Ethnicity", title: "Ethnicity Requirement", completed: false },
      { code: "General", title: "European Traditions", completed: false },
    ]
  })

  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result

    if (!destination) return

    if (source.droppableId === "courseCatalog" && destination.droppableId !== "courseCatalog") {
      const [year, term] = destination.droppableId.split("-")
      const courseIndex = source.index
      const course = availableCourses[courseIndex]

      setYearPlans((prev) => {
        const newPlans = { ...prev }
        newPlans[parseInt(year)][term].push(course)
        return newPlans
      })

      setAvailableCourses((prev) => prev.filter((_, index) => index !== courseIndex))

      // Update requirements
      setRequirements((prev) => {
        const newRequirements = { ...prev }
        for (const category in newRequirements) {
          const index = newRequirements[category as keyof Requirements].findIndex(req => req.code === course.code)
          if (index !== -1) {
            newRequirements[category as keyof Requirements][index].completed = true
            break
          }
        }
        return newRequirements
      })
    }
  }

  const handleYearChange = (year: number) => {
    setSelectedYear(year)
  }

  const handleCourseClick = (year: number, term: string, courseIndex: number) => {
    const course = yearPlans[year][term][courseIndex]

    setYearPlans((prev) => {
      const newPlans = { ...prev }
      newPlans[year][term] = newPlans[year][term].filter((_, index) => index !== courseIndex)
      return newPlans
    })

    setAvailableCourses((prev) => [...prev, course])

    // Update requirements
    setRequirements((prev) => {
      const newRequirements = { ...prev }
      for (const category in newRequirements) {
        const index = newRequirements[category as keyof Requirements].findIndex(req => req.code === course.code)
        if (index !== -1) {
          newRequirements[category as keyof Requirements][index].completed = false
          break
        }
      }
      return newRequirements
    })
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="min-h-screen bg-white">
        <header className="border-b">
          <div className="container mx-auto px-4">
            <h1 className="text-xl font-bold py-4">GauchoGraduate</h1>
          </div>
        </header>
        <main className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-3">
              <CourseList courses={availableCourses} />
            </div>
            <div className="col-span-6">
              <YearPlanner 
                selectedYear={selectedYear} 
                onYearChange={handleYearChange} 
                yearPlan={yearPlans[selectedYear]}
                onCourseClick={(term, courseIndex) => handleCourseClick(selectedYear, term, courseIndex)}
              />
            </div>
            <div className="col-span-3">
              <GraduationProgress requirements={requirements} yearPlans={yearPlans} />
            </div>
          </div>
        </main>
      </div>
    </DragDropContext>
  )
}

