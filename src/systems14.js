/* ===== systems14: the Season 1–10 unlock ladder and All-Stars ===== */
const SN=()=>CAR.ladderSim||CAR.season;
const UNL={studio:2,edit:2,stir:2,crew:3,requests:3,props:3,audience:3,desk:4,casting:4,phone:4,twists:4,aspick:4,duel:5,audtools:6,legend:7,fanevent:7,theme:8,golden:8,call:9};
const GAMEUNL={mrmrs:1,mugoff:1,mostlikely:1,cocktail:1,olympics:1,letters:1,eggs:2,dance:2,trust:3,ddp:3,liedetector:4,auction:4,karaoke:6,speed:6};
const has=f=>SN()>=(UNL[f]||1);
const LADDER=[
 {s:1,t:'The pilot',items:[['The villa','Watch the cast, step into scenes, make producer moves'],['Dates','Send any two islanders out'],['Interview room','Sit anyone down and ask the questions'],['Tonight’s episode','Everything you filmed airs at 8pm'],['6 challenges','A villa game every other day'],['Recouplings and bombshells','They happen on their own, like the real show'],['Storylines','Written stories that play out over a few days'],['Co-producing','Your partner, the trailer and the daily brief']]},
 {s:2,t:'Picked up for Season 2',items:[['The Studio','Your company: build HQ and upgrade the villa on real-time timers'],['Edit Bay','Cut your own episode and get it graded'],['Stir questions','Plant true or made-up gossip in interviews'],['2 new challenges','Egg Babies and Dance with a Stranger']]},
 {s:3,t:'A growing audience',items:[['Crew','Hire directors, editors, hosts and more'],['Islanders ask for you','Cast members request interviews'],['Props cupboard','Texts, dates, wardrobe and arrivals to deploy'],['Audience groups','Four kinds of fans, each with requests'],['2 new challenges','Blindfold Trust Course and Date, Dump, Pie']]},
 {s:4,t:'The network notices',items:[['Production desks','Send crews on scouting trips, promos and highlight packages'],['Casting Van','Scout new faces. Sign them for next season’s cast'],['Villa phone','Text the islanders'],['Twist deck','Pull one twist a day'],['Pick your All-Stars','Choose who returns in Season 5'],['2 new challenges','Lie Detector and Love Auction']]},
 {s:5,t:'All-Stars',star:true,items:[['Returning favorites','The best islanders from Seasons 1–4 come back'],['Prediction duel','Call the recouplings against your partner']]},
 {s:6,t:'Prime time',items:[['Audience tools','Test screenings, teasers and sponsor slots'],['The last 2 challenges','Karaoke Night and Speed Dating. All 14 unlocked']]},
 {s:7,t:'Big-name talent',items:[['Legend crew','Legend-tier hires appear on the board'],['Fan events','An 8-hour production that thrills every audience group']]},
 {s:8,t:'Your show, your rules',items:[['Pick the theme','Choose next season’s theme in the office'],['Golden scouts','Off-season deals can send a golden candidate to your vault']]},
 {s:9,t:'Showrunner',items:[['Showrunner’s call','Once a season, call a surprise recoupling tonight'],['Pick your All-Stars','Choose who returns in Season 10']]},
 {s:10,t:'All-Stars II',star:true,items:[['The full network','Every system open'],['Legends return','The best of Seasons 1–9 come back for the big one']]}];
const ladderFor=s=>LADDER.find(l=>l.s===s);

