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
public class ArticleResponse {

    private Integer id;
    private String title;
    private String content;
    private ArticleType articleType;
    private Boolean isPrivate;
    private List<CategoryResponse> categories;
    private LocalDateTime createTime;
    private LocalDateTime modifyTime;

    public static ArticleResponse from(Article article, List<Category> categories){
        List<CategoryResponse> cr = new ArrayList<>();
        for(Category category : categories){
            cr.add(CategoryResponse.from(category));
        }
        return new ArticleResponse(article.getId(), article.getTitle(), article.getContent(),
                article.getArticleType(), article.isPrivate(), cr, article.getCreateTime(),
                article.getModifyTime());

    }
}
