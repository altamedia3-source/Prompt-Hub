import { supabase } from './supabase';

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
    let query = supabase.from('prompts').select('*').order('created_at', { ascending: false });
    
    if (params?.user_id) query = query.eq('user_id', params.user_id);
    if (params?.category) query = query.eq('category', params.category);
    if (params?.search) query = query.ilike('title', `%${params.search}%`);

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data || [];
  },
  
  async getPrompt(id: string): Promise<Prompt> {
    const { data, error } = await supabase.from('prompts').select('*').eq('id', id).single();
    if (error) throw new Error(error.message);
    return data;
  },

  async createPrompt(data: { title: string; content: string; category: string }): Promise<Prompt> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data: prompt, error } = await supabase
      .from('prompts')
      .insert([{ ...data, user_id: user.id }])
      .select()
      .single();
      
    if (error) throw new Error(error.message);
    return prompt;
  },

  async updatePrompt(id: string, data: { title: string; content: string; category: string }): Promise<Prompt> {
    const { data: prompt, error } = await supabase
      .from('prompts')
      .update(data)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw new Error(error.message);
    return prompt;
  },

  async deletePrompt(id: string): Promise<{ success: boolean }> {
    const { error } = await supabase.from('prompts').delete().eq('id', id);
    if (error) throw new Error(error.message);
    return { success: true };
  }
};
