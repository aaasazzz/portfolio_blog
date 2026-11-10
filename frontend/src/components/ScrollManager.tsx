import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollManager() {
  const { pathname, search, hash, key } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }
    const scroll = () => document.getElementById(hash.slice(1))?.scrollIntoView();
    scroll();
    // 새로고침으로 들어오면 데이터가 늦게 그려지면서 위치가 밀릴 수 있어 한 번 더 맞춘다.
    const timer = window.setTimeout(scroll, 400);
    return () => window.clearTimeout(timer);
  }, [pathname, search, hash, key]);

  return null;
}
