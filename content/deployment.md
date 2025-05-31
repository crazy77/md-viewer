---
title: "배포 가이드"
description: "마크다운 뷰어를 다양한 플랫폼에 배포하는 방법을 자세히 알아보세요."
code: "deployment"
---

# 🚀 배포 가이드

마크다운 뷰어를 프로덕션 환경에 배포하는 다양한 방법들을 소개합니다. 각 플랫폼별 장단점과 상세한 배포 절차를 확인해보세요!

## 📋 배포 전 체크리스트

### 필수 준비사항
- [x] 프로젝트 테스트 완료
- [x] 환경 변수 설정
- [x] 빌드 테스트 성공
- [x] 도메인 준비 (선택사항)
- [x] SSL 인증서 (HTTPS)

### 성능 최적화
```bash
# 프로덕션 빌드 테스트
npm run build
npm run start

# 번들 분석
npm install --save-dev @next/bundle-analyzer
```

### 환경 설정
```bash
# .env.production 파일 생성
NODE_ENV=production
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

## 🌐 Vercel 배포 (권장)

Vercel은 Next.js를 만든 회사의 플랫폼으로, 가장 간단하고 최적화된 배포를 제공합니다.

### 자동 배포 설정

#### 1. GitHub 연동

```bash
# 1. GitHub에 프로젝트 푸시
git add .
git commit -m "🚀 Initial commit for deployment"
git push origin main
```

#### 2. Vercel 설정

1. [Vercel 웹사이트](https://vercel.com) 접속
2. GitHub로 로그인
3. "Import Project" 클릭
4. 저장소 선택
5. 프로젝트 설정:

```json
{
  "name": "markdown-viewer",
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "devCommand": "npm run dev"
}
```

#### 3. 환경 변수 설정

Vercel 대시보드에서:
```
Settings → Environment Variables

NEXT_PUBLIC_BASE_URL = https://your-project.vercel.app
NODE_ENV = production
```

### 수동 배포

```bash
# Vercel CLI 설치
npm install -g vercel

# 로그인
vercel login

# 프로젝트 디렉토리에서 배포
vercel

