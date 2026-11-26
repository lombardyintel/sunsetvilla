
/* ---------- systems 2: buzz, real footage, fan reactions, brief, twists, season beats, bombshells, dumping ---------- */
const XB='<button class="x" data-act="close" aria-label="Close">×</button>';
ST.hype=0;ST.aired={};ST.dumped=[];ST.twists={};ST.beatDone={};VS.visited=new Set();
function addBuzz(x){ST.hype=+Math.max(0,Math.min(2.5,ST.hype+x)).toFixed(1)}
const shuffle=a=>a.slice().sort(()=>Math.random()-.5);
const topOther=a=>VIDS().filter(x=>x!==a&&x!==COUPLES[a]).sort((p,q)=>AFF[a][q]-AFF[a][p])[0];
const ln=(id,cat,v)=>byId[id]?`<p><b>${byId[id].name}:</b> “${say(cat,byId[id],v||{},true)}”</p>`:'';
/* what changed: collect affection deltas around an action */
let FX=null;
const _addAff=addAff;addAff=function(a,b,d){const bf=AFF[a]&&AFF[a][b];_addAff(a,b,d);if(FX&&bf!==undefined){const k=a+'>'+b;FX[k]=(FX[k]||0)+(AFF[a][b]-bf)}};
function startFx(){FX={}}
function endFx(){const f=FX||{};FX=null;return Object.entries(f).filter(([k,v])=>Math.abs(v)>=2&&byId[k.split('>')[0]]).sort((p,q)=>Math.abs(q[1])-Math.abs(p[1])).slice(0,4).map(([k,v])=>{const [a,b]=k.split('>');return `<span class="fx ${v>0?'up':'dn'}">${byId[a].name} → ${byId[b].name} ${v>0?'♥ +':'−'}${Math.round(Math.abs(v))}</span>`}).join('')}
const _runAct=runAct;runAct=function(k,i,p,a,b){startFx();_runAct(k,i,p,a,b);const fx=endFx();if(fx)setTimeout(()=>{if(VS.open===k)addFeed(k,`<span class="fxrow">${fx}</span>`)},2200)};
/* relationship-aware chatter */
function relOf(a,b){if(COUPLES[a]===b)return 'couple';const r=RELS.filter(x=>(x[0]===a&&x[1]===b)||(x[0]===b&&x[1]===a));if(r.some(x=>x[2]==='rival'&&x[3]>=1))return 'rival';if(r.some(x=>x[2]==='friend'))return 'friend';return null}
function relCat(a,o,L){const r=relOf(a.id,o.id),x=Math.random();if(r==='couple'&&x<.3)return 'couple_cute';if(r==='rival'&&x<.4)return 'rival_snark';if(r==='friend'&&x<.3)return 'bestie';return rnd(L.cats)}
/* heart rate makes the read exact for two days */
const _readOf=readOf;readOf=function(a,b){const k=ST.known[a];if(k&&k.hr&&VS.day-k.hr<2)return Math.round(AFF[a][b]);return _readOf(a,b)};
/* character file: friends and rivals */
const _os3=openSheet;openSheet=function(id){_os3(id);if(!AFF[id]||!sheet.querySelector('.cstat'))return;const mine=RELS.filter(r=>r[0]===id||r[1]===id),o=r=>byId[r[0]===id?r[1]:r[0]].name;
 const fr=mine.filter(r=>r[2]==='friend').sort((a,b)=>b[3]-a[3])[0],rv=mine.filter(r=>r[2]==='rival').sort((a,b)=>b[3]-a[3])[0],hr=ST.known[id]&&ST.known[id].hr&&VS.day-ST.known[id].hr<2;
 if(!fr&&!rv&&!hr)return;(sheet.querySelector('.leantxt')||sheet.querySelector('.cstat')).insertAdjacentHTML('afterend',`<div class="relrow">${fr?`<span>Best friend <b>${o(fr)}</b></span>`:''}${rv?`<span>Clashes with <b>${o(rv)}</b></span>`:''}${hr?'<span class="hrk">Heart rate read: exact</span>':''}</div>`)};
