
/* ---------- systems 12: real clock by default, studio tycoon, crew, production timers ---------- */
/* ---------- the clock: real time unless you switch on preview ---------- */
if(CAR.preview===undefined)CAR.preview=false;
function clockMode(){const on=!CAR.preview&&!(CAR.onb&&CAR.onb.on)&&!CAR.offseason;if(CAR.rt.on!==on){CAR.rt.on=on;CAR.rt.key=null;if(on)CAR.rt.me=ST.steps.me;saveCar();renderTime()}}
clockMode();setInterval(clockMode,5000);
const _obEnd=obEnd;obEnd=function(skip){_obEnd(skip);clockMode();if(CAR.rt.on)setTimeout(()=>toast('From now on the villa runs on real time. Episodes air at 8pm.'),1500)};
const _oe12=openEp;openEp=function(){if(CAR.rt.on&&VS.t<3&&!ST.aired[VS.day]){toast('Tonight’s episode airs at 8pm. Come back then.');return}_oe12()};
document.getElementById('watch').replaceWith(document.getElementById('watch').cloneNode(true));document.getElementById('watch').addEventListener('click',()=>openEp());
/* ---------- studio state (lives in your career) ---------- */
const SDEF={hq:1,cash:600,fac:{},crew:[],pool:null,jobs:[],cashTotal:0};CAR.studio=Object.assign({},SDEF,CAR.studio||{});const STU=CAR.studio;
const FAC={villa:{n:'Main house',w:2,d:'Room for more islanders and a better-looking show. Every level adds rating.'},pool:{n:'Pool & deck',w:1.5,d:'The heart of daytime TV. More viewers tune in for summer content.'},daybeds:{n:'Daybeds',w:1,d:'Better flirting scenes. Chats here go further.'},firepit:{n:'Fire pit stage',w:1.3,d:'Bigger recouplings. More buzz from every one.'},garden:{n:'Garden',w:1,d:'A quieter set. Islanders are more honest in interviews.'},gym:{n:'Gym',w:1,d:'Challenge set pieces pay more studio cash.'},kitchen:{n:'Kitchen',w:1,d:'Comfort food. Islanders recover mood faster.'},dressing:{n:'Dressing room',w:1,d:'Glam team. Islanders start each day more confident.'},bedroom:{n:'Bedroom',w:1,d:'Late-night drama. More random events happen.'},hideaway:{n:'Hideaway',w:1.2,d:'The romance suite. Hideaway nights bond couples harder.'},terrace:{n:'Roof terrace',w:1.2,d:'Sunset dates. Dates here spark more often.'}};
Object.keys(FAC).forEach(k=>{if(!STU.fac[k])STU.fac[k]=1});
const flv=k=>STU.fac[k]||1,facSum=()=>Object.keys(FAC).reduce((a,k)=>a+flv(k)-1,0);
const HQSEASON=[0,1,1,2,3,4,5,7,9,12,15],HQCOST=[0,0,800,2500,6000,12000,22000,38000,60000,90000,130000],HQHRS=[0,0,.5,2,6,12,24,36,48,72,96];
const facCost=(k,n)=>Math.round(60*Math.pow(n,1.8)*FAC[k].w/10)*10,facMin=n=>15*n*n;
const buildSlots=()=>1+(STU.hq>=4)+(STU.hq>=8),deskSlots=()=>2+(STU.hq>=3)+(STU.hq>=6),crewCap=()=>Math.min(7,1+Math.ceil(STU.hq*.7));
const money=n=>'$'+Math.round(n).toLocaleString('en-US');
const dur=ms=>{if(ms<=0)return 'ready';const m=Math.ceil(ms/60000);return m>=60?`${Math.floor(m/60)}h ${m%60?m%60+'m':''}`.trim():`${m}m`};
/* ---------- crew ---------- */
const ROLES={director:{n:'Director',e:s=>`+${(s*.1).toFixed(1)} episode rating`},editor:{n:'Editor',e:s=>`+${(s*.06).toFixed(2)} rating on every cut`},story:{n:'Story producer',e:s=>`+${s*6}% chance of random drama`},casting:{n:'Casting director',e:s=>`Scouts arrive with +${Math.floor(s/2)}★ and golden finds are likelier`},host:{n:'Host',e:s=>`+${s*2}% viewers every episode`},social:{n:'Social media lead',e:s=>`+${s*8}% daily network budget`},camera:{n:'Camera operator',e:s=>`+${s*15}% XP from filmed moments`}};
const RAR=[['Rookie',1,300,100],['Pro',2,1200,400],['Star',3,4000,1200],['Legend',4,12000,3000]];
const crewOf=r=>STU.crew.find(c=>c.role===r);const cpow=r=>{const c=crewOf(r);return c?c.stars*(1+(c.lvl-1)*.25):0};
const CREWSP=['fox','otter','cat','bunny','raccoon','deer','dog','wolf','koala','arcticfox','poodle','redpanda'];
function makeCrew(){const hq=STU.hq,r=Math.random(),ri=hq>=6&&r<.06?3:hq>=3&&r<.2?2:r<.55?1:0;const R=RAR[ri],sp=pick(CREWSP);
 return {id:'crew'+Date.now().toString(36)+Math.random().toString(36).slice(2,5),name:pick(NAMES),sp,spName:SPNAME[sp]||sp,role:pick(Object.keys(ROLES)),rar:R[0],stars:R[1],cost:R[2],salary:R[3],lvl:1,top:pick(['#241A2E','#3F8FB0','#C65D3B','#9B7BD4','#2F9E7A','#E8CDB5']),bot:pick(['#E9D8C4','#3A2840','#FFF4EA']),acc:pick(['glasses','none','chain','headband']),iris:pick(['#3E7C59','#4A6FA5','#6B3E1E']),expr:pick(['smile','smirk','soft','grin'])}}
