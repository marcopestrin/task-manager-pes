import { useRouter } from 'next/router';

export default function ButtonBackProjectList () {
  const router = useRouter();

  return (
    <div className="flex justify-between mt-12">
      <button
        onClick={() => router.push('/area-privata')}
        className="bg-gray-200 w-full text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
      >
        ← Back to project list
      </button>
    </div>
  )
}