import { PaginationMeta } from '@/types';
import { useLeadsStore } from '@/store/leadsStore';

export const Pagination = ({ meta }: { meta: PaginationMeta }) => {
  const setFilters = useLeadsStore((s) => s.setFilters);

  return (
    <div className="flex items-center justify-between py-3">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Showing <span className="font-medium text-gray-700 dark:text-gray-300">{(meta.page - 1) * meta.limit + 1}</span>–
        <span className="font-medium text-gray-700 dark:text-gray-300">{Math.min(meta.page * meta.limit, meta.total)}</span>{' '}
        of <span className="font-medium text-gray-700 dark:text-gray-300">{meta.total}</span> leads
      </p>
      <div className="flex items-center gap-1">
        <button
          disabled={!meta.hasPrev}
          onClick={() => setFilters({ page: meta.page - 1 })}
          className="px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors"
        >
          Previous
        </button>
        {Array.from({ length: Math.min(5, meta.totalPages) }, (_, i) => {
          const page = i + 1;
          return (
            <button
              key={page}
              onClick={() => setFilters({ page })}
              className={`w-8 h-8 text-sm rounded-lg transition-colors ${
                page === meta.page
                  ? 'bg-blue-600 text-white'
                  : 'border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              {page}
            </button>
          );
        })}
        <button
          disabled={!meta.hasNext}
          onClick={() => setFilters({ page: meta.page + 1 })}
          className="px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
};
