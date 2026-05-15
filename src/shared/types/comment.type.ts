import type { User } from './index.js';

export type Comment = {
  text: string;
  postDate: Date;
  rating: number;
  author: User;
};

