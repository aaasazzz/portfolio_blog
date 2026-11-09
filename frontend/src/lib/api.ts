import type { Article, ArticleInput, ArticlePage, ArticleQuery, Category } from '../types';

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
  ) {
    super(message);
  }
}

let onUnauthorized: (() => void) | null = null;

export function setUnauthorizedHandler(handler: (() => void) | null) {
  onUnauthorized = handler;
}

async function request<T>(path: string, method = 'GET', body?: unknown): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`/api${path}`, {
      method,
      headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError(0, 'NETWORK_ERROR', '서버에 연결할 수 없어요.');
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();
  let data: unknown = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }

  if (!response.ok) {
    if (response.status === 401 && !path.startsWith('/auth/')) {
      onUnauthorized?.();
    }
    const error = (data ?? {}) as { code?: string; message?: string };
    throw new ApiError(
      response.status,
      error.code ?? 'UNKNOWN_ERROR',
      error.message ?? (response.status >= 502 ? '서버에 연결할 수 없어요.' : '요청을 처리하지 못했어요.'),
    );
  }
  return data as T;
}

function toQueryString(query: ArticleQuery) {
  const params = new URLSearchParams();
  if (query.page !== undefined) params.set('page', String(query.page));
  if (query.size !== undefined) params.set('size', String(query.size));
  if (query.articleType) params.set('articleType', query.articleType);
  if (query.q) params.set('q', query.q);
  if (query.categoryIds?.length) params.set('categoryIds', query.categoryIds.join(','));
  const text = params.toString();
  return text ? `?${text}` : '';
}

export const api = {
  listArticles: (query: ArticleQuery) => request<ArticlePage>(`/articles${toQueryString(query)}`),
  getArticle: (id: number | string) => request<Article>(`/articles/${id}`),
  createArticle: (input: ArticleInput) => request<Article>('/articles', 'POST', input),
  updateArticle: (id: number | string, input: ArticleInput) =>
    request<Article>(`/articles/${id}`, 'PUT', input),
  deleteArticle: (id: number) => request<void>(`/articles/${id}`, 'DELETE'),

  listCategories: () => request<Category[]>('/categories'),
  createCategory: (name: string) => request<Category>('/categories', 'POST', { name }),
  updateCategory: (id: number, name: string) =>
    request<Category>(`/categories/${id}`, 'PUT', { name }),
  deleteCategory: (id: number) => request<void>(`/categories/${id}`, 'DELETE'),
  previewCategoryDeletion: (id: number) =>
    request<{ deletableArticleCount: number }>(`/categories/${id}/deletion-preview`),

  login: (loginId: string, password: string) =>
    request<{ loginId: string }>('/auth/login', 'POST', { loginId, password }),
  logout: () => request<void>('/auth/logout', 'POST'),
  me: () => request<{ loginId: string }>('/auth/me'),
};
