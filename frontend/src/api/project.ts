// Update the import path if necessary, or create the types file if it doesn't exist
import api from './client';

export const fetchProjects = () => api.get('/projects');
export const fetchProjectById = (id: string) => api.get(`/projects/${id}`);
export const createProject = (data: FormData) => api.post('/projects', data);