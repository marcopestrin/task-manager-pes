export type Status = 'TODO' | 'IN_PROGRESS' | 'DONE';

interface User {
  id: string;
  username: string;
}


export interface Task {
  id: string;
  name: string;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  assignedUserId: string | null;
  assignedUser?: User | null | undefined;
}

export interface TaskListProps {
  projectId: string;
  users: User[];
  projectName: string;
}

export interface CreateTaskFormProps {
  projectId: string;
  users: User[];
}