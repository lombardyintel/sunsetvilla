
/* ---------- systems 3: co-producer, steps, bench bombshells, finale, context-aware lines ---------- */
ST.bombSeen=false;ST.duel={me:0,them:0};ST.cosign=false;ST.finale=false;
window.__lineOk=(cat,t)=>ST.bombSeen||/^bomb_|^react_bomb|^host|^ev_bomb|^fan_|^partner_/.test(cat)||!/bombshell|the new one|\{bomb\}/i.test(t);
/* bombshells can come from your casting bench */
function bombPool(){return ['theo','coco'].concat(CAST.filter(c=>c.slot).map(c=>c.id)).filter((id,i,a)=>a.indexOf(id)===i&&byId[id]&&!VIDS().includes(id)&&!ST.dumped.includes(id))}
SPECIALS.bomb=function(){const av=bombPool().slice(0,3);if(!av.length)return null;
 return {title:'Bombshell incoming',tag:'Villa text',text:'“Islanders, get ready. Someone new is about to walk into the villa.” You choose who.',lines:[],choices:av.map(id=>({label:`Send in ${byId[id].name} · ${byId[id].spName.replace(/ \(.*\)/,'')}${byId[id].slot?' (your scout)':''}`,run:()=>enterBomb(id)})),log:null,buzz:.2}};
const _enterBomb=enterBomb;enterBomb=function(id){ST.bombSeen=true;const out=_enterBomb(id);if(Math.random()<.7)partnerSays('partner_react',id);return out};
/* ---------- the co-producer ---------- */
const PARTNER={agenda:'nova',feed:[],unread:0};
PARTNER.ship=(()=>{const c=couplesList().sort((p,q)=>(AFF[q[0]][q[1]]+AFF[q[1]][q[0]])-(AFF[p[0]][p[1]]+AFF[p[1]][p[0]]))[0];return c?c.join('|'):null})();
function partnerSays(cat,id){const c=byId[id]||byId[pickV()];const t=say(cat,c,{},true);if(!t)return;CHAT.push({who:'them',t});PARTNER.unread++;markTrailer();if(document.getElementById('pTrailer').classList.contains('on'))renderBoard()}
function markTrailer(){const b=document.querySelector('.pl[data-place="pTrailer"]');if(!b)return;let d=b.querySelector('.dot');if(!d){d=document.createElement('i');d.className='dot';b.appendChild(d)}d.textContent=PARTNER.unread||'';d.style.display=PARTNER.unread?'':'none'}
function partnerMove(){if(!couplesList().length)return;const r=Math.random(),ag=VIDS().includes(PARTNER.agenda)?PARTNER.agenda:pickV(x=>COUPLES[x]);let text='',ids=[],said=[],kind='act',lk='terrace',star=false;startFx();
 if(r<.35){const a=ag,b=Math.random()<.5&&COUPLES[a]?COUPLES[a]:topOther(a);addAff(a,b,7);addAff(b,a,6);ids=[a,b];kind='date';lk='terrace';star=COUPLES[a]!==b;said=[[a,'date_banter',{themId:b}],[b,'date_spark',{themId:a}]];text=`Partner booked a date for ${byId[a].name} and ${byId[b].name}.`}
 else if(r<.6){const a=ag;moodUp([a],12);ids=[a];lk='garden';said=[[a,'conf_strategy',{themId:COUPLES[a]}]];text=`Partner had a producer chat with ${byId[a].name}.`}
 else if(r<.82){const a=pickV(x=>COUPLES[x]&&x!==ag),p=COUPLES[a];addAff(p,a,-6);bump(p,a,'rival',3);ids=[a,p];lk='kitchen';star=true;said=[[p,'gossip',{themId:a}],[a,'argue_defend',{themId:p}]];text=`Partner planted a little doubt between ${byId[a].name} and ${byId[p].name}.`}
 else{const s=(PARTNER.ship||'').split('|').filter(x=>VIDS().includes(x));if(s.length<2){FX=null;return}addAff(s[0],s[1],5);addAff(s[1],s[0],5);ids=s;lk='pool';said=[[s[0],'couple_cute',{themId:s[1]}]];text=`Partner set up some quiet time for ${byId[s[0]].name} and ${byId[s[1]].name}.`}
 const fx=endFx();const lines=said.filter(l=>byId[l[0]]).map(([id,c,v])=>[id,say(c,byId[id],v,true)]);
 logIt(lk,text,star,{ids,lines,kind,title:`Partner: ${ids.map(i=>byId[i].name).join(' + ')}`,by:'partner'});
 PARTNER.feed.push({day:VS.day,time:TIMES[VS.t],text,fx});addBuzz(.1);syncLove();drawVilla();
 setTimeout(()=>{toast(text);partnerSays('partner_chat',ids[0])},1600)}
