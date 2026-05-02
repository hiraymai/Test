'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TestResult } from '@/lib/types'
import { testDatabase } from '@/lib/database'
import { getGrade } from '@/lib/test-data'
import { CheckCircle, Clock, Calendar, User, Target } from 'lucide-react'
import { useState, useEffect } from 'react'

interface TestHistoryProps {
  language: 'ru' | 'kz'
  onSelectTest: (result: TestResult, correctAnswers: string[]) => void
}

export function TestHistory({ language, onSelectTest }: TestHistoryProps) {
  const [history, setHistory] = useState<TestResult[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadHistory = () => {
      try {
        const allResults = testDatabase.getAllResults()
        // Сортируем по дате (новые сверху)
        const sorted = allResults.sort((a, b) => 
          new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()
        )
        setHistory(sorted)
      } catch (error) {
        console.error('Error loading history:', error)
      } finally {
        setLoading(false)
      }
    }

    loadHistory()
  }, [])

  const labels = {
    ru: {
      title: 'История тестов',
      noTests: 'Пока нет пройденных тестов',
      student: 'Студент',
      group: 'Группа',
      date: 'Дата',
      variant: 'Вариант',
      score: 'Результат',
      percentage: 'Процент',
      grade: 'Оценка',
      language: 'Язык',
      viewDetails: 'Подробности',
      createdAt: 'Дата прохождения'
    },
    kz: {
      title: 'Тест тарихы',
      noTests: 'Әзірше өтілген тесттер жоқ',
      student: 'Студент',
      group: 'Топ',
      date: 'Күні',
      variant: 'Нұсқа',
      score: 'Нәтиже',
      percentage: 'Пайыз',
      grade: 'Баға',
      language: 'Тіл',
      viewDetails: 'Толық ақпарат',
      createdAt: 'Өту күні'
    }
  }

  const t = labels[language]

  
  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-muted-foreground">Загрузка истории...</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (history.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <Card>
          <CardContent className="p-8 text-center">
            <Clock className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <div className="text-lg text-muted-foreground">{t.noTests}</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Clock className="w-6 h-6" />
            {t.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {history.map((result, index) => {
              const { grade, color } = getGrade(result.percentage)
              const isCorrect = result.score >= result.totalQuestions * 0.6
              
              return (
                <Card 
                  key={result.id || index} 
                  className={`cursor-pointer transition-all hover:shadow-md hover:scale-[1.02] ${
                    isCorrect ? 'border-green-200 bg-green-50/50' : 'border-red-200 bg-red-50/50'
                  }`}
                  onClick={() => {
                    // Получаем правильные ответы для этого варианта
                    const correctAnswers = getCorrectAnswersForVariant(result.language, result.variant)
                    onSelectTest(result, correctAnswers)
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            <span>{result.fullName}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{result.testDate}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Target className="w-4 h-4" />
                            <span>{t.variant} {result.variant}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-6">
                          <div>
                            <div className="text-2xl font-bold">
                              {result.score}/{result.totalQuestions}
                            </div>
                            <div className="text-sm text-muted-foreground">{t.score}</div>
                          </div>
                          
                          <div>
                            <div className="text-2xl font-bold text-blue-600">
                              {result.percentage}%
                            </div>
                            <div className="text-sm text-muted-foreground">{t.percentage}</div>
                          </div>
                          
                          <div>
                            <div className={`text-lg font-semibold ${color}`}>
                              {grade}
                            </div>
                            <div className="text-sm text-muted-foreground">{t.grade}</div>
                          </div>
                        </div>
                        
                                              </div>
                      
                      <div className="flex items-center gap-2">
                        <div className={`px-2 py-1 rounded text-xs font-medium ${
                          result.language === 'ru' 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-teal-100 text-teal-700'
                        }`}>
                          {result.language === 'ru' ? 'РУС' : 'ҚАЗ'}
                        </div>
                        <CheckCircle className={`w-5 h-5 ${
                          isCorrect ? 'text-green-600' : 'text-red-600'
                        }`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Вспомогательная функция для получения правильных ответов
function getCorrectAnswersForVariant(language: 'ru' | 'kz', variant: number): string[] {
  try {
    // Импортируем вопросы и получаем правильные ответы
    const { kazakhTestQuestions, russianTestQuestions } = require('@/lib/test-questions')
    const questions = language === 'kz' ? kazakhTestQuestions[variant] : russianTestQuestions[variant]
    
    if (!questions) return []
    
    return questions.map(q => q.correctAnswer)
  } catch (error) {
    console.error('Error getting correct answers:', error)
    return []
  }
}
