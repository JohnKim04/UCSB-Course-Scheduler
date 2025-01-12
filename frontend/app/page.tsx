'use client'

import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { CourseCatalog } from '../components/course-catalog'
import { FourYearPlan } from '../components/four-year-plan'
import { ProgressTracker } from '../components/progress-tracker'

export default function Page() {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex min-h-screen">
        <div className="w-1/4 border-r">
          <CourseCatalog />
        </div>
        <div className="flex-1 border-r">
          <FourYearPlan />
        </div>
        <div className="w-1/4">
          <ProgressTracker />
        </div>
      </div>
    </DndProvider>
  )
}

