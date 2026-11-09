package com.portfolio.blog.category.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CategoryDeletionPreviewResponse {
    private int deletableArticleCount;
}
