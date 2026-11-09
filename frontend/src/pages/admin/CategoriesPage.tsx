import { useState, type FormEvent } from 'react';
import ConfirmDialog from '../../components/ConfirmDialog';
import { Empty, ErrorMessage, Loading } from '../../components/Status';
import { api } from '../../lib/api';
import { errorMessage } from '../../lib/format';
import { useAsync } from '../../lib/useAsync';
import type { Category } from '../../types';

interface DeleteTarget {
  category: Category;
  count: number;
}

export default function CategoriesPage() {
  const { data, error, loading, reload } = useAsync(() => api.listCategories(), []);
  const [name, setName] = useState('');
  const [editing, setEditing] = useState<Category | null>(null);
  const [target, setTarget] = useState<DeleteTarget | null>(null);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState('');

  async function run(action: () => Promise<void>) {
    setBusy(true);
    setActionError('');
    try {
      await action();
    } catch (caught) {
      setActionError(errorMessage(caught));
    } finally {
      setBusy(false);
    }
  }

  function create(event: FormEvent) {
    event.preventDefault();
    run(async () => {
      await api.createCategory(name.trim());
      setName('');
      reload();
    });
  }

  function saveEdit(event: FormEvent) {
    event.preventDefault();
    if (!editing) return;
    run(async () => {
      await api.updateCategory(editing.id, editing.name.trim());
      setEditing(null);
      reload();
    });
  }

  function askDelete(category: Category) {
    run(async () => {
      const preview = await api.previewCategoryDeletion(category.id);
      setTarget({ category, count: preview.deletableArticleCount });
    });
  }

  function confirmDelete() {
    if (!target) return;
    run(async () => {
      try {
        await api.deleteCategory(target.category.id);
        reload();
      } finally {
        setTarget(null);
      }
    });
  }

  return (
    <section className="page container container-narrow">
      <h1 className="page-title">카테고리</h1>

      <form className="search" onSubmit={create}>
        <input
          type="text"
          aria-label="새 카테고리 이름"
          placeholder="새 카테고리 이름"
          required
          maxLength={50}
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <button className="button button-primary" type="submit" disabled={busy}>
          추가
        </button>
      </form>

      {actionError && <ErrorMessage message={actionError} />}
      {loading && !data && <Loading />}
      {error && <ErrorMessage message={error.message} onRetry={reload} />}
      {data?.length === 0 && <Empty>아직 카테고리가 없어요.</Empty>}
      {data && data.length > 0 && (
        <ul className="admin-list">
          {data.map((category) => (
            <li key={category.id}>
              {editing?.id === category.id ? (
                <form className="inline-edit" onSubmit={saveEdit}>
                  <input
                    type="text"
                    aria-label="카테고리 이름"
                    required
                    maxLength={50}
                    autoFocus
                    value={editing.name}
                    onChange={(event) => setEditing({ ...editing, name: event.target.value })}
                  />
                  <button className="button button-primary" type="submit" disabled={busy}>
                    저장
                  </button>
                  <button className="button" type="button" onClick={() => setEditing(null)}>
                    취소
                  </button>
                </form>
              ) : (
                <>
                  <span className="admin-list-main">{category.name}</span>
                  <div className="admin-list-actions">
                    <button className="button" type="button" onClick={() => setEditing(category)}>
                      이름 변경
                    </button>
                    <button
                      className="button button-danger"
                      type="button"
                      disabled={busy}
                      onClick={() => askDelete(category)}
                    >
                      삭제
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      {target && (
        <ConfirmDialog
          title={`"${target.category.name}" 카테고리를 삭제할까요?`}
          confirmLabel="삭제"
          busy={busy}
          onConfirm={confirmDelete}
          onCancel={() => setTarget(null)}
        >
          {target.count > 0 ? (
            <p>
              다른 카테고리가 없는 글 <strong>{target.count}개</strong>도 함께 삭제돼요. 되돌릴 수 없어요.
            </p>
          ) : (
            <p>함께 삭제되는 글은 없어요.</p>
          )}
        </ConfirmDialog>
      )}
    </section>
  );
}
