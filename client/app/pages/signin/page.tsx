"use client"

import { signIn } from 'next-auth/react';
import { useState } from 'react';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (res && res.error) {
      alert(res.error);
    } else {
      window.location.href = '/';
    }
  };

  return (
    <div>
     
      <div className="bg-red-900 flex flex-col items-center justify-center min-h-screen">
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4 w-1/2">
         
           <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
          <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
         
         
          <button className="btn">Kayıt Ol</button>
        </form>
      </div>
    </div>
    
  );
}
