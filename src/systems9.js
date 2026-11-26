
/* ---------- systems 9: villa screen v3: drama markers, dollhouse rooms, top strip, notifications, zoom ---------- */
const HR=Object.fromEntries(Object.entries(HOT).map(([k,d])=>{const m=d.match(/M(\d+) (\d+)h(\d+)v(\d+)/);return [k,{x:+m[1],y:+m[2],w:+m[3],h:+m[4]}]}));
/* what's happening where */
function hotAt(k){const p=here(k).map(c=>c.id);if(!p.length)return null;const pairs=[];p.forEach((a,i)=>p.slice(i+1).forEach(b=>pairs.push([a,b])));
 if(VS.req&&p.includes(VS.req.id))return {type:'talk',k,ids:[VS.req.id],why:`${nm(VS.req.id)} wants to talk`};
 const fight=pairs.find(([a,b])=>relOf(a,b)==='rival');if(fight)return {type:'fight',k,ids:fight,why:`Tension: ${nm(fight[0])} and ${nm(fight[1])}`};
 const fl=pairs.filter(([a,b])=>COUPLES[a]!==b&&(Math.min(AFF[a][b],AFF[b][a])>=46||Math.max(AFF[a][b],AFF[b][a])>=56)).sort((x,y)=>(AFF[y[0]][y[1]]+AFF[y[1]][y[0]])-(AFF[x[0]][x[1]]+AFF[x[1]][x[0]]))[0];
 if(fl)return {type:'flirt',k,ids:fl,why:`Flirting: ${nm(fl[0])} and ${nm(fl[1])}`};
 if(p.length>=3)return {type:'gossip',k,ids:p.slice(0,2),why:'Gossip session'};
 if(p.length===2&&COUPLES[p[0]]===p[1])return {type:'couple',k,ids:p,why:`${nm(p[0])} and ${nm(p[1])} alone`};
 return {type:'quiet',k,ids:p,why:p.length===1?`${nm(p[0])}, on their own`:'Quiet chat'}}
const HOTICON={talk:['#FF6F91','<text y="5" text-anchor="middle" font-family="Manrope, sans-serif" font-weight="800" font-size="15" fill="#fff">!</text>'],
 fight:['#E5484D','<path d="M1 -8 L-5 1 L0 1 L-2 8 L5 -2 L0 -2Z" fill="#fff"/>'],
 flirt:['#FF6F91','<path d="M0 6 C-8 0 -6 -6 0 -2 C6 -6 8 0 0 6Z" fill="#fff"/>'],
 gossip:['#9B7BD4','<circle cx="-5" r="1.8" fill="#fff"/><circle r="1.8" fill="#fff"/><circle cx="5" r="1.8" fill="#fff"/>'],
 couple:['#FF8A65','<path d="M0 5 C-6 0 -4 -5 0 -2 C4 -5 6 0 0 5Z" fill="none" stroke="#fff" stroke-width="1.6"/>']};
function markers(){let s='';Object.keys(LOC).forEach(k=>{const h=hotAt(k);if(!h||!HOTICON[h.type])return;let x,y;
 if(LOC[k].out){const ps=h.ids.map(i=>pos[i]).filter(p=>p&&!p.hidden);if(!ps.length)return;x=ps.reduce((a,p)=>a+p.x,0)/ps.length;y=Math.min(...ps.map(p=>p.y))-132}else{const r=HR[k];x=r.x+r.w-12;y=r.y+10}
 const [c,ic]=HOTICON[h.type];s+=`<g class="hotm" data-hot="${k}" transform="translate(${x} ${y})" style="cursor:pointer"><circle r="16" fill="transparent"/><g class="hotpulse"><circle r="11" fill="${c}" stroke="#fff" stroke-width="2"/>${ic}</g></g>`});
 if(ST.sel&&pos[ST.sel]&&!pos[ST.sel].hidden){const v=pos[ST.sel],n=nm(ST.sel),w=n.length*7+18;s+=`<g transform="translate(${v.x} ${v.y+16})"><rect x="${-w/2}" y="-10" width="${w}" height="20" rx="10" fill="#241A2E"/><text y="4" text-anchor="middle" font-family="Manrope, sans-serif" font-weight="700" font-size="11" fill="#FFF1E6">${n}</text></g>`}
 return s}