function hirePool(){const now=Date.now();if(!STU.pool||now>STU.pool.until){STU.pool={until:now+8*3600e3,list:[0,1,2,3].map(makeCrew)};saveCar()}return STU.pool}
/* ---------- jobs: builds and production tasks ---------- */
const TASKS={scout:{n:'Scouting trip',hrs:2,cost:150,hq:1,d:'A scout comes back with a signed candidate for your bombshell bench.'},highlight:{n:'Highlight package',hrs:3,cost:100,hq:1,d:'+0.3 buzz for tonight’s episode.'},dress:{n:'Set dressing',hrs:1,cost:80,hq:1,d:'The next date can’t flop.'},promo:{n:'Promo shoot',hrs:5,cost:250,hq:2,d:'+4% viewers when it’s done.'},fanevent:{n:'Fan event',hrs:8,cost:400,hq:4,d:'Every audience group +8.'}};
const busy=kind=>STU.jobs.filter(j=>j.kind===kind).length;
function addJob(kind,type,target,label,hrs){const now=Date.now();STU.jobs.push({id:Math.random().toString(36).slice(2),kind,type,target,label,start:now,end:now+hrs*3600e3});saveCar();renderStudio();studioChip()}
function finishJob(j){STU.jobs=STU.jobs.filter(x=>x!==j);let msg='';
 if(j.type==='hq'){STU.hq=j.target;msg=`Studio HQ is now level ${STU.hq}.`;hirePool()}
 if(j.type==='fac'){STU.fac[j.target]=flv(j.target)+1;msg=`${FAC[j.target].n} upgraded to level ${STU.fac[j.target]}.`;drawVilla()}
 if(j.type==='train'){const c=STU.crew.find(x=>x.id===j.target);if(c){c.lvl++;msg=`${c.name} trained to level ${c.lvl}.`}}
 if(j.type==='scout'){const reg=rnd(Object.keys(CREG).filter(k=>CREG[k].sp));const c=makeCand(reg,{gold:Math.random()<.08+cpow('casting')*.03});const best=Math.max(...VILLA.map(v=>chemScore(c,byId[v.id])));c.stars=Math.max(1,Math.min(5,Math.round(best/22)+Math.floor(cpow('casting')/2)));c.slot='Bombshell bench';c.mood='happy';byId[c.id]=c;CAST.push(c);const sp=String(c.sp).replace(/^g_/,'');ST.book.seen[sp]=ST.book.seen[sp]||VS.day;msg=`Your scout signed ${c.name}, ${c.spName} ${'★'.repeat(c.stars)}. They're on the bombshell bench.`}
 if(j.type==='highlight'){addBuzz(.3);msg='Highlight package delivered: +0.3 buzz tonight.'}
 if(j.type==='dress'){ST.setDressed=true;msg='Set dressed. The next date can’t flop.'}
 if(j.type==='promo'){ST.aud.viewers=+(ST.aud.viewers*1.04).toFixed(2);msg='Promo is out: +4% viewers.'}
 if(j.type==='fanevent'){ST.aud.seg=ST.aud.seg.map(x=>Math.min(100,x+8));msg='Fan event done: every audience group +8.'}
 xp(j.kind==='build'?20:8,'Production');saveCar();SFX.coin();buzz(25);toast(msg);renderStudio();studioChip()}
