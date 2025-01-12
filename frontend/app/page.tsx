'use client';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { CourseCatalog } from '../components/course-catalog';
import { FourYearPlan } from '../components/four-year-plan';
import { ProgressTracker } from '../components/progress-tracker';

export default function Page() {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-gray-150 border-b border-gray-300 shadow-md p-3.5 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-black-600">GauchoGraduate</h1>
        </header>



        {/* Main Content */}
        <div className="flex flex-1">
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
      </div>
    </DndProvider>
  );
}
