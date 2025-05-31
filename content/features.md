---
title: "주요 기능 소개"
description: "마크다운 뷰어의 다양한 기능들을 자세히 알아보세요."
code: "features"
image: "/images/docs/sample-hero.svg"
---

# 🌟 주요 기능 소개

마크다운 뷰어가 제공하는 강력한 기능들을 살펴보세요!

## 📁 자동 파일 관리

### 스마트 스캔
- `content` 폴더의 모든 `.md` 파일을 자동으로 감지
- 파일 추가/삭제 시 즉시 반영
- 실시간 메타데이터 업데이트

### 파일 정보 추출
```yaml
# 각 파일에서 자동으로 추출되는 정보
- 제목 (title)
- 설명 (description)  
- 고유 코드 (code)
- 파일명
- 최종 수정일
```

## 🔗 고유 URL 시스템

### URL 구조
```
홈페이지: /
뷰어 페이지: /view/{code}
404 페이지: /not-found
```

### 코드 매핑 예시
| 파일명 | 코드 | URL |
|--------|------|-----|
| `hello-world.md` | `hello` | `/view/hello` |
| `guide.md` | `guide` | `/view/guide` |
| `features.md` | `features` | `/view/features` |

## 🎨 마크다운 렌더링

### 지원하는 문법

#### 기본 마크다운
- [x] 제목 (H1-H6)
- [x] **볼드**, *이탤릭*, ~~취소선~~
- [x] `인라인 코드`
- [x] 링크 및 이미지
- [x] 목록 (순서 있음/없음)
- [x] 인용문
- [x] 구분선

#### GitHub Flavored Markdown (GFM)
- [x] 체크박스 목록
- [x] 표 (Tables)
- [x] 코드 블록 (문법 하이라이팅)
- [x] 자동 링크 변환

### 코드 하이라이팅

지원하는 프로그래밍 언어:

```javascript
// JavaScript/TypeScript
function example() {
  console.log("Hello, World!");
}
```

```python
# Python
def hello():
    print("Hello, Python!")
```

```java
// Java
public class Hello {
    public static void main(String[] args) {
        System.out.println("Hello, Java!");
    }
}
```

```css
/* CSS */
.container {
  max-width: 1200px;
  margin: 0 auto;
}
```

## 📱 반응형 디자인

### 브레이크포인트
| 디바이스 | 크기 | 레이아웃 |
|----------|------|----------|
| 모바일 | < 768px | 1열 그리드 |
| 태블릿 | 768px - 1024px | 2열 그리드 |
| 데스크톱 | > 1024px | 3열 그리드 |

### 모바일 최적화
- 터치 친화적 인터페이스
- 가독성 높은 폰트 사이즈
- 스크롤 최적화
- 빠른 로딩 시간

## ⚡ 성능 최적화

### Next.js 15 기능 활용
```typescript
// Server Components로 서버사이드 렌더링
export default async function Page() {
  const data = await fetchData() // 서버에서 실행
  return <Component data={data} />
}
```

### 정적 생성 (SSG)
- 빌드 타임에 페이지 사전 생성
- CDN 캐싱으로 빠른 로딩
- SEO 최적화

### 코드 스플리팅
```typescript
// 필요한 컴포넌트만 동적 로드
const SyntaxHighlighter = dynamic(
  () => import('react-syntax-highlighter'),
  { ssr: false }
)
```

## 🛡️ 타입 안전성

### TypeScript 완전 지원
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
```

### 엄격한 타입 체크
- 컴파일 타임 오류 방지
- IDE 자동 완성 지원
- 리팩토링 안전성

## 🎯 접근성 (A11y)

### 웹 접근성 준수
- 시맨틱 HTML 구조
- 키보드 네비게이션 지원
- 스크린 리더 호환
- 색상 대비 최적화

### ARIA 라벨링
```jsx
<article role="main" aria-labelledby="article-title">
  <h1 id="article-title">{title}</h1>
  <nav aria-label="문서 네비게이션">
    {/* 네비게이션 요소들 */}
  </nav>
</article>
```

## 🔄 실시간 업데이트

### 핫 리로딩
- 개발 중 파일 변경 시 즉시 반영
- 페이지 새로고침 없이 업데이트
- 개발 생산성 향상

### 메타데이터 동기화
- Frontmatter 변경 시 자동 업데이트
- 파일명 변경 추적
- 오류 복구 메커니즘

## 🔍 SEO 최적화

### 메타데이터 자동 생성
```typescript
export const metadata: Metadata = {
  title: document.title,
  description: document.description,
  openGraph: {
    title: document.title,
    description: document.description,
  }
}
```

### 소셜 미디어 최적화
- Open Graph 태그 지원
- Twitter Cards 지원
- 맞춤형 썸네일 이미지
- 구조화된 데이터 (JSON-LD)

## 🔧 확장성

### 플러그인 시스템
```typescript
// 새로운 마크다운 플러그인 추가
import remarkPlugin from 'remark-plugin-name'

export default {
  remarkPlugins: [
    remarkGfm,
    remarkPlugin,
    // 추가 플러그인들...
  ]
}
```

### 테마 커스터마이징
- CSS 변수 기반 테마 시스템
- 다크/라이트 모드 지원
- 사용자 정의 색상 팔레트
- 반응형 레이아웃 옵션

---

**이 모든 기능들이 하나의 플랫폼에서!** 🚀 