/* walking speeds up the crews */
let lastSteps=ST.steps.me;setInterval(()=>{const d=ST.steps.me-lastSteps;lastSteps=ST.steps.me;if(d>=1000&&STU.jobs.length){const mins=Math.floor(d/1000)*5;STU.jobs.forEach(j=>j.end-=mins*60000);saveCar();toast(`Your walk sped up the crews by ${mins} min.`);renderStudio()}if(d<0)lastSteps=ST.steps.me},3000);
/* the ready chip */
NOTEIDS.push('stchip');
function studioChip(){let el=document.getElementById('stchip');const ready=STU.jobs.filter(j=>Date.now()>=j.end);if(!ready.length){if(el)el.remove();return}
 if(!el){el=document.createElement('button');el.id='stchip';el.className='ivreq chchip stc';document.getElementById('villa').appendChild(el);el.addEventListener('click',()=>goPlace('pStudio'))}
 el.innerHTML=`<span class="pulse" style="background:#7FE0B0"></span><b>${ready.length} ready to collect</b><small>${ready.map(j=>j.label).slice(0,2).join(' · ')}</small>`}
setInterval(()=>{studioChip();if(document.getElementById('pStudio').classList.contains('on'))tickStudio()},1000);
/* ---------- effects of the studio on the show ---------- */
const _aud12=audience;audience=function(){const a=_aud12();const bonus=cpow('director')*.1+cpow('editor')*.06+(flv('villa')-1)*.03+facSum()*.005;return Object.assign({},a,{rating:Math.min(9.9,+a.rating+bonus).toFixed(1)})};
const _as12=audSim;audSim=function(v,r){const o=_as12(v,r);const extra=cpow('host')*2+(flv('pool')-1)*.8;o.pct=clamp(o.pct+extra,-18,22);o.viewers=+clamp(ST.aud.viewers*(1+o.pct/100),.2,40).toFixed(2);return o};
const _fe12=fireEvent;fireEvent=function(f){_fe12(f||Math.random()<cpow('story')*.06+(flv('bedroom')-1)*.02)};
const _hon12=honest;honest=function(c){return _hon12(c)||Math.random()<(flv('garden')-1)*.03};
const _li12=logIt;logIt=function(l,t,s,m){_li12(l,t,s,m);if(!SYNC.applying&&cpow('camera')){ST.xp+=Math.round((s?5:3)*cpow('camera')*.15)}};
/* ad revenue after every episode */
const _aep12=afterEp;afterEp=function(){const was=ST.aired[VS.day];_aep12();if(was)return;const r=ST.aud.hist.length?ST.aud.hist[ST.aud.hist.length-1].r:7;const cash=Math.round(ST.aud.viewers*r*60*(1+cpow('social')*.04));STU.cash+=cash;STU.cashTotal+=cash;saveCar();const k=sheet.querySelector('.audbox');if(k)k.insertAdjacentHTML('afterend',`<div class="cashbox"><b>Ad revenue ${money(cash)}</b><span>Studio cash ${money(STU.cash)}. Spend it on the villa and your crew.</span></div>`)};
const _fc12=finishCH;finishCH=function(){const done=CH.finished;_fc12();if(CH.finished!==done){const c=150+(flv('gym')-1)*40;STU.cash+=c;saveCar();setTimeout(()=>toast(`Challenge sponsorship: ${money(c)} studio cash`),1200)}};
const _bud=document.getElementById('timeCtl');_bud.addEventListener('click',()=>{if(VS.t===0&&cpow('social')){const extra=Math.round(ST.aud.viewers*12*cpow('social')*.08);ST.reels+=extra;syncReels()}if(VS.t===0&&flv('dressing')>1)moodUp(VIDS(),(flv('dressing')-1)*1.5)});
/* salaries at the start of a season, cash bonus at the wrap */
const _fs12=freshSeason;freshSeason=function(){_fs12();let paid=0,quit=[];STU.crew.forEach(c=>{if(STU.cash>=c.salary){STU.cash-=c.salary;paid+=c.salary}else quit.push(c)});STU.crew=STU.crew.filter(c=>!quit.includes(c));saveCar();setTimeout(()=>toast(`Crew salaries paid: ${money(paid)}.${quit.length?` ${quit.map(c=>c.name).join(', ')} left: you couldn't pay them.`:''}`),2600)};
const _ow12=openWrap;openWrap=function(){const first=!CAR.awarded[CAR.season];_ow12();if(first){const R=seasonResult(),bonus=[2000,4000,7000,11000,16000][RENEW.indexOf(R.rn)]||2000;STU.cash+=bonus;saveCar();const c=document.querySelector('#career .wrapcard');if(c)c.insertAdjacentHTML('afterend',`<div class="cashbox"><b>Renewal bonus ${money(bonus)} studio cash</b><span>Your studio now has ${money(STU.cash)} to build with.</span></div>`)}};
/* ---------- visible growth on the villa map ---------- */
const FDEC=[['pool',3,'flamingo'],['pool',6,'swan'],['firepit',3,'lanterns'],['terrace',3,'balloons'],['garden',3,'fairyarch'],['garden',6,'geraldhouse'],['daybeds',3,'umbrella'],['gym',3,'surfboards'],['villa',4,'palmlights'],['villa',8,'goldtrim'],['kitchen',3,'icecream'],['hideaway',5,'neonheart'],['firepit',6,'discoball'],['villa',10,'hofstar']];
const u12=window.__VX.under;window.__VX.under=function(){let s='';FDEC.forEach(([k,l,d])=>{if(flv(k)>=l&&!CAR.decor[d]&&DECOR[d])s+=DECOR[d].s()});
 Object.keys(FAC).forEach(k=>{if(flv(k)<2||!LOC[k])return;const [x,y]=LOC[k].pill;s+=`<g transform="translate(${x+34} ${y-14})" opacity=".9"><rect x="-11" y="-7" width="22" height="13" rx="6" fill="#241A2E"/><text y="3" text-anchor="middle" font-family="Manrope, sans-serif" font-weight="800" font-size="8" fill="#F6C35B">L${flv(k)}</text></g>`});return u12.call(this)+s};
/* ---------- the Studio screen ---------- */
document.getElementById('pEdit').insertAdjacentHTML('afterend',`<div class="place" id="pStudio"></div>`);
document.querySelector('.pl[data-place="pEdit"]').insertAdjacentHTML('afterend',`<button class="pl" data-place="pStudio"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 21V9l6-4v4l6-4v4l6-4v16z"/><path d="M7 21v-4M12 21v-4M17 21v-4"/></svg>Studio</button>`);
document.querySelector('.pl[data-place="pStudio"]').addEventListener('click',()=>goPlace('pStudio'));
const _gp12=goPlace;goPlace=function(id){_gp12(id);if(id==='pStudio')renderStudio()};
let stTab='board';
function renderStudio(){const el=document.getElementById('pStudio');if(!el||!el.classList.contains('on'))return;const now=Date.now(),pool=hirePool();
 const nextHQ=STU.hq<10?STU.hq+1:null,hqGate=nextHQ?HQSEASON[nextHQ]:0;
 let body='';
 if(stTab==='board'){body=`<div class="lab">Build crews <span class="cnt">${busy('build')}/${buildSlots()} busy</span></div>${jobList('build')}<div class="lab">Production desks <span class="cnt">${busy('desk')}/${deskSlots()} busy</span></div>${jobList('desk')}
  <div class="lab">Start a production task</div><div class="tasks">${Object.entries(TASKS).map(([k,t])=>{const lock=STU.hq<t.hq;return `<div class="task ${lock?'shut':''}"><b>${t.n}</b><span>${t.d}</span><small>${t.hrs}h · ${money(t.cost)}${lock?` · HQ ${t.hq}`:''}</small><button data-task="${k}" ${lock||STU.cash<t.cost||busy('desk')>=deskSlots()?'disabled':''}>Start</button></div>`}).join('')}</div>
  <p class="fine">Every 1,000 steps you walk takes 5 minutes off every running timer.</p>`}
 if(stTab==='villa'){body=`<div class="hq"><div><b>Studio HQ · level ${STU.hq}</b><span>Caps every facility at level ${STU.hq}. Unlocks crews, desks and better hires.</span></div>${nextHQ?(CAR.season<hqGate?`<em>🔒 Level ${nextHQ} opens in Season ${hqGate}</em>`:jobFor('hq')?`<em>Building… ${dur(jobFor('hq').end-now)}</em>`:`<button data-hq="1" ${STU.cash<HQCOST[nextHQ]||busy('build')>=buildSlots()?'disabled':''}>Upgrade · ${money(HQCOST[nextHQ])} · ${HQHRS[nextHQ]>=1?HQHRS[nextHQ]+'h':HQHRS[nextHQ]*60+'m'}</button>`):'<em>Max level</em>'}</div>
  <div class="facs">${Object.entries(FAC).map(([k,f])=>{const l=flv(k),n=l+1,j=jobFor('fac',k),cap=l>=STU.hq;return `<div class="fac"><div class="fh"><b>${f.n}</b><span class="lv">L${l}</span></div><span>${f.d}</span>${j?`<em>Upgrading… ${dur(j.end-now)}</em>`:l>=10?'<em>Max level</em>':cap?`<em>Upgrade HQ to go past L${l}</em>`:`<button data-fac="${k}" ${STU.cash<facCost(k,n)||busy('build')>=buildSlots()?'disabled':''}>L${n} · ${money(facCost(k,n))} · ${dur(facMin(n)*60000)}</button>`}</div>`}).join('')}</div>`}
 if(stTab==='crew'){body=`<div class="lab">Your crew <span class="cnt">${STU.crew.length}/${crewCap()} hired · one per role</span></div>${STU.crew.length?STU.crew.map(c=>crewCard(c,true)).join(''):'<p class="fine">No crew yet. Your show is just you and a camera.</p>'}
  <div class="lab">Hiring board <span class="cnt">new faces in ${dur(pool.until-now)}</span></div>${pool.list.map(c=>crewCard(c,false)).join('')}<p class="fine">Hiring someone for a role you already fill replaces them. Salaries are paid at the start of each season.</p>`}
 el.innerHTML=`<div class="ph"><div><h3>Studio</h3><div class="sub">Season ${CAR.season} · HQ level ${STU.hq} · earned ${money(STU.cashTotal)} all time</div></div><span class="pill gold">${money(STU.cash)}</span></div>
 <div class="sttabs">${[['board','Production'],['villa','Villa & HQ'],['crew','Crew']].map(([k,n])=>`<button data-st="${k}" class="${stTab===k?'on':''}">${n}</button>`).join('')}</div>${body}${CAR.preview?`<button class="pbtn ghost" id="stFinish">Preview: finish all timers</button>`:''}`;
 el.querySelectorAll('[data-st]').forEach(b=>b.addEventListener('click',()=>{stTab=b.dataset.st;renderStudio()}));
 el.querySelectorAll('[data-task]').forEach(b=>b.addEventListener('click',()=>{const t=TASKS[b.dataset.task];if(STU.cash<t.cost||busy('desk')>=deskSlots())return;STU.cash-=t.cost;addJob('desk',b.dataset.task,null,t.n,t.hrs)}));
 el.querySelectorAll('[data-fac]').forEach(b=>b.addEventListener('click',()=>{const k=b.dataset.fac,n=flv(k)+1,c=facCost(k,n);if(STU.cash<c||busy('build')>=buildSlots())return;STU.cash-=c;addJob('build','fac',k,`${FAC[k].n} L${n}`,facMin(n)/60)}));
 el.querySelectorAll('[data-hq]').forEach(b=>b.addEventListener('click',()=>{const n=STU.hq+1;if(STU.cash<HQCOST[n]||busy('build')>=buildSlots())return;STU.cash-=HQCOST[n];addJob('build','hq',n,`Studio HQ L${n}`,HQHRS[n])}));
 el.querySelectorAll('[data-collect]').forEach(b=>b.addEventListener('click',()=>{const j=STU.jobs.find(x=>x.id===b.dataset.collect);if(j&&Date.now()>=j.end)finishJob(j)}));
 el.querySelectorAll('[data-hire]').forEach(b=>b.addEventListener('click',()=>{const c=pool.list.find(x=>x.id===b.dataset.hire);if(!c||STU.cash<c.cost)return;const old=crewOf(c.role);if(!old&&STU.crew.length>=crewCap()){toast(`Crew is full at HQ level ${STU.hq}. Upgrade HQ for more roles.`);return}STU.cash-=c.cost;if(old)STU.crew=STU.crew.filter(x=>x!==old);STU.crew.push(c);pool.list=pool.list.filter(x=>x!==c);saveCar();SFX.coin();toast(`${c.name} joins as your ${ROLES[c.role].n.toLowerCase()}.${old?` ${old.name} leaves.`:''}`);xp(10,'Hire');renderStudio()}));
 el.querySelectorAll('[data-train]').forEach(b=>b.addEventListener('click',()=>{const c=STU.crew.find(x=>x.id===b.dataset.train);if(!c)return;const cost=c.cost*.4*c.lvl;if(STU.cash<cost||busy('build')>=buildSlots())return;STU.cash-=cost;addJob('build','train',c.id,`Training ${c.name}`,2*c.lvl)}));
 const fb=document.getElementById('stFinish');if(fb)fb.addEventListener('click',()=>{STU.jobs.forEach(j=>j.end=Date.now()-1);saveCar();renderStudio();studioChip()})}
function jobFor(type,target){return STU.jobs.find(j=>j.type===type&&(target==null||j.target===target))}
function jobList(kind){const js=STU.jobs.filter(j=>j.kind===kind),slots=kind==='build'?buildSlots():deskSlots();let s='';js.forEach(j=>{const tot=j.end-j.start,left=j.end-Date.now(),pc=clamp(100-left/tot*100,0,100);s+=`<div class="job ${left<=0?'ready':''}" data-job="${j.id}"><div><b>${j.label}</b><span class="jt">${left<=0?'Ready':dur(left)}</span></div><i><em style="width:${pc}%"></em></i>${left<=0?`<button data-collect="${j.id}">Collect</button>`:''}</div>`});
 for(let i=js.length;i<slots;i++)s+=`<div class="job idle"><b>${kind==='build'?'Build crew':'Desk'} free</b><span>${kind==='build'?'Upgrade a facility, HQ or train crew':'Start a task below'}</span></div>`;return s}
function tickStudio(){STU.jobs.forEach(j=>{const el=document.querySelector(`[data-job="${j.id}"]`);if(!el)return;const left=j.end-Date.now();if(left<=0&&!el.classList.contains('ready')){renderStudio();return}const t=el.querySelector('.jt');if(t)t.textContent=dur(left);const e=el.querySelector('em');if(e)e.style.width=clamp(100-left/(j.end-j.start)*100,0,100)+'%'})}
function crewCard(c,mine){const R=ROLES[c.role],art=(()=>{try{return char(c,{})}catch(e){return ''}})(),s=c.stars*(1+(c.lvl-1)*.25),tr=jobFor('train',c.id);
 return `<div class="crew ${c.rar.toLowerCase()}"><svg viewBox="0 -6 120 222" aria-hidden="true">${art}</svg><div><b>${c.name} <small>${c.rar} ${'★'.repeat(c.stars)}</small></b><span>${R.n} · ${c.spName}${mine?` · level ${c.lvl}`:''}</span><em>${R.e(s)}</em><small>${mine?`Salary ${money(c.salary)} a season`:`Hire ${money(c.cost)} · salary ${money(c.salary)}/season`}${!mine&&crewOf(c.role)?` · replaces ${crewOf(c.role).name}`:''}</small></div>${mine?(tr?`<em class="tr">Training… ${dur(tr.end-Date.now())}</em>`:c.lvl<5?`<button data-train="${c.id}" ${STU.cash<c.cost*.4*c.lvl||busy('build')>=buildSlots()?'disabled':''}>Train · ${money(c.cost*.4*c.lvl)} · ${2*c.lvl}h</button>`:'<em class="tr">Max level</em>'):`<button data-hire="${c.id}" ${STU.cash<c.cost?'disabled':''}>Hire</button>`}</div>`}
/* onboarding: the studio opens on day 4 with everything else */
PLG.pStudio=['casting','The Studio'];obNav();
/* preview switch in the menu */
document.getElementById('tsMenu').addEventListener('click',()=>{setTimeout(()=>{const t=sheet.querySelector('.tools9');if(!t)return;const rt=t.querySelector('[data-t10="rt"]');if(rt)rt.remove();t.insertAdjacentHTML('beforeend',`<button data-t12="preview" class="${CAR.preview?'on':''}"><b>Preview mode ${CAR.preview?'on':'off'}</b><span>For testing: skip time and finish timers instantly. Off means the villa follows the real clock.</span></button>`);
 t.querySelector('[data-t12]').addEventListener('click',()=>{CAR.preview=!CAR.preview;saveCar();clockMode();closeSheet();renderTime();toast(CAR.preview?'Preview mode on: tap the clock to skip ahead.':'Real time on: the villa follows the clock. Episodes air at 8pm.')})},0)});
studioChip();
window.__test=Object.assign(window.__test||{},{studio:()=>STU,finishJobs:()=>{STU.jobs.forEach(j=>j.end=Date.now()-1)},addCash:n=>{STU.cash+=n}});
