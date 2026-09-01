# Seven Knights Community

세븐나이츠 길드원을 위한 커뮤니티 웹 서비스입니다. 게시판과 길드전 공격 공략을 한곳에서 조회·관리할 수 있도록 Spring Boot API와 Next.js 프론트엔드를 모노레포로 구성했습니다.

## 주요 기능

### 인증·회원

- 회원가입 (프론트 실시간 검증 + 백엔드 `@Valid` / `SignupValidator`)
- 로그인 및 JWT 발급 (`localStorage` 저장, `useAuth` 훅으로 상태 공유)
- 역할: `USER`, `ADMIN`
- 비밀번호 정책 (영문+숫자, 8자 이상, BCrypt 해시 저장)

### 게시판

- `Post` 엔티티 + `BoardType` enum (`FREE`, `GUIDE`, `NOTICE`) 단일 테이블 구조
- **자유게시판**: 목록·상세·작성·수정·삭제, 조회수, 이미지 첨부 (multipart)
- **공지게시판**: 목록·상세 조회 (작성·수정은 관리자 전용)
- **공략게시판**: 목록 조회 UI (`/board/guide`) — 상세·작성 화면은 아직 없음
- 본인 글만 수정·삭제, 관리자는 전체 권한
- 관리자 게시글 숨김·노출·삭제 (`hidden` 필드)

### 관리자 (`/admin/**`, `ADMIN` 역할)

- 회원 목록 조회
- 공지 작성·수정·목록
- 게시글 관리 (숨김/노출, 삭제)
- 길드전 공격 가이드 등록·수정
- 이미지 업로드 (`POST /api/admin/uploads/images`)
- 영웅·펫 카탈로그 조회, 장비·반지·펫(로드아웃) 마스터 관리

### 길드전 공격 공략 (공개)

- 상대 방어팀 목록·상세 (`/guides/guild-war/attack`)
- 추천 공격팀, 영웅 편성, 추천 장비·반지, 펫, 스킬 사용 순서 표시
- `isPublished=true`인 가이드만 공개 API·사용자 페이지에 노출

### 길드전 공격 공략 (관리자)

- 상대 방어팀 등록·수정 (영웅 3인 편성)
- 추천 공격팀 다중 등록 (영웅, 추천 장비·반지, 펫, 설명)
- 영웅 카탈로그 검색 선택 (`HeroSelect`)
- 펫 카탈로그 다중 선택
- 스킬 사용 순서 입력 (현재 **수동 텍스트 입력** 모드)
- 공개 여부·정렬 순서 설정

## 길드전 공략 시스템

길드전 공격 가이드는 **상대 방어팀**을 루트로 두고, 그 아래에 **추천 공격팀**과 **스킬 순서**가 연결되는 구조입니다.

```
상대 방어팀 (gw_enemy_teams)
├── 방어팀 멤버 3인 (gw_enemy_team_members) → heroes FK
└── 추천 공격팀 N개 (gw_attack_recommendations)
    ├── 공격팀 멤버 3인 (gw_attack_team_members) → heroes FK
    │   ├── 추천 장비 (gw_attack_member_equipments) → gw_equipments FK
    │   └── 추천 반지 (gw_attack_member_rings) → gw_rings FK
    ├── 펫 다중 (gw_attack_recommendation_pets) → pets FK
    └── 스킬 순서 (gw_skill_steps) → skills FK 또는 note 텍스트
```

### 영웅·펫 카탈로그

게임 데이터는 **카탈로그 테이블**과 **길드전 편성 데이터**를 분리해 관리합니다.

| 구분 | 테이블 | 용도 |
|------|--------|------|
| 영웅 카탈로그 | `heroes` | 이름, slug, 소속(faction), 이미지 URL |
| 펫 카탈로그 | `pets` | 이름, slug, 이미지 URL |
| 방어/공격 편성 | `gw_*_team_members` | 슬롯별 `hero_id` FK로 카탈로그 참조 |
| 추천 펫 | `gw_attack_recommendation_pets` | 추천안별 `catalog_pet_id` FK |

