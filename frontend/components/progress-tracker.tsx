'use client'

import { CheckCircle2 } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { usePlanStore } from '../store/plan-store'

export function ProgressTracker() {
  const { getProgress } = usePlanStore()
  const { percentage, completedCourses } = getProgress()

  const requirements = [
    { code: 'CS32', title: 'Data Structures' },
    { code: 'CS64', title: 'Computer Organization' },
    { code: 'CS130A', title: 'Data Structures and Algorithms II' },
    { code: 'CS130B', title: 'Data Structures and Algorithms III' },
    { code: 'CS16', title: 'Problem Solving I' },
    { code: 'CS24', title: 'Problem Solving II' },
  ]

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Total Graduation Progress</h2>
      <div className="text-center mb-8">
        <div className="text-5xl font-bold mb-2">{percentage}%</div>
        <Progress value={percentage} className="h-2" />
      </div>
      <div className="space-y-4">
        <h3 className="font-semibold">Major Requirements</h3>
        <div className="space-y-2">
          {requirements.map((req) => (
            <div key={req.code} className="flex items-center gap-2">
              <CheckCircle2
                className={`h-5 w-5 ${
                  completedCourses.includes(req.code)
                    ? 'text-primary'
                    : 'text-muted-foreground'
                }`}
              />
              <span
                className={
                  completedCourses.includes(req.code)
                    ? 'text-primary font-medium'
                    : 'text-muted-foreground'
                }
              >
                {req.code}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

