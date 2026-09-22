const categories = [
  { id:"vaginal", label:"Обычный", badge:"Обычный секс", color:"#ff5c8a" },
  { id:"oral", label:"Оральный", badge:"Оральный", color:"#9b6dff" },
  { id:"anal", label:"Анальный", badge:"Анальный", color:"#ff9b5c" }
];

const variationSets = [
  { suffix:"", difficultyShift:0, note:"Базовый вариант — без спешки, с возможностью легко поменять положение." },
  { suffix:" с мягкой опорой", difficultyShift:-1, note:"Используйте подушку или сложенный плед, чтобы уменьшить нагрузку." },
  { suffix:" в медленном темпе", difficultyShift:-1, note:"Сохраняйте спокойный темп и заранее договоритесь о стоп-сигнале." },
  { suffix:" с паузами", difficultyShift:-1, note:"Делайте короткие паузы и регулярно сверяйтесь по комфорту." },
  { suffix:" с дополнительной подушкой", difficultyShift:-1, note:"Дополнительная подушка помогает немного изменить высоту и угол без лишнего напряжения." },
  { suffix:" с опорой для спины", difficultyShift:-1, note:"Добавьте устойчивую опору под спину там, где это уместно и удобно." },
  { suffix:" ближе друг к другу", difficultyShift:0, note:"Сократите расстояние между партнёрами только настолько, насколько обоим комфортно." },
  { suffix:" с большим пространством", difficultyShift:0, note:"Оставьте больше пространства для свободной смены положения и остановки." },
  { suffix:" короткий вариант", difficultyShift:-1, note:"Используйте положение недолго и без стремления удерживать его через усталость." },
  { suffix:" с контролем принимающего партнёра", difficultyShift:0, note:"Темп и глубину определяет партнёр, для которого это особенно важно по комфорту." },
  { suffix:" с контролем дистанции", difficultyShift:0, note:"Сохраняйте такое расстояние, при котором легко замедлиться или полностью остановиться." },
  { suffix:" с мягкой поверхностью", difficultyShift:-1, note:"Выберите мягкую, но устойчивую поверхность и уберите предметы, мешающие свободному движению." },
  { suffix:" вариант для перехода", difficultyShift:0, note:"Используйте эту позицию как недолгий переход к другому удобному положению." },
  { suffix:" более активный вариант", difficultyShift:1, note:"Требует немного больше контроля и устойчивости; при усталости лучше вернуться к базовому варианту." }
];

