import TaskForm from './TaskForm';
import { format } from 'date-fns';

export default function ModalEditTask({ setEditingTask, task, users, projectName }) {

  const { projectId, createdAt } = task;
  const formattedDate = createdAt ? format(new Date(createdAt), 'MMMM d, yyyy') : 'Unknown date';
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Edit Task</h2>

          <p className="text-sm text-gray-500 mb-4">
            This task refers to project <strong>{projectName}</strong> and was created on <strong>{formattedDate}</strong>.
          </p>

          <TaskForm 
            task={task}
            projectId={projectId}
            users={users}
            closeEditModal={() => setEditingTask(null)}
          />

        <button
          onClick={() => setEditingTask(null)}
          className="mt-2 px-4 py-2 w-full bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
        >
          Close
        </button>
      </div>
    </div>
  )
}

