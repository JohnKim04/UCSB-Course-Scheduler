'use client'

import { useState } from 'react'
import { useDrop } from 'react-dnd'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
      className={`mb-2 cursor-pointer hover:bg-muted/50 transition-colors ${categoryColor}`}
      onClick={onRemove}
    >
      <CardContent className="p-2">
        <div className="flex justify-between items-center">
          <span className="font-medium">{course.code}</span>
          <span className="text-sm text-muted-foreground">{course.credits} cr</span>
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
      className={`p-4 rounded-lg border-2 border-dashed min-h-[200px] ${
        isOver ? 'border-primary bg-primary/10' : 'border-muted'
      }`}
    >
      <h4 className="font-medium mb-2">{term}</h4>
      {courses.map((course) => (
        <CourseCard
          key={course.id}
          course={course}
          onRemove={() => handleRemoveCourse(course)}
        />
      ))}
      <div className="mt-4 text-sm font-medium">Total Credits: {totalCredits}</div>
    </div>
  )
}

export function FourYearPlan() {
  const [selectedYear, setSelectedYear] = useState(1)
  const terms: Term[] = ['Fall', 'Winter', 'Spring', 'Summer']

  return (
    <div className="p-4">
      <div className="flex items-center gap-4 mb-4">
        <h2 className="text-lg font-semibold">Four-Year Plan</h2>
        <Select
          value={selectedYear.toString()}
          onValueChange={(value) => setSelectedYear(parseInt(value))}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Year" />
          </SelectTrigger>
          <SelectContent>
            {[1, 2, 3, 4].map((year) => (
              <SelectItem key={year} value={year.toString()}>
                Year {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <h3 className="text-lg font-semibold mt-4 mb-2">Year {selectedYear}</h3>
      <div className="grid grid-cols-4 gap-4">
        {terms.map((term) => (
          <TermDropZone key={`${selectedYear}-${term}`} year={selectedYear} term={term} />
        ))}
      </div>
    </div>
  )
}

