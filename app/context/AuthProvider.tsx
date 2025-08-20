'use client';

import { SessionProvider } from 'next-auth/react';

export default function AuthProvider({
  children,
  session,
}: {
  children: React.ReactNode;
  session?: any;  
}) {
  return (
    <SessionProvider
      session={session}             
      refetchInterval={300}         
      refetchOnWindowFocus={true}    
    >
      {children}
    </SessionProvider>
  );
}
