package com.portfolio.blog.article.dto;

import com.portfolio.blog.article.Article;
import com.portfolio.blog.article.ArticleType;
import com.portfolio.blog.category.Category;
import com.portfolio.blog.category.dto.CategoryResponse;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@AllArgsConstructor
public class ArticleSummaryResponse {
    private Integer id;
    private String title;
    private ArticleType articleType;
    private Boolean isPrivate;
    private List<CategoryResponse> categories;
    private LocalDateTime createTime;
    private LocalDateTime modifyTime;

    public static ArticleSummaryResponse from(Article article, List<Category> categories){
        List<CategoryResponse> cr = new ArrayList<>();
        for(Category category : categories){
            cr.add(CategoryResponse.from(category));
        }
        return new ArticleSummaryResponse(article.getId(), article.getTitle(), article.getArticleType(),
                article.isPrivate(), cr, article.getCreateTime(), article.getModifyTime());
    }
}
