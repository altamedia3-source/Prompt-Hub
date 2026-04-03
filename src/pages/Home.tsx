import React, { useEffect, useState } from 'react';
import { api, Prompt } from '../lib/api';
import { PromptCard } from '../components/PromptCard';
import { Search, Sparkles } from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';

const CATEGORIES = ['All', 'Marketing', 'Coding', 'Design', 'Writing', 'Business', 'Productivity'];

export function Home() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    const fetchPrompts = async () => {
      setLoading(true);
      try {
        const data = await api.getPrompts({
          search: search || undefined,
          category: category !== 'All' ? category : undefined
        });
        setPrompts(data);
      } catch (error) {
        console.error('Failed to fetch prompts:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchPrompts, 300);
    return () => clearTimeout(debounce);
  }, [search, category]);

  if (!isSupabaseConfigured) {
    return (
      <div className="max-w-3xl mx-auto mt-20 p-6 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-900/50 dark:text-yellow-200">
        <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          Setup Required
        </h2>
        <p className="mb-4">Please configure your Supabase credentials to use PromptHub AI.</p>
        <ol className="list-decimal list-inside space-y-2 text-sm">
          <li>Create a Supabase project</li>
          <li>Run the SQL from <code>supabase-schema.sql</code> in the SQL Editor</li>
          <li>Add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> to your environment variables</li>
        </ol>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl dark:text-white mb-4">
          Discover & Share <span className="text-blue-600 dark:text-blue-400">AI Prompts</span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          A curated collection of the best prompts for ChatGPT, Claude, and other AI models.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full rounded-lg border-0 py-3 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 dark:bg-gray-900 dark:text-white dark:ring-gray-700 dark:focus:ring-blue-500"
            placeholder="Search prompts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                category === cat
                  ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-48 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
          ))}
        </div>
      ) : prompts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {prompts.map((prompt) => (
            <PromptCard key={prompt.id} prompt={prompt} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-500 dark:text-gray-400">No prompts found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
