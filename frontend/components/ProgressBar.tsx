import { colors } from '@/styles/colors'

export default function ProgressBar({ completedCourses, totalCourses }: { completedCourses: number, totalCourses: number }) {
  const progress = (completedCourses / totalCourses) * 100

  return (
    <div className="bg-white p-4 rounded-lg shadow" style={{ borderColor: colors.clay }}>
      <h2 className="text-xl font-bold mb-4" style={{ color: colors.clay }}>Graduation Progress</h2>
      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div className="h-2.5 rounded-full" style={{ width: `${progress}%`, backgroundColor: colors.seaGreen }}></div>
      </div>
      <p className="mt-2 text-center">{completedCourses} / {totalCourses} courses completed</p>
    </div>
  )
}

