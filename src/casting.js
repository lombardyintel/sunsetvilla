
/* ---------- casting van v2 ---------- */
const CREG={
 'Coral Coast':{stops:['Boardwalk','Surf shack','Volleyball court','Pier at sunset'],sp:['otter','fox','dog','poodle','redpanda'],sky:'#FFD9C2',ground:'#F3D5BC',acc:'#3F8FB0'},
 'Blossom Valley':{stops:['Flower market','Orchard café','Village fair','Bakery queue'],sp:['bunny','deer','koala','redpanda','dog'],sky:'#FDE3EC',ground:'#DDEFD8',acc:'#9BC59D'},
 'Neon City':{stops:['Rooftop bar','Night market','Karaoke club','Record shop'],sp:['cat','raccoon','fox','wolf','poodle'],sky:'#3A2C5A',ground:'#2A1F2D',acc:'#FF6F91'},
 'Alpine Lodge':{stops:['Ski lift','Hot tub deck','Fondue night','Snowball fight'],sp:['arcticfox','wolf','koala','deer','bunny'],sky:'#DCEBF5',ground:'#F4F8FB',acc:'#4A7FB0'},
 'Moonlit Isles':{lock:true}
};
const ACT={
 'Boardwalk':['buying ice cream for a kid who dropped theirs','roller-skating backwards and showing off','doing a magic trick for strangers','haggling over sunglasses'],
 'Surf shack':['teaching a surf lesson with a lot of shouting','waxing a board very seriously','telling a crowd about the one big wave','napping in a hammock'],
 'Volleyball court':['winning a beach volleyball game, loudly','losing a game and demanding a rematch','cheering for the other team','refereeing, badly'],
 'Pier at sunset':['sketching couples who walk past','writing in a notebook','proposing a toast to the sunset','feeding gulls against the rules'],
 'Flower market':['making a bouquet for a stranger','arguing about tulips','smelling every single rose','buying flowers for their mum'],
 'Orchard café':['reading poetry out loud','baking scones for the whole café','on a very awkward first date','fixing the café\'s coffee machine'],
 'Village fair':['winning every coconut shy','crying at the sheep competition','leading a conga line','judging the pie contest'],
 'Bakery queue':['letting everyone go ahead of them','chatting up the baker','debating croissants with a stranger','eating a cake before paying'],
 'Rooftop bar':['DJing a set nobody asked for','networking aggressively','dancing alone and loving it','telling the bartender their life story'],
 'Night market':['taste-testing every stall','haggling like a pro','singing along to a street band','taking photos of everything'],
 'Karaoke club':['belting a power ballad','duetting with a stranger','refusing to give up the mic','hyping up a shy singer'],
 'Record shop':['arguing about album covers','recommending records to strangers','dancing in the aisle','reorganizing the shelves'],
 'Ski lift':['helping a nervous beginner','showing off on the slopes','stuck on the lift and singing','wiping out spectacularly'],
 'Hot tub deck':['holding court in the hot tub','reading a thriller in the steam','telling ghost stories','starting a snowball fight from the tub'],
 'Fondue night':['dropping bread in the fondue, again','toasting everyone at the table','cooking for twenty strangers','debating cheese with the chef'],
 'Snowball fight':['leading a snowball army','building an elaborate snow fort','calling a ceasefire to make snow angels','sneak-attacking their friends']
};
const NAMES=['Kiki','Jett','Lola','Otis','Pia','Remy','Suki','Taz','Vera','Wren','Zane','Bea','Cruz','Dax','Elle','Gus','Hana','Ike','Jojo','Kit','Luca','Mae','Nico','Opal','Pax','Rue','Sol','Tess','Uma','Vic','Wes','Yara','Zola','Ari','Rio','Dot','Mika','Finn','Ember','Noor'];
const JOBS=['Barista','Firefighter','Dental nurse','Personal trainer','Florist','Surf instructor','Tattoo artist','DJ','Estate agent','Primary school teacher','Pastry chef','Paramedic','Lifeguard','Content creator','Physio','Pilot','Hairdresser','Bartender','Architect','Dog groomer','Yoga teacher','Accountant','Fashion student','Mechanic','Wedding planner','Zookeeper','Chef','Graphic designer','Nurse','Real estate agent'];
const SPNAME={redpanda:'Red panda',fox:'Fox',otter:'Otter',cat:'Cat',bunny:'Bunny',raccoon:'Raccoon',deer:'Deer',dog:'Golden retriever',wolf:'Wolf',koala:'Koala',arcticfox:'Arctic fox',poodle:'Poodle'};
const TOPS=['#FFF4EA','#FF8A65','#4CC3C0','#F6C35B','#2A1F2D','#9BC59D','#FF8AB0','#1F2A44','#C65D3B'];
const BOTS=['#2E5E7E','#E9D8C4','#2A1F2D','#FFF4EA','#3FB8B0','#C65D3B'];
const TR={heart:['Loyal','Flirty','Slow-burn','Hopeless romantic'],temper:['Calm','Fiery','Sensitive','Sarcastic'],game:['Genuine','Strategic','Schemer','Clueless'],vibe:['Life of the party','Wallflower','Mother hen','Wildcard']};
const GOALS=['Love','Fame','Prize','Adventure'];
const pick=a=>a[Math.floor(Math.random()*a.length)];
let cid=0;
function makeCand(region,opts={}){
 const R=CREG[region],sp=pick(R.sp),gold=!!opts.gold;
 let spKey=sp;if(gold){spKey='g_'+sp;SP[spKey]=Object.assign({},SP[sp],{fur:'#E9B44C',dark:'#8A5A12'})}
 const c={id:'cand'+(++cid),name:pick(NAMES),sp:spKey,spName:SPNAME[sp]+(gold?' (golden hour, rare)':''),job:pick(JOBS),top:pick(TOPS),bot:pick(BOTS),skirt:Math.random()<.5,acc:pick(['glasses','chain','flower','headband','none']),iris:pick(['#3E7C59','#4A6FA5','#6B3E1E','#E2B13C','#2B1A10']),expr:pick(['smile','grin','smirk','soft','smug']),
  heart:pick(TR.heart),temper:pick(TR.temper),game:pick(TR.game),vibe:pick(TR.vibe),goal:pick(GOALS),rare:gold,known:{heart:true,vibe:true},hints:[],asked:[],obs:0,chem:null,ref:opts.ref||null,bomb:true};
 c.codes=[c.heart,c.temper,c.game,c.vibe].map(t=>CODE[t]);
 return c;
}
const OBS=[
 {k:'temper',label:'Watch how they treat the staff',res:{Calm:'A waiter spills a drink on them. They laugh it off and tip extra.',Fiery:'They argue with the referee for two full minutes. Then hug him.',Sensitive:'A stranger compliments their outfit and they tear up a little.',Sarcastic:'They thank the waiter with a deadpan "oh good, more ice."'}},
 {k:'game',label:'Peek at their phone',res:{Genuine:'Texting their mum: "having the best day x".',Strategic:'A notes app list titled "Pros and cons: everyone".',Schemer:'The same "miss you" sent to three different people.',Clueless:'They\'ve texted the wrong group chat. Twice.'}},
 {k:'goal',label:'Point the camera at them',res:{Love:'They don\'t notice the camera. They\'re watching an old couple hold hands.',Fame:'They find their light, fix their hair, and wave in under a second.',Prize:'They ask how much the prize is before they say hello.',Adventure:'They ask if they can drive the van. And the boat. Is there a boat?'}}
];
const QS=[
 {k:'goal',q:'Why reality TV?',a:{Love:["Honestly? Dating apps are a nightmare. I want to meet someone for real.","I've been single for two years. I'm ready. I'm so ready."],Fame:["My followers have been begging me to do something like this.","I've always felt like I was meant to be on screen. Is that weird?"],Prize:["Think of what that prize could do. I've got plans. Big plans.","I'd be lying if I said the prize wasn't a factor. A big factor."],Adventure:["I've never done anything like this. That's exactly why I want to.","My friends dared me. I never turn down a dare."]}},
 {k:'heart',q:"What's your type?",a:{Loyal:["Someone who texts back. Someone who stays.","Honest people. I can't stand games."],Flirty:["My type? Breathing. Kidding. Mostly.","Confident, funny, a little bit trouble."],'Slow-burn':["I don't know until I know. It takes me a while.","Someone I can talk to for hours before anything happens."],'Hopeless romantic':["Someone who'd write me a letter. A real one.","The kind of person you'd see at the end of a film, running through an airport."]}},
 {k:'temper',q:'Worst date ever?',a:{Calm:["They forgot their wallet. I paid. We laughed. It was fine.","Honestly, I don't have bad dates. I have funny stories."],Fiery:["They were rude to the waiter. I left before the starters.","They said my favorite team was rubbish. We're not speaking."],Sensitive:["They looked at their phone the whole time. I cried in the taxi.","They forgot my name. Halfway through. I still think about it."],Sarcastic:["They brought their mum. Lovely woman. Terrible date.","They said 'I'm not like other people' four times. They were exactly like other people."]}},
 {k:'game',q:'What would your ex say about you?',a:{Genuine:["That I'm too honest. Is that a bad thing?","That I always tell people exactly how I feel."],Strategic:["That I always seemed one step ahead. They're not wrong.","That I plan everything. Even arguments."],Schemer:["Nothing, if they know what's good for them. Kidding! Sort of.","That they never knew what I was thinking. Good."],Clueless:["Which one? Wait, I've only had one. What did they say?","That I once went to the wrong wedding. It was a nice wedding."]}},
 {k:'vibe',q:"What's your party trick?",a:{'Life of the party':["Getting a whole room to do the same dance.","I can make friends with any bouncer, anywhere."],Wallflower:["Leaving early without anyone noticing. Very skilled.","I'm the one in the kitchen having the best conversation."],'Mother hen':["Making sure everyone gets home and drinks water.","Fixing everyone's hair at 2 a.m."],Wildcard:["I once ended up on stage with the band. Don't ask how.","Nobody knows what I'll do next. Including me."]}}
];
const STOPEV=[
 {k:'none',w:3},
 {k:'rival',w:1,t:'A rival network\'s van just pulled up. You can only approach one of them before they\'re gone.'},
 {k:'golden',w:1,t:'Golden hour. The light is perfect, and one of them is a rare golden variant.'},
 {k:'friends',w:1,t:'They\'re all friends. Sign one and the others might send you referrals.'}
];
const CS2={region:'Coral Coast',toStop:600,stage:'road',stop:null,cands:[],ev:null,cur:null,approached:0,roster:[],fork:null,res:'',sweet:'none',pref:null};
function evPick(){const tot=STOPEV.reduce((a,e)=>a+e.w,0);let r=Math.random()*tot;for(const e of STOPEV){if((r-=e.w)<0)return e}return STOPEV[0]}
function stopScene(){
 const R=CREG[CS2.region],dark=CS2.region==='Neon City';
 let s=`<rect width="360" height="180" fill="${R.sky}"/>`;
 if(CS2.region==='Coral Coast')s+=`<circle cx="300" cy="60" r="26" fill="#FFE7B0"/><rect y="70" width="360" height="26" fill="#3F8FB0"/>`;
 if(CS2.region==='Blossom Valley')s+=[30,90,150,210,270,330].map((x,i)=>`<circle cx="${x}" cy="${70+(i%2)*8}" r="22" fill="${i%2?'#F7B7C4':'#9BC59D'}"/>`).join('');
 if(dark)s+=[0,40,80,130,180,230,270,320].map((x,i)=>`<rect x="${x}" y="${30+(i%3)*14}" width="38" height="80" fill="#43334F"/><rect x="${x+8}" y="${44+(i%3)*14}" width="6" height="6" fill="#F6C35B"/><rect x="${x+22}" y="${58+(i%3)*14}" width="6" height="6" fill="#FF6F91"/>`).join('')+lights(0,20,360,24,30,9);
 if(CS2.region==='Alpine Lodge')s+=`<path d="M0 100 L70 30 L140 100 L210 20 L290 100 L360 40 V100Z" fill="#FFFFFF"/><path d="M70 30 L85 45 L60 45Z M210 20 L228 38 L195 38Z" fill="#DCEBF5"/>`;
 s+=`<rect y="100" width="360" height="80" fill="${R.ground}"/><rect x="120" y="22" width="120" height="24" rx="12" fill="${dark?'#FF6F91':'#241A2E'}"/><text x="180" y="38" text-anchor="middle" font-family="Manrope,Arial" font-weight="800" font-size="11" fill="#FFF4EA">${CS2.stop.toUpperCase()}</text>`;
 CS2.cands.forEach((c,i)=>{const x=70+i*110;s+=`<g data-cand="${i}" style="cursor:pointer;opacity:${c.gone?.35:1}"><rect x="${x-38}" y="70" width="76" height="110" fill="transparent"/>${place(c,x,168,.36,{d:i*.4})}<rect x="${x-30}" y="170" width="60" height="16" rx="8" fill="#FFF4EA"/><text x="${x}" y="182" text-anchor="middle" font-family="Manrope,Arial" font-weight="700" font-size="10" fill="#241A2E">${c.name}${c.rare?' ★':''}</text></g>`});
 return s;
}
function renderCast(){
 const R=Object.keys(CREG);
 document.getElementById('regions').innerHTML=R.map(n=>`<button data-reg="${n}" class="${n===CS2.region?'on':''}" ${CREG[n].lock?'disabled title="Needs 300 Fame"':''}>${n}${CREG[n].lock?' · locked':''}</button>`).join('');
 document.getElementById('roster').textContent=10+CS2.roster.length;
 document.getElementById('roadSvg').innerHTML=roadSvg2();
 document.getElementById('stopTxt').textContent=CS2.stage==='road'?`Next stop in ${CS2.toStop.toLocaleString('en-US')} steps${CS2.fork?` · heading to ${CS2.fork}`:''}`:`Stopped at the ${CS2.stop}`;
 document.getElementById('walk500').style.display=CS2.stage==='road'?'':'none';
 const st=document.getElementById('enc');st.classList.add('on');
 if(CS2.stage==='road'){st.innerHTML=`<div class="lab">While you drive</div><p style="margin:6px 0 0;font-size:13px">Your van stops every 1,000 steps in this demo. Partner's van is on the Neon City route, 420 steps from a stop.</p>${CS2.pref?`<p style="margin:8px 0 0;font-size:13px"><b>Referral waiting:</b> ${CS2.pref}</p>`:''}`}
 if(CS2.stage==='stop'){st.innerHTML=`${CS2.ev.t?`<div class="evb">${CS2.ev.t}</div>`:''}<svg viewBox="0 0 360 190" class="stopsvg" role="img" aria-label="Three candidates at the ${CS2.stop}">${stopScene()}</svg><div class="lab" style="margin:6px 0">Tap someone to approach. ${CS2.ev.k==='rival'?'One chance only.':'You can approach all three.'}</div>${CS2.cands.map((c,i)=>`<div class="act"><b>${c.name}</b> is ${ACT[CS2.stop][i%ACT[CS2.stop].length]}.${c.ref?` <span class="tagx">${c.ref}</span>`:''}</div>`).join('')}<button class="pbtn" id="leaveStop">Back on the road</button>`;
  st.querySelector('svg').addEventListener('click',e=>{const g=e.target.closest('[data-cand]');if(!g)return;const c=CS2.cands[+g.dataset.cand];if(c.gone)return;if(CS2.ev.k==='rival'&&CS2.approached>=1){toast('The rival van got the others. Next stop!');return}CS2.approached++;CS2.cur=c;CS2.stage='meet';CS2.res='';CS2.sweet='none';renderCast()});
  document.getElementById('leaveStop').addEventListener('click',chooseFork)}
 if(CS2.stage==='fork'){st.innerHTML=`<div class="lab">Which way?</div><div class="forks">${CS2.forks.map(f=>`<button data-fork="${f}"><b>${f}</b><small>${forkHint(f)}</small></button>`).join('')}</div>`;st.querySelectorAll('[data-fork]').forEach(b=>b.addEventListener('click',()=>{CS2.fork=b.dataset.fork;CS2.stage='road';CS2.toStop=1000;renderCast()}))}
 if(CS2.stage==='meet')renderMeet(st);
 document.getElementById('recruits').innerHTML=CS2.roster.length?`<div class="lab" style="width:100%">Signed this session</div>`+CS2.roster.map(r=>`<span>${r.name} · ${r.slot}${r.mood==='thrilled'?' · thrilled':r.mood==='reluctant'?' · reluctant':''}</span>`).join(''):'';
}
function forkHint(f){return {'Boardwalk':'Show-offs and sweethearts','Surf shack':'Wildcards','Volleyball court':'Competitive types','Pier at sunset':'Romantics','Flower market':'Romantics','Orchard café':'Genuine types','Village fair':'Party people','Bakery queue':'Mother hens','Rooftop bar':'Schemers','Night market':'Strategists','Karaoke club':'Life of the party','Record shop':'Slow-burners','Ski lift':'Thrill-seekers','Hot tub deck':'Flirts','Fondue night':'Calm types','Snowball fight':'Fiery types'}[f]||'Who knows'}
function chooseFork(){const s=CREG[CS2.region].stops.filter(x=>x!==CS2.stop);CS2.forks=[pick(s),pick(s.filter(x=>x!==CS2.forks?.[0]))];if(CS2.forks[0]===CS2.forks[1])CS2.forks[1]=s.find(x=>x!==CS2.forks[0]);CS2.stage='fork';renderCast()}
function arriveStop(){
 CS2.stop=CS2.fork||pick(CREG[CS2.region].stops);CS2.ev=evPick();CS2.approached=0;
 CS2.cands=[0,1,2].map(i=>makeCand(CS2.region,{gold:CS2.ev.k==='golden'&&i===1}));
 if(CS2.pref){CS2.cands[2].ref=CS2.pref;CS2.pref=null}
 CS2.stage='stop';toast(`Casting stop: ${CS2.stop}`);renderCast();
}
function roadSvg2(){const prog=Math.max(0,Math.min(1,1-CS2.toStop/1000)),vx=30+prog*270,R=CREG[CS2.region];
 return `<rect width="360" height="120" fill="${R.sky}"/><rect y="50" width="360" height="22" fill="${R.acc}" opacity=".8"/><path d="M0 72 H360 V120 H0Z" fill="${R.ground}"/><path d="M0 92 H360" stroke="#8C7A6A" stroke-width="14"/><path d="M0 92 H360" stroke="#FFF4EA" stroke-width="2" stroke-dasharray="12 10"/><g transform="translate(320 72)"><rect x="-4" y="-26" width="8" height="26" fill="#241A2E"/><rect x="-18" y="-38" width="36" height="14" rx="3" fill="#FF8A65"/><text y="-28" text-anchor="middle" font-family="Manrope,Arial" font-weight="700" font-size="7" fill="#241A2E">${(CS2.fork||'CASTING').toUpperCase().slice(0,12)}</text></g><g transform="translate(${vx.toFixed(1)} 92)"><g class="idle"><rect x="-22" y="-20" width="44" height="18" rx="6" fill="#FFF4EA" stroke="#241A2E" stroke-width="1.5"/><rect x="-18" y="-17" width="12" height="8" rx="2" fill="#4CC3C0"/><rect x="-3" y="-17" width="12" height="8" rx="2" fill="#4CC3C0"/><path d="M12 -20 h6 l4 8 v10 h-10z" fill="#FF8A65"/><circle cx="-12" cy="-1" r="5" fill="#241A2E"/><circle cx="12" cy="-1" r="5" fill="#241A2E"/></g></g>`}
