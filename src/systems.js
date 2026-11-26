
/* ---------- systems: affection, character depth, recoupling, random events, storylines ---------- */
const VIDS=()=>VILLA.map(v=>v.id);
function couplesList(){const seen=new Set(),out=[];VIDS().forEach(a=>{const b=COUPLES[a];if(b&&!seen.has(a)&&!seen.has(b)){out.push([a,b]);seen.add(a);seen.add(b)}});return out}
const AFF={};
(function initAff(){const ids=VIDS();ids.forEach(a=>{AFF[a]={};ids.forEach(b=>{if(a===b)return;const s=typeof chemScore==='function'?chemScore(byId[a],byId[b]):40;AFF[a][b]=Math.round(4+s*0.32)})});
 couplesList().forEach(([a,b])=>{AFF[a][b]=62+Math.round(Math.random()*10);AFF[b][a]=60+Math.round(Math.random()*12)});
 Object.entries(THINK).forEach(([a,b])=>{if(b!=='prize'&&AFF[a]&&b!==COUPLES[a])AFF[a][b]=48+Math.round(Math.random()*8)});
 AFF.kai.nova=59;AFF.kai.juniper=63;AFF.nova.kai=55;AFF.ivy.bodhi=52;AFF.bodhi.ivy=44;AFF.leo.mabel=51;})();
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
function addAff(a,b,d){if(!AFF[a]||AFF[a][b]===undefined)return;AFF[a][b]=clamp(AFF[a][b]+d,0,100)}
function syncLove(){for(let i=RELS.length-1;i>=0;i--)if(RELS[i][2]==='love')RELS.splice(i,1);const ids=VIDS();ids.forEach((a,i)=>ids.slice(i+1).forEach(b=>{const A=AFF[a][b],B=AFF[b][a],avg=(A+B)/2;if(Math.max(A,B)>=50||avg>=42)RELS.push([a,b,'love',clamp((Math.max(avg,Math.max(A,B)-8)-36)/8,.8,5),Math.abs(A-B)>18])}))}
/* hook relationship bumps into affection */
const _bump=bump;bump=function(a,b,type,d){_bump(a,b,type,d);if(type==='love'){addAff(a,b,d*1.2);addAff(b,a,d*(.5+Math.random()*.9))}if(type==='rival'){addAff(a,b,-d*.4);addAff(b,a,-d*.4)}syncLove();checkArcs()};
/* dates booked from a contestant file */
picker.addEventListener('click',e=>{const b=e.target.closest('[data-loc]');if(!b||b.dataset.loc==='x'||!ST.date)return;const [a,c]=ST.date;if(AFF[a]&&AFF[c]){addAff(a,c,10);addAff(c,a,6+Math.random()*8);const p=COUPLES[a];if(p&&p!==c)addAff(p,a,-6);syncLove();checkArcs()}});
/* time passing: people who spend time together drift closer */
function drift(){const g={};VIDS().forEach(id=>{(g[VS.where[id]]=g[VS.where[id]]||[]).push(id)});Object.values(g).forEach(ids=>ids.forEach(a=>ids.forEach(b=>{if(a!==b)addAff(a,b,Math.random()*2.2)})));syncLove()}
/* the producer's read: approximate, sharper once you know someone's game */
function readOf(a,b){const k=(ST.known&&ST.known[a])||{},blur=k.game?3:byId[a].game==='Schemer'?14:9;const seed=(a.charCodeAt(0)*31+b.charCodeAt(1)*17+VS.day*7)%(2*blur+1)-blur;return clamp(Math.round(AFF[a][b]+seed),0,100)}
function leaning(id){return VIDS().filter(x=>x!==id).map(x=>({id:x,v:readOf(id,x),t:AFF[id][x]})).sort((p,q)=>q.v-p.v)}
function statusOf(id){const L=leaning(id),p=COUPLES[id];if(!p)return{label:'Single',cls:'warn'};const pv=readOf(id,p),top=L.find(x=>x.id!==p);const gap=pv-(top?top.v:0);
 if(gap>=15)return{label:'Secure',cls:'ok',txt:`All in on ${byId[p].name}.`};if(gap>=5)return{label:'Wobbling',cls:'mid',txt:`Mostly ${byId[p].name}, but ${byId[top.id].name} is getting closer.`};if(gap>=-4)return{label:'At risk',cls:'warn',txt:`Torn between ${byId[p].name} and ${byId[top.id].name}.`};return{label:'Leaning away',cls:'bad',txt:`Their head has turned toward ${byId[top.id].name}.`}}
