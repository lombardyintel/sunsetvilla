/* ===== systems13: cooldowns. Islanders rest after interviews, villa actions rest after use ===== */
const CDH={iv:3,act:a=>a.cost>=15?4:a.cost>=8?2:a.cost?1.5:1};
ST.cd=ST.cd||{iv:{},act:{}};
const cdLive=()=>!!(CAR.rt&&CAR.rt.on);
/* story producer shortens every rest: 4% per power point, capped at 40% */
const cdCut=()=>Math.min(.4,(typeof cpow==='function'?cpow('story'):0)*.04);
function cdSet(type,key,hrs){ST.cd[type][key]={end:Date.now()+hrs*(1-cdCut())*3600e3,day:VS.day,t:VS.t,hrs};}
/* real time: wall clock. Preview and the guided first week: rests until the next time of day */
function cdLeft(type,key){const c=(ST.cd[type]||{})[key];if(!c)return 0;
 if(!cdLive())return (c.day===VS.day&&c.t===VS.t)?1:0;
 return Math.max(0,c.end-Date.now())}
function cdTxt(ms){if(!cdLive())return 'later today';const m=Math.ceil(ms/60000);return m>=60?`${Math.floor(m/60)}h${m%60?' '+(m%60)+'m':''}`:m+'m'}
const actKey=(k,i)=>k+'|'+i;

/* ---- interviews ---- */
const _oi13=openInterview;
openInterview=function(id){const l=cdLeft('iv',id);if(l){toast(`${byId[id].name} needs a break from the cameras. Ready in ${cdTxt(l)}.`);return}
 VI.id=null;_oi13(id);if(VI.id===id)cdSet('iv',id,CDH.iv)};
/* islander-requested interviews skip the rest (they asked) but still start one */
const _or13=openRequest;openRequest=function(id){_or13(id);cdSet('iv',id,CDH.iv)};

/* show the rest on the islander file */
const _os13=openSheet;
openSheet=function(id){_os13(id);const b=sheet.querySelector('[data-act="chat"]');if(!b)return;const l=cdLeft('iv',id);
 if(l){b.disabled=true;b.classList.remove('main');b.innerHTML=`Resting from interviews · ${cdTxt(l)}`}};

/* ---- villa actions ---- */
const _sa13=startAct;
startAct=function(k,i){const l=cdLeft('act',actKey(k,i));if(l){toast(`${ACTS[k][i].n} needs to rest. Ready in ${cdTxt(l)}.`);return}_sa13(k,i)};
const _ra13=runAct;
runAct=function(k,i,p,a,b){cdSet('act',actKey(k,i),CDH.act(ACTS[k][i]));_ra13(k,i,p,a,b)};
function cdPaint(){const lv=document.getElementById('locView');if(!lv||!lv.classList.contains('on')||!VS.open)return;const k=VS.open;
 lv.querySelectorAll('.lact[data-a]').forEach(btn=>{const i=+btn.dataset.a,a=ACTS[k][i];if(!a)return;const l=cdLeft('act',actKey(k,i));
  const okT=!a.times||a.times.includes(VS.t);if(!okT)return;const sm=btn.querySelector('small');
  if(l){btn.disabled=true;btn.classList.add('rest');if(sm)sm.textContent=`Resting · ready in ${cdTxt(l)}`}
  else if(btn.classList.contains('rest')){btn.disabled=false;btn.classList.remove('rest');if(sm)sm.textContent=a.cost?a.cost+' reels':'Free'}})}
const _ol13=openLoc;openLoc=function(k){_ol13(k);cdPaint()};

/* ---- walking takes 5 minutes off every rest per 1,000 steps (same rule as studio crews) ---- */
let cdSteps=ST.steps.me;
setInterval(()=>{const d=ST.steps.me-cdSteps;cdSteps=ST.steps.me;if(d<0)return;if(d>=1000&&cdLive()){const ms=Math.floor(d/1000)*5*60000;let n=0;
 ['iv','act'].forEach(t=>Object.values(ST.cd[t]).forEach(c=>{if(c.end>Date.now()){c.end-=ms;n++}}));if(n)setTimeout(()=>toast('Your walk shortened the cast’s rest too.'),1800)}},3000);

/* ---- tell the player when someone is ready again ---- */
const cdSeen={};
setInterval(()=>{cdPaint();if(!cdLive())return;Object.entries(ST.cd.iv).forEach(([id,c])=>{const done=c.end<=Date.now();if(done&&!cdSeen[id]&&Date.now()-c.end<90000&&byId[id]&&!(ST.dumped||[]).includes(id)){cdSeen[id]=1;toast(`${byId[id].name} is ready for the interview room again.`)}if(!done)cdSeen[id]=0})},5000);

/* ---- persistence and shared seasons ---- */
const _ss13=snapState;snapState=function(){const o=_ss13();o.cd=ST.cd;return o};
const _as13=applyState;applyState=function(o){_as13(o);ST.cd=o&&o.cd?o.cd:(ST.cd||{iv:{},act:{}});ST.cd.iv=ST.cd.iv||{};ST.cd.act=ST.cd.act||{}};
(function(){const s=lsGet(SK);if(s&&s.data&&s.data.cd&&s.season===ST.season){ST.cd=s.data.cd;ST.cd.iv=ST.cd.iv||{};ST.cd.act=ST.cd.act||{}}})();
const _fs13=freshSeason;freshSeason=function(){const r=_fs13.apply(this,arguments);ST.cd={iv:{},act:{}};return r};

/* ---- studio: preview finish button clears rests; crew card shows the story producer's cut ---- */
document.addEventListener('click',e=>{if(e.target&&e.target.id==='stFinish'){ST.cd={iv:{},act:{}};cdPaint()}},true);
if(ROLES&&ROLES.story){const e0=ROLES.story.e;ROLES.story.e=s=>`${e0(s)} · cast rest ${Math.round(Math.min(.4,s*.04)*100)}% shorter`}

/* ---- style ---- */
document.head.insertAdjacentHTML('beforeend',`<style>.lact.rest{opacity:.55;background:repeating-linear-gradient(135deg,#FFF8EC 0 8px,#F6EAD6 8px 16px)}.lact.rest small{color:#5C5463}</style>`);

window.__test=Object.assign(window.__test||{},{cd:()=>ST.cd,clearCd:()=>{ST.cd={iv:{},act:{}}},cdLeft});

window.__sv13={CAR,ST,VS,VIDS,oi:id=>openInterview(id),os:id=>openSheet(id),ol:k=>openLoc(k),cs:()=>closeSheet(),cm:()=>clockMode()};
