---
title: "API 문서"
description: "마크다운 뷰어의 내부 API 및 유틸리티 함수들에 대한 상세 문서입니다."
code: "api"
---

# 📚 API 문서

마크다운 뷰어의 내부 API와 유틸리티 함수들에 대한 상세한 문서입니다.

## 📁 파일 구조

```
project/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # 루트 레이아웃
│   ├── page.tsx           # 홈페이지
│   ├── not-found.tsx      # 404 페이지
│   ├── globals.css        # 전역 스타일
│   └── view/[code]/       # 동적 라우트
│       └── page.tsx       # 마크다운 뷰어
├── lib/                   # 유틸리티 라이브러리
│   └── markdown.ts        # 마크다운 처리 함수
├── content/               # 마크다운 파일들
└── public/                # 정적 자산
```

## 🔧 Core API Functions

### `getMarkdownFiles()`

모든 마크다운 파일의 메타데이터를 가져옵니다.

```typescript
function getMarkdownFiles(): Promise<MarkdownFile[]>
```

**Returns:**
```typescript
interface MarkdownFile {
  code: string          // 고유 식별 코드
  title: string         // 문서 제목
  description?: string  // 문서 설명 (선택사항)
  filename: string      // 파일명
  lastModified: string  // 최종 수정일 (ISO 8601)
  content: string       // 마크다운 내용
  slug: string          // URL 슬러그
}
```

**Usage:**
```typescript
// 홈페이지에서 파일 목록 표시
const files = await getMarkdownFiles()
```

**Example Response:**
```json
[
  {
    "code": "hello",
    "title": "Hello World",
    "description": "첫 번째 마크다운 문서입니다.",
    "filename": "hello-world.md",
    "lastModified": "2024-01-15T10:30:00.000Z",
    "content": "# Hello World\n\n안녕하세요!",
    "slug": "hello-world"
  }
]
```

### `getMarkdownByCode()`

특정 코드로 마크다운 파일을 조회합니다.

```typescript
function getMarkdownByCode(code: string): Promise<MarkdownFile | null>
```

**Parameters:**
- `code` (string): 찾을 마크다운 파일의 고유 코드

**Returns:**
- `MarkdownFile | null`: 해당 코드의 파일이 있으면 파일 객체, 없으면 null

**Usage:**
```typescript
// 특정 문서 조회
const markdown = await getMarkdownByCode('hello')
if (!markdown) {
  notFound() // Next.js 404 페이지로 리다이렉트
}
```

**Error Handling:**
```typescript
try {
  const markdown = await getMarkdownByCode(code)
  if (!markdown) {
    // 파일을 찾을 수 없음
    return notFound()
  }
  // 정상 처리
} catch (error) {
  console.error('파일 읽기 오류:', error)
  // 에러 페이지로 리다이렉트
}
```

## 🏗️ Internal Functions

### `parseMarkdownFile()`

단일 마크다운 파일을 파싱합니다.

```typescript
function parseMarkdownFile(filepath: string): MarkdownFile | null
```

**Parameters:**
- `filepath` (string): 파싱할 파일의 전체 경로

**Process:**
1. 파일 존재 여부 확인
2. 파일 내용 읽기
3. Frontmatter 파싱 (gray-matter 사용)
4. 메타데이터 추출 및 검증
5. MarkdownFile 객체 생성

**Frontmatter Schema:**
```yaml
---
title: string           # 필수: 문서 제목
description?: string    # 선택: 문서 설명
code: string           # 필수: 고유 식별 코드
date?: string          # 선택: 작성일
author?: string        # 선택: 작성자
tags?: string[]        # 선택: 태그 목록
---
```

### `validateFrontmatter()`

Frontmatter 데이터의 유효성을 검사합니다.

```typescript
function validateFrontmatter(data: any): boolean
```

**Validation Rules:**
- `title`: 필수, 문자열
- `code`: 필수, 문자열, 영숫자와 하이픈만 허용
- `description`: 선택사항, 문자열

**Example:**
```typescript
const isValid = validateFrontmatter({
  title: "문서 제목",
  code: "doc-1",
  description: "문서 설명"
})
// Returns: true
```

