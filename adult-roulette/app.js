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

const mannequinPoses = {
  stand:{head:[0,-66],shoulder:[0,-39],hip:[0,8],elbows:[[22,-12],[-20,-8]],hands:[[28,18],[-28,18]],knees:[[14,43],[-12,43]],feet:[[18,78],[-18,78]]},
  sit:{head:[0,-66],shoulder:[0,-39],hip:[0,8],elbows:[[23,-10],[-16,-8]],hands:[[32,13],[18,18]],knees:[[43,16],[36,29]],feet:[[43,62],[28,64]]},
  kneel:{head:[0,-66],shoulder:[0,-39],hip:[0,8],elbows:[[22,-8],[-18,-6]],hands:[[30,18],[20,18]],knees:[[27,40],[12,45]],feet:[[5,57],[-4,58]]},
  allFours:{head:[-54,-25],shoulder:[-32,-10],hip:[25,0],elbows:[[-36,22],[-18,22]],hands:[[-38,55],[-13,55]],knees:[[38,35],[24,38]],feet:[[56,55],[42,56]]},
  lie:{head:[-62,-10],shoulder:[-37,-4],hip:[15,2],elbows:[[-18,-25],[-10,16]],hands:[[12,-25],[18,18]],knees:[[50,8],[46,23]],feet:[[78,7],[73,29]]},
  recline:{head:[-42,-58],shoulder:[-28,-36],hip:[2,8],elbows:[[-8,-13],[-22,-5]],hands:[[17,5],[-5,13]],knees:[[43,25],[38,38]],feet:[[62,58],[52,62]]},
  curl:{head:[-58,-18],shoulder:[-35,-8],hip:[12,3],elbows:[[-20,-27],[-10,13]],hands:[[2,-18],[6,20]],knees:[[42,-8],[46,15]],feet:[[62,13],[62,30]]}
};

function mannequin(x,y,scale,rotation,pose,flip,color,label){
  const p=mannequinPoses[pose]||mannequinPoses.stand;
  const sx=flip?-scale:scale;
  const limb=(a,b,w=13)=>'<path d="M '+a[0]+' '+a[1]+' L '+b[0]+' '+b[1]+'" stroke="currentColor" stroke-width="'+w+'" stroke-linecap="round"/>';
  const joint=(pt,r=5)=>'<circle cx="'+pt[0]+'" cy="'+pt[1]+'" r="'+r+'" fill="currentColor"/>';
  const body=
    '<g transform="translate('+x+' '+y+') rotate('+rotation+') scale('+sx+' '+scale+')" style="color:'+color+'">'+
      limb(p.shoulder,p.hip,27)+
      limb(p.shoulder,p.elbows[0])+limb(p.elbows[0],p.hands[0],11)+
      limb(p.shoulder,p.elbows[1])+limb(p.elbows[1],p.hands[1],11)+
      limb(p.hip,p.knees[0],15)+limb(p.knees[0],p.feet[0],13)+
      limb(p.hip,p.knees[1],15)+limb(p.knees[1],p.feet[1],13)+
      '<circle cx="'+p.head[0]+'" cy="'+p.head[1]+'" r="17" fill="currentColor"/>'+
      joint(p.shoulder,6)+joint(p.hip,7)+joint(p.knees[0],5)+joint(p.knees[1],5)+
    '</g>';
  const lx=x+(flip?28:-28), ly=y-82*scale;
  return body+
    '<g transform="translate('+lx+' '+ly+')"><circle r="13" fill="#0f0a17" stroke="'+color+'" stroke-width="2"/><text x="0" y="5" text-anchor="middle" font-size="13" font-weight="900" fill="#fff">'+label+'</text></g>';
}

