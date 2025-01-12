'use client'

import { CheckCircle2 } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { usePlanStore } from '../store/plan-store'

export function ProgressTracker() {
  const { getProgress, yearPlans } = usePlanStore()
  const { percentage, completedCourses } = getProgress()

  const totalCredits = yearPlans.reduce((sum, year) => {
    return sum + Object.values(year.terms).reduce((termSum, courses) => {
      return termSum + courses.reduce((courseSum, course) => courseSum + course.credits, 0)
    }, 0)
  }, 0)

  const coreCourses = [
    { code: 'CS32', title: 'Data Structures' },
    { code: 'CS64', title: 'Computer Organization' },
    { code: 'CMPSC 130A', title: 'Data Structures and Algorithms II' },
    { code: 'CS130B', title: 'Data Structures and Algorithms III' },
    { code: 'CS16', title: 'Problem Solving I' },
    { code: 'CS24', title: 'Problem Solving II' },
  ]

  const electives = [
    { code: 'CS176A', title: 'Introduction to Computer Communication Networks' },
    { code: 'CS180', title: 'Computer Graphics' },
  ]

  const generalEducation = [
    { code: 'ASAM1', title: 'Intro to Asian American Studies' },
    { code: 'ARTH2', title: 'American Art History' },
    { code: 'ENG2', title: 'English' },
    { code: 'MUSIC15', title: 'Music Appreciation' },
  ]

  const calculateProgress = (courses: { code: string; title: string }[]) => {
    const completed = courses.filter((course) => completedCourses.includes(course.code)).length
    const total = courses.length
    const percentage = Math.round((completed / total) * 100)
    return { completed, total, percentage }
  }

  const coreProgress = calculateProgress(coreCourses)
  const electivesProgress = calculateProgress(electives)
  const generalEducationProgress = calculateProgress(generalEducation)

  const renderCourseList = (courses: { code: string; title: string }[], progress: { completed: number; total: number; percentage: number }) => (
    <div className="space-y-2">
      <div className="flex justify-between items-center mb-2">
        <span className="font-medium">{progress.completed}/{progress.total} completed</span>
        <span className="font-medium">{progress.percentage}%</span>
      </div>
      <Progress value={progress.percentage} className="h-2 mb-4" />
      {courses.map((course) => (
        <div key={course.code} className="flex items-center gap-2">
          <CheckCircle2
            className={`h-5 w-5 ${
              completedCourses.includes(course.code)
                ? 'text-primary'
                : 'text-muted-foreground'
            }`}
          />
          <span
            className={
              completedCourses.includes(course.code)
                ? 'text-primary font-medium'
                : 'text-muted-foreground'
            }
          >
            {course.code}
          </span>
        </div>
      ))}
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

      <div>
        <h3 className="font-semibold mb-2">Electives</h3>
        {renderCourseList(electives, electivesProgress)}
      </div>

      <div>
        <h3 className="font-semibold mb-2">General Education</h3>
        {renderCourseList(generalEducation, generalEducationProgress)}
      </div>
    </div>
  )
}

