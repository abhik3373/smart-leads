import { create } from 'zustand';
import { Lead, LeadFilters, PaginationMeta } from '@/types';
import { leadsApi, CreateLeadData } from '@/api/leads.api';

interface LeadsState {
  leads: Lead[];
  meta: PaginationMeta | null;
  filters: LeadFilters;
  loading: boolean;
  error: string | null;
  setFilters: (f: Partial<LeadFilters>) => void;
  fetchLeads: () => Promise<void>;
  createLead: (data: CreateLeadData) => Promise<void>;
  updateLead: (id: string, data: Partial<CreateLeadData>) => Promise<void>;
  deleteLead: (id: string) => Promise<void>;
}

export const useLeadsStore = create<LeadsState>((set, get) => ({
  leads: [],
  meta: null,
  filters: { sort: 'latest', page: 1 },
  loading: false,
  error: null,

  setFilters: (f) => {
    const reset = 'page' in f ? {} : { page: 1 };
    set((s) => ({ filters: { ...s.filters, ...reset, ...f } }));
    get().fetchLeads();
  },

  fetchLeads: async () => {
    set({ loading: true, error: null });
    try {
      const { filters } = get();
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v !== '' && v !== undefined)
      ) as LeadFilters;
      const res = await leadsApi.getAll(cleanFilters);
      set({ leads: res.data.data ?? [], meta: res.data.meta ?? null });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch leads';
      set({ error: msg });
    } finally {
      set({ loading: false });
    }
  },

  createLead: async (data) => {
    await leadsApi.create(data);
    set((s) => ({ filters: { ...s.filters, page: 1 } }));
    await get().fetchLeads();
  },

  updateLead: async (id, data) => {
    await leadsApi.update(id, data);
    await get().fetchLeads();
  },

  deleteLead: async (id) => {
    await leadsApi.delete(id);
    await get().fetchLeads();
  },
}));
