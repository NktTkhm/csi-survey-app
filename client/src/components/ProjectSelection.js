import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FolderOpen, ArrowLeft, ArrowRight } from 'lucide-react';

const ProjectSelection = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchData();
  }, [userId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Получаем информацию о пользователе
      const userResponse = await axios.get(`/api/users/${userId}`);
      setUser(userResponse.data);
      
      // Получаем проекты пользователя
      const projectsResponse = await axios.get(`/api/projects/${userId}`);
      setProjects(projectsResponse.data);
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
      toast.error('Ошибка загрузки проектов');
    } finally {
      setLoading(false);
    }
  };

  const handleProjectSelect = (project) => {
    setSelectedProject(project);
  };

  const handleContinue = () => {
    if (selectedProject) {
      navigate(`/survey/${userId}/${selectedProject.id}`);
    } else {
      toast.error('Пожалуйста, выберите проект');
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка проектов...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Заголовок */}
        <div className="mb-8">
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Назад к выбору пользователя</span>
          </button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Выбор проекта
            </h1>
            {user && (
              <p className="text-gray-600">
                Пользователь: <span className="font-medium">{user.name}</span>
              </p>
            )}
          </div>
        </div>

        {/* Список проектов */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {projects.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => handleProjectSelect(project)}
                  className={`p-6 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedProject?.id === project.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <FolderOpen className="w-5 h-5 text-primary-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 mb-1">
                        {project.name}
                      </h3>
                      {project.description && (
                        <p className="text-sm text-gray-500 line-clamp-2">
                          {project.description}
                        </p>
                      )}
                    </div>
                    {selectedProject?.id === project.id && (
                      <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FolderOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Нет доступных проектов
              </h3>
              <p className="text-gray-500">
                Для этого пользователя не назначено ни одного проекта
              </p>
            </div>
          )}
        </div>

        {/* Кнопка продолжить */}
        {projects.length > 0 && (
          <div className="mt-8 text-center">
            <button
              onClick={handleContinue}
              disabled={!selectedProject}
              className={`inline-flex items-center space-x-2 py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
                selectedProject
                  ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg hover:shadow-xl'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <span>Начать опрос</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectSelection;
