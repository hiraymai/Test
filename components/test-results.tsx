'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TestResult } from '@/lib/types'
import { getGrade } from '@/lib/test-data'
import { CheckCircle, XCircle, RotateCcw } from 'lucide-react'

interface TestResultsProps {
  result: TestResult
  correctAnswers: string[]
  onRestart: () => void
  language: 'ru' | 'kz'
}

export function TestResults({ result, correctAnswers, onRestart, language }: TestResultsProps) {
  const { grade, color } = getGrade(result.percentage)
  
  const labels = {
    ru: {
      title: 'Результаты теста',
      student: 'Студент',
      group: 'Группа',
      date: 'Дата',
      variant: 'Вариант',
      score: 'Баллы',
      percentage: 'Процент',
      grade: 'Оценка',
      answers: 'Ваши ответы',
      correct: 'Правильно',
      incorrect: 'Неправильно',
      restart: 'Пройти тест заново',
      yourAnswer: 'Ваш ответ',
      correctAnswer: 'Правильный',
    },
    kz: {
      title: 'Тест нәтижелері',
      student: 'Студент',
      group: 'Топ',
      date: 'Күні',
      variant: 'Нұсқа',
      score: 'Балл',
      percentage: 'Пайыз',
      grade: 'Баға',
      answers: 'Сіздің жауаптарыңыз',
      correct: 'Дұрыс',
      incorrect: 'Қате',
      restart: 'Тестті қайта тапсыру',
      yourAnswer: 'Сіздің жауабыңыз',
      correctAnswer: 'Дұрыс жауап',
    },
  }

  const t = labels[language]

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl">{t.title}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground">{t.student}</span>
              <span className="font-medium">{result.fullName}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground">{t.group}</span>
              <span className="font-medium">{result.groupName}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground">{t.date}</span>
              <span className="font-medium">{result.testDate}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground">{t.variant}</span>
              <span className="font-medium">{result.variant}</span>
            </div>
          </div>

          <div className="mt-4 p-6 bg-muted rounded-lg text-center">
            <div className="text-4xl font-bold mb-2">
              {result.score} / {result.totalQuestions}
            </div>
            <div className="text-2xl font-semibold mb-2">
              {result.percentage}%
            </div>
            <div className={`text-xl font-medium ${color}`}>
              {grade}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t.answers}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-2">
            {result.answers.map((answer, index) => {
              const isCorrect = answer.toUpperCase() === correctAnswers[index]
              return (
                <div
                  key={index}
                  className={`p-3 rounded-lg border-2 text-center ${
                    isCorrect 
                      ? 'border-green-500 bg-green-50 dark:bg-green-950' 
                      : 'border-red-500 bg-red-50 dark:bg-red-950'
                  }`}
                >
                  <div className="text-xs text-muted-foreground mb-1">
                    #{index + 1}
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    {isCorrect ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600" />
                    )}
                    <span className="font-semibold">{answer || '-'}</span>
                  </div>
                  {!isCorrect && (
                    <div className="text-xs text-green-600 mt-1">
                      {correctAnswers[index]}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Button onClick={onRestart} size="lg" className="w-full">
        <RotateCcw className="w-4 h-4 mr-2" />
        {t.restart}
      </Button>
    </div>
  )
}
