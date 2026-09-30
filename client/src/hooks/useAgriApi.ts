import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Field, CropAdvisory, PathologyScan, AdvisoryActionPlan, PathologyTreatmentProtocols } from '@shared/schema';
import type { CreateFieldInput, GenerateAdvisoryInput, PathologyScanInput } from '@shared/validators';

const API_BASE = '/api';

export interface DashboardStats {
  activeFieldsCount: number;
  totalAcres: string;
  advisoriesGenerated: number;
  pathologyScansCompleted: number;
  highRiskThreats: number;
  averageProjectedYield: string;
  recentFields: Field[];
  recentAdvisories: CropAdvisory[];
  recentScans: PathologyScan[];
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  farmName: string;
  region: string;
  aiConfigured: boolean;
  engineMode: string;
}

// 1. Dashboard Stats
export function useDashboardStats() {
  return useQuery<DashboardStats>({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/dashboard/stats`);
      if (!res.ok) throw new Error('Failed to load dashboard metrics');
      const data = await res.json();
      return data.data;
    },
    refetchInterval: 30000,
  });
}

// 2. User Profile
export function useUserProfile() {
  return useQuery<UserProfile>({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/user/profile`);
      if (!res.ok) throw new Error('Failed to load profile');
      const data = await res.json();
      return data.data;
    },
  });
}

// 3. Fields Queries & Mutations
export function useFields() {
  return useQuery<Field[]>({
    queryKey: ['fields'],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/fields`);
      if (!res.ok) throw new Error('Failed to fetch operational fields');
      const data = await res.json();
      return data.data;
    },
  });
}

export function useField(id: string | null) {
  return useQuery<Field>({
    queryKey: ['fields', id],
    queryFn: async () => {
      if (!id) throw new Error('No field ID provided');
      const res = await fetch(`${API_BASE}/fields/${id}`);
      if (!res.ok) throw new Error('Failed to fetch field');
      const data = await res.json();
      return data.data;
    },
    enabled: !!id,
  });
}

export function useCreateField() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateFieldInput) => {
      const res = await fetch(`${API_BASE}/fields`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create field');
      return data.data as Field;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fields'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
  });
}

// 4. Advisories Queries & Mutations
export function useAdvisories() {
  return useQuery<CropAdvisory[]>({
    queryKey: ['advisories'],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/advisories`);
      if (!res.ok) throw new Error('Failed to fetch advisories');
      const data = await res.json();
      return data.data;
    },
  });
}

export function useAdvisory(id: string) {
  return useQuery<CropAdvisory & { field?: Field }>({
    queryKey: ['advisories', id],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/advisories/${id}`);
      if (!res.ok) throw new Error('Failed to fetch advisory plan');
      const data = await res.json();
      return data.data;
    },
    enabled: !!id,
  });
}

export function useGenerateAdvisory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: GenerateAdvisoryInput) => {
      const res = await fetch(`${API_BASE}/advisories/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to generate advisory');
      return data.data as CropAdvisory;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['advisories'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
  });
}

// 5. Diagnostics Queries & Mutations
export function useScans() {
  return useQuery<PathologyScan[]>({
    queryKey: ['scans'],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/diagnostics`);
      if (!res.ok) throw new Error('Failed to fetch diagnostics scans');
      const data = await res.json();
      return data.data;
    },
  });
}

export function useScan(id: string) {
  return useQuery<PathologyScan>({
    queryKey: ['scans', id],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/diagnostics/${id}`);
      if (!res.ok) throw new Error('Failed to fetch scan detail');
      const data = await res.json();
      return data.data;
    },
    enabled: !!id,
  });
}

export function useScanPlant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: PathologyScanInput) => {
      const res = await fetch(`${API_BASE}/diagnostics/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to analyze plant pathology');
      return data.data as PathologyScan;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scans'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
  });
}
