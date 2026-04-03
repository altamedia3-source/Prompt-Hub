import React, { useEffect, useState } from 'react';
import { api, Prompt } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { PromptCard } from '../components/PromptCard';
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import { toast } from 'sonner';

export function Dashboard() {
  const { user } = useAuth();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchMyPrompts();
    }
  }, [user]);

  const fetchMyPrompts = async () => {
    try {
      const data = await api.getPrompts({ user_id: user?.id });
      setPrompts(data);
    } catch (error) {
      console.error('Failed to fetch prompts:', error);
      toast.error('Failed to load your prompts');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this prompt?')) return;
    
    try {
      await api.deletePrompt(id);
      setPrompts(prompts.filter(p => p.id !== id));
      toast.success('Prompt deleted successfully');
    } catch (error) {
      console.error('Failed to delete prompt:', error);
      toast.error('Failed to delete prompt');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your personal collection of AI prompts.
          </p>
        </div>
        <Link
          to="/create"
          className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          <PlusCircle className="h-4 w-4" />
          Create Prompt
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
          ))}
        </div>
      ) : prompts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {prompts.map((prompt) => (
            <PromptCard 
              key={prompt.id} 
              prompt={prompt} 
              isOwner={true} 
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
          <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">No prompts</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by creating a new prompt.</p>
          <div className="mt-6">
            <Link
              to="/create"
              className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              <PlusCircle className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
              New Prompt
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
