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

//Review matching
export type Department =
  | 'CMPSC' | 'ASAM' | 'ARTH' | 'ENG' | 'PHYS' | 'MUS' | 'MATH' | 'PSTAT' | 'WRIT' | 'All'
  | 'ART CS' | 'ARTHI' | 'ARTST' | 'AS AM' | 'ASTRO' | 'BIOE' | 'BIOL' | 'BIOL CS' | 'BL ST'
  | 'BMSE' | 'C LIT' | 'CH E' | 'CH ST' | 'CHEM' | 'CHEM CS' | 'CHIN' | 'CLASS' | 'CMPSCCS'
  | 'CMPTG' | 'CMPTGCS' | 'CNCSP' | 'COMM' | 'DANCE' | 'DYNS' | 'EACS' | 'EARTH' | 'ECE' | 'ECON'
  | 'ED' | 'EDS' | 'EEMB' | 'ENGL' | 'ENGR' | 'ENV S' | 'ES' | 'ESM' | 'ESS' | 'FAMST' | 'FEMST'
  | 'FLMST' | 'FR' | 'GEN S' | 'GEN SCS' | 'GEOG' | 'GER' | 'GPS' | 'GLOBL' | 'GRAD' | 'GREEK'
  | 'HEB' | 'HIST' | 'IQB' | 'INT' | 'INT CS' | 'ITAL' | 'JAPAN' | 'KOR' | 'LATIN' | 'LAIS' | 'LING'
  | 'LIT' | 'LIT CS' | 'MARSC' | 'MARIN' | 'MARINCS' | 'MATR' | 'MATH CS' | 'ME' | 'MAT' | 'ME ST'
  | 'MES' | 'MS' | 'MCDB' | 'MUS CS' | 'MUS A' | 'PHIL' | 'PHYS CS' | 'POL S' | 'PORT' | 'PSY'
  | 'RG ST' | 'RENST' | 'RUSS' | 'SLAV' | 'SOC' | 'SPAN' | 'SHS' | 'TMP' | 'THTR' | 'W&L' | 'W&L CSW'
  | 'W&L CS' | 'ANTH' | 'ART'

