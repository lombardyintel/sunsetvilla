
/* ---------- systems 8: career, season track, audience, network office, season wrap ---------- */
const CK='sv_career_v1',SK='sv_season_v1';
const lsGet=k=>{try{return JSON.parse(localStorage.getItem(k)||'null')}catch(e){return null}};
const lsSet=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
const CAR=Object.assign({season:1,cxp:0,stars:0,starsTotal:0,lifetime:0,streak:0,maxStreak:0,freezes:1,up:{},active:{},awarded:{},hof:[],trophies:[],vault:[],decor:{},decorOff:{},titles:[],viewers:1.0,budget:142,walls:{},rank:1,ach:{},book:{seen:{},signed:{},gold:{}},scout:0,pm:{},pc:{},inv:{},pending:false,themePick:null},lsGet(CK)||{});
let carDirty=true;const saveCar=()=>{CAR.scout=ST.scout;lsSet(CK,CAR);carDirty=false;if(SYNC.db&&SYNC.me){clearTimeout(saveCar.t);saveCar.t=setTimeout(()=>{SYNC.db.doc('data/users/'+SYNC.me+'/career').set({s:JSON.stringify(CAR)}).catch(()=>{})},2500)}};
ST.ach=CAR.ach;ST.book=CAR.book;ST.scout=CAR.scout||0;ST.pm=CAR.pm;ST.pc=CAR.pc;ST.inv=CAR.inv;
ST.season=CAR.season;ST.seasonSteps=ST.seasonSteps||0;ST.trackClaimed=ST.trackClaimed||1;ST.aud=ST.aud||{viewers:Math.max(1,CAR.viewers||1),seg:[60,60,60,60],hist:[],down:0,notice:0};
setInterval(saveCar,5000);
const hasUp=k=>(CAR.active[k]||0);window.__hasUp=hasUp;
/* ---------- level curve: 30 levels, sized for three weeks of walking ---------- */
LVX.length=0;let acc=0;for(let n=0;n<30;n++){LVX.push(acc);acc+=40+18*(n+1)}
TITLES.length=0;TITLES.push(...['Runner','Runner','Logger','Logger','Production assistant','Production assistant','Junior producer','Junior producer','Producer','Producer','Story producer','Story producer','Senior producer','Senior producer','Supervising producer','Supervising producer','Co-executive producer','Co-executive producer','Executive producer','Executive producer','Showrunner','Showrunner','Showrunner','Network darling','Network darling','Network darling','Ratings royalty','Ratings royalty','Ratings royalty','Legend of the villa']);
/* ---------- decor: things you earn that live on the villa map ---------- */
const DECOR={
 flamingo:{n:'Flamingo float',s:()=>`<g transform="translate(196 366)"><ellipse rx="16" ry="6" fill="#FF8AB0"/><path d="M8 -2 q6 -16 -2 -18 q-6 0 -4 6" stroke="#FF8AB0" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="2" cy="-14" r="1.5" fill="#241A2E"/></g>`},
 swan:{n:'Swan float',s:()=>`<g transform="translate(70 380)"><ellipse rx="14" ry="5" fill="#FFF8EC"/><path d="M-8 -2 q-6 -14 2 -16 q5 0 3 5" stroke="#FFF8EC" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M-4 -16 l4 1" stroke="#F6A03B" stroke-width="2"/></g>`},
 neonheart:{n:'Neon heart sign',s:()=>`<g transform="translate(196 182)" class="neon"><path d="M0 10 C-16 -2 -10 -14 0 -6 C10 -14 16 -2 0 10Z" fill="none" stroke="#FF6F91" stroke-width="2.5"/></g>`},
 lanterns:{n:'Paper lanterns',s:()=>[60,110,160,230,280,330].map((x,i)=>`<g transform="translate(${x} ${128+(i%2)*6})"><line y1="-8" y2="0" stroke="#5E4A3A"/><ellipse rx="6" ry="8" cy="6" fill="${['#FF8A65','#F6C35B','#FF6F91'][i%3]}" opacity=".9"/></g>`).join('')},
 discoball:{n:'Disco ball',s:()=>`<g transform="translate(262 440)"><line y1="-26" y2="-8" stroke="#5E4A3A"/><circle r="8" fill="#D8D8E8"/><path d="M-8 0h16M0 -8v16M-6 -5l12 10M6 -5l-12 10" stroke="#fff" stroke-width=".8"/></g>`},
 surfboards:{n:'Surfboards',s:()=>`<g transform="translate(378 300)"><ellipse rx="4" ry="20" fill="#4CC3C0" transform="rotate(8)"/><ellipse cx="-8" rx="4" ry="18" fill="#F6C35B" transform="rotate(-6)"/></g>`},
 icecream:{n:'Ice-cream cart',s:()=>`<g transform="translate(360 486)"><rect x="-14" y="-10" width="28" height="16" rx="3" fill="#FFF4EA"/><circle cx="-8" cy="8" r="3" fill="#241A2E"/><circle cx="8" cy="8" r="3" fill="#241A2E"/><path d="M-16 -10 q16 -14 32 0z" fill="#FF8AB0"/></g>`},
 balloons:{n:'Heart balloons',s:()=>`<g transform="translate(336 176)">${[[-6,0,'#FF6F91'],[4,-6,'#FF8A65'],[10,2,'#F6C35B']].map(([x,y,c])=>`<path d="M${x} ${y+6} C${x-7} ${y} ${x-4} ${y-7} ${x} ${y-3} C${x+4} ${y-7} ${x+7} ${y} ${x} ${y+6}Z" fill="${c}"/><line x1="${x}" y1="${y+6}" x2="2" y2="26" stroke="#5E4A3A" stroke-width=".6"/>`).join('')}</g>`},
 umbrella:{n:'Beach umbrella',s:()=>`<g transform="translate(270 404)"><line y1="-18" y2="10" stroke="#5E4A3A" stroke-width="2"/><path d="M-20 -14 q20 -16 40 0z" fill="#FF8A65"/><path d="M-8 -14 q8 -14 16 0" fill="#FFF4EA"/></g>`},
 geraldhouse:{n:'Gerald’s house',s:()=>`<g transform="translate(28 540)"><rect x="-8" y="-8" width="16" height="10" fill="#C98B4E"/><path d="M-10 -8 l10 -8 l10 8z" fill="#C65D3B"/><rect x="-2" y="-4" width="4" height="6" fill="#3A2840"/></g>`},
 fairyarch:{n:'Fairy-light arch',s:()=>`<g transform="translate(110 470)"><path d="M-16 20 V0 Q0 -22 16 0 V20" stroke="#5E4A3A" stroke-width="2" fill="none"/>${[-16,-12,-6,0,6,12,16].map((x,i)=>`<circle cx="${x}" cy="${[0,-8,-15,-17,-15,-8,0][i]}" r="1.8" fill="#FFE7B0" class="twinkle" style="animation-delay:${i*.2}s"/>`).join('')}</g>`},
 palmlights:{n:'Palm lights',s:()=>`${[[34,240],[358,240]].map(([x,y])=>`<g transform="translate(${x} ${y})">${[0,1,2,3,4].map(i=>`<circle cx="${(i%2)*4-2}" cy="${-i*12}" r="2" fill="#FFE7B0" class="twinkle" style="animation-delay:${i*.3}s"/>`).join('')}</g>`).join('')}`},
 hottub:{n:'Hot tub',s:()=>`<g transform="translate(150 536)"><ellipse rx="28" ry="10" fill="#C98B4E"/><ellipse rx="23" ry="7" fill="#7FD6D3"/><path d="M-10 -10 q3 -6 0 -10 M2 -12 q3 -6 0 -10 M12 -10 q3 -6 0 -10" stroke="#fff" stroke-width="1.2" fill="none" opacity=".7"/></g>`},
 fountain:{n:'Villa fountain',s:()=>`<g transform="translate(320 532)"><ellipse rx="16" ry="5" fill="#E8CDB5"/><rect x="-2" y="-14" width="4" height="12" fill="#E8CDB5"/><path d="M0 -14 q-8 2 -10 10 M0 -14 q8 2 10 10" stroke="#7FD6D3" stroke-width="1.5" fill="none"/></g>`},
 trophy:{n:'Champion statue',s:()=>`<g transform="translate(60 300)"><rect x="-6" y="0" width="12" height="6" fill="#8A5A3C"/><path d="M-6 -12 h12 l-2 10 h-8z" fill="#E9B44C"/><path d="M-6 -10 q-5 0 -4 4 M6 -10 q5 0 4 4" stroke="#E9B44C" fill="none"/></g>`},
 goldtrim:{n:'Golden villa trim',s:()=>`<path d="M60 152 L196 112 L332 152" stroke="#E9B44C" stroke-width="4" fill="none" opacity=".95"/>`},
 hofstar:{n:'Hall of Fame star',s:()=>`<g transform="translate(196 92)"><path d="M0 -10 L3 -3 L10 -3 L4 2 L6 9 L0 5 L-6 9 L-4 2 L-10 -3 L-3 -3Z" fill="#E9B44C" class="neon"/></g>`}
};
const SETS=[['flamingo','neonheart','swan'],['lanterns','discoball','surfboards'],['icecream','balloons','umbrella'],['geraldhouse','fairyarch','palmlights']];
const setFor=s=>SETS[(s-1)%SETS.length];
const u0=window.__VX.under;window.__VX.under=function(){return Object.keys(CAR.decor).filter(k=>DECOR[k]&&!CAR.decorOff[k]).map(k=>DECOR[k].s()).join('')+u0.call(this)};
function giveDecor(id){if(CAR.decor[id])return false;CAR.decor[id]=CAR.season;saveCar();drawVilla();return true}
/* ---------- season track ---------- */
const PROPCYCLE=[['Texts',0],['Wardrobe',2],['Dates',0],['Edit tools',2],['Events',2],['Wardrobe',0],['Texts',1],['Dates',1],['Edit tools',3]];
function trackReward(l,s){if(l%10===0)return {t:'stars',n:{10:3,20:5,30:8}[l],d:`${{10:3,20:5,30:8}[l]} Network Stars`};
 const set=setFor(s);if([6,16,26].includes(l)){const id=set[[6,16,26].indexOf(l)];return {t:'decor',id,d:`${DECOR[id].n} (Season ${s} exclusive)`}}
 if(l%5===0){const tt={5:'Rising producer',15:'Fan-favourite producer',25:'Ratings machine'}[l];return {t:'title',id:tt,d:`Title: “${tt}”`}}
 if([8,22].includes(l))return {t:'freeze',d:'Streak freeze'};
 if(l%3===0){const [sh,i]=PROPCYCLE[(l/3+s)%PROPCYCLE.length];return {t:'prop',k:sh+':'+i,d:`Prop: ${SHELF[sh][i][0].replace(/"/g,'')}`}}
 return {t:'reels',n:10+l*2,d:`${10+l*2} reels`}}
