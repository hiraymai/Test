'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface VariantSelectorProps {
  language: 'ru' | 'kz'
  onSelect: (variant: number) => void
}

export function VariantSelector({ language, onSelect }: VariantSelectorProps) {
  const variants = Array.from({ length: 12 }, (_, i) => i + 1)
  
  const title = language === 'ru' ? 'Выберите вариант' : 'Нұсқаны таңдаңыз'
  const description = language === 'ru' 
    ? 'Доступны 12 вариантов теста' 
    : '12 тест нұсқасы қолжетімді'

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {variants.map((variant) => (
            <Button
              key={variant}
              onClick={() => onSelect(variant)}
              variant="outline"
              size="lg"
              className="h-16 text-xl font-semibold hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              {variant}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
