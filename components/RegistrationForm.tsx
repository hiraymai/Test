'use client';

import { useState } from 'react';
import { StudentInfo } from '../lib/types';

interface RegistrationFormProps {
  onRegistration: (studentInfo: StudentInfo) => void;
  onStartTest: () => void;
}

export default function RegistrationForm({ onRegistration, onStartTest }: RegistrationFormProps) {
  const [formData, setFormData] = useState<StudentInfo>({
    fullName: '',
    groupName: '',
    testDate: new Date().toISOString().split('T')[0]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'ФИмя обязательно для заполнения';
    }

    if (!formData.groupName.trim()) {
      newErrors.groupName = 'Название группы обязательно для заполнения';
    }

    if (!formData.testDate) {
      newErrors.testDate = 'Дата теста обязательна';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onRegistration(formData);
      onStartTest();
    }
  };

  const handleInputChange = (field: keyof StudentInfo) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    
    // Очищаем ошибку для поля при изменении
    if (errors[field]) {
      setErrors(prev => {
        const { [field]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Регистрация на тест
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
            Полное имя
          </label>
          <input
            type="text"
            id="fullName"
            value={formData.fullName}
            onChange={(e) => handleInputChange('fullName')}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.fullName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Введите ваше полное имя"
          />
          {errors.fullName && (
            <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
          )}
        </div>

        <div>
          <label htmlFor="groupName" className="block text-sm font-medium text-gray-700 mb-2">
            Название группы
          </label>
          <input
            type="text"
            id="groupName"
            value={formData.groupName}
            onChange={(e) => handleInputChange('groupName')}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.groupName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Введите название вашей группы"
          />
          {errors.groupName && (
            <p className="text-red-500 text-sm mt-1">{errors.groupName}</p>
          )}
        </div>

        <div>
          <label htmlFor="testDate" className="block text-sm font-medium text-gray-700 mb-2">
            Дата теста
          </label>
          <input
            type="date"
            id="testDate"
            value={formData.testDate}
            onChange={(e) => handleInputChange('testDate')}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.testDate ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.testDate && (
            <p className="text-red-500 text-sm mt-1">{errors.testDate}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium"
        >
          Начать тест
        </button>
      </form>
    </div>
  );
}
