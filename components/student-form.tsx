'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { StudentInfo } from '@/lib/types'
import Link from 'next/link'

interface StudentFormProps {
  onSubmit: (info: StudentInfo) => void
}

export function StudentForm({ onSubmit }: StudentFormProps) {
  const [fullName, setFullName] = useState('')
  const [groupName, setGroupName] = useState('')
  const [testDate, setTestDate] = useState(new Date().toISOString().split('T')[0])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (fullName.trim() && groupName.trim() && testDate) {
      onSubmit({ fullName: fullName.trim(), groupName: groupName.trim(), testDate })
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Регистрация</CardTitle>
        <CardDescription>Введите ваши данные для начала тестирования</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="fullName">ФИО (Аты-жөні)</Label>
            <Input
              id="fullName"
              placeholder="Иванов Иван Иванович"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="groupName">Группа (Топ)</Label>
            <Input
              id="groupName"
              placeholder="ФК-21"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="testDate">Дата (Күні)</Label>
            <Input
              id="testDate"
              type="date"
              value={testDate}
              onChange={(e) => setTestDate(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="mt-4 w-full">
            Продолжить / Жалғастыру
          </Button>
        </form>
        
        {/* Кнопка для просмотра результатов */}
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground mb-2">
            Уже проходили тест?
          </p>
          <Link href="/my-results">
            <Button variant="outline" size="sm" className="w-full">
              Мои результаты
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
