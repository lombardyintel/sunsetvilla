
/* ---------- systems 4: the interview room ---------- */
function iroomBack(){
 const slats=Array.from({length:28},(_,i)=>`<path d="M${i*14} 0V700" stroke="#D6AE80" stroke-width="2"/>`).join('');
 const bulbs=Array.from({length:11},(_,i)=>`<circle cx="${20+i*35}" cy="${62+Math.sin(i*1.1)*8}" r="4.5" fill="#FFE7B0" class="twinkle" style="animation-delay:${i*.2}s"/>`).join('');
 const leaf=(x,y,r,f)=>`<g transform="translate(${x} ${y}) rotate(${r}) scale(${f?-1:1} 1)"><path d="M0 0 C30 -40 80 -40 100 -10 C70 0 30 10 0 0Z" fill="#3E7C59"/><path d="M0 0 C40 -14 70 -16 96 -10" stroke="#2E5E43" stroke-width="2" fill="none"/></g>`;
 return `<defs><linearGradient id="ivsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FF9E7A"/><stop offset=".6" stop-color="#FFC48A"/><stop offset="1" stop-color="#FFE1B0"/></linearGradient><radialGradient id="ivglow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FF6F91" stop-opacity=".55"/><stop offset="1" stop-color="#FF6F91" stop-opacity="0"/></radialGradient></defs>
 <rect width="390" height="700" fill="#E9C9A0"/>${slats}
 <path d="M70 470 V220 Q195 90 320 220 V470Z" fill="url(#ivsky)"/><circle cx="250" cy="300" r="44" fill="#FFF1C8" opacity=".9"/><rect x="70" y="360" width="250" height="110" fill="#3F8FB0"/><path d="M70 380 H320" stroke="#FFE7B0" stroke-width="3" opacity=".5"/>
 <path d="M110 470 C112 400 118 340 132 300" stroke="#3A2A22" stroke-width="7" fill="none"/>${[0,60,130,200,260].map(r=>`<path transform="translate(132 300) rotate(${r})" d="M0 0 C18 -10 40 -8 52 4 C36 0 18 2 0 0Z" fill="#2E5E43"/>`).join('')}
 <path d="M70 470 V220 Q195 90 320 220 V470" stroke="#FFF4EA" stroke-width="16" fill="none"/>
 <ellipse cx="195" cy="120" rx="120" ry="34" fill="url(#ivglow)"/><text x="195" y="132" text-anchor="middle" font-family="Fraunces, Georgia, serif" font-style="italic" font-weight="700" font-size="34" fill="#FF6F91" stroke="#FFD1DC" stroke-width=".8" class="neon">Sunset Villa</text>
 <path d="M0 56 Q195 86 390 56" stroke="#5E4A3A" stroke-width="1.5" fill="none"/>${bulbs}
 <g transform="translate(195 470)"><path d="M0 120 C-170 60 -170 -150 -40 -170 C-15 -172 0 -150 0 -130 C0 -150 15 -172 40 -170 C170 -150 170 60 0 120Z" fill="#C98B4E"/>${Array.from({length:9},(_,i)=>`<path d="M0 100 L${Math.cos((-160+i*17.5)*Math.PI/180)*150} ${Math.sin((-160+i*17.5)*Math.PI/180)*150}" stroke="#A9703A" stroke-width="3"/>`).join('')}<path d="M0 120 C-140 70 -140 -120 -40 -140 C-18 -142 0 -122 0 -105 C0 -122 18 -142 40 -140 C140 -120 140 70 0 120Z" fill="none" stroke="#E2A866" stroke-width="5"/></g>
 ${leaf(-10,560,-30)}${leaf(10,620,-10)}${leaf(400,560,-30,true)}${leaf(380,620,-10,true)}
 <rect y="600" width="390" height="100" fill="#D8B48A"/><ellipse cx="195" cy="640" rx="150" ry="26" fill="#F2C6C2"/><rect x="95" y="560" width="200" height="40" rx="18" fill="#FF8AB0"/>`}
