export enum Role {
  USER = 'USER',
  SUPPORT = 'SUPPORT',
  ADMIN = 'ADMIN'
}

export enum TicketStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED'
}

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
  fullName: string;
}

export interface Ticket {
  id: number;
  title: string;
  description: string;
  status: TicketStatus;
  priority: Priority;
  createdBy: User;
  assignedTo?: User;
  createdAt: string;
  updatedAt?: string;
  commentCount: number;
}

export interface TicketRequest {
  title: string;
  description: string;
  priority: Priority;
  assignedToId?: number;
}

export interface Comment {
  id: number;
  content: string;
  user: User;
  createdAt: string;
}

export interface CommentRequest {
  content: string;
}
