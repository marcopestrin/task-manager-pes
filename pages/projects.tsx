import { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import jwt from 'jsonwebtoken';
import * as cookie from 'cookie';
import { PrismaClient } from '@prisma/client';
import { requireAuthentication } from '../lib/auth';
import ProjectList from '../components/project/projectList';
import NewProjectForm from '../components/project/newProjectForm';
import Project, { AddProjectInput } from '../interfaces/project';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'secret-key';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const auth = await requireAuthentication(context);
  if ('redirect' in auth) return auth;

  try {
    const decoded = jwt.verify(cookie.parse(context.req.headers.cookie).token, JWT_SECRET);

    let projects = await prisma.project.findMany({
      where: {
        OR: [ 
          { ownerId: decoded.userId },
          {
            users: {
              some: {
                userId: decoded.userId, //shared visibility
              },
            },
          },
        ],
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        description: true,
        projectCode: true,
        ownerId: true,
        tasks: {
          select: {
            name: true, // mi interessa sapere solo il nome del task
          },
        },
        users: {
          select: {
            user: {
              select: {
                id: true,
                username: true,
              },
            },
          },
        },
        owner: {
          select: {
            username: true,
          },
        },
      },
    })
    
    projects = projects.map(project => ({
      ...project,
      accessType: project.ownerId === decoded.userId ? 'owner' : 'participant',
    }));

    return { 
      props: {
        user: decoded,
        projects
      }
    };
  } catch (err) {
    return { 
      redirect: { 
        destination: '/login', 
        permanent: false 
      }
    };
  }
};

export default function Projects({ user, projects }: {
  user: { username: string };
  projects: Project[];
}) {
  const [projectList, setProjectList] = useState(projects || []);
  const [loading, setLoading] = useState(false);

  if (!user) return <p>Unauthorized access</p>;

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/logout', {
        method: 'POST',
      });

      if (res.ok) {
        // Logout success
        window.location.href = '/login';
      } else {
        alert('Error while logging out');
      }
    } catch (error) {
      alert('Network error while logging out');
      console.error(error);
    }
  };

  const handleAddProject = async ({ name, description }: AddProjectInput): Promise<boolean> => {
    if (!name.trim()) {
      alert('Enter a name for the project');
      return false;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/create-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description }),
      });

      if (res.ok) {
        const newProject = await res.json();
        // add the new project into the local state without having a get query.
        setProjectList([
          {
            ...newProject,
            accessType: 'owner' // it will always be owner since I'm creating it. I need it to show the label in the list
          },
          ...projectList
        ]);
        return true
      } else {
        alert('Error creating project');
        return false
      }
    } catch (error) {
      alert('Network error while logging out');
      console.error(error);
      return false
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg mb-10">

      <h1 className="text-3xl font-bold text-gray-800">Benvenuto, {user.username}!</h1>

      <ProjectList
        list={projectList}
      />

      <NewProjectForm 
        handleAddProject={handleAddProject}
        loading={loading}
      />

      <div className="mt-10">
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
