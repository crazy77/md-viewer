---
title: "이미지 사용 가이드"
description: "마크다운 문서에서 로컬 이미지를 사용하는 방법을 단계별로 설명합니다."
code: "image-guide"
image: "/images/docs/sample-hero.svg"
---

# 🖼️ 이미지 사용 가이드

마크다운 문서에서 로컬 이미지를 사용하는 방법을 알아보세요!

## 📁 폴더 구조

### Public 폴더 사용
```
프로젝트루트/
├── public/
│   └── images/
│       ├── docs/           # 문서 관련 이미지
│       ├── icons/          # 아이콘
│       ├── thumbnails/     # 썸네일
│       └── screenshots/    # 스크린샷
├── content/
│   └── your-document.md
└── ...
```

### 이미지 파일 저장
이미지 파일을 `public/images/` 폴더 하위에 저장합니다:

```bash
# 예시 파일 구조
public/
├── images/
│   ├── docs/
│   │   ├── sample-hero.svg       # SVG 이미지
│   │   ├── tech-stack.svg        # 기술 스택 이미지
│   │   ├── feature-demo.png      # 기능 데모
│   │   └── architecture.jpg      # 아키텍처 다이어그램
│   ├── icons/
│   │   ├── logo.svg
│   │   └── favicon.ico
│   └── screenshots/
│       ├── homepage.png
│       └── viewer.png
```

## ✍️ Frontmatter에서 이미지 사용

### 기본 사용법
마크다운 파일의 frontmatter에 `image` 필드를 추가합니다:

```yaml
---
title: "문서 제목"
description: "문서 설명"
code: "unique-code"
image: "/images/docs/your-image.jpg"
---
```

### 지원되는 이미지 포맷
- **JPEG/JPG** - 사진, 복잡한 이미지
- **PNG** - 투명 배경, 스크린샷
- **SVG** - 벡터 그래픽, 아이콘, 로고
- **WebP** - 최신 브라우저용 최적화 포맷
- **AVIF** - 차세대 이미지 포맷

### 경로 작성 규칙
```yaml
# ✅ 올바른 경로 (절대 경로)
image: "/images/docs/hero.jpg"
image: "/images/icons/logo.svg"
image: "/images/screenshots/demo.png"

# ❌ 잘못된 경로
image: "images/hero.jpg"           # 슬래시 누락
image: "./images/hero.jpg"         # 상대 경로 사용
image: "public/images/hero.jpg"    # public 폴더명 포함
```

## 🎨 이미지 최적화 팁

### 1. 적절한 크기 사용
```yaml
# 히어로 이미지 권장 크기
- 너비: 1200px 이상
- 높이: 630px 이상 
- 비율: 16:9 또는 1.91:1 (OG 이미지 표준)
```

### 2. 파일 크기 최적화
```bash
# 이미지 압축 도구 사용
- TinyPNG (PNG 압축)
- JPEGmini (JPEG 압축)
- SVGO (SVG 최적화)
```

### 3. 반응형 이미지 고려
```css
/* CSS에서 반응형 처리됨 */
.hero-image {
  width: 100%;
  height: auto;
  object-fit: cover;
}
```

## 🌐 소셜 미디어 최적화

### Open Graph 이미지
frontmatter의 `image`는 자동으로 Open Graph 이미지로 사용됩니다:

```html
<!-- 자동 생성되는 메타 태그 -->
<meta property="og:image" content="/images/docs/your-image.jpg" />
<meta name="twitter:image" content="/images/docs/your-image.jpg" />
```

### 권장 사이즈
- **Facebook**: 1200 x 630px
- **Twitter**: 1200 x 600px
- **LinkedIn**: 1200 x 627px
- **범용**: 1200 x 630px (권장)

## 📱 히어로 이미지 표시

### 자동 표시
`image` 필드가 있는 문서는 자동으로 히어로 이미지가 표시됩니다:

```tsx
// 자동으로 렌더링되는 구조
<div className="hero-image">
  <Image
    src={markdown.image}
    alt={markdown.title}
    width={1200}
    height={630}
    priority
  />
</div>
```

### 반응형 크기
- **모바일**: height: 192px (h-48)
- **태블릿**: height: 256px (h-64)
- **데스크톱**: height: 384px (h-96)

## 🔍 홈페이지에서의 표시

### 시각적 표시
이미지가 있는 문서는 홈페이지에서 특별히 표시됩니다:

1. **카메라 아이콘 배지** - 카드 우상단에 녹색 배지
2. **이미지 라벨** - 제목 옆에 "🖼️ 이미지" 태그

```tsx
// 자동으로 추가되는 표시
{file.image && (
  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
    🖼️ 이미지
  </span>
)}
```

## 🛠️ 실제 사용 예시

### 1. 기능 소개 문서
```yaml
---
title: "주요 기능 소개"
description: "마크다운 뷰어의 다양한 기능들을 자세히 알아보세요."
code: "features"
image: "/images/docs/features-hero.svg"
---
```

### 2. 기술 스택 문서
```yaml
---
title: "기술 스택"
description: "최신 웹 기술로 구축된 마크다운 뷰어의 기술 스택을 소개합니다."
code: "tech-stack"
image: "/images/docs/tech-stack.svg"
---
```

### 3. 튜토리얼 문서
```yaml
---
title: "사용법 튜토리얼"
description: "마크다운 뷰어 사용법을 단계별로 알아보세요."
code: "tutorial"
image: "/images/docs/tutorial-screenshot.png"
---
```

## 🎯 이미지 제작 도구

### 디자인 도구
- **Figma** - 웹 기반 디자인 도구
- **Canva** - 간편한 그래픽 디자인
- **Adobe Illustrator** - 전문 벡터 그래픽
- **Sketch** - macOS 전용 UI 디자인

### SVG 생성
```svg
<!-- 예시: 간단한 SVG 히어로 이미지 -->
<svg width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea" />
      <stop offset="100%" style="stop-color:#764ba2" />
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <text x="600" y="315" text-anchor="middle" fill="white" 
        font-size="48" font-weight="bold">
    Your Title Here
  </text>
</svg>
```

## 📋 체크리스트

### 이미지 추가 전 확인사항
- [ ] 이미지가 `public/images/` 폴더에 저장됨
- [ ] 적절한 파일명 사용 (영문, 숫자, 하이픈만)
- [ ] 권장 크기 (1200x630px) 준수
- [ ] 파일 크기 최적화 (1MB 이하 권장)
- [ ] frontmatter에 올바른 경로 작성

### 문서 업데이트 후 확인사항
- [ ] 홈페이지에서 이미지 배지 표시 확인
- [ ] 문서 페이지에서 히어로 이미지 표시 확인
- [ ] 다크 모드에서도 잘 보이는지 확인
- [ ] 모바일에서 적절히 표시되는지 확인

## 🚨 문제 해결

### 이미지가 표시되지 않을 때
1. **경로 확인**: `/images/...` 형태로 시작하는지 확인
2. **파일 존재 확인**: `public/images/` 폴더에 파일이 있는지 확인
3. **파일명 확인**: 대소문자, 특수문자 확인
4. **캐시 삭제**: 브라우저 새로고침 (Ctrl+F5)

### 성능 최적화
```typescript
// Next.js Image 컴포넌트 자동 최적화
- 자동 WebP/AVIF 변환
- 지연 로딩 (Lazy Loading)
- 반응형 이미지 생성
- 압축 최적화
```

---

**이제 멋진 히어로 이미지로 문서를 더욱 매력적으로 만들어보세요!** ✨ 