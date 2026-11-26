
/* ---------- systems 10: daylight, ambient life, sound, guided first week, real-time playtest ---------- */
/* ---------- daylight: real blue skies in the morning and afternoon ---------- */
TINT.Morning=['rgba(255,252,240,.04)',0];TINT.Afternoon=['rgba(0,0,0,0)',0];
Object.assign(SKYTOP,{Morning:'#86C3EC',Afternoon:'#4DA3DE'});
const _fv10=fitVilla;fitVilla=function(){_fv10();vsvg.dataset.tod=TIMES[VS.t]};
function ambient(){const T=TIMES[VS.t],day=T==='Morning'||T==='Afternoon',t=Date.now()/1000;let s='';
 if(day){[[30,'40',46,90,.9],[200,'78',38,120,.75],[320,'26',30,70,.85]].forEach(([x,y,w,per,o],i)=>{s+=`<g class="cloud" style="animation-duration:${per}s;animation-delay:-${(t+i*31)%per}s"><g transform="translate(${x} ${y})" opacity="${o}"><ellipse rx="${w}" ry="${w*.32}" fill="#fff"/><ellipse cx="${-w*.4}" cy="4" rx="${w*.5}" ry="${w*.26}" fill="#fff"/><ellipse cx="${w*.45}" cy="3" rx="${w*.55}" ry="${w*.28}" fill="#fff"/></g></g>`});
  s+=`<g class="birds" style="animation-delay:-${t%24}s">${[[0,0],[16,6],[30,-2]].map(([x,y])=>`<path d="M${x-5} ${60+y} q5 -5 10 0 q5 -5 10 0" stroke="#3A4A5A" stroke-width="1.4" fill="none"/>`).join('')}</g>`;
  s+=`<g class="sparkle">${[[90,318],[150,338],[210,326],[110,370],[190,376]].map(([x,y],i)=>`<path d="M${x} ${y-4} L${x+1} ${y-1} L${x+4} ${y} L${x+1} ${y+1} L${x} ${y+4} L${x-1} ${y+1} L${x-4} ${y} L${x-1} ${y-1}Z" fill="#fff" style="animation-delay:${i*.6}s"/>`).join('')}</g>`}
 if(T==='Night')s+=`<g>${[[40,470],[90,520],[130,480],[350,450],[300,540],[60,420]].map(([x,y],i)=>`<circle class="firefly" cx="${x}" cy="${y}" r="2.2" fill="#FFF3A6" style="animation-delay:-${(t+i*1.7)%6}s"/>`).join('')}</g>`;
 if(T==='Golden hour'||T==='Night')s+=`<g class="embers">${[0,1,2,3].map(i=>`<circle cx="${256+i*6}" cy="470" r="1.6" fill="#FFB866" style="animation-delay:-${(t+i*.7)%2.8}s"/>`).join('')}</g>`;
 return s}
/* bigger, clearer people in the windows */
rooms=function(){const night=TIMES[VS.t]==='Night',gh=TIMES[VS.t]==='Golden hour';let s='<defs>';Object.keys(HR).forEach(k=>{if(LOC[k].out)return;const r=HR[k];s+=`<clipPath id="rc_${k}"><rect x="${r.x+3}" y="${r.y+3}" width="${r.w-6}" height="${r.h-6}" rx="10"/></clipPath>`});s+='</defs>';
 Object.keys(HR).forEach(k=>{if(LOC[k].out)return;const r=HR[k],p=here(k);if(!p.length)return;
  s+=`<rect x="${r.x+3}" y="${r.y+3}" width="${r.w-6}" height="${r.h-6}" rx="10" fill="${night?'#FFD58A':gh?'#FFE2B8':'#FFF6E8'}" opacity=".95" stroke="${night?'#FFE7B0':'#E8CDB5'}" stroke-width="1.5"/><rect x="${r.x+3}" y="${r.y+r.h-9}" width="${r.w-6}" height="6" fill="${night?'#E8B86A':'#E8D2B8'}"/>`;
  const sc=r.h>=60?.34:.22,n=Math.min(p.length,5),step=(r.w-12)/n;s+=`<g clip-path="url(#rc_${k})">${p.slice(0,5).map((c,i)=>place(c,r.x+6+step*(i+.5),r.y+r.h+(r.h>=60?18:12),sc,{still:true})).join('')}</g>`});return s};
