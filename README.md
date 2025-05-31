# 📚 Markdown Viewer

마크다운 파일을 웹에서 아름답게 읽을 수 있는 플랫폼입니다.

## ✨ 주요 기능

- 📁 **자동 파일 스캔**: `content` 폴더의 마크다운 파일을 자동으로 감지
- 🔗 **고유 URL 생성**: 각 파일마다 특정 코드로 접근 가능한 URL 제공
- 🎨 **문법 하이라이팅**: 다양한 프로그래밍 언어 지원
- 📱 **반응형 디자인**: 모바일, 태블릿, 데스크톱 최적화
- ⚡ **빠른 성능**: Next.js Server Components와 정적 생성 활용
- 🎯 **GitHub Flavored Markdown**: 표, 체크박스, 취소선 등 고급 기능 지원

## 🚀 빠른 시작

### 1. 의존성 설치

```bash
npm install
# 또는
yarn install
# 또는
pnpm install
```

### 2. 개발 서버 실행

```bash
npm run dev
# 또는
yarn dev
# 또는
pnpm dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

### 3. 마크다운 파일 추가

`content` 폴더에 `.md` 파일을 추가하세요:

```markdown
---
title: "문서 제목"
description: "문서에 대한 설명"
code: "unique-code"
---

# 마크다운 내용

여기에 마크다운 내용을 작성하세요!
```

## 📁 프로젝트 구조

```
markdown-viewer/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # 루트 레이아웃
│   ├── page.tsx           # 홈페이지
│   ├── not-found.tsx      # 404 페이지
│   ├── globals.css        # 글로벌 스타일
│   └── view/
│       └── [code]/
│           └── page.tsx   # 마크다운 뷰어 페이지
├── lib/
│   └── markdown.ts        # 마크다운 유틸리티
├── content/               # 마크다운 파일 저장소 📁
│   ├── hello-world.md
│   ├── guide.md
│   └── tech-stack.md
└── ...설정 파일들
```

## 🔧 기술 스택

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, @tailwindcss/typography
- **Markdown**: react-markdown, remark-gfm, gray-matter
- **Code Highlighting**: react-syntax-highlighter

## 📝 Frontmatter 설정

각 마크다운 파일의 상단에 YAML frontmatter를 추가할 수 있습니다:

```yaml
---
title: "문서 제목"           # 선택사항 (없으면 파일명 사용)
description: "문서 설명"     # 선택사항
code: "unique-code"         # 선택사항 (URL에 사용, 없으면 파일명 사용)
---
```

## 🌐 URL 구조

- **홈페이지**: `/`
- **마크다운 뷰어**: `/view/{code}`

예시:
- `/view/hello` → `hello-world.md` (code: "hello")
- `/view/guide` → `guide.md` (code: "guide")
- `/view/tech` → `tech-stack.md` (code: "tech")

## 🎨 마크다운 지원 기능

### 기본 문법
- 제목 (H1-H6)
- **볼드**, *이탤릭*, ~~취소선~~
- `인라인 코드`
- 링크, 이미지
- 목록 (순서있음/없음)
- 인용문
- 구분선

### GitHub Flavored Markdown (GFM)
- [x] 체크박스
- 표 (Tables)
- 코드 블록 (문법 하이라이팅)
- 자동 링크

### 지원 언어 (코드 하이라이팅)
- JavaScript/TypeScript
- Python
- Java
- C/C++
- HTML/CSS
- JSON/YAML
- Bash/Shell
- 그 외 다수

## 🚀 배포

### 환경변수 설정

OpenGraph 이미지가 올바른 절대 URL로 생성되도록 하려면 환경변수를 설정하세요:

```bash
# .env.local 파일 생성
NEXT_PUBLIC_SITE_URL=https://your-domain.com

# 예시:
# NEXT_PUBLIC_SITE_URL=https://markdown-viewer.vercel.app
# NEXT_PUBLIC_SITE_URL=https://mydocs.netlify.app
```

**중요**: 
- Vercel 배포 시에는 `VERCEL_URL`이 자동으로 설정되므로 별도 설정이 불필요합니다
- 다른 플랫폼 배포 시에는 `NEXT_PUBLIC_SITE_URL`을 실제 도메인으로 설정하세요
- 환경변수를 설정하지 않으면 상대 경로가 사용되어 소셜 미디어에서 이미지가 표시되지 않을 수 있습니다

### Vercel 배포

1. GitHub에 프로젝트 업로드
2. [Vercel](https://vercel.com)에서 Import
3. 자동 배포 완료!

### 기타 플랫폼

```bash
# 빌드
npm run build

# 프로덕션 실행
npm run start
```

## 🔧 개발 스크립트

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm run start

# 린트 검사
npm run lint
```

## 📖 사용 예시

### 1. 기술 문서 관리
```
content/
├── api-guide.md
├── deployment.md
└── troubleshooting.md
```

### 2. 블로그 포스트
```
content/
├── 2024-01-15-first-post.md
├── 2024-01-20-tech-review.md
└── 2024-02-01-best-practices.md
```

### 3. 프로젝트 문서화
```
content/
├── getting-started.md
├── api-reference.md
├── examples.md
└── changelog.md
```

## 🤝 기여하기

1. Fork 프로젝트
2. Feature 브랜치 생성 (`git checkout -b feature/amazing-feature`)
3. 변경사항 커밋 (`git commit -m '✨ Add amazing feature'`)
4. 브랜치에 Push (`git push origin feature/amazing-feature`)
5. Pull Request 생성

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 🙋‍♂️ 문의사항

프로젝트에 대한 질문이나 제안사항이 있으시면 이슈를 생성해 주세요!

---

**Happy Reading! 📚✨** 