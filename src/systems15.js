/* ===== systems15: animated scenes. A small stage director for big villa moments ===== */
document.getElementById('screen').insertAdjacentHTML('beforeend',`<div class="scn" id="scn"><div class="scbar t"></div><div class="sctag" id="sctag"></div><svg id="scsvg" viewBox="0 0 390 300" preserveAspectRatio="xMidYMax slice" role="img" aria-label="Scene"></svg><div class="sccap" id="sccap"></div><div class="scbar b"></div><div class="sctitle" id="sctitle"></div><button class="scskip" id="scSkip">Skip ›</button></div>`);
document.head.insertAdjacentHTML('beforeend',`<style>
.scn{position:absolute;inset:0;z-index:8;background:#120C17;display:none;flex-direction:column;justify-content:flex-start;overflow:hidden;padding:calc(9% + 34px) 0 calc(9% + 54px);box-sizing:border-box;justify-content:center}.scn.on{display:flex}
#scsvg{width:100%;height:min(50vh,330px);flex:none;display:block}
.scbar{position:absolute;left:0;right:0;height:14%;background:#000;z-index:2;transition:height .6s}.scbar.t{top:0}.scbar.b{bottom:0}.scn.open .scbar{height:9%}
.sctag{position:absolute;top:calc(9% + 10px);left:14px;z-index:3;font:800 10.5px Manrope,sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#F6C35B;opacity:.9}
.sccap{flex:none;min-height:84px;padding:14px 20px 0;color:#FFF1E6;font:600 15px/1.42 Manrope,sans-serif}.sccap b{display:block;font:800 11px Manrope;letter-spacing:.12em;text-transform:uppercase;color:#F6C35B;margin-bottom:3px}.sccap i{color:#CDB9C8;font-weight:500}
.sctitle{position:absolute;inset:0;display:grid;place-items:center;z-index:4;pointer-events:none;opacity:0;transition:opacity .5s;text-align:center;padding:0 24px;background:radial-gradient(circle,rgba(18,12,23,.55),rgba(18,12,23,.88))}.sctitle.on{opacity:1}
.sctitle h2{font:800 34px/1.05 Fraunces,Georgia,serif;color:#FFF1E6;margin:0;text-shadow:0 4px 24px rgba(0,0,0,.6)}.sctitle small{display:block;margin-top:8px;font:700 12px Manrope;letter-spacing:.14em;text-transform:uppercase;color:#F6C35B}
.sctitle.bomb h2{font-size:46px;letter-spacing:.04em;background:linear-gradient(90deg,#FF6F91,#F6C35B);-webkit-background-clip:text;color:transparent}
.scskip{position:absolute;right:12px;bottom:calc(9% + 8px);z-index:5;border:0;border-radius:99px;padding:8px 14px;background:rgba(255,255,255,.12);color:#FFF1E6;font:700 12px Manrope;cursor:pointer}
.scn .actor{transition:transform 1.3s cubic-bezier(.45,.05,.35,1)}.scn .actor.slow{transition-duration:2.6s}.scn .actor.walk>g{animation:scstep .36s ease-in-out infinite}
@keyframes scstep{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
.scn .actor.shake>g{animation:scshake .14s linear 8}@keyframes scshake{0%,100%{transform:translateX(0)}25%{transform:translateX(-4px)}75%{transform:translateX(4px)}}
.scn .actor.hop>g{animation:schop .5s ease 2}@keyframes schop{50%{transform:translateY(-14px)}}
#scam{transition:transform 1.6s cubic-bezier(.3,.1,.3,1);transform-origin:0 0}
.scn .heart{animation:scheart 2.2s ease-out forwards}@keyframes scheart{0%{opacity:0;transform:translateY(0) scale(.4)}20%{opacity:1}100%{opacity:0;transform:translateY(-90px) scale(1.2)}}
.scn .bang{animation:scbang 1.4s ease-out forwards}@keyframes scbang{0%{opacity:0;transform:scale(.3)}25%{opacity:1;transform:scale(1.15)}100%{opacity:0;transform:scale(1)}}
.scn .conf{animation:scconf 2.6s linear forwards}@keyframes scconf{from{transform:translateY(-20px) rotate(0)}to{transform:translateY(330px) rotate(540deg)}}
.scn .flash{animation:scflash .9s ease-out forwards}@keyframes scflash{from{opacity:.75}to{opacity:0}}
.scn .spot{transition:opacity .8s}.scbub{animation:scpop .25s ease-out}@keyframes scpop{from{opacity:0;transform:translateY(6px)}}
</style>`);
const SCX={q:[],on:false,skip:false,actors:{},loc:'pool',t:null};
const scEl=()=>document.getElementById('scn');
function scWait(ms){return new Promise(r=>{if(SCX.skip)return r();const t=setTimeout(r,ms);SCX.t=()=>{clearTimeout(t);r()}})}
function scActorHTML(id,o){const c=byId[id];if(!c)return '';return place(c,0,296,.68,{flip:o.flip,expr:o.expr,pose:o.pose,d:Math.random()*2})}
function scSet(id,o){const A=SCX.actors[id]=Object.assign(SCX.actors[id]||{x:-90,flip:false,expr:null},o);let g=document.getElementById('sca_'+id);
 if(!g){document.getElementById('scast').insertAdjacentHTML('beforeend',`<g class="actor" id="sca_${id}" style="transform:translate(${A.x}px,0px)"><g>${scActorHTML(id,A)}</g></g>`);g=document.getElementById('sca_'+id)}
 if(o.expr!==undefined||o.flip!==undefined||o.pose!==undefined)g.firstElementChild.innerHTML=scActorHTML(id,A);
 if(o.x!==undefined){g.getBoundingClientRect();g.style.transform=`translate(${A.x}px,0px)`}return g}
