
/* ---------- systems 7: producer level, achievements, casting book, props cupboard, edit bay grading ---------- */
ST.xp=ST.xp||0;ST.stats=ST.stats||{};ST.ach=ST.ach||{};ST.book=ST.book||{seen:{},signed:{},gold:{}};ST.scout=ST.scout||0;ST.inv=ST.inv||{};ST.pm=ST.pm||{};ST.pc=ST.pc||{};ST.usedToday=ST.usedToday||{};ST.best=ST.best||{rating:0,grade:''};
const stat=(k,n=1)=>{ST.stats[k]=(ST.stats[k]||0)+n;checkAch()};
const LVX=[0,60,140,250,400,600,850,1150,1500,1900,2400,3000,3700,4500,5400,6400,7500,8700,10000,11500];
const TITLES=['Runner','Production assistant','Production assistant','Junior producer','Junior producer','Producer','Story producer','Story producer','Senior producer','Senior producer','Supervising producer','Supervising producer','Co-executive producer','Showrunner','Showrunner','Executive producer','Executive producer','Network star','Network legend','Network legend'];
const lvlOf=x=>{let l=0;while(l<LVX.length-1&&x>=LVX[l+1])l++;return l+1};
function xp(n,why){if(!n)return;const before=lvlOf(ST.xp);ST.xp+=Math.round(n);const after=lvlOf(ST.xp);renderLvl(why?`+${Math.round(n)} XP · ${why}`:null);
 if(after>before){const r=10+after*5;ST.reels+=r;syncReels();renderQueue();setTimeout(()=>levelUp(after,r),700)}checkAch()}
window.__xp=xp;
function renderLvl(flash){let el=document.getElementById('lvlChip');if(!el){el=document.createElement('button');el.id='lvlChip';el.className='lvl';el.setAttribute('aria-label','Producer level and achievements');document.querySelector('.clip .clip-row').appendChild(el);el.addEventListener('click',()=>{goPlace('villa');openProducer()})}
 const l=lvlOf(ST.xp),lo=LVX[l-1],hi=LVX[l]||lo+1500,pc=Math.min(100,(ST.xp-lo)/(hi-lo)*100);el.innerHTML=`<b>Lv ${l}</b><span>${TITLES[l-1]}</span><i><em style="width:${pc}%"></em></i>`;
 if(flash){el.classList.remove('flash');void el.offsetWidth;el.classList.add('flash');el.dataset.f=flash}}
