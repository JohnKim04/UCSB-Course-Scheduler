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

//Review matching
const departments: Department[] = [
  'All',
  'ANTH', 'ART', 'ART CS', 'ARTHI', 'ARTST', 'AS AM', 'ASTRO', 'BIOE', 'BIOL', 'BIOL CS',
  'BL ST', 'BMSE', 'C LIT', 'CH E', 'CH ST', 'CHEM', 'CHEM CS', 'CHIN', 'CLASS', 'CMPSC',
  'CMPSCCS', 'CMPTG', 'CMPTGCS', 'CNCSP', 'COMM', 'DANCE', 'DYNS', 'EACS', 'EARTH', 'ECE',
  'ECON', 'ED', 'EDS', 'EEMB', 'ENGL', 'ENGR', 'ENV S', 'ES', 'ESM', 'ESS', 'FAMST', 'FEMST',
  'FLMST', 'FR', 'GEN S', 'GEN SCS', 'GEOG', 'GER', 'GPS', 'GLOBL', 'GRAD', 'GREEK', 'HEB',
  'HIST', 'IQB', 'INT', 'INT CS', 'ITAL', 'JAPAN', 'KOR', 'LATIN', 'LAIS', 'LING', 'LIT',
  'LIT CS', 'MARSC', 'MARIN', 'MARINCS', 'MATR', 'MATH', 'MATH CS', 'ME', 'MAT', 'ME ST',
  'MES', 'MS', 'MCDB', 'MUS', 'MUS CS', 'MUS A', 'PHIL', 'PHYS', 'PHYS CS', 'POL S', 'PORT',
  'PSY', 'RG ST', 'RENST', 'RUSS', 'SLAV', 'SOC', 'SPAN', 'SHS', 'PSTAT', 'TMP', 'THTR',
  'WRIT', 'W&L', 'W&L CSW', 'W&L CS'
]
const terms = ['All', 'Fall', 'Winter', 'Spring', 'Summer']

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Lower Division':
      return 'bg-[#FDEADB]'
    case 'Upper Division':
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
    selectedTerm,
    coursesInPlan,
    setSearchQuery,
    setSelectedDepartment,
    setSelectedTerm,
  } = usePlanStore()

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesSearch =
        course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.title.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesDepartment =
        selectedDepartment === 'All' || course.code.startsWith(selectedDepartment)
      const isNotInPlan = !coursesInPlan.has(course.id)
      return matchesSearch && matchesDepartment && isNotInPlan
    })
  }, [courses, searchQuery, selectedDepartment, coursesInPlan])

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
          <Select value={selectedTerm} onValueChange={setSelectedTerm}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Major" />
            </SelectTrigger>
            <SelectContent>
              {terms.map((term) => (
                <SelectItem key={term} value={term}>
                  {term}
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

