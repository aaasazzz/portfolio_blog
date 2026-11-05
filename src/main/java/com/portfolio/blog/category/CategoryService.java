package com.portfolio.blog.category;

import com.portfolio.blog.category.dto.CategoryRequest;
import com.portfolio.blog.category.dto.CategoryResponse;
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

    @Transactional(readOnly = true)
    public List<CategoryResponse> findAll(){
        List<Category> list = categoryRepository.findAll(Sort.by("id"));
        List<CategoryResponse> x = new ArrayList<>();
        for (Category category : list) {
            x.add(CategoryResponse.from(category));
        }
        return x;
    }
}