/* ---------- gates ---------- */
const PLACEGATE={pEdit:'edit',pStudio:'studio',pProps:'props',pCast:'casting'};
const GNAME={pEdit:'The Edit Bay',pStudio:'The Studio',pProps:'The Props Department',pCast:'The Casting Van'};
function ladderNav(){document.querySelectorAll('.pl').forEach(b=>{const g=PLACEGATE[b.dataset.place];if(g)b.style.display=has(g)?'':'none'});const sc=document.getElementById('stchip');if(sc&&!has('studio'))sc.remove()}
const _gp14=goPlace;goPlace=function(id){const g=PLACEGATE[id];if(g&&!has(g)){toast(`${GNAME[id]} opens in Season ${UNL[g]}.`);return}_gp14(id)};
const _sc14=studioChip;studioChip=function(){if(!has('studio')){const e=document.getElementById('stchip');if(e)e.remove();return}_sc14()};
IVQ.forEach(q=>{if(['stir','stirT','stirL'].includes(q.k)){const f=q.q;q.q=c=>has('stir')?(typeof f==='function'?f(c):f):null}});
const _mr14=maybeRequest;maybeRequest=function(){if(!has('requests'))return;_mr14()};
const _rs14=renderStudio;renderStudio=function(){if(!has('crew')&&stTab==='crew')stTab='board';_rs14();const el=document.getElementById('pStudio');if(!el||!el.classList.contains('on'))return;
 if(!has('crew')){const b=el.querySelector('[data-st="crew"]');if(b){b.disabled=true;b.textContent='Crew · S3'}}
 if(stTab==='board'&&!has('desk')){let skip=false;[...el.children].forEach(n=>{if(n.classList.contains('lab')&&/Production desks/.test(n.textContent))skip=true;if(skip&&n.matches('p.fine')){skip=false;n.insertAdjacentHTML('beforebegin',`<div class="ladlock">🔒 Production desks open in Season ${UNL.desk}: scouting trips, promos and highlight packages.</div>`)}if(skip)n.remove()})}
 if(!has('fanevent')){const t=el.querySelector('[data-task="fanevent"]');if(t){t.disabled=true;t.textContent=`S${UNL.fanevent}`}}};
const _mc14=makeCrew;makeCrew=function(){const c=_mc14();if(!has('legend')&&c.rar==='Legend'){const R=RAR[2];Object.assign(c,{rar:R[0],stars:R[1],cost:R[2],salary:R[3]})}return c};
const _re14=renderEdit;renderEdit=function(){_re14();const a=document.getElementById('auddesk');if(!a)return;if(!has('audience')){a.remove();return}
 if(!has('audtools')){const t=a.querySelector('.atools');if(t){const l=t.previousElementSibling;if(l&&l.classList.contains('lab'))l.remove();t.outerHTML=`<div class="ladlock">🔒 Audience tools open in Season ${UNL.audtools}.</div>`}}};
const _ss14=showStatus;showStatus=function(){_ss14();if(has('twists'))return;const labs=[...sheet.querySelectorAll('.lab')].filter(l=>/Pull a twist/.test(l.textContent));labs.forEach(l=>{let n=l.nextElementSibling;while(n&&!n.classList.contains('lab')){const x=n.nextElementSibling;n.remove();n=x}l.outerHTML=`<div class="ladlock">🔒 The twist deck opens in Season ${UNL.twists}.</div>`})};
const _oc14=openCareer;openCareer=function(){const r=_oc14.apply(this,arguments);if(!has('theme')){document.querySelectorAll('#career [data-th]').forEach(b=>{const o=b.parentElement;if(o){const l=o.previousElementSibling;if(l&&/theme/i.test(l.textContent))l.remove();o.remove()}})}return r};
const _md14=makeDeals;makeDeals=function(){_md14();if(!has('golden')&&CAR.deals)CAR.deals.scout=false};
const _tg14=todayGame;todayGame=function(){const g=_tg14();if(!g||!GAMES[g.id]||(GAMEUNL[g.id]||1)<=SN())return g;
 const ok=Object.keys(GAMES).filter(k=>(GAMEUNL[k]||1)<=SN()&&(GAMES[k].minDay||0)<=VS.day),fresh=ok.filter(k=>!(ST.gamesPlayed||[]).includes(k));g.id=pick(fresh.length?fresh:ok);return g};
