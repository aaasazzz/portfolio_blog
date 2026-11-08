package com.portfolio.blog.article;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ArticleRepository extends JpaRepository<Article, Integer> {

    @Query("""
        select a from Article a
        where (:articleType is null or a.articleType = :articleType)
        """)
    Page<Article> search(@Param("articleType") ArticleType articleType, Pageable pageable);
}