/* generic event card */
function showEv(o){
 const said=(o.lines||[]).filter(l=>l[0]&&byId[l[0]]).map(([id,cat,v])=>[id,say(cat,byId[id],v||{},true)]).filter(l=>l[1]);
 if(o.log)logIt(o.log.loc||'firepit',o.log.text,o.log.star!==false,{ids:(o.log.ids||said.map(l=>l[0])).filter(Boolean),lines:said,kind:'event',title:o.title});
 addBuzz(o.buzz==null?.2:o.buzz);
 sheet.innerHTML=`${XB}<div class="evtag">${o.tag||'Something happened · '+TIMES[VS.t]}</div><h3>${o.title}</h3><p class="leantxt">${o.text}</p>${o.extra||''}<div class="mems">${said.map(([id,t])=>`<p><b>${byId[id].name}:</b> “${t}”</p>`).join('')}</div>${o.fx?`<div class="fxrow">${o.fx}</div>`:''}${o.choices?`<div class="lab">Your call, producer</div><div class="btns">${o.choices.map((c,i)=>`<button class="btn${i===0?' main':''}" data-evk="${i}">${c.label}${c.cost?' · '+c.cost+' reels':''}</button>`).join('')}</div>`:''}<div id="evres2"></div>`;
 sheet.classList.add('open');syncLove();checkArcs();drawVilla();
 sheet.querySelectorAll('[data-evk]').forEach(b=>b.addEventListener('click',()=>{const c=o.choices[+b.dataset.evk];if(c.cost&&ST.reels<c.cost){toast('Not enough reels. Go for a walk.');return}if(c.cost)spend(c.cost);startFx();const out=c.run()||'';const f=endFx();const bt=sheet.querySelector('.btns');if(bt)bt.remove();document.getElementById('evres2').innerHTML=out+(f?`<div class="fxrow">${f}</div>`:'');syncLove();checkArcs();drawVilla()}));
}
function special(id){const S=SPECIALS[id];if(!S)return false;startFx();let o;try{o=S()}catch(e){FX=null;console.warn(e);return false}if(!o){FX=null;return false}o.fx=endFx();showEv(o);return true}
const SPECIALS={
 heartrate(){const xs=shuffle(VIDS()).slice(0,4),lines=[];let ext='';xs.forEach(a=>{const top=VIDS().filter(x=>x!==a).sort((p,q)=>AFF[a][q]-AFF[a][p])[0],p=COUPLES[a],off=p&&top!==p;ST.known[a]=ST.known[a]||{};ST.known[a].hr=VS.day;
  ext+=`<div class="hr"><b>${byId[a].name}</b>'s heart races for <b>${byId[top].name}</b>${off?' <span class="shock">NOT THEIR PARTNER</span>':''}</div>`;
  if(off){addAff(p,a,-7);bump(p,top,'rival',5);lines.push([a,'ev_heartrate',{themId:top,partnerId:p}],[p,'jealous_confront',{themId:a,rivalId:top}])}else{if(p)addAff(p,a,4);lines.push([a,'ev_heartrate',{themId:top,partnerId:p}])}});
  return {title:'Heart rate challenge',text:'Each islander dances for the villa while a monitor tracks their heart rate. No fuzz, no edit: for the next two days your read on these four is exact.',extra:`<div class="hrs">${ext}</div>`,lines:lines.slice(0,5),log:{loc:'firepit',text:'Heart rate challenge exposes who really fancies whom.',ids:xs},buzz:.5}},
 movie(){const pool=VS.log.filter(l=>l.meta&&l.meta.ids&&l.meta.ids.length>=2&&l.meta.ids.some(id=>COUPLES[id]&&!l.meta.ids.includes(COUPLES[id])));let a,b,text;
  if(pool.length){const l=rnd(pool);a=l.meta.ids.find(id=>COUPLES[id]&&!l.meta.ids.includes(COUPLES[id]));b=l.meta.ids.find(x=>x!==a);text=`The villa watches today's footage. On screen: ${l.text}`}else{a=pickV(x=>COUPLES[x]);b=topOther(a);text=`The villa watches a clip of ${byId[a].name} and ${byId[b].name} giggling on the daybeds three days ago.`}
  const p=COUPLES[a];addAff(p,a,-10);bump(p,b,'rival',6);addAff(a,b,3);
  return {title:'Movie night',text,lines:[[p,'ev_movie',{themId:b,partnerId:a}],[a,'ev_movie',{themId:b,partnerId:p}],[pickV(x=>![a,b,p].includes(x)),'ev_movie',{themId:a,partnerId:p,otherId:b}],[p,'jealous_confront',{themId:a,rivalId:b}]],
   choices:[{label:`Let ${byId[a].name} explain`,run:()=>ln(a,'argue_defend',{themId:p})+ln(p,Math.random()<.5?'makeup':'conf_doubt',{themId:a,rivalId:b})},{label:'Roll the next clip',cost:5,run:()=>{addAff(p,a,-5);addBuzz(.3);return ln(b,'ev_movie',{themId:p,partnerId:COUPLES[b]})+'<p class="fine">Another clip. The room goes silent. Great for the edit.</p>'}}],
   log:{loc:'bedroom',text:`Movie night: ${byId[p].name} watches ${byId[a].name} with ${byId[b].name}.`,ids:[p,a,b]},buzz:.4}},
 quiz(){const [a,b]=rnd(couplesList()),sc=clamp(Math.round((AFF[a][b]+AFF[b][a])/20+(Math.random()*3-1.5)),1,10),good=sc>=7;addAff(a,b,good?6:-4);addAff(b,a,good?6:-4);
  return {title:'Couples quiz',text:`${byId[a].name} and ${byId[b].name} score ${sc}/10 on how well they know each other.${good?' The villa is impressed.':' Awkward silence.'}`,lines:[[a,'ev_quiz',{partnerId:b}],[b,'ev_quiz',{partnerId:a}],[a,good?'couple_cute':'bicker',{themId:b}]],log:{loc:'firepit',text:`Couples quiz: ${byId[a].name} and ${byId[b].name} score ${sc}/10.`,ids:[a,b],star:!good},buzz:good?.1:.3}},
 truthdare(){const a=pickV(x=>COUPLES[x]),b=topOther(a),p=COUPLES[a];addAff(a,b,7);addAff(b,a,5);addAff(p,a,-8);bump(p,b,'rival',5);
  return {title:'Truth or dare',text:`A game on the daybeds gets out of hand. ${byId[a].name} is dared to kiss the person they fancy most, and walks straight past ${byId[p].name} to ${byId[b].name}.`,lines:[[pickV(x=>![a,b,p].includes(x)),'ev_truthdare',{themId:a,partnerId:COUPLES[a]}],[a,'ev_truthdare',{themId:b,partnerId:p}],[p,'ev_truthdare',{themId:b,partnerId:a}],[p,'jealous_confront',{themId:a,rivalId:b}]],log:{loc:'daybeds',text:`Truth or dare: ${byId[a].name} kisses ${byId[b].name} in front of ${byId[p].name}.`,ids:[a,b,p]},buzz:.5}},
 talent(){const xs=shuffle(VIDS()).slice(0,3),st=xs[0];moodUp(VIDS(),6);if(COUPLES[st])addAff(COUPLES[st],st,6);
  return {title:'Talent show',text:`${byId[xs[0]].name} wins the villa talent show. ${byId[xs[1]].name} does not, but nobody will ever forget it.`,lines:xs.map(x=>[x,'ev_talent',{themId:st,partnerId:COUPLES[x]}]).concat([[COUPLES[st]||xs[1],'couple_cute',{themId:st}]]),log:{loc:'firepit',text:`Talent show: ${byId[st].name} wins.`,ids:xs,star:false},buzz:.2}},
 rumor(){const a=pickV(x=>COUPLES[x]),p=COUPLES[a],o=topOther(a),sp=pickV(x=>![a,p,o].includes(x)),truth=AFF[a][o]>AFF[a][p];addAff(p,a,-7);
  return {title:'A rumor spreads',text:`${byId[sp].name} tells someone in the kitchen that ${byId[a].name} wants to switch to ${byId[o].name}. By lunch the whole villa has heard it, including ${byId[p].name}.`,extra:`<p class="fine">Your read: ${truth?'there is more truth in it than they would admit.':'it is mostly nonsense.'}</p>`,lines:[[sp,'ev_rumor',{themId:a,otherId:o}],[p,'ev_rumor',{themId:a,partnerId:a}],[a,'ev_rumor',{themId:o,partnerId:p}]],
   choices:[{label:`Producer chat: let ${byId[a].name} clear it up`,cost:5,run:()=>{addAff(p,a,8);return ln(a,'reassure',{themId:p})+ln(p,'makeup',{themId:a})}},{label:'Let it ride',run:()=>{addBuzz(.3);bump(p,o,'rival',6);return ln(p,'jealous_confront',{themId:a,rivalId:o})+'<p class="fine">It festers. Good for tonight, bad for them.</p>'}}],
   log:{loc:'kitchen',text:`Rumor: ${byId[a].name} wants ${byId[o].name}, and ${byId[p].name} hears it.`,ids:[sp,a,p]},buzz:.2}},
 vote(){const w=couplesList().map(([a,b])=>({a,b,s:AFF[a][b]+AFF[b][a]})).sort((p,q)=>p.s-q.s)[0],def=Math.random()<.5;moodUp([w.a,w.b],-10);addAff(w.a,w.b,def?5:-5);addAff(w.b,w.a,def?5:-5);
  return {title:'Vote: least compatible couple',text:`The islanders vote ${byId[w.a].name} and ${byId[w.b].name} the least compatible couple. ${def?'It pulls them closer, mostly out of spite.':'It plants a seed of doubt.'}`,lines:[[pickV(x=>x!==w.a&&x!==w.b),'ev_vote',{themId:w.a,partnerId:w.b}],[w.a,'ev_vote',{partnerId:w.b}],[w.b,def?'reassure':'conf_doubt',{themId:w.a}]],log:{loc:'firepit',text:`Vote: ${byId[w.a].name} and ${byId[w.b].name} named least compatible.`,ids:[w.a,w.b]},buzz:.3}},
 birthday(){const a=pickV(),p=COUPLES[a];moodUp([a],20);moodUp(VIDS(),4);if(p){addAff(a,p,6);addAff(p,a,4)}
  return {title:`${byId[a].name}'s birthday`,text:`It's ${byId[a].name}'s birthday: a lopsided cake, a conga line round the pool and ${p?'a poem from '+byId[p].name+' that does not rhyme':'a lot of off-key singing'}.`,lines:[[a,'ev_birthday',{partnerId:p}],[p||pickV(x=>x!==a),'ev_birthday',{partnerId:a,themId:a}],[a,'ev_birthday',{partnerId:p,themId:p}]],log:{loc:'kitchen',text:`${byId[a].name}'s birthday party.`,ids:[a,p],star:false},buzz:.1}},
 fallout(){const fr=RELS.filter(r=>r[2]==='friend'&&VIDS().includes(r[0])&&VIDS().includes(r[1]));const a=fr.length?rnd(fr)[0]:pickV();const bb=fr.length?fr.find(r=>r[0]===a)[1]:pickV(x=>x!==a);bump(a,bb,'friend',-12);bump(a,bb,'rival',4);moodUp([a,bb],-8);
  return {title:'Friendship fallout',text:`${byId[a].name} finds out ${byId[bb].name} knew something and kept quiet. The villa's closest friendship cracks.`,lines:[[a,'ev_fallout',{themId:bb}],[bb,'ev_fallout',{themId:a}],[a,'ev_fallout',{themId:bb}]],
   choices:[{label:'Get them in a room together',cost:5,run:()=>{bump(a,bb,'friend',12);bump(a,bb,'rival',-4);moodUp([a,bb],8);return ln(bb,'apologize',{themId:a})+ln(a,'bestie',{themId:bb})}},{label:'Give them space',run:()=>'<p class="fine">They avoid each other all day. The kitchen is very quiet.</p>'}],log:{loc:'garden',text:`${byId[a].name} and ${byId[bb].name} fall out.`,ids:[a,bb]},buzz:.3}},
 gesture(){const w=couplesList().map(([a,b])=>({a,b,s:Math.min(AFF[a][b],AFF[b][a])})).sort((p,q)=>p.s-q.s)[0];
  return {title:'A grand gesture?',text:`${byId[w.a].name} wants to win ${byId[w.b].name} back after a rough few days, and has asked production for help: rose petals, a private dinner, a speech.`,lines:[[w.a,'conf_love',{themId:w.b}]],
   choices:[{label:'Fund it',cost:12,run:()=>{addAff(w.a,w.b,10);addAff(w.b,w.a,12);moodUp([w.a,w.b],12);logIt('terrace',`${byId[w.a].name}'s grand gesture for ${byId[w.b].name}.`,true,{ids:[w.a,w.b],lines:[],kind:'payoff',title:'Grand gesture'});return ln(w.a,'ev_gesture',{themId:w.b})+ln(w.b,'ev_gesture',{themId:w.a})}},{label:'No budget today',run:()=>{addAff(w.b,w.a,-3);return ln(w.a,'conf_doubt',{themId:w.b})}}],log:null,buzz:.1}},
 parents(){const xs=shuffle(couplesList()).slice(0,2),lines=[],txt=[];xs.forEach(([a,b])=>{const ok=Math.random()<.6+(AFF[a][b]-50)/200;if(ok){addAff(a,b,5);txt.push(`${byId[a].name}'s family love ${byId[b].name}`)}else{addAff(a,b,-6);addAff(a,topOther(a),4);txt.push(`${byId[a].name}'s family aren't sure about ${byId[b].name}`)}lines.push([a,'ev_parents',{partnerId:b,themId:topOther(a)}],[b,ok?'couple_cute':'conf_doubt',{themId:a}])});
  return {title:'Family visit',text:txt.join('. ')+'.',lines,log:{loc:'terrace',text:'Family visit: '+txt.join('; ')+'.',ids:xs.flat()},buzz:.4}},
 bomb(){const av=['theo','coco'].filter(id=>!VIDS().includes(id)&&!ST.dumped.includes(id));if(!av.length)return null;
  return {title:'Bombshell incoming',tag:'Villa text',text:'“Islanders, get ready. Someone new is about to walk into the villa.” You choose who.',lines:[],choices:av.map(id=>({label:`Send in ${byId[id].name}`,run:()=>enterBomb(id)})),log:null,buzz:.2}}
};
function enterBomb(id){if(VIDS().includes(id))return '';VILLA.push({id,x:0,y:0});VS.where[id]='pool';ST.mood[id]=85;ST.energy[id]=90;AFF[id]={};
 VIDS().forEach(x=>{if(x===id)return;const s=chemScore(byId[id],byId[x]);AFF[id][x]=Math.round(10+s*.4);AFF[x][id]=Math.round(8+s*.3)});
 const t=VIDS().filter(x=>x!==id&&COUPLES[x]).sort((p,q)=>AFF[id][q]-AFF[id][p])[0],p=COUPLES[t];AFF[id][t]=Math.max(AFF[id][t],58);addAff(t,id,10);if(p)addAff(p,t,-4);THINK[id]=t;
 layout();drawVilla();
 const said=[[id,'bomb_arrive',{}],[id,'bomb_pick',{themId:t,partnerId:p}],[t,'ev_bomb_date',{partnerId:p}],[p,'partner_watch',{themId:id,partnerId:t}]].filter(l=>l[0]).map(([a,c,v])=>[a,say(c,byId[a],v,true)]);
 logIt('pool',`${byId[id].name} walks in and picks ${byId[t].name} for a first date.`,true,{ids:[id,t],lines:said,kind:'event',title:byId[id].name+' arrives'});
 return said.map(([a,x])=>`<p><b>${byId[a].name}:</b> “${x}”</p>`).join('')+`<p class="fine">${byId[id].name} is single. At the next recoupling there are more islanders than places. Whoever isn't picked goes home.</p>`}
