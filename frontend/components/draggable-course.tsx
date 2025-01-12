import { useDraggable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import { Star } from 'lucide-react'
import { Course } from "./course-planner"

interface DraggableCourseProps {
  course: Course
  isDragging: boolean
}

export function DraggableCourse({ course, isDragging }: DraggableCourseProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: course.id,
    data: {
      type: 'course',
      course
    }
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: 'transform 0.3s ease',
    touchAction: 'none'
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow ${
        isDragging ? 'opacity-50 z-50' : ''
      }`}
    >
      <div
        {...listeners}
        {...attributes}
        className="absolute inset-0 cursor-move"
      />
      <div className="relative pointer-events-none">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium">{course.code}</h3>
            <p className="text-sm text-muted-foreground">{course.name}</p>
            <p className="text-sm">{course.credits} credits</p>
          </div>
          <div className="flex items-center">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="ml-1 text-sm">{course.rating}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

