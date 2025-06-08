import { useState } from 'react';
import { eventBus } from '../../lib/eventBus';

export default function AddExistingProject ({ userId }){
  const [projectCode, setProjectCode] = useState('');
  const [loading, setLoading] = useState(false);


  const addProject = async() => {
    setLoading(true);

    try {
      const res = await fetch('/api/add-project-by-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          code: projectCode,
          userId
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert('Project added successfully!');
        eventBus.emit('newUserInvolved');

      } else {
        alert(data.error || 'Something went wrong');
      }
      // forazre refresh page
    } catch (err) {
      alert('Network error');
    } finally {
      setLoading(false);
      setProjectCode('');
    }
  }

  return (
    <div className="mt-12 border-t pt-6">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Add existing project</h2>
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Project code"
          value={projectCode}
          disabled={loading}
          onChange={(e) => setProjectCode(e.target.value)}
          className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 flex-grow basis-[70%]"
          />
        <button
          onClick={addProject}
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50 basis-[30%]"
        >
          {loading ? 'Adding...' : 'Add'}
        </button>

      </div>
    </div>
  )
}