document.getElementById('timeCtl').addEventListener('click',()=>{if(Math.random()<.65)setTimeout(partnerMove,2400)});
/* trailer: what your co-producer did today, and the head-to-head */
const _rb=renderBoard;renderBoard=function(){_rb();PARTNER.unread=0;markTrailer();let el=document.getElementById('coop');if(!el){el=document.createElement('div');el.id='coop';el.className='coop';document.getElementById('board').before(el)}
 const today=PARTNER.feed.filter(f=>f.day===VS.day);
 el.innerHTML=`<div class="coop-h"><b>You vs Partner</b><span>Recoupling calls ${ST.duel.me} – ${ST.duel.them}</span></div><div class="lab" style="color:#CDB9C8">Partner's moves today</div>${today.length?today.map(f=>`<p><small>${f.time}</small>${f.text}${f.fx?`<span class="fxrow">${f.fx}</span>`:''}</p>`).join(''):'<p class="fine" style="color:#CDB9C8">Nothing yet. They move when time passes in the villa.</p>'}<div class="lab" style="color:#CDB9C8">Partner's ship</div><p>${PARTNER.ship?PARTNER.ship.split('|').map(i=>byId[i].name).join(' + '):'Undecided'}${ST.ship?` · yours: ${ST.ship.split('|').map(i=>byId[i].name).join(' + ')}`:''}</p>`};
