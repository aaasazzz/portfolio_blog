import { Link } from 'react-router-dom';
import { Empty, ErrorMessage, Loading } from '../components/Status';
import { careers, profile, techStack } from '../data/profile';
import { api } from '../lib/api';
import { useAsync } from '../lib/useAsync';

export default function HomePage() {
  return (
    <>
      <section className="hero container">
        <div className="accent-bar" />
        <h1>
          안녕하세요,
          <br />
          <em>{profile.headline}</em>입니다
        </h1>
        <p className="hero-tagline">{profile.tagline}</p>
        <Link className="button button-primary" to="/#project">
          프로젝트 보기
        </Link>
      </section>

      <section className="section container" id="tech-stack">
        <h2>Tech stack</h2>
        <dl className="tech-list">
          {techStack.map((row) => (
            <div key={row.group}>
              <dt>{row.group}</dt>
              <dd>
                {row.items.map((item) => (
                  <span className="tag" key={item}>
                    {item}
                  </span>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="section container" id="career">
        <h2>Career</h2>
        <ol className="career-list">
          {careers.map((career) => (
            <li key={`${career.period}-${career.title}`}>
              <span className="career-period">{career.period}</span>
              <div>
                <h3>{career.title}</h3>
                <p className="career-role">{career.role}</p>
                <p>{career.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="section container" id="project">
        <h2>Project</h2>
        <Projects />
      </section>
    </>
  );
}

function Projects() {
  const { data, error, loading, reload } = useAsync(
    () => api.listArticles({ articleType: 'PROJECT', size: 50 }),
    [],
  );

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error.message} onRetry={reload} />;
  if (!data || data.articles.length === 0) return <Empty>아직 등록된 프로젝트가 없어요.</Empty>;

  return (
    <div className="project-grid">
      {data.articles.map((project) => (
        <Link className="project-card" key={project.id} to={`/articles/${project.id}`}>
          {project.thumbnailUrl && (
            <img className="project-thumbnail" src={project.thumbnailUrl} alt="" loading="lazy" />
          )}
          <h3>{project.title}</h3>
          <p>{project.summary}</p>
          <span className="project-categories">
            {project.categories.map((category) => category.name).join(' · ')}
          </span>
        </Link>
      ))}
    </div>
  );
}
