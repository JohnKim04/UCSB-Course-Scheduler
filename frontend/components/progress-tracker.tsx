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

  // Extract upper division electives data
  const totalElectivesRequired = gradData.Computer_Science.Upper_Division_Major.Major_Field_Electives_Options.Courses_Required
  const electivesCourses = gradData.Computer_Science.Upper_Division_Major.Major_Field_Electives_Options.Courses

  // Extract science elective data
  const scienceListA = gradData.Computer_Science.Science_Courses.List_A.Options
  const scienceListATotal = gradData.Computer_Science.Science_Courses.List_A.Courses

  const scienceListB = gradData.Computer_Science.Science_Courses.List_B.Options
  const scienceListBTotal = gradData.Computer_Science.Science_Courses.List_B.Courses

  // Check if a course is completed or planned
  const isCourseCompletedOrPlanned = (courseCode) => {
    return (
      completedCourses.includes(courseCode) ||
      coursesInPlan.has(courseCode.toLowerCase().replace(/\s+/g, ''))
    )
  }

  // Helper to calculate progress for courses
  const calculateProgress = (courses, totalRequired) => {
    const completed = courses.filter((course) => isCourseCompletedOrPlanned(course)).length
    const percentage = Math.round((completed / totalRequired) * 100)
    return { completed, total: totalRequired, percentage }
  }

  // Calculate progress
  const coreProgress = calculateProgress(coreCourses.map(course => course.code), coreCourses.length)
  const electivesProgress = calculateProgress(electivesCourses, totalElectivesRequired)
  const scienceListAProgress = calculateProgress(scienceListA, scienceListATotal)
  const scienceListBProgress = calculateProgress(scienceListB, scienceListBTotal)

  // Helper to render a course list with a checkmark
  const renderCourseList = (courses) => (
    <div className="space-y-2">
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
    <div className="flex flex-col p-4 space-y-4 max-w-5xl mx-auto overflow-hidden">
      <div>
        <h2 className="text-lg font-semibold mb-2">Total Graduation Progress</h2>
        <div className="text-center mb-2">
          <div className="text-4xl font-bold">{percentage}%</div>
        </div>
        <Progress value={percentage} className="h-2" />
      </div>

      <div>
        <h3 className="font-semibold mb-2">Total Credits</h3>
        <div className="text-2xl font-bold">{yearPlans.reduce((sum, year) => {
          return sum + Object.values(year.terms).reduce((termSum, courses) => {
            return termSum + courses.reduce((courseSum, course) => courseSum + course.credits, 0)
          }, 0)
        }, 0)}</div>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Core Courses</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">{coreProgress.completed}/{coreProgress.total} completed</span>
            <span className="font-medium">{coreProgress.percentage}%</span>
          </div>
          <Progress value={coreProgress.percentage} className="h-2 mb-4" />
          {renderCourseList(coreCourses)}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Upper Division Electives</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">{electivesProgress.completed}/{electivesProgress.total} completed</span>
            <span className="font-medium">{electivesProgress.percentage}%</span>
          </div>
          <Progress value={electivesProgress.percentage} className="h-2" />
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Science Electives</h3>
        <div>
          <h4 className="font-medium mb-1">{gradData.Computer_Science.Science_Courses.List_A.Description}</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">{scienceListAProgress.completed}/{scienceListAProgress.total} completed</span>
              <span className="font-medium">{scienceListAProgress.percentage}%</span>
            </div>
            <Progress value={scienceListAProgress.percentage} className="h-2" />
          </div>
        </div>
        <div className="mt-4">
          <h4 className="font-medium mb-1">{gradData.Computer_Science.Science_Courses.List_B.Description}</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">{scienceListBProgress.completed}/{scienceListBProgress.total} completed</span>
              <span className="font-medium">{scienceListBProgress.percentage}%</span>
            </div>
            <Progress value={scienceListBProgress.percentage} className="h-2" />
          </div>
        </div>
      </div>
    </div>
  )
}
