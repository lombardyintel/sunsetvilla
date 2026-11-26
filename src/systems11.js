
/* ---------- systems 11: scheduled recouplings, varied stirs, harder affection, automatic bombshells ---------- */
/* ---------- recouplings run on a schedule ---------- */
const RCDAYS=[4,8,12,16,20];const isRcNight=()=>RCDAYS.includes(VS.day)||ST.rcEarly===VS.day;
const nextRc=()=>RCDAYS.find(d=>d>=VS.day&&!(d===VS.day&&ST.rcDay===VS.day))||null;
NOTEIDS.push('rcchip');
function rcChip(){let el=document.getElementById('rcchip');const show=isRcNight()&&ST.rcDay!==VS.day&&!ST.finale;if(!show){if(el)el.remove();return}
 if(!el){el=document.createElement('button');el.id='rcchip';el.className='ivreq chchip rcc';document.getElementById('villa').appendChild(el);el.addEventListener('click',()=>{if(VS.t>=2)recoupleSetup();else toast('The recoupling happens at golden hour, at the fire pit.')})}
 el.innerHTML=`<span class="pulse" style="background:#E5484D"></span><b>Recoupling tonight</b><small>${VS.t>=2?'Tap to start at the fire pit':'Golden hour · lock your predictions then'}</small>`}
const _sa11=startAct;startAct=function(k,i){const a=ACTS[k][i];if(a&&a.special&&!isRcNight()){const n=nextRc();toast(n?`The next recoupling is on day ${n}. Not your call.`:'No more recouplings this season.');return}_sa11(k,i)};
document.getElementById('timeCtl').addEventListener('click',()=>{setTimeout(()=>{rcChip();if(isRcNight()&&VS.t===2&&ST.rcDay!==VS.day&&!CAR.offseason&&!(CAR.onb&&CAR.onb.on)){toast('Islanders, gather at the fire pit. It’s recoupling night.');setTimeout(()=>{if(!CH.on&&ST.rcDay!==VS.day)recoupleSetup()},1400)}},2000)});
const _rr11=runRecouple;runRecouple=function(){_rr11();setTimeout(rcChip,500)};
BEATL.rc='Recoupling';
/* ---------- the producer stir: true or invented, and it can backfire ---------- */
function stirOpts(c){const id=c.id,p=COUPLES[id];if(!p)return [];const out=[];const todays=VS.log.filter(l=>l.meta&&l.meta.ids&&l.meta.ids.includes(p)&&!l.meta.ids.includes(id)).reverse();
 const tl=todays.find(l=>l.meta.ids.some(x=>x!==p&&byId[x]));if(tl){const o=tl.meta.ids.find(x=>x!==p&&byId[x]),kd=tl.meta.kind;const verb=kd==='date'?`went on a date with ${nm(o)}`:kd==='game'?`was paired with ${nm(o)} in the challenge`:kd==='conf'?`talked about ${nm(o)} in this chair`:`spent the ${TIMES[VS.t].toLowerCase()} with ${nm(o)} in the ${(tl.loc||'villa').toLowerCase()}`;out.push({k:'stirT',o,q:`Did you know ${nm(p)} ${verb} today?`})}
 const o2=topOther(p)||pickV(x=>x!==id&&x!==p),seed=(VS.day*7+id.length*3+VS.t)%9;
 const R=[`${nm(p)} told the kitchen you're “a bit much.” Thoughts?`,`Someone heard ${nm(p)} say ${nm(o2)} is exactly their type.`,`${nm(p)} asked ${nm(o2)} to save them a seat at the fire pit.`,`${nm(o2)} says ${nm(p)} has been flirting with them all week.`,`${nm(p)}'s heart rate jumped when ${nm(o2)} walked in this morning.`,`Word is ${nm(p)} is thinking about switching to ${nm(o2)}.`,`${nm(p)} said you'd be the first to switch.`,`${nm(o2)} thinks you're only in here for the prize.`,`${nm(p)} laughed when someone asked if you two are serious.`][seed];
 out.push({k:'stirL',o:o2,q:R});return out}
const IVS=IVQ.findIndex(q=>q.k==='stir');if(IVS>=0)IVQ.splice(IVS,1);
IVQ.push({k:'stirT',q:c=>{const o=stirOpts(c).find(x=>x.k==='stirT');return o?`Stir (true): “${o.q}”`:null},cost:3},{k:'stirL',q:c=>{const o=stirOpts(c).find(x=>x.k==='stirL');return o?`Stir (made up): “${o.q}”`:null},cost:2});
const _iva11=ivAnswer;ivAnswer=function(k,x){if(k!=='stirT'&&k!=='stirL')return _iva11(k,x);const c=byId[VI.id],id=c.id,p=COUPLES[id],opt=stirOpts(c).find(o=>o.k===k);stat('stir');
 const fiery=c.temper==='Fiery',sens=c.temper==='Sensitive',trust=AFF[id][p]||50;let note,cat='iv_stirred',expr='shock';
 if(k==='stirT'){addAff(id,p,-(6+(fiery?3:0)));if(opt)bump(id,opt.o,'rival',5);moodUp([id],-8);addBuzz(.35);VI.star=true;note='It’s true, and they know it. Expect fireworks tonight.'}
 else{const believe=Math.random()<(.35+(sens?.15:0)+(trust<55?.2:0)-(c.game==='Strategic'?.15:0));if(believe){addAff(id,p,-4);if(opt)bump(id,opt.o,'rival',3);moodUp([id],-5);addBuzz(.25);VI.star=true;note='They bought it. For now.'}
  else{cat='iv_deflect';expr='smirk';ST.known[id]=ST.known[id]||{};ST.known[id].guard=VS.day+2;addAff(id,p,2);note='They don’t believe you, and now they don’t trust the interview room. They’ll dodge for two days.'}}
 const t=say(cat,c,{partnerId:p,themId:p,otherId:opt&&opt.o},true);VI.said.push([id,t]);VI.expr=expr;return {t,note}};