function grantTrack(l){const r=trackReward(l,ST.season);if(r.t==='stars'){CAR.stars+=r.n;CAR.starsTotal+=r.n}if(r.t==='decor'&&!giveDecor(r.id)){ST.reels+=40;r.d+=' (already owned: +40 reels)'}if(r.t==='title'&&!CAR.titles.includes(r.id))CAR.titles.push(r.id);if(r.t==='freeze')CAR.freezes++;if(r.t==='prop')ST.inv[r.k]=(ST.inv[r.k]||0)+1;if(r.t==='reels')ST.reels+=r.n;syncReels();renderQueue();saveCar();return r}
ST.trackLast={};
const _xp8=xp;xp=function(n,why){const before=lvlOf(ST.xp);_xp8(n,why);if(SYNC.applying)return;CAR.cxp+=Math.round(n||0);const after=lvlOf(ST.xp);for(let l=Math.max(before+1,ST.trackClaimed+1);l<=after;l++){ST.trackLast[l]=grantTrack(l);ST.trackClaimed=l}checkRank()};window.__xp=xp;
const _lu=levelUp;levelUp=function(l,r){_lu(l,r);const t=ST.trackLast[l];const pb=document.getElementById('payoff');if(t&&pb)pb.insertAdjacentHTML('beforeend',`<p class="trk"><b>Season track tier ${l}:</b> ${t.d}</p>${l<30?`<p class="fine" style="color:#CDB9C8">Next: ${trackReward(l+1,ST.season).d}</p>`:''}`)};
/* ---------- career rank ---------- */
const RANKS=[[0,'Runner'],[1500,'Logger'],[3500,'Assistant producer'],[6000,'Field producer'],[9000,'Segment producer'],[12500,'Story producer'],[16500,'Senior story producer'],[21000,'Supervising producer'],[26000,'Co-executive producer'],[31500,'Executive producer'],[37500,'Showrunner'],[44000,'Network VP'],[51000,'Head of Unscripted'],[58500,'Network President'],[66500,'Hall of Famer']];
const rankOf=x=>{let r=1;RANKS.forEach((k,i)=>{if(x>=k[0])r=i+1});return r};
const RANKGIFT={3:['decor','trophy'],6:['freeze',2],9:['decor','fountain'],12:['stars',10],15:['decor','hofstar']};
function checkRank(){const r=rankOf(CAR.cxp);if(r>CAR.rank){for(let k=CAR.rank+1;k<=r;k++){CAR.stars+=2;CAR.starsTotal+=2;const g=RANKGIFT[k];let extra='';if(g){if(g[0]==='decor'){giveDecor(g[1]);extra=` and the ${DECOR[g[1]].n} for your villa`}if(g[0]==='freeze'){CAR.freezes+=g[1];extra=' and 2 streak freezes'}if(g[0]==='stars'){CAR.stars+=g[1];CAR.starsTotal+=g[1];extra=` and ${g[1]} bonus stars`}}
  setTimeout(()=>toast(`Career rank up: ${RANKS[k-1][1]}. +2 Network Stars${extra}.`),1200)}CAR.rank=r;saveCar()}}
/* ---------- lifetime walls: unlock with real walking, over many seasons ---------- */
const WALLS=[
 {id:'moon',at:150000,n:'Moonlit Isles casting region',d:'A night-time region with more golden-hour finds.'},
 {id:'island',at:400000,n:'Private island date',d:'The season-defining date.'},
 {id:'tempt',at:750000,n:'Temptation week',d:'The second-villa twist and its arrivals crew.'},
 {id:'star',at:1200000,n:'Star bombshell',d:'A rare, famous arrival who turns every head.'},
 {id:'legend',at:2000000,n:'Legend status',d:'Golden villa trim and the “Walked the world” title.'}];
const lifeNow=()=>CAR.lifetime+ST.steps.me+ST.steps.them;
function checkWalls(){WALLS.forEach(w=>{if(!CAR.walls[w.id]&&lifeNow()>=w.at){CAR.walls[w.id]=CAR.season;if(w.id==='legend'){giveDecor('goldtrim');CAR.titles.push('Walked the world')}applyWalls();saveCar();const pb=document.getElementById('payoff');pb.innerHTML=`<button class="x" aria-label="Close">×</button><div class="evtag">Walking milestone · ${(w.at/1000).toLocaleString('en-US')}k steps together</div><h3>Unlocked: ${w.n}</h3><p>${w.d}</p><p class="fine" style="color:#CDB9C8">This is permanent, for every season from now on.</p>`;pb.classList.add('on');pb.querySelector('.x').onclick=()=>pb.classList.remove('on')}})}
function applyWalls(){if(CAR.walls.moon)CREG['Moonlit Isles']={stops:['Moonlit beach','Lantern festival','Night ferry','Glow lagoon'],sp:['arcticfox','otter','cat','deer','wolf'],sky:'#2E2A5A',ground:'#3B3560',acc:'#F6C35B'}}
applyWalls();
const etaSeasons=rem=>Math.max(1,Math.ceil(rem/(12000*21)));
/* ---------- streaks and the end of each day ---------- */
const STREAKR={3:['reels',20],7:['stars',1],14:['stars',2],21:['stars',3],30:['stars',4],45:['stars',5],60:['stars',6],90:['stars',10]};
function dayEnd(me,them){const tot=me+them;CAR.lifetime+=tot;ST.seasonSteps+=tot;
 if(me>=5000){CAR.streak++;CAR.maxStreak=Math.max(CAR.maxStreak,CAR.streak);const r=STREAKR[CAR.streak];if(r){if(r[0]==='reels'){ST.reels+=r[1];syncReels()}else{CAR.stars+=r[1];CAR.starsTotal+=r[1]}setTimeout(()=>toast(`${CAR.streak}-day walking streak! +${r[1]} ${r[0]==='reels'?'reels':'Network Stars'}`),2200)}}
 else if(CAR.streak>0){if(CAR.freezes>0){CAR.freezes--;setTimeout(()=>toast(`Streak freeze used. Your ${CAR.streak}-day streak is safe.`),2200)}else{setTimeout(()=>toast(`Walking streak ended at ${CAR.streak} days. Under 5,000 steps yesterday.`),2200);CAR.streak=0}}
 xp(Math.round(tot/100),'Yesterday’s walking');checkWalls();saveCar()}
document.addEventListener('click',e=>{if(e.target.closest('#timeCtl')&&VS.t===3)dayEnd(ST.steps.me,ST.steps.them)},true);
/* ---------- season themes: every season plays a little differently ---------- */
const THEMES=[
 {id:'love',n:'Summer of Love',d:'Affection grows 15% faster. Romantics are easier to please.'},
 {id:'chaos',n:'Chaos Season',d:'More random events. Buzz counts 25% more.'},
 {id:'heat',n:'Heatwave Summer',d:'Walking earns 20% more reels.'},
 {id:'allstar',n:'All-Stars',d:'Extra bombshell nights on days 11 and 17. Your vault scouts are favourites.'},
 {id:'golden',n:'Golden Hour',d:'Every episode gets +0.2. Golden-hour scouts appear more often.'}];
