import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ErrorMessage } from '../../components/Status';
import { api } from '../../lib/api';
import { errorMessage } from '../../lib/format';

export default function LoginPage() {
  const navigate = useNavigate();
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    api
      .me()
      .then(() => {
        if (!cancelled) navigate('/admin', { replace: true });
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await api.login(loginId, password);
      navigate('/admin', { replace: true });
    } catch (caught) {
      setError(errorMessage(caught));
      setSubmitting(false);
    }
  }

  return (
    <main className="login">
      <form className="login-form" onSubmit={submit}>
        <h1>관리자 로그인</h1>
        <label className="field">
          <span>아이디</span>
          <input
            type="text"
            autoComplete="username"
            required
            value={loginId}
            onChange={(event) => setLoginId(event.target.value)}
          />
        </label>
        <label className="field">
          <span>비밀번호</span>
          <input
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        {error && <ErrorMessage message={error} />}
        <button className="button button-primary" type="submit" disabled={submitting}>
          {submitting ? '로그인 중' : '로그인'}
        </button>
        <Link className="back-link" to="/">
          사이트로 돌아가기
        </Link>
      </form>
    </main>
  );
}
