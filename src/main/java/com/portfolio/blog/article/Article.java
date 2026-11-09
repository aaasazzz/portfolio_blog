package com.portfolio.blog.article;

import com.portfolio.blog.admin.Admin;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class Article {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false, updatable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "writer_id", nullable = false)
    private Admin writer;

    @Column(name = "title", nullable = false, length = 100)
    private String title;

    @Column(name = "content", nullable = false, columnDefinition = "MEDIUMTEXT")
    private String content;

    @Column(name = "is_private", nullable = false)
    private boolean isPrivate;

    @Enumerated(EnumType.STRING)
    @Column(name = "article_type", nullable = false, columnDefinition = "VARCHAR(10)")
    private ArticleType articleType;

    @CreationTimestamp
    @Column(name = "create_time", nullable = false, updatable = false)
    private LocalDateTime createTime;

    @UpdateTimestamp
    @Column(name = "modify_time", nullable = false)
    private LocalDateTime modifyTime;

    public Article(Admin writer, String title, String content, boolean isPrivate, ArticleType articleType){
        this.writer = writer;
        this.title = title;
        this.content = content;
        this.isPrivate = isPrivate;
        this.articleType = articleType;
    }

    public void update(String title, String content, boolean isPrivate, ArticleType articleType){
        this.title = title;
        this.content = content;
        this.isPrivate = isPrivate;
        this.articleType = articleType;
    }
}
