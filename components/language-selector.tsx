'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface LanguageSelectorProps {
  onSelect: (language: 'ru' | 'kz') => void
}

export function LanguageSelector({ onSelect }: LanguageSelectorProps) {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Выберите язык / Тілді таңдаңыз</CardTitle>
        <CardDescription>Тест доступен на двух языках</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Button 
          onClick={() => onSelect('ru')} 
          size="lg"
          className="w-full h-16 text-lg"
        >
          Русский язык
        </Button>
        <Button 
          onClick={() => onSelect('kz')} 
          variant="outline"
          size="lg"
          className="w-full h-16 text-lg"
        >
          Қазақ тілі
        </Button>
      </CardContent>
    </Card>
  )
}
