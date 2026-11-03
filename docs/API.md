## API 목록
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

## 요청, 성공 응답
- GET /api/categories

프론트 → 서버:  GET /api/categories
서버 → 프론트:  200 OK
```json
    [
        {"id": 1, "name": "Spring"},
        {"id": 2, "name": "DL"}
    ]
//결과가 없으면 빈 목록으로 응답
```
- POST /api/categories

프론트 → 서버: POST /api/categories
```json
    {"name": "subject_assignment"}
```
서버 → 프론트:  201 Created
```json
    {"id": 3, "name": "subject_assignment"}
```
- PUT /api/categories/{categoryId}
프론트 → 서버: PUT /api/categories/{categoryId}
```json
    {"name": "subject_assignment3"}
```
서버 → 프론트:  200 OK
```json
    {"id": 3, "name": "subject_assignment3"}
```

- DELETE /api/categories/{categoryId}

프론트 → 서버: DELETE /api/categories/{categoryId}

서버 → 프론트:  204 No Content  

- GET /api/categories/{categoryId}/deletion-preview

프론트 → 서버: GET /api/categories/{categoryId}/deletion-preview

서버 → 프론트:  200 OK
```json
    {"deletableArticleCount": 5}
```

## 실패 응답
- POST /api/categories

    400 Bad Request
    ```json
    {"status": 400, "code": "INVALID_INPUT", "message": "이름은 1자 이상 50자 이하여야 합니다."}
    ```
    401 Unauthorized
    ```json
    {"status": 401, "code": "UNAUTHORIZED", "message": "로그인이 필요합니다."}
    ```
    409 Conflict
    ```json
    {"status": 409, "code": "DUPLICATE_CATEGORY_NAME", "message": "이미 존재하는 카테고리 이름입니다."}
    ```

- PUT /api/categories/{categoryId}

    400 Bad Request
    ```json
    {"status": 400, "code": "INVALID_INPUT", "message": "이름은 1자 이상 50자 이하여야 합니다."}
    ```
    401 Unauthorized
    ```json
    {"status": 401, "code": "UNAUTHORIZED", "message": "로그인이 필요합니다."}
    ```
    404 Not Found
    ```json
    {"status": 404, "code": "CATEGORY_NOT_FOUND", "message": "카테고리를 찾을 수 없습니다."}
    ```
    409 Conflict
    ```json
    {"status": 409, "code": "DUPLICATE_CATEGORY_NAME", "message": "이미 존재하는 카테고리 이름입니다."}
    ```

- DELETE /api/categories/{categoryId}

    401 Unauthorized
    ```json
    {"status": 401, "code": "UNAUTHORIZED", "message": "로그인이 필요합니다."}
    ```
    404 Not Found
    ```json
    {"status": 404, "code": "CATEGORY_NOT_FOUND", "message": "카테고리를 찾을 수 없습니다."}
    ```

- GET /api/categories/{categoryId}/deletion-preview

    401 Unauthorized
    ```json
    {"status": 401, "code": "UNAUTHORIZED", "message": "로그인이 필요합니다."}
    ```
    404 Not Found
    ```json
    {"status": 404, "code": "CATEGORY_NOT_FOUND", "message": "카테고리를 찾을 수 없습니다."}
    ```