const theme=THEMES.find(t=>t.id===CAR.themePick&&hasUp('chair'))||THEMES[(ST.season-1)%THEMES.length];ST.theme=theme.id;
if(theme.id==='love'){const a=addAff;addAff=function(x,y,d){a(x,y,d>0?d*1.15:d)}}
if(theme.id==='chaos'){const a=addBuzz;addBuzz=function(x){a(x*1.25)};const f=fireEvent;fireEvent=function(force){f(force||Math.random()<.3)}}
if(theme.id==='heat'){const s=stepReels;stepReels=function(){return Math.floor(s()*1.2)}}
if(theme.id==='allstar'){BEATS[11]='bomb';BEATS[17]='bomb';BEATL.bomb='Bombshell arrives'}
/* ---------- the audience: they can love you or leave you ---------- */
const SEGN=['Romantics','Drama fans','Comedy fans','Superfans'],SEGC=['#FF6F91','#E5484D','#F6C35B','#9B7BD4'];
const REQK=[['date','a date'],['event','a big villa event'],['game','a challenge'],['recouple','a recoupling or a confessional']];
const REQOK=[l=>l.meta.kind==='date',l=>l.meta.kind==='event',l=>l.meta.kind==='game',l=>l.meta.kind==='recouple'||l.meta.kind==='conf'];
function fanReq(){if(!ST.req||ST.req.day!==VS.day){const s=ST.aud.seg,i=s.indexOf(Math.min(...s));ST.req={day:VS.day,i}}return ST.req}
const reqMet=()=>{const r=fanReq();return VS.log.some(l=>l.meta&&REQOK[r.i](l))};
const audLvl={focus:6,teaser:10,sponsor:14};
function audSim(v,r){const A=ST.aud,seg=A.seg.slice(),R=fanReq(),loyal=hasUp('fanclub');if(reqMet())seg[R.i]+=12;if(ED.sponsor===VS.day)seg[3]-=8;if(theme.id==='love')seg[0]+=4;
 for(let i=0;i<4;i++){let nv=Math.round(seg[i]*.55+v[i]*.45);if(loyal&&nv<seg[i])nv=Math.round((nv+seg[i])/2);seg[i]=clamp(nv,0,100)}
 const avg=seg.reduce((a,b)=>a+b,0)/4;let pct=(avg-55)/3+(r-7)*2.5;const leaving=[],loving=[];seg.forEach((x,i)=>{if(x<35){pct-=4;leaving.push(i)}if(x>=80){pct+=2;loving.push(i)}});
 if(ED.teaser&&ED.teaser.day===VS.day)pct+=ED.teaser.id===ED.cliff?4:1.5;pct=clamp(pct,-18,18);return {seg,pct,viewers:+clamp(A.viewers*(1+pct/100),.2,30).toFixed(2),leaving,loving}}
const _aep8=afterEp;afterEp=function(){const was=ST.aired[VS.day];const a=audience(),r=+(ED.locked&&ED.rating?ED.rating:a.rating);_aep8();if(was)return;
 const g=gradeOf(r);if(g==='A'||g==='S')stat('aGrades');const A=ST.aud,res=audSim(a.v,r),old=A.viewers;A.seg=res.seg;A.viewers=res.viewers;A.hist.push({d:VS.day,v:res.viewers,r});
 let spons='';if(ED.sponsor===VS.day){ST.reels+=25;syncReels();renderQueue();spons=' · sponsor paid 25 reels'}
 A.down=res.pct<0?A.down+1:0;let warn='';if(A.down>=3&&A.notice<VS.day){A.notice=VS.day+3;warn=`<div class="notice"><b>The network has put the show on notice.</b> Viewers have fallen three episodes running. Your daily budget is cut by 30% for three days. Win them back.</div>`}
 if(r>=8&&A.hist.slice(-3).length===3&&A.hist.slice(-3).every(h=>h.r>=8)&&!A.hot){A.hot=VS.day;CAR.stars+=1;CAR.starsTotal+=1;warn+=`<div class="notice good"><b>Three hits in a row.</b> The network sends a bonus: +1 Network Star.</div>`}
 const leave=res.leaving.map(i=>`<p class="seg-msg dn">${SEGN[i]} are switching off.</p>`).join('')+res.loving.map(i=>`<p class="seg-msg up">${SEGN[i]} are obsessed.</p>`).join('');
 const box=`<div class="audbox"><div class="audtop"><b>${A.viewers.toFixed(2)}M viewers</b><span class="${res.pct>=0?'upc':'dnc'}">${res.pct>=0?'▲':'▼'} ${Math.abs(res.pct).toFixed(1)}%</span></div>${A.seg.map((x,i)=>`<div class="ar2"><span>${SEGN[i]}</span><i><b style="width:${x}%;background:${SEGC[i]}"></b></i><span>${x}</span></div>`).join('')}${leave}<p class="fine">${reqMet()?`Fan request met: ${SEGN[fanReq().i]} got ${REQK[fanReq().i][1]}.`:`Fan request missed: ${SEGN[fanReq().i]} wanted ${REQK[fanReq().i][1]}.`}${spons}</p></div>${warn}`;
 const gb=sheet.querySelector('.gradebox')||sheet.querySelector('.kpis');if(gb)gb.insertAdjacentHTML('afterend',box);
 const angry=res.seg.map((x,i)=>[x,i]).filter(([x])=>x<45);const posts=sheet.querySelector('.posts');if(angry.length&&posts){angry.slice(0,2).forEach(()=>{const id=pickV();posts.insertAdjacentHTML('afterbegin',`<div class="post angry"><b>@${['notwatchinganymore','switchingoff_','villafan_no_more','bored_on_sofa'][Math.floor(Math.random()*4)]}</b><p>${say('fan_angry',byId[id],{},true)}</p><small>♥ ${(Math.random()*4+1).toFixed(1)}k</small></div>`)})}
 CAR.viewers=A.viewers;xp(Math.max(0,Math.round(res.pct*2)),'Audience growth');saveCar()};
/* daily network budget and fan request */
document.getElementById('timeCtl').addEventListener('click',()=>{if(VS.t!==0)return;const A=ST.aud,cut=A.notice>=VS.day,b=Math.round(A.viewers*12*(cut?.7:1)*(hasUp('adsales')?1.2:1));ST.reels+=b;syncReels();renderQueue();const r=fanReq();setTimeout(()=>toast(`Network budget: +${b} reels (${A.viewers.toFixed(2)}M viewers${cut?', on notice':''}). Fans today: ${SEGN[r.i]} want ${REQK[r.i][1]}.`),2600)});
/* edit bay: audience desk with tools that unlock as you level */
const _re8=renderEdit;renderEdit=function(){_re8();if(!CLIPS[0]||!CLIPS[0].ids){const e=document.getElementById('auddesk');if(e)e.remove();return}let el=document.getElementById('auddesk');if(!el){el=document.createElement('div');el.id='auddesk';el.className='edemand';const d=document.getElementById('edemand');(d||document.getElementById('aud')).before(el)}
 const A=ST.aud,l=lvlOf(ST.xp),R=fanReq(),lock=k=>l<audLvl[k];
 el.innerHTML=`<div class="lab">Your audience <span class="cnt">${A.viewers.toFixed(2)}M viewers</span></div>${A.seg.map((x,i)=>`<div class="ar2"><span>${SEGN[i]}</span><i><b style="width:${x}%;background:${SEGC[i]}"></b></i><span>${x}</span></div>`).join('')}
 <p class="fine" style="color:#CDB9C8">Fan request: <b style="color:#FFF1E6">${SEGN[R.i]} want ${REQK[R.i][1]}</b> ${reqMet()?'✓ filmed today':'— not filmed yet'}${A.notice>=VS.day?' · <b style="color:#FF8A8A">on notice</b>':''}</p>
 <div class="lab">Audience tools</div><div class="atools">
 <button data-at="focus" ${lock('focus')?'disabled':''}>${lock('focus')?`🔒 Focus group · season Lv ${audLvl.focus}`:'Test screening · 8 reels'}</button>
 <button data-at="teaser" ${lock('teaser')||(ED.teaser&&ED.teaser.day===VS.day)?'disabled':''}>${lock('teaser')?`🔒 Social teaser · season Lv ${audLvl.teaser}`:ED.teaser&&ED.teaser.day===VS.day?'Teaser posted':'Post a teaser clip'}</button>
 <button data-at="sponsor" ${lock('sponsor')?'disabled':''} class="${ED.sponsor===VS.day?'on':''}">${lock('sponsor')?`🔒 Sponsor slot · season Lv ${audLvl.sponsor}`:ED.sponsor===VS.day?'Sponsor on: +25 reels, Superfans −8':'Take a sponsor: +25 reels'}</button></div><div id="atout"></div>`;
 el.querySelectorAll('[data-at]').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();const k=b.dataset.at,out=document.getElementById('atout');
  if(k==='focus'){if(ST.reels<8){toast('Not enough reels.');return}spend(8);const a=audience(),sim=audSim(a.v,+a.rating);out.innerHTML=`<div class="focus"><b>Test screening predicts ${sim.pct>=0?'+':''}${sim.pct.toFixed(1)}% viewers</b>${sim.seg.map((x,i)=>`<span>${SEGN[i]} ${x-A.seg[i]>=0?'+':''}${x-A.seg[i]}</span>`).join('')}${sim.leaving.length?`<em>Warning: ${sim.leaving.map(i=>SEGN[i]).join(', ')} would start leaving.</em>`:''}</div>`;xp(3)}
  if(k==='teaser'){out.innerHTML=`<div class="focus"><b>Which clip goes on social?</b>${CLIPS.map(c=>`<button data-tz="${c.id}">${c.t}</button>`).join('')}<em>Tease your cliffhanger for the biggest bump.</em></div>`;out.querySelectorAll('[data-tz]').forEach(z=>z.addEventListener('click',ev=>{ev.stopPropagation();ED.teaser={day:VS.day,id:z.dataset.tz};toast(z.dataset.tz===ED.cliff?'Teaser posted. It’s tonight’s cliffhanger: big bump.':'Teaser posted. Small bump unless it’s the ending.');xp(3);renderEdit()}))}
  if(k==='sponsor'){ED.sponsor=ED.sponsor===VS.day?null:VS.day;renderEdit()}}))};
