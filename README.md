<div align="center">

<img src="web/illustrations/hero/main-couple-720.webp" alt="공수명리학 메인 일러스트" width="320" />

# 공수명리학 · 攻受命理學

**생년월일로 풀어 보는 BL 공수 캐릭터 테스트 (오락용)**

[![서비스 바로가기](https://img.shields.io/badge/▶_서비스_바로가기-0A0E22?style=for-the-badge)](https://maylilymooon.github.io/gongsu-myeongri/)

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![GA4](https://img.shields.io/badge/GA4-E37400?style=flat-square&logo=googleanalytics&logoColor=white)
![GitHub Pages](https://img.shields.io/badge/GitHub_Pages-222222?style=flat-square&logo=githubpages&logoColor=white)

</div>

<br/>

## 소개

생년월일을 입력하면 사주의 간지(干支)와 오행을 바탕으로 나의 **BL 포지션(공·수·리버스)** 과 **캐릭터 유형**을 알려 주는 웹 테스트입니다.
결과 화면에서는 캐릭터 일러스트와 대사, 운명의 상대, 선택형 상황극까지 이어서 즐길 수 있고, 결과를 카드 이미지로 저장하거나 친구에게 공유할 수 있습니다.

> [!NOTE]
> 실제 사주 감정이 아닌 **오락용 창작 서비스**입니다. 간지 계산은 만세력 규칙을 근사해 따르지만, 이를 공수와 속성으로 옮기는 해석과 대사는 모두 창작입니다.

<br/>

## 주요 기능

| 기능 | 설명 |
|---|---|
| 🔮 **공수 풀이** | 생년월일로 연·월·일 간지를 세고, 일간의 음양과 태어난 계절의 기운으로 공·수·리버스를 판정 |
| 🎴 **캐릭터 유형** | 성격속성 16종 × 공/수, 보조속성 12종, 창작 보너스 5종을 조합한 캐릭터 결과와 본명 대사 |
| 💞 **운명의 상대** | 반대 포지션의 상대 유형과 '운명의 한 장면' 소개 |
| 💬 **선택형 상황극** | 운명의 상대와 나누는 짧은 이야기. 선택지에 따라 결말이 달라짐 (32개 관점, 리버스 결과 제외) |
| 📊 **상세 풀이** | 명식, 공수 비율, 오행 분포, 계산 과정을 접어서 제공 |
| 📖 **속성 도감** | 모든 속성의 설명과 일러스트를 모아 보는 도감 |
| 📤 **공유 카드** | 1080×1350 PNG 캐릭터 카드 생성, 저장 및 공유하기(Web Share API), 유형 링크 복사 |
| 🔐 **방문 통계 동의** | 동의한 경우에만 GA4 방문 통계 수집, 개인정보 처리방침 페이지 제공 |

### 결과 화면 구성

```
01 당신의 BL 캐릭터      대표 유형 · 일러스트 · 본명 대사 · 적합도
02 내 캐릭터를 완성하는 속성   속성 카드 (누르면 속성 도감으로 이동)
03 운명의 상대          상대 유형 · 운명의 한 장면 · 선택형 상황극
   상세 풀이            명식 · 공수 비율 · 오행 분포 · 계산 과정 (기본 접힘)
```

<br/>

## 개인정보 보호

생년월일을 다루는 서비스라서 아래 원칙을 지키도록 만들었습니다.

- **서버 없음**: 모든 계산은 브라우저 안에서 이루어지며, 생년월일을 어디에도 전송하지 않습니다.
- **결과 보관**: 입력한 결과는 해당 브라우저 탭(sessionStorage)에만 남습니다.
- **공유 링크**: 친구에게 보내는 유형 링크(`#/t/유형`)에는 생년월일이 들어가지 않습니다.
- **방문 통계**: 배너에서 동의한 경우에만 GA4가 동작하며, 생년월일·결과 링크는 보내지 않습니다. 광고 개인화와 Google 신호는 사용하지 않습니다.

<br/>

## 사용 기술

| 구분 | 내용 |
|---|---|
| 프론트엔드 | HTML, CSS, JavaScript (프레임워크·빌드 도구 없음) |
| 화면 구성 | 해시 라우팅(`#/`) 기반 싱글 페이지, 반응형 레이아웃 |
| 이미지 | Canvas API로 공유 카드 직접 그리기, WebP 일러스트 |
| 공유 | Web Share API, Clipboard API |
| 분석 | Google Analytics 4 (동의 기반, Consent Mode) |
| 폰트 | Noto Serif KR (Google Fonts), Pretendard |
| 배포 | GitHub Pages |

<br/>

## 실행 방법

별도 설치 없이 정적 파일만으로 동작합니다.

```bash
git clone https://github.com/maylilymooon/gongsu-myeongri.git
cd gongsu-myeongri
python -m http.server 8000
```

브라우저에서 `http://localhost:8000` 에 접속하면 `web/` 페이지로 이동합니다.

> [!TIP]
> 방문 통계(GA4)는 배포 주소에서만 동작하므로 로컬 실행 시에는 수집되지 않습니다.

<br/>

## 화면 경로

| 경로 | 화면 |
|---|---|
| `#/` | 공수 풀이 (첫 화면) |
| `#/my` | 내 풀이 결과 |
| `#/t/{유형}` | 공유받은 유형 소개 |
| `#/codex` | 속성 도감 |
| `#/about` | 풀이 원리 |
| `#/privacy` | 개인정보 처리방침 |

<br/>

## 폴더 구조

```
gongsu-myeongri/
├── index.html          # web/ 으로 이동시키는 진입 페이지
└── web/
    ├── index.html      # 화면 골격
    ├── app.js          # 화면 렌더링 · 라우팅
    ├── logic.js        # 간지 계산 · 공수 판정 로직
    ├── lines.js        # 대사 · 상황극 선택
    ├── data.js         # 속성 · 대사 · 상황극 데이터
    ├── share-card.js   # 공유 카드 생성 · 저장 · 공유
    ├── analytics.js    # GA4 동의 배너 · 이벤트
    ├── privacy.js      # 개인정보 처리방침
    ├── styles.css      # 공통 스타일 · 테마
    ├── result.css      # 결과 화면 스타일
    ├── illust.css      # 일러스트 칸 스타일
    └── illustrations/  # 캐릭터 일러스트 (WebP)
```

> 이 저장소는 GitHub Pages로 서비스되는 배포본으로, `data.js` · `logic.js` · `lines.js`는 압축된 형태로 들어 있습니다.

<br/>

## 안내

- 모든 풀이와 대사, 상황극은 오락용 창작이며 실제 사주 감정이 아닙니다.
- 등장인물은 모두 성인으로 설정된 창작 캐릭터입니다.
- 캐릭터 일러스트는 ChatGPT(OpenAI)의 이미지 생성 기능을 활용해 만든 AI 생성 일러스트입니다.
- 특정 플랫폼과 제휴하거나 후원받지 않는 개인 제작 서비스입니다.
