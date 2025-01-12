"use client"

import { Course, YearPlan, Requirements } from "./course-planner"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"

interface GraduationProgressProps {
  requirements: Requirements
  yearPlans: YearPlan
}

function groupBy<T>(array: T[], key: keyof T): { [key: string]: T[] } {
  return array.reduce((result, currentValue) => {
    (result[currentValue[key] as string] = result[currentValue[key] as string] || []).push(
      currentValue
    );
    return result;
  }, {} as { [key: string]: T[] });
}

const calculatePercentage = (completed: number, total: number) => {
  return Math.round((completed / total) * 100)
}

export function GraduationProgress({ requirements, yearPlans }: GraduationProgressProps) {
  const totalCredits = Object.values(yearPlans).reduce((sum, yearPlan) => {
    return sum + Object.values(yearPlan).reduce((yearSum, termCourses) => {
      return yearSum + termCourses.reduce((termSum, course) => termSum + course.credits, 0)
    }, 0)
  }, 0)

  const calculateProgress = () => {
    const totalRequirements = 
      requirements.coreCourses.length + 
      requirements.electives.length + 
      requirements.generalEducation.length

    const completedRequirements = 
      requirements.coreCourses.filter(course => course.completed).length +
      requirements.electives.filter(course => course.completed).length +
      requirements.generalEducation.filter(course => course.completed).length

    return Math.round((completedRequirements / totalRequirements) * 100)
  }

  const progress = calculateProgress()

  const calculateCategoryProgress = (category: { completed: boolean }[]) => {
    const total = category.length
    const completed = category.filter(item => item.completed).length
    return Math.round((completed / total) * 100)
  }

  return (
    <div className="space-y-6 h-[calc(100vh-100px)] overflow-y-auto pr-2">
      <div>
        <h2 className="text-lg font-semibold mb-4">Total Graduation Progress</h2>
        <Card className="p-6 relative">
          <div className="flex justify-center mb-4">
            <div className="relative inline-block">
              <svg className="w-32 h-32">
                <circle
                  className="text-gray-100"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                  r="58"
                  cx="64"
                  cy="64"
                />
                <circle
                  className="text-sky-300"
                  strokeWidth="8"
                  strokeDasharray={`${progress * 3.64} 364`}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="58"
                  cx="64"
                  cy="64"
                />
              </svg>
              <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-bold">
                {progress}%
              </span>
            </div>
          </div>
          <div className="text-center text-sm text-gray-600">
            Total credits: {totalCredits}
          </div>
        </Card>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold">Core Courses</h3>
          <span className="text-sm text-gray-600">{calculateCategoryProgress(requirements.coreCourses)}%</span>
        </div>
        <Card className="p-4">
          <Progress value={calculateCategoryProgress(requirements.coreCourses)} className="h-2 mb-4" indicatorClassName="bg-orange-400" />
          <div className="space-y-2">
            {requirements.coreCourses.map((course) => (
              <label key={course.code} className="flex items-start space-x-3">
                <Checkbox checked={course.completed} />
                <div className="grid gap-1.5 leading-none">
                  <div className="text-sm font-medium leading-none">{course.code}</div>
                  <div className="text-sm text-gray-500">{course.title}</div>
                </div>
              </label>
            ))}
          </div>
        </Card>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold">Electives</h3>
          <span className="text-sm text-gray-600">{calculateCategoryProgress(requirements.electives)}%</span>
        </div>
        <Card className="p-4">
          <Progress value={calculateCategoryProgress(requirements.electives)} className="h-2 mb-4" indicatorClassName="bg-red-400" />
          <div className="space-y-2">
            {requirements.electives.map((course) => (
              <label key={course.code} className="flex items-start space-x-3">
                <Checkbox checked={course.completed} />
                <div className="grid gap-1.5 leading-none">
                  <div className="text-sm font-medium leading-none">{course.code}</div>
                  <div className="text-sm text-gray-500">{course.title}</div>
                </div>
              </label>
            ))}
          </div>
        </Card>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold">General Education</h3>
          <span className="text-sm text-gray-600">{calculateCategoryProgress(requirements.generalEducation)}%</span>
        </div>
        <Card className="p-4">
          <div className="space-y-4">
            {Object.entries(groupBy(requirements.generalEducation, 'code')).map(([area, courses]) => {
              const completedCourses = courses.filter(course => course.completed).length
              const totalCourses = courses.length
              const percentage = calculatePercentage(completedCourses, totalCourses)

              return (
                <div key={area} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{area}</span>
                    <span className="text-sm text-gray-600">{percentage}%</span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                  <div className="space-y-1">
                    {courses.map((course) => (
                      <label key={course.title} className="flex items-center space-x-2">
                        <Checkbox checked={course.completed} />
                        <span className="text-sm text-gray-700">{course.title}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>
    </div>
  )
}

