import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ChevronDown, User, Settings, ClipboardList, Star, MessageSquare } from 'lucide-react';

// Обновленная версия с выпадающим списком пользователей
const UserSelection = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAdminLink, setShowAdminLink] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/users');
      setUsers(response.data);
      
      // Проверяем, есть ли администраторы
      const hasAdmins = response.data.some(user => user.is_admin);
      setShowAdminLink(hasAdmins);
    } catch (error) {
      console.error('Ошибка загрузки пользователей:', error);
      toast.error('Ошибка загрузки пользователей');
    } finally {
      setLoading(false);
    }
  };

  const handleUserSelect = (userId) => {
    setSelectedUser(userId);
  };

  const handleContinue = () => {
    if (!selectedUser) {
      toast.error('Пожалуйста, выберите пользователя');
      return;
    }
    navigate(`/projects/${selectedUser}`);
  };

  const handleAdminClick = () => {
    navigate('/admin');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка пользователей...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-4xl w-full mx-auto">
        {/* Заголовок и описание */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Опрос системных аналитиков
          </h1>
          <p className="text-xl text-white/90 mb-6 max-w-2xl mx-auto">
            Оцените эффективность работы системных аналитиков на проектах
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Описание опроса */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8">
            <div className="text-center mb-6">
              <ClipboardList className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                О чем этот опрос?
              </h2>
            </div>

            <div className="space-y-4 text-gray-700">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary-600 text-sm font-bold">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">13 вопросов</h3>
                  <p className="text-sm">Оценка различных аспектов работы системного аналитика</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Star className="w-3 h-3 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Шкала 1-5</h3>
                  <p className="text-sm">1 - очень плохо, 5 - отлично</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MessageSquare className="w-3 h-3 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Комментарии</h3>
                  <p className="text-sm">Возможность добавить дополнительные замечания</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary-600 text-sm font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Результаты</h3>
                  <p className="text-sm">Автоматическая отправка в Telegram и сохранение в системе</p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-red-50 rounded-lg border border-purple-200">
              <p className="text-sm text-purple-800 text-center">
                <strong>Цель опроса:</strong> Улучшить качество работы системного анализа 
                и сделать процесс более эффективным для всех участников проекта.
              </p>
            </div>
          </div>

          {/* Форма выбора пользователя */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8">
            <div className="text-center mb-6">
              <User className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Выбор пользователя
              </h2>
              <p className="text-gray-600">
                Выберите пользователя для прохождения опроса
              </p>
            </div>

            <div className="space-y-6">
              {/* Выпадающий список пользователей */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Пользователь
                </label>
                <div className="relative">
                  <select
                    value={selectedUser}
                    onChange={(e) => handleUserSelect(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 appearance-none bg-white"
                  >
                    <option value="">Выберите пользователя</option>
                    {users
                      .filter(user => user.is_active)
                      .map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.name} {user.is_admin && '(Админ)'}
                        </option>
                      ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Кнопка продолжить */}
              <button
                onClick={handleContinue}
                disabled={!selectedUser}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                  selectedUser
                    ? 'btn-primary'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Продолжить
              </button>

              {/* Ссылка на админку (только если есть администраторы) */}
              {showAdminLink && (
                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={handleAdminClick}
                    className="w-full flex items-center justify-center space-x-2 py-2 px-4 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Админ панель</span>
                  </button>
                </div>
              )}
            </div>

            {/* Информация о количестве пользователей */}
            <div className="mt-6 text-center text-sm text-gray-500">
              <p>Доступно пользователей: {users.filter(u => u.is_active).length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSelection;
