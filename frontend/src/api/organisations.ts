import api from './client';

export const fetchOrganisations = () => api.get('/organisations');
export const fetchOrganisationById = (id: string) => api.get(`/organisations/${id}`);
export const createOrganisation = (data: FormData) => api.post('/organisations', data);

