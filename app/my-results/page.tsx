'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RefreshCw, ArrowLeft, User, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { testDatabase } from '@/lib/database'
import { ErrorAnalysis } from '@/components/error-analysis'

interface Result {
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

export default function MyResultsPage() {
  const [results, setResults] = useState<Result[]>([])
  const [loading, setLoading] = useState(true)
  const [studentName, setStudentName] = useState('')
  const [selectedResult, setSelectedResult] = useState<Result | null>(null)
  const [showErrorAnalysis, setShowErrorAnalysis] = useState(false)

  useEffect(() => {
    // Получаем имя студента из localStorage
    const storedName = localStorage.getItem('studentName')
    if (storedName) {
      setStudentName(storedName)
      fetchResults(storedName)
    } else {
      setLoading(false)
    }
  }, [])

  const fetchResults = (name: string) => {
    setLoading(true)
    try {
      const allResults = testDatabase.getAllResults()
      const studentResults = allResults.filter(result => result.fullName === name)
      setResults(studentResults)
    } catch (error) {
      console.error('Failed to fetch results:', error)
    }
    setLoading(false)
  }

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600 bg-green-50'
    if (percentage >= 75) return 'text-blue-600 bg-blue-50'
    if (percentage >= 50) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  const getAverageScore = () => {
    if (results.length === 0) return 0
    return Math.round(results.reduce((acc, r) => acc + r.percentage, 0) / results.length)
  }

  const getBestResult = () => {
    if (results.length === 0) return null
    return results.reduce((best, current) => 
      current.percentage > best.percentage ? current : best
    )
  }

  const handleShowErrorAnalysis = (result: Result) => {
    setSelectedResult(result)
    setShowErrorAnalysis(true)
  }

  const handleBackToResults = () => {
    setShowErrorAnalysis(false)
    setSelectedResult(null)
  }

  if (!studentName) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center gap-2">
              <User className="w-5 h-5" />
              Мои результаты
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground">
              Сначала пройдите регистрацию, чтобы увидеть свои результаты
            </p>
            <Link href="/" className="block mt-4">
              <Button className="w-full">
                На главную
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (showErrorAnalysis && selectedResult) {
    return (
      <ErrorAnalysis 
        result={selectedResult} 
        onBack={handleBackToResults}
      />
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Назад
              </Button>
            </Link>
            <h1 className="font-bold text-lg">Мои результаты</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => fetchResults(studentName)} disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Обновить
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Всего попыток</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{results.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Средний балл</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getAverageScore()}%</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Лучший результат</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {getBestResult()?.percentage || 0}%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Таблица результатов */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>История тестов</span>
              <span className="text-sm font-normal text-muted-foreground">
                {results.length} результатов
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                Загрузка...
              </div>
            ) : results.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Пока нет результатов. Пройдите тест, чтобы увидеть их здесь.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2">Дата</th>
                      <th className="text-center py-3 px-2">Язык</th>
                      <th className="text-center py-3 px-2">Вариант</th>
                      <th className="text-center py-3 px-2">Баллы</th>
                      <th className="text-center py-3 px-2">Результат</th>
                      <th className="text-center py-3 px-2">Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((result) => (
                      <tr key={result.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-2">{result.testDate}</td>
                        <td className="py-3 px-2 text-center">
                          <span className={`px-2 py-1 rounded text-xs ${
                            result.language === 'ru' ? 'bg-blue-100 text-blue-700' : 'bg-teal-100 text-teal-700'
                          }`}>
                            {result.language === 'ru' ? 'РУС' : 'ҚАЗ'}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-center font-medium">{result.variant}</td>
                        <td className="py-3 px-2 text-center">
                          {result.score}/{result.totalQuestions}
                        </td>
                        <td className="py-3 px-2 text-center">
                          <span className={`px-2 py-1 rounded font-semibold ${getGradeColor(result.percentage)}`}>
                            {result.percentage}%
                          </span>
                        </td>
                        <td className="py-3 px-2 text-center">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleShowErrorAnalysis(result)}
                            className="flex items-center gap-1"
                          >
                            <AlertCircle className="w-4 h-4" />
                            Разбор
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
