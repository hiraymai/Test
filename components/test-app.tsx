'use client'

import { useState } from 'react'
import { StudentForm } from './student-form'
import { LanguageSelector } from './language-selector'
import { VariantSelector } from './variant-selector'
import { TestQuestion } from './test-question'
import { TestResults } from './test-results'
import { TestHistory } from './test-history'
import { StudentInfo, TestResult } from '@/lib/types'
import { getCorrectAnswers, calculateScore, calculatePercentage } from '@/lib/test-data'
import { GraduationCap, Settings, Clock } from 'lucide-react'
import Link from 'next/link'
import { testDatabase } from '@/lib/database'

type Step = 'register' | 'language' | 'variant' | 'test' | 'results' | 'history'

const TOTAL_QUESTIONS = 25

export function TestApp() {
  const [step, setStep] = useState<Step>('register')
  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null)
  const [language, setLanguage] = useState<'ru' | 'kz'>('ru')
  const [variant, setVariant] = useState<number>(1)
  const [answers, setAnswers] = useState<string[]>(Array(TOTAL_QUESTIONS).fill(''))
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [result, setResult] = useState<TestResult | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleStudentSubmit = (info: StudentInfo) => {
    setStudentInfo(info)
    setStep('language')
  }

  const handleLanguageSelect = (lang: 'ru' | 'kz') => {
    setLanguage(lang)
    setStep('variant')
  }

  const handleVariantSelect = (v: number) => {
    setVariant(v)
    setStep('test')
  }

  const handleSelectAnswer = (answer: string) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = answer
    setAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentQuestion < TOTAL_QUESTIONS - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleFinish = async () => {
    if (!studentInfo || isSubmitting) return

    setIsSubmitting(true)

    const correctAnswers = getCorrectAnswers(language, variant)
    const score = calculateScore(answers, correctAnswers)
    const percentage = calculatePercentage(score, TOTAL_QUESTIONS)

    const testResult: TestResult = {
      fullName: studentInfo.fullName,
      groupName: studentInfo.groupName,
      testDate: studentInfo.testDate,
      language,
      variant,
      score,
      totalQuestions: TOTAL_QUESTIONS,
      percentage,
      answers,
    }

    // Сохраняем результат в localStorage
    testDatabase.saveResult(testResult)
    setResult(testResult)
    setStep('results')
    setIsSubmitting(false)
  }

  const handleViewHistory = () => {
    setStep('history')
  }

  const handleSelectHistoryTest = (selectedResult: TestResult, correctAnswers: string[]) => {
    setResult(selectedResult)
    setLanguage(selectedResult.language)
    setVariant(selectedResult.variant)
    setAnswers(selectedResult.answers)
    setStep('results')
  }

  const handleRestart = () => {
    setStep('register')
    setStudentInfo(null)
    setLanguage('ru')
    setVariant(1)
    setAnswers(Array(TOTAL_QUESTIONS).fill(''))
    setCurrentQuestion(0)
    setResult(null)
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GraduationCap className="w-8 h-8 text-primary" />
            <div>
              <h1 className="font-bold text-lg">Онлайн Тест</h1>
              <p className="text-xs text-muted-foreground">Дене мәдениеті / Физическая культура</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleViewHistory}
              className="p-2 hover:bg-muted rounded-md transition-colors" 
              title="История тестов"
            >
              <Clock className="w-5 h-5 text-muted-foreground" />
            </button>
            <Link href="/admin" className="p-2 hover:bg-muted rounded-md transition-colors" title="Результаты">
              <Settings className="w-5 h-5 text-muted-foreground" />
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {step === 'register' && (
          <StudentForm onSubmit={handleStudentSubmit} />
        )}

        {step === 'language' && (
          <LanguageSelector onSelect={handleLanguageSelect} />
        )}

        {step === 'variant' && (
          <VariantSelector language={language} onSelect={handleVariantSelect} />
        )}

        {step === 'test' && (
          <TestQuestion
            language={language}
            variant={variant}
            currentQuestion={currentQuestion}
            totalQuestions={TOTAL_QUESTIONS}
            selectedAnswer={answers[currentQuestion]}
            onSelectAnswer={handleSelectAnswer}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onFinish={handleFinish}
          />
        )}

        {step === 'results' && result && (
          <TestResults
            result={result}
            correctAnswers={getCorrectAnswers(language, variant)}
            onRestart={handleRestart}
            language={language}
          />
        )}

        {step === 'history' && (
          <TestHistory
            language={language}
            onSelectTest={handleSelectHistoryTest}
          />
        )}
      </main>

      <footer className="border-t mt-auto py-4">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          &copy; 2026 Онлайн Тест
        </div>
      </footer>
    </div>
  )
}
