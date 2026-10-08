---
name: Mindful Canvas
colors:
  surface: '#fef7ff'
  surface-dim: '#dfd7e3'
  surface-bright: '#fef7ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f9f1fd'
  surface-container: '#f3ebf7'
  surface-container-high: '#ede6f1'
  surface-container-highest: '#e7e0eb'
  on-surface: '#1d1a22'
  on-surface-variant: '#494551'
  inverse-surface: '#322f37'
  inverse-on-surface: '#f6eefa'
  outline: '#7a7582'
  outline-variant: '#cbc4d2'
  surface-tint: '#6750a4'
  primary: '#4f378a'
  on-primary: '#ffffff'
  primary-container: '#6750a4'
  on-primary-container: '#e0d2ff'
  inverse-primary: '#cfbcff'
  secondary: '#7d5260'
  on-secondary: '#ffffff'
  secondary-container: '#fdc6d6'
  on-secondary-container: '#7a4f5d'
  tertiary: '#005236'
  on-tertiary: '#ffffff'
  tertiary-container: '#006d48'
  on-tertiary-container: '#89edba'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e9ddff'
  primary-fixed-dim: '#cfbcff'
  on-primary-fixed: '#22005d'
  on-primary-fixed-variant: '#4f378a'
  secondary-fixed: '#ffd9e3'
  secondary-fixed-dim: '#eeb8c8'
  on-secondary-fixed: '#31111d'
  on-secondary-fixed-variant: '#633b48'
  tertiary-fixed: '#92f7c3'
  tertiary-fixed-dim: '#75daa8'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005235'
  background: '#fef7ff'
  on-background: '#1d1a22'
  surface-variant: '#e7e0eb'
typography:
  display-lg:
    fontFamily: Roboto Flex
    fontSize: 57px
    fontWeight: '400'
    lineHeight: 64px
    letterSpacing: -0.25px
  display-md:
    fontFamily: Roboto Flex
    fontSize: 45px
    fontWeight: '400'
    lineHeight: 52px
    letterSpacing: 0px
  headline-lg:
    fontFamily: Roboto Flex
    fontSize: 32px
    fontWeight: '500'
    lineHeight: 40px
    letterSpacing: 0px
  headline-md:
    fontFamily: Roboto Flex
    fontSize: 28px
    fontWeight: '500'
    lineHeight: 36px
    letterSpacing: 0px
  headline-sm:
    fontFamily: Roboto Flex
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
    letterSpacing: 0px
  title-lg:
    fontFamily: Roboto Flex
    fontSize: 22px
    fontWeight: '500'
    lineHeight: 28px
    letterSpacing: 0px
  title-md:
    fontFamily: Roboto Flex
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: 0.15px
  title-sm:
    fontFamily: Roboto Flex
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.1px
  body-lg:
    fontFamily: Roboto Flex
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
    letterSpacing: 0.5px
  body-md:
    fontFamily: Roboto Flex
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: 0.25px
  body-sm:
    fontFamily: Roboto Flex
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0.4px
  label-lg:
    fontFamily: Roboto Flex
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.1px
  label-md:
    fontFamily: Roboto Flex
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.5px
  label-sm:
    fontFamily: Roboto Flex
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.5px
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-tablet: 2rem
  margin-desktop: auto
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system establishes an empathetic, calm, and intelligent sanctuary for personal reflection. The visual tone is grounded in Google Material Design 3 (M3) principles, bringing together clarity, tonal surfaces, and adaptive expressive color. 

The aesthetic is clean, bright, and deeply reassuring:
- **Style Category**: Material You / Modern Warm Minimalist.
- **Personality**: Emotionally safe, non-judgmental, insightful, and organized.
- **Audience**: Individuals tracking mental wellness, stress patterns, and daily personal stories who need a low-friction, inviting writing interface paired with intelligent feedback.
- **Visual Feel**: Gentle tonal elevation, pill-shaped tactile chips, generous line height for introspective reading, and distinct emotional color coding that communicates empathy without sensory overload.

## Colors

The palette is engineered around Material Design 3 tonal palettes with dynamic sentiment mapping.

### Core M3 Tonal Palette
- **Primary (`#6750A4`)**: Material baseline deep purple/violet representing thoughtful insight and deliberate focus.
- **Primary Container (`#EADDFF`)** & **On-Primary Container (`#21005D`)**: Used for prominent interactive cards and focal elements.
- **Secondary (`#625B71`)** & **Secondary Container (`#E8DEF8`)**: Soft lavender surfaces for contextual actions, secondary tags, and date pickers.
- **Tertiary (`#7D5260`)** & **Tertiary Container (`#FFD8E4`)**: Soft rose-tinted surfaces for gentle feedback, affectionate reminders, and AI conversational prompts.
- **Background & Surfaces**:
  - `surface`: `#FAF9FD`
  - `surface-container-low`: `#F7F2FA`
  - `surface-container`: `#F3EDF7`
  - `surface-container-high`: `#ECE6F0`
  - `surface-container-highest`: `#E6E0E9`
  - `outline`: `#79747E`
  - `outline-variant`: `#CAC4D0`

### Sentiment Mood Tokens
Dedicated emotional accent tokens provide clarity across the AI feedback stream and sentiment tracking chips:
- **Joy / Happy**: `#FFB703` (Container: `#FFF3D0`, On-Container: `#573E00`)
- **Calm / Peace**: `#52B788` (Container: `#DCF5E8`, On-Container: `#0E4028`)
- **Sadness / Melancholy**: `#4EA8DE` (Container: `#E1F2FB`, On-Container: `#0C3B57`)
- **Anger / Frustration**: `#E63946` (Container: `#FCE4E6`, On-Container: `#560009`)
- **Tired / Anxiety**: `#A06CD5` (Container: `#F2E9F9`, On-Container: `#3E1B64`)

