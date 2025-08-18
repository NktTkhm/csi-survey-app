import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Home, MessageCircle } from 'lucide-react';

const SurveyComplete = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Опрос завершен!
        </h1>
        
        <p className="text-gray-600 mb-8">
          Спасибо за ваше участие в опросе системных аналитиков. 
          Ваши ответы помогут нам улучшить качество работы и сделать процесс 
          системного анализа более эффективным.
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <MessageCircle className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">
              Результаты отправлены
            </span>
          </div>
          <p className="text-sm text-blue-700">
            Результаты опроса автоматически отправлены в Telegram 
            и сохранены в системе.
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => navigate('/')}
            className="w-full py-3 px-4 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <Home className="w-5 h-5" />
            <span>Вернуться на главную</span>
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Если у вас есть вопросы, обратитесь к администратору системы
          </p>
        </div>
      </div>
    </div>
  );
};

export default SurveyComplete;
