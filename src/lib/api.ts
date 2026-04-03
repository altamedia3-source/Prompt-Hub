import { supabase } from './supabase';

const getAuthHeaders = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return {
    'Content-Type': 'application/json',
    ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {})
  };
};

export interface Prompt {
  id: string;
  user_id: string;
  title: string;
  content: string;
  category: string;
  created_at: string;
}

export const api = {
  async getPrompts(params?: { user_id?: string; category?: string; search?: string }): Promise<Prompt[]> {
    const query = new URLSearchParams(params as any).toString();
    const res = await fetch(`/api/prompts?${query}`, {
      headers: await getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch prompts');
    return res.json();
  },
  
  async getPrompt(id: string): Promise<Prompt> {
    const res = await fetch(`/api/prompts/${id}`, {
      headers: await getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch prompt');
    return res.json();
  },

  async createPrompt(data: { title: string; content: string; category: string }): Promise<Prompt> {
    const res = await fetch('/api/prompts', {
      method: 'POST',
      headers: await getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create prompt');
    return res.json();
  },

  async updatePrompt(id: string, data: { title: string; content: string; category: string }): Promise<Prompt> {
    const res = await fetch(`/api/prompts/${id}`, {
      method: 'PUT',
      headers: await getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update prompt');
    return res.json();
  },

  async deletePrompt(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/prompts/${id}`, {
      method: 'DELETE',
      headers: await getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete prompt');
    return res.json();
  }
};
