import { useEffect, useState, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Pagination from '../components/Pagination';
import { Empty, ErrorMessage, Loading } from '../components/Status';
import { api } from '../lib/api';
import { formatDate } from '../lib/format';
import { useAsync } from '../lib/useAsync';

const PAGE_SIZE = 10;

export default function BlogPage() {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') ?? '';
  const pageNumber = Number(params.get('page') ?? '1');
  const page = Number.isInteger(pageNumber) && pageNumber >= 1 ? pageNumber - 1 : 0;
  const selected = (params.get('category') ?? '')
    .split(',')
    .filter(Boolean)
    .map(Number)
    .filter(Number.isInteger);
  const selectedKey = selected.join(',');

  const [keyword, setKeyword] = useState(q);
  useEffect(() => setKeyword(q), [q]);

  const categories = useAsync(() => api.listCategories(), []);
  const articles = useAsync(
    () =>
      api.listArticles({
        articleType: 'GENERAL',
        q: q || undefined,
        categoryIds: selected,
        page,
        size: PAGE_SIZE,
      }),
    [q, selectedKey, page],
  );

  function update(next: { q?: string; category?: number[]; page?: number }) {
    const nextParams = new URLSearchParams();
    const nextQ = next.q ?? q;
    const nextCategory = next.category ?? selected;
    const nextPage = next.page ?? 0;
    if (nextQ) nextParams.set('q', nextQ);
    if (nextCategory.length) nextParams.set('category', nextCategory.join(','));
    if (nextPage > 0) nextParams.set('page', String(nextPage + 1));
    setParams(nextParams);
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    update({ q: keyword.trim() });
  }

  function toggleCategory(id: number) {
    update({
      category: selected.includes(id)
        ? selected.filter((value) => value !== id)
        : [...selected, id],
    });
  }

  return (
    <section className="page container">
      <h1 className="page-title">Blog</h1>

      <form className="search" role="search" onSubmit={submit}>
        <input
          type="search"
          aria-label="글 검색"
          placeholder="제목이나 내용으로 검색"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
        />
        <button className="button" type="submit">
          검색
        </button>
      </form>

      {categories.data && categories.data.length > 0 && (
        <div className="filter" aria-label="카테고리 필터">
          {categories.data.map((category) => (
            <button
              key={category.id}
              type="button"
              className="filter-chip"
              aria-pressed={selected.includes(category.id)}
              onClick={() => toggleCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
      )}

      {articles.loading && <Loading />}
      {articles.error && <ErrorMessage message={articles.error.message} onRetry={articles.reload} />}
      {articles.data && articles.data.articles.length === 0 && (
        <Empty>{q || selected.length ? '조건에 맞는 글이 없어요.' : '아직 작성된 글이 없어요.'}</Empty>
      )}
      {articles.data && articles.data.articles.length > 0 && (
        <>
          <ul className="post-list">
            {articles.data.articles.map((article) => (
              <li key={article.id}>
                <Link to={`/articles/${article.id}`}>
                  <div className="post-body">
                    <div className="post-heading">
                      <h2>{article.title}</h2>
                      <time dateTime={article.createTime}>{formatDate(article.createTime)}</time>
                    </div>
                    <p>{article.summary}</p>
                    <span className="project-categories">
                      {article.categories.map((category) => category.name).join(' · ')}
                    </span>
                  </div>
                  {article.thumbnailUrl && (
                    <img className="post-thumbnail" src={article.thumbnailUrl} alt="" loading="lazy" />
                  )}
                </Link>
              </li>
            ))}
          </ul>
          <Pagination
            page={articles.data.page}
            totalPages={articles.data.totalPages}
            onChange={(next) => update({ page: next })}
          />
        </>
      )}
    </section>
  );
}