document.head.insertAdjacentHTML('beforeend',`<style>body:not(.l-duel) .duel{display:none!important}.ladlock{margin:8px 0;padding:10px 12px;border-radius:12px;background:rgba(36,26,46,.06);border:1px dashed #CDB28A;font:600 12.5px Manrope,sans-serif;color:#5C5463}.arena .ladlock,.dark .ladlock{color:#CDB9C8;border-color:#5C4A66}
.lad{position:absolute;inset:0;z-index:8;background:linear-gradient(180deg,#241A2E,#3A2650);color:#FFF1E6;display:none;flex-direction:column;padding:22px 20px;overflow:auto}.lad.on{display:flex}.lad .k{font:800 11px Manrope,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#F6C35B}.lad h2{font:800 30px Fraunces,Georgia,serif;margin:6px 0 4px;color:#FFF1E6}.lad .sub{color:#CDB9C8;font-size:13px;margin-bottom:14px}
.lad .it{display:flex;gap:10px;align-items:flex-start;padding:10px 0;border-top:1px solid rgba(255,255,255,.08)}.lad .it i{flex:none;width:26px;height:26px;border-radius:50%;background:#F6C35B;color:#241A2E;display:grid;place-items:center;font:800 13px Manrope;font-style:normal}.lad .it b{display:block;font:700 14px Manrope}.lad .it span{font-size:12.5px;color:#CDB9C8}
.lad .nxt{margin-top:14px;padding:12px;border-radius:14px;background:rgba(255,255,255,.06);font-size:12.5px;color:#CDB9C8}.lad .nxt b{color:#FFF1E6}.lad button.go{margin-top:auto;min-height:48px;border-radius:14px;border:0;background:#F6C35B;color:#241A2E;font:800 15px Manrope;cursor:pointer;margin-top:18px}
.lad .faces{display:flex;gap:2px;overflow-x:auto;margin:4px -6px 8px;padding-bottom:4px}.lad .face{flex:none;width:74px;text-align:center;font:700 11px Manrope}.lad .face small{display:block;color:#F6C35B;font-weight:600}
.lad.star{background:radial-gradient(circle at 50% 0,#6B4A1E,#241A2E 60%)}.lad.star h2{background:linear-gradient(90deg,#FFE7B0,#F6C35B,#FFE7B0);-webkit-background-clip:text;color:transparent}
.road .rs{padding:10px 12px;border-radius:12px;margin:6px 0;border:1px solid #E8D5BE;background:#FFF8EC}.road .rs.cur{border-color:#F6C35B;box-shadow:0 0 0 2px #F6C35B inset}.road .rs.lock{opacity:.62}.road .rs b{font:800 13.5px Manrope}.road .rs .st{float:right;font:700 11px Manrope;color:#7A3418}.road .rs p{margin:4px 0 0;font-size:12px;color:#5C5463}.road .rs.allst{background:linear-gradient(90deg,#FFF3D6,#FFF8EC)}
.aspk{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px}.aspk button{border:1px solid #E8D5BE;background:#FFF8EC;border-radius:12px;padding:6px 4px;font:700 11.5px Manrope;cursor:pointer}.aspk button.on{background:#241A2E;color:#FFF1E6;border-color:#241A2E}.aspk small{display:block;font-weight:600;color:#7A3418}
.asb{display:inline-block;margin-left:6px;padding:2px 7px;border-radius:99px;background:linear-gradient(90deg,#F6C35B,#FFE7B0);color:#241A2E;font:800 10px Manrope;letter-spacing:.04em;vertical-align:middle}</style>`);
function ladderApply(){document.body.classList.toggle('l-duel',has('duel'));ladderNav()}
setInterval(ladderNav,2500);

/* ---------- "new this season" screen ---------- */
document.getElementById('screen').insertAdjacentHTML('beforeend','<div class="lad" id="lad"></div>');
function showLadder(s,force){const L=ladderFor(s);const el=document.getElementById('lad');if(!el)return;
 if(!L){if(force)showRoad();return}
 const nx=ladderFor(s+1),as=isAllStars(CAR.season)&&s===CAR.season;
 const faces=as?`<div class="faces">${CSLOTS.slice(0,10).map(id=>byId[id]).filter(c=>c&&c.allStar).map(c=>`<div class="face">${soloSvg(c,{expr:'grin'},84)}${c.name}<small>${c.won?'Winner · ':''}S${(c.prev||[]).join(', S')}</small></div>`).join('')}</div>`:'';
 el.className='lad on'+(L.star?' star':'');
 el.innerHTML=`<div class="k">Season ${s}${L.star?' · All-Stars':''}</div><h2>${L.t}</h2><div class="sub">${s===1?'Here’s what you start with. More opens every season, all the way to Season 10.':'New this season'}</div>${faces}
 ${L.items.map(([n,d])=>`<div class="it"><i>${s===1?'✓':'+'}</i><div><b>${n}</b><span>${d}</span></div></div>`).join('')}
 ${nx?`<div class="nxt">Coming in <b>Season ${nx.s}${nx.star?' (All-Stars)':''}</b>: ${nx.items.map(x=>x[0]).join(', ')}.</div>`:'<div class="nxt">Every system is now open. From here, seasons get bigger: higher HQ levels, rarer crew and new All-Stars every 5th season.</div>'}
 <button class="go" id="ladGo">${s===CAR.season?'Start the season':'Close'}</button>`;
 document.getElementById('ladGo').addEventListener('click',()=>{el.classList.remove('on');if(typeof SFX!=='undefined'&&AU.ctx)SFX.chime()})}