function chemScore(c,o){let s=50;const H=[c.heart,o.heart].sort().join('+');
 if(H==='Hopeless romantic+Loyal')s+=22;if(H==='Fiery+Flirty'||(c.heart==='Flirty'&&o.temper==='Fiery')||(o.heart==='Flirty'&&c.temper==='Fiery'))s+=14;
 if(c.vibe===o.vibe)s+=10;if([c.vibe,o.vibe].includes('Wallflower')&&[c.vibe,o.vibe].includes('Life of the party'))s+=8;
 if(c.game==='Schemer'&&o.game==='Schemer')s-=12;if(c.heart==='Slow-burn'&&o.heart==='Flirty')s-=8;if(c.temper==='Calm'&&o.temper==='Fiery')s+=6;
 return Math.max(8,Math.min(98,s+Math.round(Math.random()*20-10)))}
function renderMeet(st){
 const c=CS2.cur,obsLeft=2-c.obs,qLeft=2-c.asked.length;
 const tr=(lab,key)=>`<div><b>${lab}</b>${c.known[key]?c[key]:'<span class="unknown">?</span>'}</div>`;
 st.innerHTML=`<div class="top"><svg viewBox="0 -6 120 222" width="84" height="150" role="img" aria-label="${c.name}"><g class="idle">${char(c,{})}</g></svg><div style="flex:1"><h4>${c.name}${c.rare?' <span style="font-size:12px;color:#B8860B">rare</span>':''}</h4><div class="scene">${c.spName} · ${c.job}</div>${c.ref?`<div class="tagx">${c.ref}</div>`:''}<div class="traits" style="margin-top:6px">${tr('Heart','heart')}${tr('Vibe','vibe')}${tr('Temper','temper')}${tr('Game','game')}<div><b>Wants</b>${c.known.goal?c.goal==='Prize'?'Prize money':c.goal:'<span class="unknown">?</span>'}</div>${c.chem?`<div><b>Chemistry</b>${c.chem.who}: ${c.chem.s}%</div>`:''}</div></div></div>
 ${c.hints.length?`<div class="notes">${c.hints.map(h=>`<p>${h}</p>`).join('')}</div>`:''}
 ${CS2.res?`<div class="result">${CS2.res}</div>${CS2.signed?`<div class="seg" style="margin-top:8px"><button class="sbtn" data-slot="Starting cast">Starting cast</button><button class="sbtn" data-slot="Bombshell bench">Bombshell bench</button><button class="sbtn" data-ref="1">Ask for a referral</button></div>`:''}<button class="pbtn" id="backStop">Back to the ${CS2.stop}</button>`:`
 <div class="lab">Observe <span class="cnt">${obsLeft} left</span></div><div class="opts">${OBS.map((o,i)=>`<button data-obs="${i}" ${obsLeft<=0||c.known[o.k]?'disabled':''}>${o.label}</button>`).join('')}</div>
 <div class="lab">Interview <span class="cnt">${qLeft} left</span></div><div class="opts">${QS.map((q,i)=>`<button data-q="${i}" ${qLeft<=0||c.asked.includes(i)?'disabled':''}>${q.q}</button>`).join('')}</div>
 <div class="lab">Chemistry read <span class="cnt">8 reels</span></div><div class="opts chemrow">${VILLA.map(v=>`<button data-chem="${v.id}" ${c.chem?'disabled':''}>${byId[v.id].name}</button>`).join('')}</div>
 <div class="lab">Pitch the show</div><div class="lab" style="font-weight:500;margin:2px 0 4px">Add a sweetener (optional)</div><div class="seg">${[['none','None'],['bonus','Signing bonus · 300 coins'],['date','Promise a date in week 1'],['entrance','Grand bombshell entrance']].map(([k,l])=>`<button data-sw="${k}" class="${CS2.sweet===k?'on':''}">${l}</button>`).join('')}</div>
 <div class="pitch">${GOALS.map(g=>`<button data-pitch="${g}">${g==='Prize'?'Prize money':g}</button>`).join('')}</div>
 <button class="pbtn" id="backStop" style="background:#fff;color:#241A2E;border:1px solid #E8CDB5">Walk away</button>`}`;
 st.querySelectorAll('[data-obs]').forEach(b=>b.addEventListener('click',()=>{const o=OBS[+b.dataset.obs];c.obs++;c.known[o.k]=true;c.hints.push(`<b>${o.label}:</b> ${o.res[c[o.k]]}`);renderCast()}));
 st.querySelectorAll('[data-q]').forEach(b=>b.addEventListener('click',()=>{const q=QS[+b.dataset.q];c.asked.push(+b.dataset.q);c.hints.push(`<b>“${q.q}”</b> “${pick(q.a[c[q.k]])}”`);renderCast()}));
 st.querySelectorAll('[data-chem]').forEach(b=>b.addEventListener('click',()=>{if(ST.reels<8){toast('Not enough reels. Walk a bit.');return}spend(8);syncReels();const o=byId[b.dataset.chem],sc=chemScore(c,o);c.chem={who:o.name,s:sc};byId[c.id]=c;c.hints.push(`<b>Chemistry read with ${o.name}: ${sc}%.</b> ${c.name}: “${say('flirt',c,{themId:o.id},true)}” ${o.name}: “${say(sc>60?'interest_react':'date_awkward',o,{themId:c.id},true)}”`);renderCast()}));
 st.querySelectorAll('[data-sw]').forEach(b=>b.addEventListener('click',()=>{CS2.sweet=b.dataset.sw;renderCast()}));
 st.querySelectorAll('[data-pitch]').forEach(b=>b.addEventListener('click',()=>{const g=b.dataset.pitch,match=g===c.goal,sw=CS2.sweet!=='none';let mood=null;
  if(match)mood=sw?'thrilled':'happy';else if(sw?Math.random()<.6:Math.random()<.3)mood='reluctant';
  c.known.goal=true;
  if(mood){CS2.signed=true;c.mood=mood;CS2.res=mood==='thrilled'?`${c.name} is thrilled. “When do I start?” Signed, high morale.`:mood==='happy'?`${c.name} signs on the spot. “You had me at ${g==='Prize'?'prize money':g.toLowerCase()}.”`:`${c.name} signs, but reluctantly. “I'm not really here for ${g==='Prize'?'the money':g.toLowerCase()}...” Lower morale to start.`}
  else{CS2.signed=false;c.gone=true;CS2.res=`${c.name} passes. “That's not really why I'd do it.” What they actually wanted: ${c.goal==='Prize'?'prize money':c.goal.toLowerCase()}.`}
  if(CS2.sweet==='bonus')ST.coins=(ST.coins||2480)-300;renderCast()}));
 st.querySelectorAll('[data-slot]').forEach(b=>b.addEventListener('click',()=>{if(c.slot)return;c.slot=b.dataset.slot;c.gone=true;CS2.roster.push({name:c.name,slot:c.slot,mood:c.mood});byId[c.id]=c;if(!CAST.includes(c))CAST.push(c);toast(`${c.name} added to the ${c.slot.toLowerCase()}`);renderCast()}));
 st.querySelectorAll('[data-ref]').forEach(b=>b.addEventListener('click',()=>{const kind=pick(['Friend of','Ex of','Cousin of','Old flame of']);CS2.pref=`${kind} ${c.name}`;b.disabled=true;toast(`${c.name} gave you a name. They'll be at a later stop.`)}));
 const back=document.getElementById('backStop');if(back)back.addEventListener('click',()=>{CS2.stage='stop';CS2.cur=null;renderCast()});
}
document.getElementById('regions').addEventListener('click',e=>{const b=e.target.closest('[data-reg]');if(!b||b.disabled)return;CS2.region=b.dataset.reg;CS2.stage='road';CS2.fork=null;CS2.toStop=1000;toast(`Van heading to ${CS2.region}`);renderCast()});
document.getElementById('walk500').addEventListener('click',()=>{if(CS2.stage!=='road')return;CS2.toStop-=500;ST.reels+=5;renderQueue();syncReels();if(CS2.toStop<=0){CS2.toStop=0;arriveStop()}else{toast('+5 reels from your walk');renderCast()}});