/* ---------- season goals ---------- */
function seasonGoals(){const s=ST.season,G=[
 ['lvl',`Reach season level ${Math.min(24,12+s)}`,()=>lvlOf(ST.xp),Math.min(24,12+s)],
 ['grades',`Air ${2+Math.floor(s/2)} episodes graded A or S`,()=>ST.stats.aGrades||0,2+Math.floor(s/2)],
 ['arcs',`Pay off ${s>=3?3:2} storylines`,()=>Object.keys(ST.done).length,s>=3?3:2],
 ['calls',`Call ${4+s} recoupling picks right`,()=>ST.duel.me,4+s],
 ['games',`Produce ${5+Math.min(s,3)} challenges`,()=>(ST.gamesPlayed||[]).length,5+Math.min(s,3)],
 ['steps',`Walk ${150+20*s}k steps together this season`,()=>Math.floor((ST.seasonSteps+ST.steps.me+ST.steps.them)/1000),150+20*s],
 ['streak',`Hold a ${5+s}-day walking streak`,()=>CAR.streak,5+s],
 ['viewers',`Reach ${(1.5+.5*s).toFixed(1)}M viewers`,()=>ST.aud.viewers,+(1.5+.5*s).toFixed(1)],
 ['signs',`Sign ${2+Math.floor(s/2)} scouts`,()=>ST.stats.signs||0,2+Math.floor(s/2)],
 ['iv',`Run ${8+s*2} interviews`,()=>ST.stats.iv||0,8+s*2]];
 const r=rng(s*97+13);const pick=G.map(g=>[r(),g]).sort((a,b)=>a[0]-b[0]).slice(0,6).map(x=>x[1]);return pick}
/* ---------- the network office: permanent upgrades, opened season by season ---------- */
const OFFICE=[
 {tier:1,k:'budget',n:'Bigger budget',d:'Start each season with +40 reels per level.',max:3,cost:[8,12,16]},
 {tier:1,k:'head',n:'Head start',d:'Start each season one producer level higher per level.',max:3,cost:[10,15,20]},
 {tier:1,k:'vault',n:'Talent vault',d:'Keep one more signed scout between seasons per level.',max:3,cost:[8,12,18]},
 {tier:1,k:'edit',n:'Edit suite',d:'Free slow motion loaded into every episode.',max:1,cost:[10]},
 {tier:2,k:'scout',n:'Star scout',d:'One guaranteed golden-hour candidate a day in the Casting Van.',max:1,cost:[15]},
 {tier:2,k:'chair',n:'Bigger interview chair',d:'+1 interview question per level.',max:2,cost:[12,18]},
 {tier:2,k:'twist',n:'Twist desk',d:'Twist cards cost 25% less.',max:1,cost:[15]},
 {tier:2,k:'licence',n:'Premium props licence',d:'Unlocks every Premium prop (50+ reels).',max:1,cost:[20]},
 {tier:2,k:'adsales',n:'Ad sales team',d:'Daily network budget +20%.',max:1,cost:[15]},
 {tier:3,k:'karaoke',n:'New challenge: Karaoke Night',d:'Duets, power ballads, wandering eyes.',max:1,cost:[18]},
 {tier:3,k:'speed',n:'New challenge: Speed Dating',d:'Three two-minute dates each. Feelings get shuffled.',max:1,cost:[18]},
 {tier:3,k:'insure',n:'Streak insurance',d:'+2 streak freezes at the start of every season.',max:2,cost:[12,18]},
 {tier:3,k:'fanclub',n:'Official fan club',d:'Audience segments lose loyalty half as fast.',max:1,cost:[15]},
 {tier:3,k:'marketing',n:'Marketing team',d:'Keep 90% of your audience between seasons, instead of 75%.',max:1,cost:[15]},
 {tier:4,k:'hottub',n:'Villa expansion: hot tub',d:'Adds a hot tub to the villa and a Hot tub date prop.',max:1,cost:[30]},
 {tier:4,k:'exec',n:'Executive edit',d:'Audience demands are worth +0.35 instead of +0.25.',max:1,cost:[25]},
 {tier:4,k:'allstar',n:'All-Star returns',d:'Your best vault scout arrives on day 7 as an All-Star with a fanbase.',max:1,cost:[25]},
 {tier:5,k:'chairman',n:'Showrunner’s chair',d:'Choose each season’s theme yourself.',max:1,cost:[35]},
 {tier:5,k:'golden',n:'Golden villa',d:'Golden trim, Hall of Fame star, and the “Network Icon” title.',max:1,cost:[40]}];
const TIERGATE={1:1,2:2,3:3,4:5,5:7};
const openSeason=()=>CAR.season+(CAR.awarded[CAR.season]?1:0);
/* apply active upgrades for this season */
if(hasUp('edit')){const f=()=>{ED.tools={day:VS.day,list:[{i:2,m:1}]}};f();document.getElementById('timeCtl').addEventListener('click',()=>{if(VS.t===0)f()})}
if(hasUp('chair')){const o=openInterview;openInterview=function(id){o(id);if(VI.id===id){VI.left+=hasUp('chair');renderIV('',`Bigger chair: ${VI.left} questions.`)}}}
if(hasUp('twist'))TWISTS.forEach(t=>t[2]=Math.round(t[2]*.75));
if(hasUp('exec')){/* demand value */}
window.__demandVal=()=>hasUp('exec')?.35:.25;
if(hasUp('scout')){const o=arriveStop;arriveStop=function(){o();if(ST.scoutDay!==VS.day&&CS2.cands&&CS2.cands.length&&!CS2.cands.some(c=>c.rare)){ST.scoutDay=VS.day;CS2.cands[1]=makeCand(CS2.region,{gold:true});renderCast();toast('Star scout: a golden-hour candidate is here.')}}}
if(hasUp('hottub')){giveDecor('hottub');SHELF.Dates.push(['Hot tub date',18,'Steamy, giggly and very public.']);DLOC.push('yacht');DAFF.push(11);DSTEPS.push(0)}
if(hasUp('golden')){giveDecor('goldtrim');giveDecor('hofstar');if(!CAR.titles.includes('Network Icon'))CAR.titles.push('Network Icon')}
/* ---------- locks on props ---------- */
const PLOCK={'Dates:5':['island',null],'Arrivals:4':['tempt',null],'Events:5':['tempt',null],'Arrivals:3':['star',null]};
function propLock(s,i){const k=s+':'+i,w=PLOCK[k];if(w&&!CAR.walls[w[0]]){const W=WALLS.find(x=>x.id===w[0]);return `Walk ${(W.at/1000)}k lifetime steps together (${Math.floor(lifeNow()/1000)}k so far)`}if(SHELF[s][i][1]>=50&&!hasUp('licence'))return 'Needs the Premium props licence (Network Office, Season 2+)';return null}
const _rp8=renderProps;renderProps=function(){_rp8();document.querySelectorAll('#items .item').forEach(b=>{const l=propLock(shelf,+b.dataset.i);if(l){b.classList.add('locked');b.insertAdjacentHTML('beforeend','<span class="lk">🔒</span>')}});
 if(selItem!==null){const l=propLock(shelf,selItem),pb=document.querySelector('#detail .pbtns');if(l&&pb)pb.outerHTML=`<div class="lockmsg">🔒 ${l}</div>`}};
