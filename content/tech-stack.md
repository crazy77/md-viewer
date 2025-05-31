---
title: "기술 스택"
description: "최신 웹 기술로 구축된 마크다운 뷰어의 기술 스택을 소개합니다."
code: "tech-stack"
image: "/images/docs/tech-stack.svg"
---

# 🚀 기술 스택

최신 웹 기술들을 활용해 구축된 현대적인 마크다운 뷰어입니다.

## 🏗️ 프론트엔드 프레임워크

### Next.js 15
```typescript
// App Router 사용
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Page',
  description: 'Page description'
}

export default function Page() {
  return <div>Hello, Next.js 15!</div>
}
```

**주요 특징:**
- ⚛️ **React 18** 기반의 최신 프레임워크
- 🏃‍♂️ **App Router** 사용으로 향상된 라우팅
- 🔄 **Server Components** 지원
- 📈 **성능 최적화** 자동 적용
- 🎯 **TypeScript** 완전 지원

### React 18
```jsx
// Server Components
async function ServerComponent() {
  const data = await fetchData() // 서버에서 실행
  return <ClientComponent data={data} />
}

// Client Components
'use client'
function ClientComponent({ data }) {
  const [state, setState] = useState(data)
  return <div>{/* 인터랙티브 UI */}</div>
}
```

## 📘 타입 시스템

### TypeScript
```typescript
// 마크다운 파일 타입 정의
interface MarkdownFile {
  code: string
  title: string
  description?: string
  image?: string
  filename: string
  lastModified: string
  content: string
  slug: string
}

// 페이지 Props 타입
interface PageProps {
  params: Promise<{ code: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}
```

**장점:**
- 🛡️ **컴파일 타임 오류 검출**
- 🔧 **자동 완성 지원**
- 📚 **코드 문서화**
- 🚀 **리팩토링 안전성**

## 🎨 스타일링

### Tailwind CSS
```tsx
// 유틸리티 클래스 기반 스타일링
<div className="bg-gradient-to-r from-blue-500 to-purple-600 
                rounded-lg shadow-xl p-6 
                hover:scale-105 transition-transform duration-300">
  <h1 className="text-2xl font-bold text-white mb-4">
    Beautiful Design
  </h1>
</div>
```

**특징:**
- 🎯 **유틸리티 퍼스트** 접근법
- 📱 **반응형 디자인** 쉬운 구현
- 🌙 **다크 모드** 내장 지원
- ⚡ **빠른 개발 속도**
- 🗜️ **작은 번들 크기** (Purge CSS)

### CSS 변수 & 그라데이션
```css
/* 다크 모드 지원 */
:root {
  --background: #ffffff;
  --foreground: #000000;
}

[data-theme="dark"] {
  --background: #0a0a0a;
  --foreground: #ffffff;
}

/* 그라데이션 효과 */
.gradient-bg {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

## 📝 마크다운 처리

### React Markdown
```tsx
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

<ReactMarkdown
  remarkPlugins={[remarkGfm]}
  components={{
    code: CodeBlock,
    h1: CustomHeading,
    img: OptimizedImage,
  }}
>
  {markdownContent}
</ReactMarkdown>
```

### Gray Matter
```typescript
import matter from 'gray-matter'

const { data, content } = matter(markdownString)
// data: frontmatter 객체
// content: 마크다운 본문
```

**지원 기능:**
- ✅ **GitHub Flavored Markdown**
- 🎨 **문법 하이라이팅**
- 📊 **표 렌더링**
- ☑️ **체크박스 목록**
- 🔗 **자동 링크 변환**

## 🔧 코드 하이라이팅

### React Syntax Highlighter
```tsx
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'

<SyntaxHighlighter
  language="typescript"
  style={oneDark}
  showLineNumbers
  wrapLines
>
  {codeString}
</SyntaxHighlighter>
```

**지원 언어:**
- JavaScript/TypeScript
- Python
- Java
- C/C++
- CSS/SCSS
- HTML
- JSON
- YAML
- Shell
- 그 외 100+ 언어

## ⚡ 상태 관리

### Jotai
```typescript
import { atom, useAtom } from 'jotai'

// 원자 정의
const themeAtom = atom<'light' | 'dark'>('light')

// 컴포넌트에서 사용
function ThemeToggle() {
  const [theme, setTheme] = useAtom(themeAtom)
  
  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  )
}
```

**특징:**
- 🔬 **원자 단위** 상태 관리
- 🪶 **경량** (2.4kb gzipped)
- 🔄 **반응형** 업데이트
- 🧪 **TypeScript** 친화적

## 🖼️ 이미지 최적화

### Next.js Image
```tsx
import Image from 'next/image'

<Image
  src="/images/hero.jpg"
  alt="Hero Image"
  width={1200}
  height={630}
  priority
  sizes="(max-width: 768px) 100vw, 
         (max-width: 1200px) 100vw, 
         100vw"
/>
```

**최적화 기능:**
- 🗜️ **자동 압축** (WebP, AVIF)
- 📐 **자동 리사이징**
- 🖼️ **지연 로딩** (Lazy Loading)
- 📱 **반응형 이미지**
- ⚡ **성능 최적화**

## 🔍 SEO 최적화

### Metadata API
```typescript
export const metadata: Metadata = {
  title: 'My App',
  description: 'Description',
  openGraph: {
    title: 'My App',
    description: 'Description',
    images: ['/og-image.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
  },
}
```

## 🛠️ 개발 도구

### ESLint & Prettier
```json
{
  "extends": ["next/core-web-vitals"],
  "rules": {
    "prefer-const": "error",
    "no-unused-vars": "warn"
  }
}
```

### Husky & lint-staged
```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"]
  }
}
```

## 📦 패키지 관리

### npm/yarn
```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 린팅
npm run lint
```

## 🚀 배포 & 호스팅

### Vercel (권장)
```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
vercel

# 프로덕션 배포
vercel --prod
```

### 기타 옵션
- **Netlify** - JAMstack 호스팅
- **Cloudflare Pages** - Edge 배포
- **GitHub Pages** - 정적 사이트
- **AWS S3 + CloudFront** - 자체 호스팅

## 📊 성능 지표

### Core Web Vitals
- ⚡ **LCP**: < 2.5초 (Largest Contentful Paint)
- 🎯 **FID**: < 100ms (First Input Delay)
- 📐 **CLS**: < 0.1 (Cumulative Layout Shift)

### Lighthouse 점수
- 🟢 **Performance**: 95+
- 🟢 **Accessibility**: 100
- 🟢 **Best Practices**: 100
- 🟢 **SEO**: 100

---

**현대적이고 확장 가능한 아키텍처로 미래를 준비합니다!** ✨ 