const _hon=honest;honest=function(c){const k=ST.known[c.id];if(k&&k.guard>=VS.day)return false;return _hon(c)};
/* ---------- affection is harder to win ---------- */
const HEARTR={Loyal:.45,'Slow-burn':.55,'Hopeless romantic':.8,Flirty:1.05};ST.pairGain={};
const _aa11=addAff;addAff=function(a,b,d){if(d>0&&AFF[a]&&AFF[a][b]!==undefined&&!SYNC.applying){const couple=COUPLES[a]===b;let m=couple?1:(COUPLES[a]?(HEARTR[byId[a].heart]||.8):.9);m*=couple?1:clamp(chemScore(byId[a],byId[b])/55,.4,1.3);d*=m*(1-AFF[a][b]/115);
 const key=VS.day+':'+a+'>'+b,cap=couple?14:9,got=ST.pairGain[key]||0;d=Math.max(0,Math.min(d,cap-got));ST.pairGain[key]=got+d}_aa11(a,b,d)};
document.getElementById('timeCtl').addEventListener('click',()=>{if(VS.t===0)ST.pairGain={}});
/* dates can flop */
const _li11=logIt;logIt=function(l,t,s,m){_li11(l,t,s,m);if(!m||m.kind!=='date'||SYNC.applying||!m.ids||m.ids.length<2)return;const [a,b]=m.ids;if(!byId[a]||!byId[b])return;
 const sc=chemScore(byId[a],byId[b])*.6+((AFF[a][b]+AFF[b][a])/2-45)*.6+Math.random()*30;const out=sc>62?['spark',4,'The date sparked.']:sc>42?['fine',0,'The date was fine. Nice, not magic.']:sc>30?['awkward',-5,'The date was awkward. Long silences.']:['flop',-10,'The date was a flop. Neither wants a second one.'];
 if(out[1]){_aa11(a,b,out[1]);_aa11(b,a,out[1])}if(out[1]<0)moodUp([a,b],-4);m.outcome=out[0];setTimeout(()=>toast(`${nm(a)} + ${nm(b)}: ${out[2]}`),900);syncLove()};
/* ---------- bombshells arrive on their own ---------- */
const TWI=TWISTS.findIndex(t=>t[0]==='bomb');if(TWI>=0)TWISTS.splice(TWI,1);
SPECIALS.bomb=function(){const pool=bombPool();if(!pool.length)return null;let id=ST.bombHint&&pool.includes(ST.bombHint)?ST.bombHint:null;if(!id){const w=pool.map(i=>[i,1+((byId[i].stars||0)*.6)+(byId[i].allStar?3:0)]);let r=Math.random()*w.reduce((s,x)=>s+x[1],0);for(const [i,x] of w){if((r-=x)<0){id=i;break}}id=id||pool[0]}ST.bombHint=null;
 const lines=enterBomb(id);return {title:`${nm(id)} walks in`,tag:'Bombshell · the network’s call',text:`Nobody knew this was coming, including you. ${nm(id)} is in the villa.`,extra:`<div class="mems">${lines}</div>`,lines:[],log:null,buzz:.3}};
document.getElementById('timeCtl').addEventListener('click',()=>{if(VS.t!==0||VS.day<5||VS.skipRandom||(CAR.onb&&CAR.onb.on)||CAR.offseason||BEATS[VS.day]==='bomb')return;const n=(ST.stats.bombs||0);if(n<3&&Math.random()<.14&&bombPool().length){VS.skipRandom=true;setTimeout(()=>special('bomb'),1600)}});
/* the bombshell prop is now a request: the network chooses who */
SHELF.Arrivals.forEach(x=>{if(/bombshell/i.test(x[2])||x[0]==='Bombshell')x[2]='Ask the network for an arrival. They choose who walks in.'});
/* show status: recoupling schedule */
const _ss11=showStatus;showStatus=function(){_ss11();const b=sheet.querySelector('.beats');if(b){const n=nextRc();b.insertAdjacentHTML('afterbegin',`<p><b>${n?'Day '+n:'–'}</b>Next recoupling (golden hour, automatic)</p>`);[...b.querySelectorAll('p')].forEach(p=>{if(/Every 4th/.test(p.textContent))p.remove()})}};
rcChip();
