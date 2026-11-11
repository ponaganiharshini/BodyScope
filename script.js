const $=id=>document.getElementById(id);
let prog={org:{},sim:0,lab:0,qz:0};try{prog=Object.assign(prog,JSON.parse(localStorage.getItem("bodyscope")||"{}"))}catch(e){}
function save(){setTimeout(()=>{try{badges()}catch(e){}},0);try{localStorage.setItem("bodyscope",JSON.stringify(prog))}catch(e){}
 const n=Object.keys(prog.org).filter(k=>k!="Body").length,s=n/6*25+prog.sim*15+prog.lab/5*25+prog.qz/6*35;$("pb").style.width=s+"%";$("pt").textContent=Math.round(s)+"% · organs "+n+"/6 · simulator "+(prog.sim?"done":"todo")+" · labels "+prog.lab+"/5 · quiz "+prog.qz+"/6"}
const INFO={
Heart:{i:"The heart is a muscular pump about the size of your fist. It beats around 100,000 times a day to send blood around your body.",d:"The right side receives oxygen-poor blood and sends it to the lungs. The left side receives oxygen-rich blood from the lungs and pumps it to the whole body through the aorta. Four valves keep blood flowing one way.",
 p:{"Right atrium":"Receives oxygen-poor blood returning from the body.","Right ventricle":"Pumps oxygen-poor blood to the lungs.","Left atrium":"Receives oxygen-rich blood from the lungs.","Left ventricle":"The strongest chamber. It pumps oxygen-rich blood to the whole body.","Aorta":"The largest artery. It carries oxygen-rich blood away from the heart."}},
Lungs:{i:"The lungs bring oxygen into the blood and remove carbon dioxide. You breathe about 12 to 20 times a minute at rest.",d:"Air travels down the trachea and bronchi into millions of tiny air sacs called alveoli. Oxygen passes through their thin walls into the blood, and carbon dioxide passes out to be exhaled. The diaphragm muscle drives breathing.",
 p:{"Trachea":"The windpipe. It carries air from the throat toward the lungs.","Bronchi":"Two tubes that split from the trachea and branch inside each lung.","Right lung":"Has three lobes. It does most of the gas exchange.","Left lung":"Has two lobes, leaving space for the heart."}},
Kidney:{i:"The kidneys filter your blood, remove waste and extra water, and make urine. We have two, and they sit on either side of the spine.",d:"Each kidney holds about a million filters called nephrons. They clean about 180 litres of blood a day and keep salt, water and minerals balanced. Kidneys also help control blood pressure.",
 p:{"Cortex":"The outer layer, where blood is filtered.","Renal pelvis":"Collects urine and passes it to the ureter.","Renal artery":"Brings blood to the kidney to be cleaned.","Renal vein":"Carries cleaned blood away from the kidney.","Ureter":"A tube that carries urine from the kidney to the bladder."}}};
