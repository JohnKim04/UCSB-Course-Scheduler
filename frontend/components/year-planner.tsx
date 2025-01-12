"use client"

import { Droppable } from "@hello-pangea/dnd"
import { Course } from "./course-planner"
import { Card } from "@/components/ui/card"
import { Plus } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface YearPlannerProps {
  selectedYear: number
  onYearChange: (year: number) => void
  yearPlan: {
    [key: string]: Course[]
  }
  onCourseClick: (term: string, courseIndex: number) => void
}

export function YearPlanner({ selectedYear, onYearChange, yearPlan, onCourseClick }: YearPlannerProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Four-Year Plan</h2>
        <Select value={selectedYear.toString()} onValueChange={(value) => onYearChange(parseInt(value))}>
          <SelectTrigger className="w-[120px] bg-gray-50">
            <SelectValue placeholder="Select year" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="1">Year 1</SelectItem>
              <SelectItem value="2">Year 2</SelectItem>
              <SelectItem value="3">Year 3</SelectItem>
              <SelectItem value="4">Year 4</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {["fall", "winter", "spring", "summer"].map((term) => (
          <DroppableQuarter 
            key={term} 
            id={`${selectedYear}-${term}`} 
            name={term} 
            courses={yearPlan[term]}
            onCourseClick={(courseIndex) => onCourseClick(term, courseIndex)}
          />
        ))}
      </div>
      <div className="grid grid-cols-4 gap-4 mt-2">
        {["fall", "winter", "spring", "summer"].map((term) => (
          <div key={term} className="text-center text-sm text-gray-500">
            Total credits: {yearPlan[term].reduce((sum, course) => sum + course.credits, 0)}
          </div>
        ))}
      </div>
    </div>
  )
}

interface DroppableQuarterProps {
  id: string
  name: string
  courses: Course[]
  onCourseClick: (courseIndex: number) => void
}

function DroppableQuarter({ id, name, courses, onCourseClick }: DroppableQuarterProps) {
  return (
    <Droppable droppableId={id}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="bg-gray-50 rounded-lg p-3 min-h-[200px]"
        >
          <h3 className="font-medium capitalize mb-2">{name}</h3>
          {courses.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-24 border-2 border-dashed border-gray-200 rounded-lg">
              <p className="text-sm text-gray-400 text-center px-2">Drop Course Here</p>
              <Plus className="text-gray-400 mt-2" size={20} />
            </div>
          ) : (
            <div className="space-y-2">
              {courses.map((course, index) => (
                <Card 
                  key={course.id} 
                  className={`p-2 cursor-pointer hover:shadow-md transition-shadow ${
                    course.type === "Core Course" 
                      ? "bg-orange-50" 
                      : course.type === "General Education"
                      ? "bg-purple-50"
                      : "bg-white"
                  }`}
                  onClick={() => onCourseClick(index)}
                >
                  <div className="text-sm font-medium">{course.code}</div>
                  <div className="text-xs text-gray-600">{course.title}</div>
                  <div className="text-xs text-gray-500">{course.credits} credits</div>
                </Card>
              ))}
            </div>
          )}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  )
}

