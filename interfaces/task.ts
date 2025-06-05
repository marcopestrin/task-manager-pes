export type Status = 'TODO' | 'IN_PROGRESS' | 'DONE';

interface User {
  id: string;
  username: string;
}

export interface CreateTaskFormProps {
  projectId: string;
  users: User[];
}

export interface Task {
  id: string;
  name: string;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  assignedUserId: string | null;
}

export interface TaskListProps {
  projectId: string;
  users: User[];
  projectName: string;
}