const VI={id:null,left:0,said:[],star:false,expr:'smile',pend:null};
const IVQ=[
 {k:'drawn',q:'Who are you drawn to right now?'},
 {k:'partner',q:c=>COUPLES[c.id]?`How are things with ${byId[COUPLES[c.id]].name}?`:'How does it feel being single in here?'},
 {k:'about',q:'What do you think of…',pickP:true},
 {k:'recouple',q:'Who are you picking at the next recoupling?'},
 {k:'game',q:'What’s your game plan?',rev:'game'},
 {k:'temper',q:'What would make you lose it in here?',rev:'temper'},
 {k:'message',q:c=>COUPLES[c.id]?`Anything you want to say to ${byId[COUPLES[c.id]].name}?`:'Anything to say to the villa?'},
 {k:'stir',q:c=>COUPLES[c.id]?`Did you know ${byId[COUPLES[c.id]].name} was on the daybeds with someone today?`:null,cost:3,stir:true}
];
function honest(c){return (ST.mood[c.id]||70)>=45&&c.game!=='Schemer'||Math.random()<.35}
function ivAnswer(k,x){const c=byId[VI.id],id=c.id,p=COUPLES[id],top=VIDS().filter(z=>z!==id).sort((a,b)=>AFF[id][b]-AFF[id][a])[0],k0=ST.known[id]=ST.known[id]||{};let cat,v={},expr='smile',note='';
 if(k==='drawn'){if(honest(c)){if(p&&top!==p){cat='lean_confess';v={themId:top,partnerId:p};expr='soft';k0.iv=VS.day;VI.star=true;note=`Honest answer. Your read on ${c.name} is exact for two days.`}else{cat='conf_love';v={themId:top};expr='grin';k0.iv=VS.day;note=`Honest answer: it's ${byId[top].name}. Read sharpened.`}}else{cat='iv_deflect';expr='smirk';note='They’re holding something back. Try again when their mood is higher.'}}
 if(k==='partner'){if(!p){cat='chat_feel';expr='soft'}else{const st=statusOf(id).label;cat=st==='Secure'?'conf_love':st==='Wobbling'?'conf_doubt':'torn_conf';v={themId:p,rivalId:top!==p?top:null};expr=st==='Secure'?'grin':'soft';note=`Status: ${st}.`}}
 if(k==='about'){const r=relOf(id,x);if(r==='couple'){cat='conf_love';v={themId:x};expr='grin'}else if(r==='rival'){cat='conf_jealous';v={themId:p||x,rivalId:x};expr='smug'}else if(AFF[id][x]>=52&&honest(c)){cat='lean_confess';v={themId:x,partnerId:p};expr='soft';VI.star=true;note=`${c.name} lights up talking about ${byId[x].name}.`}else{cat='gossip';v={themId:x};expr='smirk'}addAff(id,x,1)}
 if(k==='recouple'){if(!p){cat='pre_recouple';v={themId:top};expr='soft'}else if(honest(c)&&top!==p&&AFF[id][top]>AFF[id][p]){cat='pre_recouple';v={themId:top,partnerId:p};expr='soft';VI.star=true;note=`They might switch to ${byId[top].name}.`}else if(honest(c)){cat='recouple_stay';v={themId:p};expr='grin';note='Sounds settled. For now.'}else{cat='iv_deflect';expr='smirk';note='Dodged it.'}}
 if(k==='game'){cat='conf_strategy';v={themId:p};expr='smug';k0.game=true;note=`Game trait revealed: ${c.game}.`}
 if(k==='temper'){cat='iv_temper';expr='smirk';k0.temper=true;note=`Temper trait revealed: ${c.temper}.`}
 if(k==='message'){cat=p?'iv_message':'conf_villa';v={partnerId:p};expr='soft';if(p){addAff(p,id,3);note=`${byId[p].name} will see this when the episode airs.`}}
 if(k==='stir'){const o=p?topOther(p):null;cat='iv_stirred';v={partnerId:p,themId:p,otherId:o};expr='shock';addAff(id,p,-6);if(o)bump(id,o,'rival',4);moodUp([id],-8);addBuzz(.3);VI.star=true;note='Classic producer stir. Expect fireworks at the fire pit.'}
 const t=say(cat,c,v,true);VI.said.push([id,t]);VI.expr=expr;return {t,note}}
function openInterview(id){if(ST.reels<5){toast('Not enough reels. Go for a walk.');return}spend(5);closeSheet();VI.id=id;VI.left=3;VI.said=[];VI.star=false;VI.expr='smile';VI.pend=null;
 let el=document.getElementById('iroom');if(!el){el=document.createElement('div');el.id='iroom';el.className='iroom';document.getElementById('villa').appendChild(el)}
 el.classList.add('on');renderIV(say('iv_open',byId[id],{},true),'');}
