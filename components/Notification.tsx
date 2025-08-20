"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from "lucide-react";

type NotificationType = "success" | "error" | "warning" | "info";

interface Notification {
  id: number;
  message: string;
  type: NotificationType;
}

interface NotificationContextType {
  showNotification: (message: string, type: NotificationType) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = (message: string, type: NotificationType) => {
    const id = Date.now();
    const newNotification = { id, message, type };
    
    setNotifications(prev => [...prev, newNotification]);
    
    setTimeout(() => {
      setNotifications(prev => prev.filter(notification => notification.id !== id));
    }, 5000);
  };

  const removeNotification = (id: number) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-400" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case "info":
        return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  const getStyles = (type: NotificationType) => {
    switch (type) {
      case "success":
        return "bg-green-900/20 border-green-800 text-green-400";
      case "error":
        return "bg-red-900/20 border-red-800 text-red-400";
      case "warning":
        return "bg-yellow-900/20 border-yellow-800 text-yellow-400";
      case "info":
        return "bg-blue-900/20 border-blue-800 text-blue-400";
    }
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      
   
      <div className="fixed bottom-6 right-6 z-[200] space-y-3">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`
              ${getStyles(notification.type)}
              backdrop-blur-sm border rounded-lg p-4 min-w-80 max-w-sm shadow-2xl
              animate-in slide-in-from-right duration-300
            `}
          >
            <div className="flex items-start gap-3">
              {getIcon(notification.type)}
              <p className="flex-1 font-medium">{notification.message}</p>
              <button
                onClick={() => removeNotification(notification.id)}
                className="text-gray-400 hover:text-white transition-colors duration-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
}