function dumpLeft(left){if(!left||!left.length)return;const box=document.getElementById('rcsum');
 left.forEach(id=>{const f=pickV(x=>x!==id&&!left.includes(x));if(box)box.insertAdjacentHTML('beforeend',`<div class="rc sw"><div class="rch"><b>${byId[id].name}</b> <span class="shock">LEFT SINGLE · DUMPED</span></div><p>“${say('dumped_react',byId[id],{},true)}”</p><p>“${say('ev_goodbye',byId[id],{themId:f},true)}”</p></div>`);
  logIt('firepit',`${byId[id].name} is left single and dumped from the villa.`,true,{ids:[id],lines:[],kind:'recouple',title:byId[id].name+' is dumped'});ST.dumped.push(id);
  const i=VILLA.findIndex(v=>v.id===id);if(i>=0)VILLA.splice(i,1);delete VS.where[id];delete COUPLES[id];for(let j=RELS.length-1;j>=0;j--)if(RELS[j][0]===id||RELS[j][1]===id)RELS.splice(j,1);Object.keys(THINK).forEach(k=>{if(THINK[k]===id)THINK[k]=COUPLES[k]||'prize'})});
 addBuzz(.4);layout();drawVilla()}
/* random events can also be the bigger set pieces */
[['rumor','A rumor spreads',2],['fallout','Friendship fallout',1],['birthday','Birthday',1],['truthdare','Truth or dare',1,[2,3]],['quiz','Couples quiz',1,[1,2]],['talent','Talent show',1,[2,3]],['gesture','Grand gesture',1]].forEach(([id,t,w,times])=>EVENTS.push({id,t,w,times,go(){special(id);return null}}));
const _fire=fireEvent;fireEvent=function(force){if(VS.skipRandom){VS.skipRandom=false;return}startFx();_fire(force);const f=endFx();const m=sheet.querySelector('.mems');if(f&&m&&sheet.classList.contains('open'))m.insertAdjacentHTML('afterend',`<div class="fxrow">${f}</div>`)};
/* one recoupling per night */
const _sa=startAct;startAct=function(k,i){const a=ACTS[k][i];if(a&&a.special&&ST.rcDay===VS.day){toast('The villa already recoupled tonight.');return}_sa(k,i)};
/* dates booked from a character file become footage */
picker.addEventListener('click',e=>{const b=e.target.closest('[data-loc]');if(!b||b.dataset.loc==='x'||!ST.date)return;const [a,c]=ST.date,l=ST.dateLoc;logIt('terrace',`Date: ${byId[a].name} and ${byId[c].name}, ${l?l.name:'a date'}.`,true,{ids:[a,c],lines:[],kind:'date',dloc:l?l.id:'rooftop',title:`Date: ${byId[a].name} + ${byId[c].name}`})});
/* ---------- producer brief ---------- */
function newBrief(){const prs=ARCS.filter(a=>!ST.done[a.id]&&a.pay).map(a=>a.pay()).filter(p=>p.every(id=>VIDS().includes(id)));const pr=prs.length?rnd(prs):(()=>{const a=pickV(x=>COUPLES[x]);return [a,topOther(a)]})();
 const rc=VS.day%4===0;
 ST.brief={day:VS.day,goals:[{id:'key',txt:'Film 3 key moments',done:false},{id:'pair',txt:`Get ${byId[pr[0]].name} and ${byId[pr[1]].name} on camera together`,pair:pr,done:false},rc?{id:'rc',txt:'Hold the recoupling and call 2 picks right',done:false}:{id:'visit',txt:'Check in on 5 different places',done:false}]};renderBriefBadge()}
