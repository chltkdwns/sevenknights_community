export type Role = "USER" | "MEMBER" | "ADMIN";

export type BoardType = "FREE" | "GUIDE" | "NOTICE";

export interface User {
  id: number;
  username: string;
  email: string;
  nickname: string;
  role: Role;
}

export interface TokenResponse {
  accessToken: string;
  tokenType: string;
  user: User;
}

export interface PostSummary {
  id: number;
  title: string;
  boardType: BoardType;
  viewCount: number;
  authorNickname: string;
  createdAt: string;
  hidden?: boolean;
}

export interface PostDetail extends PostSummary {
  content: string;
  authorId: number;
  images: PostImage[];
  updatedAt: string;
}

export interface PostImage {
  id: number;
  url: string;
  originalFileName: string;
  sortOrder: number;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface ApiError {
  status: string | number;
  messages: string | string[] | Record<string, string[]>;
}

export interface JsonData<T> {
  status: string | number;
  data: T;
}
