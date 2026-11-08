package com.portfolio.blog.article;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ArticleRepository extends JpaRepository<Article, Integer> {

    @Query("""
    select a from Article a
    where (:articleType is null or a.articleType = :articleType)
      and (:q is null
           or lower(a.title) like lower(concat('%', :q, '%'))
           or lower(a.content) like lower(concat('%', :q, '%')))
      and (:allCategories = true
           or exists (select 1 from ArticleCategory ac
                      where ac.article = a and ac.category.id in :categoryIds))
    """)
    Page<Article> search(@Param("articleType") ArticleType articleType,
                         @Param("q") String q,
                         @Param("allCategories") boolean allCategories,
                         @Param("categoryIds") List<Integer> categoryIds,
                         Pageable pageable); //카테고리 안 쓸 때 is null로 하면 빈 리스트로 와서 별도의 flag 추가
}
