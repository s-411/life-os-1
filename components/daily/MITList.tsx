'use client';

import { useState, useTransition } from 'react';
import type { MIT } from '@/types';
import { addMIT as addMITAction, toggleMIT as toggleMITAction, deleteMIT as deleteMITAction } from '@/app/(app)/daily/actions';

interface MITListProps {
  initialMITs: MIT[];
  currentDate: string;
  userId: string;
}

export default function MITList({ initialMITs, currentDate, userId }: MITListProps) {
  const [mits, setMITs] = useState<MIT[]>(initialMITs);
  const [newMITTitle, setNewMITTitle] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleAddMIT = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMITTitle.trim() || mits.length >= 3 || isPending) return;

    const title = newMITTitle.trim();
    setNewMITTitle(''); // Clear input immediately for better UX

    startTransition(async () => {
      const result = await addMITAction(currentDate, title);

      if (result.error) {
        console.error('Error adding MIT:', result.error);
        setNewMITTitle(title); // Restore input on error
        // TODO: Add toast notification
      } else if (result.data) {
        // Optimistically add the MIT to the list
        setMITs((prev) => [...prev, result.data]);
      }
    });
  };

  const handleToggleMIT = async (mit: MIT) => {
    const newCompleted = !mit.completed;

    // Optimistic update
    setMITs(mits.map((m) =>
      m.id === mit.id
        ? { ...m, completed: newCompleted, completed_at: newCompleted ? new Date().toISOString() : null }
        : m
    ));

    startTransition(async () => {
      const result = await toggleMITAction(mit.id, newCompleted);

      if (result.error) {
        console.error('Error toggling MIT:', result.error);
        // Revert optimistic update
        setMITs(mits);
        // TODO: Add toast notification
      }
    });
  };

  const handleDeleteMIT = async (mitId: string) => {
    // Optimistic update
    const previousMITs = [...mits];
    setMITs(mits.filter((m) => m.id !== mitId));

    startTransition(async () => {
      const result = await deleteMITAction(mitId);

      if (result.error) {
        console.error('Error deleting MIT:', result.error);
        // Revert optimistic update
        setMITs(previousMITs);
        // TODO: Add toast notification
      }
    });
  };

  return (
    <div className="card-mm p-6">
      <h2 className="font-national2 text-2xl font-bold mb-6">Today&apos;s MITs</h2>

      {/* MIT List */}
      <div className="space-y-3 mb-6">
        {mits.length === 0 ? (
          <p className="text-gray-400 text-center py-4">
            Add your first MIT to focus on what matters most today.
          </p>
        ) : (
          mits.map((mit) => (
            <div
              key={mit.id}
              className="flex items-center gap-3 p-3 rounded bg-gray-800/50 hover:bg-gray-800 transition-colors"
            >
              <input
                type="checkbox"
                checked={mit.completed || false}
                onChange={() => handleToggleMIT(mit)}
                className="w-5 h-5 rounded border-gray-600 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
              />
              <span
                className={`flex-1 ${
                  mit.completed
                    ? 'line-through opacity-60 text-gray-500'
                    : 'text-gray-200'
                }`}
              >
                {mit.title}
              </span>
              <button
                onClick={() => handleDeleteMIT(mit.id)}
                className="text-gray-500 hover:text-red-500 transition-colors text-xl leading-none"
                aria-label="Delete MIT"
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>

      {/* Add MIT Form */}
      <form onSubmit={handleAddMIT} className="flex gap-2">
        <input
          type="text"
          value={newMITTitle}
          onChange={(e) => setNewMITTitle(e.target.value)}
          placeholder="What's most important today?"
          disabled={isPending || mits.length >= 3}
          className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <button
          type="submit"
          disabled={!newMITTitle.trim() || mits.length >= 3 || isPending}
          className="px-6 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isPending ? 'Adding...' : 'Add MIT'}
        </button>
      </form>

      {mits.length >= 3 && (
        <p className="text-sm text-gray-500 mt-2">
          You&apos;ve reached the maximum of 3 MITs for today.
        </p>
      )}
    </div>
  );
}
