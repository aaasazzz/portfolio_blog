import type { ReactNode } from 'react';

export function Loading() {
  return <p className="status">불러오는 중이에요.</p>;
}

export function ErrorMessage({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="status status-error" role="alert">
      <p>{message}</p>
      {onRetry && (
        <button className="button" type="button" onClick={onRetry}>
          다시 시도
        </button>
      )}
    </div>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <p className="status">{children}</p>;
}