function levelUp(l,r){const pb=document.getElementById('payoff');pb.innerHTML=`<button class="x" aria-label="Close">×</button><div class="evtag">Level up</div><h3>Level ${l}: ${TITLES[l-1]}</h3><p>The network has noticed. +${r} reels in the team pool.</p>${PERKS[l]?`<p><b>Unlocked:</b> ${PERKS[l]}</p>`:''}`;pb.classList.add('on');pb.querySelector('.x').onclick=()=>pb.classList.remove('on')}
const PERKS={3:'Interview room sessions start with 4 questions.',5:'A second twist card every day.',7:'Chemistry reads in the Casting Van cost half.',9:'Props deals go to 40% off.',12:'Gold edit: your first edit tool each day is free.'};
/* perks */
const _oi2=openInterview;openInterview=function(id){_oi2(id);if(lvlOf(ST.xp)>=3&&VI.id===id&&VI.left===3){VI.left=4;renderIV(say('iv_open',byId[id],{},true),'')}};
window.__twistCap=()=>lvlOf(ST.xp)>=5?2:1;
/* achievements */
const ACH=[
 ['first','First key moment','Film your first key moment.',()=>VS.log.some(l=>l.star)||ST.stats.key>0],
 ['iv10','Confession booth','Run 10 interview room sessions.',()=>(ST.stats.iv||0)>=10],
 ['stir','Professional stirrer','Use the producer stir 3 times.',()=>(ST.stats.stir||0)>=3],
 ['call3','Called it','Call 3 recoupling picks right.',()=>ST.duel.me>=3],
 ['psychic','Psychic','Predict 3 challenge winners.',()=>(ST.stats.chRight||0)>=3],
 ['host5','Game show host','Produce 5 challenges.',()=>(ST.gamesPlayed||[]).length>=5],
 ['bomb2','Bombshell season','Send in 2 bombshells.',()=>(ST.stats.bombs||0)>=2],
 ['dump','It’s not you','Someone gets dumped.',()=>ST.dumped.length>=1],
 ['shock','Plot twist','Produce a recoupling switch.',()=>VS.log.some(l=>l.meta&&l.meta.kind==='recouple'&&/switch/.test(l.meta.title||''))||(ST.stats.switches||0)>0],
 ['gold85','Ratings gold','Air an episode rated 8.5 or higher.',()=>ST.best.rating>=8.5],
 ['srank','S-rank edit','Air an S-grade episode.',()=>ST.best.grade==='S'||(ST.stats.sGrades||0)>0],
 ['sign3','Talent scout','Sign 3 cast members.',()=>(ST.stats.signs||0)>=3],
 ['golden','Golden touch','Sign a rare golden-hour candidate.',()=>(ST.stats.goldSigns||0)>=1],
 ['book50','Field guide','Discover half the species in the Cast Book.',()=>Object.keys(ST.book.seen).length>=Math.ceil(Object.keys(SPNAME).length/2)],
 ['hoard','Prop hoarder','Own 10 props at once.',()=>Object.values(ST.inv).reduce((a,b)=>a+b,0)>=10],
 ['master','Prop master','Get any prop to level 3.',()=>Object.values(ST.pm).some(u=>u>=5)],
 ['combo','Combo producer','Trigger a prop combo.',()=>(ST.stats.combos||0)>=1],
 ['10k','Ten thousand','Walk 10,000 steps in a day.',()=>ST.steps.me>=10000],
 ['together','Better together','Walk together for 30 minutes in a day.',()=>ST.steps.tog>=30],
 ['story2','Storyteller','Pay off 2 storylines.',()=>Object.keys(ST.done).length>=2],
 ['demands','Crowd pleaser','Meet every audience demand in one episode.',()=>(ST.stats.allDemands||0)>=1],
 ['finale','That’s a wrap','Produce a finale.',()=>!!ST.finale]
];
function checkAch(){ACH.forEach(([id,n,d,f])=>{if(ST.ach[id])return;let ok=false;try{ok=f()}catch(e){}if(ok){ST.ach[id]=VS.day;ST.xp+=25;renderLvl('Achievement: '+n);setTimeout(()=>toast(`Achievement unlocked: ${n}. +25 XP`),400)}})}
function openProducer(){const l=lvlOf(ST.xp),got=ACH.filter(a=>ST.ach[a[0]]).length;
 sheet.innerHTML=`${XB}<div class="evtag">Producer profile</div><h3>Level ${l} · ${TITLES[l-1]}</h3><div class="meta">${ST.xp.toLocaleString('en-US')} XP · next level at ${(LVX[l]||ST.xp).toLocaleString('en-US')}</div>
 <div class="kpis"><div><b>${got}/${ACH.length}</b><span>Achievements</span></div><div><b>${ST.best.grade||'–'}</b><span>Best grade</span></div><div><b>${Object.keys(ST.book.seen).length}/${Object.keys(SPNAME).length}</b><span>Cast Book</span></div></div>
 <div class="lab">Perks</div><div class="brief">${Object.entries(PERKS).map(([lv,t])=>`<p class="${l>=lv?'ok':''}"><i>${l>=lv?'✓':''}</i><span>Lv ${lv}: ${t}</span></p>`).join('')}</div>
 <div class="lab">Achievements</div><div class="achs">${ACH.map(([id,n,d])=>`<div class="ach ${ST.ach[id]?'on':''}"><b>${ST.ach[id]?'★':'☆'} ${n}</b><span>${d}</span></div>`).join('')}</div>`;sheet.classList.add('open')}
