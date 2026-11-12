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
- POST /api/auth/login -> 로그인
- POST /api/auth/logout -> 로그아웃
- GET /api/auth/me -> 현재 로그인 정보 조회

비공개글은 같은 URL에 로그인 여부로 분류

### image
- POST /api/images -> 이미지 업로드
- GET /api/images/{fileName} -> 이미지 조회

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
                "summary": "Spring Boot로 만든 블로그 백엔드입니다.",
                "thumbnailUrl": "/api/images/550e8400-e29b-41d4-a716-446655440000.png",
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
                "summary": "Spring Boot로 만든 블로그 백엔드입니다.",
                "thumbnailUrl": "/api/images/550e8400-e29b-41d4-a716-446655440000.png",
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
        "summary": "Spring Boot로 만든 블로그 백엔드입니다.",
        "thumbnailUrl": "/api/images/550e8400-e29b-41d4-a716-446655440000.png",
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
        "summary": "Spring Boot로 만든 블로그 백엔드입니다.",
        "thumbnailUrl": "/api/images/550e8400-e29b-41d4-a716-446655440000.png",
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
        "summary": "Spring Boot로 만든 블로그 백엔드입니다.",
        "thumbnailUrl": "/api/images/550e8400-e29b-41d4-a716-446655440000.png",
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
        "summary": "Spring Boot로 만든 블로그 백엔드입니다.",
        "thumbnailUrl": "/api/images/550e8400-e29b-41d4-a716-446655440000.png",
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
        "summary": "Spring Boot로 만든 블로그 백엔드입니다.",
        "thumbnailUrl": "/api/images/550e8400-e29b-41d4-a716-446655440000.png",
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

### login
- POST /api/auth/login

프론트 → 서버: POST /api/auth/login
```json
    {"loginId": "관리자 아이디", "password": "비밀번호"}
```
서버 → 프론트: 200 OK (세션 쿠키는 Set-Cookie 헤더로 전달)
```json
    {"loginId": "admin"}
```

- GET /api/auth/me

프론트 → 서버: GET /api/auth/me

서버 → 프론트: 200 OK
```json
    {"loginId": "admin"}
```

- POST /api/auth/logout

프론트 → 서버: POST /api/auth/logout

서버 → 프론트: 204 No Content

### image
- POST /api/images

프론트 → 서버: POST /api/images (multipart/form-data, 필드 이름 file)

서버 → 프론트: 201 Created
```json
    {"url": "/api/images/550e8400-e29b-41d4-a716-446655440000.png"}
```

- GET /api/images/{fileName}

프론트 → 서버: GET /api/images/550e8400-e29b-41d4-a716-446655440000.png

서버 → 프론트: 200 OK (이미지 파일)

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

### login
- POST /api/auth/login

    400 Bad Request
    ```json
    {"status": 400, "code": "INVALID_INPUT", "message": "입력값이 올바르지 않습니다."}
    ```
    401 Unauthorized (아이디가 없거나 비밀번호가 틀린 경우)
    ```json
    {"status": 401, "code": "LOGIN_FAILED", "message": "아이디 또는 비밀번호가 올바르지 않습니다."}
    ```

- POST /api/auth/logout

    401 Unauthorized
    ```json
    {"status": 401, "code": "UNAUTHORIZED", "message": "로그인이 필요합니다."}
    ```

- GET /api/auth/me

    401 Unauthorized
    ```json
    {"status": 401, "code": "UNAUTHORIZED", "message": "로그인이 필요합니다."}
    ```

### image
- POST /api/images

    400 Bad Request (이미지 파일이 아니거나 허용하지 않는 형식)
    ```json
    {"status": 400, "code": "INVALID_IMAGE", "message": "이미지 파일이 올바르지 않습니다."}
    ```
    401 Unauthorized
    ```json
    {"status": 401, "code": "UNAUTHORIZED", "message": "로그인이 필요합니다."}
    ```
    413 Payload Too Large
    ```json
    {"status": 413, "code": "IMAGE_TOO_LARGE", "message": "이미지 크기가 너무 큽니다."}
    ```

- GET /api/images/{fileName}

    404 Not Found
    ```json
    {"status": 404, "code": "IMAGE_NOT_FOUND", "message": "이미지를 찾을 수 없습니다."}
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
- 비공개글 조회는 로그인한 관리자만
- summary는 1자 이상 200자 이하
- thumbnailUrl은 선택 사항, 업로드한 이미지 주소만 사용 가능
- 썸네일이 없으면 thumbnailUrl은 null

## 로그인 규칙

| 구분 | API |
|---|---|
| 로그인 불필요 | GET /api/articles, GET /api/articles/{articleId}, GET /api/categories, GET /api/auth/me, POST /api/auth/login, GET /api/images/{fileName} |
| 로그인 필요 | 글 POST/PUT/DELETE, 카테고리 POST/PUT/DELETE, GET /api/categories/{categoryId}/deletion-preview, POST /api/auth/logout, POST /api/images |

- 로그인 방식은 세션 + 쿠키(JSESSIONID)
- 세션 쿠키는 `HttpOnly`, `SameSite=Lax`, 배포 환경(HTTPS)에서는 `Secure`
- 관리자 계정은 서버 첫 실행 시 환경변수(`ADMIN_LOGIN_ID`, `ADMIN_PASSWORD`) 값으로 생성
- 비밀번호는 BCrypt 해시로 저장
- 아이디가 없는 경우와 비밀번호가 틀린 경우의 응답은 동일하게 처리 (아이디 또는 비밀번호가 올바르지 않습니다.)
- 로그인 성공 시 세션 ID를 새로 발급
- 로그아웃하면 세션 삭제
- 세션은 마지막 요청 후 30분간 요청이 없으면 만료

## 카테고리 규칙

- 카테고리를 삭제하면 다른 카테고리가 없는 글도 함께 삭제
- 다른 카테고리가 있는 글은 유지하고 해당 카테고리 연결만 삭제

## 이미지 규칙

- PNG, JPEG, GIF, WebP만 업로드 가능, 파일 크기 <= 5MB
- 파일 내용으로 형식을 검사, 저장 이름은 서버가 새로 생성
- 글 본문과 썸네일 어디에도 쓰이지 않고 업로드 후 24시간이 지난 이미지는 매일 자동 삭제

---

DTO = 데이터를 교환하기 위해 사용하는 데이터 전달용 객체  
controller(표현 계층) = HTTP요청을 service로 넘기고 결과를 응답  
service(비즈니스 계층) = 요청한 작업 처리  
Repository(데이터 접근 계층) = 데이터 관련 접근, 조작 처리  
Entity = 테이블과 클래스 매칭