const u10=window.__VX.under;window.__VX.under=function(){return ambient()+u10.call(this)};
/* ---------- fewer things at once: three markers, one best scene ---------- */
markers=function(){let list=Object.keys(LOC).map(k=>hotAt(k)).filter(h=>h&&HOTICON[h.type]).sort((a,b)=>HOTRANK[b.type]-HOTRANK[a.type]).slice(0,3);let s='';
 list.forEach((h,idx)=>{let x,y;const k=h.k;if(LOC[k].out){const ps=h.ids.map(i=>pos[i]).filter(p=>p&&!p.hidden);if(!ps.length)return;x=ps.reduce((a,p)=>a+p.x,0)/ps.length;y=Math.min(...ps.map(p=>p.y))-132}else{const r=HR[k];x=r.x+r.w-12;y=r.y+10}
  const [c,ic]=HOTICON[h.type],best=idx===0&&h.type!=='couple';s+=`<g class="hotm" data-hot="${k}" transform="translate(${x} ${y})" style="cursor:pointer"><circle r="18" fill="transparent"/>${best?`<g transform="translate(0 -22)"><rect x="-30" y="-9" width="60" height="16" rx="8" fill="#F6C35B"/><text y="3" text-anchor="middle" font-family="Manrope, sans-serif" font-weight="800" font-size="9" fill="#241A2E">BEST SCENE</text></g>`:''}<g class="hotpulse"><circle r="${best?13:11}" fill="${c}" stroke="${best?'#F6C35B':'#fff'}" stroke-width="${best?3:2}"/>${ic}</g></g>`});
 if(ST.sel&&pos[ST.sel]&&!pos[ST.sel].hidden){const v=pos[ST.sel],n=nm(ST.sel),w=n.length*7+18;s+=`<g transform="translate(${v.x} ${v.y+16})"><rect x="${-w/2}" y="-10" width="${w}" height="20" rx="10" fill="#241A2E"/><text y="4" text-anchor="middle" font-family="Manrope, sans-serif" font-weight="700" font-size="11" fill="#FFF1E6">${n}</text></g>`}return s};
/* ---------- sound and haptics ---------- */
const AU={ctx:null,master:null,amb:null,ep:null,next:0};if(CAR.sound===undefined)CAR.sound=true;
const buzz=p=>{try{navigator.vibrate&&navigator.vibrate(p)}catch(e){}};
function auInit(){if(AU.ctx||!CAR.sound)return;try{AU.ctx=new (window.AudioContext||window.webkitAudioContext)();AU.master=AU.ctx.createGain();AU.master.gain.value=.55;AU.master.connect(AU.ctx.destination);startAmb()}catch(e){AU.ctx=null}}
document.addEventListener('pointerdown',auInit,{once:false});
function tone(f,d,type='sine',g=.12,when=0,f2){if(!AU.ctx||!CAR.sound)return;const c=AU.ctx,t=c.currentTime+when,o=c.createOscillator(),gn=c.createGain();o.type=type;o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+d);gn.gain.setValueAtTime(0,t);gn.gain.linearRampToValueAtTime(g,t+.015);gn.gain.exponentialRampToValueAtTime(.0008,t+d);o.connect(gn);gn.connect(AU.master);o.start(t);o.stop(t+d+.05)}
function noise(d,f0,f1,g=.18,when=0){if(!AU.ctx||!CAR.sound)return;const c=AU.ctx,t=c.currentTime+when,b=c.createBuffer(1,c.sampleRate*d,c.sampleRate),a=b.getChannelData(0);for(let i=0;i<a.length;i++)a[i]=Math.random()*2-1;const s=c.createBufferSource();s.buffer=b;const bp=c.createBiquadFilter();bp.type='bandpass';bp.Q.value=4;bp.frequency.setValueAtTime(f0,t);bp.frequency.exponentialRampToValueAtTime(f1,t+d);const gn=c.createGain();gn.gain.setValueAtTime(g,t);gn.gain.exponentialRampToValueAtTime(.001,t+d);s.connect(bp);bp.connect(gn);gn.connect(AU.master);s.start(t)}
const SFX={pop:()=>tone(660,.12,'sine',.1,0,990),tap:()=>tone(1150,.05,'sine',.035),
 chime:()=>[523,659,784,1047].forEach((f,i)=>tone(f,.5,'triangle',.09,i*.09)),
 fanfare:()=>{[392,523,659,784].forEach((f,i)=>tone(f,.3,'square',.05,i*.11));tone(1047,.8,'triangle',.1,.46)},
 sting:()=>{[[196,0],[185,.32],[147,.64]].forEach(([f,w],i)=>tone(f,i===2?1.1:.28,'sawtooth',.07,w))},
 scratch:()=>{noise(.35,3200,260,.3);tone(300,.3,'sawtooth',.04,0,90)},
 whoosh:()=>noise(.45,400,2400,.12),
 coin:()=>{tone(988,.08,'square',.05);tone(1319,.25,'square',.05,.08)}};
