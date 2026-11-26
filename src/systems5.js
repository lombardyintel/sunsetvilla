
/* ---------- systems 5: no repeats across categories, islanders ask for the interview room, shared season ---------- */
/* ---------- islanders who ask to talk ---------- */
VS.req=null;
function reqChip(){let el=document.getElementById('ivreq');if(!VS.req){if(el)el.remove();return}if(!el){el=document.createElement('button');el.id='ivreq';el.className='ivreq';document.getElementById('villa').appendChild(el);el.addEventListener('click',()=>{if(VS.req)openRequest(VS.req.id)})}
 const c=byId[VS.req.id];el.innerHTML=`<span class="pulse"></span><b>${c.name}</b> asked to see you<small>Interview room · free</small>`}
function maybeRequest(){if(VS.req){toast(`${byId[VS.req.id].name} gave up waiting.`);VS.req=null;reqChip()}
 const pool=VIDS().filter(id=>{const s=statusOf(id).label;return s==='At risk'||s==='Leaning away'||(ST.mood[id]||70)<45});
 const r=Math.random();let id=null;if(pool.length&&r<.45)id=rnd(pool);else if(r<.12)id=pickV();if(!id)return;VS.req={id,day:VS.day,t:VS.t};reqChip()}
document.getElementById('timeCtl').addEventListener('click',()=>setTimeout(maybeRequest,3200));
function openRequest(id){VS.req=null;reqChip();closeSheet();VI.id=id;VI.left=2;VI.said=[];VI.star=true;VI.expr='soft';VI.pend=null;
 let el=document.getElementById('iroom');if(!el){el=document.createElement('div');el.id='iroom';el.className='iroom';document.getElementById('villa').appendChild(el)}el.classList.add('on');
 const c=byId[id],p=COUPLES[id],top=VIDS().filter(z=>z!==id).sort((a,b)=>AFF[id][b]-AFF[id][a])[0],o=topOther(id);
 const open=say('iv_request',c,{partnerId:p},true),sec=say('iv_secret',c,{themId:top!==p?top:o,partnerId:p,otherId:o},true);
 VI.said.push([id,open],[id,sec]);ST.known[id]=ST.known[id]||{};ST.known[id].iv=VS.day;addBuzz(.2);
 renderIV(sec,`${c.name} asked to come in. They volunteered that, and your read on them is now exact for two days. Two questions are on the house.`)}
/* ---------- shared season: both producers run the same villa ---------- */
const SYNC={on:false,db:null,me:null,other:null,seat:null,v:0,last:'',writing:false,again:false,applying:false,pname:'Partner',started:false,ro:false,initial:null,timer:null};
ST.picks={};ST.finPick={};ST.ships={};ST.stepsBy={};
function snapState(){const st={};['reels','rating','hype','instinct','duel','done','dumped','twists','beatDone','bombSeen','brief','mood','energy','known','aired','rcDay','rcSetup','picks','finPick','stepsBy','finale','queue'].forEach(k=>st[k]=ST[k]);
 st.ships=Object.assign({},ST.ships);if(SYNC.me)st.ships[SYNC.me]=ST.ship||null;
 return {aff:AFF,couples:COUPLES,rival:RIVAL,think:THINK,rels:RELS,villa:VILLA.map(v=>v.id),where:VS.where,t:VS.t,day:VS.day,log:VS.log.slice(-40),st,clips:CLIPS.filter(c=>c.ids),ed:{cliff:ED.cliff,treat:ED.treat,locked:ED.locked,rating:ED.rating||null},cast:CAST.filter(c=>String(c.id).startsWith('cand'))}}
