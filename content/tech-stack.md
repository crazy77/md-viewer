---
title: "기술 스택 & 아키텍처"
description: "마크다운 뷰어 프로젝트에서 사용된 기술 스택과 아키텍처에 대한 설명입니다."
code: "tech"
---

# 🛠️ 기술 스택 & 아키텍처

마크다운 뷰어 프로젝트의 기술적 세부사항과 아키텍처를 소개합니다.

## 📦 기술 스택

### Frontend

| 기술 | 버전 | 목적 |
|------|------|------|
| **Next.js** | Latest | React 기반 풀스택 프레임워크 |
| **React** | ^18 | UI 라이브러리 |
| **TypeScript** | ^5 | 정적 타입 검사 |
| **Tailwind CSS** | ^3.4 | 유틸리티 퍼스트 CSS 프레임워크 |

### Markdown 처리

| 패키지 | 버전 | 목적 |
|--------|------|------|
| **react-markdown** | ^9.0.1 | 마크다운 렌더링 |
| **remark-gfm** | ^4.0.0 | GitHub Flavored Markdown 지원 |
| **gray-matter** | ^4.0.3 | Frontmatter 파싱 |
| **react-syntax-highlighter** | ^15.5.0 | 코드 문법 하이라이팅 |

### 개발 도구

```json
{
  "eslint": "^8",
  "eslint-config-next": "latest",
  "@types/node": "^20",
  "@types/react": "^18",
  "@types/react-dom": "^18"
}
```

## 🏗️ 프로젝트 구조

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
├── content/               # 마크다운 파일 저장소
│   ├── hello-world.md
│   ├── guide.md
│   └── tech-stack.md
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
└── next.config.js
```

## 🔧 아키텍처 패턴

### 1. App Router 활용

Next.js 13+의 App Router를 사용하여 최신 React 기능들을 활용합니다:

```typescript
// app/page.tsx - Server Component
export default async function HomePage() {
  const markdownFiles = await getMarkdownFiles()
  return <div>{/* JSX */}</div>
}
```

### 2. Server Components 우선

가능한 모든 컴포넌트를 Server Component로 구현하여 성능을 최적화합니다:

- 빌드 타임에 마크다운 파일 스캔
- 서버사이드에서 파일 시스템 접근
- 클라이언트 번들 사이즈 최소화

### 3. 파일 기반 CMS

별도의 데이터베이스 없이 파일 시스템을 CMS로 활용:

```typescript
// lib/markdown.ts
export async function getMarkdownFiles() {
  const contentDirectory = path.join(process.cwd(), 'content')
  // 파일 시스템에서 직접 읽기
}
```

### 4. Frontmatter 기반 메타데이터

YAML Frontmatter를 통한 메타데이터 관리:

```yaml
---
title: "문서 제목"
description: "문서 설명"
code: "unique-code"
---
```

## 🎨 스타일링 전략

### Tailwind CSS 설정

```javascript
// tailwind.config.js
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  plugins: [require('@tailwindcss/typography')],
}
```

### 반응형 디자인

```css
/* 모바일 우선 접근법 */
.container {
  @apply px-4;
}

/* 태블릿 */
@media (min-width: 768px) {
  .container {
    @apply px-6;
  }
}

/* 데스크톱 */
@media (min-width: 1024px) {
  .container {
    @apply px-8;
  }
}
```

## 🚀 성능 최적화

### 1. 정적 생성 (SSG)

```typescript
// 빌드 타임에 마크다운 파일 처리
export default async function ViewPage({ params }: { params: { code: string } }) {
  const markdown = await getMarkdownByCode(params.code)
  // ...
}
```

### 2. 코드 스플리팅

```typescript
// 동적 임포트로 번들 사이즈 최적화
const SyntaxHighlighter = dynamic(
  () => import('react-syntax-highlighter'),
  { ssr: false }
)
```

### 3. 이미지 최적화

```typescript
import Image from 'next/image'

// Next.js 내장 이미지 최적화
<Image
  src="/example.jpg"
  alt="Example"
  width={800}
  height={600}
  priority
/>
```

## 🔒 타입 안전성

### 인터페이스 정의

```typescript
// lib/markdown.ts
export interface MarkdownFile {
  code: string
  title: string
  description?: string
  filename: string
  lastModified: string
  content: string
  slug: string
}
```

### 엄격한 TypeScript 설정

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true
  }
}
```

## 📱 접근성 (A11y)

### 시맨틱 HTML

```jsx
<article>
  <header>
    <h1>{title}</h1>
  </header>
  <main className="markdown-content">
    {/* 마크다운 내용 */}
  </main>
</article>
```

### 키보드 네비게이션

```jsx
<Link
  href={`/view/${code}`}
  className="focus:ring-2 focus:ring-blue-500"
>
  {title}
</Link>
```

## 🧪 확장 가능성

### 플러그인 시스템

```typescript
// 향후 플러그인 지원 구조
interface MarkdownPlugin {
  name: string
  transform: (content: string) => string
}

const plugins: MarkdownPlugin[] = [
  { name: 'math', transform: renderMath },
  { name: 'mermaid', transform: renderDiagram }
]
```

### 테마 시스템

```typescript
// 테마 전환 지원
interface Theme {
  name: string
  colors: {
    primary: string
    secondary: string
    background: string
  }
}
```

## 🔄 배포 전략

### Vercel 최적화

```javascript
// next.config.js
module.exports = {
  output: 'standalone', // Docker 배포를 위한 설정
  experimental: {
    outputFileTracingRoot: path.join(__dirname, '../../'),
  }
}
```

### 환경별 설정

```bash
# .env.local
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# .env.production
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

---

**이 기술 스택으로 확장 가능하고 유지보수가 쉬운 마크다운 뷰어를 구현했습니다!** 🎯 