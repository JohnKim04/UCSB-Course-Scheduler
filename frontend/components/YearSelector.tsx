import { colors } from '@/styles/colors'

export default function YearSelector({ selectedYear, onSelectYear }: { selectedYear: number, onSelectYear: (year: number) => void }) {
  return (
    <div className="mb-4">
      <select
        value={selectedYear}
        onChange={(e) => onSelectYear(Number(e.target.value))}
        className="w-full p-2 rounded"
        style={{ backgroundColor: colors.sandstone, color: colors.black }}
      >
        {[1, 2, 3, 4].map((year) => (
          <option key={year} value={year}>
            Year {year}
          </option>
        ))}
      </select>
    </div>
  )
}