function applyState(o){const fill=(d,s)=>{Object.keys(d).forEach(k=>{if(!(k in s))delete d[k]});Object.assign(d,s)};
 (o.cast||[]).forEach(c=>{if(byId[c.id])return;if(String(c.sp).startsWith('g_')&&!SP[c.sp])SP[c.sp]=Object.assign({},SP[c.sp.slice(2)],{fur:'#E9B44C',dark:'#8A5A12'});c.codes=[c.heart,c.temper,c.game,c.vibe].map(t=>CODE[t]);CAST.push(c);byId[c.id]=c});
 Object.keys(o.aff||{}).forEach(a=>{AFF[a]=Object.assign({},o.aff[a])});fill(COUPLES,o.couples||{});fill(RIVAL,o.rival||{});fill(THINK,o.think||{});RELS.splice(0,RELS.length,...(o.rels||[]));
 const keep={};VILLA.forEach(v=>keep[v.id]=v);VILLA.splice(0,VILLA.length,...(o.villa||[]).filter(id=>byId[id]).map(id=>keep[id]||{id,x:0,y:0}));
 VS.where=Object.assign({},o.where||{});VILLA.forEach(v=>{if(!LOC[VS.where[v.id]])VS.where[v.id]='pool'});VS.t=o.t||0;VS.day=o.day||VS.day;VS.log=o.log||[];
 const st=o.st||{};Object.keys(st).forEach(k=>{if(st[k]!==undefined)ST[k]=st[k]});ST.picks=ST.picks||{};ST.finPick=ST.finPick||{};ST.ships=st.ships||{};ST.stepsBy=ST.stepsBy||{};ST.duel=ST.duel||{me:0,them:0};
 if(SYNC.me&&ST.ships[SYNC.me]!==undefined)ST.ship=ST.ships[SYNC.me];
 if(o.clips&&o.clips.length){CLIPS.splice(0,CLIPS.length,...o.clips);clipSig=VS.day+':'+VS.log.filter(l=>l.meta&&l.meta.ids&&l.meta.ids.length).length}
 if(o.ed){ED.cliff=o.ed.cliff||ED.cliff;ED.treat=o.ed.treat||ED.treat;ED.locked=!!o.ed.locked;ED.rating=o.ed.rating||ED.rating}
 partnerView();layout();drawVilla();renderTime();syncReels();renderQueue();renderBriefBadge();renderSteps()}
function partnerView(){if(!SYNC.on)return;const ot=SYNC.other;PARTNER.ship=ot&&ST.ships[ot]?ST.ships[ot]:null;
 const ag={a:'ivy',b:'nova'};AGENDA_ME=ag[SYNC.seat]||'ivy';PARTNER.agenda=SYNC.seat==='b'?'ivy':'nova';
 const back=document.querySelector('#agenda .back');if(back)back.innerHTML=`Get <b>${byId[AGENDA_ME].name}</b> to the final.<br><small>Bonus at the wrap party if they make it.</small>`;
 const sb=ot&&ST.stepsBy[ot];ST.steps.them=sb&&sb.day===VS.day?sb.n:0}
async function push(){if(!SYNC.on||SYNC.applying||SYNC.ro)return;if(SYNC.writing){SYNC.again=true;return}
 ST.stepsBy[SYNC.me]={n:ST.steps.me,tog:ST.steps.tog,day:VS.day};let o=snapState(),s=JSON.stringify(o);if(s.length>230000){o.log=o.log.slice(-15);o.clips=o.clips.map(c=>Object.assign({},c,{lines:(c.lines||[]).slice(0,2)}));s=JSON.stringify(o)}
 if(s===SYNC.last)return;SYNC.writing=true;SYNC.v++;SYNC.last=s;
 try{await SYNC.ref.set({v:SYNC.v,by:SYNC.me,at:new Date().toISOString(),s})}catch(e){const c=e&&e.code;if(c==='invalid_argument'){SYNC.ro=true;toast('You can watch this season but not change it. Ask the owner to share it with you as a Contributor.')}else if(c==='quota_exceeded')toast('Season storage is full.');else if(c==='unavailable'){SYNC.last='';setTimeout(push,1500+Math.random()*1500)}}
 SYNC.writing=false;if(SYNC.again){SYNC.again=false;push()}}
let pushT=null;function schedulePush(){if(!SYNC.on)return;clearTimeout(pushT);pushT=setTimeout(push,700)}
setInterval(()=>{if(SYNC.on&&!SYNC.applying&&!SYNC.writing)push()},4000);
function onRemote(d){const prevLog=VS.log.length;SYNC.applying=true;try{applyState(JSON.parse(d.s))}catch(e){console.warn('sync apply failed',e)}SYNC.v=Math.max(SYNC.v,d.v||0);SYNC.last=JSON.stringify(snapState());SYNC.applying=false;
 if(SYNC.started&&d.by!==SYNC.me){const mine=VS.log.filter(l=>l.meta&&l.meta.by===SYNC.other);const n=mine.length?mine[mine.length-1]:null;if(n&&VS.log.length!==prevLog){toast(`${SYNC.pname}: ${n.text}`);PARTNER.unread++;markTrailer()}if(VS.open&&document.getElementById('locView').classList.contains('on'))openLoc(VS.open)}}