function renderIV(line,note){const c=byId[VI.id],el=document.getElementById('iroom'),k=ST.known[c.id]||{},m=ST.mood[c.id]||70;
 el.innerHTML=`<div class="lvh"><button class="lback" id="ivBack">← Villa</button><div><h3>Interview room</h3><div class="sub">${c.name} · mood ${m>=70?'good':m>=45?'okay':'low'}${(k.iv&&VS.day-k.iv<2)?' · read exact':''}</div></div><span class="pill ivleft">${VI.left} question${VI.left===1?'':'s'} left</span></div>
 <svg class="ivsvg" viewBox="0 100 390 560" role="img" aria-label="${c.name} in the interview room">${iroomBack()}<g class="ivchar">${place(c,195,640,1.55,{expr:VI.expr,gaze:1})}</g>${line?bubble(28,330,line,.15,false):''}</svg>
 ${note?`<p class="ivnote">${note}</p>`:''}
 <div class="lab">${VI.pend?'About who?':VI.left?'Ask':'That’s time'}</div>
 ${VI.pend?`<div class="opts ivq">${VIDS().filter(x=>x!==c.id).map(x=>`<button data-ivp="${x}">${byId[x].name}</button>`).join('')}<button data-ivp="">Never mind</button></div>`:VI.left?`<div class="opts ivq">${IVQ.map((q,i)=>{const t=typeof q.q==='function'?q.q(c):q.q;if(!t)return '';const done=q.rev&&k[q.rev];return `<button data-ivq="${i}" ${done?'disabled':''}>${t}${q.cost?` <small>+${q.cost} reels</small>`:''}</button>`}).join('')}</div>`:`<button class="pbtn" id="ivMore">Keep them talking · 3 reels for 2 more</button>`}
 ${VI.said.length>1?`<div class="lab">Transcript</div><div class="ivtx">${VI.said.slice(1).map(([i,t])=>`<p>“${t}”</p>`).join('')}</div>`:''}`;
 document.getElementById('ivBack').addEventListener('click',closeIV);
 const more=document.getElementById('ivMore');if(more)more.addEventListener('click',()=>{if(ST.reels<3){toast('Not enough reels.');return}spend(3);VI.left=2;renderIV('','')});
 el.querySelectorAll('[data-ivq]').forEach(b=>b.addEventListener('click',()=>{const q=IVQ[+b.dataset.ivq];if(q.pickP){VI.pend=q;renderIV('','');return}if(q.cost){if(ST.reels<q.cost){toast('Not enough reels.');return}spend(q.cost)}VI.left--;startFx();const r=ivAnswer(q.k);const f=endFx();renderIV(r.t,r.note+(f?`<span class="fxrow">${f}</span>`:''))}));
 el.querySelectorAll('[data-ivp]').forEach(b=>b.addEventListener('click',()=>{const x=b.dataset.ivp;VI.pend=null;if(!x){renderIV('','');return}VI.left--;startFx();const r=ivAnswer('about',x);const f=endFx();renderIV(r.t,r.note+(f?`<span class="fxrow">${f}</span>`:''))}))}
function closeIV(){const el=document.getElementById('iroom');el.classList.remove('on');if(VI.said.length>1){const c=byId[VI.id];logIt('iroom',`Interview room: ${c.name} opens up.`,VI.star,{ids:[c.id],lines:VI.said.slice(1),kind:'conf',title:`Confessional: ${c.name}`});if(!ST.queue.includes(`Interview: ${c.name}`)){ST.queue.push(`Interview: ${c.name}`);renderQueue()}}syncLove();checkArcs();drawVilla();VI.said=[]}
/* interview room footage in the edit bay and the episode */
KCOL.conf='#4CC3C0';KTAKE.conf=['Honest','Scheming'];KMUS.conf='Sad';
const _cs2=clipScene;clipScene=function(c,last){if(c.kind!=='conf')return _cs2(c,last);const A=byId[c.ids[0]],L=(c.lines||[]).filter(l=>l[1]).slice(0,c.take===1?3:2);
 return {t:last?7.5:6.5,freezeAt:last?4.8:0,draw:()=>`<g class="zoom">${iroomBack()}${place(A,195,700,1.9,{expr:c.take===1?'smug':'soft',gaze:1})}</g><rect width="390" height="700" fill="${MT[c.music]||'transparent'}"/>${L.map(([i,t],j)=>cap(t,600-(L.length-1-j)*90,.4+j*2)).join('')}${lower('CONFESSIONAL',A.name,0,70)}`}};
