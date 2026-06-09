# Seven Knights Community

세븐나이츠 커뮤니티 MVP — Spring Boot + Next.js 모노레포

## 프로젝트 구조

```
SevenKnights_community/
├── backend/                 # Spring Boot REST API
│   └── src/main/java/com/sevenknights/community/
│       ├── config/          # Security, JWT, CORS
│       ├── controller/      # REST 엔드포인트
│       ├── domain/          # Entity, Repository
│       ├── dto/             # 요청/응답 DTO
│       ├── exception/       # 전역 예외 처리
│       ├── security/        # JWT 필터, UserDetails
│       └── service/         # 비즈니스 로직
├── frontend/                # Next.js (App Router)
│   └── src/
│       ├── app/             # 페이지 라우트
│       ├── components/      # UI, 레이아웃, 게시판
│       ├── lib/             # API 클라이언트, 인증
│       └── types/           # TypeScript 타입
└── README.md
```

## MVP 기능

| 기능 | 상태 |
|------|------|
| 회원가입 | ✅ |
| JWT 로그인 | ✅ |
| 자유게시판 CRUD | ✅ |
| 조회수 | ✅ |
| 비회원 조회 / 회원 작성 | ✅ |
| 본인 글만 수정·삭제 (관리자 전체) | ✅ |

추후 예정: 아이디·비밀번호 찾기, 공략 게시판, 댓글

## 기술 스택

- **Backend**: Java 21, Spring Boot 3.4, Spring Security, JWT (jjwt), JPA, H2
- **Frontend**: Next.js 16, React 19, Tailwind CSS 4, TypeScript

## 실행 방법

### 1. Backend (포트 8080)

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

H2 콘솔: http://localhost:8080/h2-console  
(JDBC URL: `jdbc:h2:mem:community`, 사용자 `sa`, 비밀번호 비움)

### 2. Frontend (포트 3000)

```powershell
cd frontend
copy .env.local.example .env.local   # 최초 1회
npm install
npm run dev
```

브라우저: http://localhost:3000

## REST API 요약

### 인증

| Method | Path | 설명 | 인증 |
|--------|------|------|------|
| POST | `/api/auth/signup` | 회원가입 | 없음 |
| POST | `/api/auth/login` | 로그인 (JWT 발급) | 없음 |

### 게시글

| Method | Path | 설명 | 인증 |
|--------|------|------|------|
| GET | `/api/posts?boardType=FREE&page=0&size=10` | 목록 | 없음 |
| GET | `/api/posts/{id}` | 상세 (+조회수 +1) | 없음 |
| POST | `/api/posts` | 작성 | JWT |
| PUT | `/api/posts/{id}` | 수정 (작성자/관리자) | JWT |
| DELETE | `/api/posts/{id}` | 삭제 (작성자/관리자) | JWT |

요청 헤더: `Authorization: Bearer {accessToken}`

### 게시글 작성 예시

```json
{
  "title": "첫 글",
  "content": "자유게시판 내용",
  "boardType": "FREE"
}
```

## 프론트 페이지

| 경로 | 설명 |
|------|------|
| `/` | 메인 |
| `/signup` | 회원가입 |
| `/login` | 로그인 |
| `/board/free` | 자유게시판 목록 |
| `/board/free/new` | 글쓰기 (로그인 필요) |
| `/board/free/[id]` | 상세 |
| `/board/free/[id]/edit` | 수정 |

## 환경 변수

| 변수 | 위치 | 기본값 |
|------|------|--------|
| `JWT_SECRET` | backend (선택) | application.yml 기본값 |
| `NEXT_PUBLIC_API_URL` | frontend `.env.local` | `http://localhost:8080` |

운영 배포 시 `JWT_SECRET`은 반드시 32자 이상의 안전한 값으로 설정하세요.

## 다음 단계 제안

1. PostgreSQL로 DB 교체
2. 공략 게시판 (`boardType=GUIDE`) UI 추가
3. 아이디/비밀번호 찾기 API
4. 댓글 도메인 및 API
5. Refresh Token / HttpOnly Cookie 검토


백엔드 실행
.\gradlew.bat bootRun

프론트엔드 실행
npm run dev