function checkBrief(extra){const B=ST.brief;if(!B)return;B.goals.forEach(g=>{if(g.done)return;let ok=false;
 if(g.id==='key')ok=VS.log.filter(l=>l.star).length>=3;if(g.id==='pair')ok=VS.log.some(l=>l.meta&&l.meta.ids&&g.pair.every(id=>l.meta.ids.includes(id)));if(g.id==='visit')ok=VS.visited.size>=5;if(g.id==='rc')ok=!!(extra&&extra.rcRight>=2);
 if(ok){g.done=true;ST.reels+=15;ST.instinct+=5;syncReels();if(typeof renderQueue==='function')renderQueue();setTimeout(()=>toast(`Brief done: ${g.txt}. +15 reels`),900)}});renderBriefBadge()}
function renderBriefBadge(){const b=document.getElementById('logBtn');if(!b||!ST.brief)return;let s=b.querySelector('.bb');if(!s){s=document.createElement('span');s.className='bb';b.appendChild(s)}const d=ST.brief.goals.filter(g=>g.done).length;s.textContent=d+'/3';s.classList.toggle('all',d===3)}
window.__onLog=()=>checkBrief();
const _openLoc=openLoc;openLoc=function(k){VS.visited.add(k);_openLoc(k);checkBrief()};
/* ---------- season beats and twist cards ---------- */
const BEATS={7:'bomb',9:'quiz',10:'heartrate',12:'movie',13:'talent',15:'birthday',16:'vote',18:'parents'};
const BEATN={bomb:'Two bombshells are waiting at the door.',quiz:'How well do the couples really know each other?',heartrate:'Hearts race. Monitors don’t lie.',movie:'Movie night. Nobody is safe on screen.',talent:'A talent show nobody is ready for.',birthday:'A birthday, a cake, a meltdown.',vote:'The villa votes. Someone won’t like it.',parents:'Family arrives. Secrets don’t leave.'};
const BEATL={bomb:'Bombshell arrives',quiz:'Couples quiz',heartrate:'Heart rate challenge',movie:'Movie night',talent:'Talent show',birthday:'Birthday',vote:'Public vote',parents:'Family visit'};
const TWISTS=[['heartrate','Heart rate challenge',20],['movie','Movie night',18],['bomb','Send in a bombshell',30],['vote','Least compatible vote',15],['truthdare','Truth or dare',10],['quiz','Couples quiz',10],['rumor','Start a rumor',8],['talent','Talent show',8],['gesture','Fund a grand gesture',12],['parents','Family visit',20]];
const twistOk=id=>id==='bomb'?['theo','coco'].some(x=>!VIDS().includes(x)&&!ST.dumped.includes(x)):couplesList().length>0;
document.getElementById('timeCtl').addEventListener('click',()=>{if(VS.t!==0)return;ED.locked=false;clipSig='';VS.visited=new Set();newBrief();const bt=BEATS[VS.day];
 if(bt&&!ST.beatDone[VS.day]){ST.beatDone[VS.day]=true;VS.skipRandom=true;setTimeout(()=>special(bt),700)}else setTimeout(()=>toast(`Day ${VS.day}. New brief from the network.`),1200)});
