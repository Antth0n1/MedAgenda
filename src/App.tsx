/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { User, RegisteredUser } from './types';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

const INITIAL_USERS: RegisteredUser[] = [
  { name: 'usuario01', password: '123456789', role: 'Recepcionista' }
];

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>(INITIAL_USERS);

  const handleRegisterUser = (newUser: RegisteredUser) => {
    setRegisteredUsers([...registeredUsers, newUser]);
  };

  const handleUpdateUser = (oldName: string, updatedUser: RegisteredUser) => {
    setRegisteredUsers(registeredUsers.map(u => u.name === oldName ? updatedUser : u));
    if (user && user.name === oldName) {
      setUser({ name: updatedUser.name, role: updatedUser.role });
    }
  };

  if (!user) {
    return <Login onLogin={setUser} registeredUsers={registeredUsers} />;
  }

  return (
    <Dashboard 
      user={user} 
      registeredUsers={registeredUsers}
      onLogout={() => setUser(null)} 
      onRegisterUser={handleRegisterUser} 
      onUpdateUser={handleUpdateUser}
    />
  );
}
