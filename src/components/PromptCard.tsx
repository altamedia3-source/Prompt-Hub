import React from 'react';
import { Copy, Check, Edit, Trash2 } from 'lucide-react';
import { Prompt } from '../lib/api';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

interface PromptCardProps {
  prompt: Prompt;
  isOwner?: boolean;
  onDelete?: (id: string) => void;
}

export function PromptCard({ prompt, isOwner, onDelete }: PromptCardProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt.content);
    setCopied(true);
    toast.success('Prompt copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
      <div>
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1">
            {prompt.title}
          </h3>
          <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-900/30 dark:text-blue-400 dark:ring-blue-400/20 whitespace-nowrap">
            {prompt.category}
          </span>
        </div>
        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 line-clamp-3 font-mono bg-gray-50 dark:bg-gray-800/50 p-3 rounded-md border border-gray-100 dark:border-gray-800">
          {prompt.content}
        </p>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-800">
        <div className="flex items-center gap-2">
          {isOwner && (
            <>
              <Link
                to={`/edit/${prompt.id}`}
                className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/30"
                title="Edit prompt"
              >
                <Edit className="h-4 w-4" />
              </Link>
              <button
                onClick={() => onDelete?.(prompt.id)}
                className="p-1.5 text-gray-400 hover:text-red-600 transition-colors rounded-md hover:bg-red-50 dark:hover:bg-red-900/30"
                title="Delete prompt"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 px-3 py-1.5 rounded-md"
        >
          {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </div>
  );
}