function roomObject(kind){
  if(kind==="bed") return '<g opacity=".9"><rect x="28" y="214" width="304" height="28" rx="10" fill="#31233e"/><rect x="38" y="202" width="285" height="15" rx="8" fill="#62506f"/><rect x="42" y="184" width="74" height="18" rx="9" fill="#806b8f"/></g>';
  if(kind==="sofa") return '<g opacity=".9"><rect x="50" y="176" width="260" height="58" rx="18" fill="#3a2947"/><rect x="57" y="151" width="246" height="42" rx="18" fill="#584164"/><rect x="44" y="180" width="22" height="54" rx="10" fill="#6b5276"/><rect x="294" y="180" width="22" height="54" rx="10" fill="#6b5276"/></g>';
  if(kind==="wall") return '<g opacity=".8"><rect x="42" y="28" width="10" height="207" rx="5" fill="#75657f"/><rect x="42" y="225" width="278" height="9" rx="4" fill="#45344f"/></g>';
  if(kind==="support") return '<g opacity=".9"><rect x="48" y="177" width="105" height="53" rx="12" fill="#4a3856"/><rect x="48" y="169" width="105" height="14" rx="7" fill="#756082"/><rect x="48" y="226" width="105" height="7" rx="3" fill="#2d2035"/></g>';
  return '<rect x="28" y="225" width="304" height="9" rx="4" fill="#44344f"/>';
}