/* casting: show the walking wall on the locked region */
const _rc8=renderCast;renderCast=function(){_rc8();const b=document.querySelector('[data-reg="Moonlit Isles"]');if(b&&!CAR.walls.moon){b.textContent=`Moonlit Isles · ${Math.floor(lifeNow()/1000)}k/150k steps`;b.title='Walk 150,000 lifetime steps together to unlock'}};
/* ---------- unlockable challenges ---------- */
GAMES.karaoke={name:'Karaoke Night',col:'#C084FC',prop:'dance',kind:'Couples',req:'karaoke',rules:'Couples pick a song and perform for the villa. Applause decides the winner.',reward:'Winners get the hideaway.',
 brief(){return {choices:[{key:'mix',label:'Who sings with who?',opts:[['couples','Couples sing together'],['mix','Mix it up: everyone duets with someone new']]}],predict:{label:'Which duet wins?',opts:couplesList().map(p=>[ck(p),cn(p)])}}},
 play(x){const cs=couplesList(),R=[],sc={};cs.forEach(([a,b])=>{const mix=x.choice.mix==='mix';const o=mix?(VIDS().filter(i=>i!==a&&i!==b).sort((p,q)=>AFF[a][q]-AFF[a][p])[0]||b):b;const s=Math.round(4+Math.random()*4+(byId[a].vibe==='Life of the party'?1:0)+mutual(a,o)/40);sc[ck([a,b])]=Math.min(10,s);
  if(mix){addAff(a,o,5);addAff(o,a,4);addAff(b,a,-4)}else{addAff(a,b,4);addAff(b,a,4)}const j=pickV(i=>![a,b,o].includes(i));
  R.push({t:`${nm(a)} and ${nm(o)}`,text:`${Math.min(10,s)}/10 from the villa.${mix?` ${nm(b)} watches from the sofa.`:''}`,hl:[a,o],lines:[L(a,'gm_karaoke',{themId:o}),L(o,'gm_karaoke',{themId:a}),L(j,'gm_karaoke_react'),mix?L(b,'partner_watch',{themId:o,partnerId:a}):null].filter(Boolean),board:Object.fromEntries(Object.entries(sc).map(([k,v])=>[cn(k.split('|')),v]))})});
  const wk=Object.keys(sc).sort((a,b)=>sc[b]-sc[a])[0],w=wk.split('|');return {rounds:R,winKey:wk,apply(){ST.hideaway={day:VS.day,pair:w}},result:{text:`${cn(w)} bring the house down and take the hideaway.`,hl:w,lines:[L(w[0],'gm_win'),L(w[1],'couple_cute',{themId:w[0]})]}}}};
GAMES.speed={name:'Speed Dating',col:'#FF9EB5',prop:'podium',kind:'Everyone',req:'speed',rules:'Every coupled islander goes on three two-minute dates with people who aren’t their partner, then names their best date.',reward:'Shake-up guaranteed. Best date pairs get a second date.',
 brief(){return {choices:[{key:'watch',label:'Can partners watch?',opts:[['no','Behind closed doors'],['yes','Partners watch from the terrace']]}],predict:{label:'Will anyone say their best date beat their partner?',opts:[['yes','Yes, someone strays'],['no','Everyone stays loyal']]}}},
 play(x){const R=[],sw=[];shuffle(VIDS().filter(i=>COUPLES[i])).slice(0,5).forEach(a=>{const p=COUPLES[a],ds=shuffle(VIDS().filter(i=>i!==a&&i!==p)).slice(0,3);ds.forEach(d=>{addAff(a,d,Math.random()*6);addAff(d,a,Math.random()*5)});const best=ds.sort((u,v)=>AFF[a][v]-AFF[a][u])[0];const strays=AFF[a][best]>AFF[a][p];if(strays){sw.push(a);if(x.choice.watch==='yes')addAff(p,a,-8)}
  R.push({t:`${nm(a)}'s dates`,text:`${ds.map(nm).join(', ')}. Best date: ${nm(best)}.${strays?` Better than ${nm(p)}? ${nm(a)} hesitates.`:''}`,hl:[a,best],lines:[L(a,'gm_speed',{themId:best,partnerId:p}),L(a,'gm_speed_best',{themId:best,partnerId:p}),strays&&x.choice.watch==='yes'?L(p,'partner_watch',{themId:best,partnerId:a}):null].filter(Boolean),board:null})});
  addBuzz(.4);return {rounds:R,winKey:sw.length?'yes':'no',apply(){},result:{text:sw.length?`${sw.map(nm).join(' and ')} named someone who could beat their partner. The next recoupling just got harder to call.`:'Everyone came back to their partner. For now.',hl:sw,lines:sw.length?[L(sw[0],'lean_confess',{themId:topOther(sw[0]),partnerId:COUPLES[sw[0]]})]:[L(pickV(),'gm_cheer')]}}}};
/* ---------- talent vault: your signings carry between seasons ---------- */
const vaultCap=()=>2+hasUp('vault');
CAR.vault.forEach((v,i)=>{if(byId[v.id])return;if(String(v.sp).startsWith('g_')&&!SP[v.sp])SP[v.sp]=Object.assign({},SP[v.sp.slice(2)],{fur:'#E9B44C',dark:'#8A5A12'});const c=Object.assign({},v,{slot:'Vault',bomb:true});c.codes=[c.heart,c.temper,c.game,c.vibe].map(t=>CODE[t]);CAST.push(c);byId[c.id]=c});
const _eb8=enterBomb;enterBomb=function(id){const c=byId[id],star=c&&c.allStar;const out=_eb8(id);if(star){addBuzz(.5);ST.aud.seg[3]=Math.min(100,ST.aud.seg[3]+10);toast(`All-Star ${c.name} is back. Superfans are thrilled.`)}return out};
/* ---------- persistence: the season survives closing the app ---------- */
const _snap8=snapState;snapState=function(){const o=_snap8();['xp','stats','best','season','seasonSteps','aud','req','fin','demands','deal','theme','scoutDay'].forEach(k=>o.st[k]=ST[k]);o.cast=CAST.filter(c=>/^(cand|vault_)/.test(String(c.id)));return o};
const _ap8=applyState;applyState=function(o){const d0=VS.day,carry={ach:ST.ach,book:ST.book,inv:ST.inv,pm:ST.pm,pc:ST.pc,scout:ST.scout,trackClaimed:ST.trackClaimed};_ap8(o);Object.assign(ST,carry);if(window.__resumeTC){ST.trackClaimed=window.__resumeTC;window.__resumeTC=0}if(!ST.aud)ST.aud={viewers:1,seg:[60,60,60,60],hist:[],down:0,notice:0};if(SYNC.on&&VS.day>d0&&SYNC.started){dayEnd(ST.steps.me,ST.steps.them);ST.steps={me:0,them:0,tog:0,claimed:0,ms:{}};renderSteps()}while(ST.trackClaimed<lvlOf(ST.xp)){ST.trackClaimed++;grantTrack(ST.trackClaimed)}renderLvl()};
setInterval(()=>{if(!SYNC.on)lsSet(SK,{season:ST.season,at:Date.now(),data:snapState(),steps:ST.steps,tc:ST.trackClaimed})},5000);
const _or=onRemote;onRemote=function(d){let rs=1;try{rs=(JSON.parse(d.s).st||{}).season||1}catch(e){}if(rs<ST.season){SYNC.last='';setTimeout(push,500);return}if(rs>CAR.season){CAR.season=rs;CAR.active=JSON.parse(JSON.stringify(CAR.up));saveCar()}_or(d)};
/* ---------- the season wrap: what you actually get ---------- */
const RENEW=[[0,'Renewed on probation','Bronze',120,0],[95,'Renewed','Silver',150,1],[120,'Renewed for primetime','Gold',190,2],[145,'Renewed as a flagship show','Platinum',240,3],[170,'The network’s number one show','Diamond',300,4]];
const SRANKS=[[0,'D',2],[70,'C',4],[95,'B',7],[120,'A',10],[145,'S',14],[170,'S+',18]];
const _wp=wrapParty;wrapParty=function(F,pick,pPick){ST.fin={w:[F.fin[0].a,F.fin[0].b],right:pick===0,agenda:F.fin.flatMap(x=>[x.a,x.b]).includes(AGENDA_ME)};_wp(F,pick,pPick);const b=document.getElementById('s2');if(b){const nb=b.cloneNode(true);nb.textContent='See your season results';b.replaceWith(nb);nb.addEventListener('click',openWrap)}saveCar()};
function seasonResult(){const l=lvlOf(ST.xp),gs=seasonGoals(),gd=gs.filter(g=>{try{return g[2]()>=g[3]}catch(e){return false}}).length,arcs=Object.keys(ST.done).length,V=ST.aud.viewers,f=ST.fin||{};
 const score=Math.round(ST.rating*8+l*2+gd*6+arcs*4+V*5+(f.right?5:0));const sr=SRANKS.filter(x=>score>=x[0]).pop(),rn=RENEW.filter(x=>score>=x[0]).pop();
 const lines=[[`Season level ${l}`,Math.floor(l/2)],[`Season rank ${sr[1]}`,sr[2]],[`${gd} of 6 season goals`,gd*3],[`${arcs} storylines paid off`,arcs*2],[f.right?'Called the winners':'Finale call missed',f.right?3:0],[f.agenda?'Secret agenda complete':'Secret agenda failed',f.agenda?3:0],[`${rn[2]} renewal bonus`,rn[4]]];
 return {l,gd,gs,arcs,V,score,sr,rn,lines,stars:lines.reduce((a,x)=>a+x[1],0)}}
