import { FilterQuery } from 'mongoose';
import { Lead, ILead } from '../models/Lead';
import { LeadFilters } from '../types';
import { CreateLeadInput, UpdateLeadInput } from '../schemas/lead.schema';
import { leadsToCSV } from '../utils/csvExport';

const buildQuery = (filters: LeadFilters): FilterQuery<ILead> => {
  const query: FilterQuery<ILead> = {};
  if (filters.status) query.status = filters.status;
  if (filters.source) query.source = filters.source;
  if (filters.search) {
    const regex = { $regex: filters.search, $options: 'i' };
    query.$or = [{ name: regex }, { email: regex }];
  }
  return query;
};

export const leadsService = {
  async getAll(filters: LeadFilters) {
    const { page = 1, limit = 10, sort = 'latest' } = filters;
    const skip = (page - 1) * limit;
    const sortOrder = sort === 'latest' ? -1 : 1;
    const query = buildQuery(filters);

    const [leads, total] = await Promise.all([
      Lead.find(query).sort({ createdAt: sortOrder }).skip(skip).limit(limit).lean(),
      Lead.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limit);
    return {
      leads,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  },

  async getById(id: string) {
    return Lead.findById(id).lean();
  },

  async create(data: CreateLeadInput) {
    return Lead.create(data);
  },

  async update(id: string, data: UpdateLeadInput) {
    return Lead.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();
  },

  async delete(id: string) {
    return Lead.findByIdAndDelete(id).lean();
  },

  async exportCSV(filters: Omit<LeadFilters, 'page' | 'limit'>) {
    const query = buildQuery(filters);
    const leads = await Lead.find(query).sort({ createdAt: -1 }).lean();
    return leadsToCSV(leads as ILead[]);
  },
};
