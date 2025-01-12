'use client'

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

  return (
    <div ref={drop} className={`p-4 rounded-lg border-2 border-dashed min-h-[200px] ${
      isOver ? 'border-primary bg-primary/10' : 'border-muted'
    }`}>
      <h4 className="font-medium mb-2">{term}</h4>
      {courses.map((course) => (
        <Card 
          key={course.id} 
          className="mb-2 cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => handleRemoveCourse(course)}
        >
          <CardContent className="p-2">
            <div className="flex justify-between items-center">
              <span className="font-medium">{course.code}</span>
              <span className="text-sm text-muted-foreground">{course.credits} cr</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function FourYearPlan() {
  const terms: Term[] = ['Fall', 'Winter', 'Spring', 'Summer']

  return (
    <div className="p-4">
      <div className="flex items-center gap-4 mb-4">
        <h2 className="text-lg font-semibold">Four-Year Plan</h2>
        <Select defaultValue="1">
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
      <div className="grid grid-cols-4 gap-4">
        {terms.map((term) => (
          <TermDropZone key={term} year={1} term={term} />
        ))}
      </div>
    </div>
  )
}

