import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  Users, 
  FolderOpen, 
  BarChart3, 
  Plus, 
  Edit, 
  Trash2, 
  Link, 
  Unlink, 
  Download, 
  Settings,
  UserPlus,
  FolderPlus
} from 'lucide-react';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [surveyResults, setSurveyResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [telegramLoading, setTelegramLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    is_admin: false,
    is_active: true,
    description: ''
  });
  const [assignData, setAssignData] = useState({
    userId: '',
    projectId: ''
  });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    userId: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersRes, projectsRes, resultsRes] = await Promise.all([
        axios.get('/api/admin/users'),
        axios.get('/api/admin/projects'),
        axios.get('/api/admin/survey-results')
      ]);
      setUsers(usersRes.data);
      setProjects(projectsRes.data);
      setSurveyResults(resultsRes.data);
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
      toast.error('Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await axios.put(`/api/admin/users/${editingUser.id}`, formData);
        toast.success('Пользователь обновлен');
      } else {
        await axios.post('/api/admin/users', formData);
        toast.success('Пользователь создан');
      }
      setShowUserModal(false);
      setFormData({ name: '', email: '', is_admin: false, is_active: true });
      fetchData();
    } catch (error) {
      console.error('Ошибка сохранения пользователя:', error);
      toast.error('Ошибка сохранения пользователя');
    }
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProject) {
        await axios.put(`/api/admin/projects/${editingProject.id}`, formData);
        toast.success('Проект обновлен');
      } else {
        await axios.post('/api/admin/projects', formData);
        toast.success('Проект создан');
      }
      setShowProjectModal(false);
      setFormData({ name: '', description: '' });
      fetchData();
    } catch (error) {
      console.error('Ошибка сохранения проекта:', error);
      toast.error('Ошибка сохранения проекта');
    }
  };

  const handleAssignUserToProject = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/admin/user-projects', assignData);
      toast.success('Пользователь назначен на проект');
      setShowAssignModal(false);
      setAssignData({ userId: '', projectId: '' });
      fetchData();
    } catch (error) {
      console.error('Ошибка назначения:', error);
      toast.error('Ошибка назначения пользователя');
    }
  };

  const handleRemoveUserFromProject = async (userId, projectId) => {
    try {
      await axios.delete('/api/admin/user-projects', { data: { userId, projectId } });
      toast.success('Пользователь удален с проекта');
      fetchData();
    } catch (error) {
      console.error('Ошибка удаления:', error);
      toast.error('Ошибка удаления пользователя с проекта');
    }
  };

  const handleSendResults = async () => {
    if (telegramLoading) {
      toast.error('Подождите, предыдущий запрос еще выполняется');
      return;
    }
    
    try {
      setTelegramLoading(true);
      await axios.post('/api/admin/send-results');
      toast.success('Результаты отправлены в Telegram');
    } catch (error) {
      console.error('Ошибка отправки результатов:', error);
      if (error.response?.data?.error?.includes('Too many requests')) {
        toast.error('Слишком много запросов. Подождите 1-2 минуты и попробуйте снова');
      } else {
        toast.error('Ошибка отправки результатов');
      }
    } finally {
      setTelegramLoading(false);
    }
  };

  const handleTestTelegram = async () => {
    if (telegramLoading) {
      toast.error('Подождите, предыдущий запрос еще выполняется');
      return;
    }
    
    try {
      setTelegramLoading(true);
      await axios.post('/api/admin/test-telegram');
      toast.success('Telegram бот работает корректно');
    } catch (error) {
      console.error('Ошибка тестирования Telegram бота:', error);
      if (error.response?.data?.error?.includes('Too many requests')) {
        toast.error('Слишком много запросов. Подождите 1-2 минуты и попробуйте снова');
      } else {
        toast.error('Telegram бот не работает');
      }
    } finally {
      setTelegramLoading(false);
    }
  };

  const openUserModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        is_admin: user.is_admin,
        is_active: user.is_active
      });
    } else {
      setEditingUser(null);
      setFormData({ name: '', email: '', is_admin: false, is_active: true });
    }
    setShowUserModal(true);
  };

  const openProjectModal = (project = null) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        name: project.name,
        description: project.description || ''
      });
    } else {
      setEditingProject(null);
      setFormData({ name: '', description: '' });
    }
    setShowProjectModal(true);
  };

  const openPasswordModal = (user) => {
    setPasswordData({
      userId: user.id,
      password: '',
      confirmPassword: ''
    });
    setShowPasswordModal(true);
  };

  const handleSetPassword = async (e) => {
    e.preventDefault();
    
    if (passwordData.password !== passwordData.confirmPassword) {
      toast.error('Пароли не совпадают');
      return;
    }

    if (passwordData.password.length < 4) {
      toast.error('Пароль должен содержать минимум 4 символа');
      return;
    }

    try {
      await axios.post('/api/admin/set-password', {
        userId: passwordData.userId,
        password: passwordData.password
      });
      toast.success('Пароль успешно установлен');
      setShowPasswordModal(false);
      setPasswordData({ userId: '', password: '', confirmPassword: '' });
    } catch (error) {
      console.error('Ошибка установки пароля:', error);
      toast.error('Ошибка установки пароля');
    }
  };

  const openAssignModal = () => {
    setShowAssignModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка админ панели...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Заголовок */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Админ панель
              </h1>
              <p className="text-gray-600 mt-1">
                Управление пользователями, проектами и результатами опросов
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={openAssignModal}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Link className="w-4 h-4" />
                <span>Назначить на проект</span>
              </button>
              <button
                onClick={handleTestTelegram}
                disabled={telegramLoading}
                className={`flex items-center space-x-2 px-4 py-2 text-white rounded-lg transition-colors ${
                  telegramLoading 
                    ? 'bg-yellow-400 cursor-not-allowed' 
                    : 'bg-yellow-600 hover:bg-yellow-700'
                }`}
              >
                {telegramLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Settings className="w-4 h-4" />
                )}
                <span>{telegramLoading ? 'Тестирование...' : 'Тест Telegram'}</span>
              </button>
              <button
                onClick={handleSendResults}
                disabled={telegramLoading}
                className={`flex items-center space-x-2 px-4 py-2 text-white rounded-lg transition-colors ${
                  telegramLoading 
                    ? 'bg-green-400 cursor-not-allowed' 
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {telegramLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Download className="w-4 h-4" />
                )}
                <span>{telegramLoading ? 'Отправка...' : 'Отправить в Telegram'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Навигация */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('users')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'users'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Users className="w-4 h-4 inline mr-2" />
              Пользователи ({users.length})
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'projects'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FolderOpen className="w-4 h-4 inline mr-2" />
              Проекты ({projects.length})
            </button>
            <button
              onClick={() => setActiveTab('results')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'results'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <BarChart3 className="w-4 h-4 inline mr-2" />
              Результаты ({surveyResults.length})
            </button>
          </nav>
        </div>

        {/* Вкладка пользователей */}
        {activeTab === 'users' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Пользователи</h2>
              <button
                onClick={() => openUserModal()}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                <span>Добавить пользователя</span>
              </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Пользователь
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Статус
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Роль
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Действия
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.is_active ? 'Активен' : 'Неактивен'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.is_admin
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.is_admin ? 'Администратор' : 'Пользователь'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openUserModal(user)}
                            className="text-primary-600 hover:text-primary-900"
                            title="Редактировать"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openPasswordModal(user)}
                            className="text-green-600 hover:text-green-900"
                            title="Установить пароль"
                          >
                            <Settings className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Вкладка проектов */}
        {activeTab === 'projects' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Проекты</h2>
              <button
                onClick={() => openProjectModal()}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <FolderPlus className="w-4 h-4" />
                <span>Добавить проект</span>
              </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Проект
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Описание
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Действия
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {projects.map((project) => (
                    <tr key={project.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {project.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500">
                          {project.description || 'Нет описания'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => openProjectModal(project)}
                          className="text-primary-600 hover:text-primary-900 mr-3"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Вкладка результатов */}
        {activeTab === 'results' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Результаты опросов</h2>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Пользователь
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Проект
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Оценка
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Дата
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {surveyResults
                    .filter((result, index, self) => 
                      index === self.findIndex(r => 
                        r.user_name === result.user_name && 
                        r.project_name === result.project_name && 
                        r.completed_at === result.completed_at
                      )
                    )
                    .map((result, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {result.user_name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {result.project_name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {result.total_score}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(result.completed_at).toLocaleDateString('ru-RU')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Модальное окно назначения пользователя на проект */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Назначить пользователя на проект
            </h3>
            <form onSubmit={handleAssignUserToProject}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Пользователь
                  </label>
                  <select
                    value={assignData.userId}
                    onChange={(e) => setAssignData({...assignData, userId: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    required
                  >
                    <option value="">Выберите пользователя</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Проект
                  </label>
                  <select
                    value={assignData.projectId}
                    onChange={(e) => setAssignData({...assignData, projectId: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    required
                  >
                    <option value="">Выберите проект</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
                >
                  Назначить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Модальное окно установки пароля */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Установить пароль для пользователя
            </h3>
            <form onSubmit={handleSetPassword}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Пользователь
                  </label>
                  <input
                    type="text"
                    value={users.find(u => u.id === parseInt(passwordData.userId))?.name || ''}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Новый пароль
                  </label>
                  <input
                    type="password"
                    value={passwordData.password}
                    onChange={(e) => setPasswordData({...passwordData, password: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    required
                    minLength={4}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Подтвердите пароль
                  </label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    required
                    minLength={4}
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                >
                  Установить пароль
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Модальное окно пользователя */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {editingUser ? 'Редактировать пользователя' : 'Добавить пользователя'}
            </h3>
            <form onSubmit={handleUserSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Имя
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.is_admin}
                      onChange={(e) => setFormData({...formData, is_admin: e.target.checked})}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Администратор</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Активен</span>
                  </label>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowUserModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
                >
                  {editingUser ? 'Обновить' : 'Создать'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Модальное окно проекта */}
      {showProjectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {editingProject ? 'Редактировать проект' : 'Добавить проект'}
            </h3>
            <form onSubmit={handleProjectSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Название проекта
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Описание
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowProjectModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
                >
                  {editingProject ? 'Обновить' : 'Создать'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