/* prediction duel at the recoupling */
const _rr=runRecouple;runRecouple=function(){const R=VS.rc;const pp={};R.unc.forEach(ch=>{let best=null,bs=-1e9;R.recv.forEach(x=>{const s=AFF[ch][x]+(Math.random()-.5)*16;if(s>bs){bs=s;best=x}});pp[ch]=best});
 _rr();const me=R.unc.filter(ch=>R.pred[ch]===COUPLES[ch]).length,them=R.unc.filter(ch=>pp[ch]===COUPLES[ch]).length;ST.duel.me+=me;ST.duel.them+=them;
 const shipOk=PARTNER.ship&&COUPLES[PARTNER.ship.split('|')[0]]===PARTNER.ship.split('|')[1];
 setTimeout(()=>{const box=document.getElementById('rcsum');if(box)box.insertAdjacentHTML('afterbegin',`<div class="duel"><b>Prediction duel</b><span>You ${me}/${R.unc.length}</span><span>Partner ${them}/${R.unc.length}</span><em>${me>them?'You win tonight':me<them?'Partner wins tonight':'Tie'}</em></div><p class="fine">Partner's calls: ${R.unc.map(ch=>`${byId[ch].name} → ${byId[pp[ch]].name}`).join(' · ')}${PARTNER.ship?` · Partner's ship ${shipOk?'survived':'sank'}`:''}</p>`);partnerSays('partner_react',R.unc[0])},R.choosers.length*1700+1200)};
/* edit bay: partner's notes */
const _re2=renderEdit;renderEdit=function(){_re2();const real=CLIPS[0]&&CLIPS[0].ids;let n=document.getElementById('pnote');if(!real||ED.locked){if(n)n.remove();return}
 if(!n){n=document.createElement('div');n.id='pnote';n.className='pnote';document.getElementById('treat').before(n)}
 const cand=[...CLIPS].reverse().find(c=>c.id!==ED.cliff&&(c.kind==='event'||c.kind==='recouple'||c.kind==='date'))||CLIPS[0];const hero=Object.keys(ED.treat).includes(PARTNER.agenda)?PARTNER.agenda:Object.keys(ED.treat)[0];
 const same=ED.cliff===cand.id&&ED.treat[hero]==='Hero';
 n.innerHTML=ED.cosign?`<b>Co-signed</b><p>You took Partner's notes. Both producers signed off: +0.2 on tonight's rating.</p>`:`<b>Partner's notes</b><p>“End on <em>${cand.t}</em>. And give ${byId[hero].name} a hero edit tonight. Trust me.”</p>${same?'<p class="fine" style="color:#CDB9C8">Your cut already matches.</p>':''}<div class="seg"><button data-note="take">Take the notes</button><button data-note="keep">Keep my cut</button></div>`;
 n.querySelectorAll('[data-note]').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();if(b.dataset.note==='take'){ED.cliff=cand.id;ED.treat[hero]='Hero';ED.cosign=true;toast('Notes taken. Co-sign bonus +0.2')}else{toast('Your cut stands. Partner sends a side-eye emoji.');CHAT.push({who:'them',t:'Fine. But when the ratings dip, I said so.'});PARTNER.unread++;markTrailer();n.remove();return}renderEdit()}))};
const _aud2=audience;audience=function(){const a=_aud2();return ED.cosign?{v:a.v,rating:Math.min(9.8,+a.rating+.2).toFixed(1)}:a};
/* ---------- steps ---------- */
ST.steps={me:3240,them:2810,tog:0,claimed:0,ms:{}};
const MS=[[3000,10,'3,000 steps'],[6000,15,'6,000 steps: hot-air balloon dates unlock'],[8000,20,'8,000 steps: yacht day unlocks'],[10000,30,'10,000 steps']];
function stepReels(){return Math.floor(ST.steps.me/100)+Math.floor(ST.steps.them/100)+ST.steps.tog*2}
function renderSteps(){const sm=document.querySelector('.reels small');if(sm)sm.textContent=`You ${ST.steps.me.toLocaleString('en-US')} · Partner ${ST.steps.them.toLocaleString('en-US')} steps`}
function openWalk(){const S=ST.steps,claim=stepReels()-S.claimed;const bar=(v,col)=>`<i><b style="width:${Math.min(100,v/100)}%;background:${col}"></b></i>`;
 sheet.innerHTML=`${XB}<div class="evtag">Today's walking</div><h3>Steps become reels</h3><p class="leantxt">${say('walk_note',byId.mabel,{},true)}</p>
 <div class="walkr"><div><span>You</span>${bar(S.me,'#FF8A65')}<b>${S.me.toLocaleString('en-US')}</b></div><div><span>Partner</span>${bar(S.them,'#4CC3C0')}<b>${S.them.toLocaleString('en-US')}</b></div><div><span>Together</span>${bar(S.tog*500,'#FF6F91')}<b>${S.tog} min</b></div></div>
 <div class="lab">Milestones (yours)</div><div class="brief">${MS.map(([n,r,l])=>`<p class="${S.me>=n?'ok':''}"><i>${S.me>=n?'✓':''}</i><span>${l}</span><small>+${r} reels</small></p>`).join('')}</div>
 <button class="pbtn" id="wClaim" ${claim>0?'':'disabled'}>Collect ${claim} reels</button>
 <div class="lab">Demo: simulate walking</div><div class="btns"><button class="btn" data-walk="solo">Walk 1,000 steps</button><button class="btn" data-walk="tog">Walk together 10 min</button></div><p class="fine">In the app these numbers come from Apple Health or Google Fit. Walking together (both phones nearby) earns 2 bonus reels a minute.</p>`;
 sheet.classList.add('open');
 document.getElementById('wClaim').addEventListener('click',()=>{const c=stepReels()-ST.steps.claimed;ST.steps.claimed+=c;ST.reels+=c;syncReels();renderQueue();toast(`+${c} reels in the team pool`);openWalk()});
 sheet.querySelectorAll('[data-walk]').forEach(b=>b.addEventListener('click',()=>{const t=b.dataset.walk==='tog';ST.steps.me+=t?1100:1000;if(t){ST.steps.them+=1100;ST.steps.tog+=10}
  MS.forEach(([n,r,l])=>{if(ST.steps.me>=n&&!ST.steps.ms[n]){ST.steps.ms[n]=1;ST.reels+=r;syncReels();renderQueue();setTimeout(()=>toast(`Milestone: ${l}. +${r} reels`),300)}});
  if(t&&Math.random()<.6)setTimeout(()=>partnerSays('partner_chat','ivy'),900);renderSteps();openWalk()}))}
const reelsEl=document.querySelector('.clip .reels');reelsEl.setAttribute('role','button');reelsEl.setAttribute('tabindex','0');reelsEl.setAttribute('aria-label','Steps and reels');reelsEl.style.cursor='pointer';
reelsEl.addEventListener('click',()=>{goPlace('villa');openWalk()});reelsEl.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();goPlace('villa');openWalk()}});
document.getElementById('timeCtl').addEventListener('click',()=>{if(VS.t===0){ST.steps={me:800+Math.floor(Math.random()*900),them:600+Math.floor(Math.random()*900),tog:0,claimed:0,ms:{}};ED.cosign=false;renderSteps()}else{ST.steps.me+=900+Math.floor(Math.random()*1400);ST.steps.them+=700+Math.floor(Math.random()*1500);renderSteps()}});
renderSteps();
/* ---------- episode motion: hearts and walk-offs ---------- */
const _cs=clipScene;clipScene=function(c,last){const sc=_cs(c,last),d=sc.draw;sc.draw=()=>{let s=d();
 if(c.kind==='date'||c.kind==='payoff'||(c.kind==='recouple'&&/stays/.test(c.t)))s+=`<g transform="translate(195 420)"><g class="pop" style="animation-delay:4.4s"><path d="M0 18 C-30 -6 -18 -30 0 -14 C18 -30 30 -6 0 18Z" fill="#FF6F91"/></g></g>`;
 if(c.kind==='recouple'&&/dumped/.test(c.t))s=s.replace('<g class="zoom">','<g class="zoom"><g class="walkoff">').replace('</g><rect width="390" height="700"','</g></g><rect width="390" height="700"');
 return s};return sc};
