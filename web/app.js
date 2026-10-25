(function(){"use strict";const DATA=window.BL_DATA;const L=window.FortuneLogic;const $=(s,root=document)=>root.querySelector(s);const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]);const reduceMotion=window.matchMedia("(prefers-reduced-motion: reduce)").matches;const MY_KEY="gsm-my-result";let myMemory=null;const myResult={get(){try{return sessionStorage.getItem(MY_KEY)||myMemory}catch(_){return myMemory}},set(d){myMemory=d;try{sessionStorage.setItem(MY_KEY,d)}catch(_){}}};const DATE_RE=/^\d{4}-\d{2}-\d{2}$/;const siteBase=()=>location.origin+location.pathname.replace(/index\.html$/,"");const ga=(fn,...args)=>{try{const A=window.GSAnalytics;if(A&&A[fn])A[fn](...args)}catch(_){}};const EL_HANJA={목:"木",화:"火",토:"土",금:"金",수:"水"};const EL_ORDER=["목","화","토","금","수"];const GLYPH={gong:"攻",su:"受",reverse:"攻受",dohwa:"桃花",hongyeom:"紅艶",yeokma:"驛馬",hwagae:"華蓋",guin:"貴人",angyeong:"眼鏡"};const LAYER_LABEL={main:"메인 포지션",personality:"성격속성",aux:"보조속성",bonus:"창작 보너스"};const SIDES_OF={gong:["공"],su:["수"],reverse:["공","수"]};const findAttr=(layer,id)=>DATA[layer].find(a=>a.id===id);const mainAttr=id=>Object.assign({layer:"main"},findAttr("main",id));const splitFirst=text=>{const m=String(text).match(/^(.+?[.!?…])(\s+[\s\S]*)?$/);return m?[m[1],(m[2]||"").trim()]:[text,""]};const BADGE={calc:`<span class="basis-badge calc" title="만세력 규칙으로 계산한 값 (연·월은 절입일 근사, 시주 제외)">◆ 간지 계산</span>`,made:`<span class="basis-badge made" title="공수명리학이 지어낸 규칙과 해석">✦ 창작 해석</span>`};function ornamentSVG(){const c=300;const pt=(r,deg)=>[c+r*Math.sin(deg*Math.PI/180),c-r*Math.cos(deg*Math.PI/180)];let ticks="";for(let i=0;i<72;i++){const long=i%6===0;const[x1,y1]=pt(long?262:270,i*5);const[x2,y2]=pt(284,i*5);ticks+=`<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke-width="${long?1.4:.7}"/>`}let branches="";for(let i=0;i<12;i++){const[x,y]=pt(236,i*30);branches+=`<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" transform="rotate(${i*30} ${x.toFixed(1)} ${y.toFixed(1)})">${L.BRANCHES_HANJA[i]}</text>`}let stems="";for(let i=0;i<10;i++){const[x,y]=pt(176,i*36+18);stems+=`<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" font-size="15" transform="rotate(${i*36+18} ${x.toFixed(1)} ${y.toFixed(1)})">${L.STEMS_HANJA[i]}</text>`}const square=(r,rot)=>{const pts=[0,90,180,270].map(d=>pt(r,d+rot).map(v=>v.toFixed(1)).join(",")).join(" ");return`<polygon points="${pts}"/>`};return`<svg viewBox="0 0 600 600" fill="none" stroke="#d7bf8a" aria-hidden="true">
      <g class="spin">
        <circle cx="300" cy="300" r="292" stroke-width="0.6" opacity="0.6"/>
        <circle cx="300" cy="300" r="284" stroke-width="1"/>
        ${ticks}
        <circle cx="300" cy="300" r="258" stroke-width="0.6"/>
        <g fill="#f0e2bb" stroke="none" font-family="Noto Serif KR, serif" font-size="20" text-anchor="middle" dominant-baseline="central">${branches}</g>
        <circle cx="300" cy="300" r="212" stroke-width="0.8" stroke-dasharray="2 6"/>
      </g>
      <g class="spin-rev">
        <g fill="#c9b9f2" stroke="none" font-family="Noto Serif KR, serif" text-anchor="middle" dominant-baseline="central" opacity="0.8">${stems}</g>
        <circle cx="300" cy="300" r="150" stroke-width="0.8"/>
        ${square(150,0)}${square(150,45)}
        <circle cx="300" cy="300" r="106" stroke-width="0.6" opacity="0.7"/>
      </g>
    </svg>`}const SLOTS=DATA.illustrations&&DATA.illustrations.slots||{};function slotFor(a,side){const layer=a.layer||"main";if(layer==="personality")return SLOTS[`${a.id}-${side==="수"?"su":"gong"}`];return SLOTS[a.id]}function illust(slot,{size=""}={}){if(!slot)return`<div class="illust placeholder ${size}"><div class="ph"><span class="ph-tag">일러스트 준비 중</span></div></div>`;if(slot.ready){return`<div class="illust ${size}"><img src="${esc(slot.file)}" alt="${esc(slot.title)} 캐릭터 일러스트" loading="lazy"></div>`}return`<div class="illust placeholder ${size}" title="${esc(slot.title)} 일러스트 준비 중">
      <div class="ph"><span class="ph-tag">일러스트 준비 중</span><strong>${esc(slot.title)}</strong></div></div>`}function illustFor(a,sides,opts){const layer=a.layer||"main";if(layer==="personality"&&sides.length===2){return`<div class="illust-pair">${sides.map(s=>illust(slotFor(a,s),Object.assign({size:"half"},opts))).join("")}</div>`}return illust(slotFor(a,sides[0]),opts)}function tagOf(attr,side){return attr.tags&&attr.tags[side]||{label:attr.name+side,status:"created",platforms:[]}}function chip(t){const tip=t.status==="platform"?"실제 태그 — BL 작품에서 실제로 쓰이는 키워드":t.status==="combo"?"조합 창작 — 실제 키워드를 공수명리학이 공/수에 맞게 응용":"창작 — 공수명리학 오리지널";const tail=t.status==="platform"?"":t.status==="combo"?"<small>조합 창작</small>":"<small>창작</small>";return`<span class="chip ${t.status}" title="${esc(tip)}">#${esc(t.label)} ${tail}</span>`}const legend=`<div class="legend">
    <span><span class="chip platform">#실제 태그</span> BL 작품에서 실제로 쓰이는 키워드</span>
    <span><span class="chip combo">#조합 창작</span> 실제 키워드를 응용한 조합</span>
    <span><span class="chip created">#창작</span> 공수명리학 오리지널</span></div>`;function tarotTop(a){const layer=a.layer||"main";if(layer==="personality")return`${EL_HANJA[a.element]} · 性`;if(layer==="aux")return`${a.branch} · 緣`;if(layer==="bonus")return"創 · 作";return"命 · 位"}function tarot(a,opts={}){const{href,sub,size=""}=opts;const sides=opts.sides||["공","수"];const layer=a.layer||"main";const tag=href?"a":"div";const fs=opts.frameSides||opts.sides;let frame="";if(a.origin==="created")frame="created";else if(layer==="main"&&["gong","su","reverse"].includes(a.id))frame="frame-"+a.id;else if(fs)frame=fs.length===1?fs[0]==="공"?"frame-gong":"frame-su":"frame-reverse";return`<${tag} class="tarot ${size} ${frame}" ${href?`href="${esc(href)}"`:""}>
      <div class="tarot-inner">
        <div class="tarot-top">${tarotTop(a)}</div>
        <div class="tarot-art">${illustFor(Object.assign({layer},a),sides,{size:size==="mini"?"mini":""})}</div>
        <div class="tarot-bottom"><strong>${esc(a.name)}</strong><span>${esc(sub||LAYER_LABEL[layer])}</span></div>
      </div></${tag}>`}function illustCredit(a,sides){const layer=a.layer||"main";const list=layer==="personality"?sides.map(s=>slotFor(a,s)):[slotFor(a,sides[0])];return list.filter(Boolean).map(sl=>sl.ready?`<div class="ill-credit">일러스트 ${esc(sl.title)} · ${esc(sl.credit.license)} · ${esc(sl.credit.author)}</div>`:`<div class="ill-credit missing">일러스트 ${esc(sl.title)} · 준비 중</div>`).join("")}function attrCard(a,{why,id,sides}={}){const layer=a.layer||"main";const full=Object.assign({layer},a);const origin=a.origin==="created"?`<span class="tag-badge created">창작</span>`:`<span class="tag-badge">실제 태그</span>`;return`<article class="panel attr-card" ${id?`id="${esc(id)}"`:""}>
      ${tarot(full,{sides})}
      <div class="attr-body">
        ${why?`<div class="why">${why}</div>`:""}
        <h4>${esc(a.name)} <span class="tag-badge layer">${LAYER_LABEL[layer]}</span>${origin}</h4>
        <p class="summary">${esc(a.summary)}</p>
        <p class="desc">${esc(a.description)}</p>
        <ul>${a.traits.map(t=>`<li>${esc(t)}</li>`).join("")}</ul>
        ${illustCredit(full,sides||["공","수"])}
      </div>
    </article>`}function titleHtml(auxNames,persName,sides){const prefix=auxNames.length?esc(auxNames.join("·"))+" ":"";return sides.map(s=>`${prefix}${esc(persName)}<span class="side-${s==="공"?"gong":"su"}">${s}</span>`).join(`<span class="swap">⇄</span>`)}function expandable(coreHtml,detailHtml){if(!detailHtml)return coreHtml;return`${coreHtml}<details class="more"><summary><span class="when-closed">상세 풀이 보기</span><span class="when-open">접기</span></summary><div class="more-body">${detailHtml}</div></details>`}function renderHome(){const years=[];for(let y=new Date().getFullYear();y>=1930;y--)years.push(y);const opt=(v,label)=>`<option value="${v}">${label}</option>`;const H=DATA.illustrations&&DATA.illustrations.hero;const duo=[["gong","攻","공의 팔자"],["su","受","수의 팔자"]];const heroArt=H?`<figure class="hero-couple"><img src="${esc(H.file)}" srcset="${esc(H.fileSmall)} 720w, ${esc(H.file)} 1200w"
          sizes="(max-width: 640px) 100vw, 620px" width="1200" height="800" alt="${esc(H.alt)}" fetchpriority="high" decoding="async">${H.credit?`<figcaption class="hero-credit">${esc(H.credit.license)} · ${esc(H.credit.author)}</figcaption>`:""}</figure>`:`<div class="hero-duo">${duo.map(([id,seal,label])=>`<figure class="duo-card ${id}">
              ${illust(SLOTS[id],{size:"hero"})}
              <figcaption><span class="duo-seal">${seal}</span> · ${label}</figcaption></figure>`).join("")}</div>`;$("#view-home").innerHTML=`
      <div class="container">
        <div class="hero">
          <div class="hero-ornament">${ornamentSVG()}</div>
          <div class="hero-inner">
            <div class="eyebrow">攻受命理學</div>
            <h1 class="hero-copy">사주팔자에 공수는<br>정해져 있다.</h1>
            <p class="hero-sub">네가 집착할 놈인지, 집착당할 놈인지.</p>
            ${heroArt}
            <form class="panel ornate birth-form" id="birth-form" novalidate>
              <fieldset>
                <legend>“네 사주에 어떤 남자가 들어앉았는지 볼까?”</legend>
                <div class="date-row">
                  <div class="select-wrap"><select id="sel-y" aria-label="태어난 해" required>${opt("","년")}${years.map(y=>opt(y,y+"년")).join("")}</select></div>
                  <div class="select-wrap"><select id="sel-m" aria-label="태어난 달" required>${opt("","월")}${Array.from({length:12},(_,i)=>opt(i+1,i+1+"월")).join("")}</select></div>
                  <div class="select-wrap"><select id="sel-d" aria-label="태어난 날" required>${opt("","일")}</select></div>
                </div>
              </fieldset>
              <button class="btn btn-gold" type="submit">내 공수 팔자 까보기 →</button>
              <div class="form-error" id="form-error" role="alert"></div>
            </form>
            <p class="hero-foot">사주 계산을 활용한 창작 BL 캐릭터 테스트 · 과몰입 주의</p>
          </div>
        </div>
      </div>`;const sy=$("#sel-y"),sm=$("#sel-m"),sd=$("#sel-d");const refillDays=()=>{const keep=sd.value;const n=sy.value&&sm.value?new Date(Date.UTC(+sy.value,+sm.value,0)).getUTCDate():31;sd.innerHTML=opt("","일")+Array.from({length:n},(_,i)=>opt(i+1,i+1+"일")).join("");if(keep&&+keep<=n)sd.value=keep};refillDays();sy.addEventListener("change",refillDays);sm.addEventListener("change",refillDays);$("#birth-form").addEventListener("submit",e=>{e.preventDefault();if(!sy.value||!sm.value||!sd.value){$("#form-error").textContent="태어난 해, 달, 날을 모두 골라 주세요.";return}$("#form-error").textContent="";const date=`${sy.value}-${String(sm.value).padStart(2,"0")}-${String(sd.value).padStart(2,"0")}`;ga("track","test_start");myResult.set(date);showOverlay(()=>{location.hash="#/my"})})}function showOverlay(done){if(reduceMotion){done();return}const ov=$("#overlay");$("#overlay-orb").innerHTML=ornamentSVG();ov.classList.add("show");setTimeout(()=>{done();setTimeout(()=>ov.classList.remove("show"),120)},1100)}function radarSVG(counts){const c=110,R=80;const max=Math.max(3,...Object.values(counts));const pt=(i,r)=>{const a=(-90+i*72)*(Math.PI/180);return[c+r*Math.cos(a),c+r*Math.sin(a)]};const ring=k=>EL_ORDER.map((_,i)=>pt(i,R*k/max).map(v=>v.toFixed(1)).join(",")).join(" ");let grid="";for(let k=1;k<=max;k++)grid+=`<polygon points="${ring(k)}" fill="none" stroke="rgba(215,191,138,${k===max?.45:.16})"/>`;const axes=EL_ORDER.map((_,i)=>{const[x,y]=pt(i,R);return`<line x1="${c}" y1="${c}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="rgba(215,191,138,0.16)"/>`}).join("");const shape=EL_ORDER.map((el,i)=>pt(i,Math.max(4,R*counts[el]/max)).map(v=>v.toFixed(1)).join(",")).join(" ");const labels=EL_ORDER.map((el,i)=>{const[x,y]=pt(i,R+18);return`<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" class="el-${el}" fill="currentColor">${EL_HANJA[el]}</text>`}).join("");return`<svg viewBox="0 0 220 220" role="img" aria-label="오행 분포">${grid}${axes}
      <polygon points="${shape}" fill="rgba(215,191,138,0.28)" stroke="#f0e2bb" stroke-width="1.5"/>
      <g font-family="Noto Serif KR, serif" font-size="15" font-weight="700" text-anchor="middle" dominant-baseline="central">${labels}</g></svg>`}function sajuBoard(p){const col=(lbl,stem,branch,cls="")=>{if(stem==null)return`<div class="saju-col unknown"><div class="lbl">${lbl}</div><div class="gz"><span>?</span><span>?</span></div><div class="kr">시각 미상</div></div>`;const se=L.STEM_ELEMENT[stem],be=L.BRANCH_ELEMENT[branch];return`<div class="saju-col ${cls}"><div class="lbl">${lbl}</div>
        <div class="gz"><span class="el-${se}">${L.STEMS_HANJA[stem]}</span><span class="el-${be}">${L.BRANCHES_HANJA[branch]}</span></div>
        <div class="kr">${se}·${be}</div></div>`};return`<div class="saju-board">
      ${col("時柱",null)}
      ${col("日柱",p.day.stem,p.day.branch,"day")}
      ${col("月柱",p.month.stem,p.month.branch)}
      ${col("年柱",p.year.stem,p.year.branch)}
    </div>`}function heroCard(pers,posId,label="本 命"){const seal={gong:"攻",su:"受",reverse:"攻受"}[posId];return`<div class="hero-card ${posId}">
      <div class="hero-card-frame">
        <span class="hc-corner tl"></span><span class="hc-corner tr"></span><span class="hc-corner bl"></span><span class="hc-corner br"></span>
        <div class="hc-label">${label}</div>
        <div class="hc-art ${posId==="reverse"?"pair":""}">
          ${SIDES_OF[posId].map(side=>illust(slotFor(pers,side),{size:posId==="reverse"?"half":"hero"})).join("")}
          <span class="hc-seal ${posId}">${seal}</span>
        </div>
      </div>
    </div>`}function honmyeongLine(r,sub="당신의 본명 대사"){const pick=window.BLLines&&window.BLLines.pick(DATA,r);if(!pick)return"";return`<figure class="honmyeong" data-source="${pick.source}">
      <figcaption class="hm-label"><span class="hm-hanja">本命臺詞</span> · ${esc(sub)}</figcaption>
      <blockquote class="hm-line">“${esc(pick.line)}”</blockquote>
      <p class="hm-note">${esc(pick.note)}</p>
    </figure>`}function secHead(num,title,sub,basis){return`<header class="sec-head"><span class="sec-num">${num}</span><div class="sec-title"><h2>${title}</h2>${sub?`<p>${sub}</p>`:""}</div>${basis&&BADGE[basis]||""}</header>`}function topList(side,list,posId){const isMain=SIDES_OF[posId].includes(side);const row=x=>`<a class="bar-row ${x.chosen?"top":""}" href="#/codex/${x.id}" title="속성 도감에서 ${esc(x.name)} 보기">
      <span class="name">${esc(x.label)}${x.status==="combo"?` <em class="combo-mark" title="조합 창작 — 실제 키워드를 공수명리학이 공·수에 맞게 응용한 유형">조합 창작</em>`:""}${x.chosen?` <em class="mine">내 유형</em>`:""}</span>
      <span class="bar-track"><span class="bar-fill ${side==="공"?"gong":"su"}" style="width:${x.pct}%"></span></span><span class="val">${x.pct}%</span></a>`;return`<div class="panel top5 ${side==="공"?"gong":"su"}">
      <div class="top5-head"><span class="top5-seal">${side==="공"?"攻":"受"}</span><div><h3>${side} 속성 TOP 5</h3>
        <p class="faint">${isMain?`판정된 자리 — 1위가 당신의 유형입니다`:`반대편 자리에서 숨어 있는 기운입니다`}</p></div></div>
      <div class="bars">${list.slice(0,5).map(row).join("")}</div>
      <details class="more more-list"><summary><span class="when-closed">나머지 ${list.length-5}개 보기</span><span class="when-open">접기</span></summary>
        <div class="bars">${list.slice(5).map(row).join("")}</div></details>
    </div>`}function traitItem(a,side,kicker,used,frameSides){const line=window.BLLines&&window.BLLines.cardLine(DATA,a,side,used);if(line&&used)used.add(line);return`<div class="trait">
      ${tarot(a,{href:"#/codex/"+a.id,sub:kicker,size:"mini",sides:[side],frameSides})}
      <div class="trait-body">
        <span class="trait-kicker">${esc(kicker)}</span>
        <h3><a href="#/codex/${esc(a.id)}">${esc(a.name+side)}</a></h3>
        <p class="trait-sum">${esc(a.summary)}</p>
        ${line?`<p class="trait-line">“${esc(line)}”</p>`:`<p class="trait-desc">${esc(splitFirst(a.description)[0])}</p>`}
      </div>
    </div>`}function sceneBlock(sc){if(!sc||!sc.lines||!sc.lines.length)return"";const sk=s=>s==="공"?"gong":"su";return`<figure class="scene" data-source="${sc.source}">
      <figcaption class="scene-title"><span class="hm-hanja">運命</span>의 한 장면</figcaption>
      <div class="scene-lines">${sc.lines.map(l=>`<p class="scene-line"><span class="who side-${sk(l.side)}">${esc(l.who)}</span><span class="say">“${esc(l.text)}”</span></p>`).join("")}</div>
      <p class="scene-narr">${esc(sc.narration)}</p>
    </figure>`}function storyConversationTitle(name){const code=String(name).charCodeAt(String(name).length-1)-44032;return name+(code>=0&&code<=11171&&code%28?"과":"와")+" 이야기하기"}function storyBlock(st){if(!st)return"";const sk=s=>s==="공"?"gong":"su";const beat=b=>{if(b.act)return`<p class="story-act">${esc(b.act)}</p>`;const mine=b.me!=null;const who=mine?`나 <small>${esc(st.me)}</small>`:esc(st.partner);return`<p class="story-line${mine?" is-me":""}"><span class="who side-${sk(mine?st.side:st.partnerSide)}">${who}</span><span class="say">“${esc(mine?b.me:b.partner)}”</span></p>`};const mySay=c=>c.say?beat({me:c.say}):"";return`<div class="story" id="story" data-ga-story="${esc(st.me)}>${esc(st.partner)}" data-ga-side="${st.side==="공"?"gong":"su"}" data-ga-type="${esc(st.me)}">
      <div class="story-head">
        <p class="story-kicker">이상형과 이야기하기</p>
        <h3 class="story-title">${esc(storyConversationTitle(st.partner))}</h3>
        <p class="story-cast"><span class="side-${sk(st.side)}">나 · ${esc(st.me)}</span><span class="x">×</span><span class="side-${sk(st.partnerSide)}">${esc(st.partner)}</span></p>
        <h4 class="story-scenario-title">${esc(st.title)}</h4>
      </div>
      <div class="story-setting">${st.setting.map(t=>`<p>${esc(t)}</p>`).join("")}</div>
      <div class="story-beats">${st.opening.map(beat).join("")}</div>
      <div class="story-pick" role="group" aria-labelledby="story-q">
        <p class="story-q" id="story-q">당신의 선택은?</p>
        ${st.choices.map((c,i)=>`<button type="button" class="story-choice" data-choice="${i}"><span class="story-no">${"ABC"[i]}</span><span class="story-ct"><span class="story-label">${esc(c.label)}</span>${c.say?`<span class="story-say">“${esc(c.say)}”</span>`:""}</span></button>`).join("")}
      </div>
      <div class="story-out" aria-live="polite">
        ${st.choices.map((c,i)=>`<div class="story-res" data-for="${i}" tabindex="-1" hidden>
          <p class="story-mine"><span class="story-no">${"ABC"[i]}</span><span>${esc(c.label)}</span></p>
          <div class="story-beats">${mySay(c)}${c.beats.map(beat).join("")}</div>
          <p class="story-end"><span class="story-end-tag">결말</span>${esc(c.ending)}</p>
        </div>`).join("")}
        <button type="button" class="btn btn-ghost story-retry" hidden>다른 선택 해보기</button>
      </div>
    </div>`}function bindStory(root){const box=root.querySelector("#story");if(!box)return;if(typeof IntersectionObserver==="function"){const io=new IntersectionObserver(entries=>{if(!entries.some(e=>e.isIntersecting&&e.intersectionRatio>=.5))return;io.disconnect();ga("track","story_start",{story_type:"saju",story_id:box.dataset.gaStory,character_type:box.dataset.gaType,position:box.dataset.gaSide})},{threshold:[0,.5,1]});io.observe(box)}const pick=box.querySelector(".story-pick"),retry=box.querySelector(".story-retry");const res=[...box.querySelectorAll(".story-res")];box.querySelectorAll(".story-choice").forEach(b=>b.addEventListener("click",()=>{if(box.dataset.chosen)return;box.dataset.chosen=b.dataset.choice;pick.hidden=true;const el=res[Number(b.dataset.choice)];el.hidden=false;ga("storyChoice",Number(b.dataset.choice)+1,el.querySelector(".story-end"));retry.hidden=false;el.focus({preventScroll:true});el.scrollIntoView({behavior:"smooth",block:"nearest"})}));retry.addEventListener("click",()=>{delete box.dataset.chosen;res.forEach(el=>{el.hidden=true});retry.hidden=true;pick.hidden=false;pick.scrollIntoView({behavior:"smooth",block:"nearest"});const first=pick.querySelector(".story-choice");if(first)first.focus({preventScroll:true})})}function hintBtn(id,text){return`<button type="button" class="hint-btn" aria-controls="${id}" aria-expanded="false" aria-label="설명 보기" title="${esc(text)}">?</button>`}function hintPop(id,text){return`<p class="hint-pop" id="${id}" hidden>${esc(text)}</p>`}const HINT={fit:"대표 유형 적합도: 공수명리학 자체 규칙으로 계산한, 이 캐릭터 유형과의 일치 정도예요. 통계적 확률이 아니며, 아래 상세 풀이의 공수 비율과는 다른 지표예요.",ratio:"공수 비율: 자체 규칙으로 계산한 공/수 성향의 상대적인 분포예요(두 값의 합은 100%). 위쪽 '대표 유형 적합도'와는 다른 지표이고, 통계적 확률이 아니에요."};function renderResult(dateStr){let r;try{r=L.judge(DATA,dateStr)}catch(e){$("#view-result").innerHTML=`<div class="container"><div class="panel" style="text-align:center"><p>${esc(e.message)}</p><a class="btn btn-gold" href="#/">다시 입력하기</a></div></div>`;return}const p=r.pillars,m=r.metrics,rs=r.reasoning;const pers=r.personality,posId=r.position.id,sides=SIDES_OF[posId];const main=mainAttr(posId);const typeLabel=pers.name+sides.join("·");const[y,mo,d]=r.input.split("-").map(Number);const fmt=v=>(v>=0?"+":"")+v.toFixed(2);const counts=m.elements;const strongest=EL_ORDER.filter(e=>counts[e]===Math.max(...Object.values(counts)));const empty=EL_ORDER.filter(e=>counts[e]===0);const matchAttr=findAttr("personality",pers.reading.match.id);const matchSides=posId==="gong"?["수"]:posId==="su"?["공"]:["공","수"];const sideKey=s=>s==="공"?"gong":"su";const side0=sides[0];const BL=window.BLLines;const mainPick=BL&&BL.pick(DATA,r);const matchLines=matchSides.map(s=>BL&&BL.of(DATA,matchAttr,s));const sc=BL&&BL.scene(DATA,r);const st=BL&&BL.story?BL.story(DATA,r):null;const stLines=st?[st.opening,...st.choices.map(c=>[{me:c.say},...c.beats])].flat().map(b=>b.me||b.partner):[];const used=new Set([mainPick&&mainPick.line,...matchLines.map(v=>v&&v.line),...sc?sc.lines.map(l=>l.text):[],...stLines].filter(Boolean));const traits=[traitItem(pers,side0,"성격",used,sides),...r.aux.map(a=>traitItem(a,side0,"조건",used,sides)),traitItem(r.bonus,side0,"숨은 기운",used,sides)];const lucky=pers.reading.lucky;const persCore=sides.map(s=>`<p><span class="side-note">${esc(pers.name+s)}</span>${esc(splitFirst(pers.reading[sideKey(s)])[0])}</p>`).join("");const persRest=sides.map(s=>splitFirst(pers.reading[sideKey(s)])[1]).filter(Boolean);const auxParts=r.aux.map((a,i)=>({a,from:rs.aux[i].from,parts:splitFirst(a.reading)}));const bonusParts=splitFirst(r.bonus.reading);const ratioLead=posId==="reverse"?`공과 수 성향이 가까워 리버스로 판정됐어요.`:`${esc(main.name)} 성향이 앞서 ${esc(main.name)}${main.name==="수"?"로":"으로"} 판정됐어요.`;$("#view-result").innerHTML=`<div class="container result-page">

      <!-- 01 당신의 BL 캐릭터 -->
      <section class="r-sec" id="r-type">
        ${secHead("01","당신의 BL 캐릭터","네 사주에 들어앉은 남자")}
        <div class="result-hero${posId==="reverse"?" is-reverse":""}">
          ${heroCard(pers,posId)}
          <div class="result-hero-text">
            <div class="result-meta"><button type="button" class="birth-toggle" aria-expanded="false">생년월일 보기</button><span class="birth-secret" hidden>${y}년 ${mo}월 ${d}일생</span></div>
            <h1 class="result-title">${titleHtml(r.aux.map(a=>a.name),pers.name,sides)}</h1>
            <div class="type-pct"><span class="label">${esc(typeLabel)} 적합도</span><span class="pct">${m.strength}%</span>${hintBtn("hint-fit",HINT.fit)}</div>
            ${hintPop("hint-fit",HINT.fit)}
            <p class="fit-note">공수명리학 자체 규칙으로 계산한 오락용 지표예요. 통계적 확률이 아니에요.</p>
            ${honmyeongLine(r)}
            <div class="conversation-actions">${st?`<button type="button" class="btn btn-gold story-jump conversation-jump" data-target="story" aria-controls="story">이상형과 이야기하기 <span aria-hidden="true">↓</span></button>`:`<button type="button" class="btn btn-gold story-jump conversation-jump" data-target="r-match" aria-controls="r-match">운명의 상대 확인하기 <span aria-hidden="true">↓</span></button>`}</div>
          </div>
        </div>
        ${window.ShareCard?`<div class="card-save"><button type="button" class="btn btn-ghost" id="card-save-btn">${window.ShareCard.DL_ICON}<span>내 캐릭터 카드 저장하기</span></button></div>`:""}
      </section>

      <!-- 02 내 캐릭터를 완성하는 속성 -->
      <section class="r-sec">
        ${secHead("02","내 캐릭터를 완성하는 속성","카드를 누르면 속성 도감으로 이동해요")}
        <div class="traits">${traits.join("")}</div>
        <details class="more more-traits"><summary><span class="when-closed">내 안에 숨은 다른 속성 더 보기</span><span class="when-open">접기</span></summary>
          <p class="more-lead">공 자리와 수 자리에서 각각 짙게 깃든 성격속성 순위예요.</p>
          <div class="top5-grid">${topList("공",m.sideAffinity["공"],posId)}${topList("수",m.sideAffinity["수"],posId)}</div>
        </details>
      </section>

      <!-- 03 운명의 상대 -->
      <section class="r-sec" id="r-match">
        ${secHead("03","운명의 상대",posId==="reverse"?"공으로 서든 수로 서든, 결국 엮이는 놈":"반대편 자리에서 너를 기다리는 놈")}
        <div class="panel match-panel">
          ${tarot(matchAttr,{sub:matchAttr.name+matchSides.join("·"),href:"#/codex/"+matchAttr.id,sides:matchSides})}
          <div>
            <div class="match-title">${matchSides.map(s=>esc(matchAttr.name)+`<span class="side-${sideKey(s)}">${s}</span>`).join(`<span class="swap">⇄</span>`)}</div>
            ${matchLines.map(v=>v&&v.line?`<p class="match-line">“${esc(v.line)}”</p>`:"").join("")}
            <p class="match-blurb">${esc(sc&&sc.blurb||pers.reading.match.text)}</p>
          </div>
        </div>
        <div class="cliche">
          <div class="cliche-title">둘이 엮이는 클리셰</div>
          <div class="lucky">
            <div><span>장면</span><b>${esc(lucky.scene)}</b></div>
            <div><span>소품</span><b>${esc(lucky.item)}</b></div>
            <div><span>장소</span><b>${esc(lucky.place)}</b></div>
          </div>
        </div>
        ${sceneBlock(sc)}
        ${storyBlock(st)}
      </section>

      <!-- 04 상세 명리학 풀이 (기본 접힘) -->
      <section class="r-sec">
        <details class="deep" id="deep">
          <summary>
            <span class="sec-num">04</span>
            <span class="deep-title"><b>상세 명리학 풀이</b><small>간지·오행·공수 판정 근거와 명리학풍 해석</small></span>
            <span class="deep-btn"><span class="when-closed">내 사주 풀이 자세히 보기 ▼</span><span class="when-open">접기 ▲</span></span>
          </summary>
          <div class="deep-body">
            <div class="basis-legend">${BADGE.calc}<span>만세력 규칙으로 계산한 값 (일주는 날짜 기준, 연·월은 절입일 근사, 시주 제외)</span>${BADGE.made}<span>공수명리학이 지어낸 규칙과 해석 (오락용)</span></div>

            <h3 class="deep-h"><span class="deep-k">A</span>명식과 오행 ${BADGE.calc}</h3>
            <ul class="deep-sum">
              <li><b>일주</b>${p.day.hanja} ${esc(p.day.label)} · 일간 ${esc(p.day.element)}(${p.day.yang?"양":"음"})</li>
              <li><b>띠</b>${esc(p.year.zodiac)}띠 (${p.year.hanja}, 입춘 기준)</li>
              <li><b>가장 짙은 기운</b>${strongest.map(e=>`${e}(${EL_HANJA[e]})`).join("·")}</li>
              <li><b>시주</b>미상 — 출생 시각을 받지 않아요</li>
            </ul>
            <div class="analysis-grid">
              <div class="panel">
                <div class="panel-head"><h3>명식</h3></div>
                <p class="faint">연·월·일 세 기둥의 간지입니다.</p>
                ${sajuBoard(p)}
                <p class="board-note">입춘·절입일은 날짜 고정값으로 근사했습니다. 경계일 전후 출생이라면 실제 만세력과 하루쯤 어긋날 수 있습니다.</p>
              </div>
              <div class="panel">
                <div class="panel-head"><h3>오행의 분포</h3></div>
                <p class="faint">시주를 뺀 여섯 글자의 오행을 셌습니다.</p>
                <div class="five">${radarSVG(counts)}
                  <ul>${EL_ORDER.map(e=>`<li><span class="el-${e} serif">${EL_HANJA[e]} ${e}</span><span>${counts[e]?counts[e]+"자":"비어 있음"}</span></li>`).join("")}</ul>
                </div>
                <p class="reading-text made-line">${BADGE.made} ${empty.length?`공수명리학은 비어 있는 ${empty.map(e=>`${e}(${EL_HANJA[e]})`).join("·")}의 자리를 '앞으로 만날 상대가 채워 줄 자리'로 풀이합니다.`:"다섯 기운이 고루 들어 있으니, 공수명리학은 이를 '어떤 장르에 던져 놓아도 살아남는 상'으로 풀이합니다."}</p>
              </div>
            </div>

            <h3 class="deep-h"><span class="deep-k">B</span>공수 성향 분석 ${BADGE.made}${hintBtn("hint-ratio",HINT.ratio)}</h3>
            ${hintPop("hint-ratio",HINT.ratio)}
            <div class="panel">
              <div class="spectrum">
                <div class="spectrum-labels"><span class="su">수 성향 <b>${m.suPct}%</b></span><span class="gong">공 성향 <b>${m.gongPct}%</b></span></div>
                <div class="spectrum-bar" role="img" aria-label="수 성향 ${m.suPct}%, 공 성향 ${m.gongPct}%"><div class="spectrum-knob" style="left:${m.gongPct}%"></div></div>
                <div class="spectrum-zones"><span>受</span><span>리버스</span><span>攻</span></div>
              </div>
              <p class="ratio-lead">${ratioLead} <span class="faint">대표 유형 적합도(${m.strength}%)와는 다른 지표예요.</span></p>
              <p class="reading-text"><strong>${esc(main.reading.headline)}.</strong> ${esc(splitFirst(main.reading[m.intensity])[0])}</p>
            </div>

            <h3 class="deep-h"><span class="deep-k">C</span>명리학풍 캐릭터 해석 ${BADGE.made}</h3>
            <div class="panel">
              <div class="reading-list">
                <div class="reading-block"><div class="seal">性</div><div>
                  <h3>${esc(pers.reading.headline)} <small>${esc(typeLabel)} · ${esc(pers.element)}(${EL_HANJA[pers.element]})의 기운</small></h3>
                  ${persCore}</div></div>
                <div class="reading-block"><div class="seal">緣</div><div>
                  <h3>타고난 조건 <small>${r.aux.map(a=>esc(a.name)).join(" · ")}</small></h3>
                  ${auxParts.map(x=>`<p><span class="lead-in">${esc(x.a.name)}</span>${esc(x.parts[0])}</p>`).join("")}</div></div>
                <div class="reading-block"><div class="seal created">隱</div><div>
                  <h3>숨은 기운 · ${esc(r.bonus.name)} <small>창작 보너스 · 신살에서 이름만 빌림</small></h3>
                  <p>${esc(bonusParts[0])}</p></div></div>
                <div class="reading-block"><div class="seal">合</div><div>
                  <h3>운명의 상대 <small>${esc(matchAttr.name)}${matchSides.join("·")}</small></h3>
                  <p>${esc(pers.reading.match.text)}</p></div></div>
              </div>
              <details class="more more-reading"><summary><span class="when-closed">전체 해석 보기</span><span class="when-open">접기</span></summary>
                <div class="more-body">
                  <p><span class="lead-in">성정</span>${esc(pers.reading.reading)}</p>
                  ${persRest.map(t=>`<p>${esc(t)}</p>`).join("")}
                  ${auxParts.filter(x=>x.parts[1]).map(x=>`<p><span class="lead-in">${esc(x.a.name)}</span><span class="faint small">${esc(x.from)} · </span>${esc(x.parts[1])}</p>`).join("")}
                  ${bonusParts[1]?`<p><span class="lead-in">${esc(r.bonus.name)}</span>${esc(bonusParts[1])}</p>`:""}
                  <p><span class="lead-in">경계할 것</span>${esc(pers.reading.caution)}</p>
                  ${splitFirst(main.reading[m.intensity])[1]?`<p><span class="lead-in">공수의 기운</span>${esc(splitFirst(main.reading[m.intensity])[1])}</p>`:""}
                </div>
              </details>
            </div>

            <h3 class="deep-h"><span class="deep-k">D</span>내 캐릭터 태그</h3>
            <div class="panel">
              <div class="chips">${r.tags.map(chip).join("")}</div>
              ${legend}
              <p class="faint small tag-src">실제 태그는 BL 작품에서 실제로 쓰이는 키워드이고, 창작 태그는 공수명리학에서 새로 만든 표현이에요. 키워드를 확인한 곳은 <a href="#/about">풀이 원리</a>에 정리해 두었어요.</p>
            </div>

            <h3 class="deep-h"><span class="deep-k">E</span>판정 계산 과정</h3>
            <details class="panel basis">
              <summary>계산 과정 펼쳐 보기</summary>
              <table class="kv">
                <tr><th>입력</th><td><button type="button" class="birth-toggle" aria-expanded="false">생년월일 보기</button><span class="birth-secret" hidden>${esc(r.input)} (양력)</span></td><td>${BADGE.calc}</td></tr>
                <tr><th>연주 · 띠</th><td>${p.year.hanja} ${esc(p.year.label)}년 · ${esc(p.year.zodiac)}띠 <span class="faint small">(입춘 2/4 근사)</span></td><td>${BADGE.calc}</td></tr>
                <tr><th>월주</th><td>${p.month.hanja} ${esc(p.month.label)}월 · 월지 오행 ${esc(p.month.element)} <span class="faint small">(절입일 근사)</span></td><td>${BADGE.calc}</td></tr>
                <tr><th>일주</th><td>${p.day.hanja} ${esc(p.day.label)}일 · 일간 ${esc(p.day.element)}(${p.day.yang?"양":"음"})</td><td>${BADGE.calc}</td></tr>
                ${rs.position.breakdown.map(b=>`<tr><th>${esc(b.label)}</th><td class="num">${fmt(b.value)}</td><td>${BADGE.made}</td></tr>`).join("")}
                <tr><th>공수 점수</th><td class="num"><strong>${fmt(rs.position.score)}</strong> → ${esc(main.name)} (공 ≥ +${L.POSITION.threshold}, 수 ≤ −${L.POSITION.threshold})</td><td>${BADGE.made}</td></tr>
                <tr><th>성격속성</th><td>${esc(pers.name)} — ${esc(rs.personality.why)}, 추첨 확률 ${(rs.personality.probability*100).toFixed(1)}%</td><td>${BADGE.made}</td></tr>
                ${rs.aux.map(x=>`<tr><th>보조속성</th><td>${esc(x.attr.name)} ← ${esc(x.from)}</td><td>${BADGE.made}</td></tr>`).join("")}
                <tr><th>창작 보너스</th><td>${esc(r.bonus.name)} ← 생년월일 해시</td><td>${BADGE.made}</td></tr>
                <tr><th>화면의 % 수치</th><td>대표 유형 적합도 ${m.strength}% · 공수 비율(수 ${m.suPct}% / 공 ${m.gongPct}%) · 속성 순위는 판정이 끝난 뒤 보여 주기 위한 값이며, 어떤 속성이 뽑히는지에는 영향을 주지 않습니다.</td><td>${BADGE.made}</td></tr>
                <tr><th>본명 대사 · 상황극</th><td>판정된 유형과 운명의 상대에 맞춰 고른 창작 문구입니다. 특정 작품의 대사를 인용하지 않았습니다.</td><td>${BADGE.made}</td></tr>
              </table>
            </details>
          </div>
        </details>
      </section>

      <div class="actions">
        <button class="btn btn-gold" type="button" id="copy-link">내 유형 링크 복사</button>
        <a class="btn btn-ghost" href="#/">다른 생년월일 보기</a>
        <a class="btn btn-ghost" href="#/codex">속성 도감</a>
      </div>
      <p class="result-foot">사주 계산을 활용한 창작 BL 캐릭터 테스트예요. 간지 셈만 만세력 규칙을 따르고(연·월은 근사, 시주 제외), 공수·속성·대사는 모두 창작입니다. 등장인물은 모두 성인이며, 진짜 취향과 포지션은 오직 당신만이 정합니다.</p>
    </div>`;$("#copy-link").addEventListener("click",async()=>{try{await navigator.clipboard.writeText(siteBase()+"#/t/"+pers.id+"-"+posId);toast("유형 소개 링크를 복사했어요 · 생년월일과 상세 결과는 들어가지 않아요");ga("track","result_link_copy")}catch(_){toast("주소창의 링크를 복사해 주세요")}});$("#view-result").querySelectorAll(".hint-btn").forEach(b=>b.addEventListener("click",e=>{e.preventDefault();const pop=document.getElementById(b.getAttribute("aria-controls"));if(!pop)return;pop.hidden=!pop.hidden;b.setAttribute("aria-expanded",String(!pop.hidden))}));bindStory($("#view-result"));$("#view-result").querySelectorAll(".birth-toggle").forEach(b=>b.addEventListener("click",()=>{const show=b.getAttribute("aria-expanded")!=="true";$("#view-result").querySelectorAll(".birth-secret").forEach(s=>{s.hidden=!show});$("#view-result").querySelectorAll(".birth-toggle").forEach(x=>{x.setAttribute("aria-expanded",String(show));x.textContent=show?"생년월일 숨기기":"생년월일 보기"})}));const jump=$("#view-result .story-jump");if(jump)jump.addEventListener("click",()=>{const box=document.getElementById(jump.dataset.target);if(!box)return;const reduce=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;box.scrollIntoView({behavior:reduce?"auto":"smooth",block:"start"});const title=box.querySelector(".story-title, .sec-title h2, h2");if(title){title.setAttribute("tabindex","-1");title.focus({preventScroll:true})}});ga("result",{position:posId,main_type:sides.length>1?`${pers.name}(리버스)`:pers.name+side0,partner_type:matchSides.length>1?`${matchAttr.name}(공·수)`:matchAttr.name+matchSides[0]},r.input);const restart=$("#view-result .actions a[href='#/']");if(restart)restart.addEventListener("click",()=>ga("track","test_restart"));const cardBtn=$("#card-save-btn");if(cardBtn)cardBtn.addEventListener("click",()=>window.ShareCard.open({posId,titles:sides.map(s=>pers.name+s),line:mainPick?mainPick.line:"",lineNarrows:!!(mainPick&&mainPick.source==="combo"),images:sides.map(side=>{const sl=slotFor(pers,side);return{side,src:sl&&sl.ready?sl.file:null}}),fileName:pers.name+sides.join(""),url:location.origin+location.pathname.replace(/(web\/)?(index\.html)?$/,""),me:{name:pers.name,sides},partner:{name:matchAttr.name,sides:matchSides}},cardBtn))}function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.classList.remove("show"),1800)}const FILTERS=[["all","전체"],["main","메인 포지션"],["personality","성격속성"],["aux","보조속성"],["bonus","창작 보너스"]];let codexFilter="all";function renderCodex(focusId){const all=[...DATA.main.map(a=>Object.assign({layer:"main"},a)),...DATA.personality,...DATA.aux,...DATA.bonus];if(focusId&&all.some(a=>a.id===focusId))codexFilter="all";const list=all.filter(a=>codexFilter==="all"||(a.layer||"main")===codexFilter);$("#view-codex").innerHTML=`<div class="container">
      <div class="eyebrow">屬性圖鑑</div>
      <h1 class="section-title">속성 도감</h1>
      <p class="section-lead">당신이 좋아하는 캐릭터는 어떤 타입인가요? 다정한 공부터 무심한 수까지, 공수명리학의 다양한 캐릭터 속성을 모았어요. 각 속성의 특징과 매력을 살펴보고, 마음에 드는 타입을 찾아보세요.</p>
      <div class="filters" role="group" aria-label="분류">${FILTERS.map(([k,l])=>`<button type="button" data-k="${k}" aria-pressed="${k===codexFilter}">${l} <span class="faint">${k==="all"?all.length:all.filter(a=>(a.layer||"main")===k).length}</span></button>`).join("")}</div>
      <div class="spread">${list.map(a=>attrCard(a,{id:"card-"+a.id})).join("")}</div>
    </div>`;$("#view-codex .filters").addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;codexFilter=b.dataset.k;if(location.hash!=="#/codex")history.replaceState(null,"","#/codex");renderCodex()});if(focusId){const el=document.getElementById("card-"+focusId);if(el)el.classList.add("focus")}}const bState={positionId:"gong",personalityId:DATA.personality[0].id,aux1:DATA.aux[0].id,aux2:"",bonusId:""};function renderBuilder(){const opt=(list,sel,none)=>(none?`<option value="">${none}</option>`:"")+list.map(a=>`<option value="${a.id}" ${a.id===sel?"selected":""}>${esc(a.name)}</option>`).join("");const nAux=DATA.aux.length;const total=DATA.main.length*DATA.personality.length*(1+nAux+nAux*(nAux-1)/2)*(DATA.bonus.length+1);$("#view-builder").innerHTML=`<div class="container">
      <div class="eyebrow">類型組合</div>
      <h1 class="section-title">유형 조합</h1>
      <p class="section-lead">메인 포지션, 성격속성, 보조속성, 창작 보너스를 직접 골라 ${total.toLocaleString()}가지 유형 가운데 하나를 만들어 보세요. 조합마다 실제 플랫폼 태그인지 창작인지가 함께 표시됩니다.</p>
      <div class="panel ornate">
        <div class="builder-controls">
          <label>메인 포지션<div class="seg" id="b-pos">${DATA.main.map(m=>`<button type="button" data-id="${m.id}" aria-pressed="${m.id===bState.positionId}">${esc(m.name)}</button>`).join("")}</div></label>
          <label>성격속성<div class="select-wrap"><select id="b-pers">${opt(DATA.personality,bState.personalityId)}</select></div></label>
          <label>보조속성 1<div class="select-wrap"><select id="b-aux1">${opt(DATA.aux,bState.aux1,"(없음)")}</select></div></label>
          <label>보조속성 2<div class="select-wrap"><select id="b-aux2">${opt(DATA.aux,bState.aux2,"(없음)")}</select></div></label>
          <label>창작 보너스<div class="select-wrap"><select id="b-bonus">${opt(DATA.bonus,bState.bonusId,"(없음)")}</select></div></label>
        </div>
      </div>
      <div class="builder-preview" id="b-preview"></div>
    </div>`;$("#b-pos").addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;bState.positionId=b.dataset.id;$("#b-pos").querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed",x===b));renderBuilderPreview()});[["#b-pers","personalityId"],["#b-aux1","aux1"],["#b-aux2","aux2"],["#b-bonus","bonusId"]].forEach(([s,k])=>$(s).addEventListener("change",e=>{bState[k]=e.target.value;renderBuilderPreview()}));renderBuilderPreview()}function renderBuilderPreview(){const auxIds=[...new Set([bState.aux1,bState.aux2].filter(Boolean))];const c=L.compose(DATA,{positionId:bState.positionId,personalityId:bState.personalityId,auxIds,bonusId:bState.bonusId||null});const sides=SIDES_OF[bState.positionId];const nReal=c.tags.filter(t=>t.status==="platform").length;const main=mainAttr(bState.positionId);const pers=c.personality;const sideBlocks=sides.map(s=>({s,parts:splitFirst(pers.reading[s==="공"?"gong":"su"])}));$("#b-preview").innerHTML=`
      <div class="panel">
        <div class="result-meta">태그 ${c.tags.length}개 중 실제 플랫폼 태그 ${nReal}개</div>
        <div class="builder-title">${titleHtml(c.aux.map(a=>a.name),pers.name,sides)}</div>
        <div class="chips">${c.tags.map(chip).join("")}</div>
        ${legend}
        <div class="reading-list" style="margin-top:26px">
          <div class="reading-block"><div class="seal">性</div><div><h3>${esc(pers.reading.headline)}</h3>
            ${expandable(sideBlocks.map(b=>`<p class="core"><span class="side-note">${esc(pers.name+b.s)}</span>${esc(b.parts[0])}</p>`).join(""),`<p>${esc(pers.reading.reading)}</p>${sideBlocks.filter(b=>b.parts[1]).map(b=>`<p>${esc(b.parts[1])}</p>`).join("")}`)}</div></div>
          ${c.aux.length?`<div class="reading-block"><div class="seal">緣</div><div><h3>타고난 조건</h3>${c.aux.map(a=>`<p class="core"><span class="lead-in">${esc(a.name)}</span>${esc(splitFirst(a.reading)[0])}</p>`).join("")}</div></div>`:""}
          ${c.bonus?`<div class="reading-block"><div class="seal created">隱</div><div><h3>숨은 기운 · ${esc(c.bonus.name)}</h3><p class="core">${esc(splitFirst(c.bonus.reading)[0])}</p></div></div>`:""}
        </div>
      </div>
      <div class="spread" style="margin-top:22px">
        ${attrCard(main)}${attrCard(pers,{sides})}${c.aux.map(a=>attrCard(a,{sides})).join("")}${c.bonus?attrCard(c.bonus):""}
      </div>`}const IDEAL=window.BL_IDEAL||{order:[],stories:{}};const josaIeyo=word=>{const c=String(word).charCodeAt(String(word).length-1)-44032;return c>=0&&c<=11171&&c%28?"이에요":"예요"};function idealParts(key){const s=IDEAL.stories[key];if(!s)return null;const ideal=findAttr("personality",s.ideal.id),role=findAttr("personality",s.role.id);if(!ideal||!role||ideal.reading.match.id!==role.id||s.role.side===s.ideal.side)return null;return{key,s,ideal,role}}function renderIdeal(arg,sub){const box=$("#view-ideal");const p=arg?idealParts(arg):null;if(!p){box.innerHTML=idealPickHtml(arg?"찾을 수 없는 이상형이에요. 아래에서 다시 골라 주세요.":"");box.querySelectorAll(".ideal-pick").forEach(a=>a.addEventListener("click",()=>{const q=idealParts(a.dataset.key);if(q)ga("track","ideal_select",{ideal_type:q.s.ideal.name,role_type:q.s.role.name})}));return null}if(sub==="story"){box.innerHTML=idealStoryHtml(p);bindIdealStory(box,p);return p.key+"/story"}box.innerHTML=idealIntroHtml(p);return p.key}function idealPickHtml(notice){const list=IDEAL.order.map(idealParts).filter(Boolean);const credit=list.map(p=>slotFor(p.ideal,p.s.ideal.side)).find(sl=>sl&&sl.ready&&sl.credit);return`<div class="container ideal-page">
      <div class="eyebrow">理想</div>
      <h1 class="section-title">이상형 만나기</h1>
      <p class="section-lead">어떤 이상형을 만나볼까요? 마음이 가는 상대를 골라 주세요. 지금은 세 명의 이상형을 만나볼 수 있어요.</p>
      ${notice?`<p class="ideal-notice" role="status">${esc(notice)}</p>`:""}
      <div class="ideal-grid">
        ${list.map(({key,s,ideal})=>`<a class="ideal-pick" href="#/ideal/${esc(key)}" data-key="${esc(key)}">
          <div class="ideal-pick-art">${illust(slotFor(ideal,s.ideal.side))}</div>
          <div class="ideal-pick-text">
            <div class="ideal-pick-name">${titleHtml([],ideal.name,[s.ideal.side])}</div>
            <div class="ideal-pick-sum">${esc(ideal.summary)}</div>
          </div>
        </a>`).join("")}
      </div>
      ${credit?`<p class="ill-credit ideal-credit">캐릭터 일러스트 · ${esc(credit.credit.license)} · ${esc(credit.credit.author)}</p>`:""}
    </div>`}function idealIntroHtml({key,s,ideal,role}){const side=s.ideal.side,posId=side==="공"?"gong":"su";const me=window.BLLines?window.BLLines.of(DATA,ideal,side):null;const roleNote=window.BLLines?window.BLLines.of(DATA,role,s.role.side):null;return`<div class="container ideal-page result-page">
      <a class="ideal-back" href="#/ideal">← 다른 이상형 고르기</a>
      <div class="result-hero ideal-hero">
        ${heroCard(ideal,posId,"理 想")}
        <div class="result-hero-text">
          <div class="result-meta">당신이 고른 이상형</div>
          <h1 class="result-title">${titleHtml([],ideal.name,[side])}</h1>
          ${me&&me.note?`<p class="type-sum">${esc(me.note)}</p>`:""}
          ${me&&me.line?`<figure class="honmyeong"><figcaption class="hm-label"><span class="hm-hanja">本命臺詞</span> · 그의 대표 대사</figcaption><blockquote class="hm-line">“${esc(me.line)}”</blockquote></figure>`:""}
          ${illustCredit(ideal,[side])}
        </div>
      </div>
      <div class="panel ideal-role">
        <p class="ideal-role-line">이번 이야기에서 당신은 <b class="side-${s.role.side==="공"?"gong":"su"}">${esc(s.role.name)}</b>${josaIeyo(s.role.name)}.</p>
        ${roleNote&&roleNote.note?`<p class="ideal-role-sub">${esc(roleNote.note)}</p>`:""}
        <a class="btn btn-gold" href="#/ideal/${esc(key)}/story">이 상대와 이야기하기 →</a>
      </div>
    </div>`}function idealStoryHtml({key,s}){const sk=x=>x==="공"?"gong":"su";const beat=b=>{if(b.act)return`<p class="story-act">${esc(b.act)}</p>`;const mine=b.me!=null;const who=mine?`나 <small>${esc(s.role.name)}</small>`:esc(s.ideal.name);return`<p class="story-line${mine?" is-me":""}"><span class="who side-${sk(mine?s.role.side:s.ideal.side)}">${who}</span><span class="say">“${esc(mine?b.me:b.partner)}”</span></p>`};return`<div class="container ideal-page">
      <a class="ideal-back" href="#/ideal/${esc(key)}">← ${esc(s.ideal.name)} 소개로</a>
      <div class="story ideal-story" id="ideal-story">
        <div class="story-head">
          <p class="story-kicker">이상형과 이야기하기</p>
          <h1 class="story-title">${esc(storyConversationTitle(s.ideal.name))}</h1>
          <p class="story-cast"><span class="side-${sk(s.ideal.side)}">${esc(s.ideal.name)}</span><span class="x">×</span><span class="side-${sk(s.role.side)}">나 · ${esc(s.role.name)}</span></p>
          <h2 class="story-scenario-title">${esc(s.title)}</h2>
        </div>
        <div class="story-setting">${s.setting.map(t=>`<p>${esc(t)}</p>`).join("")}</div>
        <div class="story-beats">${s.opening.map(beat).join("")}</div>
        <div class="story-pick" role="group" aria-labelledby="ideal-q">
          <p class="story-q" id="ideal-q">당신의 선택은?</p>
          ${s.choices.map(c=>`<button type="button" class="story-choice" data-letter="${esc(c.letter)}"><span class="story-no">${esc(c.letter)}</span><span class="story-ct"><span class="story-label">${esc(c.label)}</span>${c.say?`<span class="story-say">“${esc(c.say)}”</span>`:""}</span></button>`).join("")}
        </div>
        <div class="story-out" aria-live="polite">
          ${s.choices.map(c=>`<div class="story-res" data-for="${esc(c.letter)}" tabindex="-1" hidden>
            <p class="story-mine"><span class="story-no">${esc(c.letter)}</span><span>${esc(c.label)}</span></p>
            <div class="story-beats">${c.say?beat({me:c.say}):""}${c.beats.map(beat).join("")}</div>
            <p class="story-end"><span class="story-end-tag">결말</span>${esc(c.ending)}</p>
          </div>`).join("")}
          <div class="ideal-after" hidden>
            <button type="button" class="btn btn-gold story-retry">다른 선택 해보기</button>
            <a class="btn btn-ghost" href="#/ideal">다른 이상형 만나기</a>
          </div>
        </div>
      </div>
    </div>`}function bindIdealStory(root,{s}){const box=$("#ideal-story",root);if(!box)return;const pick=$(".story-pick",box),after=$(".ideal-after",box);const res=[...box.querySelectorAll(".story-res")];let attempt=0;box.querySelectorAll(".story-choice").forEach(b=>b.addEventListener("click",()=>{if(box.dataset.chosen)return;const letter=b.dataset.letter;const el=res.find(x=>x.dataset.for===letter);if(!el)return;box.dataset.chosen=letter;attempt+=1;pick.hidden=true;el.hidden=false;after.hidden=false;ga("idealChoice",{ideal_type:s.ideal.name,role_type:s.role.name,choice:letter,attempt},el.querySelector(".story-end"));el.focus({preventScroll:true});el.scrollIntoView({behavior:reduceMotion?"auto":"smooth",block:"start"})}));$(".story-retry",box).addEventListener("click",()=>{delete box.dataset.chosen;res.forEach(el=>{el.hidden=true});after.hidden=true;pick.hidden=false;pick.scrollIntoView({behavior:reduceMotion?"auto":"smooth",block:"start"});const first=pick.querySelector(".story-choice");if(first)first.focus({preventScroll:true})})}function renderAbout(){const P=L.POSITION;const ILL={total:Object.keys(SLOTS).length,ready:Object.values(SLOTS).filter(x=>x.ready).length};const persByEl=EL_ORDER.map(el=>`<tr><td class="el-${el} serif">${EL_HANJA[el]} ${el}</td><td>${DATA.personality.filter(a=>a.element===el).map(a=>esc(a.name)).join(", ")}</td></tr>`).join("");const auxRows=DATA.aux.map(a=>`<tr><td class="serif">${esc(a.branch)}</td><td>${esc(a.name)}</td></tr>`).join("");$("#view-about").innerHTML=`<div class="container">
      <div class="eyebrow">解釋原理</div>
      <h1 class="section-title">풀이 원리</h1>
      <p class="section-lead">공수명리학은 오락용 풀이입니다. 간지를 세는 셈법(${BADGE.calc})은 만세력 규칙을 따르되 입춘·절입일은 고정 날짜로 근사하고 시주는 계산하지 않으며, 그 값을 공수와 속성으로 옮기는 규칙(${BADGE.made})은 모두 이 서비스가 지어낸 것입니다. 같은 생년월일은 언제나 같은 풀이가 나오도록, 난수 대신 날짜로 만든 고정된 수만 사용합니다.</p>
      <div class="pillars3">
        <div class="panel pillar-card"><div class="num">壹</div><h3>명식을 세우다 <small>命式</small></h3>
          <p>생년월일로 연·월·일의 간지(干支)를 셉니다. 셈법은 만세력 규칙을 따르되, 입춘·절입일은 고정 날짜로 근사하고 출생 시각은 받지 않습니다.</p></div>
        <div class="panel pillar-card"><div class="num">貳</div><h3>공과 수를 가리다 <small>攻受</small></h3>
          <p>일간의 음양과 태어난 계절의 기운을 저울에 올려, 앞서는 쪽을 공·수·리버스로 가립니다.</p></div>
        <div class="panel pillar-card"><div class="num">參</div><h3>속성을 짝짓다 <small>屬性</small></h3>
          <p>오행과 지지를 리디·봄툰·레진코믹스·미스터블루의 실제 공수 키워드에 짝지어 당신의 유형을 그립니다.</p></div>
      </div>
      <p class="honesty">간지 셈은 만세력 규칙을 근사해 따르지만, 그것을 공수로 옮기는 해석과 본명 대사는 모두 공수명리학의 창작입니다. 전통 사주 감정이 아닌 오락용 풀이로 즐겨 주세요.</p>
      <div class="panel doc" style="margin-top:28px">
        <h3>壹. 명식 세우기 ${BADGE.calc}</h3>
        <ul>
          <li><strong>일주</strong>: 율리우스일(JDN)로 계산합니다 — <code>(JDN + 49) mod 60</code>, 0이 갑자. 2000-01-01 무오일, 2024-01-01 갑자일로 검증했습니다. 입력한 양력 날짜 기준이며, 자시(밤 11시~자정) 경계와 표준시 차이는 반영하지 않습니다.</li>
          <li><strong>연주(띠)</strong>: 입춘을 2월 4일로 고정해 근사합니다.</li>
          <li><strong>월주</strong>: 각 달의 절입일을 고정값으로 근사하고, 월간은 연간에 따라 정합니다.</li>
          <li>출생 시각을 받지 않으므로 시주는 비워 둡니다.</li>
        </ul>
        <h3>貳. 공과 수를 가리기 ${BADGE.made}</h3>
        <p>점수 = 일간 음양(양 +${P.yinYang} / 음 −${P.yinYang}) + 월지와 일간의 관계 보정 + 생년월일 해시 흔들림(±${P.jitter})</p>
        <div class="table-wrap"><table><tr><th>월지와 일간의 관계</th><th>보정</th></tr>
          <tr><td>같은 오행(비견)</td><td>+0.6</td></tr><tr><td>월지가 일간을 생함(인성)</td><td>+0.4</td></tr>
          <tr><td>일간이 월지를 생함(식상)</td><td>−0.3</td></tr><tr><td>일간이 월지를 극함(재성)</td><td>−0.2</td></tr>
          <tr><td>월지가 일간을 극함(관성)</td><td>−0.5</td></tr></table></div>
        <p>점수가 +${P.threshold} 이상이면 공, −${P.threshold} 이하면 수, 그 사이는 리버스입니다. 1940~2010년 출생 25,933일을 넣어 보면 공 40% · 수 40% · 리버스 20%로 나뉩니다.</p>
        <h3>參. 성격속성 — 오행 짝짓기 ${BADGE.made}</h3>
        <div class="table-wrap"><table><tr><th>오행</th><th>성격속성</th></tr>${persByEl}</table></div>
        <p>일간과 같은 오행 4, 월지와 같은 오행 2, 일간이 생하는 오행 1.5, 나머지 1의 가중치로 추첨합니다. 플랫폼에 없는 공/수 조합(예: 외유내강공)은 가중치를 0.35배로 낮춥니다.</p>
        <h3>肆. 보조속성 — 지지 짝짓기 ${BADGE.made}</h3>
        <p>첫째는 일지, 둘째는 띠(연지)에 깃든 속성입니다. 둘이 같으면 월지를, 그마저 같으면 일지와 충(沖)하는 지지를 씁니다.</p>
        <div class="table-wrap"><table><tr><th>지지</th><th>보조속성</th></tr>${auxRows}</table></div>
        <h3>伍. 창작 보너스 ${BADGE.made}</h3>
        <p>도화·홍염·역마·화개·귀인 다섯 가운데 하나를 생년월일 해시로 고릅니다. 신살에서 이름만 빌렸으며 실제 신살 판정이 아닙니다.</p>
        <h3>陸. 화면의 % 수치 ${BADGE.made}</h3>
        <p><strong>대표 유형 적합도</strong>는 자체 규칙으로 계산한, 결과 캐릭터 유형과의 일치 정도입니다. <strong>공수 비율</strong>(수 성향 / 공 성향)은 공수 점수를 0~100으로 옮긴 상대적인 분포로, 적합도와는 다른 지표입니다. 둘 다 통계적 확률이 아닙니다. 공·수 TOP 5는 공 자리와 수 자리 각각에서 열여섯 성격속성의 친화도를 따로 계산한 값으로, 판정된 자리에서는 당신의 유형이 언제나 1위입니다. 이 수치들은 결과를 보여 주기 위한 값일 뿐, 어떤 속성이 뽑히는지에는 영향을 주지 않습니다.</p>
        <h3>柒. 캐릭터 일러스트와 태그 표시</h3>
        <p>카드마다 각 속성을 표정·의상·포즈로 표현한 BL 웹툰풍 캐릭터 일러스트가 들어갑니다. 성격속성은 공·수 두 장씩, 보조속성·창작 보너스·메인 포지션은 한 장씩 모두 ${ILL.total}장입니다.</p>
        <p>일러스트와 대사·상황극의 등장인물은 모두 성인으로 설정된 창작 캐릭터입니다. 대사와 '운명의 한 장면'은 특정 작품을 인용하지 않은 오리지널 문구이며, 플러팅·질투·밀당 수준의 비노골적인 로맨스로만 씁니다. 캐릭터의 집착이나 질투는 허구 속 긴장감일 뿐, 실제 연애에서 권하는 행동이 아닙니다. 입력한 생년월일은 유형 계산에만 쓰며, 이용자의 나이로 간주하지 않습니다.</p>
        <p>공수명리학은 레진코믹스·리디·미스터블루·봄툰과 제휴하거나 후원받지 않는 개인 제작 서비스입니다. 캐릭터 일러스트는 Maylily Moon이 ChatGPT(OpenAI)의 이미지 생성 기능을 활용해 만든 AI 생성 일러스트이며, 그림마다 AI 생성 여부를 함께 표시합니다.</p>
        <ul>
          <li><span class="chip platform">#실제 태그</span> 리디·봄툰·레진코믹스·미스터블루 중 한 곳 이상에서 그대로 확인한 키워드</li>
          <li><span class="chip combo">#조합 창작</span> 어근은 실제 태그지만 그 공/수 조합은 어느 플랫폼에서도 확인되지 않음</li>
          <li><span class="chip created">#창작</span> 공수명리학 전용 태그. 데이터를 만들 때 실제 플랫폼에 같은 태그가 없는지 대조합니다.</li>
        </ul>
        <h3>捌. 자료 출처 (${esc(DATA.collectedAt)} 기준 확인)</h3>
        <ul>${DATA.sources.map(s=>`<li>${esc(s.platform)} — <a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.method)}</a></li>`).join("")}</ul>
      </div>
    </div>`}function renderType(slug){const m=/^([a-z]+)-(gong|su|reverse)$/.exec(slug);const pers=m&&DATA.personality.find(a=>a.id===m[1]);if(!pers){$("#view-type").innerHTML=`<div class="container"><div class="panel type-cta" style="text-align:center"><p>찾을 수 없는 유형 링크예요.</p><a class="btn btn-gold" href="#/">내 공수 팔자 까보기 →</a></div></div>`;return null}const posId=m[2],sides=SIDES_OF[posId];const r=L.compose(DATA,{positionId:posId,personalityId:pers.id,auxIds:[]});const matchAttr=DATA.personality.find(a=>a.id===pers.reading.match.id);const matchSides=posId==="gong"?["수"]:posId==="su"?["공"]:["공","수"];const sk=s=>s==="공"?"gong":"su";const matchLine=window.BLLines&&window.BLLines.of(DATA,matchAttr,matchSides[0]);const label=pers.name+sides.join("·");$("#view-type").innerHTML=`<div class="container result-page type-page">
      <section class="r-sec">
        ${secHead("✦","친구의 BL 캐릭터","공유받은 공수 팔자")}
        <div class="result-hero${posId==="reverse"?" is-reverse":""}">
          ${heroCard(pers,posId)}
          <div class="result-hero-text">
            <div class="result-meta">친구가 받은 유형</div>
            <h1 class="result-title">${titleHtml([],pers.name,sides)}</h1>
            <p class="type-sum">${esc(pers.summary)}</p>
            ${honmyeongLine(r,"이 유형의 본명 대사")}
            <p class="type-match">운명의 상대 <b>${matchSides.map(s=>esc(matchAttr.name)+`<span class="side-${sk(s)}">${s}</span>`).join(`<span class="swap">⇄</span>`)}</b>${matchLine&&matchLine.line?` — “${esc(matchLine.line)}”`:""}</p>
          </div>
        </div>
        <div class="panel type-cta">
          <p>같은 ${esc(label)}라도 세부 속성, 적합도, 운명의 한 장면은 생년월일마다 달라요. 네 사주에는 어떤 남자가 들어앉았을까?</p>
          <div class="actions">
            <a class="btn btn-gold" href="#/">나도 내 공수 팔자 까보기 →</a>
            <a class="btn btn-ghost" href="#/codex/${esc(pers.id)}">${esc(pers.name)} 속성 도감</a>
          </div>
        </div>
        <p class="result-foot">공유된 링크에는 생년월일이 들어 있지 않아요. 사주 계산을 활용한 창작 BL 캐릭터 테스트이며, 등장인물은 모두 성인입니다.</p>
      </section>
    </div>`;return pers.id+"-"+posId}function renderNoResult(){$("#view-result").innerHTML=`<div class="container" style="padding-top:40px;padding-bottom:40px"><div class="panel type-cta" style="text-align:center">
      <p>이 화면에 보여 줄 결과가 없어요. 결과는 생년월일을 넣은 그 브라우저 탭에서만 다시 볼 수 있어요.</p>
      <a class="btn btn-gold" href="#/">내 공수 팔자 까보기 →</a></div></div>`}function renderPrivacy(){$("#view-privacy").innerHTML=`<div class="container privacy-page">${window.PrivacyPage?window.PrivacyPage.html():"<p>개인정보 처리방침을 불러오지 못했어요.</p>"}</div>`;const b=$("#view-privacy .pv-settings");if(b){if(window.GSAnalytics&&window.GSAnalytics._state.enabled)b.addEventListener("click",()=>ga("openSettings"));else b.closest("p").hidden=true}}function renderFooter(){$("#site-footer").innerHTML=`<div class="container">
      <strong>공수명리학 · 攻受命理學</strong>
      <div>모든 풀이는 오락용 창작이며 실제 사주 감정이 아닙니다. 공수 키워드는 리디·봄툰·레진코믹스·미스터블루에서 공개적으로 쓰이는 BL 장르·속성 용어를 참고했고, ${esc(DATA.collectedAt)} 기준으로 플랫폼별 사용 여부를 확인했습니다.</div>
      <div>캐릭터 일러스트는 Maylily Moon이 ChatGPT(OpenAI)를 활용해 만든 AI 생성 일러스트입니다.</div>
      <div class="footer-note">공수명리학은 레진코믹스·리디·미스터블루·봄툰과 제휴하거나 후원받지 않는 개인 제작 서비스입니다.</div>
      <div class="footer-links"><a href="#/privacy">개인정보 처리방침</a></div>
    </div>`}const rendered={};function route(){const h=location.hash.replace(/^#/,"");if(DATE_RE.test(h)){location.replace("#/result/"+h);return}const[,view="",arg,sub]=h.split("/");if(view==="result"&&DATE_RE.test(arg||"")){myResult.set(arg);location.replace("#/my");return}const name={"":"home",result:"result",my:"result",t:"type",codex:"codex",builder:"builder",about:"about",privacy:"privacy",ideal:"ideal"}[view]||"home";let scrolled=false,gaView=name,gaArg,gaKey;if(view==="my"){const mine=myResult.get();if(mine){renderResult(mine);gaKey="#/my|"+mine}else{renderNoResult();gaView="result-empty"}}else if(name==="result")renderResult(arg||"");else if(name==="type"){gaArg=renderType(arg||"");if(!gaArg)gaView="type-unknown"}else if(name==="codex"){renderCodex(arg);scrolled=!!arg;rendered.codex=true;gaArg=arg}else if(name==="ideal")gaArg=renderIdeal(arg||"",sub);else if(!rendered[name]){({home:renderHome,builder:renderBuilder,about:renderAbout,privacy:renderPrivacy})[name]();rendered[name]=true}document.querySelectorAll(".view").forEach(v=>v.classList.toggle("active",v.id==="view-"+name));const navName=name==="result"?"home":name;document.querySelectorAll("[data-nav]").forEach(a=>{if(a.dataset.nav===navName)a.setAttribute("aria-current","page");else a.removeAttribute("aria-current")});document.title={result:"풀이 결과 · 공수명리학",type:"유형 소개 · 공수명리학",privacy:"개인정보 처리방침 · 공수명리학",ideal:"이상형 만나기 · 공수명리학"}[name]||"공수명리학";ga("page",gaView,gaArg,gaKey);if(!scrolled)window.scrollTo({top:0,behavior:"instant"});else setTimeout(()=>{const el=document.querySelector(".attr-card.focus");if(el)el.scrollIntoView({block:"center",behavior:"instant"})},0)}if("scrollRestoration"in history)history.scrollRestoration="manual";renderFooter();window.addEventListener("hashchange",route);route()})();
