import { TestResult } from './types';

// Простая база данных в памяти для хранения результатов с localStorage
class TestDatabase {
  private results: TestResult[] = [];
  private readonly STORAGE_KEY = 'test-results';

  constructor() {
    // Загружаем результаты из localStorage при инициализации
    this.loadFromStorage();
  }

  // Загрузка результатов из localStorage
  private loadFromStorage(): void {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored) {
          this.results = JSON.parse(stored);
          console.log(`Загружено ${this.results.length} результатов из localStorage`);
        }
      } catch (error) {
        console.error('Ошибка загрузки из localStorage:', error);
        this.results = [];
      }
    }
  }

  // Сохранение результатов в localStorage
  private saveToStorage(): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.results));
        console.log(`Сохранено ${this.results.length} результатов в localStorage`);
      } catch (error) {
        console.error('Ошибка сохранения в localStorage:', error);
      }
    }
  }

  // Сохранение результата теста
  saveResult(result: TestResult): void {
    // Добавляем ID и время создания если их нет
    if (!result.id) {
      result.id = this.generateId();
    }
    if (!result.createdAt) {
      result.createdAt = new Date().toISOString();
    }
    
    this.results.push(result);
    
    // Сохраняем в localStorage
    this.saveToStorage();
    
    console.log('Результат сохранен:', result);
  }

  // Получение всех результатов
  getAllResults(): TestResult[] {
    return [...this.results];
  }

  // Получение результатов по студенту
  getResultsByStudent(fullName: string): TestResult[] {
    return this.results.filter(result => result.fullName === fullName);
  }

  // Получение результатов по группе
  getResultsByGroup(groupName: string): TestResult[] {
    return this.results.filter(result => result.groupName === groupName);
  }

  // Получение результатов по языку
  getResultsByLanguage(language: 'ru' | 'kz'): TestResult[] {
    return this.results.filter(result => result.language === language);
  }

  // Получение результатов по варианту
  getResultsByVariant(variant: number): TestResult[] {
    return this.results.filter(result => result.variant === variant);
  }

  // Получение статистики по группе
  getGroupStatistics(groupName: string): {
    groupName: string;
    totalStudents: number;
    totalTests: number;
    averageScore: number;
    languageStats: {
      ru: number;
      kz: number;
    };
    recentTests: Array<{
      fullName: string;
      variant: number;
      score: number;
      percentage: number;
      testDate: string;
      language: 'ru' | 'kz';
    }>;
  } {
    const groupResults = this.getResultsByGroup(groupName);
    const totalStudents = new Set(groupResults.map(r => r.fullName)).size;
    const averageScore = groupResults.length > 0 
      ? groupResults.reduce((sum, r) => sum + r.score, 0) / groupResults.length 
      : 0;
    
    const languageStats = {
      ru: groupResults.filter(r => r.language === 'ru').length,
      kz: groupResults.filter(r => r.language === 'kz').length
    };

    return {
      groupName,
      totalStudents,
      totalTests: groupResults.length,
      averageScore: Math.round(averageScore * 100) / 100,
      languageStats,
      recentTests: groupResults.slice(-5).map(r => ({
        fullName: r.fullName,
        variant: r.variant,
        score: r.score,
        percentage: r.percentage,
        testDate: r.testDate,
        language: r.language
      }))
    };
  }

  // Очистка базы данных
  clearDatabase(): void {
    this.results = [];
    this.saveToStorage();
    console.log('База данных очищена');
  }

  // Принудительное сохранение всех результатов
  saveToFile(): void {
    this.saveToStorage();
    console.log(`Сохранено ${this.results.length} результатов`);
  }

  // Генерация уникального ID
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
  }

  // Экспорт данных в JSON
  exportToJSON(): string {
    return JSON.stringify(this.results, null, 2);
  }

  // Импорт данных из JSON
  importFromJSON(json: string): void {
    try {
      const imported = JSON.parse(json);
      if (Array.isArray(imported)) {
        this.results = imported;
        console.log('Данные импортированы');
      }
    } catch (error) {
      console.error('Ошибка импорта данных:', error);
    }
  }
}

// Экспорт единственного экземпляра базы данных
export const testDatabase = new TestDatabase();