/* deeper character file */
const _openSheet2=openSheet;
openSheet=function(id){
 const c=byId[id];if(!AFF[id]){_openSheet2(id);return}
 const k=ST.known[id]||{},L=leaning(id),p=COUPLES[id],st=statusOf(id),m=ST.mood[id]||70,en=ST.energy[id]||80,loc=LOC[VS.where[id]];
 const tr=(lab,key,shown)=>`<div><b>${lab}</b>${shown?c[key]:'<span class="unknown">Find out on the show</span>'}</div>`;
 const mem=VS.log.filter(l=>l.text.includes(c.name)).slice(-3).reverse();
 sheet.innerHTML=`<button class="x" data-act="close" aria-label="Close">×</button>
 <div class="chead"><svg viewBox="0 -6 120 222" width="54" height="96" aria-hidden="true">${char(c,{})}</svg><div><h3>${c.name}</h3><div class="meta">${c.spName} · ${c.job}</div><div class="stat2"><span>${loc?loc.name:''}</span><span>Mood <i><b style="width:${m}%;background:#FF6F91"></b></i></span><span>Energy <i><b style="width:${en}%;background:#4CC3C0"></b></i></span></div></div></div>
 <div class="cstat"><span class="pillst ${st.cls}">${st.label}</span>${p?`Coupled with <b>${byId[p].name}</b>`:'Single'}<span class="day">Day ${VS.day}</span></div>
 ${st.txt?`<p class="leantxt">${st.txt}</p>`:''}
 <div class="lab">Producer's read: who they're drawn to</div>
 <div class="affl">${L.slice(0,4).map(x=>`<div class="ar2"><span>${byId[x.id].name}${x.id===p?' <em>partner</em>':''}</span><i><b style="width:${x.v}%;background:${x.id===p?'#FF8A65':'#FF6F91'}"></b></i><span>≈${x.v}</span></div>`).join('')}</div>
 <div class="fine">${k.game?'You know their game, so this read is sharp.':'This is a read, not the truth. Reveal their Game trait for a sharper read.'}</div>
 <div class="traits">${tr('Heart','heart',true)}${tr('Vibe','vibe',true)}${tr('Temper','temper',k.temper)}${tr('Game','game',k.game)}</div>
 <div class="lab">Recent memories</div>${mem.length?`<div class="mems">${mem.map(l=>`<p><b>${l.time} · ${l.loc}</b> ${l.text}</p>`).join('')}</div>`:'<p class="fine" style="margin-top:0">Nothing filmed with them today.</p>'}
 <div class="btns"><button class="btn main" data-act="chat">Producer chat · 5 reels</button><button class="btn" data-act="date">Pick for a date</button><button class="btn" data-act="listen">Listen in</button><button class="btn" data-act="hear">Overhear</button></div>${ST.said?`<p class="say">${ST.said}</p>`:''}`;
 sheet.classList.add('open');
};
/* ---------- show status, storylines, ship ---------- */
ST.rating=6.8;ST.instinct=0;ST.ship=null;ST.done={};
const ARCS=[
 {id:'slow',name:'Slow burn: Ivy and Bodhi',prog:()=>Math.min(AFF.ivy.bodhi,AFF.bodhi.ivy)/72,pay:()=>['ivy','bodhi'],txt:'Ivy and Bodhi finally admit how they feel.'},
 {id:'tri',name:'Love triangle: Juniper, Kai and Nova',prog:()=>clamp(AFF.kai.nova/Math.max(1,AFF.kai.juniper),0,1),resolve:'recouple',txt:'The triangle comes to a head at the fire pit.'},
 {id:'vil',name:'Villain rise: Nova',prog:()=>clamp(RELS.filter(r=>r[2]==='rival'&&(r[0]==='nova'||r[1]==='nova')).reduce((a,r)=>a+r[3],0)/7,0,1),pay:()=>['nova','juniper'],txt:'Nova embraces the villain edit. The villa turns.'},
 {id:'leo',name:'Wildcard crush: Leo and Mabel',prog:()=>Math.min(AFF.leo.mabel,AFF.mabel.leo)/68,pay:()=>['leo','mabel'],txt:'Leo and Mabel stop pretending.'}
];
function payoff(arc,ids){if(ST.done[arc.id])return;ST.done[arc.id]=true;ST.rating=+(ST.rating+.8).toFixed(1);logIt(VS.open||'firepit',`Storyline payoff: ${arc.txt}`,true);
 const pb=document.getElementById('payoff');const lines=(ids||[]).map(i=>`<p><b>${byId[i].name}:</b> “${say('arc_payoff',byId[i],{themId:ids.find(x=>x!==i)},true)}”</p>`).join('');
 pb.innerHTML=`<button class="x" aria-label="Close">×</button><div class="evtag">Storyline payoff</div><h3>${arc.name}</h3><p>${arc.txt}</p>${lines}<div class="pgain">Ratings +0.8 · now ${ST.rating}</div>`;pb.classList.add('on');pb.querySelector('.x').onclick=()=>pb.classList.remove('on')}
