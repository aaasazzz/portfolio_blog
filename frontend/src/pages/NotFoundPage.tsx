import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <section className="page container">
      <h1 className="page-title">페이지를 찾을 수 없어요</h1>
      <Link className="back-link" to="/">
        메인으로 돌아가기
      </Link>
    </section>
  );
}
