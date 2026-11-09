import { Route, Routes } from 'react-router-dom';
import PublicLayout from './components/PublicLayout';
import ScrollManager from './components/ScrollManager';
import AdminArticlesPage from './pages/admin/AdminArticlesPage';
import AdminLayout from './pages/admin/AdminLayout';
import ArticleFormPage from './pages/admin/ArticleFormPage';
import CategoriesPage from './pages/admin/CategoriesPage';
import LoginPage from './pages/admin/LoginPage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import BlogPage from './pages/BlogPage';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <>
      <ScrollManager />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="blog" element={<BlogPage />} />
          <Route path="articles/:id" element={<ArticleDetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
        <Route path="admin/login" element={<LoginPage />} />
        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<AdminArticlesPage />} />
          <Route path="articles/new" element={<ArticleFormPage />} />
          <Route path="articles/:id/edit" element={<ArticleFormPage />} />
          <Route path="categories" element={<CategoriesPage />} />
        </Route>
      </Routes>
    </>
  );
}