const g9=window.__ghosts;window.__ghosts=()=>(g9?g9():'')+markers();
/* tapping a marker jumps into the scene */
const SCN={flirt:[['flirt','date_banter'],'flirt on camera'],fight:[['rival_snark','bicker'],'clash'],gossip:[['gossip','gossip'],'swap gossip'],couple:[['couple_cute','couple_cute'],'have a sweet moment'],quiet:[['small_talk','small_talk'],'chat']};
vsvg.addEventListener('click',e=>{const g=e.target.closest('[data-hot]');if(!g)return;e.stopPropagation();const h=hotAt(g.dataset.hot);if(!h)return;
 if(h.type==='talk'){openRequest(h.ids[0]);return}openLoc(h.k);const [a,b]=h.ids,sc=SCN[h.type];if(!b)return;
 const t1=say(sc[0][0],byId[a],{themId:b,otherId:topOther(b)},true),t2=say(sc[0][1],byId[b],{themId:a,otherId:topOther(a)},true);
 setTimeout(()=>{if(VS.open!==h.k)return;addFeed(h.k,`<b>${nm(a)} to ${nm(b)}:</b> “${t1}”`);bubble2(byId[a],t1)},500);setTimeout(()=>{if(VS.open!==h.k)return;addFeed(h.k,`<b>${nm(b)}:</b> “${t2}”`);bubble2(byId[b],t2)},2100);
 if(h.type!=='quiet'){if(h.type==='flirt'){addAff(a,b,2);addAff(b,a,2)}logIt(h.k,`${nm(a)} and ${nm(b)} ${sc[1]} in the ${LOC[h.k].name.toLowerCase()}.`,h.type==='fight'||h.type==='flirt',{ids:[a,b],lines:[[a,t1],[b,t2]],kind:'act',title:`${nm(a)} + ${nm(b)} · ${LOC[h.k].name}`})}},true);
/* ---------- dollhouse: see who's inside ---------- */
function rooms(){const night=TIMES[VS.t]==='Night',gh=TIMES[VS.t]==='Golden hour';let s='<defs>';Object.keys(HR).forEach(k=>{if(LOC[k].out)return;const r=HR[k];s+=`<clipPath id="rc_${k}"><rect x="${r.x+3}" y="${r.y+3}" width="${r.w-6}" height="${r.h-6}" rx="8"/></clipPath>`});s+='</defs>';
 Object.keys(HR).forEach(k=>{if(LOC[k].out)return;const r=HR[k],p=here(k);const lit=p.length>0;
  s+=`<rect x="${r.x+3}" y="${r.y+3}" width="${r.w-6}" height="${r.h-6}" rx="8" fill="${lit?(night?'#FFD58A':gh?'#FFE2B8':'#FFF1DA'):'#3A2840'}" opacity="${lit?.92:.35}"/>`;
  if(lit){const sc=r.h>=60?.26:.17,n=Math.min(p.length,6),step=(r.w-16)/n;s+=`<g clip-path="url(#rc_${k})">${p.slice(0,6).map((c,i)=>place(c,r.x+8+step*(i+.5),r.y+r.h-2+(r.h>=60?10:6),sc,{still:true})).join('')}</g>`}
  s+=`<text x="${r.x+8}" y="${r.y+(r.h>=60?15:13)}" font-family="Manrope, sans-serif" font-weight="800" font-size="8" fill="${lit?'#7A5E48':'#CDB9C8'}" letter-spacing=".06em">${LOC[k].name.toUpperCase()}${p.length?` · ${p.length}`:''}</text>`});return s}
