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

  if (!user) {
    return <Login onLogin={setUser} registeredUsers={registeredUsers} />;
  }

  return <Dashboard user={user} onLogout={() => setUser(null)} onRegisterUser={handleRegisterUser} />;
}