function startAmb(){if(!AU.ctx||AU.amb)return;const c=AU.ctx,len=c.sampleRate*4,b=c.createBuffer(1,len,c.sampleRate),a=b.getChannelData(0);let last=0;for(let i=0;i<len;i++){last=(last+.02*(Math.random()*2-1))/1.02;a[i]=last*3.5}
 const s=c.createBufferSource();s.buffer=b;s.loop=true;const lp=c.createBiquadFilter();lp.type='lowpass';lp.frequency.value=520;const g=c.createGain();g.gain.value=.0;const lfo=c.createOscillator(),lg=c.createGain();lfo.frequency.value=.11;lg.gain.value=.05;lfo.connect(lg);lg.connect(g.gain);s.connect(lp);lp.connect(g);g.connect(AU.master);s.start();lfo.start();AU.amb={g,base:.09};ambLevel()}
function ambLevel(){if(!AU.amb)return;const v=document.querySelector('.pl.on'),onVilla=!v||v.dataset.place==='villa',ep=document.getElementById('ep').classList.contains('open');AU.amb.g.gain.setTargetAtTime(CAR.sound&&onVilla&&!ep?AU.amb.base:0,AU.ctx.currentTime,.4)}
setInterval(()=>{ambLevel();if(!AU.ctx||!CAR.sound||document.hidden)return;const v=document.querySelector('.pl.on');if(v&&v.dataset.place!=='villa')return;if(document.getElementById('ep').classList.contains('open'))return;
 const T=TIMES[VS.t];if((T==='Morning'||T==='Afternoon')&&Math.random()<.35){const f=2200+Math.random()*1400;tone(f,.09,'sine',.03,0,f*1.3);tone(f*1.1,.08,'sine',.025,.12,f*1.4)}if(T==='Night'&&Math.random()<.5)[0,.06,.12].forEach(w=>tone(4600,.035,'sine',.015,w))},2600);
