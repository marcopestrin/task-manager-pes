import { useState } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import * as cookie from 'cookie';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { requireAuthentication } from '../../lib/auth';
import EditProjectForm from '../../components/project/EditProject';
import ButtonBackProjectList from '../../components/common/ButtonBackProjectList';
import Footer from '../../components/footer/Footer';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'secret-key';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const auth = await requireAuthentication(context);
  if ('redirect' in auth) return auth;

  const { id } = context.params!;
  
  const token = cookie.parse(context.req.headers.cookie).token;
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    const project = await prisma.project.findUnique({
      where: { id: id as string },
      include: {
        users: {
          select: {
            userId: true,
            user: {
              select: {
                id: true,
                username: true,
              },
            },
          },
        },
      },
    });

    if (!project || project.ownerId !== decoded.userId) {
      return { redirect: { destination: '/projects', permanent: false } };
    }

    const usersList = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
      },
    });

    return {
      props: {
        project: {
          ...project,
          createdAt: project.createdAt.toISOString(),
          updatedAt: project.updatedAt.toISOString(),
        },
        usersList,
      },
    };
  } catch (err) {
    console.error(err);
    return { redirect: { destination: '/login', permanent: false } };
  }
};

export default function EditProjectPage({ project, usersList }: any) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);


  const handleSave = async ({ name, description, selectedUsers}) => {
    setSaving(true);

    const res = await fetch(`/api/update-project/${project.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        description,
        userIds: selectedUsers
      }),
    });

    if (res.ok) {
      alert('Progetto aggiornato');
      router.push('/projects');
    } else {
      alert('Errore durante il salvataggio');
    }

    setSaving(false);
  };



  return (
    <div>
      <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
        <ButtonBackProjectList />

        <h1 className="text-3xl font-bold text-gray-800 mb-6">Edit Project</h1>
        <EditProjectForm
          project={project}
          usersList={usersList}
          handleSave={handleSave}
          saving={saving}
        />
      </div>
      <Footer />
    </div>
  );
}
