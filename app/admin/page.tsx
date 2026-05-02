'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RefreshCw, ArrowLeft, Download } from 'lucide-react'
import Link from 'next/link'
import { testDatabase } from '@/lib/database'

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
  createdAt?: string
}

export default function AdminPage() {
  const [results, setResults] = useState<Result[]>([])
  const [loading, setLoading] = useState(true)

  const fetchResults = () => {
    setLoading(true)
    try {
      const data = testDatabase.getAllResults()
      setResults(data)
    } catch (error) {
      console.error('Failed to fetch results:', error)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchResults()
  }, [])

  const exportToCSV = () => {
    const headers = ['ФИО', 'Группа', 'Дата', 'Язык', 'Вариант', 'Баллы', 'Процент', 'Время']
    const rows = results.map(r => [
      r.fullName,
      r.groupName,
      r.testDate,
      r.language === 'ru' ? 'Русский' : 'Казахский',
      r.variant,
      `${r.score}/${r.totalQuestions}`,
      `${r.percentage}%`,
      r.createdAt ? new Date(r.createdAt).toLocaleString('ru-RU') : new Date().toLocaleString('ru-RU'),
    ])
    
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n')
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `test_results_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600 bg-green-50'
    if (percentage >= 75) return 'text-blue-600 bg-blue-50'
    if (percentage >= 50) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
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
            <h1 className="font-bold text-lg">Результаты тестирования</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={fetchResults} disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Обновить
            </Button>
            <Button variant="outline" size="sm" onClick={exportToCSV} disabled={results.length === 0}>
              <Download className="w-4 h-4 mr-2" />
              Экспорт CSV
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Все результаты</span>
              <span className="text-sm font-normal text-muted-foreground">
                Всего: {results.length}
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
                Пока нет результатов
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2">ФИО</th>
                      <th className="text-left py-3 px-2">Группа</th>
                      <th className="text-left py-3 px-2">Дата</th>
                      <th className="text-center py-3 px-2">Язык</th>
                      <th className="text-center py-3 px-2">Вариант</th>
                      <th className="text-center py-3 px-2">Баллы</th>
                      <th className="text-center py-3 px-2">Результат</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((result) => (
                      <tr key={result.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-2 font-medium">{result.fullName}</td>
                        <td className="py-3 px-2">{result.groupName}</td>
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