function scBubble(id,text){const A=SCX.actors[id],b=document.getElementById('scbub');if(!A||!b)return;const lines=wrap(text,24).slice(0,4),w=Math.min(232,Math.max(...lines.map(l=>l.length))*6.7+22),h=lines.length*15+14,x=A.x,bx=Math.max(72,Math.min(318-w,x-w/2));
 b.innerHTML=`<g class="scbub"><rect x="${bx}" y="${84-h}" width="${w}" height="${h}" rx="11" fill="#fff" opacity=".97"/><path d="M${x-6} 84 l6 11 l6 -11z" fill="#fff"/>${lines.map((l,j)=>`<text x="${bx+11}" y="${84-h+19+j*15}" font-family="Manrope,Arial" font-weight="600" font-size="11.5" fill="#241A2E">${l.replace(/&/g,'&amp;').replace(/</g,'&lt;')}</text>`).join('')}</g>`}
function scCap(name,text,narr){document.getElementById('sccap').innerHTML=narr?`<i>${text}</i>`:`<b>${name}</b>${text}`}
function scFx(svg){document.getElementById('scfx').insertAdjacentHTML('beforeend',svg)}
const scHeart=(x,y,d=0)=>`<path class="heart" style="animation-delay:${d}s;transform-origin:${x}px ${y}px" d="M${x} ${y+6} c-9 -7 -13 -11 -13 -16 a6 6 0 0 1 13 -3 a6 6 0 0 1 13 3 c0 5 -4 9 -13 16z" fill="#FF6F91"/>`;
const sfx=n=>{try{if(AU.ctx&&SFX[n])SFX[n]()}catch(e){}};
async function runSteps(steps){for(const s of steps){if(!scEl().classList.contains('on'))return;const A=s.who&&SCX.actors[s.who];
 switch(s.t){
  case 'title':{const t=document.getElementById('sctitle');t.className='sctitle on'+(s.style?' '+s.style:'');t.innerHTML=`<div><h2>${s.text}</h2>${s.sub?`<small>${s.sub}</small>`:''}</div>`;if(s.sfx)sfx(s.sfx);await scWait(s.ms||1700);t.classList.remove('on');await scWait(400);break}
  case 'place':scSet(s.who,{x:s.x,flip:!!s.flip,expr:s.expr||null});break;
  case 'enter':{const from=s.from==='left'?-80:470;scSet(s.who,{x:from,flip:s.from!=='left',expr:s.expr||null});await scWait(60);const g=scSet(s.who,{x:s.x});g.classList.add('walk');if(s.slow)g.classList.add('slow');await scWait(s.slow?2600:1300);g.classList.remove('walk','slow');if(s.face!==undefined)scSet(s.who,{flip:s.face==='left'});break}
  case 'move':{const g=scSet(s.who,{x:s.x});g.classList.add('walk');await scWait(1300);g.classList.remove('walk');break}
  case 'face':scSet(s.who,{flip:s.dir==='left'});break;
  case 'expr':scSet(s.who,{expr:s.expr});break;
  case 'say':{if(!A)break;if(s.expr)scSet(s.who,{expr:s.expr});const c=byId[s.who];scBubble(s.who,s.text);scCap(c.name,s.text);sfx('tap');await scWait(Math.min(4200,1300+s.text.length*38));document.getElementById('scbub').innerHTML='';break}
  case 'text':scCap('',s.text,true);await scWait(s.ms||Math.min(3800,1200+s.text.length*34));break;
  case 'kiss':{const a=SCX.actors[s.a],b=SCX.actors[s.b];if(!a||!b)break;const m=(a.x+b.x)/2;scSet(s.a,{x:m-26,flip:false,expr:'soft'});scSet(s.b,{x:m+26,flip:true,expr:'soft'});await scWait(1300);sfx('chime');scFx(`<rect class="flash" width="390" height="300" fill="#FFB3C7"/>`+[0,.25,.5,.8,1.1].map((d,i)=>scHeart(m-30+i*15,150-(i%2)*20,d)).join(''));await scWait(2100);break}
  case 'hug':{const a=SCX.actors[s.a],b=SCX.actors[s.b];if(!a||!b)break;const m=(a.x+b.x)/2;scSet(s.a,{x:m-34,flip:false,expr:'grin'});scSet(s.b,{x:m+34,flip:true,expr:'grin'});await scWait(1400);break}
  case 'fight':{sfx('sting');[s.a,s.b].forEach(id=>{const g=document.getElementById('sca_'+id);if(g){scSet(id,{expr:'shock'});g.classList.remove('shake');g.getBoundingClientRect();g.classList.add('shake')}});scFx(`<rect class="flash" width="390" height="300" fill="#E5484D"/>`+[s.a,s.b].map(id=>SCX.actors[id]?`<text class="bang" style="transform-origin:${SCX.actors[id].x}px 120px" x="${SCX.actors[id].x-8}" y="128" font-family="Fraunces,Georgia" font-weight="800" font-size="40" fill="#F6C35B">!</text>`:'').join(''));await scWait(1500);break}
  case 'shock':{(s.ids||Object.keys(SCX.actors)).forEach(id=>{scSet(id,{expr:'shock'});const g=document.getElementById('sca_'+id);if(g){g.classList.remove('hop');g.getBoundingClientRect();g.classList.add('hop')}});sfx('scratch');await scWait(900);break}
  case 'leave':{const g=scSet(s.who,{flip:s.to!=='right'?true:false,expr:s.expr||'soft'});if(s.bag){g.firstElementChild.insertAdjacentHTML('beforeend',`<g transform="translate(${s.to==='right'?14:-34} 252)"><rect width="22" height="30" rx="4" fill="#C65D3B"/><rect x="6" y="-6" width="10" height="7" rx="2" fill="none" stroke="#7A3418" stroke-width="2.5"/></g>`)}await scWait(300);g.classList.add('walk','slow');scSet(s.who,{x:s.to==='right'?480:-100});await scWait(2600);break}
  case 'zoom':{const cam=document.getElementById('scam');if(s.reset){cam.style.transform='';break}const A2=SCX.actors[s.who];const k=s.s||1.6,x=A2?A2.x:195,y=s.y||200;cam.style.transform=`translate(${195-x*k}px,${(150-y*k)}px) scale(${k})`;await scWait(s.ms||900);break}
  case 'spot':{const A2=SCX.actors[s.who];const x=A2?A2.x:195;scFx(`<defs><radialGradient id="scsp"><stop offset=".22" stop-color="#000" stop-opacity="0"/><stop offset=".6" stop-color="#000" stop-opacity=".82"/></radialGradient></defs><rect class="spot" id="scspot" x="${x-390}" y="-150" width="780" height="600" fill="url(#scsp)"/>`);break}
  case 'unspot':{const sp=document.getElementById('scspot');if(sp){sp.style.opacity=0;await scWait(800);sp.remove()}break}
  case 'confetti':{sfx('fanfare');scFx(Array.from({length:36},(_,i)=>`<rect class="conf" style="animation-delay:${(i%12)*.12}s" x="${(i*37)%390}" y="-10" width="6" height="10" fill="${['#F6C35B','#FF6F91','#4CC3C0','#FFF1E6'][i%4]}"/>`).join(''));await scWait(1200);break}
  case 'sfx':sfx(s.n);break;
  case 'wait':await scWait(s.ms||800);break}}}