function openWrap(){const R=seasonResult(),s=CAR.season,first=!CAR.awarded[s];
 if(first){CAR.awarded[s]=true;CAR.stars+=R.stars;CAR.starsTotal+=R.stars;CAR.cxp+=R.stars*20;CAR.budget=R.rn[3];CAR.viewers=R.V;
  CAR.trophies.push({s,rank:R.sr[1],renew:R.rn[2]});CAR.hof.push({s,theme:theme.n,w:(ST.fin&&ST.fin.w||[]).map(nm),rating:ST.rating,rank:R.sr[1],level:R.l,viewers:R.V,renew:R.rn[2]});
  const mine=CAST.filter(c=>c.slot&&c.slot!=='Vault'&&c.stars).map(c=>({id:'vault_'+s+'_'+String(c.id).replace(/\W/g,''),name:c.name,sp:c.sp,spName:c.spName,job:c.job,top:c.top,bot:c.bot,skirt:c.skirt,acc:c.acc,iris:c.iris,expr:c.expr,heart:c.heart,temper:c.temper,game:c.game,vibe:c.vibe,stars:c.stars,rare:c.rare,from:s}));
  CAR.vault=CAR.vault.concat(mine).sort((a,b)=>b.stars-a.stars).slice(0,vaultCap());checkRank();saveCar()}
 const ns=s+1,newT=OFFICE.filter(o=>TIERGATE[o.tier]===ns),next=WALLS.find(w=>!CAR.walls[w.id]);
 let el=document.getElementById('career');if(!el){el=document.createElement('div');el.id='career';el.className='iroom career';document.getElementById('villa').appendChild(el)}el.classList.add('on');
 el.innerHTML=`<div class="lvh"><button class="lback" id="cBack">← Villa</button><div><h3>Season ${s} wrap</h3><div class="sub">${theme.n}</div></div></div>
 <p class="hostq">“${say('host_wrap',byId.mabel,{},true)}”</p>
 <div class="wrapcard"><span class="grade big g${R.sr[1].replace('+','')}">${R.sr[1]}</span><div><b>Season score ${R.score}</b><p>${R.rn[1]}. ${R.rn[2]} budget: you start Season ${ns} with <b>${R.rn[3]+hasUpNext('budget')*40} reels</b>.</p></div></div>
 <div class="lab">Network Stars earned</div><div class="wlines">${R.lines.map(([t,n],i)=>`<p style="animation-delay:${i*.25}s"><span>${t}</span><b>+${n}</b></p>`).join('')}<p class="tot" style="animation-delay:${R.lines.length*.25}s"><span>Total</span><b>★ ${R.stars}</b></p></div>
 <div class="lab">What carries into Season ${ns}</div><div class="brief">
 <p class="ok"><i>✓</i><span>${R.V.toFixed(2)}M viewers → premiere audience ${(R.V*(hasUpNext('marketing')?.9:.75)).toFixed(2)}M (your daily budget comes from this)</span></p>
 <p class="ok"><i>✓</i><span>Talent vault: ${CAR.vault.length?CAR.vault.map(v=>`${v.name} ${'★'.repeat(v.stars)}`).join(', '):'empty. Sign scouts with high stars to keep them'} (${vaultCap()} slots)</span></p>
 <p class="ok"><i>✓</i><span>Career: ${RANKS[CAR.rank-1][1]}, ${Object.keys(CAR.decor).length} villa decor, ${CAR.trophies.length} trophies, ${Object.keys(CAR.ach).length} achievements, ${Object.values(CAR.inv).reduce((a,b)=>a+b,0)} props in the cupboard</span></p>
 <p class="ok"><i>✓</i><span>Walking: ${Math.floor(lifeNow()/1000)}k lifetime steps, ${CAR.streak}-day streak</span></p></div>
 <div class="lab">Opening next season</div><div class="brief">${newT.length?`<p><i>★</i><span>Network Office tier ${newT[0].tier}: ${newT.map(o=>o.n).join(', ')}</span></p>`:''}${next?`<p><i>→</i><span>Next walking unlock: ${next.n} at ${next.at/1000}k steps (${Math.max(0,Math.floor((next.at-lifeNow())/1000))}k to go, about ${etaSeasons(next.at-lifeNow())} season${etaSeasons(next.at-lifeNow())>1?'s':''} at 6,000 steps a day each)</span></p>`:''}<p><i>★</i><span>Season ${ns} track exclusives: ${setFor(ns).map(id=>DECOR[id].n).join(', ')}</span></p><p><i>★</i><span>Season ${ns} theme: ${hasUpNext('chairman')?'your choice':THEMES[(ns-1)%THEMES.length].n}</span></p></div>
 <div class="wbtns"><button class="pbtn" id="wOffice">Spend ★ ${CAR.stars} in the Network Office</button><button class="pbtn alt" id="wNext">Start Season ${ns}</button></div>`;el.scrollTop=0;
 document.getElementById('cBack').addEventListener('click',()=>el.classList.remove('on'));
 document.getElementById('wOffice').addEventListener('click',()=>openCareer('office'));
 document.getElementById('wNext').addEventListener('click',startNextSeason)}
function hasUpNext(k){return CAR.up[k]||0}
function startNextSeason(){if(!confirm(`Start Season ${CAR.season+1}? The villa resets with a fresh first coupling. Your career, upgrades, decor, vault and cupboard carry over.`))return;
 CAR.season++;CAR.active=JSON.parse(JSON.stringify(CAR.up));CAR.pending=true;CAR.freezes+=2*hasUp('insure');saveCar();try{localStorage.removeItem(SK)}catch(e){}
 if(SYNC.on&&SYNC.ref){ST.season=CAR.season}location.reload()}
