'use client'

import { CheckCircle2 } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { usePlanStore } from '../store/plan-store'
import gradData from '../../backend/data/grad_reqs.json'

export function ProgressTracker() {
  const { getProgress, yearPlans, coursesInPlan } = usePlanStore()
  const { percentage, completedCourses } = getProgress()

  // Extract core courses from JSON
  const coreCourses = Object.entries(gradData.Computer_Science.Preparation_For_The_Major.Courses).map(
    ([code, credits]) => ({ code, credits })
  )

  // Check if a course is completed or planned in any term
  const isCourseCompletedOrPlanned = (courseCode) => {
    return (
      completedCourses.includes(courseCode) ||
      coursesInPlan.has(courseCode.toLowerCase().replace(/\s+/g, ''))
    )
  }

  // Calculate total credits
  const totalCredits = yearPlans.reduce((sum, year) => {
    return sum + Object.values(year.terms).reduce((termSum, courses) => {
      return termSum + courses.reduce((courseSum, course) => courseSum + course.credits, 0)
    }, 0)
  }, 0)

  // Helper to calculate progress for courses
  const calculateProgress = (courses) => {
    const completed = courses.filter((course) =>
      isCourseCompletedOrPlanned(course.code)
    ).length
    const total = courses.length
    const percentage = Math.round((completed / total) * 100)
    return { completed, total, percentage }
  }

  // Core courses progress
  const coreProgress = calculateProgress(coreCourses)

  // Helper to render a course list with a checkmark
  const renderCourseList = (courses, progress) => (
    <div className="space-y-2">
      <div className="flex justify-between items-center mb-2">
        <span className="font-medium">{progress.completed}/{progress.total} completed</span>
        <span className="font-medium">{progress.percentage}%</span>
      </div>
      <Progress value={progress.percentage} className="h-2 mb-4" />
      {courses.map((course) => {
        const isCompletedOrPlanned = isCourseCompletedOrPlanned(course.code)

        return (
          <div key={course.code} className="flex items-center gap-2">
            <CheckCircle2
              className={`h-5 w-5 ${
                isCompletedOrPlanned ? 'text-green-500' : 'text-muted-foreground'
              }`}
            />
            <span
              className={
                isCompletedOrPlanned ? 'text-green-500 font-medium' : 'text-muted-foreground'
              }
            >
              {course.code}
            </span>
          </div>
        )
      })}
    </div>
  )

  return (
    <div className="p-4 space-y-4 overflow-y-auto max-h-screen">
      <div>
        <h2 className="text-lg font-semibold mb-2">Total Graduation Progress</h2>
        <div className="text-center mb-2">
          <div className="text-4xl font-bold">{percentage}%</div>
        </div>
        <Progress value={percentage} className="h-2" />
      </div>

      <div>
        <h3 className="font-semibold mb-2">Total Credits</h3>
        <div className="text-2xl font-bold">{totalCredits}</div>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Core Courses</h3>
        {renderCourseList(coreCourses, coreProgress)}
      </div>
    </div>
  )
}