/* ---------- show status, rebuilt ---------- */
showStatus=function(){ST.sel=null;const cps=couplesList(),B=ST.brief,used=ST.twists[VS.day];
 const up=Object.keys(BEATS).map(Number).filter(d=>d>VS.day).slice(0,4);
 sheet.innerHTML=`${XB}<h3>Show status</h3><div class="meta">Day ${VS.day} of 21 · ${TIMES[VS.t]} · ${VILLA.length} islanders</div>
 <div class="kpis"><div><b>${ST.rating.toFixed(1)}</b><span>Season rating</span></div><div><b>+${ST.hype.toFixed(1)}</b><span>Tonight’s buzz</span></div><div><b>${ST.instinct}</b><span>Instinct</span></div></div>
 <div class="lab">Today’s brief</div><div class="brief">${B.goals.map(g=>`<p class="${g.done?'ok':''}"><i>${g.done?'✓':''}</i><span>${g.txt}</span><small>+15 reels</small></p>`).join('')}</div>
 <div class="lab">Storylines</div>${ARCS.map(a=>{const pr=Math.round(clamp(a.prog(),0,1)*100);return `<div class="arc"><div><b>${a.name}</b><span>${ST.done[a.id]?'Paid off':a.resolve&&pr>=80?'Breaks at recoupling':pr+'%'}</span></div><i><b style="width:${ST.done[a.id]?100:pr}%"></b></i></div>`}).join('')}
 <div class="lab">Pull a twist</div><p class="fine" style="margin:0 0 6px">${used?'You’ve used today’s twist. Back tomorrow.':'One twist a day. You choose the twist; you don’t choose how the cast reacts.'}</p><div class="twists">${TWISTS.map(([id,n,c])=>`<button data-tw="${id}" ${used||!twistOk(id)?'disabled':''}><b>${n}</b><small>${c} reels</small></button>`).join('')}</div>
 <div class="lab">Coming up this season</div><div class="beats">${up.map(d=>`<p><b>Day ${d}</b>${BEATL[BEATS[d]]}</p>`).join('')}<p><b>Every 4th</b>Recoupling night</p><p><b>Day 21</b>Finale</p></div>
 <div class="lab">Your ship</div><p class="fine" style="margin:0 0 6px">Every recoupling they survive earns instinct points.</p><div class="opts">${cps.map(([a,b])=>`<button data-ship="${a}|${b}" class="${ST.ship===a+'|'+b?'on':''}">${byId[a].name} + ${byId[b].name}</button>`).join('')}</div>
 <div class="lab">Today in the villa</div>${VS.log.length?`<div class="logl">${VS.log.slice().reverse().map(l=>`<p><b>${l.time} · ${l.loc}</b>${l.star?' <span class="tagx">★ key moment</span>':''}<br>${l.text}</p>`).join('')}</div>`:'<p class="fine">Nothing filmed yet.</p>'}`;
 sheet.classList.add('open');
 sheet.querySelectorAll('[data-ship]').forEach(b=>b.addEventListener('click',()=>{ST.ship=b.dataset.ship;showStatus();toast('Ship set. Rooting for them.')}));
 sheet.querySelectorAll('[data-tw]').forEach(b=>b.addEventListener('click',()=>{const t=TWISTS.find(x=>x[0]===b.dataset.tw);if(ST.reels<t[2]){toast('Not enough reels. Go for a walk.');return}spend(t[2]);ST.twists[VS.day]=true;if(!special(t[0])){ST.reels+=t[2];ST.twists[VS.day]=false;syncReels();toast('That twist can’t run right now.')}}));
};
/* ---------- edit bay from real footage ---------- */
const KCOL={date:'#FF8A65',act:'#F6C35B',event:'#E5484D',recouple:'#9B7BD4',payoff:'#4CC3C0'};
const KTAKE={date:['Sweet','Messy'],act:['Light','Spicy'],event:['Straight','Hyped'],recouple:['Slow reveal','Quick cut'],payoff:['Sincere','Big swell']};
const KMUS={date:'Romantic',act:'Comedy',event:'Tense',recouple:'Tense',payoff:'Romantic'};
let clipSig='';
function buildClips(){const L=VS.log.filter(l=>l.meta&&l.meta.ids&&l.meta.ids.filter(id=>byId[id]).length);const sig=VS.day+':'+L.length;if(sig===clipSig||ED.locked||!L.length)return;clipSig=sig;
 const pick=L.map((l,i)=>({l,i})).sort((p,q)=>(q.l.star-p.l.star)||(p.i-q.i)).slice(0,6).sort((p,q)=>p.i-q.i).map(x=>x.l);
 const prev={};CLIPS.forEach(c=>{if(c.key)prev[c.key]=c});
 const nc=pick.map((l,i)=>{const k=l.meta.kind||'act',key=l.time+l.text;return prev[key]||{id:'k'+VS.day+'_'+i+'_'+Math.random().toString(36).slice(2,6),key,t:(l.meta.title||l.text).replace(/\.$/,'').slice(0,30),col:KCOL[k]||'#F6C35B',take:0,music:KMUS[k]||'Comedy',takes:KTAKE[k]||['Light','Spicy'],ids:l.meta.ids.filter(id=>byId[id]),lines:l.meta.lines||[],kind:k,lk:l.lk,dloc:l.meta.dloc,full:l.text}});
 CLIPS.splice(0,CLIPS.length,...nc);ED.sel=CLIPS[0].id;ED.cliff=([...CLIPS].reverse().find(c=>c.kind==='recouple'||c.kind==='event')||CLIPS[CLIPS.length-1]).id;
 const cnt={};CLIPS.forEach(c=>c.ids.forEach(id=>cnt[id]=(cnt[id]||0)+1));const nt={};Object.keys(cnt).sort((a,b)=>cnt[b]-cnt[a]).slice(0,4).forEach(id=>{nt[id]=ED.treat[id]||({Schemer:'Villain',Strategic:'Mystery',Clueless:'Comic relief'})[byId[id].game]||'Hero'});ED.treat=nt}