const u9=window.__VX.under;window.__VX.under=function(){return rooms()+u9.call(this)};
/* ---------- bigger islanders ---------- */
/* (scale and hit area changed in drawVilla) */
/* ---------- places bar says why ---------- */
const HOTRANK={talk:5,fight:4,flirt:3,gossip:2,couple:1,quiet:0};
const _rt10=renderTime;renderTime=function(){_rt10();const pc=document.getElementById('pchips');if(pc){const L=Object.keys(LOC).map(k=>({k,h:hotAt(k),n:here(k).length})).sort((a,b)=>((b.h?HOTRANK[b.h.type]:-1)-(a.h?HOTRANK[a.h.type]:-1))||b.n-a.n);
 pc.innerHTML=L.map(({k,h,n})=>`<button data-loc="${k}" class="${n?'':'empty'}${VS.open===k?' on':''} ${h?'h-'+h.type:''}"><span class="pcn">${LOC[k].name}<b>${n}</b></span><small>${h?h.why:'Empty'}</small></button>`).join('')}
 const T=TIMES[VS.t],dots=TIMES.map((x,i)=>`<i class="${i<=VS.t?'on':''}"></i>`).join('');const tb=document.getElementById('timeCtl');if(tb)tb.innerHTML=`<span>S${ST.season} · Day ${VS.day}</span>${T}<small class="tdots">${dots}</small>`;updStrip()};
/* ---------- top strip and notification stack ---------- */
const villa9=document.getElementById('villa');
villa9.insertAdjacentHTML('beforeend',`<div class="tstrip" id="tstrip"><button id="tsBrief" aria-label="Today's brief"><span class="ring"></span><b>Brief</b></button><div class="tsmid"><span id="tsBuzz"></span><span id="tsView"></span></div><button id="tsMenu" aria-label="Producer tools"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button></div><div class="notes" id="notes"></div><button class="zreset" id="zreset" hidden>Reset view</button>`);
function updStrip(){const B=ST.brief,d=B?B.goals.filter(g=>g.done).length:0;const b=document.getElementById('tsBrief');if(!b)return;b.querySelector('.ring').style.setProperty('--p',(d/3*100)+'%');b.querySelector('b').textContent=`Brief ${d}/3`;
 const bz=ST.hype||0;document.getElementById('tsBuzz').innerHTML=`<em>Tonight</em><i class="bz"><u style="width:${Math.min(100,bz/2.5*100)}%"></u></i><small>buzz +${bz.toFixed(1)}</small>`;document.getElementById('tsView').innerHTML=`<em>Viewers</em><b>${(ST.aud?ST.aud.viewers:1).toFixed(2)}M</b>`}
setInterval(updStrip,1500);updStrip();
document.getElementById('tsBrief').addEventListener('click',()=>showStatus());
document.getElementById('tsMenu').addEventListener('click',()=>{ST.sel=null;const eyeOn=ST.eye,lbl=ST.mapLabels;sheet.innerHTML=`${XB}<h3>Producer tools</h3><div class="tools9">
 <button data-t9="status"><b>Show status</b><span>Brief, storylines, twists, today's log</span></button>
 <button data-t9="phone"><b>Villa phone</b><span>Send the islanders a text</span></button>
 <button data-t9="career"><b>Season &amp; career</b><span>Reward track, audience, office, collection</span></button>
 <button data-t9="eye" class="${eyeOn?'on':''}"><b>Producer's Eye ${eyeOn?'on':'off'}</b><span>Show who likes, loves and clashes with who</span></button>
 <button data-t9="labels" class="${lbl?'on':''}"><b>Place labels ${lbl?'on':'off'}</b><span>Name every spot on the map</span></button></div>`;sheet.classList.add('open');
 sheet.querySelectorAll('[data-t9]').forEach(b=>b.addEventListener('click',()=>{const t=b.dataset.t9;if(t==='status'){showStatus();return}if(t==='career'){openCareer('season');return}closeSheet();const id={phone:'phoneBtn',eye:'eye',labels:'mapBtn'}[t];const el=document.getElementById(id);if(el)el.click()}))});