/* episode music: a soft four-chord loop */
const CH4=[[220,262,330],[175,220,262],[262,330,392],[196,247,294]];
function epMusic(on){clearInterval(AU.ep);if(!on||!AU.ctx||!CAR.sound)return;let i=0;const play=()=>{CH4[i%4].forEach(f=>tone(f,2.2,'triangle',.028));tone(CH4[i%4][0]/2,2.2,'sine',.05);i++};play();AU.ep=setInterval(play,2200)}
const _oe=openEp;openEp=function(){_oe();SFX.whoosh();epMusic(true);ambLevel()};const _ce=closeEp;closeEp=function(){_ce();epMusic(false);ambLevel()};
new MutationObserver(()=>{if(esvg.classList.contains('freeze')){SFX.scratch();buzz([30,40,60])}}).observe(esvg,{attributes:true,attributeFilter:['class']});
new MutationObserver(()=>{if(document.getElementById('payoff').classList.contains('on')){SFX.chime();buzz(30)}}).observe(document.getElementById('payoff'),{attributes:true,attributeFilter:['class']});
const _lu10=levelUp;levelUp=function(l,r){_lu10(l,r);SFX.fanfare();buzz([20,30,20])};
new MutationObserver(ms=>{ms.forEach(m=>m.addedNodes.forEach(n=>{if(n.nodeType!==1)return;if(n.matches&&(n.matches('.shock')||n.querySelector('.shock'))){SFX.sting();buzz([40,40,90])}if(n.querySelector&&n.querySelector('.stamp')){SFX.scratch();buzz(40)}if(n.matches&&n.matches('.rc.win')){SFX.fanfare()}}))}).observe(document.querySelector('.phone'),{childList:true,subtree:true});
const _toast10=toast;toast=function(t){_toast10(t);if(/^Achievement|Milestone|Scout rank|Career rank|streak!/.test(t)){SFX.coin();buzz(20)}else if(/^\+\d+|reels/.test(t))SFX.coin()};
document.addEventListener('click',e=>{if(!AU.ctx)return;if(e.target.closest('[data-hot]'))SFX.pop();else if(e.target.closest('.pbtn,.lact,.btn,.pl,.ctabs button,.opts button'))SFX.tap()},true);
/* ---------- guided first week ---------- */
const firstLaunch=lsGet(CK)===null&&!lsGet(SK);
if(!CAR.onb)CAR.onb=firstLaunch?{on:true,i:0}:{on:false,done:true};
const OB=()=>CAR.onb&&CAR.onb.on;
const GATE={interview:2,edit:2,requests:2,events:2,partner:2,challenge:3,brief:3,props:3,twists:3,casting:4,trailer:4,career:4};
const locked=f=>OB()&&VS.day<GATE[f]?GATE[f]:0;
const lockMsg=(f,n)=>toast(`${n} opens on day ${GATE[f]} of your first week.`);
const PLG={pEdit:['edit','The Edit Bay'],pProps:['props','The Props Department'],pCast:['casting','The Casting Van'],pTrailer:['trailer','The Production Trailer']};
const _gp11=goPlace;goPlace=function(id){const g=PLG[id];if(g&&locked(g[0])){lockMsg(g[0],g[1]);return}_gp11(id);obNav();ambLevel()};
function obNav(){document.querySelectorAll('.pl').forEach(b=>{const g=PLG[b.dataset.place];b.classList.toggle('lockd',!!(g&&locked(g[0])))})}
const _oi10=openInterview;openInterview=function(id){if(locked('interview')){lockMsg('interview','The interview room');return}_oi10(id)};
const _mr=maybeRequest;maybeRequest=function(){if(locked('requests'))return;_mr()};
const _fe10=fireEvent;fireEvent=function(f){if(locked('events'))return;_fe10(f)};
const _pm10=partnerMove;partnerMove=function(){if(locked('partner'))return;_pm10()};
const _tg=todayGame;todayGame=function(){if(OB()){if(VS.day<3)return null;if(VS.day===3){if(!ST.todayGame||ST.todayGame.day!==3)ST.todayGame={day:3,id:'mrmrs',done:false};return ST.todayGame}}return _tg()};
const _ss10=showStatus;showStatus=function(){if(locked('brief')){lockMsg('brief','Show status and the daily brief');return}_ss10()};
document.addEventListener('click',e=>{if(e.target.closest('#lvlChip')&&locked('career')){e.stopPropagation();lockMsg('career','Your season track and career')}if(e.target.closest('[data-t9="phone"],[data-t9="career"]')&&locked('twists')){e.stopPropagation();lockMsg('twists','That tool')}},true);
/* the steps */
const OBS=[
 {d:1,m:1,title:'Welcome, producer',text:'You and your partner make a reality show starring this villa. Your steps pay for everything you do. This first week teaches you one new thing a day.',btn:'Let’s go'},
 {d:1,sel:'[data-hot]',alt:'#pchips button',text:'Pulsing icons mean something is happening right now. Tap one to jump into the scene.',until:()=>document.getElementById('locView').classList.contains('on')},
 {d:1,sel:'.lacts',text:'Every place has producer moves. They cost reels, and reels come from walking.',btn:'Got it'},
 {d:1,sel:'#lBack',text:'Head back to the villa.',until:()=>!document.getElementById('locView').classList.contains('on')},
 {d:1,sel:'#vsvg [data-id]',text:'Tap any islander to open their file: who they like, their mood, what they’ve done.',until:()=>sheet.classList.contains('open')&&!!sheet.querySelector('.chead')},
 {d:1,sel:'[data-act="date"]',text:'Set up a date. Tap here, tap who they go with, then pick a place.',until:()=>VS.log.some(l=>l.meta&&l.meta.kind==='date')},
 {d:1,sel:'#timeCtl',text:'In the real app the day moves with the clock. In this preview, tap the clock to skip to night.',until:()=>VS.t===3},
 {d:1,sel:'#watch',text:'Everything you filmed airs tonight. Watch your first episode.',until:()=>!!ST.aired[VS.day]},
 {d:1,m:1,title:'Day 1 wrapped',text:'Tomorrow the interview room and the edit bay open.',btn:'Next'},
 {d:1,sel:'#timeCtl',text:'Tap to start day 2.',until:()=>VS.day>=2},
 {d:2,enter:()=>{if(!VS.req){const id=VIDS().find(i=>statusOf(i).label!=='Secure')||pickV();VS.req={id,day:VS.day,t:VS.t};reqChip()}},sel:'#ivreq',text:'An islander asked to talk. Interviews show what they really think.',until:()=>document.getElementById('iroom')&&document.getElementById('iroom').classList.contains('on')},
 {d:2,sel:'.ivq',text:'Ask a question. An honest answer makes your read on them exact.',until:()=>VI.said.length>=3||!document.getElementById('iroom').classList.contains('on')},
 {d:2,sel:'#ivBack',text:'Good. Back to the villa.',until:()=>!document.getElementById('iroom').classList.contains('on')},
 {d:2,sel:'#timeCtl',text:'Skip ahead to tonight.',until:()=>VS.t===3},
 {d:2,sel:'.pl[data-place="pEdit"]',text:'Before it airs, open the Edit Bay.',until:()=>document.getElementById('pEdit').classList.contains('on')},
 {d:2,sel:'#strip',text:'These are today’s clips. Tap one to change its order, take and music. End on your strongest moment. The audience reacts to every choice.',btn:'Got it'},
 {d:2,sel:'#lockCut',text:'Lock the cut.',until:()=>!!ED.locked},
 {d:2,sel:'#watch',text:'Now watch it go out.',until:()=>!!ST.aired[VS.day]},
 {d:2,m:1,title:'Day 2 wrapped',text:'Tomorrow: your first challenge, the daily brief and the props cupboard.',btn:'Next'},
 {d:2,sel:'#timeCtl',text:'Tap to start day 3.',until:()=>VS.day>=3},
 {d:3,sel:'#tsBrief',text:'This ring is your daily brief: three goals from the network, 15 reels each.',btn:'Got it'},
 {d:3,sel:'#chchip',alt:'#timeCtl',text:'It’s challenge day. It starts in the afternoon. Make your call and watch it play out.',until:()=>(ST.gamesPlayed||[]).length>0},
 {d:3,sel:'.pl[data-place="pProps"]',text:'Props are bigger moves: secret texts, fancy dates, twists. Open the cupboard.',until:()=>document.getElementById('pProps').classList.contains('on')},
 {d:3,sel:'#items',text:'Tap any prop to see what it does. Buy now, use it whenever you like.',btn:'Got it'},
 {d:3,sel:'.pl[data-place="villa"]',text:'Back to the villa.',until:()=>document.querySelector('.pl.on')&&document.querySelector('.pl.on').dataset.place==='villa'},
 {d:3,sel:'#timeCtl',text:'Finish the day to unlock everything else.',until:()=>VS.day>=4},
 {d:4,m:1,title:'Everything is open',text:'Casting Van: scout new islanders on the road. Trailer: plan with your co-producer. Your level badge holds the season track, audience and career. Tutorial complete: +50 reels.',btn:'Start producing',done:()=>{ST.reels+=50;syncReels();renderQueue()}}];
