**배경 (Background)**:
사용자가 서비스를 이용하기 위한 가장 기본적인 기능인 회원가입과 로그인을 구현합니다. 인증은 JWT(JSON Web Token)를 사용하여 API 요청의 유효성을 검증합니다. 이는 [PRD 문서 2.1. 사용자 인증](https://github.com/MatSalt/vibecoding_study/blob/main/docs/PRD.md#21-%EC%82%AC%EC%9A%A9%EC%9E%90-%EC%9D%B8%증-authentication) 요구사항에 해당합니다.

**작업 내용 (Tasks)**:
- [x] **데이터베이스 모델링**:
    - [x] `USERS` 테이블 스키마 정의 (`id`, `username`, `email`, `password_hash`, `bio`, `image_url`)
    - [x] `sequelize`를 사용하여 `User` 모델 생성 및 마이그레이션
- [x] **API 엔드포인트 구현**:
    - [x] `POST /api/users` (회원가입)
        - 요청: `username`, `email`, `password`
        - 응답: JWT를 포함한 사용자 객체
    - [x] `POST /api/users/login` (로그인)
        - 요청: `email`, `password`
        - 응답: JWT를 포함한 사용자 객체
- [x] **인증 로직 구현**:
    - [x] 비밀번호 해싱(hashing)하여 데이터베이스에 저장
    - [x] 로그인 시 비밀번호 검증
    - [x] JWT 생성 및 서명 로직 구현
- [x] **API 명세 준수**:
    - [x] 모든 요청/응답은 [RealWorld API Spec](https://www.realworld.how/docs/specs/backend-specs/endpoints#authentication)을 따라야 함

**참고 문서 (References)**:
-   **제품 요구사항**: [docs/PRD.md#2.1-사용자-인증](https://github.com/MatSalt/vibecoding_study/blob/main/docs/PRD.md#21-%EC%82%AC%EC%9A%A9%EC%9E%90-%EC%9D%B8%증-authentication)
-   **API 및 DB 설계**: [docs/design.md#5-API-엔드포인트-설계](https://github.com/MatSalt/vibecoding_study/blob/main/docs/design.md#5-api-%EC%97%94%EB%93%9C%ED%8F%AC%EC%9D%B8%ED%8A%B8-%EC%84%A4%EA%B3%84)

**인수 조건 (Acceptance Criteria)**:
- `POST /api/users` 요청을 통해 새로운 사용자를 생성할 수 있다.
- 생성된 사용자는 `POST /api/users/login` 요청을 통해 로그인하고 JWT 토큰을 발급받을 수 있다.
- 잘못된 정보로 로그인 시도 시, 4xx 에러를 반환해야 한다.