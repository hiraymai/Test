import { TestResult } from './types';
import fs from 'fs';
import path from 'path';

// Путь к файлу для хранения результатов
const RESULTS_FILE_PATH = path.join(process.cwd(), 'data', 'test-results.json');

// Убедимся, что директория существует
const ensureDataDirectory = () => {
  const dataDir = path.dirname(RESULTS_FILE_PATH);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

// Сохранение результатов в файл
export const saveResultsToFile = (results: TestResult[]): void => {
  try {
    ensureDataDirectory();
    fs.writeFileSync(RESULTS_FILE_PATH, JSON.stringify(results, null, 2), 'utf8');
    console.log(`Результаты сохранены в файл: ${RESULTS_FILE_PATH}`);
  } catch (error) {
    console.error('Ошибка сохранения результатов в файл:', error);
  }
};

// Загрузка результатов из файла
export const loadResultsFromFile = (): TestResult[] => {
  try {
    if (fs.existsSync(RESULTS_FILE_PATH)) {
      const data = fs.readFileSync(RESULTS_FILE_PATH, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Ошибка загрузки результатов из файла:', error);
  }
  return [];
};

// Добавление одного результата в файл
export const addResultToFile = (result: TestResult): void => {
  try {
    const existingResults = loadResultsFromFile();
    existingResults.push(result);
    saveResultsToFile(existingResults);
  } catch (error) {
    console.error('Ошибка добавления результата в файл:', error);
  }
};

// Получение статистики использования
export const getStorageStats = () => {
  try {
    if (fs.existsSync(RESULTS_FILE_PATH)) {
      const stats = fs.statSync(RESULTS_FILE_PATH);
      const results = loadResultsFromFile();
      return {
        fileExists: true,
        filePath: RESULTS_FILE_PATH,
        fileSize: stats.size,
        lastModified: stats.mtime,
        totalResults: results.length,
        uniqueStudents: [...new Set(results.map(r => r.fullName))].length,
        groups: [...new Set(results.map(r => r.groupName))]
      };
    }
  } catch (error) {
    console.error('Ошибка получения статистики:', error);
  }
  return {
    fileExists: false,
    filePath: RESULTS_FILE_PATH,
    fileSize: 0,
    lastModified: null,
    totalResults: 0,
    uniqueStudents: 0,
    groups: []
  };
};
