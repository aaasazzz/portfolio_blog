export type ArticleType = 'PROJECT' | 'GENERAL';

export interface Category {
  id: number;
  name: string;
}

export interface ArticleSummary {
  id: number;
  title: string;
  summary: string;
  thumbnailUrl: string | null;
  articleType: ArticleType;
  isPrivate: boolean;
  categories: Category[];
  createTime: string;
  modifyTime: string;
}

export interface Article extends ArticleSummary {
  content: string;
}

export interface ArticlePage {
  articles: ArticleSummary[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface ArticleInput {
  title: string;
  summary: string;
  thumbnailUrl: string | null;
  content: string;
  articleType: ArticleType;
  isPrivate: boolean;
  categoryIds: number[];
}

export interface ArticleQuery {
  page?: number;
  size?: number;
  articleType?: ArticleType;
  q?: string;
  categoryIds?: number[];
}
