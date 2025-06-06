import { PrismaClient } from '@prisma/client';
import { GetServerSideProps } from 'next';
import jwt from 'jsonwebtoken';
import ButtonBackProjectList from '../../components/common/buttonBackProjectList';
import TaskForm from '../../components/task/TaskForm';
import TaskList from '../../components/task/TaskList';
import * as cookie from 'cookie';
import { accessTypeColor } from '../../components/common/labelsColor';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'secret-key';


const getUserIdByToken = (v) => {
  return jwt.verify(cookie.parse(v).token, JWT_SECRET).userId;
}

export const getServerSideProps: GetServerSideProps = async (context) => {

  const decodedUserId = getUserIdByToken(context.req.headers.cookie);
  const projectId = context.params?.id as string;

  if (!projectId) {
    return {
      notFound: true,
    };
  }
    const projectUsers = await prisma.projectUser.findMany({
      where: {
        projectId,
      },
      include: {
        user: {
          include: {
            account: true, // Include all informations of account (like username)
          },
        },
      },
    });

  const users = projectUsers.map((pu) => ({
    id: pu.user.id,
    username: pu.user.username
  }));

  const projectName = await prisma.project.findUnique({
    where: { id: projectId },
    select: { 
      name: true,
      ownerId: true,
      users: {
        where: { userId: decodedUserId },
        select: { userId: true },
      },
    },
  });

  return {
    props: {
      projectId,
      users,
      projectName: projectName.name,
      accessType: decodedUserId === projectName.ownerId ? 'owner' : 'participant'
    },
  };
};

export default function TaskPage({ users, projectId, projectName, accessType }){

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">

      <ButtonBackProjectList />

      <div className="flex items-center gap-2 text-sm text-gray-600 mb-5">
        <span className="font-medium">Project:</span>
        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
          {projectName}
        </span>
        <span className={`top-5 right-2 inline-block text-xs px-2 py-1 rounded-full font-medium ${accessTypeColor[accessType]}`}>
          {accessType === 'owner' ? 'Owner' : 'Participant'}
        </span> 
      </div>

      <div className="border-t pt-8 mt-8">
        <h2 className="text-2xl font-bold text-gray-800">Tasks List</h2>
        <TaskList 
          projectId={projectId}
          users={users}
          projectName={projectName}
        />
      </div>
      
      <div className="border-t pt-8 mt-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Create New Task</h2>
        <TaskForm 
          projectId={projectId}
          users={users}
        />
      </div>

    </div>
  );
}