## Typography

The typography uses `Roboto Flex` (with seamless fallback to system sans-serifs such as Pretendard) to honor the standard Material 3 metric scale. 

- **Display & Headlines**: Used strictly for the main application header, date milestones, and high-level mood summaries.
- **Titles**: Provide structure for section cards (e.g., "Diary Entry", "AI Insight Breakdown", "Mood Matrix").
- **Body**: The main reflective text area relies on `body-lg` (16px / 26px line height), maximizing reading comfort and giving users breathing room while journaling.
- **Labels**: High-legibility, slightly tracking-adjusted labels for buttons, date picker pills, and sentiment badge icons.

## Layout & Spacing

The layout is built for focused, distraction-free introspection:

- **Structure**: Vertical single-column stack on mobile (max-width `480px` centered for compact views, expanding up to `680px` on tablets/desktops to prevent line lengths from exceeding comfortable reading measures).
- **Rhythm**: All containers follow the standard 8dp base grid, with 4dp micro-increments used for internal pill padding and chip gap spaces.
- **Breakpoints**:
  - **Mobile (<600px)**: 16px (`1rem`) outer canvas margins, vertical stack mirroring the wireframe: Header -> Date Selection Strip -> Writing Canvas -> Action Toolbar (3-column flex) -> Mood Emotion Selector -> AI Sentiment Result Card.
  - **Tablet & Desktop (>=600px)**: Centered column with maximum width of `640px` to maintain journal intimacy without horizontal overstretch.

## Elevation & Depth

This design system uses Material 3 tonal elevation combined with soft ambient drop-shadows:

- **Level 0 (Flat / Surfaces)**: Default screen background (`#FAF9FD`), no shadow.
- **Level 1 (Surface Cards & Outlined Panels)**: Used for the diary writing area and sentiment breakdown card. Shadow: `0px 1px 3px 1px rgba(103, 80, 164, 0.08), 0px 1px 2px 0px rgba(0, 0, 0, 0.12)`.
- **Level 2 (Active Interactive Elements & Floating Controls)**: Primary buttons on hover/focus and sentiment filter chips when selected. Shadow: `0px 2px 6px 2px rgba(103, 80, 164, 0.12), 0px 1px 2px 0px rgba(0, 0, 0, 0.14)`.
- **Level 3 (Modal Bottom Sheets & AI Result Revealer)**: Soft high-elevation drop shadow with deep-indigo ambient tint (`rgba(103, 80, 164, 0.16)`).

## Shapes

The design system embraces Material Design 3's expressive, humanistic rounded corners:
- **Pills / Full Rounded (`9999px`)**: Interactive date-chips, mood emotion indicators, and action buttons (`AI 분석`, `저장`, `재시작`).
- **Extra Large (`24px` / `rounded-2xl` - `rounded-3xl`)**: Main diary writing card container and AI sentiment analysis container.
- **Medium (`12px` - `16px`)**: Floating inner controls and helper popovers.

## Components

### Header (서비스 타이틀)
- Centered or start-aligned app bar using `title-lg` or `headline-sm`.
- Displays subtle icon action triggers (calendar view, theme switcher, profile) with clean 40x40dp icon button bounding circles.

### Date Selection Strip (날짜 선택 영역)
- Horizontally scrollable row of pill-shaped date chips.
- **Inactive**: Surface container tint (`#F3EDF7`), text `body-md` in `#49454F`.
- **Active**: Primary filled (`#6750A4`) or Primary Container filled (`#EADDFF`), displaying day of week + date number with a subtle dot indicator.

### Journal Writing Surface (일기 작성 영역)
- Large M3 Elevated or Outlined Card (`rounded-3xl`, surface `#FFFFFF` or `#F7F2FA`).
- Minimum height: 240px.
- Internal padding: `space-lg` (24px).
- Clean frameless or floating-label textarea with generous line-height (`body-lg`), contextual character count at the bottom-right, and gentle placeholder text prompting self-reflection.

### Action Button Bar (AI 분석, 저장, 재시작)
Horizontal 3-button layout matching the wireframe:
1. **AI 분석 버튼 (Analyze)**: M3 Filled Button (`#6750A4` background, white label), leading sparkle icon (`auto_awesome`), height 44px, full rounded pill shape.
2. **저장 버튼 (Save)**: M3 Tonal Button (`#E8DEF8` background, `#21005D` text), leading bookmark/check icon.
3. **재시작 버튼 (Reset)**: M3 Outlined Button (1px outline `#79747E`, transparent background, `#6750A4` text), leading refresh icon.

### Emotion Emoji Selector (감성 이모지 영역)
- Segmented pill container or flex-wrap row containing emotion icons (Joy, Calm, Melancholy, Frustration, Anxiety).
- Each item is an interactive circular or rounded-full token with animated hover and active scale transformation.
- Selected state adopts the matching sentiment background container with 2px border outline in the sentiment mood color.

### AI Sentiment Analysis Result (AI 일기 감성 분석 결과)
- Prominent M3 Container Card (`rounded-3xl`, background `#F3EDF7` or custom sentiment gradient blend).
- Contains:
  - Header with sentiment icon and matched badge (e.g., "Calm / 평온함").
  - Empathetic AI summary text in `body-md` offering gentle feedback and actionable self-care tips.
  - Keyword sentiment cloud tags using pill-shaped mood tokens.