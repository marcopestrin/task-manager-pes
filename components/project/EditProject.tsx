import { useState, useEffect } from 'react';

export default function EditProjectForm({
  project,
  usersList,
  handleSave,
  saving
}) {
    const [name, setName] = useState(project.name);
    const [description, setDescription] = useState(project.description || '');
    const [selectedUsers, setSelectedUsers] = useState<string[]>(
      project.users ? project.users.map((u: any) => u.userId) : []
    );
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredUsers, setFilteredUsers] = useState(usersList || []);

    useEffect(() => {
      if (!searchTerm) {
        setFilteredUsers(usersList);
        return;
      }
      const filtered = usersList.filter((user: any) => 
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }, [searchTerm, usersList]);


    const toggleUser = (userId: string) => {
      if (selectedUsers.includes(userId)) {
        setSelectedUsers(selectedUsers.filter(id => id !== userId));
      } else {
        setSelectedUsers([...selectedUsers, userId]);
      }
    };

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-800">
          <div>
            <p className="font-medium text-gray-600">Project Code</p>
            <p>{project.projectCode}</p>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            className="border border-gray-300 p-2 w-full rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Users</label>
          <input
            type="text"
            placeholder="Cerca utenti..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 p-2 mb-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-md p-2 bg-gray-50">
            {filteredUsers.length === 0 ? (
              <p className="text-sm text-gray-500">No user found</p>
            ) : (
              filteredUsers.map((user: any) => (
                <label key={user.id} className="flex items-center space-x-2 mb-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => toggleUser(user.id)}
                    className="accent-blue-600"
                  />
                  <span className="text-gray-800">{user.username}</span>
                </label>
              ))
            )}
          </div>
        </div>
        <div className="mt-12">
          <button
            onClick={() => handleSave({ name, description, selectedUsers }) }
            disabled={saving}
            className="w-full bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    )
}