function scSkipNow(){SCX.skip=true;if(SCX.t)SCX.t()}
document.getElementById('scSkip').addEventListener('click',scSkipNow);
document.getElementById('scn').addEventListener('click',e=>{if(e.target.id==='scSkip')return;if(SCX.t)SCX.t()});
async function playCut(sc){SCX.on=true;SCX.skip=false;SCX.actors={};SCX.loc=sc.loc||'pool';const el=scEl();
 const svg=document.getElementById('scsvg');svg.innerHTML=`<g id="scam">${locBack(SCX.loc)}<g id="scast"></g><g id="scfx"></g><g id="scbub"></g></g>`;
 document.getElementById('sccap').innerHTML='';document.getElementById('sctag').textContent=sc.tag||'';el.classList.add('on');setTimeout(()=>el.classList.add('open'),50);
 try{if(typeof epMusic==='function'&&sc.music)epMusic()}catch(e){}
 try{await runSteps(sc.steps)}catch(e){console.warn('scene',e)}
 SCX.skip=false;await scWait(sc.hold||500);el.classList.remove('open','on');SCX.on=false;if(sc.done)try{sc.done()}catch(e){console.warn(e)}}
/* queue: scenes wait until nothing else is on screen */
function queueScene(sc){if(CAR.scenesOff||window.__noScenes){if(sc.done)sc.done();return}SCX.q.push(sc)}
const scBusy=()=>SCX.on||sheet.classList.contains('open')||document.querySelector('#arena.on,#iroom.on,#career.on,.ep.open,#lad.on,.payoff.on,#ov.open')||(CAR.onb&&CAR.onb.on);
setInterval(()=>{if(!SCX.q.length||scBusy())return;playCut(SCX.q.shift())},700);

