# 능주고등학교 분실물 대시보드

## 1. 소개

본 프로젝트는 능주고등학교 분실물 대시보드 사이트입니다. 본 프로젝트는 능주고등학교의 분실물을 LNFMS를 통해 효율적으로 관리하고 급식실 화면을 통해 송출함으로서 학생들에게 편의를 주는데에 의의를 두고 개발되었습니다.

## 2. 기능

- [x] 분실물 조회 및 관리 시스템
- [x] 급식 조회 시스템

## 3. 설치 및 관리 가이드

### 3.1. 설치 및 설정

설치전에, 루트 폴더에 `.env` 파일을 생성하여 다음과 같은 환경 변수를 설정해야 합니다.

```env
VITE_DATABASE_URL=file:ABSOLUTE_PATH_TO_DB_FILE
VITE_SESSION_SECRET=DO_NOT_USE_IN_PRODUCTION
VITE_STATIC_FILE_PATH=ABSOLUTE_PATH_TO_STATIC_FILE_DIRECTORY
VITE_NEIS_API_KEY=YOUR_NEIS_API_KEY
```

각각의 변수의 의미는 다음과 같습니다.

- `VITE_DATABASE_URL`: 데이터 베이스 파일 위치입니다 "file:경로" 형태로 저장해주세요. 추천: (file:./db.db)
- `VITE_SESSION_SECRET`: 세션을 생성할 때 쓰이는 시크릿 키입니다.
- `VITE_STATIC_FILE_PATH`: 정적 폴더 위치입니다. 추천: (./static)
- `VITE_NEIS_API_KEY`: 나이스 API키 입니다.

본 프로젝트에서는 데이터를 저장하기 위해서 `drizzle-orm`을 사용합니다. 따라서, 다음과 같은 명령어를 실행하여 필요한 패키지를 설치하고 데이터베이스를 생성해야 합니다.

```bash
pnpm install
touch db.db
pnpm drizzle-kit generate
pnpm drizzle-kit push
pnpm dev
```

### 3.2. DB 관리

[drizzle-kit](https://kit.drizzle.team/)을 사용해서 관리할 수 있습니다.

대표적인 명령어는 다음과 같습니다.

- `pnpm drizzle-kit generate`: 데이터베이스 초기화 및 업데이트용 파일을 생성합니다.
- `pnpm drizzle-kit push`: 데이터베이스 초기화 및 업데이트용 파일을 실행합니다.
- `pnpm drizzle-kit studio`: 데이터베이스를 온라인으로 관리할 수 있는 페이지를 실행합니다.

## 4. 배포

본 프로젝트는 도커를 통해 배포할 수 있습니다. 다음과 같은 명령어를 실행하여 도커 이미지를 빌드하고 배포할 수 있습니다.

> [!WARNING]
> 현재 사용하는 이미지는 `traefik`과 일부 환경에 최적화되어 있습니다.
> 다른 환경에서 사용하기 위해서는 `Dockerfile`과 `docker-compose.yml`을 수정해야 합니다.

```bash
docker compose up --build -d
```

## 5. 참고자료

본 프로젝트는 [react-router v7](https://reactrouter.com/), [shadcn/ui](https://ui.shadcn.com/), [drizzle-orm](https://orm.drizzle.team)을 사용하고 있습니다. 사용하는 라이브러리를 숙지하여 개발하여주시길 바랍니다.

## 제작자

- [@charlie-1126](https://github.com/charlie-1126)
- [@bmcyver](https://github.com/bmcyver)
