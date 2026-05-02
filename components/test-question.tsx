'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { getTestQuestions } from '@/lib/test-questions'

interface TestQuestionProps {
  language: 'ru' | 'kz'
  variant: number
  currentQuestion: number
  totalQuestions: number
  selectedAnswer: string
  onSelectAnswer: (answer: string) => void
  onNext: () => void
  onPrevious: () => void
  onFinish: () => void
}

const options = ['A', 'B', 'C', 'D']

export function TestQuestion({
  language,
  variant,
  currentQuestion,
  totalQuestions,
  selectedAnswer,
  onSelectAnswer,
  onNext,
  onPrevious,
  onFinish,
}: TestQuestionProps) {
  const progress = ((currentQuestion + 1) / totalQuestions) * 100
  const isLastQuestion = currentQuestion === totalQuestions - 1
  
  const questionLabel = language === 'ru' ? 'Вопрос' : 'Сұрақ'
  const previousLabel = language === 'ru' ? 'Назад' : 'Артқа'
  const nextLabel = language === 'ru' ? 'Далее' : 'Келесі'
  const finishLabel = language === 'ru' ? 'Завершить тест' : 'Тестті аяқтау'
  const selectLabel = language === 'ru' ? 'Выберите ответ' : 'Жауапты таңдаңыз'
  
  const questions = getTestQuestions(language, variant)
  const currentQuestionData = questions[currentQuestion]

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <CardTitle className="text-lg">
            {questionLabel} {currentQuestion + 1} / {totalQuestions}
          </CardTitle>
          <span className="text-sm text-muted-foreground">
            {Math.round(progress)}%
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </CardHeader>
      <CardContent className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
        <div className="text-center px-4">
          <p className="text-lg font-medium mb-4 break-words leading-relaxed">
            {currentQuestionData?.question || ''}
          </p>
          <p className="text-sm text-muted-foreground">{selectLabel}</p>
        </div>
        
        <div className="grid grid-cols-1 gap-3 w-full">
          {currentQuestionData && Object.entries(currentQuestionData.options).map(([option, text]) => (
            <Button
              key={option}
              onClick={() => onSelectAnswer(option)}
              variant={selectedAnswer === option ? 'default' : 'outline'}
              size="lg"
              className="h-auto p-4 text-left justify-start transition-all w-full min-h-[60px]"
            >
              <div className="flex items-start gap-3 w-full">
                <span className="font-bold text-lg min-w-[30px] flex-shrink-0">{option}.</span>
                <span className="text-sm break-words flex-1 leading-relaxed whitespace-pre-wrap">{text}</span>
              </div>
            </Button>
          ))}
        </div>

        <div className="flex gap-3 mt-4">
          <Button
            onClick={onPrevious}
            variant="outline"
            disabled={currentQuestion === 0}
            className="flex-1"
          >
            {previousLabel}
          </Button>
          {isLastQuestion ? (
            <Button
              onClick={onFinish}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {finishLabel}
            </Button>
          ) : (
            <Button
              onClick={onNext}
              className="flex-1"
            >
              {nextLabel}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