let obEl=null,obRing=null,obCur=-1;
function obEnd(skip){CAR.onb={on:false,done:true};saveCar();if(obEl)obEl.remove();if(obRing)obRing.remove();obEl=obRing=null;obNav();if(skip)toast('Tutorial skipped. Everything is open.')}
function obShow(){const st=OBS[CAR.onb.i];if(!st){obEnd();return}if(obCur!==CAR.onb.i){obCur=CAR.onb.i;if(st.enter)st.enter()}
 const ph=document.querySelector('.phone').getBoundingClientRect();if(!obEl){obEl=document.createElement('div');obEl.className='coach';document.body.appendChild(obEl);obRing=document.createElement('div');obRing.className='coachring';document.body.appendChild(obRing)}
 let tgt=null;if(st.sel){tgt=[...document.querySelectorAll(st.sel)].find(e=>{const r=e.getBoundingClientRect();return r.width&&r.height&&getComputedStyle(e).visibility!=='hidden'});if(!tgt&&st.alt)tgt=[...document.querySelectorAll(st.alt)].find(e=>e.getBoundingClientRect().width)}
 const html=`${st.title?`<b>${st.title}</b>`:''}<p>${st.text}</p><div class="cbtns">${st.btn?`<button class="cgo">${st.btn}</button>`:''}<button class="cskip">Skip tutorial</button></div><small>Day ${st.d} of your first week</small>`;if(obEl.dataset.k!==String(CAR.onb.i)){obEl.innerHTML=html;obEl.dataset.k=CAR.onb.i;const g=obEl.querySelector('.cgo');if(g)g.onclick=()=>{if(st.done)st.done();CAR.onb.i++;saveCar();obShow()};obEl.querySelector('.cskip').onclick=()=>obEnd(true)}
 obEl.classList.toggle('modal',!!st.m);const w=Math.min(300,ph.width-32);obEl.style.width=w+'px';
 if(st.m||!tgt){obRing.style.display='none';obEl.style.left=(ph.left+ph.width/2-w/2)+'px';obEl.style.top=(st.m?ph.top+ph.height*.32:ph.top+70)+'px'}
 else{const r=tgt.getBoundingClientRect();obRing.style.display='block';Object.assign(obRing.style,{left:(r.left-6)+'px',top:(r.top-6)+'px',width:(r.width+12)+'px',height:(r.height+12)+'px'});const below=r.top<ph.top+ph.height*.55;obEl.style.left=Math.max(ph.left+12,Math.min(ph.right-12-w,r.left+r.width/2-w/2))+'px';obEl.style.top=(below?r.bottom+14:r.top-14-obEl.offsetHeight)+'px'}
 obEl.style.display=document.getElementById('ep').classList.contains('open')?'none':'block';if(obEl.style.display==='none')obRing.style.display='none'}