Object.assign(INFO,{
Brain:{i:"The brain controls your thoughts, memory, movement and everything your body does. It weighs about 1.4 kg.",d:"The cerebrum handles thinking, speech and senses. The cerebellum keeps balance and smooth movement. The brain stem controls breathing and heartbeat automatically. Billions of nerve cells pass signals to each other.",p:{"Cerebrum":"The largest part. It handles thinking, memory, speech and senses.","Cerebellum":"Controls balance and coordination of movement.","Brain stem":"Connects the brain to the spinal cord and controls breathing and heartbeat."}},
Stomach:{i:"The stomach is a muscular bag that mixes food with acid and enzymes to start digestion.",d:"Food enters from the esophagus and is churned for a few hours into a thick liquid. It then moves slowly into the duodenum, the first part of the small intestine. Stomach acid also kills many germs.",p:{"Esophagus":"The food pipe that carries food from the mouth to the stomach.","Stomach body":"Churns food with acid and enzymes.","Duodenum":"The first part of the small intestine, where digestion continues."}},
Liver:{i:"The liver is the largest organ inside the body. It cleans blood, makes bile and stores energy.",d:"It breaks down toxins and medicines, makes proteins that help blood clot, stores sugar as glycogen, and makes bile that helps digest fats. It can regrow after small injuries.",p:{"Right lobe":"The larger lobe. It does most of the cleaning and processing work.","Left lobe":"The smaller lobe with a similar job.","Gallbladder":"Stores bile from the liver and releases it to digest fats."}},
Body:{i:"This is the whole body view. Tap an organ to zoom in and study it.",d:"",p:{"Brain":"Tap to zoom in","Heart":"Tap to zoom in","Lungs":"Tap to zoom in","Liver":"Tap to zoom in","Stomach":"Tap to zoom in","Kidney":"Tap to zoom in"}}});
// 3D
const cv=$("cv"),sc=new THREE.Scene(),cam=new THREE.PerspectiveCamera(45,1,.1,100),rd=new THREE.WebGLRenderer({antialias:true,alpha:true});
cv.prepend(rd.domElement);cam.position.set(0,0,6);sc.add(new THREE.AmbientLight(0xffffff,.7));const dl=new THREE.DirectionalLight(0xffffff,.9);dl.position.set(3,4,5);sc.add(dl);
const grp=new THREE.Group();sc.add(grp);let parts={},org="Heart",hr=70;
const S=new THREE.SphereGeometry(1,24,24),cyl=(r,l)=>new THREE.CylinderGeometry(r,r,l,16);
function P(n,g,c,pos,sc_,rot){const m=new THREE.Mesh(g,new THREE.MeshPhongMaterial({color:c,shininess:60}));m.position.set(...pos);if(sc_)m.scale.set(...sc_);if(rot)m.rotation.set(...rot);m.userData.n=n;grp.add(m);(parts[n]=parts[n]||[]).push(m)}
function make(o){org=o;parts={};while(grp.children.length)grp.remove(grp.children[0]);grp.rotation.set(0,0,0);
 if(o=="Heart"){P("Right atrium",S,0x6aa8ff,[-.75,.55,0],[.55,.5,.5]);P("Left atrium",S,0xe57373,[.7,.6,-.2],[.5,.45,.45]);P("Right ventricle",S,0x3b6fd4,[-.45,-.35,.15],[.75,1,.7]);P("Left ventricle",S,0xc62839,[.4,-.4,0],[.85,1.15,.8]);P("Aorta",new THREE.TorusGeometry(.5,.14,12,24,Math.PI),0x8e1b1b,[.15,1.1,-.1])}
 if(o=="Lungs"){P("Trachea",cyl(.12,1.5),0xbfd7ea,[0,1.1,0]);P("Bronchi",cyl(.09,1),0xbfd7ea,[-.45,.5,0],0,[0,0,.9]);P("Bronchi",cyl(.09,1),0xbfd7ea,[.45,.5,0],0,[0,0,-.9]);P("Right lung",S,0xf4a3b5,[-1,-.1,0],[.85,1.4,.6]);P("Left lung",S,0xf08ba2,[1,-.1,0],[.75,1.4,.6])}
 if(o=="Kidney"){P("Cortex",S,0xa5463c,[0,0,0],[.85,1.3,.6]);P("Renal pelvis",S,0xf0c27b,[-.85,-.1,0],[.35,.4,.35]);P("Renal artery",cyl(.1,1),0xc62839,[-1.3,.3,0],0,[0,0,1.57]);P("Renal vein",cyl(.1,1),0x3b6fd4,[-1.3,-.3,0],0,[0,0,1.57]);P("Ureter",cyl(.08,1.4),0xf0c27b,[-.9,-1.4,0])}
 if(o=="Brain"){P("Cerebrum",S,0xf2a7b8,[-.5,.2,0],[.9,.75,.85]);P("Cerebrum",S,0xf2a7b8,[.5,.2,0],[.9,.75,.85]);P("Cerebellum",S,0xd9778c,[0,-.7,-.55],[.6,.35,.4]);P("Brain stem",cyl(.18,1),0xe8c4a0,[0,-1.05,-.15])}
 if(o=="Stomach"){P("Esophagus",cyl(.14,1.2),0xe8b4a0,[-.5,1.3,0],0,[0,0,.2]);P("Stomach body",S,0xe8896b,[0,0,0],[.9,1.1,.65],[0,0,.4]);P("Duodenum",cyl(.17,1.3),0xf0c27b,[.95,-.7,0],0,[0,0,1.2])}
 if(o=="Liver"){P("Right lobe",S,0x8b3a2f,[-.35,0,0],[1.3,.75,.7]);P("Left lobe",S,0x9c4538,[1,-.1,0],[.85,.5,.6]);P("Gallbladder",S,0x4caf50,[-.3,-.75,.35],[.22,.32,.22])}
 if(o=="Body"){const G=0x9fb4d8;P("Body",S,G,[0,1.95,0],[.45,.5,.45]);P("Body",cyl(.7,2.1),G,[0,.55,0]);P("Body",cyl(.22,1.9),G,[-.3,-1.4,0]);P("Body",cyl(.22,1.9),G,[.3,-1.4,0]);P("Body",cyl(.15,1.7),G,[-1,.5,0]);P("Body",cyl(.15,1.7),G,[1,.5,0]);
  P("Brain",S,0xf2a7b8,[0,1.95,0],[.3,.25,.3]);P("Lungs",S,0xf4a3b5,[-.3,.85,0],[.22,.4,.2]);P("Lungs",S,0xf4a3b5,[.3,.85,0],[.2,.4,.2]);P("Heart",S,0xc62839,[.08,.7,.2],[.17,.2,.15]);P("Liver",S,0x8b3a2f,[-.25,.25,.15],[.3,.15,.15]);P("Stomach",S,0xe8896b,[.25,.2,.15],[.17,.2,.14]);P("Kidney",S,0xa5463c,[-.32,-.2,-.2],[.1,.16,.08]);P("Kidney",S,0xa5463c,[.32,-.2,-.2],[.1,.16,.08]);
  parts.Body.forEach(m=>{m.material.transparent=true;m.material.opacity=.2;m.material.depthWrite=false})}}
