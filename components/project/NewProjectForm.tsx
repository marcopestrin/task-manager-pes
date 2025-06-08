import { useState } from 'react';

export default function NewProjectForm({ handleAddProject, loading }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const createProject = () => {
    const result: boolean = handleAddProject({
      name,
      description
    });
    if (result) {
      setName('');
      setDescription('');
    }
  }
  return (
    <div className="mt-12 border-t pt-6">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Create a new project</h2>
      <input
        type="text"
        placeholder="Project name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border border-gray-300 p-2 w-full rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <textarea
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border border-gray-300 p-2 w-full rounded-md resize-none mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows={4}
      />
      <button
        onClick={createProject}
        disabled={loading}
        className="bg-blue-600 w-full text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Creating...' : 'Create project'}
      </button>
    </div>
  )
}

