---
title: "마크다운 뷰어 사용 가이드"
description: "마크다운 뷰어를 효과적으로 사용하는 방법에 대한 자세한 가이드입니다."
code: "guide"
---

# 📖 마크다운 뷰어 사용 가이드

이 가이드는 마크다운 뷰어를 효과적으로 사용하는 방법을 안내합니다.

## 🚀 시작하기

### 1. 마크다운 파일 추가하기

`content` 폴더에 `.md` 확장자를 가진 파일을 추가하세요.

```bash
content/
├── hello-world.md
├── guide.md
└── your-document.md
```

### 2. Frontmatter 설정하기

각 마크다운 파일의 맨 위에 YAML frontmatter를 추가하세요:

```yaml
---
title: "문서 제목"
description: "문서에 대한 간단한 설명"
code: "unique-code"
---
```

#### Frontmatter 필드 설명

| 필드 | 필수 | 설명 |
|------|------|------|
| `title` | 선택 | 문서의 제목 (없으면 파일명 사용) |
| `description` | 선택 | 문서에 대한 설명 |
| `code` | 선택 | URL에 사용될 고유 코드 (없으면 파일명 사용) |

## 📝 지원하는 마크다운 문법

### 제목 (Headers)

```markdown
# H1 제목
## H2 제목
### H3 제목
#### H4 제목
##### H5 제목
###### H6 제목
```

### 텍스트 스타일링

```markdown
**볼드 텍스트**
*이탤릭 텍스트*
~~취소선~~
`인라인 코드`
```

### 목록

#### 순서 없는 목록
```markdown
- 항목 1
- 항목 2
  - 하위 항목 2.1
  - 하위 항목 2.2
- 항목 3
```

#### 순서 있는 목록
```markdown
1. 첫 번째
2. 두 번째
3. 세 번째
```

#### 체크리스트
```markdown
- [x] 완료된 작업
- [ ] 미완료 작업
- [x] 또 다른 완료된 작업
```

### 링크와 이미지

```markdown
[링크 텍스트](https://example.com)
![이미지 alt 텍스트](image-url.jpg)
```

### 코드 블록

\`\`\`javascript
function example() {
  console.log("Hello, World!");
}
\`\`\`

\`\`\`python
def example():
    print("Hello, World!")
\`\`\`

### 인용문

```markdown
> 이것은 인용문입니다.
> 여러 줄로 작성할 수 있습니다.
```

### 표 (Tables)

```markdown
| 헤더 1 | 헤더 2 | 헤더 3 |
|--------|--------|--------|
| 데이터 1 | 데이터 2 | 데이터 3 |
| 데이터 4 | 데이터 5 | 데이터 6 |
```

### 구분선

```markdown
---
```

## 🎨 고급 기능

### GitHub Flavored Markdown (GFM)

이 뷰어는 GFM을 지원하므로 다음과 같은 고급 기능을 사용할 수 있습니다:

- [x] 체크박스
- 표 (Tables)
- 취소선 (`~~텍스트~~`)
- 자동 링크

### 문법 하이라이팅

다양한 프로그래밍 언어의 문법 하이라이팅을 지원합니다:

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

const user: User = {
  id: 1,
  name: "홍길동",
  email: "hong@example.com"
};
```

```css
.markdown-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.markdown-content h1 {
  border-bottom: 2px solid #eee;
  padding-bottom: 0.5rem;
}
```

## 🔗 URL 시스템

각 마크다운 파일은 고유한 URL을 가집니다:

- 기본 형식: `/view/{code}`
- 예시:
  - `/view/hello` (code: "hello")
  - `/view/guide` (code: "guide")
  - `/view/my-document` (code: "my-document")

`code` 필드가 없으면 파일명(확장자 제외)이 사용됩니다.

## 💡 팁과 요령

### 1. 효과적인 문서 구조

```markdown
# 메인 제목

## 개요
간단한 설명...

## 주요 내용
상세한 내용...

### 하위 섹션
세부 내용...

## 결론
마무리...
```

### 2. 코드 예시 작성

프로그래밍 언어를 명시하여 문법 하이라이팅을 활용하세요:

\`\`\`language-name
// 코드 내용
\`\`\`

### 3. 읽기 쉬운 표 만들기

```markdown
| 기능 | 지원 여부 | 설명 |
|------|:---------:|------|
| 마크다운 | ✅ | 기본 마크다운 문법 |
| GFM | ✅ | GitHub Flavored Markdown |
| 수식 | ❌ | LaTeX 수식 (향후 지원 예정) |
```

## 📞 도움이 필요하시나요?

- 마크다운 문법에 대한 자세한 정보: [CommonMark Spec](https://commonmark.org/)
- GitHub Flavored Markdown: [GFM Spec](https://github.github.com/gfm/)

---

**즐거운 문서 작성 되세요!** ✨ 