import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { fullName, groupName, testDate, language, variant, score, totalQuestions, percentage, answers } = body

    // Просто возвращаем успех - используем localStorage
    return NextResponse.json({ 
      success: true, 
      data: {
        fullName,
        groupName,
        testDate,
        language,
        variant,
        score,
        totalQuestions,
        percentage,
        answers,
        createdAt: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET() {
  try {
    // Возвращаем пустой массив - используем localStorage
    return NextResponse.json({ data: [] })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