/* hooks so every change is shared and tagged with who made it */
const _li=logIt;logIt=function(l,t,s,m){m=m||{};if(SYNC.on&&!m.by)m.by=SYNC.me;_li(l,t,s,m);schedulePush()};
['timeCtl'].forEach(id=>document.getElementById(id).addEventListener('click',()=>schedulePush()));
const _pm=partnerMove;partnerMove=function(){if(SYNC.on)return;_pm()};
const _ps=partnerSays;partnerSays=function(cat,id){if(SYNC.on)return;_ps(cat,id)};
const _sr=stepReels;stepReels=function(){return SYNC.on?Math.floor(ST.steps.me/250)+ST.steps.tog:_sr()};
const _re3=renderEdit;renderEdit=function(){_re3();if(SYNC.on){const n=document.getElementById('pnote');if(n)n.remove()}schedulePush()};
window.__partnerPicks=R=>{if(!SYNC.on)return null;const p=SYNC.other&&ST.picks[SYNC.other];return p&&p.day===VS.day?Object.assign({},p.p):{}};
window.__finPartner=F=>{if(!SYNC.on)return null;const p=SYNC.other&&ST.finPick[SYNC.other];return typeof p==='number'?p:null};
const _rs=recoupleSetup;recoupleSetup=function(){if(SYNC.on&&ST.rcSetup&&ST.rcSetup.day===VS.day){const s=ST.rcSetup;VS.rc={choosers:s.choosers.slice(),recv:s.recv.slice(),unc:s.unc.slice(),pred:Object.assign({},(ST.picks[SYNC.me]&&ST.picks[SYNC.me].day===VS.day)?ST.picks[SYNC.me].p:{})};renderPredict();return}
 _rs();if(SYNC.on){ST.rcSetup={day:VS.day,choosers:VS.rc.choosers,recv:VS.rc.recv,unc:VS.rc.unc};schedulePush()}};
const _rp=renderPredict;renderPredict=function(){_rp();if(!SYNC.on)return;ST.picks[SYNC.me]={day:VS.day,p:Object.assign({},VS.rc.pred)};schedulePush();
 const op=SYNC.other&&ST.picks[SYNC.other],n=op&&op.day===VS.day?Object.keys(op.p).length:0;const go=document.getElementById('rcGo');if(go)go.insertAdjacentHTML('beforebegin',`<p class="fine">${SYNC.other?`${SYNC.pname} has locked ${n} of ${VS.rc.unc.length} calls.`:'Your co-producer hasn’t joined yet.'} Whoever starts the recoupling runs it for both of you.</p>`)};
const _rf=runFinale;runFinale=function(pick){if(SYNC.on){ST.finPick[SYNC.me]=pick;schedulePush()}_rf(pick)};
const _rb2=renderBoard;renderBoard=function(){_rb2();const el=document.getElementById('coop');if(!el)return;
 if(!SYNC.on){el.insertAdjacentHTML('afterbegin',`<p class="mode">Solo preview · Partner is simulated. Share this page with your co-producer as a Contributor and you'll run the same villa together.</p>`);return}
 const theirs=VS.log.filter(l=>l.meta&&l.meta.by===SYNC.other).slice(-6).reverse();
 el.innerHTML=`<p class="mode live"><span class="pulse"></span>${SYNC.other?`Live with ${SYNC.pname}`:'Live · waiting for your co-producer to open this page'}</p><div class="coop-h"><b>You vs ${SYNC.pname}</b><span>Recoupling calls ${ST.duel.me} – ${ST.duel.them}</span></div><div class="lab" style="color:#CDB9C8">${SYNC.pname}'s moves today</div>${theirs.length?theirs.map(l=>`<p><small>${l.time}</small>${l.text}</p>`).join(''):'<p class="fine" style="color:#CDB9C8">Nothing yet today.</p>'}<div class="lab" style="color:#CDB9C8">Ships</div><p>Yours: ${ST.ship?ST.ship.split('|').map(i=>byId[i]?byId[i].name:'?').join(' + '):'not set'} · ${SYNC.pname}'s: ${PARTNER.ship?PARTNER.ship.split('|').map(i=>byId[i]?byId[i].name:'?').join(' + '):'not set'}</p>`};