const base = {
  vaginal: [
    ["Лицом к лицу лёжа","Оба партнёра лежат лицом друг к другу; положение легко регулировать расстоянием и углом.","лёжа","Легко","face"],
    ["На боку лицом к лицу","Оба лежат на боку лицом друг к другу. Спокойный вариант с небольшой нагрузкой.","кровать","Легко","side"],
    ["На боку сзади","Один партнёр лежит на боку, второй располагается сзади. Подходит для неторопливого темпа.","кровать","Легко","sideBack"],
    ["Сидя лицом к лицу","Один партнёр сидит устойчиво, второй располагается лицом к нему. Удобно контролировать дистанцию.","диван","Средне","seat"],
    ["На краю кровати","Один партнёр располагается у края кровати, второй остаётся рядом стоя или на коленях.","кровать","Средне","edge"],
    ["Полусидя","Один партнёр опирается спиной на подушки, второй располагается ближе лицом к нему.","кровать","Легко","recline"],
    ["Стоя у опоры","Оба стоят рядом с устойчивой стеной или высокой мебелью; опора помогает сохранять баланс.","стоя","Сложно","stand"],
    ["Сзади с опорой","Один партнёр опирается руками на устойчивую поверхность, второй располагается сзади.","диван","Средне","lean"],
    ["Колени рядом","Оба располагаются на коленях близко друг к другу; лучше использовать мягкую поверхность.","кровать","Средне","kneel"],
    ["Поперёк кровати","Один партнёр лежит поперёк края кровати, второй располагается рядом.","кровать","Средне","edge2"],
    ["Объятие сидя","Один партнёр сидит, второй располагается близко, обхватывая его ногами без сильного напряжения.","диван","Средне","seatHug"],
    ["Низкая опора","Один партнёр использует устойчивую низкую опору, чтобы немного изменить высоту и угол.","комната","Средне","support"]
  ],
  oral: [
    ["Один сидит, второй рядом","Один партнёр удобно сидит, второй располагается перед ним на мягкой поверхности.","диван","Легко","oralSeat"],
    ["На краю кровати","Один партнёр располагается у края кровати, второй — рядом ниже уровня кровати.","кровать","Легко","oralEdge"],
    ["Лёжа на спине","Один партнёр лежит на спине, второй располагается рядом так, чтобы обоим было удобно.","кровать","Легко","oralLie"],
    ["На боку","Партнёры располагаются на боку. Положение снижает нагрузку на шею и колени.","кровать","Легко","oralSide"],
    ["69 на боку","Оба лежат на боку в противоположных направлениях. При дискомфорте легко разойтись и сменить положение.","кровать","Средне","sixtyNineSide"],
    ["69 лёжа","Один партнёр располагается над другим без переноса лишнего веса на грудь или шею.","кровать","Средне","sixtyNine"],
    ["Полусидя на подушках","Один партнёр полусидит с опорой под спиной, второй располагается рядом.","кровать","Легко","oralRecline"],
    ["Стоя у стены","Один партнёр стоит у устойчивой опоры, второй располагается ниже. Лучше избегать долгой нагрузки на колени.","стоя","Средне","oralStand"],
    ["Оба на коленях","Партнёры располагаются на мягкой поверхности на коленях, сохраняя свободный доступ к смене положения.","кровать","Средне","oralKneel"],
    ["Угол дивана","Один партнёр удобно размещается в углу дивана, второй — рядом. Подлокотник можно использовать как опору.","диван","Легко","oralCorner"],
    ["Поперёк кровати","Один партнёр лежит ближе к краю, второй располагается сбоку, не создавая нагрузку сверху.","кровать","Легко","oralCross"],
    ["Сидя на полу у дивана","Один партнёр сидит на диване, второй — на мягком ковре или подушке рядом.","комната","Легко","oralFloor"]
  ],
  anal: [
    ["На боку сзади","Принимающий партнёр лежит на боку, второй располагается сзади. Положение позволяет легко остановиться или изменить угол.","кровать","Легко","analSide"],
    ["Лицом к лицу лёжа","Оба располагаются лицом друг к другу лёжа; подушка может помочь найти комфортный угол.","кровать","Средне","analFace"],
    ["Полусидя лицом к лицу","Один партнёр полусидит с хорошей опорой спины, второй располагается ближе лицом к нему.","кровать","Средне","analRecline"],
    ["Сзади с подушкой","Один партнёр располагается впереди на мягкой поверхности с подушкой для опоры, второй — сзади.","кровать","Легко","analPillow"],
    ["На краю кровати","Один партнёр располагается у края кровати, второй остаётся рядом, сохраняя устойчивое положение.","кровать","Средне","analEdge"],
    ["Колени и опора","Один партнёр находится на коленях с опорой руками и корпусом, второй располагается сзади.","кровать","Средне","analKneel"],
    ["Лёжа на животе","Один партнёр лежит на животе с небольшой подушкой под бёдрами, второй располагается сверху без переноса веса.","кровать","Средне","analProne"],
    ["Стоя у стены","Один партнёр использует стену как устойчивую опору, второй располагается сзади.","стоя","Сложно","analStand"],
    ["Наклон у дивана","Один партнёр опирается на спинку или сиденье устойчивого дивана, второй располагается сзади.","диван","Средне","analLean"],
    ["Оба на боку, ноги согнуты","Оба лежат на боку с немного согнутыми ногами; вариант рассчитан на небольшой диапазон движений.","кровать","Легко","analCurl"],
    ["Сидя с опорой","Один партнёр устойчиво сидит, второй располагается ближе, используя спинку или стену как дополнительную опору.","диван","Сложно","analSeat"],
    ["Низкая устойчивая опора","Положение строится вокруг низкой устойчивой поверхности, чтобы партнёрам было проще контролировать высоту.","комната","Средне","analSupport"]
  ]
};

function difficultyIndex(label){
  return ["Легко","Средне","Сложно"].indexOf(label);
}
function shiftDifficulty(label,shift){
  const i=difficultyIndex(label);
  return ["Легко","Средне","Сложно"][Math.max(0,Math.min(2,i+shift))];
}
function buildPool(category){
  return base[category].flatMap((item,baseIndex)=>
    variationSets.map((v,variantIndex)=>({
      id:category+"-"+baseIndex+"-"+variantIndex,
      title:item[0]+v.suffix,
      description:item[1],
      setting:item[2],
      difficulty:shiftDifficulty(item[3],v.difficultyShift),
      scene:item[4],
      note:v.note
    }))
  );
}
const pools={
  vaginal:buildPool("vaginal"),
  oral:buildPool("oral"),
  anal:buildPool("anal")
};

