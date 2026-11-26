/* ---------- season casts: Season 1 is the pilot cast, every later season gets a new cast, every 5th season is All-Stars ---------- */
const CSLOTS=['juniper','kai','nova','marco','bodhi','sage','mabel','rocco','ivy','leo','theo','coco'].filter(id=>byId[id]);
const CKEYS=['name','sp','spName','job','top','bot','skirt','acc','iris','expr','heart','temper','game','vibe','goal','line','rare'];
const PILOT=Object.fromEntries(CSLOTS.map(id=>[id,Object.fromEntries(CKEYS.map(k=>[k,byId[id][k]]))]));
const PILOTNAME=Object.fromEntries(CSLOTS.map(id=>[byId[id].name,id]));
const isAllStars=s=>s>1&&s%5===0;
CAR.casts=CAR.casts||{};CAR.alumni=CAR.alumni||[];CAR.nextCast=CAR.nextCast||[];
const CATCH=["I'm here for love. And a tan. Mostly love.","I don't do drama. Drama does me.","My mum's watching, so I'll be on my best behaviour. Mostly.","I fall fast and I fall loud.","I've got a type, and it's 'trouble'.","Ask me anything. I'll lie about my age.","I'm loyal to a fault. The fault is usually theirs.","I'm the friend who tells you the truth. Then buys you a drink.","I came for a summer romance. I'll settle for a summer of chaos.","Don't let the smile fool you. Actually, do.","I'm a catch. Ask my nan.","I'm not competitive. I just always win.","Life's short. Wear the sequins.","I'll make you breakfast, but I won't make you a promise.","I've never been dumped. Can't wait to find out what it's like. Kidding.","I'm a hopeless romantic with a very good lawyer.","Honestly? I'm just here to find my person.","I read people for a living. Well, I read menus for a living. Same skill."];
function fixGold(sp){if(String(sp).startsWith('g_')&&!SP[sp])SP[sp]=Object.assign({},SP[sp.slice(2)],{fur:'#E9B44C',dark:'#8A5A12'})}
function genCast(s){const recent=new Set(Object.values(CAR.casts).flatMap(c=>Object.values(c).map(x=>x.name)).concat(Object.keys(PILOTNAME)));
 const signed=CAR.nextCast.splice(0,10);const regs=Object.keys(CREG).filter(r=>!CREG[r].lock&&CREG[r].sp);const out={};
 CSLOTS.forEach((slot,i)=>{let d=i<10&&signed.length?signed.shift():null;
  if(!d){let c,n=0;do{c=makeCand(pick(regs))}while(recent.has(c.name)&&n++<30);d=Object.fromEntries(CKEYS.map(k=>[k,c[k]]));d.spName=String(d.spName).replace(/ \(golden.*\)/,'');d.rare=false}
  recent.add(d.name);d.line=d.line||pick(CATCH);d.from=s;d.allStar=false;out[slot]=d});
 return out}
function allStarCast(s){const seen=new Set(),pool=[];
 const picks=(CAR.asPick||[]).map(k=>CAR.alumni.find(a=>a.key===k)).filter(Boolean);
 picks.concat(CAR.alumni.slice().sort((a,b)=>b.score-a.score)).forEach(a=>{if(a.from>=s||seen.has(a.d.name))return;seen.add(a.d.name);pool.push(a)});
 const out={};CSLOTS.forEach((slot,i)=>{const a=pool[i];if(a){out[slot]=Object.assign({},a.d,{allStar:true,prev:a.seasons.slice(),from:s,won:!!a.won})}});
 if(Object.keys(out).length<CSLOTS.length){const g=genCast(s);CSLOTS.forEach(sl=>{if(!out[sl])out[sl]=g[sl]})}
 CAR.asPick=[];return out}
