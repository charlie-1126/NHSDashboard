# 능주고등학교 분실물 대시보드

## 1. 소개

본 프로젝트는 <!-- TODO: README 작성 -->

## 2. 기능

- [ ] 분실물 관리 시스템
- [ ] 분실물 조회 시스템
- [ ] 급식 조회 시스템

## 3. 개발 및 관리 가이드

### 3.1 설치 및 설정

본 프로젝트에서는 데이터를 저장하기 위해서 `sqlite3`와 `drizzle-kit`을 사용합니다. 따라서, 다음과 같은 명령어를 실행하여 필요한 패키지를 설치하고 데이터베이스를 생성해야 합니다.

```bash
pnpm install
touch db.db
pnpm drizzle-kit:push
pnpm dev
```

### 3.2 기능 추가 및 수정

본 프로젝트는 [react-router v7](https://reactrouter.com/), [shadcn/ui](https://ui.shadcn.com/), [drizzle-orm](https://orm.drizzle.team)을 사용하고 있습니다. 사용하는 라이브러리를 숙지하여 개발하여주시길 바랍니다.

## 3.3 배포

본 프로젝트는 도커를 통해 배포할 수 있습니다. 다음과 같은 명령어를 실행하여 도커 이미지를 빌드하고 배포할 수 있습니다.

> [!WARNING]
> 현재 사용하는 이미지는 `traefik`에 최적화되어 있습니다.
> 다른 환경에서 사용하기 위해서는 `Dockerfile`과 `docker-compose.yml`을 수정해야 합니다.

```bash
docker compose up --build -d
```

### 3.4 DB 관리

[drizzle-kit](https://kit.drizzle.team/)을 사용해서 관리할 수 있습니다.

대표적인 명령어는 다음과 같습니다.

- `pnpm drizzle-kit generate`: 데이터베이스 초기화 및 업데이트용 파일을 생성합니다.
- `pnpm drizzle-kit push`: 데이터베이스 초기화 및 업데이트용 파일을 실행합니다.
- `pnpm drizzle-kit studio`: 데이터베이스를 온라인으로 관리할 수 있는 페이지를 실행합니다.

## 제작자

- [@charlie-1126](https://github.com/charlie-1126)
- [@bmcyver](https://github.com/bmcyver)
