package com.portfolio.blog.article;

import com.portfolio.blog.admin.Admin;
import com.portfolio.blog.admin.AdminRepository;
import com.portfolio.blog.article.dto.ArticleRequest;
import com.portfolio.blog.article.dto.ArticleResponse;
import com.portfolio.blog.category.Category;
import com.portfolio.blog.category.CategoryRepository;
import com.portfolio.blog.global.error.BusinessException;
import com.portfolio.blog.global.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ArticleService {
    private final ArticleRepository articleRepository;
    private final AdminRepository adminRepository;
    private final CategoryRepository categoryRepository;
    private final ArticleCategoryRepository articleCategoryRepository;

    @Transactional
    public ArticleResponse create(ArticleRequest request){
        Admin writer = adminRepository.findByLoginId("admin")
                .orElseThrow(() -> new BusinessException(ErrorCode.UNAUTHORIZED));
        List<Integer> categoryIds = request.getCategoryIds().stream().distinct().toList();
        List<Category> categoryList = new ArrayList<>();
        for(Integer categoryId : categoryIds){
            categoryList.add(categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new BusinessException(ErrorCode.CATEGORY_NOT_FOUND))
            );
        }
        Article article = new Article(writer, request.getTitle(), request.getContent(),
                request.getIsPrivate(), request.getArticleType());
        Article saved = articleRepository.save(article);
        for(Category category : categoryList){
            articleCategoryRepository.save(new ArticleCategory(saved, category));
        }
        return ArticleResponse.from(saved, categoryList);
    }

    @Transactional(readOnly = true)
    public ArticleResponse find(Integer articleId){
        Article article = articleRepository.findById(articleId)
                .orElseThrow(() -> new BusinessException(ErrorCode.ARTICLE_NOT_FOUND));
        List<ArticleCategory> articleCategoryList = articleCategoryRepository.findByArticle(article);
        List<Category> categoryList = new ArrayList<>();
        for(ArticleCategory articleCategory : articleCategoryList){
            categoryList.add(articleCategory.getCategory());
        }
        return ArticleResponse.from(article, categoryList);
    }

    @Transactional
    public ArticleResponse update(Integer articleId, ArticleRequest request){
        Article article = articleRepository.findById(articleId)
                .orElseThrow(() -> new BusinessException(ErrorCode.ARTICLE_NOT_FOUND));
        List<Integer> categoryIds = request.getCategoryIds().stream().distinct().toList();
        List<Category> categoryList = new ArrayList<>();
        for(Integer categoryId : categoryIds) {
            categoryList.add(categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new BusinessException(ErrorCode.CATEGORY_NOT_FOUND))
            );
        }
        article.update(request.getTitle(), request.getContent(), request.getIsPrivate(), request.getArticleType());

        articleCategoryRepository.deleteAll(articleCategoryRepository.findByArticle(article));
        articleCategoryRepository.flush();

        for(Category category : categoryList){
            articleCategoryRepository.save(new ArticleCategory(article, category));
        }

        return ArticleResponse.from(article, categoryList);
    }

    @Transactional
    public void delete(Integer articleId){
        Article article = articleRepository.findById(articleId)
                .orElseThrow(() -> new BusinessException(ErrorCode.ARTICLE_NOT_FOUND));

        articleCategoryRepository.deleteAll(articleCategoryRepository.findByArticle(article));
        articleRepository.delete(article);
        return;
    }
}
