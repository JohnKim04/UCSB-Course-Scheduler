'use client'

import { useState } from 'react'
import CourseList from './CourseList'
import YearSelector from './YearSelector'
import QuarterTable from './QuarterTable'
import ProgressBar from './ProgressBar'
import { colors } from '@/styles/colors'

export default function CoursePlanner() {
  const [selectedYear, setSelectedYear] = useState(1)
  const [selectedCourses, setSelectedCourses] = useState<string[]>([])

  return (
    <div className="flex p-4" style={{ backgroundColor: colors.mist }}>
      <div className="w-1/4 pr-4">
        <CourseList onSelectCourse={(course) => setSelectedCourses([...selectedCourses, course])} />
      </div>
      <div className="w-1/2 px-4">
        <YearSelector selectedYear={selectedYear} onSelectYear={setSelectedYear} />
        <QuarterTable selectedYear={selectedYear} selectedCourses={selectedCourses} />
      </div>
      <div className="w-1/4 pl-4">
        <ProgressBar completedCourses={selectedCourses.length} totalCourses={40} />
      </div>
    </div>
  )
}

