import { colors } from '@/styles/colors'

const courses = [
  'Introduction to Computer Science',
  'Calculus I',
  'English Composition',
  'World History',
  'Biology 101',
  // Add more courses as needed
]

export default function CourseList({ onSelectCourse }: { onSelectCourse: (course: string) => void }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow" style={{ borderColor: colors.seaGreen }}>
      <h2 className="text-xl font-bold mb-4" style={{ color: colors.seaGreen }}>Available Courses</h2>
      <ul>
        {courses.map((course, index) => (
          <li key={index} className="mb-2">
            <button
              onClick={() => onSelectCourse(course)}
              className="w-full text-left p-2 rounded"
              style={{ backgroundColor: colors.aqua, color: colors.black }}
            >
              {course}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

