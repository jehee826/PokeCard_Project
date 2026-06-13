# 🃏 수집형 카드 거래 및 관리 플랫폼 (TCG Marketplace)

> **AI 기반 OCR 카드 인식 기술과 실시간 소통 인프라를 결합한 풀스택 카드 장터 플랫폼**
> 
> 해외 플랫폼 이용 시 발생하던 통화 이질성(달러-원화 계산 피로도)을 해결하고, 번거로운 카드 등록 절차를 자동화하며, 개인정보 노출 없는 안전한 앱 내 직거래 환경을 제공합니다.

---

## 🚀 주요 기능 (Key Features)

### 1. 카메라 촬영을 통한 자동 카드 등록 (AI OCR)
- **Text Detection & Recognition:** 실물 카드를 촬영하면 픽셀 분석을 통해 글자가 존재할 확률을 계산(히트맵 시각화)하고, 카드 명칭 및 일련번호 구역을 정밀하게 추출합니다.
- **DTO 자동 매핑:** 추출된 문자열 데이터를 자바 DTO 객체와 매핑하여 장터 등록 단계를 획기적으로 단축시킵니다.

### 2. 웹소켓(WebSocket) 기반 실시간 안심 채팅
- **STOMP 프로토콜:** 외부 메신저나 개인 연락처 노출 없이 플랫폼 내부에서 판매자와 구매자가 1:1로 즉각 소통할 수 있는 실시간 채팅 환경을 지원합니다.
- **맞춤형 UX 제공:** 로그인 세션과 게시글 작성자 검증을 통해 본인 글에는 `[상태 변경]`, 타인 글에는 `[채팅하기]` 버튼이 동적으로 활성화됩니다.

### 3. 영속성 계층 최적화 및 세션리스 보안
- **JWT 인증 시스템:** 서버의 부담을 줄이는 무상태(Stateless) 아키텍처 위에서 JWT 토큰을 활용한 유저 권한 제어 및 자원 접근 권한을 관리합니다.
- **데이터 원자성 보장:** `@Transactional` 설계를 통해 장터 글의 판매 상태 변경 및 거래 내역 생성이 동시에 일어날 때 발생할 수 있는 데이터 예외 상황을 완벽히 차단합니다.

---

## 🛠 기술 스택 (Tech Stack)

### Backend
- **Framework & Language:** Spring Boot, Java
- **Security & Auth:** Spring Security, JWT (JSON Web Token)
- **Data Access:** Spring Data JPA, JPQL
- **Real-time Comm:** Spring WebSocket, STOMP

### Frontend
- **Library & Language:** React, TypeScript
- **State & Lifecycle:** React Hooks (`useState`, `useEffect`, `useParams`)
- **HTTP Client:** Axios (Axios 인스턴스화를 통한 Request Interceptor 공통 토큰 탑재 모듈 구축)
- **Real-time Comm:** STOMP Client

---

## 📂 프로젝트 구조 (Architecture)

### 데이터 흐름 및 통신 아키텍처
- **인터셉터 패턴:** 프론트엔드 통신 모듈(`axios.ts`)에서 Request Interceptor가 요청을 가로채 브라우저 스토리지의 토큰 유무를 판단한 뒤 헤더에 자동으로 탑재(`Token Attached`)합니다.
- **무상태 통신:** 백엔드의 `JwtTokenProvider`가 매 요청 헤더의 토큰을 검증하여 통일된 JSON 규격(REST API)으로 데이터를 주고받습니다.

---

## 💻 시작하기 (Getting Started)

### Prerequisites
- Node.js & npm
- Java 17+ / Spring Boot 3.x
- DB 인덱싱 설정 (빠른 데이터 조회를 위해 주요 조회 컬럼에 인덱스 적용 완료)

### Backend 실행
1. `./src/main/resources/application.properties` 또는 `yml` 파일의 DB 및 환경 설정 확인
2. Spring Boot 애플리케이션 실행 (기본 포트: `8080`)

### Frontend 빌드 및 실행 (Local Server)
```bash
# 의존성 설치
npm install

# 프로덕션 빌드 수행
npm run build

# 빌드 결과물(build/dist) 로컬 서버로 정적 서빙 실행
npx serve -s build