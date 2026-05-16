import { useState, useEffect } from 'react';
import { useLeadsStore } from '@/store/leadsStore';
import { useDebounce } from '@/hooks/useDebounce';
import { LeadStatus, LeadSource, SortOrder } from '@/types';
import { leadsApi } from '@/api/leads.api';

const selectClass = "text-sm border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200";

export const FilterBar = ({ onAddLead }: { onAddLead: () => void }) => {
  const { filters, setFilters } = useLeadsStore();
  const [searchInput, setSearchInput] = useState(filters.search || '');
  const debouncedSearch = useDebounce(searchInput, 300);

  useEffect(() => {
    setFilters({ search: debouncedSearch });
  }, [debouncedSearch]); // eslint-disable-line

  const handleExport = () => {
    leadsApi.exportCSV({
      status: filters.status,
      source: filters.source,
      search: filters.search,
      sort: filters.sort,
    });
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-3">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
          />
        </div>

        <select value={filters.status || ''} onChange={(e) => setFilters({ status: e.target.value as LeadStatus | '' })} className={selectClass}>
          <option value="">All statuses</option>
          {(['New', 'Contacted', 'Qualified', 'Lost'] as LeadStatus[]).map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select value={filters.source || ''} onChange={(e) => setFilters({ source: e.target.value as LeadSource | '' })} className={selectClass}>
          <option value="">All sources</option>
          {(['Website', 'Instagram', 'Referral'] as LeadSource[]).map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select value={filters.sort || 'latest'} onChange={(e) => setFilters({ sort: e.target.value as SortOrder })} className={selectClass}>
          <option value="latest">Latest first</option>
          <option value="oldest">Oldest first</option>
        </select>
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={() => { setSearchInput(''); setFilters({ status: '', source: '', search: '', sort: 'latest', page: 1 }); }}
          className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 underline"
        >
          Clear filters
        </button>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 text-sm px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
            </svg>
            Export CSV
          </button>
          <button
            onClick={onAddLead}
            className="flex items-center gap-1.5 text-sm px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
            </svg>
            Add Lead
          </button>
        </div>
      </div>
    </div>
  );
};