- 영웅 이미지는 `frontend/public/images/heroes/` 정적 파일과 slug를 맞춥니다.
- 펫 이미지는 `frontend/public/images/pet/` 정적 파일과 slug를 맞춥니다.
- `app.hero.seed=true` / `app.pet.seed=true` 설정 시 시드 데이터를 DB에 적재할 수 있습니다.

### 레거시 데이터

초기 구현에서 쓰던 `GameCharacter`·`Skill`·`gw_pets`(로드아웃 마스터) 구조는 하위 호환을 위해 남아 있습니다. 신규 저장은 `heroes` / `pets` 카탈로그 FK를 우선 사용합니다.

### 스킬 입력

- 관리자 UI는 현재 스킬 DB 선택 대신 **텍스트 직접 입력** (`USE_MANUAL_SKILL_INPUT = true`)
- 저장 시 `gw_skill_steps.skill_id = NULL`, `note`에 입력값 저장
- MySQL에서 `skill_id` 컬럼을 NULL 허용으로 변경해야 합니다 (`backend/src/main/resources/db/gw_skill_steps_skill_id_nullable.sql`)

### 아직 없는 길드전 기능

- 방어 가이드 (`gw_defense_guides` 엔티티만 존재, API·화면 미구현)
- 스킬 카탈로그 선택 UI (코드는 보존, 현재 비활성)
- 레이드·이벤트 계산기 등 기타 가이드

## 기술 스택

### Backend

| 항목 | 버전 / 기술 |
|------|-------------|
| Java | 21 |
| Spring Boot | 3.4.5 |
| Spring Security | JWT (jjwt 0.12.6), BCrypt |
| JPA / Hibernate | Spring Data JPA |
| DB | MySQL (로컬 개발), H2 (테스트) |
| 기타 | Lombok, Bean Validation, Gradle |

> Redis는 현재 사용하지 않습니다. JWT는 stateless 방식으로 동작합니다.

### Frontend

| 항목 | 버전 / 기술 |
|------|-------------|
| Next.js | 16.2.6 (App Router) |
| React | 19.2.4 |
| TypeScript | 5.x |
| 스타일 | Tailwind CSS 4 |
| 기타 | next-themes |

### Development

| 항목 | 기술 |
|------|------|
| 빌드 | Gradle (backend), npm (frontend) |
| 버전 관리 | Git / GitHub |
| DB | MySQL 8 (로컬 또는 별도 설치) |

> 저장소에 Docker Compose·Dockerfile은 포함되어 있지 않습니다.

## 프로젝트 구조

```
SevenKnights_community/
├── backend/
│   └── src/main/java/com/sevenknights/community/
│       ├── config/          # Security, JWT, CORS, 시드 Runner
│       ├── controller/      # REST API
│       ├── domain/          # JPA Entity·Repository
│       │   ├── user/
│       │   ├── post/
│       │   ├── hero/        # 영웅 카탈로그
│       │   ├── pet/         # 펫 카탈로그
│       │   └── guildwar/    # 길드전 공격·방어·마스터
│       ├── dto/
│       ├── service/
│       ├── security/        # JWT 필터, UserDetails
│       └── global/          # 예외 처리, 공통 응답
├── frontend/
│   └── src/
│       ├── app/             # 페이지 라우트 (사용자·관리자)
│       ├── components/      # UI, 게시판, 길드전, 관리자 폼
│       ├── hooks/           # useAuth
│       ├── lib/             # API, 인증, 네비게이션
│       └── types/
└── README.md
```

## 인증 및 권한

### 회원가입·로그인

- `POST /api/auth/signup` — 일반 회원(`USER`)으로 가입
- `POST /api/auth/login` — 인증 성공 시 JWT + 사용자 정보 반환
- 프론트는 토큰·사용자 정보를 `localStorage`에 저장

### JWT

- `JwtAuthenticationFilter`가 요청 헤더 `Authorization: Bearer {token}`을 검증
- 토큰 claim: `userId`, `role`
- 만료 시간: `app.jwt.expiration-ms` (기본 24시간)
- Refresh Token·HttpOnly Cookie는 미구현

