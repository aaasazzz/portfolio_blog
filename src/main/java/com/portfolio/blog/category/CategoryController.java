package com.portfolio.blog.category;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {
    private final CategoryService categoryService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)//기본값 200이라 굳이 안 써도 됨
    public CategoryResponse create(@Valid @RequestBody CategoryCreateRequest request){
        return categoryService.create(request);
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<CategoryResponse> findAll(){
        return categoryService.findAll();
    }
}
