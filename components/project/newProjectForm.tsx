import { useState } from 'react';

export default function NewProjectForm({ handleAddProject, loading }) {
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');

  const createProject = () => {
    const result: boolean = handleAddProject({
      name: newProjectName,
      description: newProjectDescription
    });
    if (result) {
      setNewProjectName('');
      setNewProjectDescription('');
    }
  }
  return (
    <div className="mt-12 border-t pt-6">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Create a new project</h2>
      <input
        type="text"
        placeholder="Project name"
        value={newProjectName}
        onChange={(e) => setNewProjectName(e.target.value)}
        className="border border-gray-300 p-2 w-full rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <textarea
        placeholder="Description (optional)"
        value={newProjectDescription}
        onChange={(e) => setNewProjectDescription(e.target.value)}
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