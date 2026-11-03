### article
- GET /api/articles -> 글 전체 조회
- GET /api/articles/{articleId} -> 글 조회
- POST /api/articles -> 글 생성
- PUT /api/articles/{articleId} -> 글 수정
- DELETE /api/articles/{articleId} -> 글 삭제
ex) GET /api/articles?categoryIds=1,2&articleType=project&q=tmp&page=n&size=m -> 1 or 2카테고리, 프로젝트, tmp검색어로 필터링한 글을 m개씩 페이징할 때 n페이지를 조회

### category
- GET /api/categories -> 카테고리 조회
- POST /api/categories -> 카테고리 생성
- PUT /api/categories/{categoryId} -> 카테고리 수정
- DELETE /api/categories/{categoryId} -> 카테고리 삭제
- GET /api/categories/{categoryId}/deletion-preview -> 삭제 시 함께 지워질 글 수 조회

### login
- POST /api/auth/login   -> 로그인
- POST /api/auth/logout  -> 로그아웃

비공개글은 같은 URL에 로그인 여부로 분류