/* XP from everything */
const _li7=logIt;logIt=function(l,t,s,m){_li7(l,t,s,m);if(!SYNC.applying){xp(s?5:3);if(s)stat('key')}};
const _civ=closeIV;closeIV=function(){const had=VI.said.length;_civ();if(had){stat('iv');xp(8,'Interview')}};
const _iva=ivAnswer;ivAnswer=function(k,x){if(k==='stir')stat('stir');return _iva(k,x)};
const _eb=enterBomb;enterBomb=function(id){stat('bombs');xp(10,'Bombshell');return _eb(id)};
const _cb=checkBrief;checkBrief=function(extra){const b=ST.brief?ST.brief.goals.filter(g=>g.done).length:0;_cb(extra);const a=ST.brief?ST.brief.goals.filter(g=>g.done).length:0;if(a>b)xp(10*(a-b),'Brief goal');if(extra&&extra.rcRight)xp(5*extra.rcRight,'Recoupling calls')};
const _fc=finishCH;finishCH=function(){const right=CH.res&&String(CH.x.pred)===String(CH.res.winKey)&&CH.finished!==CH.res;_fc();if(right)stat('chRight')};
document.addEventListener('click',e=>{if(e.target.closest('#wClaim')){const c=stepReels()-ST.steps.claimed;if(c>0)setTimeout(()=>xp(Math.ceil(c/2),'Walking'),50)}if(e.target.closest('[data-tw]:not([disabled])'))setTimeout(()=>xp(10,'Twist'),50)},true);
const _rr7=runRecouple;runRecouple=function(){_rr7();setTimeout(()=>{if(couplesList().some(([a,b])=>VS.rc&&VS.rc.choosers.includes(a)&&false))return;const sw=VS.log.filter(l=>l.meta&&l.meta.kind==='recouple'&&/switch/.test(l.meta.title||'')).length;if(sw)ST.stats.switches=sw;xp(15,'Recoupling');checkAch()},VS.rc.choosers.length*1700+1500)};
/* ---------- casting: cast book, scout rank, star signings ---------- */
const SRANK=[[0,'Intern'],[30,'Scout'],[80,'Talent spotter'],[160,'Casting director'],[300,'Head of talent']];
const srank=()=>SRANK.filter(r=>ST.scout>=r[0]).pop();
const castSeen={};let lastRoster=0;
function scoutXP(n,why){const r0=srank()[1];ST.scout+=n;xp(n,why);const r1=srank()[1];if(r1!==r0){ST.reels+=25;syncReels();renderQueue();setTimeout(()=>toast(`Scout rank up: ${r1}. +25 reels`),600)}}
const _rc=renderCast;renderCast=function(){_rc();
 (CS2.cands||[]).forEach(c=>{const sp=String(c.sp).replace(/^g_/,'');if(!ST.book.seen[sp]){ST.book.seen[sp]=VS.day;setTimeout(()=>toast(`New species in your Cast Book: ${SPNAME[sp]||sp}`),300);xp(5)}if(c.rare)ST.book.gold[sp]=true;
  const k=castSeen[c.id]||{obs:0,asked:0,chem:null};if(c.obs>k.obs)scoutXP(2*(c.obs-k.obs),'Observed');if(c.asked.length>k.asked)scoutXP(2*(c.asked.length-k.asked),'Interview');if(c.chem&&!k.chem)scoutXP(4,'Chemistry read');castSeen[c.id]={obs:c.obs,asked:c.asked.length,chem:c.chem}});
 if(CS2.roster.length>lastRoster){const r=CS2.roster[CS2.roster.length-1],c=CAST.slice().reverse().find(x=>x.name===r.name&&x.slot);lastRoster=CS2.roster.length;if(c&&!c.stars){const best=Math.max(...VILLA.map(v=>chemScore(c,byId[v.id])));c.stars=Math.max(1,Math.min(5,Math.round(best/22)+(r.mood==='thrilled'?1:0)+(c.rare?1:0)));const sp=String(c.sp).replace(/^g_/,'');ST.book.signed[sp]=(ST.book.signed[sp]||0)+1;stat('signs');if(c.rare)stat('goldSigns');const rw=c.stars*5;ST.reels+=rw;syncReels();renderQueue();scoutXP(15,'Signed '+c.name);setTimeout(()=>toast(`${'★'.repeat(c.stars)} signing: ${c.name}. +${rw} reels`),500)}}
 let bar=document.getElementById('castbar');if(!bar){bar=document.createElement('div');bar.id='castbar';bar.className='castbar';document.getElementById('regions').before(bar);bar.addEventListener('click',e=>{if(e.target.closest('#bookBtn')){const b=document.getElementById('castbook');b.classList.toggle('on');renderBook()}})}
 const r=srank(),nx=SRANK.find(x=>x[0]>ST.scout);bar.innerHTML=`<div><b>${r[1]}</b><span>Scout XP ${ST.scout}${nx?` · ${nx[0]-ST.scout} to ${nx[1]}`:''}</span><i><em style="width:${nx?Math.min(100,(ST.scout-r[0])/(nx[0]-r[0])*100):100}%"></em></i></div><button id="bookBtn">Cast Book ${Object.keys(ST.book.seen).length}/${Object.keys(SPNAME).length}</button>`;
 let bk=document.getElementById('castbook');if(!bk){bk=document.createElement('div');bk.id='castbook';bk.className='castbook';bar.after(bk)}if(bk.classList.contains('on'))renderBook();
 const rec=document.getElementById('recruits');if(rec)rec.querySelectorAll('span').forEach(s=>{const c=CAST.find(x=>x.slot&&s.textContent.startsWith(x.name));if(c&&c.stars&&!s.dataset.st){s.dataset.st=1;s.insertAdjacentHTML('afterbegin',`<b class="stars">${'★'.repeat(c.stars)}</b> `)}})};
