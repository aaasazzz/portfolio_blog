import { Link, useParams } from 'react-router-dom';
import Markdown from '../components/Markdown';
import { ErrorMessage, Loading } from '../components/Status';
import { api } from '../lib/api';
import { formatDate } from '../lib/format';
import { useAsync } from '../lib/useAsync';

export default function ArticleDetailPage() {
  const { id = '' } = useParams();
  const { data, error, loading, reload } = useAsync(() => api.getArticle(id), [id]);

  if (loading) {
    return (
      <section className="page container container-narrow">
        <Loading />
      </section>
    );
  }

  if (error || !data) {
    const notFound = error?.status === 404 || error?.status === 400;
    return (
      <section className="page container container-narrow">
        <ErrorMessage
          message={notFound ? '글을 찾을 수 없어요.' : (error?.message ?? '글을 불러오지 못했어요.')}
          onRetry={notFound ? undefined : reload}
        />
        <Link className="back-link" to="/blog">
          Blog로 돌아가기
        </Link>
      </section>
    );
  }

  const isProject = data.articleType === 'PROJECT';

  return (
    <article className="page container container-narrow">
      <Link className="back-link" to={isProject ? '/#project' : '/blog'}>
        {isProject ? 'Project로 돌아가기' : 'Blog로 돌아가기'}
      </Link>
      <h1 className="article-title">{data.title}</h1>
      <div className="article-meta">
        <time dateTime={data.createTime}>{formatDate(data.createTime)}</time>
        {data.isPrivate && <span className="badge">비공개</span>}
        {data.categories.map((category) => (
          <span className="tag" key={category.id}>
            {category.name}
          </span>
        ))}
      </div>
      <Markdown>{data.content}</Markdown>
    </article>
  );
}