/* ---------- the finale ---------- */
const AGENDA_ME='ivy';
function finaleScore(a,b){const t=v=>({Hero:5,'Comic relief':3,Mystery:1,Villain:-3})[ED.treat[v]]||0;const arc=ARCS.some(x=>ST.done[x.id]&&x.pay&&x.pay().every(i=>i===a||i===b))?6:0;return AFF[a][b]+AFF[b][a]+t(a)+t(b)+arc+Math.random()*10}
function startFinale(){if(ST.finale)return;ST.finale=true;const all=couplesList().map(([a,b])=>({a,b,s:finaleScore(a,b)})).sort((p,q)=>q.s-p.s);const fin=all.slice(0,4),out=all.slice(4);VS.fin={fin,out,pick:null};
 const singles=VIDS().filter(x=>!COUPLES[x]);
 sheet.innerHTML=`${XB}<div class="evtag">Day 21 · Finale</div><h3>Final night</h3><p class="leantxt">${say('host_finale',byId.mabel,{},true)}</p>${out.length||singles.length?`<p class="fine">Leaving before the final: ${out.map(x=>byId[x.a].name+' + '+byId[x.b].name).concat(singles.map(x=>byId[x].name)).join(' · ')}</p>`:''}
 <div class="lab">Who wins? Lock your call</div><div class="opts">${fin.map((x,i)=>`<button data-fin="${i}">${byId[x.a].name} + ${byId[x.b].name}</button>`).join('')}</div><p class="fine">Partner locks their call at the same time. A correct call is worth 20 points.</p>`;
 sheet.classList.add('open');sheet.querySelectorAll('[data-fin]').forEach(b=>b.addEventListener('click',()=>runFinale(+b.dataset.fin)))}
function runFinale(pick){const F=VS.fin,order=F.fin.slice().reverse();const pPick=F.fin.map((x,i)=>({i,s:x.s+(Math.random()-.5)*14})).sort((p,q)=>q.s-p.s)[0].i;
 sheet.innerHTML=`${XB}<div class="evtag">Finale · live</div><h3>The results</h3><p class="fine">You called ${byId[F.fin[pick].a].name} + ${byId[F.fin[pick].b].name}. Partner called ${byId[F.fin[pPick].a].name} + ${byId[F.fin[pPick].b].name}.</p><div id="finl"></div><div id="wrap"></div>`;
 const box=document.getElementById('finl'),places=['Fourth place','Third place','Second place','Winners'];const off=4-order.length;
 order.forEach((x,i)=>setTimeout(()=>{const win=i===order.length-1,A=byId[x.a],Bc=byId[x.b];
  box.insertAdjacentHTML('beforeend',`<div class="rc${win?' win':''}"><div class="rch"><b>${places[i+off]}</b> ${A.name} + ${Bc.name}${win?' <span class="shock" style="background:#B8860B">WINNERS</span>':''}</div><p>“${say(win?'finale_win':'finale_lose',A,{themId:x.b},true)}”</p>${win?`<p><b>${Bc.name}:</b> “${say('finale_speech',Bc,{themId:x.a},true)}”</p>`:''}</div>`);
  if(win)setTimeout(()=>wrapParty(F,pick,pPick),1400)},i*1900))}
