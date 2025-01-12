"use client"

import { useState, useMemo } from "react"
import { Search } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Draggable, Droppable } from "@hello-pangea/dnd"
import { Course } from "./course-planner"

interface CourseListProps {
  courses: Course[]
}

export function CourseList({ courses }: CourseListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [department, setDepartment] = useState("ALL")
  const [term, setTerm] = useState("ALL")

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesSearch = course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            course.title.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesDepartment = department === "ALL" || course.code.startsWith(department)
      const matchesTerm = term === "ALL" || course.term === term
      return matchesSearch && matchesDepartment && matchesTerm
    })
  }, [courses, searchTerm, department, term])

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Course Catalog</h2>
      <div className="space-y-3">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-gray-50"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        </div>
        <div className="flex gap-2">
          <Select value={department} onValueChange={setDepartment}>
            <SelectTrigger className="bg-gray-50 flex-1">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Departments</SelectItem>
              <SelectItem value="CS">Computer Science</SelectItem>
              <SelectItem value="MATH">Mathematics</SelectItem>
              <SelectItem value="PHYS">Physics</SelectItem>
            </SelectContent>
          </Select>
          <Select value={term} onValueChange={setTerm}>
            <SelectTrigger className="bg-gray-50 flex-1">
              <SelectValue placeholder="Term" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Terms</SelectItem>
              <SelectItem value="fall">Fall</SelectItem>
              <SelectItem value="winter">Winter</SelectItem>
              <SelectItem value="spring">Spring</SelectItem>
              <SelectItem value="summer">Summer</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Droppable droppableId="courseCatalog">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-2 mt-4 h-[calc(100vh-220px)] overflow-y-auto pr-2"
          >
            {filteredCourses.map((course, index) => (
              <Draggable key={course.id} draggableId={course.id} index={index}>
                {(provided) => (
                  <Card
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="p-3 hover:shadow-md transition-shadow bg-white"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{course.code}</h3>
                        <p className="text-sm text-gray-600">{course.title}</p>
                        <p className="text-sm text-gray-500">{course.credits} credits</p>
                      </div>
                      {course.type && (
                        <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${
                          course.type === "Core Course" 
                            ? "bg-orange-50 text-orange-700" 
                            : "bg-purple-50 text-purple-700"
                        }`}>
                          {course.type}
                        </span>
                      )}
                    </div>
                  </Card>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  )
}

