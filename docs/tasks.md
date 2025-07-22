# RealWorld App MVP 구현 작업 목록

이 문서는 Vibecoding 학습을 위한 RealWorld 클론 앱의 MVP(Minimum Viable Product) 구현에 필요한 핵심 작업들을 정의합니다.

## 1. 프로젝트 초기 설정 (필수)
- [ ] **언어 및 프레임워크 선택**:
    - 프론트엔드: React 또는 Angular
    - 백엔드: Node.js (Express) 또는 Python (Django)
- [ ] **프로젝트 구조 설정**: 선택한 프레임워크에 맞는 디렉토리 구조 생성
- [ ] **의존성 관리 설정**: `package.json` 또는 `requirements.txt` 파일 생성
- [ ] **데이터베이스 설정**: SQLite 연동 설정
- [ ] **Docker 환경 구성**: `Dockerfile` 및 `docker-compose.yml` 작성

## 2. 백엔드 API 구현 (핵심 기능)

### 2.1. 사용자 인증 (Authentication)
- [ ] **API 엔드포인트 구현**:
    - `POST /api/users` (회원가입)
    - `POST /api/users/login` (로그인)
- [ ] **데이터베이스 모델링**: `User` 모델 생성 (username, email, password)
- [ ] **인증 로직 구현**: JWT 기반 인증

### 2.2. 글 (Articles)
- [ ] **API 엔드포인트 구현**:
    - `POST /api/articles` (글 생성)
    - `GET /api/articles/:slug` (단일 글 조회)
    - `GET /api/articles` (글 목록 조회 - 페이지네이션)
- [ ] **데이터베이스 모델링**: `Article` 모델 생성 (slug, title, description, body, author)

## 3. 프론트엔드 구현 (핵심 기능)

### 3.1. 공통 컴포넌트 및 레이아웃
- [ ] **레이아웃**: 헤더, 푸터, 메인 컨텐츠 영역 구성
- [ ] **CSS 프레임워크 설정**: `tailwind css` 및 `shadcn` 설정

### 3.2. 페이지별 기능 구현
- [ ] **Home 페이지**:
    - 전체 글 목록 표시
- [ ] **로그인/회원가입 페이지**:
    - 사용자 입력 폼 구현 및 API 연동
- [ ] **글 상세 페이지**:
    - 글 본문 및 정보 표시
- [ ] **글 작성 페이지**:
    - 글 제목, 설명, 본문 입력 폼 및 API 연동

## 4. 후순위 작업 (MVP 이후 고려)
- 사용자 정보 수정 및 프로필 기능
- 팔로우/언팔로우 기능
- 댓글 기능
- 글 좋아요 기능
- 태그 기능
- 상세한 테스트 코드 작성 및 배포 자동화