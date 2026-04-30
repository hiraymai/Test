export interface StudentInfo {
  fullName: string
  groupName: string
  testDate: string
}

export interface TestSession {
  studentInfo: StudentInfo
  language: 'ru' | 'kz'
  variant: number
  answers: string[]
  currentQuestion: number
}

export interface TestResult {
  id?: string
  fullName: string
  groupName: string
  testDate: string
  language: 'ru' | 'kz'
  variant: number
  score: number
  totalQuestions: number
  percentage: number
  answers: string[]
  createdAt?: string
}
