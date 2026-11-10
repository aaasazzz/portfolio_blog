import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type ClipboardEvent,
  type FormEvent,
  type KeyboardEvent,
} from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Markdown from '../../components/Markdown';
import { ErrorMessage, Loading } from '../../components/Status';
import { api } from '../../lib/api';
import { errorMessage } from '../../lib/format';
import { IMAGE_ACCEPT, imageAlt, uploadImage } from '../../lib/images';
import { SKELETONS } from '../../lib/skeletons';
import { useAsync } from '../../lib/useAsync';
import type { ArticleInput, ArticleType } from '../../types';

const EMPTY_FORM: ArticleInput = {
  title: '',
  summary: '',
  thumbnailUrl: null,
  content: SKELETONS.GENERAL,
  articleType: 'GENERAL',
  isPrivate: false,
  categoryIds: [],
};

export default function ArticleFormPage() {
  const { id } = useParams();
  const isEdit = id !== undefined;
  const navigate = useNavigate();

  const [form, setForm] = useState<ArticleInput>(EMPTY_FORM);
  const [ready, setReady] = useState(!isEdit);
  const [loadError, setLoadError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const [addingCategory, setAddingCategory] = useState(false);
  const [bodyUploading, setBodyUploading] = useState(false);
  const [thumbnailUploading, setThumbnailUploading] = useState(false);
  const [bodyImageError, setBodyImageError] = useState('');
  const [thumbnailError, setThumbnailError] = useState('');
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const bodyFileRef = useRef<HTMLInputElement>(null);
  const thumbnailFileRef = useRef<HTMLInputElement>(null);

  const categories = useAsync(() => api.listCategories(), []);

  useEffect(() => {
    if (!isEdit) return;
    let cancelled = false;
    api
      .getArticle(id)
      .then((article) => {
        if (cancelled) return;
        setForm({
          title: article.title,
          summary: article.summary,
          thumbnailUrl: article.thumbnailUrl,
          content: article.content,
          articleType: article.articleType,
          isPrivate: article.isPrivate,
          categoryIds: article.categories.map((category) => category.id),
        });
        setReady(true);
      })
      .catch((caught) => {
        if (!cancelled) setLoadError(errorMessage(caught));
      });
    return () => {
      cancelled = true;
    };
  }, [id, isEdit]);

  function changeType(articleType: ArticleType) {
    setForm((current) => ({
      ...current,
      articleType,
      content:
        !isEdit && current.content === SKELETONS[current.articleType]
          ? SKELETONS[articleType]
          : current.content,
    }));
  }

  function toggleCategory(categoryId: number) {
    setForm((current) => ({
      ...current,
      categoryIds: current.categoryIds.includes(categoryId)
        ? current.categoryIds.filter((value) => value !== categoryId)
        : [...current.categoryIds, categoryId],
    }));
  }

  async function addCategory() {
    const name = newCategory.trim();
    if (!name || addingCategory) return;
    setCategoryError('');
    setAddingCategory(true);
    try {
      const created = await api.createCategory(name);
      setNewCategory('');
      setForm((current) => ({ ...current, categoryIds: [...current.categoryIds, created.id] }));
      categories.reload();
    } catch (caught) {
      setCategoryError(errorMessage(caught));
    } finally {
      setAddingCategory(false);
    }
  }

  function handleCategoryKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    if (!event.nativeEvent.isComposing) addCategory();
  }

  async function insertBodyImages(files: File[]) {
    if (files.length === 0 || bodyUploading) return;
    const textarea = contentRef.current;
    const start = textarea?.selectionStart ?? form.content.length;
    const end = textarea?.selectionEnd ?? start;
    setBodyImageError('');
    setBodyUploading(true);
    try {
      const lines: string[] = [];
      for (const file of files) {
        lines.push(`![${imageAlt(file.name)}](${await uploadImage(file)})`);
      }
      setForm((current) => {
        const before = current.content.slice(0, start);
        const after = current.content.slice(end);
        const prefix = before && !before.endsWith('\n') ? '\n' : '';
        const suffix = after.startsWith('\n') ? '' : '\n';
        return { ...current, content: before + prefix + lines.join('\n') + suffix + after };
      });
    } catch (caught) {
      setBodyImageError(errorMessage(caught));
    } finally {
      setBodyUploading(false);
    }
  }

  function handleBodyFiles(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = '';
    insertBodyImages(files);
  }

  function handlePaste(event: ClipboardEvent<HTMLTextAreaElement>) {
    const files = Array.from(event.clipboardData.files).filter((file) => file.type.startsWith('image/'));
    if (files.length === 0) return;
    event.preventDefault();
    insertBodyImages(files);
  }

  async function handleThumbnailFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setThumbnailError('');
    setThumbnailUploading(true);
    try {
      const url = await uploadImage(file);
      setForm((current) => ({ ...current, thumbnailUrl: url }));
    } catch (caught) {
      setThumbnailError(errorMessage(caught));
    } finally {
      setThumbnailUploading(false);
    }
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (form.categoryIds.length === 0) {
      setSubmitError('카테고리를 1개 이상 선택해 주세요.');
      return;
    }
    setSubmitError('');
    setSubmitting(true);
    try {
      if (isEdit) await api.updateArticle(id, form);
      else await api.createArticle(form);
      navigate('/admin');
    } catch (caught) {
      setSubmitError(errorMessage(caught));
      setSubmitting(false);
    }
  }

  if (loadError) {
    return (
      <section className="page container">
        <ErrorMessage message={loadError} />
      </section>
    );
  }
  if (!ready) {
    return (
      <section className="page container">
        <Loading />
      </section>
    );
  }

  return (
    <section className="page container container-wide">
      <h1 className="page-title">{isEdit ? '글 수정' : '새 글 쓰기'}</h1>
      <form className="article-form" onSubmit={submit}>
        <label className="field">
          <span>제목</span>
          <input
            type="text"
            required
            maxLength={100}
            value={form.title}
            onChange={(event) => setForm({ ...form, title: event.target.value })}
          />
        </label>
        <label className="field">
          <span>요약 ({form.summary.length}/200)</span>
          <input
            type="text"
            required
            maxLength={200}
            placeholder="카드와 목록에 표시되는 한두 줄 소개"
            value={form.summary}
            onChange={(event) => setForm({ ...form, summary: event.target.value })}
          />
        </label>

        <div className="field">
          <span>썸네일 (선택)</span>
          {form.thumbnailUrl && (
            <img className="thumbnail-preview" src={form.thumbnailUrl} alt="썸네일 미리보기" />
          )}
          <div className="image-actions">
            <button
              className="button"
              type="button"
              disabled={thumbnailUploading}
              onClick={() => thumbnailFileRef.current?.click()}
            >
              {thumbnailUploading ? '올리는 중' : form.thumbnailUrl ? '다른 이미지로 변경' : '이미지 선택'}
            </button>
            {form.thumbnailUrl && (
              <button
                className="button button-danger"
                type="button"
                onClick={() => setForm({ ...form, thumbnailUrl: null })}
              >
                썸네일 제거
              </button>
            )}
          </div>
          <input ref={thumbnailFileRef} type="file" accept={IMAGE_ACCEPT} hidden onChange={handleThumbnailFile} />
          {thumbnailError && <ErrorMessage message={thumbnailError} />}
        </div>

        <div className="form-row">
          <label className="field">
            <span>종류</span>
            <select
              value={form.articleType}
              onChange={(event) => changeType(event.target.value as ArticleType)}
            >
              <option value="GENERAL">일반 글</option>
              <option value="PROJECT">프로젝트</option>
            </select>
          </label>
          <label className="check">
            <input
              type="checkbox"
              checked={form.isPrivate}
              onChange={(event) => setForm({ ...form, isPrivate: event.target.checked })}
            />
            <span>비공개</span>
          </label>
        </div>

        <fieldset className="field-set">
          <legend>카테고리</legend>
          {categories.error && <ErrorMessage message={categories.error.message} onRetry={categories.reload} />}
          {categories.data?.length === 0 && <p className="hint">카테고리가 없어요. 아래에서 추가해 주세요.</p>}
          <div className="filter">
            {categories.data?.map((category) => (
              <button
                key={category.id}
                type="button"
                className="filter-chip"
                aria-pressed={form.categoryIds.includes(category.id)}
                onClick={() => toggleCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
          <div className="category-add">
            <input
              type="text"
              aria-label="새 카테고리 이름"
              placeholder="새 카테고리 이름"
              maxLength={50}
              value={newCategory}
              onChange={(event) => setNewCategory(event.target.value)}
              onKeyDown={handleCategoryKeyDown}
            />
            <button className="button" type="button" disabled={addingCategory} onClick={addCategory}>
              추가
            </button>
          </div>
          {categoryError && <ErrorMessage message={categoryError} />}
        </fieldset>

        <div className="editor">
          <div className="field">
            <div className="field-heading">
              <label htmlFor="article-content">본문 (마크다운)</label>
              <button
                className="button button-small"
                type="button"
                disabled={bodyUploading}
                onClick={() => bodyFileRef.current?.click()}
              >
                {bodyUploading ? '올리는 중' : '이미지 넣기'}
              </button>
            </div>
            <textarea
              id="article-content"
              ref={contentRef}
              required
              value={form.content}
              onChange={(event) => setForm({ ...form, content: event.target.value })}
              onPaste={handlePaste}
            />
            <input ref={bodyFileRef} type="file" accept={IMAGE_ACCEPT} multiple hidden onChange={handleBodyFiles} />
            <span className="hint">이미지를 복사해서 본문에 붙여넣어도 올라가요.</span>
            {bodyImageError && <ErrorMessage message={bodyImageError} />}
          </div>
          <div className="field">
            <span>미리보기</span>
            <div className="preview">
              <Markdown>{form.content}</Markdown>
            </div>
          </div>
        </div>

        {submitError && <ErrorMessage message={submitError} />}
        <div className="form-actions">
          <Link className="button" to="/admin">
            취소
          </Link>
          <button className="button button-primary" type="submit" disabled={submitting}>
            {submitting ? '저장 중' : '저장'}
          </button>
        </div>
      </form>
    </section>
  );
}
