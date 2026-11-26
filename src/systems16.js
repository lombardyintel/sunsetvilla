/* ===== systems16: written storylines. Hand-authored arcs that play out over a week, cast from whoever is in the villa ===== */
/* Each storyline: roles picked from the cast, then 4 beats a couple of days apart. Beats are animated scenes.
   Lines use {A} {B} {C} for role names. A beat's steps can be a function of the roles (for branching endings). */
const sIds=()=>VIDS().filter(i=>!(ST.dumped||[]).includes(i));

function roleFind(pref,ex){const p=sIds().filter(i=>!ex.includes(i));const f=p.filter(i=>pref(byId[i]));return (f.length?pick(f):pick(p))||null}
const sMut=(a,b)=>((AFF[a]||{})[b]||0)+((AFF[b]||{})[a]||0);
const STORIES=[
{id:'pact',title:'The Secret Pact',blurb:'Two islanders fake a romance to reach the final.',
 cast(){const A=roleFind(c=>['Strategic','Schemer'].includes(c.game),[]);const B=roleFind(c=>c.id!==COUPLES[A]&&['Strategic','Clueless','Genuine'].includes(c.game),[A]);const C=roleFind(c=>c.vibe==='Wallflower'||c.temper==='Sarcastic',[A,B]);return {A,B,C}},
 beats:[
 {gap:0,t:1,loc:'garden',title:'The pact',log:'{A} and {B} strike a secret deal in the garden.',fx:R=>{addAff(R.A,R.B,6);addAff(R.B,R.A,6)},steps:R=>[
  {t:'enter',who:'A',x:140,from:'left',expr:'smirk'},{t:'enter',who:'B',x:250,from:'right'},
  {t:'say',who:'A',text:'Okay. Hear me out before you say no.'},{t:'say',who:'B',text:'That’s never a good start.'},
  {t:'say',who:'A',text:'We fake it. You and me. Couples make the final, and nobody sees us coming.'},
  {t:'say',who:'B',text:'So a showmance. With you.',expr:'smug'},{t:'say',who:'A',text:'A business partnership. With hand-holding.'},
  {t:'say',who:'B',text:'Fine. But I’m not laughing at your jokes.'},{t:'hug',a:'A',b:'B'},{t:'text',text:'They shake on it. Behind the hedge, something rustles.'}]},
 {gap:2,t:0,loc:'kitchen',title:'The performance',log:'{A} and {B} are suddenly very loved-up at breakfast. {C} isn’t buying it.',fx:R=>{bump(R.C,R.A,'rival',4)},steps:R=>[
  {t:'place',who:'C',x:310,flip:true},{t:'enter',who:'A',x:120,from:'left',expr:'grin'},{t:'enter',who:'B',x:190,from:'left',expr:'grin'},
  {t:'say',who:'A',text:'Morning, gorgeous. I made you eggs. Heart-shaped. Ish.'},{t:'say',who:'B',text:'Babe. You shouldn’t have. Seriously. You should not have.'},
  {t:'say',who:'C',text:'Since when are you two a thing?'},{t:'say',who:'A',text:'Since we stopped fighting it.'},
  {t:'say',who:'C',text:'Mm. So, since about yesterday afternoon.',expr:'smug'},{t:'text',text:'{C} doesn’t buy a word of it.'}]},
 {gap:2,t:3,loc:'firepit',title:'Caught out',log:'{C} tells the fire pit the {A} and {B} couple is fake.',fx:R=>{bump(R.A,R.C,'rival',8);addBuzz(.5)},steps:R=>[
  {t:'place',who:'A',x:110},{t:'place',who:'B',x:170},{t:'place',who:'C',x:290,flip:true},
  {t:'say',who:'C',text:'I’m just going to say it. I heard you in the garden. The whole thing is fake.'},
  {t:'say',who:'B',text:'You heard half a conversation.'},{t:'say',who:'A',text:'Spying now? Is that your game?'},
  {t:'say',who:'C',text:'My game is not lying to everyone’s face.'},{t:'fight',a:'A',b:'C'},
  {t:'face',who:'B',dir:'left'},{t:'say',who:'B',text:'Can we talk? Just us. Now.',expr:'soft'}]},
 {gap:2,t:2,loc:'terrace',title:'Real or not',log:R=>sMut(R.A,R.B)>100?'{A} and {B} admit the fake couple stopped being fake.':'{B} ends the fake couple with {A}.',fx:R=>{const real=sMut(R.A,R.B)>100;addAff(R.A,R.B,real?10:-10);addAff(R.B,R.A,real?10:-12);addBuzz(.4)},steps:R=>{const real=sMut(R.A,R.B)>100;return [
  {t:'place',who:'A',x:130},{t:'place',who:'B',x:260,flip:true},
  ...(real?[{t:'say',who:'B',text:'Here’s the problem with our fake thing.'},{t:'say',who:'A',text:'Which is?'},{t:'say',who:'B',text:'I stopped faking it two days ago.',expr:'soft'},
   {t:'say',who:'A',text:'Yeah. Me too. I was going to tell you after the final. For tactical reasons.'},{t:'say',who:'B',text:'Shut up.'},{t:'kiss',a:'A',b:'B'}]
  :[{t:'say',who:'B',text:'I’m done pretending. With you, and with everyone.'},{t:'say',who:'A',text:'We had a deal.'},{t:'say',who:'B',text:'We had a lie. That’s different.'},{t:'leave',who:'B',to:'right'},{t:'text',text:'{A} is left alone on the terrace.'}])]}}]},
{id:'home',title:'Home Truths',blurb:'A letter from home makes an islander doubt their partner.',
 cast(){const A=roleFind(c=>COUPLES[c.id]&&['Loyal','Hopeless romantic'].includes(c.heart),[]);const P=COUPLES[A]||roleFind(()=>true,[A]);const F=roleFind(c=>c.vibe==='Mother hen'||c.game==='Genuine',[A,P]);return {A,B:P,C:F}},
 beats:[
 {gap:0,t:0,loc:'bedroom',title:'A letter from home',log:'{A} gets a letter from home. It’s about {B}.',fx:R=>{moodUp([R.A],-6)},steps:R=>[
  {t:'place',who:'A',x:150},{t:'enter',who:'C',x:250,from:'right'},{t:'text',text:'A letter from home. {A} reads it twice.'},
  {t:'say',who:'A',text:'My family thinks {B} is playing a game. They’ve watched every episode.',expr:'shock'},
  {t:'say',who:'A',text:'Every. Episode.'},{t:'say',who:'C',text:'Families always think that. Mine thinks the gecko’s playing a game.'},
  {t:'say',who:'A',text:'What if they’re right, though?',expr:'soft'}]},
 {gap:2,t:1,loc:'pool',title:'Distance',log:'{A} pulls away from {B} at the pool.',fx:R=>{addAff(R.A,R.B,-6);addAff(R.B,R.A,-3)},steps:R=>[
  {t:'place',who:'A',x:120},{t:'enter',who:'B',x:220,from:'right',expr:'smile'},
  {t:'say',who:'B',text:'You’ve been weird since yesterday. Did I do something?'},{t:'say',who:'A',text:'No. Maybe. I don’t know.'},
  {t:'say',who:'B',text:'That’s three answers.'},{t:'say',who:'A',text:'Do you actually like me? Or do you like being in a couple?'},
  {t:'shock',ids:['B']},{t:'say',who:'B',text:'Where is this coming from?'}]},
 {gap:2,t:2,loc:'garden',title:'The truth',log:'{C} tells {B} about the letter from home.',fx:R=>{addAff(R.B,R.A,4)},steps:R=>[
  {t:'place',who:'C',x:140},{t:'enter',who:'B',x:240,from:'right',expr:'soft'},
  {t:'say',who:'B',text:'You know what’s going on with {A}. Please.'},{t:'say',who:'C',text:'It’s the letter. Their family thinks you’re fake.'},
  {t:'say',who:'B',text:'Then I’ll prove it. Not to the family. To {A}.'},{t:'say',who:'C',text:'Lanterns. Always lanterns.'}]},
 {gap:2,t:3,loc:'terrace',title:'The gesture',log:R=>sMut(R.A,R.B)>95?'{B} makes a grand gesture on the terrace. {A} melts.':'{B}’s grand gesture comes too late for {A}.',fx:R=>{const ok=sMut(R.A,R.B)>95;addAff(R.A,R.B,ok?12:-6);addBuzz(.5)},steps:R=>{const ok=sMut(R.A,R.B)>95;return [
  {t:'place',who:'B',x:230,flip:true},{t:'enter',who:'A',x:140,from:'left',expr:'shock'},
  {t:'say',who:'B',text:'I wrote your family a letter back. Don’t worry, it’s mostly about your laugh.'},{t:'say',who:'A',text:'You did not.'},
  {t:'say',who:'B',text:'Page two is about your dancing. It’s less nice.'},
  ...(ok?[{t:'say',who:'A',text:'You’re an idiot. I really like you.',expr:'grin'},{t:'kiss',a:'A',b:'B'}]:[{t:'say',who:'A',text:'It’s sweet. I just needed this three days ago.',expr:'soft'},{t:'leave',who:'A',to:'left'},{t:'text',text:'{B} blows out the lanterns one by one.'}])]}}]},
{id:'diary',title:'The Diary',blurb:'Someone finds a diary that ranks every islander.',
 cast(){const A=roleFind(c=>c.vibe==='Wallflower'||c.temper==='Sensitive',[]);const C=roleFind(c=>c.game==='Schemer'||c.temper==='Sarcastic',[A]);const B=roleFind(c=>c.id!==COUPLES[A],[A,C]);return {A,B,C}},
 beats:[
 {gap:0,t:1,loc:'daybeds',title:'Finders keepers',log:'{C} finds {A}’s diary on the daybeds.',fx:()=>addBuzz(.2),steps:R=>[
  {t:'enter',who:'C',x:190,from:'left',expr:'smirk'},{t:'say',who:'C',text:'Whose notebook is this? “Honest rankings.” Oh, this is going to be good.'},
  {t:'say',who:'C',text:'“Number one: {B}. Obviously.”'},{t:'say',who:'C',text:'“Last place: {C}, who talks like a podcast.”'},{t:'expr',who:'C',expr:'shock'},{t:'say',who:'C',text:'...Rude.'}]},
 {gap:2,t:0,loc:'kitchen',title:'Hints',log:'{C} drops hints about the diary at breakfast.',fx:R=>{moodUp([R.A],-6)},steps:R=>[
  {t:'place',who:'A',x:110},{t:'place',who:'B',x:180},{t:'enter',who:'C',x:290,from:'right',expr:'smug'},
  {t:'say',who:'C',text:'Morning, everyone. Some of us are ranked. Some of us are “obviously”.'},{t:'say',who:'B',text:'What’s that supposed to mean?'},
  {t:'expr',who:'A',expr:'shock'},{t:'text',text:'{A} goes very, very quiet.'}]},
 {gap:2,t:3,loc:'firepit',title:'Read aloud',log:'{C} reads {A}’s diary out at the fire pit. {B} shuts it down.',fx:R=>{addAff(R.B,R.A,8);bump(R.B,R.C,'rival',8);addBuzz(.5)},steps:R=>[
  {t:'place',who:'A',x:90},{t:'place',who:'B',x:160},{t:'place',who:'C',x:290,flip:true,expr:'smirk'},
  {t:'say',who:'A',text:'Give it back.'},{t:'say',who:'C',text:'“{B} has the kind of smile you’d cross a road for.” Cute.'},
  {t:'say',who:'B',text:'{C}, put it down. Now.'},{t:'fight',a:'B',b:'C'},{t:'move',who:'B',x:230},{t:'text',text:'{B} takes the diary and hands it back to {A}.'}]},
 {gap:2,t:2,loc:'terrace',title:'Number one',log:R=>sMut(R.A,R.B)>92?'{A} and {B} share a moment on the terrace.':'{B} lets {A} down gently.',fx:R=>{addAff(R.A,R.B,sMut(R.A,R.B)>92?10:2);addAff(R.B,R.A,sMut(R.A,R.B)>92?10:4)},steps:R=>{const ok=sMut(R.A,R.B)>92;return [
  {t:'place',who:'A',x:140},{t:'enter',who:'B',x:240,from:'right'},
  {t:'say',who:'B',text:'So. Number one, huh.'},{t:'say',who:'A',text:'I’m going to walk into the sea.',expr:'shock'},
  {t:'say',who:'B',text:'Before you do. You’re on my list too.'},{t:'say',who:'A',text:'You have a list?'},
  ...(ok?[{t:'say',who:'B',text:'I do now. It’s very short.',expr:'soft'},{t:'kiss',a:'A',b:'B'}]:[{t:'say',who:'B',text:'You’re my number one... friend.'},{t:'say',who:'A',text:'Ouch. Accurate, though.',expr:'grin'},{t:'hug',a:'A',b:'B'}])]}}]},
{id:'exes',title:'Second Chance',blurb:'Two islanders dated before the villa. Nobody knew.',
 cast(){const cs=couplesList();let A=null,B=null;if(cs.length>=2){const [x,y]=shuffle(cs).slice(0,2);A=x[0];B=y[0]}A=A||roleFind(()=>true,[]);B=B||roleFind(()=>true,[A]);const C=COUPLES[A]||roleFind(()=>true,[A,B]);return {A,B,C}},
 beats:[
 {gap:0,t:0,loc:'kitchen',title:'Three sugars',log:'{B} knows exactly how {A} takes their coffee. {C} notices.',fx:R=>{addAff(R.C,R.A,-3)},steps:R=>[
  {t:'place',who:'A',x:120},{t:'place',who:'C',x:180},{t:'enter',who:'B',x:290,from:'right'},
  {t:'say',who:'B',text:'Still three sugars?'},{t:'shock',ids:['A']},{t:'say',who:'C',text:'Still? How do you know how they take their coffee?'},
  {t:'say',who:'A',text:'Lucky guess.'},{t:'say',who:'B',text:'...Lucky guess.'},{t:'text',text:'Nobody believes it was a lucky guess.'}]},
 {gap:2,t:1,loc:'garden',title:'We agreed',log:'{A} and {B} argue in private about their past.',fx:R=>{addAff(R.A,R.B,6);addAff(R.B,R.A,7)},steps:R=>[
  {t:'enter',who:'A',x:140,from:'left'},{t:'enter',who:'B',x:240,from:'right'},
  {t:'say',who:'A',text:'We agreed. We don’t know each other.'},{t:'say',who:'B',text:'You agreed. I just nodded.'},
  {t:'say',who:'A',text:'It was two years ago.'},{t:'say',who:'B',text:'Two years, and you still finish my sentences.',expr:'soft'}]},
 {gap:2,t:3,loc:'firepit',title:'Yes or no',log:'{C} confronts {A}: were they with {B} before?',fx:R=>{addAff(R.C,R.A,-12);bump(R.C,R.B,'rival',6);addBuzz(.6)},steps:R=>[
  {t:'place',who:'A',x:120},{t:'place',who:'B',x:300,flip:true},{t:'enter',who:'C',x:190,from:'right'},
  {t:'say',who:'C',text:'Were you two together? Yes or no.'},{t:'say',who:'A',text:'...Yes. Before. It ended.',expr:'soft'},
  {t:'say',who:'C',text:'And you let me find out over coffee.'},{t:'fight',a:'C',b:'A'}]},
 {gap:2,t:2,loc:'hideaway',title:'Unfinished',log:R=>(AFF[R.A]||{})[R.B]>(AFF[R.A]||{})[R.C]?'{A} and {B} pick up where they left off.':'{A} chooses to leave the past in the past.',fx:R=>{const back=(AFF[R.A]||{})[R.B]>(AFF[R.A]||{})[R.C];addAff(R.A,R.B,back?10:-8);addAff(R.B,R.A,back?10:-8);if(!back)addAff(R.C,R.A,6)},steps:R=>{const back=(AFF[R.A]||{})[R.B]>(AFF[R.A]||{})[R.C];return [
  {t:'place',who:'A',x:140},{t:'enter',who:'B',x:240,from:'right'},{t:'say',who:'B',text:'Tell me it’s over and I’ll never bring it up again.'},
  ...(back?[{t:'say',who:'A',text:'I can’t tell you that.',expr:'soft'},{t:'kiss',a:'A',b:'B'},{t:'text',text:'Some things don’t stay in the past.'}]:[{t:'say',who:'A',text:'It’s over. Some things are better as a memory.'},{t:'leave',who:'B',to:'right'},{t:'text',text:'{B} doesn’t look back.'}])]}}]},
{id:'bet',title:'The Bet',blurb:'Two islanders bet on who kisses the same person first.',
 cast(){const A=roleFind(c=>c.heart==='Flirty'||c.vibe==='Life of the party',[]);const B=roleFind(c=>c.heart==='Flirty'||c.game==='Strategic',[A]);const C=roleFind(()=>true,[A,B]);return {A,B,C}},
 beats:[
 {gap:0,t:0,loc:'gym',title:'Washing up for a week',log:'{A} and {B} make a bet about {C}.',fx:()=>addBuzz(.2),steps:R=>[
  {t:'place',who:'A',x:130,expr:'smirk'},{t:'place',who:'B',x:230,flip:true,expr:'smirk'},
  {t:'say',who:'A',text:'Bet I get a kiss off {C} before you do.'},{t:'say',who:'B',text:'Loser does everyone’s washing up for a week.'},
  {t:'say',who:'A',text:'Deal.'},{t:'hug',a:'A',b:'B'},{t:'text',text:'Neither of them sees the camera in the corner.'}]},
 {gap:2,t:1,loc:'pool',title:'Charm offensive',log:'{A} and {B} both try their luck with {C} at once.',fx:R=>{addAff(R.C,R.A,2);addAff(R.C,R.B,2)},steps:R=>[
  {t:'place',who:'C',x:195},{t:'enter',who:'A',x:110,from:'left',expr:'grin'},{t:'enter',who:'B',x:285,from:'right',expr:'grin'},
  {t:'say',who:'A',text:'{C}, has anyone told you you look like a sunset?'},{t:'say',who:'B',text:'{C}, has anyone told you {A} says that to everyone?'},
  {t:'say',who:'C',text:'Is this a competition?',expr:'smirk'},{t:'say',who:'A',text:'No.'},{t:'say',who:'B',text:'Absolutely not.'}]},
 {gap:2,t:2,loc:'garden',title:'The tip-off',log:'{C} finds out about the bet.',fx:R=>{addAff(R.C,R.A,-6);addAff(R.C,R.B,-6)},steps:R=>{const F=sIds().find(i=>![R.A,R.B,R.C].includes(i));const s=[{t:'place',who:'C',x:140}];if(F){SCX.extra=F;s.push({t:'enter',who:F,x:240,from:'right'},{t:'say',who:F,text:`There’s a bet. On you. Loser does the washing up for a week.`})}else s.push({t:'text',text:'A note on the daybed spells it out: there’s a bet on {C}.'});s.push({t:'say',who:'C',text:'Oh, they want to play? Then let’s play.',expr:'smug'});return s}},
 {gap:2,t:3,loc:'firepit',title:'Called out',log:'{C} calls out {A} and {B} in front of the whole villa.',fx:R=>{addAff(R.C,R.A,-8);addAff(R.C,R.B,-8);moodUp([R.A,R.B],-8);addBuzz(.6)},steps:R=>[
  {t:'place',who:'A',x:100},{t:'place',who:'B',x:160},{t:'enter',who:'C',x:280,from:'right',expr:'smirk'},
  {t:'say',who:'C',text:'Fun fact. {A} and {B} have a bet on who kisses me first.'},{t:'shock',ids:['A','B']},
  {t:'say',who:'A',text:'In our defence...'},{t:'say',who:'B',text:'There is no defence.'},
  {t:'say',who:'C',text:'I picked. Neither of you. Enjoy the washing up.'},{t:'text',text:'The villa cheers. The washing up begins.'}]}]},
{id:'breaking',title:'Breaking Point',blurb:'The one who looks after everyone finally cracks.',
 cast(){const A=roleFind(c=>c.vibe==='Mother hen'||c.game==='Genuine',[]);const F=roleFind(c=>c.id===COUPLES[A]||c.heart==='Loyal',[A]);const B=roleFind(()=>true,[A,F]);return {A,B,C:F}},
 beats:[
 {gap:0,t:0,loc:'kitchen',title:'Forty slices',log:'{A} makes breakfast for the whole villa. Again.',fx:R=>{moodUp([R.A],-5)},steps:R=>[
  {t:'place',who:'A',x:150},{t:'enter',who:'B',x:260,from:'right'},{t:'say',who:'B',text:'Is there more toast?'},{t:'say',who:'A',text:'Coming.'},
  {t:'say',who:'B',text:'Can you do mine less burnt?'},{t:'say',who:'A',text:'Coming.'},{t:'text',text:'{A} has made forty slices of toast today.'}]},
 {gap:2,t:3,loc:'bedroom',title:'Lights out',log:'{A} can’t sleep. {C} notices.',fx:R=>{addAff(R.A,R.C,5)},steps:R=>[
  {t:'place',who:'A',x:140,expr:'soft'},{t:'place',who:'C',x:230,flip:true},
  {t:'say',who:'A',text:'Does anyone ever ask how I’m doing? Like, ever?'},{t:'say',who:'C',text:'I’m asking now. How are you doing?'},
  {t:'say',who:'A',text:'Tired. Really tired.'}]},
 {gap:2,t:1,loc:'gym',title:'The crack',log:'{A} breaks down in the gym. {C} is there.',fx:R=>{addAff(R.C,R.A,6);addBuzz(.4)},steps:R=>[
  {t:'place',who:'A',x:150,expr:'soft'},{t:'enter',who:'C',x:240,from:'right'},
  {t:'say',who:'A',text:'I’m not everyone’s mum. I came here to be someone’s person.'},{t:'say',who:'C',text:'Hey. Hey. Sit down.'},
  {t:'hug',a:'A',b:'C'},{t:'text',text:'{A} cries for the first time in the villa.'}]},
 {gap:2,t:2,loc:'firepit',title:'Dinner is served',log:'The villa makes {A} dinner. It’s terrible. It’s perfect.',fx:R=>{moodUp(sIds(),6);sIds().forEach(i=>{if(i!==R.A)addAff(i,R.A,3)})},steps:R=>[
  {t:'place',who:'A',x:120,expr:'shock'},{t:'enter',who:'B',x:220,from:'right',expr:'grin'},{t:'enter',who:'C',x:290,from:'right',expr:'grin'},
  {t:'say',who:'B',text:'We made you dinner. It’s terrible.'},{t:'say',who:'C',text:'I burnt the toast on purpose. Solidarity.'},
  {t:'say',who:'A',text:'You lot are ridiculous.',expr:'grin'},{t:'confetti'}]}]}
];
/* three storylines a season, starting on days 3, 9 and 15 */
const STORY_START=[3,9,15];
function storyInit(){if(ST.story&&ST.story.season===ST.season)return;const pk=shuffle(STORIES.map(s=>s.id)).slice(0,3);ST.story={season:ST.season,list:pk.map((id,i)=>({id,start:STORY_START[i],beat:0,roles:null,cut:false}))}}
const beatDay=(s,i)=>{const S=STORIES.find(x=>x.id===s.id);let d=s.start;for(let j=1;j<=i;j++)d+=S.beats[j].gap;return d};
function storyDue(){storyInit();const out=[];ST.story.list.forEach(s=>{const S=STORIES.find(x=>x.id===s.id);if(!S||s.cut||s.beat>=S.beats.length)return;const d=beatDay(s,s.beat),b=S.beats[s.beat];if(VS.day>d||(VS.day===d&&VS.t>=b.t))out.push(s)});return out}
const fillR=(t,R)=>String(t).replace(/\{([ABC])\}/g,(m,k)=>R[k]&&byId[R[k]]?byId[R[k]].name:'someone');
function playBeat(s){const S=STORIES.find(x=>x.id===s.id);if(!S)return;
 if(!s.roles){const r=S.cast();if(!r.A||!r.B||!r.C){s.cut=true;return}s.roles=r}const R=s.roles;
 const gone=Object.values(R).find(i=>!sIds().includes(i));if(gone){s.cut=true;toast(`${S.title} is cut short: ${nm(gone)} left the villa.`);storyChip();return}
 const b=S.beats[s.beat];const raw=typeof b.steps==='function'?b.steps(R):b.steps;
 const steps=raw.map(x=>{const y=Object.assign({},x);['who','a','b'].forEach(k=>{if(y[k]&&R[y[k]])y[k]=R[y[k]]});if(y.ids)y.ids=y.ids.map(k=>R[k]||k);if(y.text)y.text=fillR(y.text,R);if(typeof y.x==='number')y.x=Math.max(100,Math.min(290,y.x));return y});
 const cast=[...new Set(steps.map(x=>x.who).filter(Boolean))];
 const said=steps.filter(x=>x.t==='say').map(x=>[x.who,x.text]);
 s.beat++;storyChip();
 const finish=()=>{startFx();try{b.fx&&b.fx(R)}catch(e){}const f=endFx();const lg=fillR(typeof b.log==='function'?b.log(R):b.log,R);
  logIt(b.loc,`${S.title}: ${lg}`,true,{ids:cast.slice(0,3),lines:said.slice(0,4),kind:'story',title:`${S.title} · ${b.title}`});addBuzz(.2);xp(12,'Storyline');syncLove();
  if(s.beat>=S.beats.length){setTimeout(()=>toast(`Storyline complete: ${S.title}. It’s the big moment in tonight’s episode.`),900)}else toast(`${S.title}: part ${s.beat} of ${S.beats.length} filmed. Next part in ${S.beats[s.beat].gap} days.`);drawVilla()};
 const sc={loc:b.loc,tag:`Storyline · ${S.title} · ${s.beat}/${S.beats.length}`,steps:[{t:'title',text:b.title,sub:S.title,ms:1500},...steps],done:finish};
 if(CAR.scenesOff||window.__noScenes){finish();return}
 if(typeof closeLoc==='function'&&VS.open)closeLoc();closeSheet();playCut(sc)}