const _renderEdit=renderEdit;renderEdit=function(){buildClips();_renderEdit();const s=document.querySelector('#pEdit .sub');const real=CLIPS[0]&&CLIPS[0].ids;if(s)s.textContent=real?`Day ${VS.day} dailies · ${CLIPS.length} clips filmed in the villa`:'Sample dailies · film moments in the villa to replace these';
 const c=CLIPS.find(x=>x.id===ED.sel),h=document.querySelector('#clipctl h4');if(c&&c.full&&h)h.insertAdjacentHTML('afterend',`<p class="cfull">${c.full}</p>`)};
const _aud=audience;audience=function(){const a=_aud();a.v[3]=Math.min(100,a.v[3]+Math.round(ST.hype*10));a.v[1]=Math.min(100,a.v[1]+Math.round(ST.hype*5));return {v:a.v,rating:Math.min(9.8,+a.rating+ST.hype*.4).toFixed(1)}};
/* ---------- the episode is built from the cut ---------- */
const MT={Romantic:'rgba(255,111,145,.14)',Tense:'rgba(40,0,16,.32)',Comedy:'rgba(255,214,110,.12)',Sad:'rgba(40,70,150,.28)'};
function clipLines(c){let L=(c.lines||[]).filter(l=>byId[l[0]]&&l[1]).slice(0,2);const [a,b]=c.ids;
 if(!L.length){const cat={date:['date_open','date_spark'],payoff:['arc_payoff','arc_payoff'],recouple:['recouple_stay','recouple_shock']}[c.kind]||['conf_villa','small_talk'];L=[[a,say(cat[0],byId[a],{themId:b},true)]];if(b)L.push([b,say(cat[1],byId[b],{themId:a},true)])}
 if(c.take===1){const o=pickV(x=>!c.ids.includes(x))||a;L.push([o,say(c.kind==='date'?'spot_crush':'gossip',byId[o],{themId:a,otherId:b},true)])}return L}