function hi(n){Object.values(parts).flat().forEach(m=>m.material.emissive.set(m.userData.n==n?0x664400:0))}
function size(){const w=cv.clientWidth,h=cv.clientHeight;rd.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix()}addEventListener("resize",size);
let dr=false,lx=0,ly=0,mv=0;const rc=new THREE.Raycaster();
cv.onpointerdown=e=>{dr=true;lx=e.clientX;ly=e.clientY;mv=0};
addEventListener("pointermove",e=>{if(dr){const dx=e.clientX-lx,dy=e.clientY-ly;mv+=Math.abs(dx)+Math.abs(dy);grp.rotation.y+=dx*.01;grp.rotation.x+=dy*.01;lx=e.clientX;ly=e.clientY}});
addEventListener("pointerup",e=>{if(!dr)return;dr=false;if(mv<6&&!$("ex").classList.contains("hide")){const r=cv.getBoundingClientRect();rc.setFromCamera({x:(e.clientX-r.left)/r.width*2-1,y:-((e.clientY-r.top)/r.height)*2+1},cam);const h=rc.intersectObjects(grp.children.filter(m=>m.userData.n!="Body"))[0];if(h)showPart(h.object.userData.n)}});
let ph=0,last=0;
function loop(t){requestAnimationFrame(loop);const dt=Math.min((t-last)/1000,.1);last=t;if(!dr)grp.rotation.y+=.004;
 if(org=="Heart"){ph+=dt*hr/60*6.283;grp.scale.setScalar(1+.07*Math.max(0,Math.sin(ph)))}else if(org=="Lungs"){ph+=dt*.25*6.283;grp.scale.setScalar(1+.06*Math.sin(ph))}else grp.scale.setScalar(org=="Body"?.85:1);
 rd.render(sc,cam)}