function checkArcs(){ARCS.forEach(a=>{if(!a.resolve&&!ST.done[a.id]&&a.prog()>=1)payoff(a,a.pay())})}
document.getElementById('villa').insertAdjacentHTML('beforeend','<div class="payoff" id="payoff" role="dialog" aria-live="polite"></div>');
/* replace the log sheet with a full show status */
const logBtn=document.getElementById('logBtn');logBtn.setAttribute('aria-label','Show status and storylines');
logBtn.replaceWith(logBtn.cloneNode(true));
document.getElementById('logBtn').addEventListener('click',showStatus);
function showStatus(){ST.sel=null;const cps=couplesList();
 sheet.innerHTML=`<button class="x" data-act="close" aria-label="Close">×</button><h3>Show status</h3><div class="meta">Day ${VS.day} · ${TIMES[VS.t]}</div>
 <div class="kpis"><div><b>${ST.rating}</b><span>Ratings</span></div><div><b>${ST.instinct}</b><span>Producer instinct</span></div><div><b>${VS.log.length}</b><span>Moments today</span></div></div>
 <div class="lab">Storylines</div>${ARCS.map(a=>{const pr=Math.round(clamp(a.prog(),0,1)*100);return `<div class="arc"><div><b>${a.name}</b><span>${ST.done[a.id]?'Paid off':a.resolve&&pr>=80?'Ready to break at the recoupling':pr+'%'}</span></div><i><b style="width:${ST.done[a.id]?100:pr}%"></b></i></div>`}).join('')}
 <div class="lab">Your ship</div><p class="fine" style="margin:0 0 6px">Pick the couple you're rooting for. Every recoupling they survive earns instinct points.</p><div class="opts">${cps.map(([a,b])=>`<button data-ship="${a}|${b}" class="${ST.ship===a+'|'+b?'on':''}">${byId[a].name} + ${byId[b].name}</button>`).join('')}</div>
 <div class="lab">Today in the villa</div>${VS.log.length?`<div class="logl">${VS.log.slice().reverse().map(l=>`<p><b>${l.time} · ${l.loc}</b>${l.star?' <span class="tagx">★ key moment</span>':''}<br>${l.text}</p>`).join('')}</div>`:'<p class="fine">Nothing filmed yet.</p>'}`;
 sheet.classList.add('open');
 sheet.querySelectorAll('[data-ship]').forEach(b=>b.addEventListener('click',()=>{ST.ship=b.dataset.ship;showStatus();toast('Ship set. Rooting for them.')}))}
