import express from 'express';
import { createServer as createViteServer } from 'vite';
import { createClient } from '@supabase/supabase-js';
import path from 'path';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Helper to get Supabase client with user's auth context
  const getSupabase = (req: express.Request) => {
    const authHeader = req.headers.authorization;
    const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase credentials not configured');
    }

    return createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: authHeader ? { Authorization: authHeader } : {},
      },
    });
  };

  // API Routes
  app.post('/api/prompts', async (req, res) => {
    try {
      const supabase = getSupabase(req);
      const { title, content, category } = req.body;
      
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) return res.status(401).json({ error: 'Unauthorized' });

      const { data, error } = await supabase
        .from('prompts')
        .insert([{ title, content, category, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/prompts', async (req, res) => {
    try {
      const supabase = getSupabase(req);
      const { user_id, category, search } = req.query;
      
      let query = supabase.from('prompts').select('*').order('created_at', { ascending: false });
      
      if (user_id) query = query.eq('user_id', user_id);
      if (category) query = query.eq('category', category);
      if (search) query = query.ilike('title', `%${search}%`);

      const { data, error } = await query;
      if (error) throw error;
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/prompts/:id', async (req, res) => {
    try {
      const supabase = getSupabase(req);
      const { data, error } = await supabase
        .from('prompts')
        .select('*')
        .eq('id', req.params.id)
        .single();

      if (error) throw error;
      if (!data) return res.status(404).json({ error: 'Not found' });
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put('/api/prompts/:id', async (req, res) => {
    try {
      const supabase = getSupabase(req);
      const { title, content, category } = req.body;
      
      const { data, error } = await supabase
        .from('prompts')
        .update({ title, content, category })
        .eq('id', req.params.id)
        .select()
        .single();

      if (error) throw error;
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete('/api/prompts/:id', async (req, res) => {
    try {
      const supabase = getSupabase(req);
      const { error } = await supabase
        .from('prompts')
        .delete()
        .eq('id', req.params.id);

      if (error) throw error;
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