// Explore
let deep=false,cur="";
function explain(){return cur?`${cur}: ${INFO[org].p[cur]}`:INFO[org].i+(deep?" "+INFO[org].d:"")}
function showPart(n){if(org=="Body"&&INFO[n]){pick(n);return}cur=n;hi(n);$("tip").textContent=n+": "+INFO[org].p[n];$("ea").textContent=explain();[...$("pl").children].forEach(b=>b.classList.toggle("on",b.textContent==n))}
function pick(o){cur="";deep=false;$("mode").textContent="Explain deeper";make(o);$("tip").textContent="Drag to rotate · tap a part";$("et").textContent=o;$("ea").textContent=explain();
 [...$("og").children].forEach(b=>b.classList.toggle("on",b.textContent==o));$("pl").innerHTML="";
 Object.keys(INFO[o].p).forEach(n=>{const b=document.createElement("button");b.textContent=n;b.onclick=()=>showPart(n);$("pl").appendChild(b)});prog.org[o]=1;save()}
Object.keys(INFO).forEach(o=>{const b=document.createElement("button");b.textContent=o;b.onclick=()=>pick(o);$("og").appendChild(b)});
$("mode").onclick=()=>{cur="";hi("");deep=!deep;$("mode").textContent=deep?"Explain simply":"Explain deeper";$("ea").textContent=explain();[...$("pl").children].forEach(b=>b.classList.remove("on"))};
const API="http://127.0.0.1:5000",LC={en:"en-IN",te:"te-IN",hi:"hi-IN"};let VO=[];function lv(){try{VO=speechSynthesis.getVoices()}catch(e){}}lv();try{speechSynthesis.onvoiceschanged=lv}catch(e){}
const say=t=>{const m=$("vm");if(!("speechSynthesis" in window)){m.textContent="Voice is not supported in this browser. Try Chrome or Edge.";return}
 try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);lv();const lc=LC[$("lang").value],v=VO.find(x=>x.lang.replace("_","-").toLowerCase()==lc.toLowerCase())||VO.find(x=>x.lang.toLowerCase().startsWith(lc.slice(0,2)));if(v){u.voice=v;u.lang=v.lang}else u.lang=lc;u.rate=.95;u.onstart=()=>{m.textContent=""};u.onerror=()=>{m.textContent="Voice was blocked here. Open the app in its own tab or in Chrome."};m.textContent="Speaking…";setTimeout(()=>{speechSynthesis.resume();speechSynthesis.speak(u)},150)}catch(e){m.textContent="Voice is not available here."}};
const X={alveoli:"Alveoli are tiny air sacs in the lungs where oxygen enters the blood and carbon dioxide leaves.",valve:"Heart valves are flaps that keep blood flowing in one direction.",nephron:"Nephrons are tiny filters in the kidney that clean your blood.",diaphragm:"The diaphragm is a muscle under the lungs that moves air in and out.",blood:"Blood carries oxygen, nutrients and waste around the body.",salt:"Too much salt makes the body hold water, which raises blood pressure.",smok:"Smoking narrows blood vessels, lowers oxygen and makes the heart work harder.",sleep:"Good sleep lets your heart rate and blood pressure rest and recover."};
let chat=[];
function renderChat(){$("chat").innerHTML=chat.map(c=>`<div style="margin:4px 0;padding:6px 10px;white-space:pre-wrap;border-radius:10px;border:1px solid var(--bd);background:${c.role=="user"?"var(--ac)":"var(--bg)"};color:${c.role=="user"?"#fff":"var(--tx)"}">${c.content.replace(/</g,"&lt;")}</div>`).join("");$("chat").scrollTop=1e6}
async function askT(){const raw=$("aq").value.trim();if(!raw)return;const q=raw.toLowerCase();cur="";hi("");$("aq").value="";chat.push({role:"user",content:raw});chat.push({role:"assistant",content:"Thinking…"});renderChat();let ans="";
 try{const c=new AbortController(),t=setTimeout(()=>c.abort(),25000);
  const res=await fetch(API+"/ask",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({question:raw,organ:org,lang:$("lang").value,history:chat.slice(-8,-2)}),signal:c.signal});clearTimeout(t);
  const d=await res.json();if(!res.ok)throw new Error(d.error||"Server error");ans=d.answer}
 catch(e){console.warn("AI server problem:",e);const why=(e instanceof TypeError||e.name=="AbortError")?"Cannot reach the AI server. Start it with: python server.py (then open http://127.0.0.1:5000 and check it shows a message).":"AI server error: "+e.message;let r="";
  for(const o in INFO)if(o!="Body"&&q.includes(o.toLowerCase().slice(0,4)))r=INFO[o].i+" "+INFO[o].d;
  for(const o in INFO)if(o!="Body")for(const p in INFO[o].p)if(q.includes(p.toLowerCase()))r=p+": "+INFO[o].p[p];
  for(const k in X)if(q.includes(k))r=X[k];
  ans="⚠️ "+why+(r?"\n\nOffline answer: "+r:"")}
 chat[chat.length-1].content=ans;renderChat()}