/* ---------- recoupling ---------- */
const SD={Flirty:12,Wildcard:12,'Hopeless romantic':6,Loyal:4};const LOY={Loyal:10,'Slow-burn':6,Flirty:0,'Hopeless romantic':5};
function recoupleSetup(){
 const cps=couplesList(),choosers=cps.map(p=>p[Math.random()<.5?0:1]),recv=cps.map(([a,b],i)=>choosers[i]===a?b:a);
 const unc=choosers.map(ch=>{const r=recv.map(x=>readOf(ch,x)).sort((a,b)=>b-a);return {ch,gap:r[0]-r[1]}}).sort((a,b)=>a.gap-b.gap).slice(0,3).map(x=>x.ch);
 VS.rc={choosers,recv,pred:{},unc};renderPredict()}
function renderPredict(){const R=VS.rc;
 sheet.innerHTML=`<button class="x" data-act="close" aria-label="Close">×</button><div class="evtag">Recoupling night</div><h3>Call it before it happens</h3><p class="fine">Tonight ${R.choosers.map(i=>byId[i].name).join(', ')} choose. Predict the three hardest calls. Right calls earn instinct; wrong ones are tonight's shocks.</p>
 ${R.unc.map(ch=>{const opts=R.recv.map(x=>({x,v:readOf(ch,x)})).sort((a,b)=>b.v-a.v).slice(0,3);return `<div class="prow"><b>${byId[ch].name} picks...</b><div class="opts">${opts.map(o=>`<button data-pr="${ch}|${o.x}" class="${R.pred[ch]===o.x?'on':''}">${byId[o.x].name}${o.x===COUPLES[ch]?' <small>(partner)</small>':''}</button>`).join('')}</div></div>`}).join('')}
 <button class="pbtn" id="rcGo" ${Object.keys(R.pred).length<R.unc.length?'disabled':''}>Start the recoupling</button>`;
 sheet.classList.add('open');
 sheet.querySelectorAll('[data-pr]').forEach(b=>b.addEventListener('click',()=>{const [c,x]=b.dataset.pr.split('|');R.pred[c]=x;renderPredict()}));
 const go=document.getElementById('rcGo');if(go)go.addEventListener('click',runRecouple)}