/* ---------- scene builders for big moments ---------- */
const sayT=(cat,id,v)=>{try{return say(cat,byId[id],v||{},true)||''}catch(e){return ''}};
function witnesses(n,ex){return shuffle(VIDS().filter(i=>!ex.includes(i))).slice(0,n)}
function bombScene(id){const c=byId[id];if(!c)return;const w=witnesses(3,[id]);const xs=[100,150,200];
 queueScene({loc:'pool',tag:c.allStar?'All-Star returns':'Bombshell',steps:[
  ...w.map((i,j)=>({t:'place',who:i,x:xs[j],expr:'smile'})),
  {t:'say',who:w[0],text:sayT('gossip',w[0],{themId:w[1]})||'Did anyone else hear the gate?'},
  {t:'title',text:c.allStar?'ALL-STAR':'BOMBSHELL',sub:c.allStar?`${c.name} · back from Season ${(c.prev||[]).join(', ')}`:`${c.name} · ${c.job}`,style:'bomb',sfx:'sting',ms:1500},
  {t:'enter',who:id,x:280,from:'right',slow:true,expr:'smug'},{t:'spot',who:id},{t:'zoom',who:id,s:1.5,ms:700},
  {t:'say',who:id,text:c.line||sayT('flirt',id,{themId:w[0]})},{t:'zoom',reset:true},{t:'unspot'},
  {t:'shock',ids:w},{t:'say',who:w[1],text:sayT('sc_bomb_react',w[1],{themId:id})||'Oh, this is a problem.'},
  {t:'say',who:w[2],text:sayT('sc_bomb_react',w[2],{themId:id})||'I need to sit down.'}]})}
function exitScene(id){const c=byId[id];if(!c)return;const w=witnesses(2,[id]);
 queueScene({loc:'firepit',tag:'Dumped from the island',steps:[{t:'place',who:w[0],x:110,expr:'soft'},{t:'place',who:w[1],x:170,expr:'soft'},{t:'place',who:id,x:260,flip:true,expr:'soft'},
  {t:'say',who:id,text:sayT('sc_exit_line',id,{themId:w[0]})||'Right. Well. It’s been a summer.'},{t:'hug',a:w[0],b:id},
  {t:'say',who:w[0],text:sayT('sc_exit_react',w[0],{themId:id})||'It won’t be the same without you.'},
  {t:'leave',who:id,to:'right',bag:true},{t:'text',text:`${c.name} has left the villa.`,ms:1800}]})}
