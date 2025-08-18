# Vibecoding RealWorld App: 개발 규칙

이 문서는 "Vibecoding RealWorld App" 프로젝트의 원활한 협업을 위한 개발 규칙을 정의합니다. 모든 팀원은 아래 규칙을 숙지하고 준수해야 합니다.

## 1. 프로젝트 목표 및 기본 원칙

- **목표**: RealWorld 표준 사양을 기반으로 Medium.com과 유사한 소셜 블로깅 플랫폼을 구현하며, 풀스택 개발 과정을 학습합니다.
- **원칙**:
    - **문서 기반 개발**: `PRD.md`, `design.md`에 정의된 요구사항과 설계를 따릅니다.
    - **이슈 기반 작업**: 모든 작업은 GitHub 이슈를 생성하고 해당 이슈 번호를 기반으로 브랜치를 생성하여 진행합니다.
    - **코드 리뷰**: 모든 코드는 Pull Request(PR)를 통해 코드 리뷰를 거친 후 `main` 브랜치에 머지합니다.
    - **일관성**: 프로젝트 전체의 코드 스타일과 구조의 일관성을 유지합니다.

## 2. 기술 스택

- **프론트엔드**: React
- **백엔드**: Node.js (Express)
- **데이터베이스**: SQLite
- **스타일링**: shadcn/ui, Tailwind CSS
- **인증**: JWT (JSON Web Token)
- **실행 환경**: Docker

## 3. 폴더 구조

프로젝트는 다음과 같은 기본 폴더 구조를 따릅니다.

```
/
├── client/      # 프론트엔드 (React)
├── server/      # 백엔드 (Node.js)
├── docs/        # 프로젝트 문서
├── .github/     # GitHub 관련 설정 (템플릿 등)
└── ...
```

## 4. API 엔드포인트 규칙

- 모든 API 엔드포인트는 `design.md`에 정의된 명세를 따릅니다.
- **Endpoint**: `/api/...`
- **데이터 형식**: JSON
- **인증**: JWT 토큰을 `Authorization` 헤더에 `Token` 스킴으로 전송합니다. (`Authorization: Token <jwt>`)

## 5. 프론트엔드 컴포넌트 규칙

- `shadcn/ui`와 `Tailwind CSS`를 사용하여 재사용 가능한 컴포넌트 기반으로 UI를 구축합니다.
- **컴포넌트 구조**: `design.md`의 컴포넌트 설계를 따릅니다.
- **페이지 컴포넌트**: `HomePage`, `ArticleDetailPage`, `EditorPage`, `SettingsPage`, `ProfilePage`, `AuthPage` 등
- **공유 컴포넌트**: `ArticleList`, `CommentList`, `TagList`, `Pagination`, `FollowButton`, `FavoriteButton` 등

## 6. Git 관련 규칙

### 6.1. 브랜치 전략

- **`main`**: 배포 가능한 안정적인 버전의 브랜치입니다.
- **`develop`**: 개발 중인 코드가 머지되는 브랜치입니다.
- **`feature/{issue-number}-{description}`**: 기능 개발을 위한 브랜치입니다.
    - 예: `feature/3-auth-api`
- **`fix/{issue-number}-{description}`**: 버그 수정을 위한 브랜치입니다.
- **`docs/{issue-number}-{description}`**: 문서 작업을 위한 브랜치입니다.

### 6.2. 커밋 메시지 규칙

커밋 메시지는 다음 형식을 따릅니다.

**`타입(스코프): 제목`**

- **타입**:
    - `FEAT`: 새로운 기능 추가
    - `FIX`: 버그 수정
    - `DOCS`: 문서 수정
    - `STYLE`: 코드 포맷팅, 세미콜론 누락 등 (코드 변경이 없는 경우)
    - `REFACTOR`: 코드 리팩토링
    - `TEST`: 테스트 코드 추가/수정
    - `CHORE`: 빌드 업무 수정, 패키지 매니저 설정 등
- **스코프** (선택사항): 변경된 부분 (예: `API`, `CLIENT`, `DB`)
- **제목**: 50자 이내로 명확하고 간결하게 작성합니다.

**예시:**
- `FEAT(API): 사용자 인증 기능 구현`
- `FIX(CLIENT): 로그인 폼 유효성 검사 오류 수정`
- `DOCS: README.md 파일에 설치 방법 추가`

## 7. 코드 스타일 및 기타 규칙

- **코드 스타일**: Prettier와 ESLint를 사용하여 일관된 코드 스타일을 유지합니다. (설정 파일 추후 추가)
- **주석**: 꼭 필요한 경우에만 간결하게 작성합니다.
- **변수/함수명**: 명확하고 의미를 알 수 있도록 작성합니다. (카멜케이스 `camelCase` 사용)

## 8. 개발 프로세스 규칙

- **테스트 주도 개발 (TDD)**: 백엔드 및 핵심 비즈니스 로직은 TDD(Test-Driven Development) 방법론을 따라 구현합니다.
- **아키텍처**: SOLID 원칙을 준수하고 클린 아키텍처(Clean Architecture)를 적용하여 유연하고 확장 가능한 구조를 설계합니다.
- **작업 완료 및 확인**:
    - 각 작업 단위는 기능 구현 후 반드시 관련 테스트 코드를 작성하고 모든 테스트가 통과되어야 합니다.
    - 작업이 완료되면 해당 이슈의 인수 조건(Acceptance Criteria)에 완료 상태를 확인할 수 있는 커멘트를 남깁니다. (예: "User-API 구현 완료. 관련 테스트 통과 확인.")
