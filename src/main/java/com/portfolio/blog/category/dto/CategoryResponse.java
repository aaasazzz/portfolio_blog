package com.portfolio.blog.category.dto;

import com.portfolio.blog.category.Category;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CategoryResponse {
    private Integer id;
    private String name;

    public static CategoryResponse from(Category category){
        return new CategoryResponse(category.getId(), category.getName());
    }
}