/* move pop-up chips into the stack */
const notes=document.getElementById('notes');const NOTEIDS=['offchip','ivreq','chchip'];
function tidyNotes(){NOTEIDS.forEach(id=>{const el=document.getElementById(id);if(el&&el.parentNode!==notes)notes.appendChild(el)});const n=notes.children.length;notes.dataset.more=n>2?`+${n-2} more`:'';notes.classList.toggle('many',n>2)}
new MutationObserver(tidyNotes).observe(villa9,{childList:true});tidyNotes();
/* hint only when it's saying something useful */
const hint9=document.getElementById('hint');new MutationObserver(()=>{const t=hint9.textContent.trim();hint9.classList.toggle('quiet',!t||/^Tap a person or a place/.test(t))}).observe(hint9,{childList:true,characterData:true,subtree:true});hint9.classList.add('quiet');
/* hide the strip on other screens */
const _gp10=goPlace;goPlace=function(id){_gp10(id);['tstrip','notes'].forEach(x=>{const e=document.getElementById(x);if(e)e.style.visibility=id==='villa'?'visible':'hidden'})};
/* ---------- zoom and pan ---------- */
const VZ={s:1,cx:195,cy:null,base:null};let dragMoved=false;
const _fv=fitVilla;fitVilla=function(){_fv();const vb=vsvg.getAttribute('viewBox').split(' ').map(Number);VZ.base=vb;if(VZ.s<=1.001){document.getElementById('zreset').hidden=true;return}
 const w=vb[2]/VZ.s,h=vb[3]/VZ.s;if(VZ.cy==null)VZ.cy=vb[1]+vb[3]/2;VZ.cx=clamp(VZ.cx,w/2,390-w/2);VZ.cy=clamp(VZ.cy,vb[1]+h/2,vb[1]+vb[3]-h/2);vsvg.setAttribute('viewBox',`${VZ.cx-w/2} ${VZ.cy-h/2} ${w} ${h}`);document.getElementById('zreset').hidden=false};
function zoomTo(s,px,py){const r=vsvg.getBoundingClientRect(),vb=vsvg.getAttribute('viewBox').split(' ').map(Number);const fx=vb[0]+(px-r.left)/r.width*vb[2],fy=vb[1]+(py-r.top)/r.height*vb[3];VZ.s=clamp(s,1,2.4);if(VZ.s<=1.001){VZ.s=1;VZ.cy=null}else{VZ.cx=fx;VZ.cy=fy}fitVilla()}
vsvg.style.touchAction='none';
vsvg.addEventListener('wheel',e=>{e.preventDefault();zoomTo(VZ.s*(e.deltaY<0?1.15:1/1.15),e.clientX,e.clientY)},{passive:false});
vsvg.addEventListener('dblclick',e=>{zoomTo(VZ.s>1.2?1:1.8,e.clientX,e.clientY)});
const PT=new Map();let pinch0=null,pan0=null;
vsvg.addEventListener('pointerdown',e=>{PT.set(e.pointerId,{x:e.clientX,y:e.clientY});dragMoved=false;if(PT.size===2){const [a,b]=[...PT.values()];pinch0={d:Math.hypot(a.x-b.x,a.y-b.y),s:VZ.s,mx:(a.x+b.x)/2,my:(a.y+b.y)/2}}else pan0={x:e.clientX,y:e.clientY,cx:VZ.cx,cy:VZ.cy}});
vsvg.addEventListener('pointermove',e=>{if(!PT.has(e.pointerId))return;PT.set(e.pointerId,{x:e.clientX,y:e.clientY});
 if(PT.size===2&&pinch0){const [a,b]=[...PT.values()];dragMoved=true;zoomTo(pinch0.s*Math.hypot(a.x-b.x,a.y-b.y)/pinch0.d,pinch0.mx,pinch0.my)}
 else if(pan0&&VZ.s>1){const dx=e.clientX-pan0.x,dy=e.clientY-pan0.y;if(Math.abs(dx)+Math.abs(dy)>6){dragMoved=true;const r=vsvg.getBoundingClientRect(),vb=vsvg.getAttribute('viewBox').split(' ').map(Number);VZ.cx=pan0.cx-dx/r.width*vb[2];VZ.cy=pan0.cy-dy/r.height*vb[3];fitVilla()}}});
const ptEnd=e=>{PT.delete(e.pointerId);if(PT.size<2)pinch0=null;if(!PT.size)pan0=null};vsvg.addEventListener('pointerup',ptEnd);vsvg.addEventListener('pointercancel',ptEnd);
vsvg.addEventListener('click',e=>{if(dragMoved){e.stopPropagation();e.preventDefault();dragMoved=false}},true);
document.getElementById('zreset').addEventListener('click',()=>{VZ.s=1;VZ.cy=null;fitVilla()});
renderTime();drawVilla();