$("ab").onclick=askT;$("aq").onkeydown=e=>{if(e.key=="Enter")askT()};
$("rs").onclick=()=>{prog={org:{},sim:0,lab:0,qz:0,seen:[]};save()};
$("spk").onclick=()=>say($("ea").textContent);$("spk2").onclick=()=>say($("sx").textContent);
// Simulator
function sim(){const e=+$("s1").value,k=+$("s2").value,s=+$("s3").value,z=+$("s4").value;["1","2","3","4"].forEach(i=>$("v"+i).textContent=$("s"+i).value);
 hr=Math.round(70+e*.9+k*1.2+Math.max(0,7-z)*3);const bp=Math.round(115+(s-5)*2+k*.6+e*.3+Math.max(0,7-z)*2),o2=(99-k*.12-e*.02).toFixed(0);
 $("hr").textContent=hr;$("bp").textContent=bp;$("o2").textContent=o2;let t=[];
 if(e>50)t.push("Hard exercise makes your muscles need more oxygen, so the heart beats faster. This is normal and healthy.");
 if(k>0)t.push("Smoking narrows blood vessels and carries less oxygen, so the heart works harder.");
 if(s>8)t.push("A lot of salt makes the body hold water, which raises blood pressure over time.");
 if(z<6)t.push("Too little sleep keeps stress hormones high, raising heart rate and blood pressure.");
 $("sx").textContent=t.length?t.join(" "):"All settings are in a healthy range. The heart beats calmly and efficiently.";if(e||k||s!=5||z!=8){prog.sim=1;save()}}
["s1","s2","s3","s4"].forEach(i=>$(i).oninput=sim);
// Labeling
const NM=Object.keys(INFO.Heart.p),placed={};let sel=null,lsc=0;
function lchips(){$("ch").innerHTML="";NM.forEach(n=>{const c=document.createElement("span");c.className="chip"+(placed[n]?" used":"");c.textContent=n;c.dataset.n=n;$("ch").appendChild(c)})}
function drop(n,z){const ok=n==z;if(ok&&!placed[n]){placed[n]=1;lsc++;const g=document.querySelector(`[data-z="${z}"] text`);g.textContent=z;g.style.fontSize="10px"}
 $("lf").textContent=ok?"Correct! ✅ "+INFO.Heart.p[n]:"Not this one. Try another part.";$("lf").className="fb "+(ok?"ok":"no");$("ls").textContent="Placed: "+lsc+"/5";sel=null;lchips();if(ok&&lsc>prog.lab){prog.lab=lsc;save()}}
