"use client";
import { ImageKitProvider } from "@imagekit/next";
import { SessionProvider } from "next-auth/react";
import { NotificationProvider } from "./Notification";

const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT!;

export default function Providers({ 
  children,
  session 
}: { 
  children: React.ReactNode;
  session?: any;
}) {
  return (
    <SessionProvider 
      session={session} 
      refetchInterval={0} 
      refetchOnWindowFocus={true} 
      refetchWhenOffline={false} 
    >
      <ImageKitProvider urlEndpoint={urlEndpoint}>
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </ImageKitProvider>
    </SessionProvider>
  );
}