function applyCast(cast){if(!cast)return;CSLOTS.forEach(slot=>{const d=cast[slot],c=byId[slot];if(!d||!c)return;CKEYS.concat(['from','allStar','prev','won']).forEach(k=>{if(k in d)c[k]=d[k];else if(['allStar','prev','won'].includes(k))delete c[k]});fixGold(c.sp);c.codes=[c.heart,c.temper,c.game,c.vibe].map(t=>CODE[t])});renameStatics()}
function curCast(){return Object.fromEntries(CSLOTS.map(id=>[id,Object.fromEntries(CKEYS.concat(['from','allStar','prev','won']).filter(k=>k in byId[id]).map(k=>[k,byId[id][k]]))]))}
/* prototype text written for the pilot cast: swap in the current cast's names */
function renameStatics(){const map={};Object.entries(PILOTNAME).forEach(([n,id])=>{if(byId[id].name!==n)map[n]=byId[id].name});const ks=Object.keys(map);if(!ks.length&&!renameStatics.done)return;
 const re=new RegExp('\\b('+Object.keys(PILOTNAME).join('|')+')\\b','g');const sw=t=>typeof t==='string'?t.replace(re,m=>byId[PILOTNAME[m]]?byId[PILOTNAME[m]].name:m):t;
 const fix=o=>{if(!o||typeof o!=='object')return;Object.keys(o).forEach(k=>{if(typeof o[k]==='string')o[k]=sw(o[k])})};
 try{CHAT.forEach(fix);fix(CLASH);BOARD.forEach(fix);CLIPS.forEach(fix);ARCS.forEach(a=>{fix(a)})}catch(e){}
 ['pTrailer','pEdit'].forEach(id=>{const el=document.getElementById(id);if(!el)return;const w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);let n;while(n=w.nextNode()){const t=sw(n.nodeValue);if(t!==n.nodeValue)n.nodeValue=t}});
 Object.keys(PILOTNAME).forEach(n=>{const id=PILOTNAME[n];PILOTNAME[byId[id].name]=id;if(byId[id].name!==n)delete PILOTNAME[n]});renameStatics.done=true}
/* alumni: everyone who appeared, scored by screen time and how far they got */
function recordAlumni(){const s=CAR.season;if(CAR.alumni.some(a=>a.from===s&&!a.d.allStar))return;const win=(ST.fin&&ST.fin.w)||[];
 const air={};(VS.log||[]).forEach(l=>(l.meta&&l.meta.ids||[]).forEach(i=>air[i]=(air[i]||0)+1));
 CSLOTS.forEach(id=>{const c=byId[id];if(!c)return;const inV=VIDS().includes(id),dumped=(ST.dumped||[]).includes(id);if(!inV&&!dumped)return;
  const key=c.name+'_'+(c.allStar&&c.prev?c.prev[0]:s);const old=CAR.alumni.find(a=>a.key===key);
  const sc=(win.includes(id)?10:0)+(inV?4:0)+Math.min(8,(air[id]||0)/3)+(c.allStar?-3:0);
  if(old){old.seasons.push(s);old.score=Math.max(old.score,sc);if(win.includes(id))old.won=true;return}
  CAR.alumni.push({key,from:c.from||s,seasons:[s],score:+sc.toFixed(1),won:win.includes(id),d:Object.fromEntries(CKEYS.map(k=>[k,c[k]]))})});
 CAR.alumni=CAR.alumni.sort((a,b)=>b.score-a.score).slice(0,150);saveCar()}
const _ow14=openWrap;openWrap=function(){try{recordAlumni()}catch(e){console.warn(e)}return _ow14.apply(this,arguments)};
/* signed "Starting cast" scouts join next season's cast */
setInterval(()=>{CAST.forEach(c=>{if(c.slot==='Starting cast'&&!c._kept&&CAR.nextCast.length<10){c._kept=1;const d=Object.fromEntries(CKEYS.map(k=>[k,c[k]]));d.spName=String(d.spName).replace(/ \(golden.*\)/,'');CAR.nextCast.push(d);saveCar();toast(`${c.name} is booked for next season's opening night.`)}})},2000);
/* the season's cast, applied before the season boots */
(function seasonCast(){const s=CAR.season;if(s<2)return;if(!CAR.casts[s]){CAR.casts[s]=isAllStars(s)?allStarCast(s):genCast(s)}applyCast(CAR.casts[s]);Object.keys(CAR.casts).map(Number).filter(k=>k<s-4).forEach(k=>delete CAR.casts[k]);saveCar()})();
/* shared seasons carry the cast so both phones see the same people */
const _ssC=snapState;snapState=function(){const o=_ssC();o.cast=curCast();o.story=ST.story;return o};
const _asC=applyState;applyState=function(o){if(o&&o.cast){applyCast(o.cast)}if(o&&o.story)ST.story=o.story;_asC(o)};
const _fsC=freshSeason;freshSeason=function(){const r=_fsC.apply(this,arguments);if(isAllStars(CAR.season)){ST.rating=+(ST.rating+.3).toFixed(1);ST.aud.viewers=+(ST.aud.viewers*1.25).toFixed(2)}ST.story=null;return r};
