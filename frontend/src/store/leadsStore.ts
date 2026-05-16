import { create } from 'zustand';
import { Lead, LeadFilters, PaginationMeta } from '@/types';
import { leadsApi, CreateLeadData } from '@/api/leads.api';

interface LeadStats {
  total: number;
  New: number;
  Qualified: number;
  Lost: number;
}

interface LeadsState {
  leads: Lead[];
  meta: PaginationMeta | null;
  filters: LeadFilters;
  loading: boolean;
  error: string | null;
  stats: LeadStats;
  setFilters: (f: Partial<LeadFilters>) => void;
  fetchLeads: () => Promise<void>;
  fetchStats: () => Promise<void>;
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
  stats: { total: 0, New: 0, Qualified: 0, Lost: 0 },

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

  fetchStats: async () => {
    try {
      const [allRes, newRes, qualRes, lostRes] = await Promise.all([
        leadsApi.getAll({ page: 1, limit: 1 } as LeadFilters),
        leadsApi.getAll({ status: 'New', page: 1, limit: 1 } as LeadFilters),
        leadsApi.getAll({ status: 'Qualified', page: 1, limit: 1 } as LeadFilters),
        leadsApi.getAll({ status: 'Lost', page: 1, limit: 1 } as LeadFilters),
      ]);
      set({
        stats: {
          total: allRes.data.meta?.total ?? 0,
          New: newRes.data.meta?.total ?? 0,
          Qualified: qualRes.data.meta?.total ?? 0,
          Lost: lostRes.data.meta?.total ?? 0,
        },
      });
    } catch {
      // silently fail — stats are non-critical
    }
  },

  createLead: async (data) => {
    await leadsApi.create(data);
    set((s) => ({ filters: { ...s.filters, page: 1 } }));
    await Promise.all([get().fetchLeads(), get().fetchStats()]);
  },

  updateLead: async (id, data) => {
    await leadsApi.update(id, data);
    await Promise.all([get().fetchLeads(), get().fetchStats()]);
  },

  deleteLead: async (id) => {
    await leadsApi.delete(id);
    await Promise.all([get().fetchLeads(), get().fetchStats()]);
  },
}));