function clipScene(c,last){const ids=c.ids.filter(id=>byId[id]),A=byId[ids[0]],B=ids[1]?byId[ids[1]]:null,L=clipLines(c);
 const bg=c.kind==='date'?dateBack(c.dloc||'rooftop'):`<g transform="translate(-260 0) scale(2.334)">${locBack(c.lk||'pool')}</g>`;
 return {t:last?7.5:6.5,freezeAt:last?4.8:0,draw:()=>{let s=`<g class="zoom">${bg}${B?place(A,110,640,1.15,{gaze:2,expr:'smile'})+place(B,282,640,1.15,{flip:true,gaze:2,expr:c.kind==='event'||c.kind==='recouple'?'shock':'smirk'}):place(A,195,650,1.3,{expr:'soft'})}</g><rect width="390" height="700" fill="${MT[c.music]||'transparent'}"/>`;
  L.slice(0,2).forEach(([id,t],j)=>{const right=!!(B&&id===B.id);s+=bubble(right?350:40,j?350:240,t,.5+j*2.2,right)});
  if(L[2])s+=cap(`${byId[L[2][0]].name}: “${L[2][1]}”`,500,4.4);
  s+=lower(c.t.toUpperCase().slice(0,24),`${c.kind==='date'?'Date':LOC[c.lk]?LOC[c.lk].name:'The villa'} · ${ED.treat[A.id]||A.spName}`,.1);return s}}}
