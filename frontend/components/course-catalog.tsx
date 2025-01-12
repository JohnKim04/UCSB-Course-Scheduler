'use client'

import { Search } from 'lucide-react'
import { useMemo } from 'react'
import { useDrag } from 'react-dnd'
import { Course, Department } from '../types/course'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { usePlanStore } from '../store/plan-store'

const departments: Department[] = ['All', 'CS', 'ASAM', 'ARTH', 'ENG', 'PHYS', 'MUSIC', 'MATH', 'PSTAT', 'WRIT']
const majors = ['All', 'Computer Science', 'Engineering', 'Mathematics', 'Physics', 'Biology']

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Core Course':
      return 'bg-[#FDEADB]'
    case 'Elective':
      return 'bg-[#E7F3E0]'
    case 'General Education':
      return 'bg-[#FCE3F4]'
    default:
      return 'bg-gray-100'
  }
}

function CourseCard({ course }: { course: Course }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'COURSE',
    item: course,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }))

  return (
    <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <Card className="mb-2">
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold">{course.code}</h3>
              <p className="text-sm text-muted-foreground">{course.title}</p>
            </div>
            <div className="text-right flex flex-col items-end">
              <span className="text-sm mb-1">{course.credits} credits</span>
              <span className={`text-xs px-2 py-1 rounded-md whitespace-nowrap ${getCategoryColor(course.category)}`}>
                {course.category}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function CourseCatalog() {
  const {
    courses,
    searchQuery,
    selectedDepartment,
    selectedMajor,
    coursesInPlan,
    setSearchQuery,
    setSelectedDepartment,
    setSelectedMajor,
  } = usePlanStore()

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesSearch =
        course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.title.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesDepartment =
        selectedDepartment === 'All' || course.code.startsWith(selectedDepartment)
      const matchesMajor =
        selectedMajor === 'All' || course.major === selectedMajor
      const isNotInPlan = !coursesInPlan.has(course.id)
      return matchesSearch && matchesDepartment && matchesMajor && isNotInPlan
    })
  }, [courses, searchQuery, selectedDepartment, selectedMajor, coursesInPlan])

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Course Catalog</h2>
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex gap-2">
          <Select
            value={selectedDepartment}
            onValueChange={(value: Department) => setSelectedDepartment(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedMajor} onValueChange={setSelectedMajor}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Major" />
            </SelectTrigger>
            <SelectContent>
              {majors.map((major) => (
                <SelectItem key={major} value={major}>
                  {major}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2 max-h-[calc(100vh-240px)] overflow-y-auto">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </div>
  )
}