setInterval(()=>{if(!OB())return;const st=OBS[CAR.onb.i];if(st&&st.until&&st.until()){CAR.onb.i++;saveCar()}obShow()},350);
/* ---------- real-time mode for a real playtest ---------- */
const RT={auto:false};CAR.rt=CAR.rt||{on:false,key:null,me:0};
const rtKey=d=>{const x=new Date(d-6*3600e3);return x.getFullYear()+'-'+(x.getMonth()+1)+'-'+x.getDate()};
const rtPeriod=d=>{const h=new Date(d).getHours();return h>=6&&h<12?0:h>=12&&h<17?1:h>=17&&h<20?2:3};
window.addEventListener('click',e=>{if(CAR.rt.on&&!RT.auto&&e.target.closest('#timeCtl')){e.stopPropagation();e.preventDefault();toast('Real-time mode: the villa follows the clock. Turn it off in the menu to skip ahead.')}},true);
function rtStep(){RT.auto=true;document.getElementById('timeCtl').click();RT.auto=false;ST.steps.me=CAR.rt.me;renderSteps()}
function rtTick(){if(!CAR.rt.on||CAR.offseason||CH.on)return;const now=Date.now(),k=rtKey(now),p=rtPeriod(now);let guard=0;
 if(CAR.rt.key&&CAR.rt.key!==k){while(VS.t!==3&&guard++<4)rtStep();CAR.rt.me=0;ST.steps.me=0;rtStep();CAR.rt.key=k}
 if(!CAR.rt.key)CAR.rt.key=k;while(VS.t<p&&guard++<8)rtStep();saveCar()}
