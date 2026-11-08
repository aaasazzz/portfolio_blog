package com.portfolio.blog.article;

import com.portfolio.blog.category.Category;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(
        name = "article_category",
        uniqueConstraints = @UniqueConstraint(columnNames = {"article_id", "category_id"})
)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class ArticleCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false, updatable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "article_id", nullable = false)
    private Article article;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    public ArticleCategory(Article article, Category category) {
        this.article = article;
        this.category = category;
    }
}
