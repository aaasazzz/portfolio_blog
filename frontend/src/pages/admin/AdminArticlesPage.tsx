import { useState } from 'react';
import { Link } from 'react-router-dom';
import ConfirmDialog from '../../components/ConfirmDialog';
import Pagination from '../../components/Pagination';
import { Empty, ErrorMessage, Loading } from '../../components/Status';
import { api } from '../../lib/api';
import { errorMessage, formatDate } from '../../lib/format';
import { useAsync } from '../../lib/useAsync';
import type { ArticleSummary, ArticleType } from '../../types';

const TYPE_LABEL: Record<ArticleType, string> = { PROJECT: '프로젝트', GENERAL: '일반 글' };

export default function AdminArticlesPage() {
  const [page, setPage] = useState(0);
  const [type, setType] = useState<ArticleType | ''>('');
  const [target, setTarget] = useState<ArticleSummary | null>(null);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState('');

  const { data, error, loading, reload } = useAsync(
    () => api.listArticles({ page, size: 20, articleType: type || undefined }),
    [page, type],
  );

  async function remove() {
    if (!target) return;
    setBusy(true);
    setActionError('');
    try {
      await api.deleteArticle(target.id);
      setTarget(null);
      if (data && data.articles.length === 1 && page > 0) setPage(page - 1);
      else reload();
    } catch (caught) {
      setTarget(null);
      setActionError(errorMessage(caught));
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="page container">
      <div className="page-heading">
        <h1 className="page-title">글 관리</h1>
        <Link className="button button-primary" to="/admin/articles/new">
          새 글 쓰기
        </Link>
      </div>

      <label className="field field-inline">
        <span>종류</span>
        <select
          value={type}
          onChange={(event) => {
            setType(event.target.value as ArticleType | '');
            setPage(0);
          }}
        >
          <option value="">전체</option>
          <option value="PROJECT">프로젝트</option>
          <option value="GENERAL">일반 글</option>
        </select>
      </label>

      {actionError && <ErrorMessage message={actionError} />}
      {loading && <Loading />}
      {error && <ErrorMessage message={error.message} onRetry={reload} />}
      {data && data.articles.length === 0 && <Empty>아직 작성된 글이 없어요.</Empty>}
      {data && data.articles.length > 0 && (
        <>
          <ul className="admin-list">
            {data.articles.map((article) => (
              <li key={article.id}>
                <div className="admin-list-main">
                  <Link to={`/articles/${article.id}`}>{article.title}</Link>
                  <div className="admin-list-meta">
                    <span>{TYPE_LABEL[article.articleType]}</span>
                    <span>{formatDate(article.createTime)}</span>
                    {article.isPrivate && <span className="badge">비공개</span>}
                  </div>
                </div>
                <div className="admin-list-actions">
                  <Link className="button" to={`/admin/articles/${article.id}/edit`}>
                    수정
                  </Link>
                  <button className="button button-danger" type="button" onClick={() => setTarget(article)}>
                    삭제
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <Pagination page={data.page} totalPages={data.totalPages} onChange={setPage} />
        </>
      )}

      {target && (
        <ConfirmDialog
          title="글을 삭제할까요?"
          confirmLabel="삭제"
          busy={busy}
          onConfirm={remove}
          onCancel={() => setTarget(null)}
        >
          <p>"{target.title}" 글이 완전히 삭제돼요. 되돌릴 수 없어요.</p>
        </ConfirmDialog>
      )}
    </section>
  );
}
