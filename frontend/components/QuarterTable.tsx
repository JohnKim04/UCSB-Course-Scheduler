import { colors } from '@/styles/colors'

const quarters = ['Fall', 'Winter', 'Spring', 'Summer']

export default function QuarterTable({ selectedYear, selectedCourses }: { selectedYear: number, selectedCourses: string[] }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow" style={{ borderColor: colors.coral }}>
      <h2 className="text-xl font-bold mb-4" style={{ color: colors.coral }}>Year {selectedYear} Schedule</h2>
      <table className="w-full">
        <thead>
          <tr>
            {quarters.map((quarter) => (
              <th key={quarter} className="p-2" style={{ backgroundColor: colors.lightGray }}>{quarter}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {quarters.map((quarter) => (
              <td key={quarter} className="p-2 align-top" style={{ borderColor: colors.lightGray }}>
                <ul>
                  {selectedCourses.slice(0, 3).map((course, index) => (
                    <li key={index} className="mb-1 p-1 rounded" style={{ backgroundColor: colors.moss, color: colors.white }}>
                      {course}
                    </li>
                  ))}
                </ul>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  )
}

