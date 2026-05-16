import React, { useEffect, useState } from 'react';
import { Lead, LEAD_SOURCES, LEAD_STATUSES } from '@/types';
import { Button, Input, Select } from '@/components/ui';
import { useLeadsStore } from '@/store/leadsStore';
import toast from 'react-hot-toast';

interface LeadFormProps {
  lead?: Lead;
  onClose: () => void;
}

interface FormState {
  name: string;
  email: string;
  status: string;
  source: string;
  notes: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  source?: string;
}

const validate = (state: FormState): FormErrors => {
  const errors: FormErrors = {};
  if (!state.name.trim() || state.name.length < 2)
    errors.name = 'Name must be at least 2 characters.';
  if (!state.email.match(/^\S+@\S+\.\S+$/))
    errors.email = 'Enter a valid email address.';
  if (!state.source) errors.source = 'Source is required.';
  return errors;
};

const LeadForm: React.FC<LeadFormProps> = ({ lead, onClose }) => {
  const { createLead, updateLead } = useLeadsStore();
  const isEdit = !!lead;

  const [form, setForm] = useState<FormState>({
    name: lead?.name ?? '',
    email: lead?.email ?? '',
    status: lead?.status ?? 'New',
    source: lead?.source ?? '',
    notes: lead?.notes ?? '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (lead) {
      setForm({
        name: lead.name,
        email: lead.email,
        status: lead.status,
        source: lead.source,
        notes: lead.notes ?? '',
      });
    }
  }, [lead]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      if (isEdit) {
        await updateLead(lead._id, form as Partial<Lead>);
      } else {
        await createLead(form as Partial<Lead>);
      }
      onClose();
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Something went wrong.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Full name"
        name="name"
        value={form.name}
        onChange={handleChange}
        error={errors.name}
        placeholder="Rahul Sharma"
      />
      <Input
        label="Email address"
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        error={errors.email}
        placeholder="rahul@example.com"
      />
      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Source"
          name="source"
          value={form.source}
          onChange={handleChange}
          error={errors.source}
          placeholder="Select source"
          options={LEAD_SOURCES.map((s) => ({ value: s, label: s }))}
        />
        <Select
          label="Status"
          name="status"
          value={form.status}
          onChange={handleChange}
          options={LEAD_STATUSES.map((s) => ({ value: s, label: s }))}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Notes (optional)
        </label>
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          rows={3}
          maxLength={500}
          placeholder="Any additional context..."
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm dark:bg-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
        <p className="text-xs text-gray-400 text-right">{form.notes.length}/500</p>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button variant="secondary" type="button" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          {isEdit ? 'Save changes' : 'Create lead'}
        </Button>
      </div>
    </form>
  );
};

export default LeadForm;