$("ch").addEventListener("pointerdown",e=>{const c=e.target.closest(".chip");if(!c)return;const n=c.dataset.n,sx=e.clientX,sy=e.clientY,g=$("gh");let moved=false;
 const mv=ev=>{if(Math.abs(ev.clientX-sx)+Math.abs(ev.clientY-sy)>8){moved=true;g.textContent=n;g.classList.remove("hide");g.style.left=ev.clientX-30+"px";g.style.top=ev.clientY-40+"px"}};
 const up=ev=>{removeEventListener("pointermove",mv);removeEventListener("pointerup",up);g.classList.add("hide");
  if(moved){const z=document.elementFromPoint(ev.clientX,ev.clientY)?.closest("[data-z]");if(z)drop(n,z.dataset.z)}else{sel=n;[...$("ch").children].forEach(x=>x.classList.toggle("sel",x.dataset.n==n))}};
 addEventListener("pointermove",mv);addEventListener("pointerup",up)});
$("sv").onclick=e=>{const z=e.target.closest("[data-z]");if(z&&sel)drop(sel,z.dataset.z)};
$("lr").onclick=()=>{Object.keys(placed).forEach(k=>delete placed[k]);lsc=0;document.querySelectorAll("[data-z] text").forEach(t=>{t.textContent="?";t.style.fontSize=""});$("lf").textContent="";$("ls").textContent="Placed: 0/5";lchips()};
// Quiz
const Q0=[["Which chamber pumps oxygen-rich blood to the whole body?",["Right atrium","Left ventricle","Right ventricle","Left atrium"],1],["Where does gas exchange happen in the lungs?",["Trachea","Bronchi","Alveoli","Diaphragm"],2],["What do the kidneys mainly do?",["Pump blood","Filter blood and make urine","Digest food","Make oxygen"],1],["Which tube carries urine from the kidney to the bladder?",["Ureter","Aorta","Trachea","Renal vein"],0],["Which is the largest artery leaving the heart?",["Vena cava","Aorta","Ureter","Bronchus"],1],["Eating too much salt over time can raise:",["Blood pressure","Height","Vision","Hair growth"],0]];
const BANK=Q0.concat([["Which blood vessels carry blood back to the heart?",["Veins","Arteries","Bronchi","Ureters"],0],["How many chambers does the human heart have?",["2","3","4","6"],2],["Which muscle helps you breathe in and out?",["Biceps","Diaphragm","Aorta","Cortex"],1],["Which gas do we breathe out more of than we breathe in?",["Oxygen","Carbon dioxide","Nitrogen","Helium"],1],["What are the tiny filters inside a kidney called?",["Alveoli","Nephrons","Valves","Bronchi"],1],["Which side of the heart receives blood from the lungs?",["Left side","Right side","Both equally","Neither"],0],["Which tube connects the throat to the bronchi?",["Trachea","Ureter","Aorta","Renal pelvis"],0],["How does smoking affect the heart?",["Makes it work harder","Lowers heart rate","Improves oxygen supply","Strengthens vessels"],0],["Which organ helps control blood pressure besides the heart?",["Kidneys","Tongue","Skin","Hair"],0],["How many times does a resting adult breathe per minute?",["2 to 4","12 to 20","50 to 60","100"],1],["Blood from the body enters the heart first at the...",["Right atrium","Left ventricle","Aorta","Left atrium"],0],["Why is the left ventricle the thickest chamber?",["It pumps blood to the whole body","It stores air","It filters urine","It makes blood"],0]]);
let Q=[],qi=0,qs=0,ans=false,miss=[],aiq=false;
const topic=q=>{if(aiq)return org;const t=(q[0]+" "+q[1][q[2]]).toLowerCase();return /kidney|ureter|nephron|urine|filter/.test(t)?"Kidney":/heart|atrium|ventric|aorta|vein|blood/.test(t)?"Heart":"Lungs"};
const shuf=a=>a.map(v=>[Math.random(),v]).sort((x,y)=>x[0]-y[0]).map(x=>x[1]);
function newSet(){prog.seen=prog.seen||[];let pool=BANK.filter(q=>!prog.seen.includes(q[0]));if(pool.length<6){prog.seen=[];pool=BANK.slice()}
 Q=shuf(pool).slice(0,6).map(q=>{const c=q[1][q[2]],o=shuf(q[1]);return [q[0],o,o.indexOf(c)]});Q.forEach(q=>prog.seen.push(q[0]));miss=[];aiq=false;save()}
