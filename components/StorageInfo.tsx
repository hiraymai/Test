'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { testDatabase } from '@/lib/database';
import { FileText, Database, Users, Calendar, Download, RefreshCw } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface StorageStats {
  totalResults: number;
  uniqueStudents: number;
  groups: string[];
  storageSize: string;
  lastSaved: string;
}

export default function StorageInfo() {
  const [stats, setStats] = useState<StorageStats | null>(null);
  const [loading, setLoading] = useState(false);

  const loadStats = () => {
    setLoading(true);
    try {
      const results = testDatabase.getAllResults();
      const uniqueStudents = [...new Set(results.map(r => r.fullName))];
      const groups = [...new Set(results.map(r => r.groupName))];
      
      // Получаем размер localStorage
      let storageSize = '0 Bytes';
      if (typeof window !== 'undefined') {
        let totalSize = 0;
        for (let key in localStorage) {
          if (localStorage.hasOwnProperty(key)) {
            totalSize += localStorage[key].length + key.length;
          }
        }
        storageSize = formatFileSize(totalSize);
      }

      const storageStats: StorageStats = {
        totalResults: results.length,
        uniqueStudents: uniqueStudents.length,
        groups,
        storageSize,
        lastSaved: new Date().toLocaleString('ru-RU')
      };
      
      setStats(storageStats);
    } catch (error) {
      console.error('Ошибка загрузки статистики:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleDownloadFile = () => {
    if (!stats) return;

    const results = testDatabase.getAllResults();
    const json = JSON.stringify(results, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'test-results.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!stats) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Загрузка информации о хранилище...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Информация о хранилище данных</h2>
          <p className="text-muted-foreground">Где сохраняются результаты тестов студентов</p>
        </div>
        <Button onClick={loadStats} disabled={loading} variant="outline" size="sm">
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Обновить
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Локальное хранилище
            </CardTitle>
            <CardDescription>
              Результаты сохраняются в localStorage браузера
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Хранилище:</span>
                <Badge variant="default">localStorage</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Размер хранилища:</span>
                <span className="text-sm">{stats.storageSize}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Последнее сохранение:</span>
                <span className="text-sm">{stats.lastSaved}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Доступность:</span>
                <Badge variant="default">Всегда доступно</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Статистика данных
            </CardTitle>
            <CardDescription>
              Общая информация о сохраненных результатах
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Всего результатов:</span>
                <Badge variant="secondary">{stats.totalResults}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Уникальных студентов:</span>
                <Badge variant="secondary">{stats.uniqueStudents}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Группы:</span>
                <div className="flex flex-wrap gap-1">
                  {stats.groups.length > 0 ? (
                    stats.groups.map(group => (
                      <Badge key={group} variant="outline" className="text-xs">
                        {group}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">Нет групп</span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Последние результаты
          </CardTitle>
          <CardDescription>
            Последние 10 результатов тестов
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-64">
            <div className="space-y-2">
              {testDatabase.getAllResults().slice(-10).reverse().map((result, index) => (
                <div key={`${result.id}-${index}`} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{result.fullName}</div>
                    <div className="text-sm text-muted-foreground">
                      {result.groupName} • {result.language === 'ru' ? 'Русский' : 'Казахский'} • Вариант {result.variant}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {result.testDate} • {result.percentage}% ({result.score}/25)
                    </div>
                  </div>
                  <Badge 
                    variant={
                      result.percentage >= 90 ? "default" :
                      result.percentage >= 75 ? "secondary" :
                      result.percentage >= 60 ? "outline" : "destructive"
                    }
                  >
                    {result.percentage}%
                  </Badge>
                </div>
              ))}
              {testDatabase.getAllResults().length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Пока нет сохраненных результатов</p>
                  <p className="text-sm">Студенты еще не проходили тесты</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button onClick={handleDownloadFile} disabled={stats.totalResults === 0}>
          <Download className="h-4 w-4 mr-2" />
          Скачать все результаты (JSON)
        </Button>
      </div>
    </div>
  );
}
