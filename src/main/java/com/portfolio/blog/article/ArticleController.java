package com.portfolio.blog.article;

import com.portfolio.blog.article.dto.ArticleListResponse;
import com.portfolio.blog.article.dto.ArticleRequest;
import com.portfolio.blog.article.dto.ArticleResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/articles")
@RequiredArgsConstructor
public class ArticleController {
    private final ArticleService articleService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ArticleResponse create(@Valid @RequestBody ArticleRequest request,
                                  @SessionAttribute("loginId") String loginId){
        return articleService.create(request, loginId);
    }

    @GetMapping("/{articleId}")
    @ResponseStatus(HttpStatus.OK)
    public ArticleResponse find(@PathVariable Integer articleId,
                                @SessionAttribute(name = "loginId", required = false) String loginId){
        return articleService.find(articleId, loginId != null);
    }

    @PutMapping("/{articleId}")
    @ResponseStatus(HttpStatus.OK)
    public ArticleResponse update(@PathVariable Integer articleId, @Valid @RequestBody ArticleRequest request){
        return articleService.update(articleId, request);
    }

    @DeleteMapping("/{articleId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer articleId){
        articleService.delete(articleId);
        return;
    }

    @GetMapping
    public ArticleListResponse findAll(@RequestParam(defaultValue = "0") int page,
                                       @RequestParam(defaultValue = "10") int size,
                                       @RequestParam(required = false) ArticleType articleType,
                                       @RequestParam(required = false) String q,
                                       @RequestParam(required = false) List<Integer> categoryIds,
                                       @SessionAttribute(name = "loginId", required = false) String loginId) {
        return articleService.findAll(articleType, q, categoryIds, page, size, loginId != null);
    }
}
