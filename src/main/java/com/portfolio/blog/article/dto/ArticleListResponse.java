package com.portfolio.blog.article.dto;

import com.portfolio.blog.article.Article;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.data.domain.Page;

import java.util.List;

@Getter
@AllArgsConstructor
public class ArticleListResponse {
    private List<ArticleSummaryResponse> articles;
    private int page;
    private int size;
    private long totalElements;
    private int totalPages;

    public static ArticleListResponse from(Page<Article> page, List<ArticleSummaryResponse> articles) {
        return new ArticleListResponse(articles, page.getNumber(), page.getSize(),
                page.getTotalElements(), page.getTotalPages());
    }
}