function runRecouple(){const R=VS.rc,taken=new Set(),res=[];const order=R.choosers.slice().sort(()=>Math.random()-.5);
 order.forEach(ch=>{const c=byId[ch],sd=SD[c.heart]||SD[c.vibe]||8,old=COUPLES[ch];let best=null,bs=-1e9;R.recv.forEach(x=>{if(taken.has(x))return;const noise=(Math.random()+Math.random()+Math.random()-1.5)*sd;const sc=AFF[ch][x]+noise+(x===old?(LOY[c.heart]??4):0);if(sc>bs){bs=sc;best=x}});taken.add(best);
  const readTop=R.recv.map(x=>({x,v:readOf(ch,x)})).sort((a,b)=>b.v-a.v)[0].x;res.push({ch,pick:best,old,switched:best!==old,surprise:best!==readTop,pred:R.pred[ch]})});
 const oldC=Object.assign({},COUPLES);res.forEach(r=>{COUPLES[r.ch]=r.pick;COUPLES[r.pick]=r.ch});
 res.forEach(r=>{if(r.switched){RIVAL[r.old]=r.pick;addAff(r.old,r.ch,-15);addAff(r.pick,r.ch,8)}else{addAff(r.pick,r.ch,6)}});
 let right=0,shocks=0;res.forEach(r=>{if(r.pred){if(r.pred===r.pick)right++;else shocks++}else if(r.switched||r.surprise)shocks++});
 ST.instinct+=right*10;ST.rating=+(ST.rating+shocks*.3+res.filter(r=>r.switched).length*.2).toFixed(1);
 if(ST.ship){const [a,b]=ST.ship.split('|');if(COUPLES[a]===b){ST.instinct+=15}}
 syncLove();
 sheet.innerHTML=`<button class="x" data-act="close" aria-label="Close">×</button><div class="evtag">Recoupling night · live</div><h3>The fire pit</h3><div class="rclist" id="rcl"></div><div id="rcsum"></div>`;
 const box=document.getElementById('rcl');
 res.forEach((r,i)=>setTimeout(()=>{const c=byId[r.ch],p=byId[r.pick],o=byId[r.old];const line=r.switched?say('switch_speech',c,{themId:r.pick,partnerId:r.old},true):say('recouple_stay',c,{themId:r.pick},true);
  const rx=byId[rnd(VIDS().filter(x=>x!==r.ch&&x!==r.pick))];const react=r.switched?`<p class="react"><b>${rx.name}:</b> “${say('recouple_shock',rx,{},true)}”</p>`:'';
  const pr=r.pred?`<span class="tagx" style="background:${r.pred===r.pick?'#2F9E7A':'#E5484D'}">${r.pred===r.pick?'You called it':'You said '+byId[r.pred].name}</span>`:'';
  box.insertAdjacentHTML('beforeend',`<div class="rc${r.switched?' sw':''}"><div class="rch"><b>${c.name}</b> → <b>${p.name}</b> ${r.switched?'<span class="shock">SHOCK</span>':''}${pr}</div><p>“${line}”</p>${react}</div>`);
  logIt('firepit',`Recoupling: ${c.name} ${r.switched?'switches from '+o.name+' to':'stays with'} ${p.name}.`,r.switched);
  if(i===res.length-1)setTimeout(()=>{const tri=ARCS.find(a=>a.id==='tri');if(!ST.done.tri&&(res.some(x=>x.ch==='kai'||x.pick==='kai'))){const kaiNow=COUPLES.kai;payoff(Object.assign({},tri,{txt:kaiNow==='nova'?'Kai picks Nova. Juniper is left reeling.':kaiNow==='juniper'?'Kai stays with Juniper. Nova has to watch.':'Kai ends up with '+byId[kaiNow].name+'. Nobody saw that coming.'}),['kai',kaiNow])}
   document.getElementById('rcsum').innerHTML=`<div class="kpis"><div><b>${right}/${Object.keys(R.pred).length}</b><span>You called</span></div><div><b>${shocks}</b><span>Shocks</span></div><div><b>${ST.rating}</b><span>Ratings</span></div></div><div class="lab">New couples</div><p class="fine" style="margin-top:0">${couplesList().map(([a,b])=>byId[a].name+' + '+byId[b].name).join(' · ')}</p>`;checkArcs();drawVilla();renderTime()},900)},i*1700));
}
ACTS.firepit.push({n:'Hold the recoupling',cost:0,times:[2,3],special:true});
const _startAct=startAct;startAct=function(k,i){const a=ACTS[k][i];if(a&&a.special){recoupleSetup();return}_startAct(k,i)};
/* ---------- random events ---------- */
const pickV=f=>rnd(VIDS().filter(f||(()=>true)));
const EVENTS=[
 {id:'letter',t:'Letters from home',w:2,go(){const a=pickV(),f=pickV(x=>x!==a),p=COUPLES[a],cr=leaning(a).find(x=>x.id!==p);const sway=Math.random()<.45;if(sway&&p){addAff(a,p,-6);if(cr)addAff(a,cr.id,5)}else if(p)addAff(a,p,4);moodUp([a],-4);
  return {text:`${byId[a].name} reads a letter from home${sway?'. Something in it makes them look twice at '+(cr?byId[cr.id].name:'someone else'):' and holds '+(p?byId[p].name:'everyone')+' a little tighter'}.`,lines:[[a,'ev_letter_home',{themId:cr?cr.id:p}],[a,'ev_letter_home',{themId:p}],[f,'comfort',{themId:a}]],who:a}}},
 {id:'heat',t:'Heatwave',w:2,times:[1],go(){const xs=VIDS().sort(()=>Math.random()-.5).slice(0,3);moodUp(VIDS(),-5);bump(xs[0],xs[1],'rival',5);return {text:'A heatwave hits. Tempers are shorter than the shade.',lines:xs.map(x=>[x,'ev_heatwave',{}]),who:xs[0]}}},
 {id:'power',t:'Power cut',w:2,times:[3],go(){const a=pickV(x=>COUPLES[x]),b=leaning(a).find(x=>x.id!==COUPLES[a]).id;addAff(a,b,8);addAff(b,a,6);return {text:`The lights go out. When they come back on, ${byId[a].name} and ${byId[b].name} are sitting very close.`,lines:[[a,'ev_power_cut',{themId:b}],[b,'ev_power_cut',{themId:a}],[pickV(x=>x!==a&&x!==b),'ev_power_cut',{themId:a,otherId:b}]],who:a}}},
 {id:'kiss',t:'Secret kiss spotted',w:2,times:[2,3],choice:true,go(){const a=pickV(x=>COUPLES[x]&&leaning(x).find(y=>y.id!==COUPLES[x]).v>40),b=leaning(a).find(x=>x.id!==COUPLES[a]).id,p=COUPLES[a],w=pickV(x=>![a,b,p].includes(x));addAff(a,b,10);addAff(b,a,8);
  VS.ev={a,b,p,w};return {text:`${byId[w].name} saw ${byId[a].name} kiss ${byId[b].name} on the terrace. ${byId[p].name} has no idea.`,lines:[[w,'ev_kiss_spotted',{themId:a,otherId:b,partnerId:p}],[w,'ev_kiss_spotted',{themId:a,otherId:b,partnerId:p}]],who:a,choices:[['tell','Let them tell '+byId[p].name,0],['bury','Bury the footage',10]]}}},
 {id:'home',t:'Homesick',w:1,choice:true,go(){const a=pickV(x=>byId[x].temper==='Sensitive')||pickV();moodUp([a],-15);VS.ev={a};return {text:`${byId[a].name} is homesick and quietly talking about leaving.`,lines:[[a,'ev_homesick',{}],[a,'ev_homesick',{}]],who:a,choices:[['comfort','Producer chat to comfort them',5],['wait','Let it play out',0]]}}},
 {id:'diary',t:'A diary page leaks',w:1,go(){const a=pickV(x=>COUPLES[x]),p=COUPLES[a],cr=leaning(a).find(x=>x.id!==p);addAff(p,a,-9);bump(a,p,'rival',4);return {text:`A page from ${byId[a].name}'s diary is going round the villa. It mentions ${cr?byId[cr.id].name:'someone'}. ${byId[p].name} has read it.`,lines:[[pickV(x=>x!==a),'ev_leaked',{themId:a,partnerId:p}],[a,'ev_leaked',{themId:cr?cr.id:p}],[p,'jealous_confront',{themId:a,rivalId:cr?cr.id:null}]],who:a}}},
 {id:'gecko',t:'Gerald is loose',w:1,go(){moodUp(VIDS(),5);const xs=VIDS().sort(()=>Math.random()-.5).slice(0,3);return {text:'Gerald the gecko has got into the bedroom. Chaos. Joy. Mostly chaos.',lines:xs.map(x=>[x,'ev_gecko',{themId:xs[0]}]),who:xs[0]}}},
 {id:'ex',t:'A message from an ex',w:1,go(){const a=pickV(x=>COUPLES[x]),p=COUPLES[a],sure=Math.random()<.5;addAff(a,p,sure?6:-8);return {text:`${byId[a].name} gets a message from an ex. It leaves them ${sure?'more sure about '+byId[p].name:'less sure about everything'}.`,lines:[[a,'ev_ex_message',{partnerId:p}],[a,'ev_ex_message',{partnerId:p}],[p,sure?'reassure':'jealous_confront',{themId:a}]],who:a}}},
 {id:'swap',t:'Villa text: date swap',w:1,times:[0,1],go(){const a=pickV(x=>COUPLES[x]),b=pickV(x=>x!==a&&x!==COUPLES[a]&&COUPLES[x]);addAff(a,b,7);addAff(b,a,7);return {text:`A text sends ${byId[a].name} on a date with ${byId[b].name}. Their partners are not thrilled.`,lines:[[a,'react_text',{}],[a,'date_banter',{themId:b}],[byId[COUPLES[a]]?COUPLES[a]:a,'partner_watch',{themId:b,partnerId:a}]],who:a}}}
];
function fireEvent(force){const pool=EVENTS.filter(e=>!e.times||e.times.includes(VS.t));if(!force&&Math.random()>.55)return;let tot=pool.reduce((s,e)=>s+e.w,0),x=Math.random()*tot,E=pool[0];for(const e of pool){if((x-=e.w)<0){E=e;break}}
 let r;try{r=E.go()}catch(err){return}if(!r)return;syncLove();
 const lines=r.lines.filter(l=>l[0]).map(([id,cat,v])=>`<p><b>${byId[id].name}:</b> “${say(cat,byId[id],v,true)}”</p>`).join('');
 logIt(VS.where[r.who]||'firepit',`${E.t}: ${r.text}`,true);ST.rating=+(ST.rating+.2).toFixed(1);
 sheet.innerHTML=`<button class="x" data-act="close" aria-label="Close">×</button><div class="evtag">Something happened · ${TIMES[VS.t]}</div><h3>${E.t}</h3><p class="leantxt">${r.text}</p><div class="mems">${lines}</div>${r.choices?`<div class="lab">Your call, producer</div><div class="btns">${r.choices.map(([k,l,cst])=>`<button class="btn${k===r.choices[0][0]?' main':''}" data-evc="${k}">${l}${cst?' · '+cst+' reels':''}</button>`).join('')}</div><div id="evres"></div>`:''}`;
 sheet.classList.add('open');checkArcs();drawVilla();
 sheet.querySelectorAll('[data-evc]').forEach(b=>b.addEventListener('click',()=>{const k=b.dataset.evc,ev=VS.ev||{};let out='';
  if(k==='bury'){if(ST.reels<10){toast('Not enough reels');return}spend(10);out=`The footage is buried. For now. ${byId[ev.w].name} still knows.`}
  if(k==='tell'){addAff(ev.p,ev.a,-14);bump(ev.p,ev.b,'rival',8);out=`<p><b>${byId[ev.p].name}:</b> “${say('jealous_confront',byId[ev.p],{themId:ev.a,rivalId:ev.b},true)}”</p><p><b>${byId[ev.a].name}:</b> “${say('argue_defend',byId[ev.a],{themId:ev.p},true)}”</p>`;logIt('terrace',`${byId[ev.p].name} finds out about the kiss.`,true)}
  if(k==='comfort'){if(ST.reels<5){toast('Not enough reels');return}spend(5);moodUp([ev.a],20);out=`<p><b>${byId[ev.a].name}:</b> “${say('ev_homesick',byId[ev.a],{},true)}”</p><p class="fine">They're staying. Mood way up.</p>`}
  if(k==='wait'){if(Math.random()<.5){out=`<p><b>${byId[ev.a].name}:</b> “${say('ev_walkout',byId[ev.a],{},true)}”</p>${(()=>{const f=byId[pickV(x=>x!==ev.a)];return `<p><b>${f.name}:</b> “${say('ev_walkout',f,{},true)}”</p>`})()}<p class="fine">They nearly walked. The villa talked them down. Huge moment for tonight's episode.</p>`;ST.rating=+(ST.rating+.4).toFixed(1);logIt('bedroom',`${byId[ev.a].name} nearly walks out.`,true)}else out=`<p class="fine">${byId[ev.a].name} sleeps on it and feels a little better.</p>`}
  syncLove();checkArcs();drawVilla();sheet.querySelector('.btns').remove();document.getElementById('evres').innerHTML=out}))}
/* fire events as the day moves on */
document.getElementById('timeCtl').addEventListener('click',()=>{drift();setTimeout(()=>fireEvent(false),350)});
/* keep couples dynamic in the hideaway */
syncLove();checkArcs();drawVilla();
