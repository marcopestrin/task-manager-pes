import { useRouter } from 'next/router';

export default function ButtonBackProjectList () {
  const router = useRouter();

  return (
    <div className="flex justify-between mb-6">
      <button
        onClick={() => router.push('/projects')}
        className="text-blue-600 hover:underline focus:outline-none"
      >
        ← Back to project list
      </button>
    </div>
  )
}