import { useState, useEffect } from 'react';
import { TaskListProps, Task } from '../../interfaces/task';
import { eventBus } from '../../lib/eventBus';

import ModalEditTask from './ModalEditTask';

const statusColor = {
  TODO: 'bg-gray-200 text-gray-700',
  IN_PROGRESS: 'bg-yellow-200 text-yellow-800',
  DONE: 'bg-green-200 text-green-800',
};

const TaskList: React.FC<TaskListProps> = ({ projectId, users, projectName }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const fetchTasks = async () => {
    try {
      const response = await fetch(`/api/tasks?projectId=${projectId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const data = await response.json();
      setTasks(data.tasks);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    const refresh = () => fetchTasks();
    eventBus.subscribe('taskCreated', refresh);
    eventBus.subscribe('taskDeleted', refresh);
    return () => {
      eventBus.unsubscribe('taskCreated', refresh);
    };
    
  }, [projectId]);

  const deleteTask = async (id: string) => {
    const res = await fetch(`/api/delete-task/${id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      eventBus.emit('taskDeleted'); // trigger refresh
    } else {
      alert('Failed to delete task.');
    }
  }


  if (loading) return <p>Loading tasks...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="space-y-6">
      {tasks.length === 0 ? (
        <p className="text-gray-500">No tasks found for this project.</p>
      ) : (
        <ul className="space-y-6">
          {tasks.map((task) => (
            <li key={task.id} className="border p-6 rounded-xl shadow-sm bg-white relative">
              <div className="flex justify-between items-start">

                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{task.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                </div>

                <div className="flex gap-1">
                  <button
                    onClick={() => setEditingTask(task)}
                    className="text-blue-600 text-sm border border-blue-600 px-2 py-1 rounded hover:bg-blue-50 transition"
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600 text-sm border border-red-600 px-2 py-1 rounded hover:bg-red-50 transition" 
                    onClick={async () => {
                      if (confirm(`Are you sure you want to delete task "${task.name}"?`)) {
                        deleteTask(task.id)
                      }
                    }}
                  >
                    Delete
                  </button>
                </div>

              </div>

              <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${statusColor[task.status]}`}
                >
                  {task.status.replace('_', ' ')}
                </span>

                <span className="text-sm text-gray-700">
                  Assigned to:{' '}
                  {task.assignedUser?.username ? (
                    <strong>{task.assignedUser?.username}</strong>
                  ) : (
                    <strong className="text-red-600">Unassigned</strong>
                  )}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}

      {editingTask && (
        <ModalEditTask 
          setEditingTask={setEditingTask}
          task={editingTask}
          users={users}
          projectName={projectName}
        />
      )}
    </div>
  );
};

export default TaskList;