function renderBook(){const bk=document.getElementById('castbook');const sps=Object.keys(SPNAME);const regs=Object.entries(CREG);
 bk.innerHTML=`<p class="fine">Meet every species to fill your book. Complete a region's set for a bonus. Golden-hour finds are marked in gold.</p><div class="bookg">${sps.map(sp=>{const seen=ST.book.seen[sp],sig=ST.book.signed[sp]||0,gold=ST.book.gold[sp];const c={id:'bk_'+sp,name:SPNAME[sp],sp,top:'#E8CDB5',bot:'#C8B4A0',acc:'none',iris:'#3A2A22',expr:'smile'};let art='';try{art=char(c,{})}catch(e){art=''}
  return `<div class="bk ${seen?'seen':''} ${gold?'gold':''}"><svg viewBox="0 -6 120 222" aria-hidden="true">${art}</svg><b>${seen?SPNAME[sp]:'???'}</b><span>${seen?(sig?`Signed ${sig}`:'Seen'):'Not found yet'}</span></div>`}).join('')}</div>
 <div class="lab">Region sets</div>${regs.map(([n,R])=>{const have=R.sp.filter(s=>ST.book.seen[s]).length;const done=have===R.sp.length;if(done&&!ST.book['reg_'+n]){ST.book['reg_'+n]=1;ST.reels+=40;syncReels();renderQueue();setTimeout(()=>toast(`Region complete: ${n}. +40 reels`),300);xp(40,'Region set')}return `<div class="arc"><div><b>${n}</b><span>${have}/${R.sp.length}${done?' · complete':''}</span></div><i><b style="width:${have/R.sp.length*100}%"></b></i></div>`}).join('')}`}
const _cs7=document.getElementById('enc');if(_cs7)_cs7.addEventListener('click',e=>{if(lvlOf(ST.xp)>=7&&e.target.closest('[data-chem]')){ST.reels+=4;syncReels()}},true);
/* ---------- props: cupboard, mastery, deals, combos, real effects ---------- */
const pkey=(s,i)=>s+':'+i,plv=k=>{const u=ST.pm[k]||0;return u>=5?3:u>=2?2:1},pmult=k=>1+(plv(k)-1)*.25;
function dealToday(){if(!ST.deal||ST.deal.day!==VS.day){const s=rnd(Object.keys(SHELF)),i=Math.floor(Math.random()*SHELF[s].length);ST.deal={day:VS.day,k:pkey(s,i)}}return ST.deal}
const priceOf=(s,i)=>{const c=SHELF[s][i][1],d=dealToday();return d.k===pkey(s,i)?Math.round(c*(lvlOf(ST.xp)>=9?.6:.7)):c};
const DLOC=['pottery','pottery','rooftop','yacht','yacht','yacht'],DAFF=[5,6,6,9,10,14],DSTEPS=[0,0,0,6000,8000,15000];
function pickPeople(n,title,cb,filter){goPlace('villa');const sel=[];const draw=()=>{const opts=VIDS().filter(filter||(()=>true));sheet.innerHTML=`${XB}<div class="evtag">Props Department</div><h3>${title}</h3><p class="fine">Choose ${n===1?'one islander':'two islanders'}.</p><div class="opts">${opts.map(i=>`<button data-pp2="${i}" class="${sel.includes(i)?'on':''}">${nm(i)}${COUPLES[i]?` <small>· with ${nm(COUPLES[i])}</small>`:''}</button>`).join('')}</div>`;sheet.classList.add('open');
  sheet.querySelectorAll('[data-pp2]').forEach(b=>b.addEventListener('click',()=>{const id=b.dataset.pp2;const i=sel.indexOf(id);if(i>=0)sel.splice(i,1);else sel.push(id);if(sel.length===n){closeSheet();cb(...sel)}else draw()}))};draw()}
