package com.portfolio.blog.article;

import com.portfolio.blog.category.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ArticleCategoryRepository extends JpaRepository<ArticleCategory, Integer> {
    List<ArticleCategory> findByArticle(Article article);
    List<ArticleCategory> findByCategory(Category category);
}