newSet();
function ask(){ans=false;const q=Q[qi];$("qn").textContent=`Question ${qi+1}/${Q.length}`;$("qs").textContent="Score: "+qs;$("qq").textContent=q[0];$("qf").textContent="";$("qx").classList.add("hide");$("qx").textContent=qi==Q.length-1?"Finish":"Next";$("qo").innerHTML="";
 q[1].forEach((o,i)=>{const b=document.createElement("button");b.className="opt";b.textContent=o;b.onclick=()=>{if(ans)return;ans=true;const ok=i==q[2];if(ok)qs++;else miss.push(topic(q));b.classList.add(ok?"r":"w");if(!ok)$("qo").children[q[2]].classList.add("r");$("qf").textContent=ok?"Correct! ✅":"Not quite. The right answer is highlighted.";$("qf").className="fb "+(ok?"ok":"no");$("qs").textContent="Score: "+qs;$("qx").classList.remove("hide")};$("qo").appendChild(b)})}
$("qx").onclick=()=>{if(qi<Q.length-1){qi++;ask();return}
 if($("qx").textContent=="Retry"){qi=0;qs=0;newSet();ask();return}
 if(!aiq)prog.qz=Math.max(prog.qz,qs);save();$("qn").textContent="Quiz complete";$("qs").textContent="";$("qq").textContent=`You scored ${qs}/${Q.length}. ${qs>=5?"Excellent!":"Revisit Explore and try again."}${miss.length?" Revise: "+[...new Set(miss)].join(", ")+".":" No weak topics, great job!"}`;$("qo").innerHTML="";$("qf").textContent="";$("qx").textContent="Retry"};
// Tabs
document.querySelectorAll(".tabs button").forEach(b=>b.onclick=()=>{const t=b.dataset.t;document.querySelectorAll(".tabs button").forEach(x=>x.classList.toggle("on",x==b));["ex","si","lb","qz"].forEach(i=>$(i).classList.toggle("hide",i!=t));
 $("cv").classList.toggle("hide",t=="lb"||t=="qz");if(t=="ex")pick(org=="Heart"&&hr!=70?"Heart":org);if(t=="si"){make("Heart");sim()}else hr=70;size()});
size();lchips();$("ls").textContent="Placed: 0/5";ask();loop(0);pick("Heart");

// ---- Batch 1: badges, streak, health check ----
function badges(){const k=prog.streak||0,B=[["🫀","Heart Hero",prog.lab>=5],["🫁","Lung Explorer",!!(prog.org&&prog.org.Lungs)],["🧪","Scientist",!!prog.sim],["🏆","Quiz Star",prog.qz>=5],["🩺","Health Checker",!!prog.hc],["🔥",k+"-day streak",k>=2]];
 $("bg").innerHTML=B.map(b=>`<span title="${b[1]}" style="padding:3px 8px;border-radius:14px;font-size:12px;border:1px solid var(--bd);opacity:${b[2]?1:.35}">${b[0]} ${b[1]}</span>`).join("")}
(function(){const d=new Date(),t=d.toDateString(),y=new Date(d-864e5).toDateString();if(prog.last!=t){prog.streak=prog.last==y?(prog.streak||0)+1:1;prog.last=t}save()})();
$("hb").onclick=()=>{const a=+$("ha").value,w=+$("hw").value,h=+$("hh").value/100;if(!a||!w||!h||a>110||h<.5){$("ho").textContent="Please enter a valid age, weight and height.";return}
 const b=w/(h*h),c=b<18.5?"underweight":b<25?"in the healthy range":b<30?"overweight":"in the obese range",mx=220-a;
 $("ho").textContent=`BMI ${b.toFixed(1)} (${c}). Normal resting heart rate is 60 to 100 bpm. Your estimated maximum is ${mx} bpm, so a moderate exercise zone is about ${Math.round(mx*.5)} to ${Math.round(mx*.7)} bpm.`;prog.hc=1;save()};