function useProp(s,i){const k=pkey(s,i),[name]=SHELF[s][i],m=pmult(k);const done=(ok)=>{if(ok===false)return;ST.inv[k]--;if(!ST.inv[k])delete ST.inv[k];const l0=plv(k);ST.pm[k]=(ST.pm[k]||0)+1;if(plv(k)>l0)setTimeout(()=>toast(`${name.replace(/"/g,'')} is now level ${plv(k)}. Stronger effect.`),900);xp(6,'Prop used');
  ST.usedToday={day:VS.day,list:(ST.usedToday.day===VS.day?ST.usedToday.list:[]).concat(s)};const L=ST.usedToday.list;
  const combo=(L.includes('Texts')&&L.includes('Dates')&&!ST.usedToday.c1)?['c1','Plot twist combo: a text and a date on the same day']:(L.includes('Edit tools')&&L.includes('Events')&&!ST.usedToday.c2)?['c2','Director’s combo: an event and an edit tool']:(L.includes('Wardrobe')&&L.includes('Dates')&&!ST.usedToday.c3)?['c3','Glow-up combo: a makeover before a date']:null;
  if(combo){ST.usedToday[combo[0]]=1;stat('combos');addBuzz(.3);xp(15,'Combo');setTimeout(()=>toast(`${combo[1]}. +0.3 buzz`),1400)}renderProps();schedulePush()};
 if(s==='Dates'){if(ST.steps.me<DSTEPS[i]){toast(`Needs ${DSTEPS[i].toLocaleString('en-US')} steps today. You're on ${ST.steps.me.toLocaleString('en-US')}.`);return}pickPeople(2,`Who goes on the ${name.toLowerCase()}?`,(a,b)=>{startFx();addAff(a,b,DAFF[i]*m);addAff(b,a,DAFF[i]*m*.9);const p=COUPLES[a];if(p&&p!==b)addAff(p,a,-4);const f=endFx();logIt('terrace',`Date: ${nm(a)} and ${nm(b)}, ${name}.`,true,{ids:[a,b],lines:[[a,say('date_open',byId[a],{themId:b,loc:name},true)],[b,say('date_spark',byId[b],{themId:a},true)]],kind:'date',dloc:DLOC[i],title:`Date: ${nm(a)} + ${nm(b)}`});toast(`${name} booked for ${nm(a)} and ${nm(b)}.`);if(f)setTimeout(()=>toast(f.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ')),1600);done()});return}
 if(s==='Wardrobe'){const couple=i===1||i===3;pickPeople(couple?2:1,couple?'Which two?':'Who gets the glow-up?',(a,b)=>{startFx();if(couple){addAff(a,b,(i===3?8:6)*m);addAff(b,a,(i===3?8:6)*m)}else{moodUp([a],(i===4?20:10)*m);VIDS().filter(x=>x!==a).forEach(x=>addAff(x,a,(i===5?4:2)*m))}endFx();logIt('dressing',`${name}: ${nm(a)}${b?' and '+nm(b):''}.`,i>=3,{ids:[a,b].filter(Boolean),lines:[[a,say('compliment',byId[a],{themId:b||COUPLES[a]},true)]],kind:'act',title:`${name}: ${nm(a)}`});toast(`${name} for ${nm(a)}${b?' and '+nm(b):''}. Heads are turning.`);done()},couple?(x=>true):null);return}
 if(s==='Edit tools'){ED.tools=(ED.tools&&ED.tools.day===VS.day)?ED.tools:{day:VS.day,list:[]};ED.tools.list.push({i,m});toast(`${name} loaded into tonight’s edit.`);done();return}
 const map={Texts:['secret','swap','vote','rumor','early','singles'],Arrivals:['bomb','ex','bomb','bomb','bomb','bomb'],Events:['movie','heartrate','gesture','fallout','vote','truthdare']}[s][i];goPlace('villa');
 if(map==='early'){ST.rcDay=null;toast('Recoupling moved to tonight. Head to the fire pit at golden hour.');done();return}
 if(map==='ex'){const E=EVENTS.find(e=>e.id==='ex');startFx();const r=E.go();const f=endFx();showEv({title:E.t,text:r.text,lines:r.lines,log:{loc:'garden',text:`${E.t}: ${r.text}`,ids:[r.who]},fx:f});done();return}
 if(map==='secret'){const a=pickV(x=>COUPLES[x]),b=topOther(a),p=COUPLES[a];startFx();addAff(a,b,8*m);addAff(b,a,6*m);const out=Math.random()<.5;if(out){addAff(p,a,-8);bump(p,b,'rival',6)}const f=endFx();showEv({title:'Secret date',tag:'Villa text',text:`${nm(a)} and ${nm(b)} sneak off on a secret date.${out?` ${nm(p)} finds out before dinner.`:' Nobody finds out. Yet.'}`,lines:[[a,'date_banter',{themId:b}],[b,'date_spark',{themId:a}],out?[p,'jealous_confront',{themId:a,rivalId:b}]:null].filter(Boolean),log:{loc:'garden',text:`Secret date: ${nm(a)} and ${nm(b)}.`,ids:[a,b,p]},fx:f,buzz:.4});done();return}
 if(map==='swap'){const cs=shuffle(couplesList()).slice(0,2);if(cs.length<2){toast('Needs two couples.');return}startFx();addAff(cs[0][0],cs[1][1],5*m);addAff(cs[1][1],cs[0][0],5*m);addAff(cs[1][0],cs[0][1],5*m);addAff(cs[0][1],cs[1][0],5*m);const f=endFx();showEv({title:'Swap beds',tag:'Villa text',text:`${nm(cs[0][0])} shares a bed with ${nm(cs[1][1])}, and ${nm(cs[1][0])} with ${nm(cs[0][1])}. Nobody sleeps much.`,lines:[[cs[0][0],'bedroom_night',{}],[cs[1][1],'bedroom_night',{}],[cs[0][1],'partner_watch',{themId:cs[1][0],partnerId:cs[0][0]}]],log:{loc:'bedroom',text:'Bed swap night.',ids:[cs[0][0],cs[1][1]]},fx:f});done();return}
 if(map==='singles'){const sg=VIDS().filter(x=>!COUPLES[x]);if(!sg.length){toast('No single islanders right now. Kept in the cupboard.');return}const a=sg[0],b=VIDS().filter(x=>x!==a&&COUPLES[x]).sort((p,q)=>AFF[a][q]-AFF[a][p])[0];startFx();addAff(a,b,10);addAff(b,a,6);const f=endFx();showEv({title:'The singles choose',tag:'Villa text',text:`${nm(a)} gets to steal anyone for the night. They pick ${nm(b)}.`,lines:[[a,'steal',{themId:b}],[COUPLES[b],'partner_watch',{themId:a,partnerId:b}]],log:{loc:'firepit',text:`${nm(a)} steals ${nm(b)} for the night.`,ids:[a,b]},fx:f,buzz:.4});done();return}
 if(special(map))done();else toast('That can’t run right now. Kept in the cupboard.')}
const _rprops=renderProps;renderProps=function(){_rprops();const d=dealToday(),total=Object.values(SHELF).reduce((a,v)=>a+v.length,0),coll=Object.keys(ST.pc).length;
 const sub=document.querySelector('#pProps .sub');if(sub)sub.textContent=`Collection ${coll}/${total} · cupboard ${Object.values(ST.inv).reduce((a,b)=>a+b,0)} items · deal of the day refreshes at dawn`;
 document.querySelectorAll('#items .item').forEach(b=>{const i=+b.dataset.i,k=pkey(shelf,i),own=ST.inv[k]||0;const c=b.querySelector('.c');if(c)c.textContent=`${priceOf(shelf,i)} reels`;if(d.k===k)b.insertAdjacentHTML('afterbegin','<span class="deal">Deal</span>');if(own)b.insertAdjacentHTML('beforeend',`<span class="own">×${own}</span>`);if(ST.pc[k])b.insertAdjacentHTML('beforeend',`<span class="lvst">${'★'.repeat(plv(k))}${'☆'.repeat(3-plv(k))}</span>`);if(!ST.pc[k])b.classList.add('undisc')});
 const det=document.getElementById('detail');if(selItem===null||!det)return;const [n,c0,eff]=SHELF[shelf][selItem],k=pkey(shelf,selItem),c=priceOf(shelf,selItem),own=ST.inv[k]||0,lv=plv(k),u=ST.pm[k]||0;
 det.innerHTML=`<h4>${n}</h4><p>${eff}</p><p class="pmeta">Level ${lv} ${'★'.repeat(lv)}${'☆'.repeat(3-lv)} · effect ×${pmult(k).toFixed(2)} · ${lv<3?`${(lv===1?2:5)-u} more use${(lv===1?2:5)-u===1?'':'s'} to level up`:'mastered'}${c<c0?` · <b>deal: ${c} instead of ${c0}</b>`:''}</p><div class="pbtns"><button class="buy2" ${ST.reels<c?'disabled':''}>${ST.reels<c?`Need ${c-ST.reels} more reels`:`Buy · ${c} reels`}</button><button class="use2" ${own?'':'disabled'}>${own?`Use now (${own} owned)`:'Not owned'}</button></div>`;
 det.querySelector('.buy2').addEventListener('click',()=>{const cc=priceOf(shelf,selItem);if(ST.reels<cc)return;spend(cc);ST.inv[k]=(ST.inv[k]||0)+1;if(!ST.pc[k]){ST.pc[k]=VS.day;xp(5,'New prop')}else xp(3);BOARD.push({id:'b'+Date.now(),name:n,cost:cc,by:'You',st:'wait',r:{h:0,l:0,q:0}});toast(`${n.replace(/"/g,'')} is in your cupboard. Your co-producer can see it on the storyboard.`);checkAch();renderProps();schedulePush()});
 det.querySelector('.use2').addEventListener('click',()=>{if(!ST.inv[k])return;useProp(shelf,selItem)})};
/* ---------- edit bay: audience demands, combos, grade ---------- */
const DEMANDS=[
 ['rom2','Romantics want a Romantic clip in the first two.',()=>CLIPS.slice(0,2).some(c=>c.music==='Romantic')],
 ['endbig','Superfans want to end on a challenge, recoupling or event.',()=>{const e=endClip();return e&&['game','recouple','event'].includes(e.kind)}],
 ['com2','Comedy fans want at least two Comedy clips.',()=>CLIPS.filter(c=>c.music==='Comedy').length>=2],
 ['vill','Drama fans want somebody to get a villain edit.',()=>Object.values(ED.treat).includes('Villain')],
 ['conf','Everyone wants a confessional in tonight’s cut.',()=>CLIPS.some(c=>c.kind==='conf')],
 ['date','Romantics want a date in the episode.',()=>CLIPS.some(c=>c.kind==='date')],
 ['take','Superfans want one spicy take.',()=>CLIPS.some(c=>c.take===1)],
 ['calm','Keep it to three Tense clips or fewer.',()=>CLIPS.filter(c=>c.music==='Tense').length<=3]];
const endClip=()=>CLIPS.find(c=>c.id===ED.cliff)||CLIPS[CLIPS.length-1];
function todayDemands(){if(!ST.demands||ST.demands.day!==VS.day){const ks=shuffle(DEMANDS.map(d=>d[0])).slice(0,3);ST.demands={day:VS.day,ks}}return ST.demands.ks.map(k=>DEMANDS.find(d=>d[0]===k))}
function combos(){const out=[],o=CLIPS.filter(c=>c.id!==ED.cliff).concat(CLIPS.filter(c=>c.id===ED.cliff));for(let i=1;i<o.length;i++){if(o[i-1].music==='Romantic'&&o[i].music==='Tense'){out.push(['Whiplash','Romance straight into tension',.15]);break}}
 const e=endClip();if(e&&e.take===1&&['game','recouple','event'].includes(e.kind))out.push(['Cliffhanger','Ends on a spicy take of a big moment',.2]);if(new Set(CLIPS.map(c=>c.music)).size>=3)out.push(['Variety','Three or more moods in one episode',.1]);if(CLIPS.some(c=>c.kind==='conf')&&CLIPS.some(c=>c.kind==='date'))out.push(['Inside story','A date plus the confessional behind it',.1]);
 const T=ED.tools&&ED.tools.day===VS.day?ED.tools.list:[];T.forEach(t=>out.push([SHELF['Edit tools'][t.i][0],'Edit tool',[.3,.2,.15,.15,.2,.4][t.i]*t.m]));return out}
const gradeOf=r=>r>=9?'S':r>=8?'A':r>=7?'B':r>=6?'C':'D';
const _aud7=audience;audience=function(){const a=_aud7();if(!CLIPS[0]||!CLIPS[0].ids)return a;const met=todayDemands().filter(d=>{try{return d[2]()}catch(e){return false}}).length;const cb=combos().reduce((s,c)=>s+c[2],0);
 const fr=ST.frank&&ST.frank===VS.day-1?-.2:0;return {v:a.v,rating:Math.min(9.9,+a.rating+met*.25+cb+fr).toFixed(1),met,cb}};
const _re7=renderEdit;renderEdit=function(){_re7();if(!CLIPS[0]||!CLIPS[0].ids){const e=document.getElementById('edemand');if(e)e.remove();return}let el=document.getElementById('edemand');if(!el){el=document.createElement('div');el.id='edemand';el.className='edemand';document.getElementById('aud').before(el)}
 const ds=todayDemands(),cb=combos(),a=audience(),g=gradeOf(+a.rating);const pill=document.querySelector('#pEdit .pill.gold');if(pill)pill.innerHTML=`Projected <b id="rating">${a.rating}</b> · <span class="grade g${g}">${g}</span>`;
 el.innerHTML=`<div class="lab">Audience demands <span class="cnt">+0.25 each</span></div><div class="brief">${ds.map(d=>{let ok=false;try{ok=d[2]()}catch(e){}return `<p class="${ok?'ok':''}"><i>${ok?'✓':''}</i><span>${d[1]}</span></p>`}).join('')}</div>
 <div class="lab">Editing combos</div><div class="combos">${cb.length?cb.map(c=>`<span><b>${c[0]}</b> +${c[2].toFixed(2)}</span>`).join(''):'<span class="none">None yet. Try romance straight into tension, or ending on a spicy take.</span>'}</div>
 <p class="fine" style="color:#CDB9C8">Personal best: ${ST.best.rating?`${ST.best.rating.toFixed(1)} (${ST.best.grade})`:'none yet'}. S grade needs 9.0+.</p>`};
const _aep=afterEp;afterEp=function(){const was=ST.aired[VS.day];const a=audience(),r=+(ED.locked&&ED.rating?ED.rating:a.rating),g=gradeOf(r),met=a.met||0,all=met===3;_aep();if(was)return;
 const T=ED.tools&&ED.tools.day===VS.day?ED.tools.list:[];if(T.some(t=>t.i===5))ST.frank=VS.day;
 const pb=r>ST.best.rating;if(pb)ST.best={rating:r,grade:g};if(g==='S')stat('sGrades');if(all)stat('allDemands');const bonus=met*5;ST.reels+=bonus;syncReels();renderQueue();xp({S:40,A:30,B:20,C:12,D:8}[g],'Episode '+g);
 const crit=say(r>=7?'critic_good':'critic_bad',byId.mabel,{},true);const k=sheet.querySelector('.kpis');if(k)k.insertAdjacentHTML('afterend',`<div class="gradebox"><span class="grade big g${g}">${g}</span><div><b>${pb?'New personal best!':'Episode grade'}</b><p>“${crit}” <small>— The Sunset Review</small></p><small>Audience demands met: ${met}/3 · +${bonus} reels${T.some(t=>t.i===5)?' · the Frankenbite will be called out tomorrow':''}</small></div></div>`)};
renderLvl();
const _ap7=applyState;applyState=function(o){_ap7(o);renderLvl()};
