package com.portfolio.blog.category;

import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;

    @Transactional
    public CategoryResponse create(CategoryCreateRequest request){
        String s = request.getName();
        if(categoryRepository.existsByName(s)){
            throw new IllegalArgumentException("이미 존재하는 카테고리 이름입니다.");
        }
        else{
            Category category = new Category(s);
            Category saved = categoryRepository.save(category);
            return CategoryResponse.from(saved);
        }
    }
}