/* real chat when shared */
function chatSend(t){t=String(t||'').trim().slice(0,240);if(!t)return;if(SYNC.on){SYNC.db.collection('chat').add({by:SYNC.me,t,at:new Date().toISOString()}).catch(()=>toast('Message didn’t send.'))}else{CHAT.push({who:'me',t});renderBoard();setTimeout(()=>{CHAT.push({who:'them',t:rnd(REPLY)});renderBoard()},900)}}
(function chatBox(){const chips=document.getElementById('chatChips');const f=document.createElement('form');f.className='chatin';f.innerHTML='<input type="text" maxlength="240" placeholder="Message your co-producer" aria-label="Message your co-producer"><button type="submit">Send</button>';chips.after(f);
 f.addEventListener('submit',e=>{e.preventDefault();const i=f.querySelector('input');chatSend(i.value);i.value=''});
 chips.addEventListener('click',e=>{if(!SYNC.on)return;const b=e.target.closest('[data-q]');if(!b)return;e.stopImmediatePropagation();chatSend(QUICK[+b.dataset.q])},true)})();
/* start-over control for the owner */
const _ss2=showStatus;showStatus=function(){_ss2();if(!SYNC.on)return;const b=document.createElement('button');b.className='pbtn';b.style.cssText='background:#fff;color:#C0344B;border:1px solid #E8CDB5;margin-top:8px';b.textContent='Start a new season for both of you';
 b.addEventListener('click',async()=>{if(!confirm('Start a brand-new season? This resets the villa for both producers.'))return;try{await SYNC.ref.set({v:SYNC.v+1,by:SYNC.me,at:new Date().toISOString(),s:SYNC.initial,reset:true});toast('New season started.')}catch(e){toast('Only producers with edit access can reset the season.')}});sheet.appendChild(b)};
(async function startSync(){if(!(window.claude&&window.claude.use))return;let db=null,user=null;try{[db,user]=await Promise.all([window.claude.use('db'),window.claude.use('user')])}catch(e){return}if(!db||!user)return;
 let me=null;try{me=await user.id()}catch(e){}if(!me)return;
 SYNC.db=db;SYNC.me=me;SYNC.ref=db.doc('seasons/main');SYNC.initial=JSON.stringify(snapState());SYNC.on=true;
 try{const seats=db.doc('seasons/seats');const L=await seats.acquire({holder:me,ttlMs:5000});const g=await seats.get();const s=g.exists?Object.assign({},g.data()):{};
  if(s.a!==me&&s.b!==me){if(!s.a)s.a=me;else if(!s.b)s.b=me;if(L.acquired)await seats.set(s).catch(()=>{})}
  SYNC.seat=s.a===me?'a':s.b===me?'b':null;
  seats.onSnapshot(sn=>{const d=sn.exists?sn.data():{};SYNC.seat=d.a===me?'a':d.b===me?'b':SYNC.seat;SYNC.other=d.a===me?d.b:d.b===me?d.a:null;
   if(SYNC.other)user.profiles([SYNC.other]).then(ps=>{const n=ps&&ps[SYNC.other]&&ps[SYNC.other].name;if(n)SYNC.pname=n.split(' ')[0];renderBoard()}).catch(()=>{});partnerView();renderSteps()},()=>{})}catch(e){}
 SYNC.timer=setTimeout(()=>toast('Can’t reach the shared season yet. Playing offline for now.'),10000);
 SYNC.ref.onSnapshot(sn=>{clearTimeout(SYNC.timer);if(!sn.exists){if(!SYNC.started){SYNC.started=true;push()}return}const d=sn.data();if(d.reset&&d.by!==me){SYNC.last='';}
  if(d.s===SYNC.last){SYNC.started=true;return}if(d.by===me&&!d.reset&&SYNC.started)return;onRemote(d);SYNC.started=true},e=>{clearTimeout(SYNC.timer);if(e&&e.code==='revoked'){SYNC.on=false}});
 db.collection('chat').orderBy('at','desc').limit(60).onSnapshot(q=>{const msgs=q.docs.map(x=>x.data()).reverse();const before=CHAT.length;CHAT.splice(0,CHAT.length,...msgs.map(m=>({who:m.by===me?'me':'them',t:String(m.t||'')})));if(q.docChanges().some(c=>c.type==='added'&&c.doc.data().by!==me)&&SYNC.started&&CHAT.length>=before){PARTNER.unread++;markTrailer()}if(document.getElementById('pTrailer').classList.contains('on'))renderBoard()},()=>{});
 CHAT.splice(0,CHAT.length);if(document.getElementById('pTrailer').classList.contains('on'))renderBoard();
})();
