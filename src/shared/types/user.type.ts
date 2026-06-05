import type { UserRole } from './index.js';

export type User = {
  name: string;
  email: string;
  avatarPath?: string;
  userRole: UserRole;
};