function ladderCheck(){if(CAR.onb&&CAR.onb.on){CAR.ladderSeen=Math.max(CAR.ladderSeen||0,1);return}const s=SN();if((CAR.ladderSeen||0)<s){CAR.ladderSeen=s;saveCar();setTimeout(()=>showLadder(s),1400)}}

/* ---------- roadmap ---------- */
function showRoad(){const s=SN();ST.sel=null;sheet.innerHTML=`${XB}<h3>Season roadmap</h3><div class="meta">You’re in Season ${CAR.season}${CAR.ladderSim?` · previewing Season ${CAR.ladderSim>10?'all':CAR.ladderSim}`:''}. A new season opens every 3 weeks.</div><div class="road">${LADDER.map(L=>`<div class="rs ${L.s===s?'cur':''} ${L.s>s?'lock':''} ${L.star?'allst':''}"><b>Season ${L.s} · ${L.t}${L.star?'<span class="asb">ALL-STARS</span>':''}</b><span class="st">${L.s<s?'✓ Open':L.s===s?'Now':'🔒'}</span><p>${L.items.map(x=>x[0]).join(' · ')}</p></div>`).join('')}<div class="rs lock"><b>Season 15, 20, 25 …</b><span class="st">♾</span><p>All-Stars every 5th season. HQ level 10 opens in Season 15.</p></div></div>`;sheet.classList.add('open')}

/* ---------- pick your All-Stars (the season before an All-Stars season) ---------- */
function asPicker(){const target=CAR.season+1,el=sheet;const al=CAR.alumni.filter(a=>a.from<=CAR.season).sort((a,b)=>b.score-a.score).slice(0,30);CAR.asPick=CAR.asPick||[];
 const draw=()=>{el.innerHTML=`${XB}<h3>Pick your All-Stars</h3><div class="meta">Season ${target} brings back 12 favorites. Pick up to 6. The fans fill the rest by who they watched most.</div>${al.length?`<div class="aspk">${al.map(a=>`<button data-asp="${a.key}" class="${CAR.asPick.includes(a.key)?'on':''}">${a.d.name}<small>${a.won?'Winner · ':''}S${a.seasons.join(',')}</small></button>`).join('')}</div>`:'<p class="fine">Your alumni list fills up at the end of each season.</p>'}<p class="fine">${CAR.asPick.length}/6 picked. You can change this until the season ends.</p>`;
  el.querySelectorAll('[data-asp]').forEach(b=>b.addEventListener('click',()=>{const k=b.dataset.asp,i=CAR.asPick.indexOf(k);if(i>=0)CAR.asPick.splice(i,1);else if(CAR.asPick.length<6)CAR.asPick.push(k);else toast('Six picks max. The fans choose the rest.');saveCar();draw()}))};
 draw();el.classList.add('open')}
const asPickOpen=()=>isAllStars(CAR.season+1)&&has('aspick');

/* ---------- Showrunner's call: one surprise recoupling a season ---------- */
function showrunnerCall(){if(ST.callUsed){toast('You’ve used this season’s call.');return}if(typeof isRcNight==='function'&&isRcNight()){toast('There’s already a recoupling tonight.');return}
 if(!confirm('Call a surprise recoupling tonight? You get one per season.'))return;ST.callUsed=true;ST.rcDay=null;ST.rcEarly=VS.day;if(typeof rcChip==='function')setTimeout(rcChip,100);addBuzz(.4);toast('Surprise recoupling tonight at golden hour. Nobody’s ready.');closeSheet()}

