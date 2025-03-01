import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    name: string;
    profile?: {
      avatar?: string;
      title?: string;
      department?: string;
      phone?: string;
      address?: string;
      bio?: string;
    };
    settings?: {
      theme?: 'light' | 'dark' | 'system';
      language?: 'tr' | 'en';
      notifications?: boolean;
      emailAlerts?: boolean;
    };
  }

  interface Session {
    user: User;
  }
}