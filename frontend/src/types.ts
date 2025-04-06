export interface User {
  id: string;
  email: string;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Session {
  _id: string;
  userId: string;
  userAgent?: string;
  expiresAt: Date;
  createdAt: Date;
  isCurrent?: boolean;
}
