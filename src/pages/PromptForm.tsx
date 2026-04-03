import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../lib/api';
import { toast } from 'sonner';
import { Wand2 } from 'lucide-react';

const CATEGORIES = ['Marketing', 'Coding', 'Design', 'Writing', 'Business', 'Productivity', 'Other'];

export function PromptForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (isEditing && id) {
      const fetchPrompt = async () => {
        try {
          const prompt = await api.getPrompt(id);
          setTitle(prompt.title);
          setContent(prompt.content);
          setCategory(prompt.category);
        } catch (error) {
          toast.error('Failed to load prompt');
          navigate('/dashboard');
        } finally {
          setInitialLoading(false);
        }
      };
      fetchPrompt();
    }
  }, [id, isEditing, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEditing && id) {
        await api.updatePrompt(id, { title, content, category });
        toast.success('Prompt updated successfully');
      } else {
        await api.createPrompt({ title, content, category });
        toast.success('Prompt created successfully');
      }
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAI = async () => {
    if (!title) {
      toast.error('Please enter a title first to guide the AI');
      return;
    }
    
    setGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setContent(`Act as an expert in ${category.toLowerCase()}. I need you to help me with: ${title}. Please provide a detailed, step-by-step response that covers best practices and common pitfalls.`);
      toast.success('Prompt generated!');
    } catch (error) {
      toast.error('Failed to generate prompt');
    } finally {
      setGenerating(false);
    }
  };

  if (initialLoading) {
    return <div className="max-w-3xl mx-auto mt-12 p-6 text-center">Loading...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {isEditing ? 'Edit Prompt' : 'Create New Prompt'}
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Share your best prompts with the community or save them for yourself.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <div>
          <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-300">Title</label>
          <div className="mt-2">
            <input
              type="text"
              id="title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., React Component Generator"
              className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 dark:bg-gray-800 dark:text-white dark:ring-gray-700"
            />
          </div>
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-300">Category</label>
          <div className="mt-2">
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 dark:bg-gray-800 dark:text-white dark:ring-gray-700"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="content" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-300">Prompt Content</label>
            <button
              type="button"
              onClick={handleGenerateAI}
              disabled={generating}
              className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 disabled:opacity-50"
            >
              <Wand2 className="h-3.5 w-3.5" />
              {generating ? 'Generating...' : 'Generate with AI'}
            </button>
          </div>
          <div className="mt-2">
            <textarea
              id="content"
              rows={8}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your prompt here..."
              className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 dark:bg-gray-800 dark:text-white dark:ring-gray-700 font-mono"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-300 hover:text-gray-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-blue-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50"
          >
            {loading ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Prompt'}
          </button>
        </div>
      </form>
    </div>
  );
}