/* ---------- producer tools: roadmap, previews, picks ---------- */
document.getElementById('tsMenu').addEventListener('click',()=>{setTimeout(()=>{const t=sheet.querySelector('.tools9');if(!t)return;
 if(!has('phone')){const p=t.querySelector('[data-t9="phone"]');if(p)p.remove()}
 t.insertAdjacentHTML('afterbegin',`<button data-t14="road"><b>Season roadmap</b><span>What opens in Seasons 1–10${isAllStars(CAR.season)?' · All-Stars now':''}</span></button>`);
 if(asPickOpen())t.insertAdjacentHTML('beforeend',`<button data-t14="aspick"><b>Pick your All-Stars</b><span>Who returns in Season ${CAR.season+1}</span></button>`);
 if(has('call'))t.insertAdjacentHTML('beforeend',`<button data-t14="call" ${ST.callUsed?'disabled':''}><b>Showrunner’s call</b><span>${ST.callUsed?'Used this season':'A surprise recoupling tonight. Once per season'}</span></button>`);
 t.insertAdjacentHTML('beforeend',`<button data-t14="scenes" class="${CAR.scenesOff?'':'on'}"><b>Cutscenes ${CAR.scenesOff?'off':'on'}</b><span>Animated scenes for big moments</span></button>`);
 if(CAR.preview)t.insertAdjacentHTML('beforeend',`<div class="lab" style="grid-column:1/-1">Preview: test the game as season</div><div class="opts" style="grid-column:1/-1">${[1,2,3,4,5,6,7,8,9,10].map(n=>`<button data-sim="${n}" class="${SN()===n&&CAR.ladderSim?'on':''}">${n}</button>`).join('')}<button data-sim="99" class="${CAR.ladderSim===99?'on':''}">All</button><button data-sim="0" class="${!CAR.ladderSim?'on':''}">Real</button></div>`);
 t.querySelectorAll('[data-t14]').forEach(b=>b.addEventListener('click',()=>{const k=b.dataset.t14;if(k==='road')showRoad();if(k==='aspick')asPicker();if(k==='call')showrunnerCall();if(k==='scenes'){CAR.scenesOff=!CAR.scenesOff;saveCar();closeSheet();toast(CAR.scenesOff?'Cutscenes off.':'Cutscenes on.')}}));
 t.querySelectorAll('[data-sim]').forEach(b=>b.addEventListener('click',()=>{const n=+b.dataset.sim;CAR.ladderSim=n||0;CAR.ladderSeen=Math.min(CAR.ladderSeen||0,CAR.season);saveCar();closeSheet();ladderApply();if(n&&n<=10)showLadder(n);else toast(n?'Previewing with everything open.':'Back to your real season.')}))},0)});

/* ---------- All-Stars flavor ---------- */
const _os14=openSheet;openSheet=function(id){_os14(id);const c=byId[id];if(c&&c.allStar){const h=sheet.querySelector('h3');if(h&&!h.querySelector('.asb'))h.insertAdjacentHTML('beforeend',`<span class="asb">ALL-STAR</span>`);const m=sheet.querySelector('.meta');if(m)m.insertAdjacentHTML('beforeend',` · ${c.won?'Won':'Played'} Season ${(c.prev||[]).join(', ')}`)}};
const _ch14=chatter;chatter=function(k){if(isAllStars(CAR.season)&&VS.open===k&&!VS.busy&&Math.random()<.2){const p=here(k).filter(c=>c.allStar);if(p.length){const a=pick(p),o=pick(VILLA.map(v=>byId[v.id]).filter(x=>x.id!==a.id));const t=say(Math.random()<.5?'allstar_back':'allstar_history',a,{themId:o.id},true);if(t){addFeed(k,`<b>${a.name}:</b> “${t}”`);bubble2(a,t);return}}}_ch14(k)};

ladderApply();ladderCheck();

window.__test=Object.assign(window.__test||{},{obStep:()=>{const s=CAR.onb&&CAR.onb.on?OBSTEPS[CAR.onb.i]:null;return s?{i:CAR.onb.i,sel:s.sel||null,alt:s.alt||null,m:!!s.m,btn:!!s.btn,d:s.d,text:s.text}:null}});
window.__test=Object.assign(window.__test||{},{sn:SN,has,showLadder,cast:()=>CSLOTS.map(id=>byId[id].name),alumni:()=>CAR.alumni});
