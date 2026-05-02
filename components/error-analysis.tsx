'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, AlertCircle, ArrowLeft } from 'lucide-react'
import { TestResult } from '@/lib/types'
import { getTestQuestions } from '@/lib/test-questions'

interface ErrorAnalysisProps {
  result: TestResult
  onBack: () => void
}

export function ErrorAnalysis({ result, onBack }: ErrorAnalysisProps) {
  const [currentErrorIndex, setCurrentErrorIndex] = useState(0)
  
  const questions = getTestQuestions(result.language, result.variant)
  const errors = questions.filter((question: any, index: number) => {
    const userAnswer = result.answers[index]
    return userAnswer !== question.correctAnswer
  })

  const currentError = errors[currentErrorIndex]
  const originalQuestionIndex = questions.findIndex((q: any) => {
    // Находим индекс по содержимому вопроса
    return q.question === currentError?.question
  })

  if (errors.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-green-600 flex items-center justify-center gap-2">
              <CheckCircle className="w-6 h-6" />
              Отлично!
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">
              У вас нет ошибок! Все ответы правильные! 🎉
            </p>
            <Button onClick={onBack} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Назад к результатам
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const getAnswerLabel = (answer: string, question: any) => {
    const answerIndex = ['a', 'b', 'c', 'd'].indexOf(answer)
    return question.answers[answerIndex] || answer
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Назад
            </Button>
            <h1 className="font-bold text-lg">Разбор ошибок</h1>
          </div>
          <div className="text-sm text-muted-foreground">
            Ошибка {currentErrorIndex + 1} из {errors.length}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="w-full max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-500" />
              Вопрос №{originalQuestionIndex + 1}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Вопрос */}
            <div className="p-4 bg-muted/50 rounded-lg">
              <h3 className="font-medium mb-3">{currentError.question}</h3>
              <div className="grid grid-cols-1 gap-2">
                {Object.entries(currentError.options).map(([key, value]: [string, string], index: number) => {
                  const answerLetter = key.toLowerCase()
                  const isUserAnswer = answerLetter === result.answers[originalQuestionIndex]?.toLowerCase()
                  const isCorrectAnswer = answerLetter === currentError.correctAnswer.toLowerCase()
                  
                  let bgColor = 'bg-white border'
                  let icon = null
                  
                  if (isUserAnswer && !isCorrectAnswer) {
                    bgColor = 'bg-red-50 border-red-200'
                    icon = <XCircle className="w-4 h-4 text-red-600" />
                  } else if (isCorrectAnswer) {
                    bgColor = 'bg-green-50 border-green-200'
                    icon = <CheckCircle className="w-4 h-4 text-green-600" />
                  }
                  
                  return (
                    <div 
                      key={index}
                      className={`p-3 rounded-lg border-2 flex items-center gap-3 ${bgColor}`}
                    >
                      <Badge variant="outline" className="font-mono">
                        {key.toUpperCase()})
                      </Badge>
                      <span className="flex-1">{value}</span>
                      {icon}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Анализ ошибки */}
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-600" />
                  <span className="font-medium">Ваш ответ:</span>
                  <Badge variant="destructive">
                    {result.answers[originalQuestionIndex]?.toUpperCase() || 'Нет ответа'}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="font-medium">Правильный ответ:</span>
                  <Badge variant="default" className="bg-green-600">
                    {currentError.correctAnswer?.toUpperCase()}
                  </Badge>
                </div>
              </div>

              {/* Объяснение */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Объяснение
                </h4>
                <p className="text-blue-800 text-sm leading-relaxed">
                  Правильный ответ - это вариант {currentError.correctAnswer?.toUpperCase()}. 
                  Ваш ответ {result.answers[originalQuestionIndex]?.toUpperCase() || 'отсутствовал'} 
                  не соответствует правильному варианту. Обратите внимание на ключевые моменты в вопросе.
                </p>
              </div>
            </div>

            {/* Навигация */}
            <div className="flex justify-between pt-4">
              <Button 
                variant="outline" 
                onClick={() => setCurrentErrorIndex(prev => Math.max(0, prev - 1))}
                disabled={currentErrorIndex === 0}
              >
                ← Предыдущая ошибка
              </Button>
              
              <div className="text-sm text-muted-foreground">
                {currentErrorIndex + 1} / {errors.length}
              </div>
              
              <Button 
                onClick={() => setCurrentErrorIndex(prev => Math.min(errors.length - 1, prev + 1))}
                disabled={currentErrorIndex === errors.length - 1}
              >
                Следующая ошибка →
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
