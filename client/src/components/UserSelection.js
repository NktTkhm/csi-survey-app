import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ChevronDown, User, Settings } from 'lucide-react';

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка пользователей...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Выбор пользователя
            </h1>
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
              className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                selectedUser
                  ? 'bg-primary-600 text-white hover:bg-primary-700'
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
  );
};

export default UserSelection;