const wheel=document.getElementById("wheel");
const spinBtn=document.getElementById("spinBtn");
const resultCard=document.getElementById("resultCard");
const categoryTitle=document.getElementById("categoryTitle");
const categoryBadge=document.getElementById("categoryBadge");
const poseTitle=document.getElementById("poseTitle");
const poseDescription=document.getElementById("poseDescription");
const difficultyTag=document.getElementById("difficultyTag");
const settingTag=document.getElementById("settingTag");
const poseTip=document.getElementById("poseTip");
const poseIllustration=document.getElementById("poseIllustration");
const rerollPoseBtn=document.getElementById("rerollPoseBtn");
const rerollAllBtn=document.getElementById("rerollAllBtn");
const ageGate=document.getElementById("ageGate");
const adultConfirm=document.getElementById("adultConfirm");
const adultExit=document.getElementById("adultExit");
const historyBtn=document.getElementById("historyBtn");
const historyModal=document.getElementById("historyModal");
const closeHistory=document.getElementById("closeHistory");
const clearHistory=document.getElementById("clearHistory");
const historyList=document.getElementById("historyList");
document.getElementById("poolCount").textContent=Object.values(pools).reduce((n,p)=>n+p.length,0);

let rotation=0;
let currentCategory=null;
let spinning=false;

function randomIndex(length){
  if(window.crypto?.getRandomValues){
    const arr=new Uint32Array(1);
    crypto.getRandomValues(arr);
    return arr[0]%length;
  }
  return Math.floor(Math.random()*length);
}
function pick(arr){return arr[randomIndex(arr.length)]}

function figure(x,y,scale,flip,pose){
  const f=flip?-1:1;
  const headY=y-54*scale;
  const bodyEndY=y+12*scale;
  let arm1=[x,y-24*scale,x+30*f*scale,y-2*scale];
  let arm2=[x,y-18*scale,x-25*f*scale,y+2*scale];
  let leg1=[x,bodyEndY,x+27*f*scale,y+55*scale];
  let leg2=[x,bodyEndY,x-24*f*scale,y+51*scale];
  if(pose==="sit"){leg1=[x,bodyEndY,x+42*f*scale,y+25*scale];leg2=[x,bodyEndY,x+14*f*scale,y+55*scale]}
  if(pose==="kneel"){leg1=[x,bodyEndY,x+28*f*scale,y+30*scale];leg2=[x+28*f*scale,y+30*scale,x+4*f*scale,y+50*scale]}
  if(pose==="lie"){leg1=[x,bodyEndY,x+52*f*scale,y+18*scale];leg2=[x,bodyEndY,x+44*f*scale,y+38*scale];arm1=[x,y-22*scale,x+34*f*scale,y-30*scale]}
  return '<g stroke="currentColor" stroke-width="'+(10*scale)+'" stroke-linecap="round" fill="none">'+
    '<circle cx="'+x+'" cy="'+headY+'" r="'+(14*scale)+'" fill="currentColor" stroke="none"/>'+
    '<path d="M '+x+' '+(y-38*scale)+' L '+x+' '+bodyEndY+'"/>'+
    '<path d="M '+arm1[0]+' '+arm1[1]+' L '+arm1[2]+' '+arm1[3]+'"/>'+
    '<path d="M '+arm2[0]+' '+arm2[1]+' L '+arm2[2]+' '+arm2[3]+'"/>'+
    '<path d="M '+leg1[0]+' '+leg1[1]+' L '+leg1[2]+' '+leg1[3]+'"/>'+
    '<path d="M '+leg2[0]+' '+leg2[1]+' L '+leg2[2]+' '+leg2[3]+'"/>'+
  '</g>';
}
function silhouette(scene,color){
  const isSide=/side|curl|lie|prone|cross/i.test(scene);
  const isSeat=/seat|recline|corner/i.test(scene);
  const isKneel=/kneel|pillow/i.test(scene);
  const poseA=isSide?"lie":isSeat?"sit":isKneel?"kneel":"stand";
  const poseB=isSide?"lie":isSeat?"kneel":/edge|lean|support/i.test(scene)?"stand":isKneel?"kneel":"stand";
  const aX=isSide?132:145, bX=isSide?230:225;
  const aY=isSide?160:170, bY=isSide?183:170;
  return '<svg viewBox="0 0 360 280" role="img" aria-label="Нейтральная схематичная иллюстрация двух взрослых фигур">'+
    '<rect x="28" y="224" width="304" height="8" rx="4" fill="rgba(255,255,255,.13)"/>'+
    '<g style="color:'+color+'">'+figure(aX,aY,1,false,poseA)+'</g>'+
    '<g style="color:#f1e8f7">'+figure(bX,bY,.94,true,poseB)+'</g>'+
    '<circle cx="180" cy="128" r="92" fill="none" stroke="rgba(255,255,255,.06)" stroke-width="1"/>'+
  '</svg>';
}
function categoryTip(category){
  if(category==="anal") return "Для этой категории особенно важны достаточная смазка, медленный темп, ясное согласие и немедленная остановка при боли.";
  if(category==="oral") return "Не давите на голову или шею партнёра без заранее оговорённого согласия; удобное положение важнее результата.";
  return "Сверяйтесь по комфорту и темпу. Любой результат рулетки можно без объяснений пропустить.";
}
function render(category,pose){
  const meta=categories.find(c=>c.id===category);
  currentCategory=category;
  categoryTitle.textContent=meta.badge;
  categoryBadge.textContent=meta.label;
  categoryBadge.style.borderColor=meta.color+"66";
  poseTitle.textContent=pose.title;
  poseDescription.textContent=pose.description;
  difficultyTag.textContent="Сложность: "+pose.difficulty;
  settingTag.textContent="Где: "+pose.setting;
  poseTip.textContent=categoryTip(category)+" "+pose.note;
  poseIllustration.innerHTML=silhouette(pose.scene,meta.color);
  resultCard.classList.remove("hidden");
  addHistory(meta.badge,pose.title);
  setTimeout(()=>resultCard.scrollIntoView({behavior:"smooth",block:"nearest"}),70);
}
function spin(){
  if(spinning)return;
  spinning=true;
  spinBtn.classList.add("spinning");
  const idx=randomIndex(categories.length);
  const chosen=categories[idx];
  const segment=120;
  const center=idx*segment;
  rotation+=1440+(360-center);
  wheel.style.transform="rotate("+rotation+"deg)";
  window.setTimeout(()=>{
    render(chosen.id,pick(pools[chosen.id]));
    spinning=false;
    spinBtn.classList.remove("spinning");
  },3150);
}
function rerollPose(){
  if(!currentCategory)return;
  render(currentCategory,pick(pools[currentCategory]));
}

