## API 목록

### article
- GET /api/articles -> 글 전체 조회
- GET /api/articles/{articleId} -> 글 조회
- POST /api/articles -> 글 생성
- PUT /api/articles/{articleId} -> 글 수정
- DELETE /api/articles/{articleId} -> 글 삭제
ex) GET /api/articles?categoryIds=1,2&articleType=PROJECT&q=tmp&page=n&size=m -> 1 or 2카테고리, 프로젝트, tmp검색어로 필터링한 글을 m개씩 페이징할 때 n페이지를 조회

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

---
## 요청, 성공 응답

### category
- GET /api/categories

프론트 → 서버: GET /api/categories
서버 → 프론트: 200 OK
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
서버 → 프론트: 201 Created
```json
    {"id": 3, "name": "subject_assignment"}
```
- PUT /api/categories/{categoryId}

프론트 → 서버: PUT /api/categories/{categoryId}
```json
    {"name": "subject_assignment3"}
```
서버 → 프론트: 200 OK
```json
    {"id": 3, "name": "subject_assignment3"}
```

- DELETE /api/categories/{categoryId}

프론트 → 서버: DELETE /api/categories/{categoryId}

서버 → 프론트: 204 No Content 

- GET /api/categories/{categoryId}/deletion-preview

프론트 → 서버: GET /api/categories/{categoryId}/deletion-preview

서버 → 프론트: 200 OK
```json
    {"deletableArticleCount": 5}
```

### article
- GET /api/articles

프론트 → 서버: GET /api/articles?categoryIds=1,3&articleType=PROJECT&q=백엔드&page=0&size=10
서버 → 프론트: 200 OK
```json
    {
        "articles": [
            {
                "id": 12,
                "title": "포트폴리오 블로그 백엔드 구축",
                "articleType": "PROJECT",
                "isPrivate": false,
                "categories": [
                    {"id": 1, "name": "Spring"},
                    {"id": 3, "name": "subject_assignment"}
                ],
                "createTime": "2026-11-05T14:30:00",
                "modifyTime": "2026-11-05T15:10:00"
            },
            {
                "id": 11,
                "title": "JPA 더티 체킹 정리",
                "articleType": "GENERAL",
                "isPrivate": false,
                "categories": [
                    {"id": 1, "name": "Spring"}
                ],
                "createTime": "2026-11-04T09:00:00",
                "modifyTime": "2026-11-04T09:00:00"
            }
        ],
        "page": 0,
        "size": 10,
        "totalElements": 2,
        "totalPages": 1
    }
//결과가 없으면 articles를 빈 목록으로 응답
```

- GET /api/articles/{articleId}

프론트 → 서버: GET /api/articles/12
서버 → 프론트: 200 OK
```json
    {
        "id": 12,
        "title": "포트폴리오 블로그 백엔드 구축",
        "content": "## 프로젝트 소개\nSpring Boot로 만든 블로그입니다.",
        "articleType": "PROJECT",
        "isPrivate": false,
        "categories": [
            {"id": 1, "name": "Spring"},
            {"id": 3, "name": "subject_assignment"}
        ],
        "createTime": "2026-11-05T14:30:00",
        "modifyTime": "2026-11-05T15:10:00"
    }
```

- POST /api/articles

프론트 → 서버: POST /api/articles
```json
    {
        "title": "포트폴리오 블로그 백엔드 구축",
        "content": "## 프로젝트 소개\nSpring Boot로 만든 블로그입니다.",
        "articleType": "PROJECT",
        "isPrivate": false,
        "categoryIds": [1, 3]
    }
```
서버 → 프론트: 201 Created
```json
    {
        "id": 12,
        "title": "포트폴리오 블로그 백엔드 구축",
        "content": "## 프로젝트 소개\nSpring Boot로 만든 블로그입니다.",
        "articleType": "PROJECT",
        "isPrivate": false,
        "categories": [
            {"id": 1, "name": "Spring"},
            {"id": 3, "name": "subject_assignment"}
        ],
        "createTime": "2026-11-05T14:30:00",
        "modifyTime": "2026-11-05T14:30:00"
    }
```

- PUT /api/articles/{articleId}

