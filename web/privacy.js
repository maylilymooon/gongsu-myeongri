(function(root){"use strict";const OWNER={effectiveDate:"2026년 10월 19일",history:[["","방문 통계 처리 항목에 이상형 만들기 이용 기록과 이상형 선택값을 추가했습니다. 이전 안내에 동의한 분께는 바뀐 항목을 알리고 다시 동의를 받습니다."],["2026년 10월 15일","최초 시행"]],operator:"Maylily Moon",contactEmail:"maylilymooon@gmail.com",gaRetention:{event:"2개월",user:"14개월",resetOnNewActivity:true}};const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]);const table=(head,rows)=>`<div class="pv-table"><table><thead><tr>${head.map(h=>`<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;function tail(){const contact=OWNER.contactEmail?`<a href="mailto:${esc(OWNER.contactEmail)}">${esc(OWNER.contactEmail)}</a>`:"아래 개인정보 침해 상담 기관";const parts=[["이용자의 권리와 행사 방법",`<ul>
          <li>이용자(만 14세 미만 아동의 경우 법정대리인 포함)는 언제든지 자신의 개인정보에 대해 열람, 정정·삭제, 처리정지를 요구하거나 동의를 철회할 수 있습니다.</li>
          <li>방문 통계 동의는 화면 맨 아래 <b>'쿠키·방문 통계 설정'</b>에서 바로 철회할 수 있습니다.</li>
          <li>그 밖의 요청은 ${contact}로 보내 주시면 확인한 뒤 지체 없이 답변드립니다.</li>
          <li>운영자는 이용자를 식별하는 정보를 따로 보관하지 않아, Google Analytics에 저장된 데이터는 이용자를 특정할 수 있는 범위에서만 조치할 수 있습니다. 브라우저에서 이 사이트의 쿠키를 삭제하면 이후 방문은 기존 분석 데이터와 연결되지 않습니다.</li>
        </ul>`],["개인정보의 파기",`<ul>
          <li>운영자는 이용자의 개인정보를 별도 서버나 데이터베이스에 저장하지 않습니다.</li>
          <li>Google Analytics의 상세 분석 데이터는 위 '보관 기간'이 지나면 Google Analytics에서 자동으로 삭제됩니다(일반 보고서의 집계 통계는 유지될 수 있습니다).</li>
          <li>방문 통계 동의를 철회하면 이 사이트의 분석 쿠키를 바로 삭제합니다.</li>
          <li>브라우저 저장소의 값은 탭을 닫거나(탭 저장소) 브라우저에서 이 사이트의 데이터를 지우면 삭제됩니다.</li>
        </ul>`],["안전성 확보를 위한 조치",`<ul>
          <li>생년월일은 이용자의 기기 안에서 결과 계산에만 쓰며, 운영자 서버나 Google Analytics로 보내지 않습니다.</li>
          <li>방문 통계에는 생년월일이 없는 화면 주소와 최소한의 이용 기록만 보내고, 광고 관련 기능은 사용하지 않습니다.</li>
          <li>사이트는 HTTPS(암호화 통신)로 제공됩니다.</li>
        </ul>`]];if(OWNER.contactEmail)parts.push(["개인정보 보호책임자·문의",`<p>${esc(OWNER.operator||"운영자")} · ${contact}</p>`]);parts.push(["개인정보 침해 상담",`<p>개인정보 침해에 관한 상담은 개인정보침해신고센터(<a href="https://privacy.kisa.or.kr" target="_blank" rel="noopener">privacy.kisa.or.kr</a>, 국번 없이 118)에 문의할 수 있습니다.</p>`]);if(OWNER.history&&OWNER.history.length)parts.push(["변경 이력",`<ul>${OWNER.history.map(([d,t])=>`<li><b>${esc(d||OWNER.effectiveDate)}</b> · ${esc(t)}</li>`).join("")}</ul>`]);return parts.map(([h,body],i)=>`<section class="panel pv-sec">
        <h2>${6+i}. ${h}</h2>
        ${body}
      </section>`).join("\n")}function html(){const R=OWNER.gaRetention;const retention=R?`<ul>
          <li>분석 쿠키(<code>_ga</code>, <code>_ga_40M10S76SM</code>): 이용자의 브라우저에 180일 동안 저장됩니다.</li>
          <li>Google Analytics의 상세 분석 데이터 중 이벤트 단위 데이터(본 화면, 이용 기록 등)는 <b>${esc(R.event)}</b>, 사용자 단위 데이터(방문자를 구분하는 번호에 연결된 데이터)는 <b>${esc(R.user)}</b> 동안 보관한 뒤 삭제됩니다.${R.resetOnNewActivity?" 사용자 단위 데이터는 같은 브라우저에서 다시 방문하면 그 시점부터 보관 기간이 새로 계산됩니다.":""}</li>
          <li>위 데이터 보관 기간은 주로 사용자 및 이벤트 단위의 상세 분석 데이터에 적용되며, 일반 보고서의 집계 통계는 해당 기간이 지나도 유지될 수 있습니다.</li>
        </ul>`:`<p>분석 쿠키는 이용자의 브라우저에 180일 동안 저장됩니다. Google Analytics로 전송된 데이터는 Google Analytics의 데이터 보관 설정 기간이 지나면 삭제됩니다.</p>`;return`
      <p class="eyebrow">PRIVACY</p>
      <h1 class="section-title">개인정보 처리방침</h1>
      ${OWNER.effectiveDate?`<p class="pv-date">시행일: ${esc(OWNER.effectiveDate)}</p>`:""}
      <p class="section-lead">공수명리학${OWNER.operator?`(운영자: ${esc(OWNER.operator)})`:""}은 이용자의 개인정보를 소중히 다룹니다. 이 페이지는 서비스가 어떤 정보를 어떻게 다루는지 알려 드립니다.</p>

      <section class="panel pv-sec">
        <h2>1. 서비스가 직접 수집하는 개인정보: 없음</h2>
        <ul>
          <li>회원가입, 로그인, 이름·연락처 입력을 받지 않습니다.</li>
          <li><b>생년월일</b>은 결과 계산을 위해 이용자의 브라우저 안에서만 쓰이며, 운영자의 서버나 Google Analytics로 전송하지 않습니다. 이 서비스는 정적 웹페이지로 운영되며, 생년월일을 저장하는 서버나 데이터베이스가 없습니다.</li>
          <li>결과를 다시 볼 수 있도록 생년월일을 <b>지금 사용 중인 브라우저 탭에만</b> 임시로 저장하며, 탭을 닫으면 지워집니다.</li>
          <li><b>'내 유형 링크 복사'</b>로 복사되는 링크와 <b>'공유하기'</b>로 보내는 링크에는 생년월일이 들어 있지 않습니다. 링크를 받은 사람에게는 유형 소개만 보입니다.</li>
          <li>예전에 복사한 결과 링크(주소 끝이 <code>#/result/연-월-일</code> 형식)에는 생년월일이 들어 있어, 받은 사람이 볼 수 있습니다. 주소의 <code>#</code> 뒷부분은 브라우저가 서버로 보내지 않으므로 운영자에게는 전달되지 않습니다.</li>
          <li><b>캐릭터 카드 이미지</b>는 이용자의 브라우저에서 만들어지며 서버로 전송되지 않습니다. 카드에는 유형명(보조속성 포함)과 적합도가 표시되며, 계산 규칙이 공개되어 있어 이 조합으로 생년월일이 추정될 수 있습니다. 카드를 공유할 때 참고해 주세요.</li>
        </ul>
      </section>

      <section class="panel pv-sec">
        <h2>2. 방문 통계 (Google Analytics 4) — 동의한 경우에만</h2>
        <p>서비스 개선을 위해 Google LLC의 Google Analytics 4를 사용합니다. 화면 하단 안내에서 <b>'동의'를 선택한 경우에만</b> 동작하며, 동의하지 않으면 Google Analytics로 어떤 정보도 전송하지 않습니다.</p>
        <h3>처리 항목</h3>
        ${table(["구분","항목"],[["본 화면","생년월일을 뺀 화면 주소(예: 첫 화면, 결과 화면, 유형 소개, 속성 도감, 이상형 만들기), 화면 제목"],["이용 기록","테스트 시작, 결과 보기, 이상형 만들기 시작, 이상형 결과 보기, 상황극 시작·선택과 결말 확인(사주 결과와 이상형 만들기의 상황극), 카드 저장, 공유하기, 내 유형 링크 복사, 다시 하기"],["결과 유형","공·수·리버스 구분, 메인 유형(예: 외유내강수), 운명의 상대 유형, 상황극 선택지 번호"],["이상형 선택","이상형 만들기에서 고른 성격 유형(예: 능글공), 공·수 구분, 외형(미남·미인·떡대), 디테일(기본형·안경·장발), 상황극 구분과 상황극 번호, 고른 선택지(A·B·C)와 같은 상황극에서 몇 번째 선택인지"],["유입 정보","들어온 외부 사이트의 도메인(예: instagram.com), 유입 캠페인 표시(utm)"],["자동 수집","방문자를 구분하는 임의의 번호(쿠키), 기기·브라우저·운영체제 종류, 언어, 대략적인 지역, 방문 시각, 페이지 스크롤, 외부 링크 클릭(링크 주소) 등 Google Analytics가 자동으로 수집하는 정보. 화면 크기 등 일부 기기 정보는 Google Analytics 설정에 따라 수집되지 않을 수 있습니다."]])}
        <p><b>보내지 않는 정보:</b> 생년월일, 생년월일이 든 주소, 세부 속성(사주 결과의 보조속성), 이상형 선택값이 든 주소, 이름, 연락처</p>
        <h3>목적</h3>
        <p>방문자 수와 유입 경로 파악, 기능별 이용률과 유형별 결과 분포 분석, 이상형 선택 경향과 상황극 선택 분석을 통한 서비스·콘텐츠 개선. 광고·맞춤형 광고·개인 식별에는 사용하지 않으며, 광고 저장·광고 개인화·Google 신호 기능은 꺼져 있습니다.</p>
        <h3>보관 기간</h3>
        ${retention}
        <h3>국외 이전 (방문 통계 데이터)</h3>
        <p>아래 표는 Google Analytics 4로 보내는 방문 통계 데이터에 관한 내용입니다. 이 데이터는 화면 하단 안내에서 <b>'동의'를 선택한 경우에만</b> 전송됩니다. 사이트를 여는 과정에서 동의와 관계없이 전달되는 접속 정보는 5항에서 따로 설명합니다.</p>
        ${table(["항목","내용"],[["전송 조건","이용자가 방문 통계에 동의한 경우에만 전송 (동의하지 않거나 철회하면 전송하지 않음)"],["이전받는 자",'Google LLC (연락처: <a href="https://support.google.com/policies/contact/general_privacy_form" target="_blank" rel="noopener">개인정보 문의 양식</a> · <a href="https://policies.google.com/privacy?hl=ko" target="_blank" rel="noopener">Google 개인정보처리방침</a>)'],["이전 국가","미국 등 Google이 데이터를 처리하는 국가"],["이전 일시·방법","동의한 뒤 사이트를 이용할 때마다 네트워크를 통해 전송"],["이전 항목·목적","위 처리 항목, 방문 통계 분석"],["보유·이용 기간","위 보관 기간과 같음"],["거부 방법","아래 '4. 동의 거부와 철회'를 참고하세요. 거부해도 모든 기능을 그대로 이용할 수 있습니다."]])}
      </section>

      <section class="panel pv-sec">
        <h2>3. 쿠키와 브라우저 저장소</h2>
        ${table(["이름","종류","목적","기간"],[["<code>_ga</code>, <code>_ga_40M10S76SM</code>","쿠키 (Google Analytics)","방문자·방문 구분 — 동의한 경우에만 생성","180일"],["<code>gsm-analytics-consent</code>","브라우저 저장소","방문 통계 동의·거부 선택 기억","직접 지울 때까지"],["<code>gsm-my-result</code>","브라우저 저장소 (탭)","내 결과 다시 보기용 생년월일 — 이 기기에만 저장","탭을 닫을 때까지"],["<code>gsm-analytics-seen</code>","브라우저 저장소 (탭)","같은 결과를 두 번 집계하지 않기 위한 표시(생년월일이 아닌 변환값)","탭을 닫을 때까지"],["<code>gsm-entry-referrer</code>","브라우저 저장소 (탭)","첫 화면에서 넘어올 때 유입 사이트 전달","읽는 즉시 삭제"],["<code>gsm-ga-debug</code>","브라우저 저장소 (탭)","운영자의 개발·테스트 방문 표시 — 주소에 <code>?ga=debug</code>를 붙여 들어온 경우에만 생성","탭을 닫을 때까지"]])}
        <p>브라우저 저장소의 값은 이용자의 기기에만 있으며 운영자에게 전송되지 않습니다.</p>
      </section>

      <section class="panel pv-sec">
        <h2>4. 동의 거부와 철회</h2>
        <ul>
          <li>처음 방문할 때 화면 하단 안내에서 '동의' 또는 '거부'를 고를 수 있습니다. 고르지 않으면 Google Analytics는 동작하지 않습니다.</li>
          <li>언제든 화면 맨 아래 <b>'쿠키·방문 통계 설정'</b>에서 바꿀 수 있습니다. '거부'로 바꾸면 바로 전송이 멈추고, 이 사이트의 분석 쿠키가 삭제됩니다.</li>
          <li>브라우저 설정에서 쿠키를 차단하거나 삭제할 수도 있습니다.</li>
        </ul>
        <p><button type="button" class="btn btn-ghost pv-settings">쿠키·방문 통계 설정 열기</button></p>
      </section>

      <section class="panel pv-sec">
        <h2>5. 사이트를 여는 데 쓰는 외부 서비스</h2>
        <p>방문 통계 동의와 관계없이, 사이트를 열 때 아래 서비스에서 페이지와 글꼴 파일을 불러옵니다. 이 과정에서 이용자의 IP 주소, 브라우저 정보 등 접속 정보가 각 서비스에 전달될 수 있습니다. 접속 정보는 국외에 있는 서버에서 처리될 수 있으며, 각 서비스의 개인정보처리방침에 따라 처리됩니다. 위 2항의 국외 이전 표는 방문 통계 데이터에만 해당합니다.</p>
        ${table(["서비스","용도"],[['GitHub Pages (<a href="https://docs.github.com/ko/site-policy/privacy-policies/github-general-privacy-statement" target="_blank" rel="noopener">GitHub, Inc.</a>)',"사이트 호스팅"],['Google Fonts (<a href="https://policies.google.com/privacy?hl=ko" target="_blank" rel="noopener">Google LLC</a>)',"글꼴 Noto Serif KR"],['jsDelivr (<a href="https://www.jsdelivr.com/terms/privacy-policy-jsdelivr-net" target="_blank" rel="noopener">jsDelivr</a>)',"글꼴 Pretendard"]])}
      </section>

      ${tail()}`}root.PrivacyPage={OWNER,html}})(typeof window!=="undefined"?window:globalThis);
