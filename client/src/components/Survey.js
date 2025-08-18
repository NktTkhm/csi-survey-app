import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Send, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const Survey = () => {
  const { userId, projectId } = useParams();
  const navigate = useNavigate();
  
  const [questions, setQuestions] = useState([]);
  const [user, setUser] = useState(null);
  const [project, setProject] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [comments, setComments] = useState({});
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    initializeSurvey();
  }, [userId, projectId]);

  const initializeSurvey = async () => {
    try {
      // Получаем данные пользователя и проекта
      const [userResponse, projectResponse, questionsResponse] = await Promise.all([
        axios.get(`/api/users/${userId}`),
        axios.get(`/api/admin/projects`).then(res => res.data.find(p => p.id == projectId)),
        axios.get('/api/questions')
      ]);

      setUser(userResponse.data);
      setProject(projectResponse);
      setQuestions(questionsResponse.data);

      // Создаем сессию опроса
      const sessionResponse = await axios.post('/api/survey/session', {
        userId: parseInt(userId),
        projectId: parseInt(projectId)
      });
      setSessionId(sessionResponse.data.id);

    } catch (error) {
      console.error('Ошибка инициализации опроса:', error);
      toast.error('Ошибка загрузки опроса');
    } finally {
      setLoading(false);
    }
  };

  const handleRatingSelect = (rating) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: rating
    }));
  };

  const handleCommentChange = (comment) => {
    setComments(prev => ({
      ...prev,
      [currentQuestionIndex]: comment
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!sessionId) {
      toast.error('Ошибка сессии опроса');
      return;
    }

    // Проверяем, что все вопросы отвечены
    const unansweredQuestions = questions.filter((_, index) => !answers[index]);
    if (unansweredQuestions.length > 0) {
      toast.error(`Пожалуйста, ответьте на все вопросы (${unansweredQuestions.length} осталось)`);
      return;
    }

    setSubmitting(true);

    try {
      // Сохраняем все ответы
      const savePromises = questions.map((question, index) => {
        return axios.post('/api/survey/response', {
          sessionId,
          questionId: question.id,
          rating: answers[index],
          comment: comments[index] || null
        });
      });

      await Promise.all(savePromises);

      // Вычисляем общую оценку
      const totalScore = Object.values(answers).reduce((sum, rating) => sum + rating, 0) / questions.length;

      // Завершаем опрос
      await axios.post('/api/survey/complete', {
        sessionId,
        totalScore: Math.round(totalScore * 100) / 100
      });

      toast.success('Опрос успешно завершен!');
      navigate('/complete');

    } catch (error) {
      console.error('Ошибка отправки опроса:', error);
      toast.error('Ошибка отправки опроса');
    } finally {
      setSubmitting(false);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = answers[currentQuestionIndex];
  const currentComment = comments[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка опроса...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Заголовок */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Опрос системных аналитиков
              </h1>
              <p className="text-gray-600 mt-1">
                {user?.name} • {project?.name}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">
                Вопрос {currentQuestionIndex + 1} из {questions.length}
              </div>
              <div className="text-lg font-semibold text-primary-600">
                {Math.round(progress)}%
              </div>
            </div>
          </div>
          
          {/* Прогресс бар */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Основной контент */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8 fade-in">
          {/* Вопрос */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {currentQuestion?.text}
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Оцените по шкале от 1 до 5, где 1 - очень плохо, 5 - отлично
            </p>
          </div>

          {/* Оценки */}
          <div className="mb-8">
            <div className="rating-buttons">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => handleRatingSelect(rating)}
                  className={`rating-button ${
                    currentAnswer === rating ? 'selected' : ''
                  }`}
                >
                  {rating}
                </button>
              ))}
            </div>
            
            {currentAnswer && (
              <div className="mt-4 text-center">
                <span className="text-sm text-gray-600">
                  Выбранная оценка: <span className="font-semibold text-primary-600">{currentAnswer}</span>
                </span>
              </div>
            )}
          </div>

          {/* Комментарий */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MessageSquare className="inline w-4 h-4 mr-1" />
              Дополнительный комментарий (необязательно)
            </label>
            <textarea
              value={currentComment || ''}
              onChange={(e) => handleCommentChange(e.target.value)}
              placeholder="Ваши мысли, предложения или замечания..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              rows="4"
            />
          </div>

          {/* Навигация */}
          <div className="flex items-center justify-between pt-6 border-t">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                currentQuestionIndex === 0
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Назад</span>
            </button>

            <div className="flex items-center space-x-3">
              {currentQuestionIndex === questions.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  disabled={submitting || !currentAnswer}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    submitting || !currentAnswer
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Отправка...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Завершить опрос</span>
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  disabled={!currentAnswer}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    !currentAnswer
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg hover:shadow-xl'
                  }`}
                >
                  <span>Далее</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Survey;
