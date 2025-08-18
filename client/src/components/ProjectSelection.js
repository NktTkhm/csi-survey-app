import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Folder, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const ProjectSelection = () => {
  const { userId } = useParams();
  const [projects, setProjects] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserAndProjects();
  }, [userId]);

  const fetchUserAndProjects = async () => {
    try {
      // Получаем информацию о пользователе
      const userResponse = await axios.get(`/api/users/${userId}`);
      setUser(userResponse.data);

      // Получаем проекты пользователя
      const projectsResponse = await axios.get(`/api/users/${userId}/projects`);
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка проектов...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
            <Folder className="w-8 h-8 text-primary-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Выберите проект
          </h1>
          <p className="text-gray-600">
            {user && `Выберите проект для ${user.name}`}
          </p>
        </div>

        <div className="space-y-3 mb-8">
          {projects.map((project) => (
            <div
              key={project.id}
              onClick={() => handleProjectSelect(project)}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                selectedProject?.id === project.id
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <Folder className="w-5 h-5 text-primary-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{project.name}</h3>
                  {project.description && (
                    <p className="text-sm text-gray-500">{project.description}</p>
                  )}
                </div>
                {selectedProject?.id === project.id && (
                  <CheckCircle className="w-6 h-6 text-primary-500" />
                )}
              </div>
            </div>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">Нет доступных проектов</p>
            <p className="text-sm text-gray-400">
              Обратитесь к администратору для назначения проектов
            </p>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={handleContinue}
            disabled={!selectedProject}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
              selectedProject
                ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg hover:shadow-xl'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <span>Начать опрос</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={handleBack}
            className="w-full py-3 px-4 rounded-lg font-medium text-gray-600 hover:text-gray-800 transition-all duration-200 flex items-center justify-center space-x-2 hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Назад</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectSelection;