// ---- Batch 2: language, mic, AI quiz, full screen ----
$("trb").onclick=async()=>{const l=$("lang").value,m=$("vm");if(l=="en"){m.textContent="Choose Telugu or Hindi first.";return}m.textContent="Translating…";
 try{const res=await fetch(API+"/translate",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({text:$("ea").textContent,lang:l})});const d=await res.json();if(!res.ok)throw new Error(d.error);$("ea").textContent=d.text;m.textContent=""}
 catch(e){m.textContent="Translation failed: "+(e instanceof TypeError?"cannot reach the AI server (run python server.py).":e.message)}};
$("mic").onclick=()=>{const SR=window.SpeechRecognition||window.webkitSpeechRecognition,m=$("vm");if(!SR){m.textContent="Mic input is not supported in this browser. Use Chrome or Edge.";return}
 const r=new SR();r.lang=LC[$("lang").value];r.interimResults=false;m.textContent="Listening… speak your question";
 r.onresult=e=>{$("aq").value=e.results[0][0].transcript;m.textContent="";askT()};
 r.onerror=e=>{m.textContent="Mic problem: "+e.error+". Please allow microphone access."};
 r.onend=()=>{if(m.textContent.startsWith("Listening"))m.textContent=""};r.start()};
$("aiq").onclick=async()=>{const b=$("aiq");b.textContent="Creating quiz…";
 try{const res=await fetch(API+"/quiz",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({topic:org=="Body"?"the whole human body":org,lang:$("lang").value})});const d=await res.json();if(!res.ok)throw new Error(d.error);
  Q=d.questions.map(x=>[x.q,x.options,x.answer]);qi=0;qs=0;miss=[];aiq=true;ask()}
 catch(e){$("qf").textContent="AI quiz failed: "+(e instanceof TypeError?"cannot reach the AI server (run python server.py).":e.message)}
 b.textContent="🤖 New AI quiz on current organ"};
$("fsb").onclick=()=>{const c=$("cv"),on=!c.classList.contains("fs");c.classList.toggle("fs",on);$("fsb").textContent=on?"✕ Exit":"⛶ Full screen";document.body.style.overflow=on?"hidden":"";
 try{if(on&&c.requestFullscreen)c.requestFullscreen();else if(!on&&document.fullscreenElement)document.exitFullscreen()}catch(e){}setTimeout(size,150)};
document.addEventListener("fullscreenchange",()=>{if(!document.fullscreenElement&&$("cv").classList.contains("fs")){$("cv").classList.remove("fs");$("fsb").textContent="⛶ Full screen";document.body.style.overflow=""}setTimeout(size,150)});

// ---- Whole-site full screen (16:9) ----
function wide(on){document.body.classList.toggle("wide",on);$("wb").textContent=on?"✕ Exit full screen":"🖥️ Full screen 16:9";
 try{if(on&&document.documentElement.requestFullscreen)document.documentElement.requestFullscreen();else if(!on&&document.fullscreenElement)document.exitFullscreen()}catch(e){}
 try{if(screen.orientation&&screen.orientation.lock){if(on)screen.orientation.lock("landscape").catch(()=>{});else screen.orientation.unlock()}}catch(e){}
 [100,400,900].forEach(t=>setTimeout(size,t))}
$("wb").onclick=()=>wide(!document.body.classList.contains("wide"));
document.addEventListener("fullscreenchange",()=>{if(!document.fullscreenElement&&document.body.classList.contains("wide"))wide(false)});

$("lsa").onclick=()=>{const a=[...chat].reverse().find(c=>c.role=="assistant"&&c.content!="Thinking…");if(a)say(a.content)};