### Spring Security

- Stateless 세션 (`SessionCreationPolicy.STATELESS`)
- `/api/auth/**`, `GET /api/posts/**`, `GET /api/guild-war/**` — 비인증 허용
- `POST/PUT/DELETE /api/posts/**` — 로그인 필요
- `/api/admin/**` — `ADMIN` 역할 필요
- 401·403 응답은 JSON 형식으로 통일

### 권한별 접근

| 대상 | USER | ADMIN |
|------|------|-------|
| 자유게시판 글 작성 | O | O |
| 본인 글 수정·삭제 | O | O |
| 공지 작성 | X | O |
| 관리자 페이지·API | X | O |
| 길드전 가이드 등록 | X | O |

관리자 계정은 DB에서 `users.role`을 `ADMIN`으로 설정해야 합니다.

## 데이터 구조

### 회원

- `users` — username, email, password(BCrypt), nickname, role

### 게시판

- `posts` — title, content, boardType, viewCount, hidden, author_id
- `post_images` — 게시글 첨부 이미지 URL

### 길드전 (공격)

- `gw_enemy_teams` — 상대 방어팀 카드 (title, memo, sortOrder, isPublished)
- `gw_enemy_team_members` — 방어 3인 (`hero_id`)
- `gw_attack_recommendations` — 추천 공격안
- `gw_attack_team_members` — 공격 3인 (`hero_id`, description)
- `gw_attack_member_equipments` / `gw_attack_member_rings` — 슬롯별 장비·반지
- `gw_attack_recommendation_pets` — 추천안별 펫 (`catalog_pet_id`)
- `gw_skill_steps` — 스킬 순서 (`skill_id` 또는 `note`)

### 카탈로그·마스터

- `heroes` — 영웅 카탈로그
- `pets` — 펫 카탈로그
- `gw_equipments`, `gw_rings`, `gw_pets` — 관리자 드롭다운용 로드아웃 마스터
- `game_characters`, `skills` — 초기 길드전 데이터용 레거시 마스터

### 길드전 (방어, 미구현)

- `gw_defense_guides`, `gw_defense_guide_members` — 엔티티만 존재

JPA `ddl-auto: update`로 스키마가 자동 생성·갱신됩니다. 일부 컬럼 NULL 허용은 `backend/src/main/resources/db/*.sql`을 MySQL에서 수동 실행해야 할 수 있습니다.

## 실행 방법

### 사전 요구

- JDK 21
- Node.js 20+
- MySQL 8 (데이터베이스 `sevenknights` 생성)

### 1. MySQL 준비

MySQL에 `sevenknights` 데이터베이스를 만들고 접속 정보를 환경 변수로 설정합니다.

```sql
CREATE DATABASE sevenknights CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Backend (포트 8080)

```powershell
cd backend
.\gradlew.bat bootRun
```

Windows가 아닌 환경:

```bash
cd backend
./gradlew bootRun
```

### 3. Frontend (포트 3000)

```powershell
cd frontend
npm install
npm run dev
```

브라우저: http://localhost:3000

### 환경 변수

| 변수 | 위치 | 설명 |
|------|------|------|
| `DB_URL` | backend | JDBC URL (기본: `localhost:3306/sevenknights`) |
| `DB_USERNAME` | backend | DB 사용자 |
| `DB_PASSWORD` | backend | DB 비밀번호 |
| `JWT_SECRET` | backend | JWT 서명 키 (32자 이상, 운영 시 필수 변경) |
| `UPLOAD_DIR` | backend | 업로드 저장 경로 (기본: `uploads`) |
| `HERO_SEED` | backend | `true`이면 기동 시 영웅 시드 실행 |
| `PET_SEED` | backend | `true`이면 기동 시 펫 시드 실행 |
| `NEXT_PUBLIC_API_URL` | frontend | API URL (기본: `http://localhost:8080`) |

