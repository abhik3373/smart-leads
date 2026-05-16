import api from './axios';
import { ApiResponse, Lead, LeadFilters } from '@/types';

export interface CreateLeadData {
  name: string;
  email: string;
  status?: string;
  source: string;
}

export const leadsApi = {
  getAll: (filters: LeadFilters) =>
    api.get<ApiResponse<Lead[]>>('/leads', { params: filters }),

  getById: (id: string) =>
    api.get<ApiResponse<Lead>>(`/leads/${id}`),

  create: (data: CreateLeadData) =>
    api.post<ApiResponse<Lead>>('/leads', data),

  update: (id: string, data: Partial<CreateLeadData>) =>
    api.patch<ApiResponse<Lead>>(`/leads/${id}`, data),

  delete: (id: string) =>
    api.delete<ApiResponse<null>>(`/leads/${id}`),

  exportCSV: (filters: Omit<LeadFilters, 'page'>) => {
    const params = new URLSearchParams();
    if (filters.status) params.set('status', filters.status);
    if (filters.source) params.set('source', filters.source);
    if (filters.search) params.set('search', filters.search);
    if (filters.sort) params.set('sort', filters.sort);
    const token = localStorage.getItem('token');
    const url = `/api/leads/export?${params.toString()}`;
    const a = document.createElement('a');
    a.href = url;
    a.setAttribute('download', 'leads.csv');
    const headers = token ? `Bearer ${token}` : '';
    fetch(url, { headers: { Authorization: headers } })
      .then((r) => r.blob())
      .then((blob) => {
        a.href = URL.createObjectURL(blob);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      });
  },
};
