import { useEffect, useState } from 'react';
import { useLeadsStore } from '@/store/leadsStore';
import { useAuthStore } from '@/store/authStore';
import { useTheme } from '@/hooks/useTheme';
import { Lead } from '@/types';
import { FilterBar } from '@/components/FilterBar';
import { LeadTable } from '@/components/LeadTable';
import { LeadForm } from '@/components/LeadForm';
import { LeadDetailModal } from '@/components/LeadDetailModal';
import { Pagination } from '@/components/Pagination';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { EmptyState } from '@/components/EmptyState';

export const DashboardPage = () => {
  const { leads, meta, loading, error, fetchLeads, deleteLead } = useLeadsStore();
  const { user, logout } = useAuthStore();
  const { dark, toggle } = useTheme();
  const [formOpen, setFormOpen] = useState(false);
  const [editLead, setEditLead] = useState<Lead | null>(null);
  const [viewLead, setViewLead] = useState<Lead | null>(null);

  useEffect(() => { fetchLeads(); }, []); // eslint-disable-line

  const handleEdit = (lead: Lead) => { setEditLead(lead); setFormOpen(true); setViewLead(null); };
  const handleView = (lead: Lead) => setViewLead(lead);
  const handleAddClick = () => { setEditLead(null); setFormOpen(true); };
  const handleFormClose = () => { setFormOpen(false); setEditLead(null); };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this lead? This cannot be undone.')) return;
    await deleteLead(id);
  };

  const statusCounts = leads.reduce((acc, l) => {
    acc[l.status] = (acc[l.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      {/* Nav */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
            <span className="font-semibold text-gray-900 dark:text-gray-100">Smart Leads</span>
            <span className={`ml-2 text-xs px-2 py-0.5 rounded-full font-medium ${
              user?.role === 'admin'
                ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300'
                : 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
            }`}>
              {user?.role}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 dark:text-gray-400">{user?.name}</span>

            {/* Dark mode toggle */}
            <button
              onClick={toggle}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
              title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {dark ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
                </svg>
              )}
            </button>

            <button onClick={logout} className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6 space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Leads', value: meta?.total ?? leads.length, color: 'text-gray-900 dark:text-gray-100' },
            { label: 'New', value: statusCounts['New'] ?? 0, color: 'text-blue-600 dark:text-blue-400' },
            { label: 'Qualified', value: statusCounts['Qualified'] ?? 0, color: 'text-green-600 dark:text-green-400' },
            { label: 'Lost', value: statusCounts['Lost'] ?? 0, color: 'text-red-500 dark:text-red-400' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 px-4 py-3">
              <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
              <p className={`text-2xl font-bold mt-0.5 ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        <FilterBar onAddLead={handleAddClick} />

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        {loading ? (
          <LoadingSpinner />
        ) : leads.length === 0 ? (
          <EmptyState
            title="No leads found"
            description="Try adjusting your filters or add your first lead."
            action={
              <button onClick={handleAddClick} className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Add Lead
              </button>
            }
          />
        ) : (
          <LeadTable leads={leads} onView={handleView} onEdit={handleEdit} onDelete={handleDelete} />
        )}

        {meta && meta.totalPages > 1 && <Pagination meta={meta} />}
      </main>

      {formOpen && <LeadForm lead={editLead} onClose={handleFormClose} />}
      {viewLead && <LeadDetailModal lead={viewLead} onClose={() => setViewLead(null)} onEdit={handleEdit} />}
    </div>
  );
};