민감한 값은 `.env` 또는 OS 환경 변수로 설정하고 저장소에 커밋하지 마세요.

### 선택: 카탈로그 시드

영웅·펫 카탈로그를 처음 채울 때:

```powershell
# backend 실행 시
$env:HERO_SEED="true"
$env:PET_SEED="true"
.\gradlew.bat bootRun
```

### 테스트 (Backend)

```powershell
cd backend
.\gradlew.bat test
```

## 주요 API

인증 헤더: `Authorization: Bearer {accessToken}`

| Method | Path | 설명 | 인증 |
|--------|------|------|------|
| POST | `/api/auth/signup` | 회원가입 | 없음 |
| POST | `/api/auth/login` | 로그인 | 없음 |
| GET | `/api/posts?boardType=FREE&page=0&size=10` | 게시글 목록 | 없음 |
| GET | `/api/posts/{id}` | 게시글 상세 | 없음 |
| POST | `/api/posts` | 게시글 작성 (multipart) | JWT |
| PUT | `/api/posts/{id}` | 게시글 수정 | JWT |
| DELETE | `/api/posts/{id}` | 게시글 삭제 | JWT |
| GET | `/api/guild-war/attack/enemy-teams` | 길드전 가이드 목록 | 없음 |
| GET | `/api/guild-war/attack/enemy-teams/{id}` | 길드전 가이드 상세 | 없음 |
| GET | `/api/admin/**` | 관리자 API | ADMIN |
| POST | `/api/admin/guild-war/attack/enemy-teams` | 방어팀 등록 | ADMIN |
| PUT | `/api/admin/guild-war/attack/enemy-teams/{id}` | 방어팀 수정 | ADMIN |
| POST | `/api/admin/uploads/images` | 이미지 업로드 | ADMIN |

업로드 파일: `GET /uploads/**`

## 페이지 경로

### 사용자

| 경로 | 설명 |
|------|------|
| `/` | 메인 |
| `/login`, `/signup` | 로그인·회원가입 |
| `/board/free` | 자유게시판 |
| `/board/free/new`, `/board/free/[id]`, `.../edit` | 글쓰기·상세·수정 |
| `/board/notice` | 공지 목록·상세 |
| `/board/guide` | 공략게시판 목록 |
| `/guides/guild-war/attack` | 길드전 공격 가이드 목록 |
| `/guides/guild-war/attack/[id]` | 길드전 공격 가이드 상세 |

### 관리자

| 경로 | 설명 |
|------|------|
| `/admin/users` | 회원 관리 |
| `/admin/community/notices` | 공지 관리 |
| `/admin/community/posts` | 게시글 관리 |
| `/admin/guides/guild-war/attack` | 길드전 가이드 목록 |
| `/admin/guild-war/attack/new`, `.../[id]/edit` | 길드전 가이드 등록·수정 |

## 현재 개발 상태

### 완료

- 회원가입·로그인·JWT 인증
- 자유게시판 CRUD·이미지 첨부
- 공지게시판 조회, 관리자 공지 작성
- 관리자 회원·게시글 관리
- 길드전 공격 가이드 공개·관리 (영웅/펫 카탈로그, 장비·반지, 수동 스킬 순서)
- 영웅·펫 시드 및 정적 이미지 연동

### 개발 중·제한 사항

- 공략게시판: 목록만 있고 상세·작성 UI 없음 (API는 `GUIDE` 타입 지원)
- 길드전 관리자 수정: 공개 API로 데이터를 불러오므로 **미공개(`isPublished=false`) 가이드는 수정 화면에서 조회 불가**
- 스킬 순서: 수동 텍스트 입력만 사용 (스킬 DB·이미지 연동 UI는 비활성)
- MySQL 수동 마이그레이션 필요 (`skill_id`, `character_id` NULL 허용 등)

### 미구현

- 댓글
- 아이디·비밀번호 찾기
- Refresh Token / HttpOnly Cookie
- Redis
- 길드전 방어 가이드
- 레이드 가이드, 이벤트·시나리오 계산기