const HISTORY_KEY="adultRouletteHistoryV1";
function loadHistory(){
  try{return JSON.parse(localStorage.getItem(HISTORY_KEY)||"[]")}catch{return[]}
}
function addHistory(category,pose){
  const items=loadHistory();
  items.unshift({category,pose,time:new Date().toLocaleString("ru-RU")});
  localStorage.setItem(HISTORY_KEY,JSON.stringify(items.slice(0,12)));
}
function renderHistory(){
  const items=loadHistory();
  historyList.innerHTML=items.length?items.map(x=>
    '<div class="history-item"><strong>'+escapeHtml(x.category)+' → '+escapeHtml(x.pose)+'</strong><span>'+escapeHtml(x.time)+'</span></div>'
  ).join(""):'<div class="empty">История пока пустая.</div>';
}
function escapeHtml(s){
  return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
}

spinBtn.addEventListener("click",spin);
rerollPoseBtn.addEventListener("click",rerollPose);
rerollAllBtn.addEventListener("click",spin);
historyBtn.addEventListener("click",()=>{renderHistory();historyModal.showModal()});
closeHistory.addEventListener("click",()=>historyModal.close());
clearHistory.addEventListener("click",()=>{localStorage.removeItem(HISTORY_KEY);renderHistory()});

adultConfirm.addEventListener("click",()=>localStorage.setItem("adultRoulette18","yes"));
adultExit.addEventListener("click",(e)=>{
  e.preventDefault();
  document.body.innerHTML='<main style="min-height:100vh;display:grid;place-items:center;padding:24px;background:#0b0711;color:#fff;font-family:system-ui"><div style="max-width:520px;text-align:center"><h1>Доступ закрыт</h1><p style="color:#bbaec8">Страница предназначена только для совершеннолетних.</p></div></main>';
});
if(localStorage.getItem("adultRoulette18")!=="yes") ageGate.showModal();
