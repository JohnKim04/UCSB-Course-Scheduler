export type Course = {
  id: string
  code: string
  title: string
  credits: number
  category: 'Core Course' | 'General Education' | 'Elective'
  description?: string
}

export type Term = 'Fall' | 'Winter' | 'Spring' | 'Summer'

export type YearPlan = {
  [key in Term]: Course[]
}

export type PlanYear = {
  year: number
  terms: YearPlan
}

export type Department = 'CS' | 'ASAM' | 'ARTH' | 'ENG' | 'PHYS' | 'MUSIC' | 'MATH' | 'PSTAT' | 'WRIT' | 'All'