function dateScene(a,b,outcome){const good=outcome==='spark';const loc=pick(['terrace','hideaway','terrace']);
 queueScene({loc,tag:'The date',steps:[{t:'enter',who:a,x:150,from:'left'},{t:'enter',who:b,x:240,from:'right'},
  {t:'say',who:a,text:sayT('date_banter',a,{themId:b})||'So. This is nice.'},{t:'say',who:b,text:sayT(good?'flirt':'date_banter',b,{themId:a})||'Yeah. Nice.'},
  ...(good?[{t:'say',who:a,text:sayT('date_spark',a,{themId:b})||'Can I kiss you?'},{t:'kiss',a,b},{t:'text',text:'The date sparked.'}]:outcome==='fine'?[{t:'hug',a,b},{t:'text',text:'A nice date. Not magic.'}]:[{t:'expr',who:a,expr:'shock'},{t:'wait',ms:900},{t:'text',text:outcome==='flop'?'Long silence. Neither wants a second date.':'It’s awkward. Very awkward.'}])]})}
function fightScene(ids){const [a,b,c2]=ids;if(!a||!b)return;queueScene({loc:'firepit',tag:'Villa meeting',steps:[{t:'place',who:a,x:110,expr:'smirk'},{t:'place',who:b,x:280,flip:true},...(c2?[{t:'place',who:c2,x:195}]:[]),
 {t:'say',who:a,text:sayT('group_fight',a,{themId:b})||'Can we talk about the elephant in the room?'},{t:'move',who:a,x:160},{t:'say',who:b,text:sayT('argue_defend',b,{themId:a})||'Don’t point at me.'},{t:'fight',a,b},
 ...(c2?[{t:'say',who:c2,text:sayT('mediator',c2,{})||'Everyone, breathe. Please.'}]:[])]})}
function crownScene(w){const [a,b]=w;if(!a||!b)return;queueScene({loc:'terrace',tag:'The final',hold:900,steps:[{t:'title',text:'Your winners',sub:`Season ${CAR.season}`,ms:1300},{t:'enter',who:a,x:150,from:'left',expr:'grin'},{t:'enter',who:b,x:240,from:'right',expr:'grin'},{t:'confetti'},{t:'kiss',a,b},{t:'say',who:a,text:sayT('finale_win',a,{themId:b})||'We did it.'},{t:'say',who:b,text:sayT('finale_win',b,{themId:a})||'Best summer of my life.'}]})}

/* ---------- hooks ---------- */
const _eb15=enterBomb;enterBomb=function(id){const r=_eb15(id);if(!SYNC.applying)bombScene(id);return r};
const _dl15=dumpLeft;dumpLeft=function(left){const r=_dl15(left);(left||[]).slice(0,2).forEach(id=>exitScene(id));return r};
const _li15=logIt;logIt=function(l,t,s,m){const r=_li15(l,t,s,m);if(!SYNC.applying&&m&&m.kind==='date'&&m.outcome&&m.ids&&m.ids.length>1&&Math.random()<(m.outcome==='spark'?1:.5))dateScene(m.ids[0],m.ids[1],m.outcome);return r};
const _ra15=runAct;runAct=function(k,i,p,a,b){const A=ACTS[k][i];const r=_ra15(k,i,p,a,b);if(A&&/villa meeting/i.test(A.n)){const ids=[...new Set(here(k).map(c=>c.id))];if(ids.length>=2)setTimeout(()=>{closeLoc();fightScene(ids.slice(0,3))},5200)}return r};
setInterval(()=>{if(ST.fin&&ST.fin.w&&ST.fin.w.length>1&&!ST.crowned){ST.crowned=true;crownScene(ST.fin.w)}},2000);
window.__test=Object.assign(window.__test||{},{scene:id=>bombScene(id),sceneQ:()=>SCX.q.length,sceneOn:()=>SCX.on,playCut,skipScene:scSkipNow});