/* ---------- applying a fresh season ---------- */
function freshSeason(){const ids=VIDS();ids.forEach(a=>{AFF[a]={};ids.forEach(b=>{if(a!==b)AFF[a][b]=Math.round(4+chemScore(byId[a],byId[b])*.32+Math.random()*6)})});
 Object.keys(COUPLES).forEach(k=>delete COUPLES[k]);Object.keys(RIVAL).forEach(k=>delete RIVAL[k]);RELS.length=0;
 const pool=shuffle(ids);while(pool.length>1){const a=pool.shift();pool.sort((p,q)=>(chemScore(byId[a],byId[q])+Math.random()*25)-(chemScore(byId[a],byId[p])+Math.random()*25));const b=pool.shift();COUPLES[a]=b;COUPLES[b]=a;AFF[a][b]=52+Math.round(Math.random()*9);AFF[b][a]=51+Math.round(Math.random()*10)}
 shuffle(ids).slice(0,4).forEach(a=>{const o=shuffle(ids.filter(x=>x!==a&&x!==COUPLES[a]))[0];AFF[a][o]=49+Math.round(Math.random()*9)});
 ids.forEach(a=>{THINK[a]=topOther(a)||COUPLES[a]});
 const k=COUPLES.kai,ko=topOther('kai');AFF.kai[ko]=AFF.kai[k]+2;window.__tri={p:k,o:ko};
 const nonc=[];ids.forEach((a,i)=>ids.slice(i+1).forEach(b=>{if(COUPLES[a]!==b&&a!=='kai'&&b!=='kai')nonc.push([a,b,Math.min(AFF[a][b],AFF[b][a])])}));nonc.sort((p,q)=>q[2]-p[2]);const [s1,s2]=[nonc[0],nonc.find(x=>![nonc[0][0],nonc[0][1]].includes(x[0])&&![nonc[0][0],nonc[0][1]].includes(x[1]))||nonc[1]];
 const v=ids.find(i=>byId[i].game==='Schemer')||ids.find(i=>byId[i].temper==='Fiery')||ids[0],vf=COUPLES[v]?topOther(COUPLES[v]):ids.find(i=>i!==v);
 const A=Object.fromEntries(ARCS.map(a=>[a.id,a]));
 Object.assign(A.slow,{name:`Slow burn: ${nm(s1[0])} and ${nm(s1[1])}`,prog:()=>Math.min(AFF[s1[0]][s1[1]],AFF[s1[1]][s1[0]])/72,pay:()=>[s1[0],s1[1]],txt:`${nm(s1[0])} and ${nm(s1[1])} finally admit how they feel.`});
 Object.assign(A.tri,{name:`Love triangle: ${nm(k)}, Kai and ${nm(ko)}`,prog:()=>clamp(AFF.kai[ko]/Math.max(1,AFF.kai[k]),0,1)});
 Object.assign(A.vil,{name:`Villain rise: ${nm(v)}`,prog:()=>clamp(RELS.filter(r=>r[2]==='rival'&&(r[0]===v||r[1]===v)).reduce((a,r)=>a+r[3],0)/7,0,1),pay:()=>[v,vf],txt:`${nm(v)} embraces the villain edit. The villa turns.`});
 Object.assign(A.leo,{name:`Wildcard crush: ${nm(s2[0])} and ${nm(s2[1])}`,prog:()=>Math.min(AFF[s2[0]][s2[1]],AFF[s2[1]][s2[0]])/68,pay:()=>[s2[0],s2[1]],txt:`${nm(s2[0])} and ${nm(s2[1])} stop pretending.`});
 ST.done={};ST.dumped=[];ST.gamesPlayed=[];ST.todayGame=null;ST.ship=null;ST.duel={me:0,them:0};ST.rating=6.8;ST.hype=0;ST.instinct=0;ST.finale=false;ST.aired={};ST.beatDone={};ST.twists={};ST.bombSeen=false;ST.seasonSteps=0;ST.trackClaimed=1;ST.stats={};
 PARTNER.ship=couplesList().map(p=>[p,AFF[p[0]][p[1]]+AFF[p[1]][p[0]]]).sort((a,b)=>b[1]-a[1])[0][0].join('|');
 ST.reels=CAR.budget+hasUp('budget')*40;const hl=1+hasUp('head');ST.xp=LVX[hl-1];ST.trackClaimed=hl;
 ST.aud={viewers:+Math.max(1,CAR.viewers*(hasUp('marketing')?.9:.75)).toFixed(2),seg:[60,60,60,60],hist:[],down:0,notice:0};
 if(hasUp('allstar')&&CAR.vault.length){const best=CAR.vault[0];if(byId[best.id]){byId[best.id].allStar=true;BEATS[7]='bomb'}}
 VS.day=1;VS.t=0;VS.log=[];VS.feed={};if(hasUp('edit'))ED.tools={day:1,list:[{i:2,m:1}]};ST.steps={me:0,them:0,tog:0,claimed:0,ms:{}};
 syncLove();schedule();layout();drawVilla();renderTime();newBrief();chChip();syncReels();renderQueue();renderSteps();renderLvl();
 setTimeout(()=>{const pb=document.getElementById('payoff');pb.innerHTML=`<button class="x" aria-label="Close">×</button><div class="evtag">Season ${ST.season} · Day 1</div><h3>${theme.n}</h3><p>${theme.d}</p><p>First coupling: ${couplesList().map(cn).join(' · ')}</p><p class="fine" style="color:#CDB9C8">Starting budget ${ST.reels} reels · premiere audience ${ST.aud.viewers.toFixed(2)}M${hl>1?` · head start: level ${hl}`:''}</p>`;pb.classList.add('on');pb.querySelector('.x').onclick=()=>pb.classList.remove('on')},600)}
