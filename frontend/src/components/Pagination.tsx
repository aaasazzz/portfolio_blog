interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav className="pagination" aria-label="페이지 이동">
      <button type="button" disabled={page === 0} onClick={() => onChange(page - 1)}>
        이전
      </button>
      {Array.from({ length: totalPages }, (_, index) => (
        <button
          key={index}
          type="button"
          aria-current={index === page ? 'page' : undefined}
          onClick={() => onChange(index)}
        >
          {index + 1}
        </button>
      ))}
      <button type="button" disabled={page === totalPages - 1} onClick={() => onChange(page + 1)}>
        다음
      </button>
    </nav>
  );
}
