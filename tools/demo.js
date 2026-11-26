/* ===== demo mode: click through days and nights, trigger big moments, preview any season ===== */
(function(){
const ph=document.querySelector('.phone');if(!ph)return;
document.head.insertAdjacentHTML('beforeend',`<style>
.demobar{max-width:420px;margin:0 auto 14px;padding:12px;border-radius:18px;background:#241A2E;color:#FFF1E6;font:600 13px Manrope,Inter,sans-serif;box-shadow:0 10px 30px rgba(36,26,46,.25)}
.demobar .dh{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:10px}
.demobar .dh b{font:800 11px Manrope,Inter,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#F6C35B}
.demobar .dh span{font-weight:700;font-size:14px}
.demobar .row{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-bottom:8px}
.demobar .row.three{grid-template-columns:repeat(3,minmax(0,1fr))}
.demobar button,.demobar select{min-height:42px;border-radius:12px;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.06);color:#FFF1E6;font:700 12.5px Manrope,Inter,sans-serif;cursor:pointer;padding:0 8px}
.demobar button.main{background:#F6C35B;color:#241A2E;border-color:#F6C35B;font-size:14px}
.demobar button:disabled{opacity:.45;cursor:default}
.demobar select{width:100%;appearance:none;text-align:center}
.demobar .ft{display:flex;gap:8px;align-items:center;justify-content:space-between;margin-top:2px;color:#CDB9C8;font-size:11.5px;font-weight:600}
.demobar .ft button{min-height:30px;font-size:11.5px;padding:0 10px}
</style>`);
const bar=document.createElement('div');bar.className='demobar';bar.id='demobar';ph.parentNode.insertBefore(bar,ph);
bar.innerHTML=`<div class="dh"><b>Demo mode</b><span id="dmNow"></span></div>
<div class="row"><button class="main" id="dmNext"></button><button id="dmDay">Next day ⏭</button></div>
<div class="row three"><button id="dmEp">▶ Tonight</button><button id="dmBomb">Bombshell</button><button id="dmRc">Recoupling</button></div>
<div class="row"><button id="dmFin">Jump to the finale</button><select id="dmSeason" aria-label="Preview a season">${[1,2,3,4,5,6,7,8,9,10].map(n=>`<option value="${n}">Season ${n} features</option>`).join('')}<option value="99">All features</option></select></div>
<div class="ft"><span id="dmMsg">Tap anything in the phone. Use these to move time.</span><button id="dmReset">Reset demo</button></div>`;
const $=id=>document.getElementById(id);
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
let busy=false;
const isOn=(id,c='on')=>{const e=document.getElementById(id);return !!(e&&e.classList.contains(c))};
function clearScreen(){try{closeSheet()}catch(e){}if(VS.open)try{closeLoc()}catch(e){}if(isOn('iroom'))try{$('ivBack').click()}catch(e){}
 document.querySelectorAll('.payoff.on').forEach(e=>e.classList.remove('on'));if(isOn('lad'))$('lad').classList.remove('on');
 if(document.querySelector('.pl.on')&&document.querySelector('.pl.on').dataset.place!=='villa')goPlace('villa')}
async function resolve(){/* auto-play anything that popped up, for fast-forwards */
 for(let k=0;k<60;k++){await sleep(220);
  if(isOn('arena')){const go=$('chGo'),nx=$('chNext'),dn=$('chDone');if(go){const p=document.querySelector('#arena [data-chp]');if(p&&!document.querySelector('#arena [data-chp].on'))p.click();go.click();continue}if(nx){nx.click();continue}if(dn){dn.click();continue}const b=document.querySelector('#arena .lback,#arena .x');if(b){b.click();continue}}
  if(isOn('ep','open')){const s=$('epSkip');if(s){s.click();continue}}
  if(isOn('scn')){try{scSkipNow()}catch(e){}continue}
  if(sheet.classList.contains('open')||document.querySelector('.payoff.on')){clearScreen();continue}
  if(isOn('career')){const c=$('cBack');if(c)c.click();continue}
  break}}
async function step(auto){clearScreen();const before=VS.t;$('timeCtl').click();await sleep(400);if(auto)await resolve();return VS.t!==before}
function label(){const T=TIMES[VS.t],nx=TIMES[(VS.t+1)%4];$('dmNow').textContent=`S${CAR.season} · Day ${VS.day} of 21 · ${T}`;
 const n=$('dmNext');if(!busy)n.textContent=VS.t===3?`Next morning (day ${Math.min(21,VS.day+1)}) ›`:`Next: ${nx} ›`;
 bar.querySelectorAll('button').forEach(b=>{if(b.id!=='dmReset')b.disabled=busy});$('dmSeason').disabled=busy;$('dmSeason').value=String(CAR.ladderSim||CAR.season)}
setInterval(label,500);
const msg=t=>{$('dmMsg').textContent=t};
async function run(fn){if(busy)return;busy=true;label();window.__noScenes=true;try{await fn()}catch(e){console.warn('demo',e)}window.__noScenes=false;busy=false;label()}
$('dmNext').addEventListener('click',()=>{if(busy)return;clearScreen();$('timeCtl').click();msg(VS.t===1?'Afternoon. Challenges start now on even days.':VS.t===2?'Golden hour: recouplings happen tonight on days 4, 8, 12, 16 and 20.':VS.t===3?'Night. Tap ▶ Tonight to watch the episode.':'A new morning. Check the brief and the cards on the villa.')});
$('dmDay').addEventListener('click',()=>run(async()=>{const d=VS.day;msg('Fast-forwarding to the next morning…');for(let k=0;k<6&&VS.day===d;k++)await step(true);msg(`Day ${VS.day}. Everything that happened is in the log and tonight’s episode.`)}));
$('dmEp').addEventListener('click',()=>run(async()=>{for(let k=0;k<4&&VS.t!==3;k++)await step(true);clearScreen();await sleep(300);window.__noScenes=false;busy=false;$('watch').click();msg('Tonight’s episode. Tap Next scene to skip ahead.')}));
$('dmBomb').addEventListener('click',()=>{if(busy)return;clearScreen();const ok=special('bomb');msg(ok===false?'No bombshells left on the bench this season.':'A bombshell just walked in. Close the card to see the entrance.')});
$('dmRc').addEventListener('click',()=>run(async()=>{ST.rcDay=null;ST.rcEarly=VS.day;try{rcChip()}catch(e){}for(let k=0;k<4&&VS.t!==2;k++)await step(true);clearScreen();try{rcChip()}catch(e){}msg('Recoupling tonight. Tap the recoupling card on the villa.')}));
$('dmFin').addEventListener('click',()=>run(async()=>{if(!confirm('Fast-forward the whole season to day 21? Challenges and recouplings play themselves on the way.'))return;for(let k=0;k<100&&!(VS.day>=21&&VS.t>=2)&&!ST.finale;k++){msg(`Fast-forwarding… day ${VS.day} of 21`);await step(true)}clearScreen();msg('Final day. Look for the finale card, or watch tonight’s episode.')}));
$('dmSeason').addEventListener('change',e=>{const n=+e.target.value;CAR.ladderSim=n;CAR.ladderSeen=99;saveCar();ladderApply();if(n<=10)showLadder(n);msg(n>10?'Every feature is open.':`Showing what a player has in Season ${n}.`)});
$('dmReset').addEventListener('click',()=>{if(!confirm('Reset the demo and start a fresh season?'))return;try{localStorage.removeItem(CK);localStorage.removeItem(SK)}catch(e){}location.reload()});
label();
setTimeout(()=>{try{(ph.parentNode.closest('section')||bar).scrollIntoView({block:'start'})}catch(e){}},600);
})();
