import type { UserRole } from './index.js';

export type User = {
  name: string;
  email: string;
  avatarPath?: string;
  password: string;
  userRole: UserRole;
};
