interface UserSummary {
  id: string;
  username: string;
}
  
interface ProjectUser {
  user: UserSummary;
} 

interface ProjectTask {
  name: string;
}

export default interface Project {
  id: string;
  name: string;
  projectCode: string;
  description?: string | null;
  users?: ProjectUser[];
  tasks?: ProjectTask[];
  accessType: 'owner' | 'participant'
  owner: {
    username: string;
  };
}


export interface AddProjectInput {
  name: string;
  description: string;
}