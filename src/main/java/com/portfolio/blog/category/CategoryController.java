package com.portfolio.blog.category;

import com.portfolio.blog.category.dto.CategoryDeletionPreviewResponse;
import com.portfolio.blog.category.dto.CategoryRequest;
import com.portfolio.blog.category.dto.CategoryResponse;
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
    @ResponseStatus(HttpStatus.CREATED)
    public CategoryResponse create(@Valid @RequestBody CategoryRequest request){
        return categoryService.create(request);
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)//기본값 200이라 굳이 안 써도 됨
    public List<CategoryResponse> findAll(){
        return categoryService.findAll();
    }

    @PutMapping("/{categoryId}")
    @ResponseStatus(HttpStatus.OK)
    public CategoryResponse update(@PathVariable Integer categoryId, @Valid @RequestBody CategoryRequest request){
        return categoryService.updateName(categoryId, request);
    }

    @GetMapping("/{categoryId}/deletion-preview")
    public CategoryDeletionPreviewResponse previewDeletion(@PathVariable Integer categoryId){
        return categoryService.previewDeletion(categoryId);
    }

    @DeleteMapping("/{categoryId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer categoryId){
        categoryService.delete(categoryId);
    }
}
