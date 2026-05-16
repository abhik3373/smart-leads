import { Response } from 'express';
import { leadsService } from '../services/leads.service';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthRequest, LeadFilters } from '../types';
import { CreateLeadInput, UpdateLeadInput } from '../schemas/lead.schema';

export const getLeads = asyncHandler(async (req: AuthRequest, res: Response) => {
  const filters: LeadFilters = {
    status: req.query.status as LeadFilters['status'],
    source: req.query.source as LeadFilters['source'],
    search: req.query.search as string,
    sort: (req.query.sort as LeadFilters['sort']) || 'latest',
    page: req.query.page ? Number(req.query.page) : 1,
    limit: req.query.limit ? Number(req.query.limit) : 10,
  };
  const result = await leadsService.getAll(filters);
  res.json({ success: true, data: result.leads, meta: result.meta });
});

export const getLead = asyncHandler(async (req: AuthRequest, res: Response) => {
  const lead = await leadsService.getById(req.params.id);
  if (!lead) {
    res.status(404).json({ success: false, message: 'Lead not found' });
    return;
  }
  res.json({ success: true, data: lead });
});

export const createLead = asyncHandler(async (req: AuthRequest, res: Response) => {
  const lead = await leadsService.create(req.body as CreateLeadInput);
  res.status(201).json({ success: true, data: lead });
});

export const updateLead = asyncHandler(async (req: AuthRequest, res: Response) => {
  const lead = await leadsService.update(req.params.id, req.body as UpdateLeadInput);
  if (!lead) {
    res.status(404).json({ success: false, message: 'Lead not found' });
    return;
  }
  res.json({ success: true, data: lead });
});

export const deleteLead = asyncHandler(async (req: AuthRequest, res: Response) => {
  const lead = await leadsService.delete(req.params.id);
  if (!lead) {
    res.status(404).json({ success: false, message: 'Lead not found' });
    return;
  }
  res.json({ success: true, message: 'Lead deleted successfully' });
});

export const exportLeads = asyncHandler(async (req: AuthRequest, res: Response) => {
  const filters = {
    status: req.query.status as LeadFilters['status'],
    source: req.query.source as LeadFilters['source'],
    search: req.query.search as string,
    sort: (req.query.sort as LeadFilters['sort']) || 'latest',
  };
  const csv = await leadsService.exportCSV(filters);
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="leads.csv"');
  res.send(csv);
});
