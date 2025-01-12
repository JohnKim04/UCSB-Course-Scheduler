'use client'

import { useDrop } from 'react-dnd'
import { Card, CardContent } from '@/components/ui/card'
import { Course, Term } from '../types/course'
import { usePlanStore } from '../store/plan-store'

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Lower Division':
      return 'bg-[#FDEADB]'
    case 'Upper Division':
      return 'bg-[#E7F3E0]'
    case 'General Education':
      return 'bg-[#FCE3F4]'
    default:
      return 'bg-white'
  }
}

function CourseCard({ course, onRemove }: { course: Course; onRemove: () => void }) {
  const categoryColor = getCategoryColor(course.category)

  return (
    <Card
      className={`mb-1 cursor-pointer hover:bg-muted/50 transition-colors ${categoryColor}`}
      onClick={onRemove}
    >
      <CardContent className="p-1">
        <div className="flex justify-between items-center text-sm">
          <span className="font-medium">{course.code}</span>
          <span className="text-xs text-muted-foreground">{course.credits} cr</span>
        </div>
      </CardContent>
    </Card>
  )
}

function TermDropZone({ year, term }: { year: number; term: Term }) {
  const { addCourseToYear, removeCourseFromYear, yearPlans } = usePlanStore()
  const courses = yearPlans.find((p) => p.year === year)?.terms[term] || []

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'COURSE',
    drop: (item: Course) => {
      addCourseToYear(item, year, term)
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }))

  const handleRemoveCourse = (course: Course) => {
    removeCourseFromYear(course.id, year, term)
  }

  const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0)

  return drop(
    <div
      className={`p-2 rounded-lg border-2 border-dashed min-h-[150px] ${
        isOver ? 'border-primary bg-primary/10' : 'border-muted'
      }`}
    >
      <h4 className="font-medium mb-1 text-sm">{term}</h4>
      {courses.map((course) => (
        <CourseCard
          key={course.id}
          course={course}
          onRemove={() => handleRemoveCourse(course)}
        />
      ))}
      <div className="mt-2 text-xs font-medium">Total Credits: {totalCredits}</div>
    </div>
  )
}

export function FourYearPlan() {
  const terms: Term[] = ['Fall', 'Winter', 'Spring', 'Summer']

  return (
    <div className="p-2 space-y-6">
      <h2 className="text-lg font-semibold mb-2">Four-Year Plan</h2>
      {[1, 2, 3, 4].map((year) => (
        <div key={year} className="space-y-2">
          <h3 className="text-base font-semibold">Year {year}</h3>
          <div className="grid grid-cols-4 gap-2">
            {terms.map((term) => (
              <TermDropZone key={`${year}-${term}`} year={year} term={term} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