const sceneLayouts = {
  face:{env:"bed",a:[132,164,1,0,"lie",true],b:[228,174,.96,0,"lie",false],caption:"Оба лежат лицом друг к другу"},
  side:{env:"bed",a:[132,158,.94,0,"lie",true],b:[228,182,.94,0,"lie",false],caption:"Оба на боку, головы направлены друг к другу"},
  sideBack:{env:"bed",a:[168,155,.93,0,"lie",false],b:[190,184,.93,0,"lie",false],caption:"Оба на боку в одном направлении"},
  seat:{env:"sofa",a:[132,153,.82,0,"sit",false],b:[225,170,.82,0,"sit",true],caption:"Оба сидят лицом друг к другу"},
  edge:{env:"bed",a:[137,160,.88,0,"recline",false],b:[246,145,.9,0,"stand",true],caption:"A у края кровати, B рядом стоя"},
  recline:{env:"bed",a:[130,163,.9,0,"recline",false],b:[232,169,.86,0,"kneel",true],caption:"A полусидя с опорой, B рядом"},
  stand:{env:"wall",a:[145,143,.9,0,"stand",false],b:[220,147,.88,0,"stand",true],caption:"Оба стоят, рядом есть устойчивая опора"},
  lean:{env:"support",a:[157,164,.9,0,"allFours",false],b:[250,145,.88,0,"stand",true],caption:"A опирается на устойчивую поверхность, B сзади"},
  kneel:{env:"bed",a:[140,164,.88,0,"kneel",false],b:[220,164,.88,0,"kneel",true],caption:"Оба на коленях лицом друг к другу"},
  edge2:{env:"bed",a:[136,166,.9,0,"lie",false],b:[246,146,.88,0,"stand",true],caption:"A лежит поперёк края, B рядом"},
  seatHug:{env:"sofa",a:[151,154,.84,0,"sit",false],b:[207,158,.78,0,"sit",true],caption:"Сидя очень близко лицом друг к другу"},
  support:{env:"support",a:[145,159,.85,0,"recline",false],b:[235,165,.82,0,"kneel",true],caption:"A использует низкую опору, B рядом"},

  oralSeat:{env:"sofa",a:[135,152,.84,0,"sit",false],b:[225,174,.78,0,"kneel",true],caption:"A сидит, B располагается ниже перед ним"},
  oralEdge:{env:"bed",a:[137,161,.88,0,"recline",false],b:[238,177,.76,0,"kneel",true],caption:"A у края кровати, B ниже рядом"},
  oralLie:{env:"bed",a:[142,169,.91,0,"lie",false],b:[238,176,.75,0,"kneel",true],caption:"A лежит, B располагается рядом у края"},
  oralSide:{env:"bed",a:[145,158,.9,0,"lie",false],b:[220,184,.84,0,"lie",true],caption:"Оба лежат на боку, повернувшись друг к другу"},
  sixtyNineSide:{env:"bed",a:[161,153,.86,0,"lie",false],b:[198,187,.86,180,"lie",false],caption:"Оба лежат параллельно в противоположных направлениях"},
  sixtyNine:{env:"bed",a:[178,172,.84,0,"lie",false],b:[182,142,.8,180,"lie",false],caption:"Один лежит над другим в противоположном направлении"},
  oralRecline:{env:"bed",a:[132,160,.9,0,"recline",false],b:[235,174,.77,0,"kneel",true],caption:"A полусидит на подушках, B рядом ниже"},
  oralStand:{env:"wall",a:[145,143,.9,0,"stand",false],b:[220,180,.75,0,"kneel",true],caption:"A стоит у опоры, B располагается ниже"},
  oralKneel:{env:"bed",a:[143,165,.83,0,"kneel",false],b:[218,170,.83,0,"kneel",true],caption:"Оба на коленях лицом друг к другу"},
  oralCorner:{env:"sofa",a:[128,150,.83,0,"sit",false],b:[220,176,.76,0,"kneel",true],caption:"A сидит в углу дивана, B рядом ниже"},
  oralCross:{env:"bed",a:[141,166,.9,0,"lie",false],b:[240,174,.75,0,"kneel",true],caption:"A лежит ближе к краю, B располагается сбоку"},
  oralFloor:{env:"sofa",a:[126,151,.83,0,"sit",false],b:[220,181,.73,0,"kneel",true],caption:"A сидит на диване, B на мягкой поверхности рядом"},

  analSide:{env:"bed",a:[166,154,.92,0,"lie",false],b:[194,184,.92,0,"lie",false],caption:"Оба на боку, B располагается сзади"},
  analFace:{env:"bed",a:[132,164,.93,0,"lie",true],b:[228,177,.93,0,"lie",false],caption:"Оба лежат лицом друг к другу"},
  analRecline:{env:"bed",a:[132,160,.9,0,"recline",false],b:[220,162,.82,0,"sit",true],caption:"A полусидит с опорой, B близко лицом к нему"},
  analPillow:{env:"bed",a:[154,164,.88,0,"allFours",false],b:[242,171,.8,0,"kneel",true],caption:"A с мягкой опорой впереди, B располагается сзади"},
  analEdge:{env:"bed",a:[140,162,.87,0,"recline",false],b:[247,146,.88,0,"stand",true],caption:"A у края кровати, B рядом"},
  analKneel:{env:"bed",a:[154,163,.88,0,"allFours",false],b:[242,170,.81,0,"kneel",true],caption:"A на коленях с опорой, B сзади"},
  analProne:{env:"bed",a:[151,171,.9,0,"lie",false],b:[237,165,.79,0,"kneel",true],caption:"A лежит на животе, B располагается сзади"},
  analStand:{env:"wall",a:[157,144,.88,0,"stand",false],b:[211,147,.88,0,"stand",false],caption:"Оба стоят в одном направлении у опоры"},
  analLean:{env:"sofa",a:[154,161,.87,0,"allFours",false],b:[246,145,.88,0,"stand",true],caption:"A опирается на диван, B сзади"},
  analCurl:{env:"bed",a:[164,157,.9,0,"curl",false],b:[196,184,.88,0,"curl",false],caption:"Оба на боку с согнутыми ногами"},
  analSeat:{env:"sofa",a:[148,153,.84,0,"sit",false],b:[203,158,.8,0,"sit",false],caption:"Оба сидят близко в одном направлении с опорой"},
  analSupport:{env:"support",a:[148,160,.84,0,"recline",false],b:[235,168,.8,0,"kneel",true],caption:"A использует низкую устойчивую опору, B рядом"}
};

function mannequinIllustration(scene,color){
  const s=sceneLayouts[scene]||sceneLayouts.face;
  const [ax,ay,as,ar,ap,af]=s.a;
  const [bx,by,bs,br,bp,bf]=s.b;
  return '<svg viewBox="0 0 360 280" role="img" aria-label="'+s.caption+'">'+
    '<defs><filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="5" stdDeviation="5" flood-opacity=".25"/></filter></defs>'+
    '<rect x="8" y="8" width="344" height="264" rx="24" fill="#17101f"/>'+
    roomObject(s.env)+
    '<g filter="url(#softShadow)">'+
      mannequin(ax,ay,as,ar,ap,af,color,"A")+
      mannequin(bx,by,bs,br,bp,bf,"#f0e8f6","B")+
    '</g>'+
    '<g transform="translate(180 255)"><rect x="-150" y="-15" width="300" height="24" rx="12" fill="rgba(0,0,0,.52)"/><text x="0" y="2" text-anchor="middle" font-size="11.5" font-weight="700" fill="#eee6f4">'+s.caption+'</text></g>'+
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
  poseIllustration.innerHTML=mannequinIllustration(pose.scene,meta.color);
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
