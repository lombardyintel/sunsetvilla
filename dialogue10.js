/* Sunset Villa dialogue library, batch 10: cutscene reactions and All-Stars. */
(function(){
const B={
sc_bomb_react:[
"*|Oh, this is a problem. This is a big problem.",
"*|Nobody look directly at {them}. It's like the sun.",
"*|I'm in a couple. I'm in a couple. I'm in a couple.",
"*|Well, that's my afternoon ruined.",
"*|Who approved this? I want a word with the producers.",
"*|Act natural. Why is everyone sucking their stomach in?",
"*|I give it four hours before someone's head is turned.",
"*|I'm not threatened. I'm just going to go and do my hair.",
"*|Did {them} just wink at me, or is that the sun?",
"*|Here we go. Pack your bags, everyone.",
"*|I knew it was too quiet this morning.",
"*|That walk was in slow motion. How was that in slow motion?",
"*|My partner is staring. My partner is definitely staring.",
"*|Okay, I'm officially worried.",
"*|Somebody hold my drink. Actually, hold me.",
"*|New person, new drama. I love it here.",
"*|Right. Recoupling just got interesting.",
"*|I'm not saying I'm jealous. I'm saying I'm alert.",
"*|Stay calm. Stay hydrated. Stay in your couple.",
"*|They did not have to come in looking like that."
],
sc_exit_line:[
"*|Right. Well. It's been a summer.",
"*|Don't cry. If you cry, I'll cry, and my eyeliner can't take it.",
"*|I came for love and I'm leaving with a tan. That's half a win.",
"*|Look after each other. And look after {them}.",
"*|No regrets. Okay, one regret. Several. Fine.",
"*|Tell the gecko I said goodbye.",
"*|I'll be watching. Every episode. Behave.",
"*|You haven't seen the last of me. I mean that as a threat and a promise.",
"*|This villa changed me. Mostly my sleep schedule.",
"*|Make it to the final for me, yeah?",
"*|I'm not sad. My face is just doing a thing.",
"*|I'd do it all again. Maybe with less shouting.",
"*|Someone finish my toast. It's on the side.",
"*|Thank you for the best weeks of my life. And the worst.",
"*|Go get your person. Don't waste a day."
],
sc_exit_react:[
"*|It won't be the same without you.",
"*|Who's going to make the bad jokes now?",
"*|You were the best thing about this villa.",
"*|I'm going to miss you so much. Text me the second you're out.",
"*|This is so unfair. The wrong person is leaving.",
"*|Go home and be brilliant.",
"*|We'll visit. We'll all visit. Group holiday.",
"*|You owe me a rematch in the pool.",
"*|Don't look back, or I'll lose it.",
"*|Honestly, the villa just got a lot quieter.",
"*|You're going to be fine. Better than fine.",
"*|I've got your back on the outside. Always."
],
allstar_back:[
"*|Same villa, same sun, same bad decisions. I've missed it.",
"*|I came back for one reason. Unfinished business.",
"*|Last time I played it safe. Not this time.",
"*|They said the second time is easier. They lied.",
"*|I know where the good daybed is. Advantage, me.",
"*|I've watched my own season back. I have notes.",
"*|Everyone's older, wiser, and still terrible at Mr and Mrs.",
"*|I'm not here to make friends. I already made them. Last time.",
"*|The fans voted me back in. I take that very seriously.",
"*|Coming back as an All-Star is like going back to school as a teacher.",
"*|I said I'd never come back. Then the network called.",
"*|This time I'm leaving with a person, not a tan line.",
"*|Some people peak once. I'm peaking twice.",
"*|Look at us. A villa full of legends and one very confused gecko.",
"*|I learned my lesson. Mostly. Partly. A bit."
],
allstar_history:[
"*|Remember my first season? Don't answer that.",
"*|I've been dumped from this exact fire pit before. Not again.",
"*|{them} and I go back. Different seasons, same drama.",
"*|Last time someone stole my partner at a recoupling. I've been practising my face.",
"*|I watched {them}'s season. I have questions.",
"*|My old couple still sends me memes. That's growth.",
"*|The edit was not kind to me last time. Let's fix that.",
"*|I was the villain last time. This time, I'm the plot twist.",
"*|Everybody here has a highlight reel. Mine has a blooper reel.",
"*|I've cried in every room of this villa. Except the gym. Give it time.",
"*|First time round, I was too nice. Hmm.",
"*|You know you're an All-Star when the bombshell asks you for advice.",
"*|I still have the egg baby from my season. It's in a drawer.",
"*|Back then I didn't know where the cameras were. Now I wave.",
"*|{them} was a fan favourite. I was a fan… acquaintance."
]
};
const W=window.SV_DIALOGUE=window.SV_DIALOGUE||{};
Object.keys(B).forEach(k=>{W[k]=(W[k]||[]).concat(B[k])});
})();