## 🔗 Route Handlers

### Dynamic Route: `/view/[code]`

**File:** `app/view/[code]/page.tsx`

동적 라우트로 코드를 기반으로 마크다운 문서를 표시합니다.

```typescript
interface PageProps {
  params: Promise<{ code: string }>
}

export default async function ViewPage({ params }: PageProps) {
  const { code } = await params
  // 문서 조회 및 렌더링
}
```

**URL Examples:**
- `/view/hello` → `code: "hello"`
- `/view/guide` → `code: "guide"`
- `/view/features` → `code: "features"`

### Static Route: `/`

**File:** `app/page.tsx`

홈페이지에서 모든 마크다운 파일의 목록을 표시합니다.

```typescript
export default async function HomePage() {
  const files = await getMarkdownFiles()
  return <FileList files={files} />
}
```

## 🎨 Component API

### `<ReactMarkdown>`

마크다운 내용을 React 컴포넌트로 렌더링합니다.

```typescript
<ReactMarkdown
  remarkPlugins={[remarkGfm]}
  components={{
    code(props) {
      // 커스텀 코드 블록 렌더링
    }
  }}
>
  {markdown.content}
</ReactMarkdown>
```

**Configuration:**
- `remarkGfm`: GitHub Flavored Markdown 지원
- 커스텀 컴포넌트: 코드 블록 문법 하이라이팅

### `<SyntaxHighlighter>`

코드 블록에 문법 하이라이팅을 적용합니다.

```typescript
<SyntaxHighlighter
  language={match[1]}      // 프로그래밍 언어
  style={oneDark}          // 테마 (어두운 테마)
  PreTag="div"             # 래퍼 태그
>
  {codeString}
</SyntaxHighlighter>
```

**Supported Languages:**
- JavaScript/TypeScript
- Python
- Java
- C/C++
- CSS/SCSS
- HTML
- JSON
- YAML
- Markdown
- 기타 200+ 언어

## 🚀 Performance Optimizations

### Server Components

```typescript
// 서버에서 데이터 페칭
export default async function Page() {
  const data = await getMarkdownFiles() // 서버에서 실행
  return <ClientComponent data={data} />
}
```

### Static Site Generation (SSG)

```typescript
// 빌드 타임에 경로 사전 생성
export async function generateStaticParams() {
  const files = await getMarkdownFiles()
  return files.map(file => ({
    code: file.code
  }))
}
```

### Metadata Generation

```typescript
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { code } = await params
  const markdown = await getMarkdownByCode(code)
  
  return {
    title: markdown?.title,
    description: markdown?.description,
    openGraph: {
      title: markdown?.title,
      description: markdown?.description,
    }
  }
}
```

## 🔒 Error Handling

### File Not Found

```typescript
// 파일이 존재하지 않을 때
if (!markdown) {
  notFound() // Next.js의 not-found.tsx로 리다이렉트
}
```

### Invalid Frontmatter

```typescript
// Frontmatter 검증 실패 시
if (!validateFrontmatter(data)) {
  console.warn(`Invalid frontmatter in ${filename}`)
  return null // 파일 목록에서 제외
}
```

### File System Errors

```typescript
try {
  const content = fs.readFileSync(filepath, 'utf8')
} catch (error) {
  console.error(`Failed to read file: ${filepath}`, error)
  return null
}
```

## 📊 Type Definitions

### Core Types

```typescript
interface MarkdownFile {
  code: string
  title: string
  description?: string
  filename: string
  lastModified: string
  content: string
  slug: string
}

interface FrontmatterData {
  title: string
  description?: string
  code: string
  date?: string
  author?: string
  tags?: string[]
  [key: string]: any
}
```

### Component Props

```typescript
interface FileCardProps {
  file: MarkdownFile
  className?: string
}

interface ViewPageProps {
  params: Promise<{ code: string }>
}
```

## 🔧 Configuration

### Next.js Config

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['gray-matter']
  }
}
```

### TypeScript Config

```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

---

**API 문서는 지속적으로 업데이트됩니다.** 최신 정보는 [GitHub Repository](https://github.com/your-repo)에서 확인하세요! 🚀 