function storyChip(){const due=storyDue();let el=document.getElementById('stychip');if(!due.length||(CAR.onb&&CAR.onb.on&&VS.day<3)){if(el)el.remove();return}
 const s=due[0],S=STORIES.find(x=>x.id===s.id),b=S.beats[s.beat];
 if(!el){el=document.createElement('button');el.id='stychip';el.className='ivreq chchip';document.getElementById('villa').appendChild(el);el.addEventListener('click',()=>{const d=storyDue();if(d.length)playBeat(d[0])});if(typeof NOTEIDS!=='undefined'&&!NOTEIDS.includes('stychip'))NOTEIDS.push('stychip');if(typeof tidyNotes==='function')tidyNotes()}
 el.innerHTML=`<b>📖 ${S.title}</b><span>Part ${s.beat+1} of ${S.beats.length} · ${LOC[b.loc]?LOC[b.loc].name:b.loc} · tap to watch</span>`}
setInterval(storyChip,3000);setTimeout(storyChip,1500);
/* episode: storyline beats air as starred moments; show status lists them */
const _ss16=showStatus;showStatus=function(){_ss16();storyInit();const lab=[...sheet.querySelectorAll('.lab')].find(l=>/Storylines/.test(l.textContent));if(!lab)return;
 lab.insertAdjacentHTML('afterend',ST.story.list.map(s=>{const S=STORIES.find(x=>x.id===s.id);if(!S)return '';const R=s.roles;const who=R?[R.A,R.B].map(nm).join(' and '):'';const st=s.cut?'Cut short':s.beat>=S.beats.length?'Finished':s.beat?`Part ${s.beat} of ${S.beats.length} done · next on day ${beatDay(s,s.beat)}`:`Starts day ${s.start}`;
  return `<div class="arc"><div><b>📖 ${S.title}${who?': '+who:''}</b><span>${st}</span></div><i><b style="width:${Math.round(s.beat/S.beats.length*100)}%"></b></i></div>`}).join(''))};
window.__test=Object.assign(window.__test||{},{story:()=>ST.story,storyDue,playBeat,STORIES});
