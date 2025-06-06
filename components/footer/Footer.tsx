
export default function Footer() {

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

  return (
    <div className="mt-10 text-center text-sm text-gray-500 mb-10">
      <p>
        Developed by <strong>Marco Pestrin</strong> on June 2025 in Tokyo — {' '}
        <span
          onClick={handleLogout}
          className="text-red-600 hover:underline cursor-pointer"
        >
          Logout
        </span>
      </p>
    </div>
  )
}