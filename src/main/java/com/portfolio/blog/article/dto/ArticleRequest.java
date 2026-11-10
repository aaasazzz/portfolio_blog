package com.portfolio.blog.article.dto;

import com.portfolio.blog.article.ArticleType;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
public class ArticleRequest {
    @NotBlank
    @Size(max = 100)
    private String title;

    @NotBlank
    private String content;

    @NotBlank
    @Size(max = 200)
    private String summary;

    @NotNull
    private ArticleType articleType;

    @NotNull
    private Boolean isPrivate;

    @NotEmpty
    private List<Integer> categoryIds;

    @Pattern(regexp = "^/api/images/[0-9a-f-]{36}\\.[a-z]+$")
    private String thumbnailUrl;
}