function wrapParty(F,pick,pPick){const w=F.fin[0],finalists=F.fin.flatMap(x=>[x.a,x.b]);
 const rv={};RELS.filter(r=>r[2]==='rival').forEach(r=>{rv[r[0]]=(rv[r[0]]||0)+r[3];rv[r[1]]=(rv[r[1]]||0)+r[3]});const vil=Object.keys(rv).filter(id=>byId[id]).sort((a,b)=>rv[b]-rv[a])[0];
 const shock=VS.log.find(l=>l.meta&&l.meta.kind==='recouple'&&/switch/.test(l.meta.title||''));
 const fav=VIDS().map(id=>({id,s:VIDS().filter(x=>x!==id).reduce((a,x)=>a+AFF[x][id],0)})).sort((p,q)=>q.s-p.s)[0].id;
 const myAg=finalists.includes(AGENDA_ME),thAg=finalists.includes(PARTNER.agenda);
 const me=ST.instinct+ST.duel.me*10+(pick===0?20:0)+(myAg?30:0),them=ST.duel.them*10+Math.round(ST.instinct*.8)+(pPick===0?20:0)+(thAg?30:0);
 document.getElementById('wrap').innerHTML=`<div class="lab">Wrap party</div><div class="awards">
 <p><b>Winners</b>${byId[w.a].name} + ${byId[w.b].name}</p><p><b>Villain of the season</b>${vil?byId[vil].name:'Nobody, somehow'}</p><p><b>Fan favorite</b>${byId[fav].name}</p><p><b>Biggest shock</b>${shock?shock.meta.title:'The gecko, every time'}</p><p><b>MVP</b>Gerald the gecko</p></div>
 <div class="lab">Secret agendas revealed</div><div class="brief"><p class="${myAg?'ok':''}"><i>${myAg?'✓':''}</i><span>Yours: get ${byId[AGENDA_ME].name} to the final</span><small>+30</small></p><p class="${thAg?'ok':''}"><i>${thAg?'✓':''}</i><span>Partner's: get ${byId[PARTNER.agenda].name} to the final</span><small>+30</small></p></div>
 <div class="kpis"><div><b>${me}</b><span>You</span></div><div><b>${them}</b><span>Partner</span></div><div><b>${ST.rating.toFixed(1)}</b><span>Season rating</span></div></div>
 <p class="leantxt" style="text-align:center"><b>${me>them?'You win the producer crown.':me<them?'Partner wins the producer crown.':'Joint showrunners. A tie.'}</b></p>
 <button class="pbtn" id="s2">Start casting Season 2</button>`;
 document.getElementById('s2').addEventListener('click',()=>toast('Season 2 casting opens Monday. Your scouts carry over.'));
 logIt('firepit',`Finale: ${byId[w.a].name} and ${byId[w.b].name} win Sunset Villa.`,true,{ids:[w.a,w.b],lines:[],kind:'payoff',title:'The winners'})}
BEATS[21]='finale';BEATN.finale='The final night. One couple takes it all.';BEATL.finale='Finale';SPECIALS.finale=function(){setTimeout(startFinale,50);return null};
const _ss=showStatus;showStatus=function(){_ss();const b=document.createElement('button');b.className='pbtn';b.style.cssText='background:#fff;color:#241A2E;border:1px solid #E8CDB5;margin-top:12px';b.textContent=ST.finale?'Finale aired':'Jump to the finale (demo)';b.disabled=ST.finale;b.addEventListener('click',()=>{VS.day=21;VS.t=2;renderTime();startFinale()});sheet.appendChild(b)};
