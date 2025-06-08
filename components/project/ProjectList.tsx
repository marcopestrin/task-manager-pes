import { useState, useEffect } from 'react';
import Link from 'next/link';
import Project from '../../interfaces/project';
import { accessTypeColor } from '../common/labelsColor';
import { eventBus } from '../../lib/eventBus';

interface ProjectListProps {
  list: Project[];
}

export default function ProjectList({ list }: ProjectListProps) {
  
  const [projects, setProjects] = useState<Project[]>(list || []);

  const deleteProject = async(id: string) => {
    const res = await fetch(`/api/delete-project/${id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      // local list without deleted item
      setProjects((prev) => prev.filter((project) => project.id !== id));
    } else {
      alert('Failed to delete project.');
    }
  }

  const fetchProjects = async () => {
    try {
      const response = await fetch(`/api/projects`);
      if (!response.ok) throw new Error('Failed to fetch projects');
      const data = await response.json();
      setProjects(data.projects);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    setProjects(list || []); // for refreshing list when i add new project
    const refresh = () => fetchProjects();
    eventBus.subscribe('newUserInvolved', refresh);
    return () => {
      eventBus.unsubscribe('newUserInvolved', refresh);
    };
  }, [list]);


  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your projects</h2>

      {projects.length === 0 ? (
        <p className="text-gray-500">No projects created.</p>
      ) : (
        <ul className="space-y-4">
          {projects.map((p) => (
            <li
              key={p.id}
              className="relative border border-gray-200 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white"
            >
              <span className={`absolute top-5 right-2 inline-block text-xs px-2 py-1 rounded-full font-medium ${accessTypeColor[p.accessType]}`}>
                {p.accessType === 'owner' ? 'Owner' : 'Participant'}
              </span>

              <div>
                <h3 className="text-lg font-bold text-blue-700">{p.name}</h3>
                <p className="text-sm text-gray-500 mb-1">
                  Code: <strong>{p.projectCode}</strong> created by <strong>{p.owner.username}</strong>
                </p>

                <div className="bg-gray-100 p-2 rounded text-sm text-gray-700 whitespace-pre-wrap">
                  {p.description || 'No description'}
                </div>

                {p.users && p.users.length > 0 && (
                  <p className="mt-2 text-sm text-gray-600">
                    <span className="font-medium">Users involved:</span>{' '}
                    {p.users.map((u) => u.user.username).join(', ')}
                  </p>
                )}
                {p.tasks && p.tasks.length > 0 && (
                  <p className="mt-2 text-sm text-gray-600">
                    <span className="font-medium">Tasks correlated:</span>{' '}
                    {p.tasks.map((u) => u.name).join(', ')}
                  </p>
                )}

                <div className="mt-4 flex gap-2">
                  { p.accessType === "owner" ?
                    <>
                      <Link
                        href={`/edit-project/${p.id}`}
                        className="bg-gray-200 text-gray-800 px-3 py-1.5 text-sm rounded hover:bg-gray-300 transition"
                      >
                        Edit Project
                      </Link>

                      <button
                        className="text-red-600 text-sm border border-red-600 px-3 py-1 rounded hover:bg-red-50 transition"
                        onClick={async () => {
                          if (confirm(`Are you sure you want to delete the project "${p.name}"?`)) {
                            deleteProject(p.id)
                          }
                        }}
                      >
                        Delete Project
                      </button>
                    </> : <></>
                  }

                  <Link
                    href={`/handle-tasks/${p.id}/`}
                    className="bg-gray-200 text-gray-800 px-3 py-1.5 text-sm rounded hover:bg-gray-300 transition"
                  >
                    Handle Tasks
                  </Link>

                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}


