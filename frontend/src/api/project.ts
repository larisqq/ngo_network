// src/api/project.ts
import api from './client';

export const fetchProjects = (page = 1) => api.get(`/projects?page=${page}`);
export const fetchProjectById = (id: string) => api.get(`/projects/${id}`);
export const createProject = (data: FormData) => api.post('/projects', data);
