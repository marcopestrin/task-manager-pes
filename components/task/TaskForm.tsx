'use client';
import { useState } from 'react';
import { Status } from '../../interfaces/task';
import { eventBus } from '../../lib/eventBus';

export default function TaskForm({ 
  projectId, 
  users, 
  task = undefined, // default value because is not mandatory --> typescript fix
  closeEditModal = undefined // default value because is not mandatory --> typescript fix
}) {

  const [isAModify] = useState(task ? true : false);
  const [name, setName] = useState(task ? task.name : '');
  const [description, setDescription] = useState(task ? task.description : '');
  const [status, setStatus] = useState<Status>(task ? task.status : "TODO");
  const [assignedUserId, setAssignedUserId] = useState<string | undefined>(task ? task.assignedUserId : undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isAModify) {
        const res = await fetch(`/api/update-task/${task.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            description,
            status,
            assignedUserId: assignedUserId === "none" ? null : assignedUserId
          }),
        });
        if (!res.ok) throw new Error('Error creating task');
        closeEditModal(null);

      } else {
        const res = await fetch('/api/create-task', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            description,
            status,
            projectId,
            assignedUserId: assignedUserId || null,
          }),
        });
        if (!res.ok) throw new Error('Error creating task');
  
        setName('');
        setDescription('');
        setStatus('TODO');
        setAssignedUserId(undefined);
      }

    } catch (err: any) {
      setError(err.message || 'Unknown error');
    } finally {
      eventBus.emit('taskCreated'); // i need this for render the new list
      setLoading(false);
    }

  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded space-y-4"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          className="mt-1 w-full border rounded px-3 py-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          className="mt-1 w-full border rounded px-3 py-2"
          value={description}
          rows={4}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Status</label>
        <select
          className="mt-1 w-full border rounded px-3 py-2"
          value={status}
          onChange={(e) => setStatus(e.target.value as Status)}
        >
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Completed</option>
        </select>
      </div>


      <div>
        <label className="block text-sm font-medium text-gray-700">Assign to:</label>
        <select 
          className="mt-1 w-full border rounded px-3 py-2"
          value={assignedUserId || ''}
          onChange={(e) => setAssignedUserId(e.target.value || undefined)}
        >

        <option value={"none"} key={"none"}>Nobody</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.username}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 w-full   text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? 'Saving...' : 'Save task'}
      </button>
    </form>

  );
}