프론트 → 서버: PUT /api/articles/{articleId}
```json
    {
        "title": "포트폴리오 블로그 백엔드 구축",
        "content": "## 프로젝트 소개\nSpring Boot로 만든 블로그입니다.",
        "articleType": "PROJECT",
        "isPrivate": false,
        "categoryIds": [1, 3]
    }
```
서버 → 프론트: 200 OK
```json
    {
        "id": 12,
        "title": "포트폴리오 블로그 백엔드 구축",
        "content": "## 프로젝트 소개\nSpring Boot로 만든 블로그입니다.",
        "articleType": "PROJECT",
        "isPrivate": false,
        "categories": [
            {"id": 1, "name": "Spring"},
            {"id": 3, "name": "subject_assignment"}
        ],
        "createTime": "2026-11-05T14:30:00",
        "modifyTime": "2026-11-05T15:30:00"
    }
```

- DELETE /api/articles/{articleId}

프론트 → 서버: DELETE /api/articles/{articleId}

서버 → 프론트: 204 No Content 


---

## 실패 응답

### category
- POST /api/categories

    400 Bad Request
    ```json
    {"status": 400, "code": "INVALID_INPUT", "message": "입력값이 올바르지 않습니다."}
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
    {"status": 400, "code": "INVALID_INPUT", "message": "입력값이 올바르지 않습니다."}
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

### article
- GET /api/articles

    400 Bad Request
    ```json
    {"status": 400, "code": "INVALID_INPUT", "message": "입력값이 올바르지 않습니다."}
    ```

- GET /api/articles/{articleId}

    404 Not Found (비로그인 사용자가 비공개 글을 조회한 경우 포함)
    ```json
    {"status": 404, "code": "ARTICLE_NOT_FOUND", "message": "글을 찾을 수 없습니다."}
    ```

- POST /api/articles

    400 Bad Request
    ```json
    {"status": 400, "code": "INVALID_INPUT", "message": "입력값이 올바르지 않습니다."}
    ```
    401 Unauthorized
    ```json
    {"status": 401, "code": "UNAUTHORIZED", "message": "로그인이 필요합니다."}
    ```
    404 Not Found (요청한 카테고리가 없는 경우)
    ```json
    {"status": 404, "code": "CATEGORY_NOT_FOUND", "message": "카테고리를 찾을 수 없습니다."}
    ```

- PUT /api/articles/{articleId}

    400 Bad Request
    ```json
    {"status": 400, "code": "INVALID_INPUT", "message": "입력값이 올바르지 않습니다."}
    ```
    401 Unauthorized
    ```json
    {"status": 401, "code": "UNAUTHORIZED", "message": "로그인이 필요합니다."}
    ```
    404 Not Found (수정할 글이 없는 경우)
    ```json
    {"status": 404, "code": "ARTICLE_NOT_FOUND", "message": "글을 찾을 수 없습니다."}
    ```
    404 Not Found (요청한 카테고리가 없는 경우)
    ```json
    {"status": 404, "code": "CATEGORY_NOT_FOUND", "message": "카테고리를 찾을 수 없습니다."}
    ```

- DELETE /api/articles/{articleId}

    401 Unauthorized
    ```json
    {"status": 401, "code": "UNAUTHORIZED", "message": "로그인이 필요합니다."}
    ```
    404 Not Found
    ```json
    {"status": 404, "code": "ARTICLE_NOT_FOUND", "message": "글을 찾을 수 없습니다."}
    ```

---

## 글 규칙

- articleType은 PROJECT or GENERAL
- 제목은 1자 이상 100자 이하
- GET /api/articles의 쿼리 파라미터는 모두 선택 사항(기본값 page=0, size=10)
- 목록은 최신 작성순으로 정렬
- 글 본문은 상세 조회에서만 제공
- 비로그인 사용자의 목록에는 비공개 글 포함 X
- 비로그인 사용자가 비공개 글을 상세 조회하면 404 ARTICLE_NOT_FOUND
- categoryIds는 1개 이상

DTO = 데이터를 교환하기 위해 사용하는 데이터 전달용 객체
controller(표현 계층) = HTTP요청을 service로 넘기고 결과를 응답
service(비즈니스 계층) = 요청한 작업 처리
Repository(데이터 접근 계층) = 데이터 관련 접근, 조작 처리
Entity = 테이블과 클래스 매칭