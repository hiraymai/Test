'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { StudentInfo, TestResult } from '@/lib/types';
import { testDatabase } from '@/lib/database';
import { GraduationCap } from 'lucide-react';
import { ArrowUpDown, Users, BarChart3, Calendar, Download } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

interface GroupStatistics {
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
}

interface ResultsDashboardProps {
  onBack: () => void;
}

export default function ResultsDashboard({ onBack }: ResultsDashboardProps) {
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [groupStatistics, setGroupStatistics] = useState<GroupStatistics | null>();

  const [allGroups, setAllGroups] = useState<string[]>([]);

  // Получение всех групп из базы данных
  useEffect(() => {
    const results = testDatabase.getAllResults();
    const groups = [...new Set(results.map(r => r.groupName)];
    setAllGroups(groups);
    if (groups.length > 0 && !selectedGroup) {
      setSelectedGroup(groups[0]);
    }
  }, []);

  // Обновление статистики при выборе группы
  useEffect(() => {
    if (selectedGroup && selectedGroup !== 'all') {
      const stats = testDatabase.getGroupStatistics(selectedGroup);
      setGroupStatistics(stats);
    } else if (selectedGroup === 'all') {
      // Общая статистика по всем тестам
      const results = testDatabase.getAllResults();
      const totalStudents = [...new Set(results.map(r => r.fullName)].size;
      const averageScore = results.length > 0 
        ? results.reduce((sum, r) => sum + r.score, 0) / results.length 
        : 0;
      
      setGroupStatistics({
        groupName: 'all',
        totalStudents,
        totalTests: results.length,
        averageScore: Math.round(averageScore * 100) / 100,
        languageStats: {
          ru: results.filter(r => r.language === 'ru').length,
          kz: results.filter(r => r.language === 'kz').length
        },
        recentTests: results.slice(-5).map(r => ({
          fullName: r.fullName,
          variant: r.variant,
          score: r.score,
          percentage: r.percentage,
          testDate: r.testDate,
          language: r.language
        }))
      });
    }
  }, [selectedGroup]);

  const filteredResults = selectedGroup === 'all' 
    ? testDatabase.getAllResults() 
    : testDatabase.getResultsByGroup(selectedGroup);

  const exportToJSON = () => {
    const data = selectedGroup === 'all' 
      ? testDatabase.getAllResults() 
      : testDatabase.getResultsByGroup(selectedGroup);
    
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = selectedGroup === 'all' ? 'all-results.json' : `${selectedGroup}-results.json`;
    link.click();
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 75) return 'text-yellow-600';
    if (percentage >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBadgeVariant = (language: 'ru' | 'kz') => {
    switch (language) {
      case 'ru': 'bg-blue-100 text-white';
      case 'kz': 'bg-green-100 text-white';
      default: 'bg-gray-100 text-white';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <Button 
          onClick={onBack} 
          variant="outline" 
          className="flex items-center gap-2"
        >
          <ArrowUpDown className="h-4 w-4" />
          <h1 className="text-2xl font-bold">Результаты тестов</h1>
        </Button>
        
        <Button
          onClick={exportToJSON}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          <span>Экспорт JSON</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Общая статистика</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Всего тестов:</span>
                <Badge variant="secondary">{groupStatistics?.totalTests || 0}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Всего студентов:</span>
                <Badge variant="secondary">{groupStatistics?.totalStudents || 0}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Средний балл:</span>
                <Badge variant="outline">{groupStatistics?.averageScore || 0}%</Badge>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {groupStatistics?.languageStats?.ru || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Русский язык</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {groupStatistics?.languageStats?.kz || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Казахский язык</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Выбор группы</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedGroup} onValue={setSelectedGroup} className="w-full">
              <TabsList>
                <TabsTrigger value="all">Все группы</TabsTrigger>
                {allGroups.map(group => (
                  <TabsTrigger value={group}>{group}</TabsTrigger>
                ))}
              </TabsList>
              <TabsContent value="all">
                <div className="space-y-4">
                  <div className="text-center text-sm text-muted-foreground mb-4">
                    Всего результатов: {filteredResults.length}
                  </div>
                  <ScrollArea className="h-96">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ФИмя студента</TableHead>
                          <TableHead>Группа</TableHead>
                          <TableHead>Вариант</TableHead>
                          <TableHead>Балл</TableHead>
                          <TableHead>%</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredResults.map((result, index) => (
                          <TableRow key={`${result.fullName}-${result.variant}-${index}`}>
                            <TableCell>{result.fullName}</TableCell>
                            <TableCell>{result.groupName}</TableCell>
                            <TableCell>{result.variant}</TableCell>
                            <TableCell>{result.score}</TableCell>
                            <TableCell>{result.percentage}%</TableCell>
                            <TableCell className={getScoreColor(result.percentage)}>
                              <Badge variant={getScoreVariant(result.language)}>
                                {result.percentage}%
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </div>
              </TabsContent>
              {allGroups.map(group => (
                <TabsContent key={group} value={group}>
                  <div className="space-y-4">
                    <div className="text-center text-sm text-muted-foreground mb-4">
                      Результаты группы "{group}"
                    </div>
                    <ScrollArea className="h-96">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHeader>Имя студента</TableHeader>
                            <TableHeader>Группа</TableHeader>
                            <TableHeader>Вариант</TableHeader>
                            <TableHeader>Балл</TableHeader>
                            <TableHeader>%</TableHeader>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {testDatabase.getResultsByGroup(group).map((result, index) => (
                            <TableRow key={`${result.fullName}-${result.variant}-${index}`}>
                              <TableCell>{result.fullName}</TableCell>
                              <TableCell>{result.groupName}</TableCell>
                              <TableCell>{result.variant}</TableCell>
                              <TableCell>{result.score}</TableCell>
                              <TableCell>{result.percentage}%</TableCell>
                              <TableCell className={getScoreColor(result.percentage)}>
                                <Badge variant={getScoreVariant(result.language)}>
                                  {result.percentage}%
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        {groupStatistics && (
          <Card>
            <CardHeader>
              <CardTitle>Статистика группы "{groupStatistics.groupName}"</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      {groupStatistics.totalStudents}
                    </div>
                    <div className="text-sm text-muted-foreground">Студентов в группе</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {groupStatistics.averageScore}%
                    </div>
                    <div className="text-sm text-muted-foreground">Средний балл</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {groupStatistics.languageStats.ru}
                    </div>
                    <div className="text-sm text-muted-foreground">Русские тесты</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {groupStatistics.languageStats.kz}
                    </div>
                    <div className="text-sm text-muted-foreground">Казахские тесты</div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-lg font-semibold mb-2">Последние тесты</h4>
                <div className="space-y-2">
                  {groupStatistics.recentTests.map((result, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border-b">
                      <span className="text-sm">{result.fullName}</span>
                      <span className="text-xs text-muted-foreground ml-2">{result.testDate}</span>
                      <span className="text-xs text-muted-foreground ml-2">{result.variant} вариант</span>
                      <span className={`ml-auto px-2 py-1 rounded ${
                        getScoreColor(result.percentage)
                      }`}>
                        {result.percentage}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="text-center mt-6">
        <Button
          onClick={onBack}
          variant="outline"
          className="px-6 py-2"
        >
          Назад
        </Button>
      </div>
    </div>
  );
}