window.__triTxt=kn=>{const t=window.__tri;if(!t)return null;return kn===t.o?`Kai picks ${nm(t.o)}. ${nm(t.p)} is left reeling.`:kn===t.p?`Kai stays with ${nm(t.p)}. ${nm(t.o)} has to watch.`:byId[kn]?`Kai ends up with ${nm(kn)}. Nobody saw that coming.`:'Kai is left single. The triangle collapses.'};
/* label the season everywhere */
const _rt8=renderTime;renderTime=function(){_rt8();const sp=document.querySelector('#timeCtl span');if(sp)sp.textContent=`S${ST.season} · Day ${VS.day}`};
/* ---------- the career screen ---------- */
openProducer=function(){openCareer('season')};
function openCareer(tab){let el=document.getElementById('career');if(!el){el=document.createElement('div');el.id='career';el.className='iroom career';document.getElementById('villa').appendChild(el)}el.classList.add('on');closeSheet();
 const T=[['season','Season'],['audience','Audience'],['career','Career'],['office','Office'],['collection','Collection']];
 const l=lvlOf(ST.xp),lo=LVX[l-1],hi=LVX[l]||lo,cr=CAR.rank,crLo=RANKS[cr-1][0],crHi=(RANKS[cr]||RANKS[cr-1])[0];let body='';
 if(tab==='season'){const gs=seasonGoals();body=`<div class="kpis"><div><b>Lv ${l}</b><span>Season level</span></div><div><b>${ST.xp.toLocaleString('en-US')}</b><span>XP</span></div><div><b>★ ${CAR.stars}</b><span>Stars</span></div></div>
  <div class="xpbar"><i style="width:${l>=30?100:Math.min(100,(ST.xp-lo)/(hi-lo)*100)}%"></i></div><p class="fine">${l>=30?'Season track complete.':`${(hi-ST.xp).toLocaleString('en-US')} XP to level ${l+1}. Walking, filming, challenges, interviews and good episodes all earn XP.`} Theme: <b>${theme.n}</b>. ${theme.d}</p>
  <div class="lab">Season ${ST.season} goals <span class="cnt">+3 stars each at the wrap</span></div><div class="brief">${gs.map(g=>{let v=0;try{v=g[2]()}catch(e){}const ok=v>=g[3];return `<p class="${ok?'ok':''}"><i>${ok?'✓':''}</i><span>${g[1]}</span><small>${typeof v==='number'&&v%1?v.toFixed(1):v}/${g[3]}</small></p>`}).join('')}</div>
  <div class="lab">Season ${ST.season} reward track</div><div class="track">${Array.from({length:30},(_,i)=>{const t=i+1,r=trackReward(t,ST.season),got=t<=ST.trackClaimed&&t<=l;return `<div class="tier ${got?'got':''} ${t===l+1?'next':''} ${r.t}"><b>${t}</b><span>${r.d}</span></div>`}).join('')}</div>`}
 if(tab==='audience'){const A=ST.aud,R=fanReq(),h=A.hist.slice(-12),mx=Math.max(1,...h.map(x=>x.v));body=`<div class="kpis"><div><b>${A.viewers.toFixed(2)}M</b><span>Viewers</span></div><div><b>${Math.round(A.viewers*12)}</b><span>Daily budget</span></div><div><b>${ST.rating.toFixed(1)}</b><span>Season rating</span></div></div>
  ${h.length?`<svg class="spark" viewBox="0 0 300 70" aria-label="Viewers by episode">${h.map((x,i)=>`<rect x="${i*25+4}" y="${66-x.v/mx*60}" width="18" height="${x.v/mx*60}" rx="3" fill="${x.r>=8?'#2F9E7A':x.r>=7?'#FF8A65':'#C0344B'}"/>`).join('')}</svg>`:'<p class="fine">Air your first episode to start the chart.</p>'}
  <div class="lab">Who's watching</div>${A.seg.map((x,i)=>`<div class="ar2"><span>${SEGN[i]}</span><i><b style="width:${x}%;background:${SEGC[i]}"></b></i><span>${x}</span></div>`).join('')}
  <p class="fine">Under 35 and a group starts switching off, which costs viewers every episode. Over 80 and they bring friends. Viewers pay your daily budget, and they carry into next season.</p>
  <div class="lab">Today's fan request</div><p>${SEGN[R.i]} want ${REQK[R.i][1]} ${reqMet()?'✓':''}</p>${A.notice>=VS.day?'<div class="notice"><b>On notice.</b> Budget cut 30% until a recovery.</div>':''}
  <div class="lab">Audience tools</div><div class="brief">${Object.entries(audLvl).map(([k,v])=>`<p class="${l>=v?'ok':''}"><i>${l>=v?'✓':''}</i><span>${{focus:'Test screening: see the audience reaction before you air',teaser:'Social teaser: tease a clip for a viewer bump',sponsor:'Sponsor slot: reels now, Superfans annoyed'}[k]}</span><small>Lv ${v}</small></p>`).join('')}${OFFICE.filter(o=>['adsales','fanclub','marketing'].includes(o.k)).map(o=>`<p class="${hasUp(o.k)?'ok':''}"><i>${hasUp(o.k)?'✓':''}</i><span>${o.n}: ${o.d}</span><small>Office</small></p>`).join('')}</div>`}
 if(tab==='career'){const life=lifeNow();body=`<div class="kpis"><div><b>${RANKS[cr-1][1]}</b><span>Rank ${cr} of 15</span></div><div><b>${CAR.season}</b><span>Season</span></div><div><b>★ ${CAR.starsTotal}</b><span>Stars earned</span></div></div>
  <div class="xpbar"><i style="width:${cr>=15?100:Math.min(100,(CAR.cxp-crLo)/(crHi-crLo)*100)}%"></i></div><p class="fine">${cr>=15?'Top rank.':`${(crHi-CAR.cxp).toLocaleString('en-US')} career XP to ${RANKS[cr][1]}.`} Every rank pays 2 stars; ranks 3, 6, 9, 12 and 15 pay extra.</p>
  <div class="lab">Walking together <span class="cnt">${Math.floor(life/1000).toLocaleString('en-US')}k lifetime steps</span></div><div class="walls">${WALLS.map(w=>{const ok=CAR.walls[w.id],pc=Math.min(100,life/w.at*100);return `<div class="wall ${ok?'ok':''}"><div><b>${ok?'✓ ':''}${w.n}</b><span>${(w.at/1000).toLocaleString('en-US')}k${ok?` · unlocked Season ${CAR.walls[w.id]}`:` · about ${etaSeasons(w.at-life)} more season${etaSeasons(w.at-life)>1?'s':''}`}</span></div><i><em style="width:${pc}%"></em></i><small>${w.d}</small></div>`}).join('')}</div>
  <p class="fine">Pacing assumes about 6,000 steps a day each. Walk more and these come sooner. Nothing here can be bought.</p>
  <div class="lab">Walking streak</div><div class="kpis"><div><b>${CAR.streak}</b><span>Days (5k+)</span></div><div><b>${CAR.maxStreak}</b><span>Best</span></div><div><b>${CAR.freezes}</b><span>Freezes</span></div></div>
  <div class="brief">${Object.entries(STREAKR).map(([d,r])=>`<p class="${CAR.maxStreak>=d?'ok':''}"><i>${CAR.maxStreak>=d?'✓':''}</i><span>${d} days</span><small>+${r[1]} ${r[0]==='reels'?'reels':'stars'}</small></p>`).join('')}</div>`}
 if(tab==='office'){const os=openSeason();body=`<p class="fine">Spend Network Stars on permanent upgrades. Upgrades switch on at the start of your next season. New tiers open as seasons pass, so the whole office takes about eight seasons to fill.</p><div class="kpis"><div><b>★ ${CAR.stars}</b><span>To spend</span></div><div><b>${OFFICE.reduce((a,o)=>a+(CAR.up[o.k]||0),0)}/${OFFICE.reduce((a,o)=>a+o.max,0)}</b><span>Upgrades</span></div><div><b>S${os}</b><span>Office open to</span></div></div>
  ${[1,2,3,4,5].map(t=>{const open=os>=TIERGATE[t];return `<div class="lab">Tier ${t} ${open?'':`<span class="cnt">🔒 opens in Season ${TIERGATE[t]}</span>`}</div><div class="office">${OFFICE.filter(o=>o.tier===t).map(o=>{const lv=CAR.up[o.k]||0,act=CAR.active[o.k]||0,max=lv>=o.max,c=o.cost[lv];return `<div class="off ${open?'':'shut'} ${lv?'own':''}"><b>${o.n}${o.max>1?` <small>${lv}/${o.max}</small>`:''}</b><span>${o.d}</span><small>${act?`Active${act<lv?', next level from next season':''}`:lv?'Switches on next season':''}</small>${max?'<em>Maxed</em>':`<button data-buy="${o.k}" ${!open||CAR.stars<c?'disabled':''}>${open?`★ ${c}`:'Locked'}</button>`}</div>`}).join('')}</div>`}).join('')}
  ${hasUp('chairman')?`<div class="lab">Next season's theme</div><div class="opts">${THEMES.map(t=>`<button data-th="${t.id}" class="${CAR.themePick===t.id?'on':''}">${t.n}</button>`).join('')}</div>`:''}`}
 if(tab==='collection'){const allD=Object.keys(DECOR);body=`<div class="lab">Villa decor <span class="cnt">${Object.keys(CAR.decor).length}/${allD.length} · tap to show or hide</span></div><div class="decor">${allD.map(k=>{const own=CAR.decor[k];const src=SETS.findIndex(st=>st.includes(k));return `<button data-dc="${k}" class="${own?'own':''} ${CAR.decorOff[k]?'off':''}" ${own?'':'disabled'}><svg viewBox="0 0 390 560" aria-hidden="true">${DECOR[k].s()}</svg><b>${DECOR[k].n}</b><small>${own?(CAR.decorOff[k]?'Hidden':'On display'):src>=0?`Season ${src+1} track (and every ${SETS.length}th after)`:k==='hottub'?'Network Office':['goldtrim'].includes(k)?'Office or 2M steps':'Career rank'}</small></button>`}).join('')}</div>
  <div class="lab">Trophy cabinet</div><div class="trophies">${CAR.trophies.length?CAR.trophies.map(t=>`<div><span class="grade g${t.rank.replace('+','')}">${t.rank}</span><b>Season ${t.s}</b><small>${t.renew}</small></div>`).join(''):'<p class="fine">Finish a season to earn your first trophy.</p>'}</div>
  <div class="lab">Hall of Fame</div>${CAR.hof.length?CAR.hof.slice().reverse().map(h=>`<div class="hof"><b>Season ${h.s} · ${h.theme}</b><span>Winners: ${h.w.join(' + ')||'–'} · rating ${(+h.rating).toFixed(1)} · ${(+h.viewers).toFixed(2)}M viewers · Lv ${h.level}</span></div>`).join(''):'<p class="fine">Empty, for now.</p>'}
  <div class="lab">Talent vault <span class="cnt">${CAR.vault.length}/${vaultCap()}</span></div>${CAR.vault.length?CAR.vault.map(v=>`<div class="hof"><b>${v.name} ${'★'.repeat(v.stars)}</b><span>${v.spName} · ${v.job} · signed Season ${v.from} · available as a bombshell every season</span></div>`).join(''):'<p class="fine">Signed scouts with the most stars are kept here at the end of each season.</p>'}
  <div class="lab">Titles</div><p>${CAR.titles.length?CAR.titles.join(' · '):'Earn titles from the season track.'}</p>
  <div class="lab">Achievements <span class="cnt">${Object.keys(CAR.ach).length}/${ACH.length}</span></div><div class="achs">${ACH.map(([id,n,d])=>`<div class="ach ${CAR.ach[id]?'on':''}"><b>${CAR.ach[id]?'★':'☆'} ${n}</b><span>${d}</span></div>`).join('')}</div>`}
 el.innerHTML=`<div class="lvh"><button class="lback" id="cBack">← Villa</button><div><h3>${RANKS[cr-1][1]}</h3><div class="sub">Season ${ST.season} · Lv ${l} ${TITLES[l-1]}${CAR.titles.length?' · '+CAR.titles[CAR.titles.length-1]:''}</div></div></div><div class="ctabs">${T.map(([k,n])=>`<button data-ct="${k}" class="${k===tab?'on':''}">${n}</button>`).join('')}</div>${body}`;
 el.querySelector('#cBack').addEventListener('click',()=>el.classList.remove('on'));el.querySelectorAll('[data-ct]').forEach(b=>b.addEventListener('click',()=>openCareer(b.dataset.ct)));
 el.querySelectorAll('[data-buy]').forEach(b=>b.addEventListener('click',()=>{const o=OFFICE.find(x=>x.k===b.dataset.buy),lv=CAR.up[o.k]||0,c=o.cost[lv];if(CAR.stars<c)return;CAR.stars-=c;CAR.up[o.k]=lv+1;CAR.cxp+=c*10;checkRank();saveCar();toast(`${o.n} purchased. Switches on at the start of Season ${CAR.season+(CAR.awarded[CAR.season]?1:1)}.`);openCareer('office')}));
 el.querySelectorAll('[data-th]').forEach(b=>b.addEventListener('click',()=>{CAR.themePick=b.dataset.th;saveCar();openCareer('office')}));
 el.querySelectorAll('[data-dc]').forEach(b=>b.addEventListener('click',()=>{const k=b.dataset.dc;CAR.decorOff[k]=!CAR.decorOff[k];saveCar();drawVilla();openCareer('collection')}))}
/* ---------- start up: resume or begin a season ---------- */
(function boot(){const saved=lsGet(SK);
 if(CAR.pending){CAR.pending=false;saveCar();freshSeason();return}
 if(saved&&saved.season===CAR.season&&saved.data){try{window.__resumeTC=saved.tc||1;SYNC.applying=true;applyState(saved.data);SYNC.applying=false;if(saved.steps)ST.steps=Object.assign(ST.steps,saved.steps);renderSteps();chChip();toast(`Welcome back. Season ${ST.season}, day ${VS.day}.`)}catch(e){SYNC.applying=false;console.warn('resume failed',e)}}
 else if(CAR.season>1&&!SYNC.on){freshSeason()}
 if(CAR.season===1&&!saved)setTimeout(()=>toast('Tap your level badge to see the season track, your audience and your career.'),4000)})();
renderTime();renderLvl();checkWalls();
window.__test=Object.assign(window.__test||{},{car:()=>CAR,season:()=>({season:ST.season,day:VS.day,reels:ST.reels,xp:ST.xp,lvl:lvlOf(ST.xp),aud:ST.aud,couples:couplesList().map(cn),theme:theme.id,active:CAR.active}),addStars:n=>{CAR.stars+=n;saveCar()},walk:n=>{CAR.lifetime+=n;checkWalls();saveCar()}});