const _scenes=scenes;scenes=function(){const base=_scenes();if(!CLIPS[0]||!CLIPS[0].ids)return base;const order=CLIPS.filter(c=>c.id!==ED.cliff).concat(CLIPS.filter(c=>c.id===ED.cliff));
 const nb=BEATS[VS.day+1],nt=nb?BEATN[nb]:(VS.day+1)%4===0?'Recoupling night. Not everyone stays with who they came in with.':'More twists. More turns.';
 const next={t:4.5,draw:()=>`<rect width="390" height="700" fill="#120C17"/><text class="fi" x="195" y="290" text-anchor="middle" font-family="Fraunces, Georgia, serif" font-style="italic" font-weight="600" font-size="30" fill="#FF8A65">Next time...</text>${wrap(nt,36).map((l,i)=>`<text class="fi" style="animation-delay:.4s" x="195" y="${332+i*22}" text-anchor="middle" font-family="Manrope, Helvetica, Arial, sans-serif" font-weight="600" font-size="15" fill="#FFF1E6">${l}</text>`).join('')}`};
 return [base[0],{t:base[1].t,draw:()=>base[1].draw().replace('EPISODE 6','EPISODE '+VS.day)}].concat(order.map((c,i)=>clipScene(c,i===order.length-1)),[next,base[base.length-1]])};
const _play=playScene;playScene=function(i){if(i>=epList.length&&epList.length){closeEp();afterEp();return}_play(i)};
/* ---------- after it airs: rating and the internet ---------- */
const HANDLES=['@villaobsessed','@sunsetsupper','@recouplingrage','@geraldstan','@firepitfiles','@notmyhideaway','@lovebombed_','@ratethevilla','@daybedgossip','@islandtea','@sofaproducer','@team_gerald'];
function fanPosts(){const out=[];CLIPS.forEach(c=>{if(!c.ids)return;const [a,b]=c.ids,tr=ED.treat[a];const cat=c.kind==='recouple'&&/switch|dump/.test(c.t)?'fan_shock':tr==='Villain'?'fan_villain':tr==='Comic relief'?'fan_funny':c.kind==='date'||COUPLES[a]===b?'fan_love':c.kind==='event'?'fan_shock':'fan_ship';out.push([cat,a,b])});
 const sh=pickV(x=>COUPLES[x]);if(sh)out.push(['fan_ship',sh,topOther(sh)]);
 return shuffle(out).slice(0,6).map(([cat,a,b],i)=>`<div class="post"><b>${HANDLES[(i*5+VS.day)%HANDLES.length]}</b><p>${say(cat,byId[a],{themId:b&&byId[b]?b:COUPLES[a]},true).replace(/\{day\}/g,VS.day)}</p><small>♥ ${(Math.floor(Math.random()*60)+3)/10}k · ↻ ${Math.floor(Math.random()*900)+40}</small></div>`).join('')}
function afterEp(){if(ST.aired[VS.day])return;ST.aired[VS.day]=true;const ep=+(ED.locked&&ED.rating?ED.rating:audience().rating),old=ST.rating;ST.rating=+(.7*old+.3*ep).toFixed(1);const posts=fanPosts();ST.hype=0;
 goPlace('villa');sheet.innerHTML=`${XB}<div class="evtag">Episode ${VS.day} · aired</div><h3>The internet reacts</h3><div class="kpis"><div><b>${ep.toFixed(1)}</b><span>Tonight</span></div><div><b>${ST.rating.toFixed(1)}</b><span>Season</span></div><div><b class="${ST.rating>=old?'upc':'dnc'}">${ST.rating>=old?'▲':'▼'} ${Math.abs(ST.rating-old).toFixed(1)}</b><span>Change</span></div></div>${posts?`<div class="posts">${posts}</div>`:'<p class="fine">Film something tomorrow and the fans will have plenty to say.</p>'}`;sheet.classList.add('open')}
newBrief();
