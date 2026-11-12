# 포트폴리오 블로그 개발 기록

Spring Boot로 만든 포트폴리오 겸 블로그의 개발 과정을 단계별로 정리한 문서
각 단계별로 무엇을 만들었는지, 어떤 개념을 배웠는지, 어떤 문제를 겪고 어떻게 해결했는지를 기록

- 기간: 2026-11-02 ~ 2026-11-00
- 목표: 백엔드 구축 연습, GitHub Flow(branch → PR → CI → merge) 연습
- 기술: Java 25, Spring Boot 4, Spring Data JPA, MySQL 8.4, Docker Compose, Caddy, GitHub Actions, React + Vite + TypeScript

## 목차

1. [설계](#1-설계)
2. [카테고리 API](#2-카테고리-api)
3. [관리자 계정과 글 API](#3-관리자-계정과-글-api)
4. [글 목록: 페이징, 검색, 필터](#4-글-목록-페이징-검색-필터)
5. [로그인과 접근 제어](#5-로그인과-접근-제어)
6. [카테고리 삭제](#6-카테고리-삭제)
7. [공통 에러 처리](#7-공통-에러-처리)
8. [MySQL과 Docker](#8-mysql과-docker)
9. [CI](#9-ci)
10. [프론트 연동](#10-프론트-연동)
11. [이미지 업로드](#11-이미지-업로드)
12. [전체 Docker 실행](#12-전체-docker-실행)
13. [남은 작업](#13-남은-작업)
14. [AI 활용](#14-ai-활용)

---

## 1. 설계

| PR | 내용 |
|---|---|
| #1 `docs/design` | ERD와 API 목록 |

### 한 일
- 요구사항 정리: 관리자 1명, 읽기 전용 방문자, 공개/비공개 글, 마크다운 본문, 글 하나에 카테고리 여러 개
- ERD: `admin`, `article`, `category`, `article_category`(다대다 연결 테이블)
- API 목록과 요청/응답 형식을 `docs/API.md`에 정리

### 배운 것
- 기능 구현 전에 성공 응답과 실패 응답을 먼저 정해두면 구현 기준이 생긴다.

---

## 2. 카테고리 API

| PR | 내용 |
|---|---|
| #2 `feat/category` | 카테고리 조회, 생성, 수정 |

### 한 일
- `Category` 엔티티, Repository, Service, Controller, 요청/응답 DTO
- 중복 이름은 409 `DUPLICATE_CATEGORY_NAME`

### 배운 것
- 계층별 역할
  - Controller: JSON ↔ DTO 변환, `@Valid`, 상태 코드
  - Service: 엔티티로 작업, `@Transactional`
  - Repository: DB 접근
  - DTO: 엔티티가 아니라 API 응답 모양에 맞추기
- 수정은 더티 체킹으로 처리. 트랜잭션 안에서 엔티티 값을 바꾸면 끝날 때 UPDATE가 실행됨.

---

## 3. 관리자 계정과 글 API

| PR | 내용 |
|---|---|
| #3 `docs/article-api` | 글 API 요청/응답 설계 |
| #4 `feat/admin` | 관리자 엔티티와 초기 계정 생성 |
| #5 `feat/article` | 글 생성, 상세 조회, 수정, 삭제 |

### 한 일
- 앱 시작 시 관리자 계정이 없으면 만드는 `AdminInitializer`
- 글 CRUD와 카테고리 연결(`article_category`) 저장

### 배운 것
- `@Valid`는 규칙에 대한 검사(@Size, @NotBlank etc...). URL 값의 존재 여부는 Service에서 `findById` + `orElseThrow`로 확인.
- `getReferenceById`는 실제로 조회하지 않은 프록시를 돌려줘서, 없는 id면 이후 500으로 처리됨(DB에 묻지 않고 값을 꺼낼 때 DB에서 조회). 존재 확인이 필요하면 `findById`.

### 문제와 해결
| 문제 | 원인 | 해결 |
|---|---|---|
| 글 수정 시 카테고리 연결이 유니크 제약 위반 | Hibernate는 DELETE보다 INSERT를 먼저 실행한다 | 기존 연결 삭제 후 `flush()`로 DELETE를 먼저 반영 |
| 글 삭제 시 FK 에러 | 자식(`article_category`)이 부모(`article`)를 참조 중 | 연결 먼저 삭제하고 글 삭제 |

---

## 4. 글 목록: 페이징, 검색, 필터

| PR | 내용 |
|---|---|
| #6 `feat/article-list` | 페이징, 종류/검색어/카테고리 필터 |

### 한 일
- `GET /api/articles?page&size&articleType&q&categoryIds`
- 목록은 본문 없이 요약 DTO로 응답, 최신순 정렬
- JPQL `@Query`로 선택 조건 조합

### 배운 것
- `Pageable`은 "몇 페이지를 몇 개씩, 어떤 순서로"를 담은 주문서, `Page`는 결과와 전체 개수를 담은 응답.
- 선택 조건은 `(:x is null or ...)` 형태.
- 카테고리 조건은 JOIN 대신 `exists` 서브쿼리를 써서 글 중복 방지.

### 문제와 해결
| 문제 | 원인 | 해결 |
|---|---|---|
| `wrong number of type arguments` 등 엉뚱한 에러가 대량 발생 | `Page`를 H2 패키지에서 import | `org.springframework.data.domain.Page`로 수정 |
| 카테고리 필터가 빈 목록일 때 결과 0개 | 빈 리스트는 `is null`에 걸리지 않음 | `allCategories` 플래그를 따로 전달 |

---

## 5. 로그인과 접근 제어

| PR | 내용 |
|---|---|
| #7 `feat/auth` | BCrypt, 로그인/로그아웃, 인터셉터, 작성자, 비공개 글 |

### 한 일
1. 관리자 비밀번호를 BCrypt 해시로 저장
2. `POST /api/auth/login`: 세션 생성, 세션 ID 교체
3. `POST /api/auth/logout`: 세션 삭제
4. 인터셉터로 POST/PUT/DELETE와 삭제 미리보기를 로그인 사용자만 허용 (401)
5. 글 작성자를 세션의 로그인 정보로 설정
6. 비로그인 사용자에게 비공개 글을 목록에서 숨기고 상세는 404

### 배운 것
- HTTP는 요청끼리 기억하지 못해서 세션 + 쿠키(`JSESSIONID`)로 사용자를 알아봄. (서버는 세션 보관함, 브라우저는 번호표)
- 로그인은 GET이 아니라 POST로. URL은 기록과 로그에 남음.
- 로그인 시 `changeSessionId()`로 세션 고정 공격 방어.
- 아이디가 없을 때와 비밀번호가 틀릴 때 같은 에러를 줘야 계정 존재 여부가 드러나지 않음.
- 비공개 글은 401/403이 아니라 404로 처리. (글의 존재 자체를 알리지 않기 위해서)
- 비공개 글 필터는 Java가 아니라 쿼리에서 해야 페이지 개수가 맞음.

### 문제와 해결
| 문제 | 원인 | 해결 |
|---|---|---|
| 서버 시작 실패 (`PasswordEncoder` 빈 없음) | 설정 클래스에 `@Configuration` 누락 | 어노테이션 추가 |
| 로그인해도 항상 401 | `request.getAttribute`로 세션 값을 찾음 | `session.getAttribute`로 수정 |

---

## 6. 카테고리 삭제

| PR | 내용 |
|---|---|
| #8 `feat/category-delete` | 카테고리 삭제, 삭제 미리보기 |

### 한 일
- 다른 카테고리가 없는 글은 함께 삭제, 다른 카테고리가 있는 글은 연결만 삭제
- `GET /api/categories/{id}/deletion-preview`로 함께 지워질 글 개수 조회

### 배운 것
- "이 카테고리에만 속한 글"은 `exists`(이 카테고리 연결이 있음) + `not exists`(다른 카테고리 연결이 없음)로 searching.
- 삭제 순서: 지울 글 목록 조회 → 연결 삭제 → 글 삭제 → 카테고리 삭제

### 문제와 해결
| 문제 | 원인 | 해결 |
|---|---|---|
| 지울 글이 없는 카테고리 삭제 시 FK 에러 가능성 | 연결 삭제를 "지울 글" 반복문 안에서 처리 | 반복문 없이 카테고리의 연결 전체를 한 번에 삭제 |

---

## 7. 공통 에러 처리

| PR | 내용 |
|---|---|
| #9 `feat/error-handling` | 잘못된 입력 형식의 응답 통일 |

### 한 일
- 깨진 JSON, 잘못된 enum 값, 주소의 잘못된 타입을 모두 `{status, code, message}` 형식의 400 `INVALID_INPUT`으로 통일

### 배운 것
- `@ExceptionHandler({...})`로 처리 방식이 같은 예외를 한 메서드에 묶을 수 있음.
- Spring이 던지는 입력 예외의 종류: `MethodArgumentNotValidException`, `HttpMessageNotReadableException`, `MethodArgumentTypeMismatchException`

---

## 8. MySQL과 Docker

| PR | 내용 |
|---|---|
| #10 `feat/mysql-docker` | MySQL 전환, Docker Compose로 MySQL과 앱 실행 |

### 한 일
- `compose.yaml`로 MySQL 컨테이너 실행, 데이터는 볼륨에 보관
- DB 계정은 `.env`로 분리하고 Git에서 제외
- 테스트는 H2로 돌도록 테스트 전용 설정 분리
- 멀티 스테이지 `Dockerfile`로 앱 이미지 생성, healthcheck 후 앱 시작

### 배운 것
- 이미지는 설치 파일, 컨테이너는 실행 중인 프로그램, 볼륨은 컨테이너 밖 저장 공간.
- MySQL 컨테이너의 계정은 볼륨이 비어 있을 때 한 번만 만들어짐.
- 컨테이너 안의 `localhost`는 컨테이너 자신이라, 앱은 서비스 이름(`mysql`)으로 DB에 접속.
- `ddl-auto=update`는 컬럼 추가만 하고 타입 변경이나 삭제 X.

### 문제와 해결
| 문제 | 원인 | 해결 |
|---|---|---|
| 약 2만 2천 자 한글 글 저장 시 500 | MySQL `TEXT`는 65,535바이트, 한글은 글자당 3바이트 | 본문 컬럼을 `MEDIUMTEXT`로 변경 |
| `empty compose file` | 파일을 저장하지 않고 실행 | 저장 후 실행 |
| Docker Desktop에서 실행한 MySQL이 바로 종료 | 이미지 화면의 실행 버튼은 `.env` 없이 새 컨테이너를 만든다 | 실행은 `docker compose`로, 켜고 끄기는 Containers 탭에서 |
| 이미지 빌드 중 Gradle 다운로드 timeout | 일시적인 네트워크 문제 | 다시 실행 |

- MySQL 기본 정렬 규칙은 대소문자를 구분하지 않아 `Spring`과 `spring`은 같은 이름으로 취급된다.

---

## 9. CI

| PR | 내용 |
|---|---|
| #11 `feat/ci` | GitHub Actions로 PR 빌드 검사 |
| #16 `feat/frontend-ci` | 프론트 빌드 검사 추가 |

### 한 일
- `main`으로 향하는 PR과 `main` push마다 Java 25 환경에서 `./gradlew build` 실행
- 프론트(`frontend`) 작업을 추가해 Node 24 환경에서 `npm ci`, `npm run build` 실행. 백엔드와 동시에 실행

### 배운 것
- 워크플로 파일은 "언제, 어디서, 무엇을" 실행할지 적은 GitHub용 지시서.
- CI는 매번 깨끗한 서버에서 돌기 때문에 내 컴퓨터에만 있는 파일(`.env` 등)에 기대면 바로 드러남.
- `cache: gradle`로 의존성을 저장하면 다음 실행이 빨라짐.
- `jobs` 아래 작업들은 동시에 실행됨.
- `npm ci`는 `package-lock.json`에 적힌 버전 그대로만 설치해서 CI 결과가 매번 같음.
- `working-directory`는 단계마다 따로 지정해야 함.

### 문제와 해결
| 문제 | 원인 | 해결 |
|---|---|---|
| `./npm`으로 실행 | `./`는 저장소 안의 파일을 뜻함 | 설치된 명령어라 `npm`만 사용 |

---

## 10. 프론트 연동

| PR | 내용 |
|---|---|
| #12 `feat/article-summary` | 글 요약(`summary`), 로그인 확인 API(`GET /api/auth/me`) |
| #13 `feat/frontend` | React 화면 |

### 한 일
- 메인(Tech stack, Career, Project, Contact), Blog 목록, 글 상세, 관리자 화면(`/admin`)
- 흰색 바탕에 진한 보라색 포인트, 한 페이지 스크롤 구성
- 개발 중에는 Vite 프록시로 `/api`를 Spring에 전달해 CORS 없이 쿠키 로그인 유지

### 배운 것
- 세션 쿠키는 `HttpOnly`라 자바스크립트가 읽을 수 없기 때문에 새로고침 후 로그인 상태는 `/api/auth/me`로 서버에 물어봄.
- 마크다운 본문의 HTML과 스크립트가 실행되지 않게 처리해야 함.
- 화면에서 버튼을 숨기는 것은 편의일 뿐이고, 실제 차단은 서버가 처리.

### 문제와 해결
| 문제 | 원인 | 해결 |
|---|---|---|
| 화면에 "요청을 처리하지 못했어요" | Spring과 MySQL이 꺼져 있음 | MySQL → Spring → 프론트 순서로 실행 |
| 카테고리 추가 실패 | 브랜치 전환 중 설정 파일이 바뀌어 Vite 프록시가 사라짐 | 프론트 서버 재시작 |
| `main`에 실수로 커밋 | 브랜치를 만들지 않고 커밋 | push 전에 새 브랜치를 만들고 `git branch -f main origin/main`으로 되돌림 |

---

## 11. 이미지 업로드

| PR | 내용 |
|---|---|
| #14 `feat/image-upload` | 업로드/조회 API, 썸네일, 자동 정리, 프론트, 볼륨, 검증 |

### 한 일
- `POST /api/images`(multipart), `GET /api/images/{fileName}`
- 파일은 서버 폴더에 UUID 이름으로 저장하고, DB에는 본문과 썸네일의 주소만 저장
- 글에 선택 항목 `thumbnailUrl` 추가, 우리 서버 이미지 주소만 허용
- 매일 새벽 4시에 본문과 썸네일 어디에도 쓰이지 않고 24시간 지난 이미지 삭제
- 글 작성 화면에서 본문 이미지 업로드와 붙여넣기, 썸네일 선택
- 업로드 폴더를 Docker 볼륨에 연결
- 검증: 파일 앞부분의 실제 형식 검사(PNG, JPEG, GIF, WebP), 5MB 제한(413), 조회 이름 검사, `X-Content-Type-Options: nosniff`

### 배운 것
- `multipart/form-data`는 파일을 보내는 요청 형식, Spring에서는 `MultipartFile`로 받음.
- 확장자는 이름만 바꾸면 속일 수 있어서, 파일 맨 앞의 바이트(매직 넘버)로 형식을 판단.
- Java의 `byte`는 -128~127이라 `& 0xFF`로 0~255로 바꿔 비교.
- 이미지 테이블 없이 "폴더의 파일 목록 + 본문/썸네일 참조 여부"만으로 정리 작업을 만들 수 있음.
- `@Scheduled`로 정해진 시간에 작업을 실행하고, 결과는 로그로 남김.

### 문제와 해결
| 문제 | 원인 | 해결 |
|---|---|---|
| 컴파일 에러가 여러 파일에서 발생 | `@Value`를 Lombok 패키지에서 import | Spring의 `@Value`로 수정 |
| `./gradlew build` 테스트 실패 | 테스트 설정에 `upload.dir`이 없음 | 테스트 설정에 테스트용 폴더 지정 |
| 1MB 넘는 이미지 업로드 실패 | Spring 기본 업로드 제한 1MB | 5MB로 설정 |
| 파일 없는 요청, 없는 이미지 조회가 500 | 예외를 다른 핸들러에 등록, 파일 존재 확인 누락 | 입력 예외 핸들러로 이동, 존재 확인 복구 |

---

## 12. 전체 Docker 실행

| PR | 내용 |
|---|---|
| #19 `feat/web-container` | 프론트를 Caddy 컨테이너로 만들어 `docker compose` 한 번으로 전체 실행 |

### 한 일
- `frontend/Dockerfile`: Node로 화면을 빌드하고, 결과 파일만 Caddy 이미지에 복사(멀티 스테이지)
- `frontend/Caddyfile`: 화면 파일 제공, `/api` 요청은 `app` 컨테이너로 전달, 없는 경로는 `index.html`로 응답
- `compose.yaml`에 `web` 서비스 추가, `http://localhost`로 접속
- 개발할 때는 기존처럼 Vite(`5173`)를 쓰고, 전체 확인과 배포는 Docker로 실행

### 배운 것
- Dockerfile은 이미지 하나를 만드는 레시피, compose는 여러 컨테이너를 어떤 순서와 설정으로 함께 실행할지 적은 파일.
- `build:`에 적은 폴더가 빌드 컨텍스트이고, Docker는 그 폴더의 `Dockerfile`과 `.dockerignore`를 사용. `COPY` 경로도 그 폴더 기준.
- 이미지는 고정된 결과물이라 코드를 고치면 `--build`로 다시 만들어야 반영됨.
- `package.json`을 먼저 복사하고 `npm ci`를 따로 실행하면, 화면 코드만 바뀌었을 때 설치 단계를 캐시로 건너뜀.
- Caddy는 웹 서버. 개발 중 Vite 프록시가 하던 `/api` 전달을 배포 환경에서 대신하고, 도메인을 적으면 HTTPS 인증서도 자동 발급.

### 문제와 해결
| 문제 | 원인 | 해결 |
|---|---|---|
| `localhost:5173` 접속 안 됨 | 5173은 Vite 개발 서버 포트라 `npm run dev`를 켰을 때만 열림 | Docker 실행 시에는 `http://localhost`로 접속 |

---

## 13. 남은 작업

| 작업 | 내용 |
|---|---|
| 테스트 코드 | 로그인, 401, 비공개 글, 검색, 카테고리 삭제, 이미지 |
| N+1 개선 | 글 목록에서 글마다 카테고리를 따로 조회하는 문제 |
| 배포 | 서버와 도메인, 관리자 비밀번호 환경변수, 쿠키 보안 설정, HTTPS, DB 백업 |

---

## 14. AI 활용

### 표시 기준

| 표시 | 뜻 |
|---|---|
| 직접 | 설계와 구현을 직접 함 |
| AI 코드 제공 | AI가 제시한 코드를 이해한 뒤 직접 입력하고 수정함 |
| AI 생성 | AI가 파일을 직접 작성함 |

모든 단계에서 코드 리뷰와 동작 테스트(curl, 브라우저)는 AI의 도움을 받았다.

### 단계별 내용

| 단계 | AI 활용 |
|---|---|
| 1. 설계 | 직접 |
| 2. 카테고리 API | 직접 |
| 3. 관리자 계정과 글 API | 직접 |
| 4. 글 목록 | 직접 / 검색 쿼리는 AI 코드 제공 |
| 5. 로그인과 접근 제어 | 비밀번호 암호화와 작성자 처리는 직접 / 로그인, 로그아웃의 세션 처리와 인터셉터 등록은 AI 코드 제공 |
| 6. 카테고리 삭제 | 직접 / "이 카테고리에만 속한 글" 쿼리는 AI 코드 제공 |
| 7. 공통 에러 처리 | 직접 (예외를 묶는 방법은 AI 제안) |
| 8. MySQL과 Docker | `compose.yaml`, `Dockerfile`, 설정 파일은 AI 코드 제공 |
| 9. CI | 백엔드 `ci.yml`은 AI 코드 제공 / 프론트 작업은 직접 |
| 10. 프론트 연동 | `summary` 필드는 직접 / `/api/auth/me`는 AI 코드 제공 / React 화면 전체는 AI 생성 |
| 11. 이미지 업로드 | 썸네일 필드와 볼륨 연결은 직접 / 업로드, 정리 작업, 검증 코드는 AI 코드 제공 / 프론트 화면은 AI 생성 |
| 12. 전체 Docker 실행 | `Dockerfile`, `Caddyfile`, compose 추가 내용은 AI 코드 제공 |

배경지식이 없던 분야(로그인과 세션, 이미지 업로드, Docker와 CI 설정 파일)와 단순 작업(검색 쿼리)은 AI가 제시한 코드를 이해한 뒤 사용했고, 그 외에는 직접 작성했다.
