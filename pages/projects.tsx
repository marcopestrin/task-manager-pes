import { useState } from 'react';
import { GetServerSideProps } from 'next';
import jwt from 'jsonwebtoken';
import * as cookie from 'cookie';
import { PrismaClient } from '@prisma/client';
import { requireAuthentication } from '../lib/auth';
import ProjectList from '../components/project/ProjectList';
import NewProjectForm from '../components/project/NewProjectForm';
import Project, { AddProjectInput } from '../interfaces/project';
import Footer from '../components/footer/Footer';
import AddExistingProject from '../components/project/AddExistingProject';
import { getLitProjectsByUserId } from './api/projects';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'secret-key';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const auth = await requireAuthentication(context);
  if ('redirect' in auth) return auth;

  try {
    const decoded = jwt.verify(cookie.parse(context.req.headers.cookie).token, JWT_SECRET);
    const { userId } = decoded;
    const projects = await getLitProjectsByUserId(userId);
    return { 
      props: {
        user: decoded,
        projects,
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
  user: { username: string, userId: string };
  projects: Project[];
}) {
  const [projectList, setProjectList] = useState(projects || []);
  const [loading, setLoading] = useState(false);

  if (!user) return <p>Unauthorized access</p>;
  const { username, userId } = user ;

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
          ...projectList,
          // last project added at the end of list
          {
            ...newProject,
            owner: { username },
            accessType: 'owner' // it will always be owner since I'm creating it. I need it to show the label in the list
          },
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
    <>
      <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg mb-10">

        <h1 className="text-3xl font-bold text-gray-800">Benvenuto, {user.username}!</h1>

        <ProjectList
          list={projectList}
        />

        <AddExistingProject 
          userId={userId}
        />

        <NewProjectForm 
          handleAddProject={handleAddProject}
          loading={loading}
        />

      </div>
      <Footer />
    </>
  
  );
}