setInterval(rtTick,20000);
const _rt11=renderTime;renderTime=function(){_rt11();if(CAR.rt&&CAR.rt.on){const sm=document.querySelector('#timeCtl .tdots');if(sm)sm.insertAdjacentHTML('beforeend','<em class="live">live</em>')}};
function logSteps(){sheet.innerHTML=`${XB}<div class="evtag">Real-time playtest</div><h3>Log today’s steps</h3><p class="fine">The preview can’t read Apple Health or Google Fit, so enter today’s total from your phone. The real app does this on its own.</p><input id="stepIn" class="stepin" type="number" inputmode="numeric" min="0" max="80000" value="${CAR.rt.me||''}" placeholder="e.g. 6200"><button class="pbtn" id="stepSave">Save steps</button>`;sheet.classList.add('open');
 document.getElementById('stepSave').addEventListener('click',()=>{const v=Math.max(0,Math.min(80000,Math.round(+document.getElementById('stepIn').value||0)));CAR.rt.me=v;ST.steps.me=v;renderSteps();checkWalls();saveCar();closeSheet();toast(`Logged ${v.toLocaleString('en-US')} steps. Collect your reels from the reels counter.`)})}
/* tools menu: sound, real-time mode, log steps */
document.getElementById('tsMenu').addEventListener('click',()=>{setTimeout(()=>{const t=sheet.querySelector('.tools9');if(!t)return;t.insertAdjacentHTML('beforeend',`<button data-t10="sound" class="${CAR.sound?'on':''}"><b>Sound ${CAR.sound?'on':'off'}</b><span>Villa ambience, stings and episode music</span></button><button data-t10="rt" class="${CAR.rt.on?'on':''}"><b>Real-time mode ${CAR.rt.on?'on':'off'}</b><span>For a real playtest: the day follows your clock and you log real steps</span></button>${CAR.rt.on?'<button data-t10="steps"><b>Log today’s steps</b><span>Enter your step count from your phone</span></button>':''}${OB()?'<button data-t10="skip"><b>Skip the tutorial</b><span>Open every feature now</span></button>':''}`);
 t.querySelectorAll('[data-t10]').forEach(b=>b.addEventListener('click',()=>{const k=b.dataset.t10;if(k==='sound'){CAR.sound=!CAR.sound;saveCar();if(CAR.sound)auInit();ambLevel();closeSheet();toast(`Sound ${CAR.sound?'on':'off'}`)}
  if(k==='rt'){CAR.rt.on=!CAR.rt.on;CAR.rt.key=null;CAR.rt.me=ST.steps.me;saveCar();closeSheet();renderTime();if(CAR.rt.on){rtTick();toast('Real-time mode on. Morning 6am, afternoon noon, golden hour 5pm, night 8pm.')}else toast('Real-time mode off.')}
  if(k==='steps')logSteps();if(k==='skip'){closeSheet();obEnd(true)}}))},0)});
/* ---------- playtest log: what actually happens day to day ---------- */
CAR.journal=CAR.journal||{};const jk=()=>new Date().toISOString().slice(0,10);
(function(){const j=CAR.journal[jk()]=CAR.journal[jk()]||{opens:0,min:0,xp0:CAR.cxp,steps:0};j.opens++;saveCar()})();
setInterval(()=>{if(document.hidden)return;const j=CAR.journal[jk()]=CAR.journal[jk()]||{opens:1,min:0,xp0:CAR.cxp,steps:0};j.min++;j.steps=Math.max(j.steps,ST.steps.me);j.xp=CAR.cxp-(j.xp0||0)},60000);
const _oc10=openCareer;openCareer=function(t){_oc10(t);if(t!=='career')return;const days=Object.entries(CAR.journal).sort().slice(-7);const el=document.getElementById('career');el.insertAdjacentHTML('beforeend',`<div class="lab">Playtest log <span class="cnt">last 7 days</span></div>${days.length?`<div class="jlog"><p><b>Date</b><b>Opens</b><b>Minutes</b><b>Steps</b><b>XP</b></p>${days.map(([d,j])=>`<p><span>${d.slice(5)}</span><span>${j.opens}</span><span>${j.min}</span><span>${(j.steps||0).toLocaleString('en-US')}</span><span>${j.xp||0}</span></p>`).join('')}</div>`:'<p class="fine">Nothing logged yet.</p>'}<p class="fine">Use this after a real week to tune pacing: how often you open it, how long you stay, and how fast you level.</p>`)};
/* ---------- start the guided week for brand-new players ---------- */
if(firstLaunch&&OB()){freshSeason();setTimeout(()=>{const pb=document.getElementById('payoff');pb.classList.remove('on')},700)}
obNav();fitVilla();drawVilla();