# 프로덕션 배포
vercel --prod
```

### 배포 결과

```
✅ Deployment Complete!
🔗 Preview: https://markdown-viewer-abc123.vercel.app
🔗 Production: https://your-domain.com
```

## 📦 Netlify 배포

정적 사이트 호스팅에 특화된 플랫폼입니다.

### 자동 배포

#### 1. 빌드 설정

`netlify.toml` 파일 생성:

```toml
[build]
  publish = "out"
  command = "npm run build && npm run export"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/view/*"
  to = "/view/[code]"
  status = 200

[[redirects]]
  from = "/*"
  to = "/404.html"
  status = 404
```

#### 2. Next.js 설정 수정

`next.config.js` 수정:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig
```

#### 3. Package.json 스크립트 추가

```json
{
  "scripts": {
    "export": "next export"
  }
}
```

### 수동 배포

```bash
# 빌드 및 export
npm run build
npm run export

# Netlify CLI 설치
npm install -g netlify-cli

# 로그인
netlify login

# 수동 배포
netlify deploy --dir=out

# 프로덕션 배포
netlify deploy --prod --dir=out
```

## ☁️ AWS S3 + CloudFront 배포

엔터프라이즈급 성능과 확장성을 원할 때 선택합니다.

### S3 버킷 설정

```bash
# AWS CLI 설치 및 설정
aws configure

# S3 버킷 생성
aws s3 mb s3://your-markdown-viewer

# 정적 웹사이트 호스팅 활성화
aws s3 website s3://your-markdown-viewer \
  --index-document index.html \
  --error-document 404.html
```

### 빌드 및 업로드

```bash
# 정적 빌드
npm run build
npm run export

# S3에 업로드
aws s3 sync out/ s3://your-markdown-viewer --delete

# 퍼블릭 액세스 설정
aws s3api put-bucket-policy \
  --bucket your-markdown-viewer \
  --policy file://bucket-policy.json
```

### CloudFront 배포

`cloudfront-config.json`:

```json
{
  "CallerReference": "markdown-viewer-cf",
  "Comment": "Markdown Viewer CDN",
  "DefaultRootObject": "index.html",
  "Origins": {
    "Quantity": 1,
    "Items": [{
      "Id": "S3-your-markdown-viewer",
      "DomainName": "your-markdown-viewer.s3.amazonaws.com",
      "S3OriginConfig": {
        "OriginAccessIdentity": ""
      }
    }]
  }
}
```

## 🐳 Docker 배포

컨테이너 기반 배포로 어떤 환경에서도 동일한 실행을 보장합니다.

### Dockerfile 작성

```dockerfile
# Multi-stage build
FROM node:18-alpine AS dependencies
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

### Docker Compose

`docker-compose.yml`:

```yaml
version: '3.8'

services:
  markdown-viewer:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_BASE_URL=http://localhost:3000
    volumes:
      - ./content:/app/content:ro
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - markdown-viewer
    restart: unless-stopped
```

### 배포 실행

```bash
# 이미지 빌드
docker build -t markdown-viewer .

# 컨테이너 실행
docker run -p 3000:3000 markdown-viewer

# Docker Compose로 실행
docker-compose up -d
```

## 🖥️ 전용 서버 배포

VPS나 전용 서버에 직접 배포하는 방법입니다.

### 서버 환경 준비

```bash
# Ubuntu/Debian 기준
sudo apt update
sudo apt install nodejs npm nginx certbot

# Node.js 18+ 설치 (NodeSource)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# PM2 설치 (프로세스 관리자)
sudo npm install -g pm2
```

### 프로젝트 설정

```bash
# 프로젝트 클론
git clone <your-repository>
cd markdown-viewer

# 의존성 설치
npm ci --only=production

# 빌드
npm run build

# PM2로 실행
pm2 start npm --name "markdown-viewer" -- start
pm2 save
pm2 startup
```

### Nginx 설정

`/etc/nginx/sites-available/markdown-viewer`:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # 정적 파일 캐싱
    location /_next/static/ {
        proxy_pass http://localhost:3000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### SSL 인증서 설정

```bash
# Let's Encrypt 인증서 발급
sudo certbot --nginx -d your-domain.com

# 자동 갱신 설정
sudo crontab -e
# 다음 줄 추가: 0 12 * * * certbot renew --quiet
```

## 🔧 성능 최적화

### Next.js 설정 최적화

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // 압축 활성화
  compress: true,
  
  // 이미지 최적화
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30일
  },

  // 웹팩 최적화
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization.splitChunks.chunks = 'all'
    }
    return config
  },

  // 헤더 설정
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
```

### 캐싱 전략

```javascript
// 정적 리소스 캐싱
// nginx.conf
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
    add_header Vary Accept-Encoding;
    gzip_static on;
}

// API 캐싱
location /api/ {
    proxy_pass http://localhost:3000;
    proxy_cache_valid 200 302 10m;
    proxy_cache_valid 404 1m;
}
```

## 📊 모니터링 및 로깅

### 성능 모니터링

```javascript
// 성능 측정 (pages/_app.js)
export function reportWebVitals(metric) {
  console.log(metric)
  
  // 분석 도구로 전송
  if (metric.label === 'web-vital') {
    // Google Analytics, DataDog 등
    gtag('event', metric.name, {
      value: Math.round(metric.value),
      event_label: metric.id,
      non_interaction: true,
    })
  }
}
```

### 로그 설정

```javascript
// PM2 로그 설정
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'markdown-viewer',
    script: 'npm',
    args: 'start',
    log_file: './logs/combined.log',
    out_file: './logs/out.log',
    error_file: './logs/error.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true
  }]
}
```

## 🔒 보안 설정

### 환경 변수 보안

```bash
# .env.production (서버에만 저장)
DATABASE_URL=postgresql://user:pass@localhost/db
JWT_SECRET=your-super-secret-key
ENCRYPTION_KEY=32-character-key

# 파일 권한 설정
chmod 600 .env.production
```

### 방화벽 설정

```bash
# UFW 방화벽 (Ubuntu)
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable

# 특정 IP만 허용 (관리자 접근)
sudo ufw allow from YOUR_IP to any port 22
```

## 🚨 트러블슈팅

### 자주 발생하는 문제들

#### 빌드 실패

```bash
# 메모리 부족
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build

# 타입 오류
npm run type-check
```

#### 라우팅 문제

```javascript
// 정적 export 시 동적 라우팅 설정
// next.config.js
module.exports = {
  async exportPathMap() {
    const paths = {
      '/': { page: '/' },
      '/view/hello': { page: '/view/[code]', query: { code: 'hello' } },
      // 다른 경로들...
    }
    return paths
  }
}
```

#### 성능 문제

```bash
# 번들 크기 분석
npm install --save-dev webpack-bundle-analyzer
npm run analyze

# 이미지 최적화
npm install sharp
```

## 📈 성능 벤치마크

### 목표 지표

| 지표 | 목표 | 측정 방법 |
|------|------|-----------|
| First Contentful Paint | < 1.5초 | Lighthouse |
| Largest Contentful Paint | < 2.5초 | Core Web Vitals |
| Time to Interactive | < 3.0초 | PageSpeed Insights |
| Cumulative Layout Shift | < 0.1 | 실제 사용자 측정 |

### 성능 테스트

```bash
# Lighthouse CI 설정
npm install -g @lhci/cli

# lighthouserc.js
module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:3000'],
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', {minScore: 0.9}],
        'categories:accessibility': ['error', {minScore: 0.9}],
      },
    },
  },
}
```

## 🎯 배포 후 체크리스트

### 기능 검증
- [ ] 홈페이지 로딩 확인
- [ ] 마크다운 파일 목록 표시
- [ ] 개별 문서 페이지 접근
- [ ] 코드 하이라이팅 동작
- [ ] 404 페이지 처리
- [ ] 반응형 디자인 확인

### 성능 검증
- [ ] PageSpeed Insights 점수 확인
- [ ] Core Web Vitals 측정
- [ ] 로딩 시간 벤치마크
- [ ] 모바일 성능 테스트

### 보안 검증
- [ ] HTTPS 인증서 확인
- [ ] 보안 헤더 설정
- [ ] 취약점 스캔 실행
- [ ] 접근 권한 검토

---

**성공적인 배포를 위해 단계별로 차근차근 진행하세요!** 🚀

문제가 발생하면 로그를 확인하고, 커뮤니티나 공식 문서를 참고하여 해결해보세요. 