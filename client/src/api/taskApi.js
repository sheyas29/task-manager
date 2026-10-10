import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/tasks',
});

export const getTasks = async () => {
  const response = await api.get('/');
  return response.data.tasks;
};

export const markTaskDone = async (taskId) => {
  const response = await api.patch(`/${taskId}/status`);
  return response.data;
};

export const deleteTask = async (taskId) => {
  const response = await api.delete(`/${taskId}`);
  return response.data;
};
export const createTask = async (formData) => {
  const response = await api.post('/', formData);
  return response.data;
};
export const editTask = async (taskId, updatedData) => {
  const response = await api.patch(`/${taskId}`, updatedData);
  return response.data;
};
export const getTaskFileUrl = (taskId, fileIndex, action = 'view') => {
  return `${api.defaults.baseURL}/${taskId}/files/${fileIndex}/${action}`;
};

export default api;
