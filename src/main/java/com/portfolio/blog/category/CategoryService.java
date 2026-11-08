package com.portfolio.blog.category;

import com.portfolio.blog.category.dto.CategoryRequest;
import com.portfolio.blog.category.dto.CategoryResponse;
import com.portfolio.blog.global.error.BusinessException;
import com.portfolio.blog.global.error.ErrorCode;
import org.springframework.data.domain.Sort;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;

    @Transactional
    public CategoryResponse create(CategoryRequest request){
        if(categoryRepository.existsByName(request.getName())){
            throw new BusinessException(ErrorCode.DUPLICATE_CATEGORY_NAME);
        }
        else{
            Category category = new Category(request.getName());
            Category saved = categoryRepository.save(category);
            return CategoryResponse.from(saved);
        }
    }

    @Transactional(readOnly = true)
    public List<CategoryResponse> findAll(){
        List<Category> list = categoryRepository.findAll(Sort.by("id"));
        List<CategoryResponse> x = new ArrayList<>();
        for(Category category : list){
            x.add(CategoryResponse.from(category));
        }
        return x;
    }

    @Transactional
    public CategoryResponse updateName(Integer categoryId, CategoryRequest request){
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new BusinessException(ErrorCode.CATEGORY_NOT_FOUND));
        if(!category.getName().equals(request.getName()) && categoryRepository.existsByName(request.getName())){
            throw new BusinessException(ErrorCode.DUPLICATE_CATEGORY_NAME);
        }
        else{
            category.updateName(request.getName());
            return CategoryResponse.from(category);
        }
    }
}