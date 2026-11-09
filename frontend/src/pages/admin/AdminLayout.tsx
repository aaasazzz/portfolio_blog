import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { ErrorMessage, Loading } from '../../components/Status';
import { api, ApiError, setUnauthorizedHandler } from '../../lib/api';

export default function AdminLayout() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const goToLogin = () => navigate('/admin/login', { replace: true });
    let cancelled = false;
    setUnauthorizedHandler(goToLogin);
    api
      .me()
      .then(() => {
        if (!cancelled) setReady(true);
      })
      .catch((caught: ApiError) => {
        if (cancelled) return;
        if (caught.status === 401) goToLogin();
        else setError(caught.message);
      });
    return () => {
      cancelled = true;
      setUnauthorizedHandler(null);
    };
  }, [navigate]);

  async function logout() {
    try {
      await api.logout();
    } finally {
      navigate('/admin/login', { replace: true });
    }
  }

  if (error) {
    return (
      <main className="page container">
        <ErrorMessage message={error} />
      </main>
    );
  }
  if (!ready) {
    return (
      <main className="page container">
        <Loading />
      </main>
    );
  }

  return (
    <>
      <header className="site-header">
        <div className="container site-header-inner">
          <Link className="site-name" to="/admin">
            관리자
          </Link>
          <nav className="site-nav" aria-label="관리자 메뉴">
            <NavLink to="/admin" end>
              글 관리
            </NavLink>
            <NavLink to="/admin/categories">카테고리</NavLink>
            <Link to="/">사이트 보기</Link>
            <button className="link-button" type="button" onClick={logout}>
              로그아웃
            </button>
          </nav>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}
