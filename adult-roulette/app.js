const categories = [
  { id:"vaginal", label:"Обычный", badge:"Обычный секс", color:"#ff5c8a" },
  { id:"oral", label:"Оральный", badge:"Оральный", color:"#9b6dff" },
  { id:"anal", label:"Анальный", badge:"Анальный", color:"#ff9b5c" }
];



const CF_BASE="https://www.christianfriendlysexpositions.com/";
const CF_CATALOG=CF_BASE+"table-of-contents/";
const ANAL_CATALOG="https://sexpositions.guru/en/type/possible";

const ordinaryNames=["Ace","Adapted Missionary","Amazon 2","Amazon","Ape","April Fool's Paradise","Are Those Colored Contacts?","Armrest Yes!","Ascent to Desire","Assist","Backseat Driver","Backwards Slide","Bad Santa","Banana Pancakes","Banana Split","Bandoleer","Barcalounger","Basket","Beep Beep","Ben Dover","Bent Spoon","Best View","Betty Rocker","Bicycle","Big L","Bounce","Bouncing Spoon","Bridge","Bringing Up the Rear","Butterfly","Camel Style 1","Camel Style","Can You Feel Me Now?","Candle","CAT","Challenge","Chimney Sweep","Circle Driver","Clapper","Clasp","Clip","Close-up","Column","Comfy","Corner Cowgirl","Couchtastic","Cowboy","Cowgirl","Cowgirl Squeeze","Crisscross","Crossed Keys","Crouching Tiger","Curled Angel","Dancer","Dart","Deckchair","Deep Victory","Delight","Divine Lift","Doggy on the Bench","Doggy on the Couch","Doggy Style","Dolphin","Double Decker","Down Low","Dr. Scholl's Day Off","Dragonfly","Dublin Shuffle","Eagle","Easy Rider","Edge of His Seat","Edgy","Edward Scissorlegs","Erotic V","Exposed Eagle","Extension Cord","Fan","Fantastic Rocking Horse","Fast and Furious","Fast Romp","Flatiron","Foot In Mouth","Frame Job","Frog","Froggy Style","From Behind","Fulcrum Lift","Fullback","Funky Monkey","G-Force","Gallery","Gettin' Jiggy With It","Glowing Juniper","Glowing Triangle","Grinder","Grinding the Corn","Grip","Harp","Heart to Heart","Her High Plane","Hero","High Rise","High-Ridin' Cowboy","Hind-quarterly Review","Hinge","Hobbyhorse","Hooked On You","Hound","Hula Bula","I'll Be Back","Ice Cream","Ice Sculpture","Indian Headstand","Indrani","Inverted Spoon","Jockey","Jugghead","Kneel","Laid Back","Laid-Back Reverse Cowgirl","Lamaze Coach","Lap Dance","Lap Top","Layover","Lazy Cowgirl","Lazy Love Seat","Lazy Wheelbarrow","Leap Frog","Leg Slider","Let's Dance","Locked Cowgirl","Long Goodbye","Lotus Blossom","Lovely","Lunge","Lustful Cobra","Magic Mountain","Man On Fire","Mastery","Mating Press","Meet N' Greet","Mermaid","Missionary","Night Crawler","Nirvana","No Elbows On the Table","Octopus","Oh, My!","Open Sesame","Otto-Man","Over Easy","Packing the Suitcase","Padlock","Pedal","Pedestal","Peg","Perch","Perpen-Dic-Ular","Pilates Class","Pink Flamingo","Plinth","Plow 2","Plow","Prime Time","Prone Bone","Prone Tiger","Proposal","Reach for the Stars","Rear-Ender","Reclining Lotus","Reverse Cowgirl Rocker","Reverse Cowgirl","Reverse Grinding the Corn 2","Reverse Grinding the Corn","Reverse Missionary","Right Angle 2","Right Angle","Rocket Sled","Rodeo","Rowing Boat","Sandwich","Seated Ball","Seduction","See-Saw","Ship","Shoulder Holder","Shoulder Stand","Sidekick","Sideways Champion","Sledge","Slide","Slip","Smooth Operator","Snail","Sofa Press","Sofa Surprise","Sphinx","Spider","Splitting Bamboo","Splitting Queen","Spoon","Squashing the Deckchair","Squat Balance","Stair Master","Stand and Deliver","Standing Froggy","Standing Missionary","Standing Ovation","Star","Stargazer","Straight Back","Super 8","Super Missionary","Suspended Congress","Swing Fling","Take Flight","Take Me Now","Thigh Master","Tight Missionary","Toad","Tominagi","Trampoline","Triumph Arch","Turtle","Twisted Mrs.","Very Happy Valentine's Day","Waterfall","When In Doubt","Whisper","X","X-Rated"];
const oralNames=["68 Hers","68 His","69 Edge of the Bed","69 Inverted","69","69 Sideways","69 Yin-Yang","All Yours","Atten-hut","Blazing Saddles","Breakfast At Tiffany's","Bridge 2","Butler","Cinema Stroke","Couch Potato","Divine Incline","Drive-thru","Ear Muffs","Eleven O'Clock","Eve's Ecstasy","Evolved Oral","Feast","Feedbag","Fire Hydrant","Forbidden Fruit","Game's On","Headrest","Hot Seat","In Her Face","Jack Hammer","Licking the Flag Pole","Oral Therapy","Pie in the Sky","Pleasure Garden 69","Plumber","Riding the North Face","Riding the South Face","San Francisco Treat","Scarf","Sitin' On the Edge","Slide On Down","Southern Exposure","Spread Eagle","Suplex - Her","Suplex - His","Throat Swab","Thrustastic","Under the Cuckoo's Nest","Under the Hood","Under the Sink","Usual Blowjob"];
const analEntries=[["Clapper","https://sexpositions.guru/en/positions/clapper-4"],["Straddle","https://sexpositions.guru/en/positions/straddle-6"],["Candle","https://sexpositions.guru/en/positions/candle-7"],["Boat","https://sexpositions.guru/en/positions/boat-8"],["Spooning","https://sexpositions.guru/en/positions/spooning-13"],["Swing","https://sexpositions.guru/en/positions/swing-15"],["Basset Hound","https://sexpositions.guru/en/positions/basset-hound-17"],["Waterfall","https://sexpositions.guru/en/positions/waterfall-18"],["Sprout","https://sexpositions.guru/en/positions/sprout-19"],["Wall","https://sexpositions.guru/en/positions/wall-20"],["Binding","https://sexpositions.guru/en/positions/binding-26"],["Rider","https://sexpositions.guru/en/positions/rider-27"],["Ape","https://sexpositions.guru/en/positions/ape-28"],["Backshot","https://sexpositions.guru/en/positions/backshot-30"],["Ecstasy","https://sexpositions.guru/en/positions/ecstasy-32"],["Hook","https://sexpositions.guru/en/positions/hook-33"],["Cancer","https://sexpositions.guru/en/positions/cancer-34"],["Bizet","https://sexpositions.guru/en/positions/bizet-39"],["Nun","https://sexpositions.guru/en/positions/nun-41"],["Submissive","https://sexpositions.guru/en/positions/submissive-43"],["Sagittarius","https://sexpositions.guru/en/positions/sagittarius-46"],["Magic Mountain","https://sexpositions.guru/en/positions/magic-mountain-47"],["Crème Brûlée","https://sexpositions.guru/en/positions/creme-brulee-52"],["Precipice","https://sexpositions.guru/en/positions/precipice-53"]];

const cfSlugOverrides={
  "Backseat Driver":"back-seat-driver",
  "Headrest":"head-rest"
};

function cfSlug(name){
  if(cfSlugOverrides[name])return cfSlugOverrides[name];
  return name.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g,"")
    .replace(/[’']/g,"")
    .replace(/&/g," and ")
    .replace(/[^a-z0-9]+/g,"-")
    .replace(/^-+|-+$/g,"")
    .replace(/-+/g,"-");
}

function makeCfPool(category,names){
  return names.map((title,i)=>({
    id:category+"-"+i,
    title,
    description:category==="oral"
      ?"Оральная позиция для пары мужчина + женщина. На странице источника есть иллюстрация и пошаговое описание расположения партнёров."
      :"Позиция для пары мужчина + женщина. На странице источника есть иллюстрация и пошаговое описание того, как расположиться.",
    difficulty:"на странице",
    setting:"мужчина + женщина",
    scene:category==="oral"?"oralLie":"face",
    note:"В эту категорию добавлены позиции из каталога, который описывает партнёров как мужа и жену.",
    source:{
      name:title,
      url:CF_BASE+cfSlug(title)+"/",
      domain:"christianfriendlysexpositions.com"
    },
    fallback:CF_CATALOG
  }));
}

function makeAnalPool(){
  return analEntries.map(([title,url],i)=>({
    id:"anal-"+i,
    title,
    description:"Позиция из straight-каталога, отмеченная источником как допускающая анальный вариант. Страница содержит схему и пошаговое описание.",
    difficulty:"на странице",
    setting:"мужчина + женщина",
    scene:"analSide",
    note:"Для анальной категории выбраны только проверенные страницы, совместимые со straight-парой.",
    source:{name:title,url,domain:"sexpositions.guru"},
    fallback:ANAL_CATALOG
  }));
}

const pools={
  vaginal:makeCfPool("vaginal",ordinaryNames),
  oral:makeCfPool("oral",oralNames),
  anal:makeAnalPool()
};

function sourcePreview(pose,meta){
  return '<a class="catalog-preview" href="'+pose.source.url+'" target="_blank" rel="noopener noreferrer">'+
    '<span class="catalog-preview-icon">↗</span>'+
    '<span class="catalog-preview-kicker">Иллюстрация и пошаговая инструкция</span>'+
    '<strong>'+escapeHtml(pose.title)+'</strong>'+
    '<span class="catalog-preview-domain">'+escapeHtml(pose.source.domain)+'</span>'+
  '</a>';
}

const wheel=document.getElementById("wheel");
const wheelResult=document.getElementById("wheelResult");
const spinBtn=document.getElementById("spinBtn");
const copyLinkBtn=document.getElementById("copyLinkBtn");
const copyStatus=document.getElementById("copyStatus");
const resultCard=document.getElementById("resultCard");
const categoryTitle=document.getElementById("categoryTitle");
const categoryBadge=document.getElementById("categoryBadge");
const poseTitle=document.getElementById("poseTitle");
const poseDescription=document.getElementById("poseDescription");
const difficultyTag=document.getElementById("difficultyTag");
const settingTag=document.getElementById("settingTag");
const poseTip=document.getElementById("poseTip");
const sourceLink=document.getElementById("sourceLink");
const sourceName=document.getElementById("sourceName");\nconst sourceFallback=document.getElementById("sourceFallback");
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
  if(length<=1)return 0;
  if(window.crypto?.getRandomValues){
    const max=0x100000000;
    const limit=max-(max%length);
    const arr=new Uint32Array(1);
    do{crypto.getRandomValues(arr)}while(arr[0]>=limit);
    return arr[0]%length;
  }
  return Math.floor(Math.random()*length);
}

function shuffledCopy(arr){
  const copy=[...arr];
  for(let i=copy.length-1;i>0;i--){
    const j=randomIndex(i+1);
    [copy[i],copy[j]]=[copy[j],copy[i]];
  }
  return copy;
}

let categoryBag=[];
let lastCategoryId=null;
const poseBags={vaginal:[],oral:[],anal:[]};
const lastPoseId={vaginal:null,oral:null,anal:null};

function refillCategoryBag(){
  categoryBag=shuffledCopy(categories);
  if(lastCategoryId && categoryBag.length>1 && categoryBag[0].id===lastCategoryId){
    const swapIndex=1+randomIndex(categoryBag.length-1);
    [categoryBag[0],categoryBag[swapIndex]]=[categoryBag[swapIndex],categoryBag[0]];
  }
}

function nextCategory(){
  if(categoryBag.length===0)refillCategoryBag();
  const chosen=categoryBag.shift();
  lastCategoryId=chosen.id;
  return chosen;
}

function refillPoseBag(category){
  poseBags[category]=shuffledCopy(pools[category]);
  if(lastPoseId[category] && poseBags[category].length>1 && poseBags[category][0].id===lastPoseId[category]){
    const swapIndex=1+randomIndex(poseBags[category].length-1);
    [poseBags[category][0],poseBags[category][swapIndex]]=[poseBags[category][swapIndex],poseBags[category][0]];
  }
}

function nextPose(category){
  if(poseBags[category].length===0)refillPoseBag(category);
  const pose=poseBags[category].shift();
  lastPoseId[category]=pose.id;
  return pose;
}

const mannequinPoses = {
  stand:{head:[0,-66],shoulder:[0,-39],hip:[0,8],elbows:[[22,-12],[-20,-8]],hands:[[28,18],[-28,18]],knees:[[14,43],[-12,43]],feet:[[18,78],[-18,78]]},
  sit:{head:[0,-66],shoulder:[0,-39],hip:[0,8],elbows:[[23,-10],[-16,-8]],hands:[[32,13],[18,18]],knees:[[43,16],[36,29]],feet:[[43,62],[28,64]]},
  kneel:{head:[0,-66],shoulder:[0,-39],hip:[0,8],elbows:[[22,-8],[-18,-6]],hands:[[30,18],[20,18]],knees:[[27,40],[12,45]],feet:[[5,57],[-4,58]]},
  allFours:{head:[-54,-25],shoulder:[-32,-10],hip:[25,0],elbows:[[-36,22],[-18,22]],hands:[[-38,55],[-13,55]],knees:[[38,35],[24,38]],feet:[[56,55],[42,56]]},
  lie:{head:[-62,-10],shoulder:[-37,-4],hip:[15,2],elbows:[[-18,-25],[-10,16]],hands:[[12,-25],[18,18]],knees:[[50,8],[46,23]],feet:[[78,7],[73,29]]},
  recline:{head:[-42,-58],shoulder:[-28,-36],hip:[2,8],elbows:[[-8,-13],[-22,-5]],hands:[[17,5],[-5,13]],knees:[[43,25],[38,38]],feet:[[62,58],[52,62]]},
  curl:{head:[-58,-18],shoulder:[-35,-8],hip:[12,3],elbows:[[-20,-27],[-10,13]],hands:[[2,-18],[6,20]],knees:[[42,-8],[46,15]],feet:[[62,13],[62,30]]}
};

function solidFigure(x,y,scale,rotation,pose,flip,color,label){
  const p=mannequinPoses[pose]||mannequinPoses.stand;
  const sx=flip?-scale:scale;
  const limb=(a,b,w)=>'<path d="M '+a[0]+' '+a[1]+' L '+b[0]+' '+b[1]+'" stroke="'+color+'" stroke-width="'+w+'" stroke-linecap="round" stroke-linejoin="round"/>';
  const outline=(a,b,w)=>'<path d="M '+a[0]+' '+a[1]+' L '+b[0]+' '+b[1]+'" stroke="rgba(38,22,48,.45)" stroke-width="'+(w+5)+'" stroke-linecap="round" stroke-linejoin="round"/>';
  const torso='<path d="M '+(p.shoulder[0]-14)+' '+(p.shoulder[1]-3)+' Q '+p.shoulder[0]+' '+(p.shoulder[1]-12)+' '+(p.shoulder[0]+14)+' '+(p.shoulder[1]-3)+' L '+(p.hip[0]+12)+' '+(p.hip[1]+4)+' Q '+p.hip[0]+' '+(p.hip[1]+13)+' '+(p.hip[0]-12)+' '+(p.hip[1]+4)+' Z" fill="'+color+'" stroke="rgba(38,22,48,.45)" stroke-width="4"/>';
  const body=
    '<g transform="translate('+x+' '+y+') rotate('+rotation+') scale('+sx+' '+scale+')">'+
      outline(p.shoulder,p.elbows[0],15)+outline(p.elbows[0],p.hands[0],13)+
      outline(p.shoulder,p.elbows[1],15)+outline(p.elbows[1],p.hands[1],13)+
      outline(p.hip,p.knees[0],20)+outline(p.knees[0],p.feet[0],17)+
      outline(p.hip,p.knees[1],20)+outline(p.knees[1],p.feet[1],17)+
      limb(p.shoulder,p.elbows[0],15)+limb(p.elbows[0],p.hands[0],13)+
      limb(p.shoulder,p.elbows[1],15)+limb(p.elbows[1],p.hands[1],13)+
      limb(p.hip,p.knees[0],20)+limb(p.knees[0],p.feet[0],17)+
      limb(p.hip,p.knees[1],20)+limb(p.knees[1],p.feet[1],17)+
      torso+
      '<circle cx="'+p.head[0]+'" cy="'+p.head[1]+'" r="19" fill="'+color+'" stroke="rgba(38,22,48,.45)" stroke-width="4"/>'+
      '<circle cx="'+p.hands[0][0]+'" cy="'+p.hands[0][1]+'" r="7" fill="'+color+'"/>'+
      '<circle cx="'+p.hands[1][0]+'" cy="'+p.hands[1][1]+'" r="7" fill="'+color+'"/>'+
    '</g>';
  const lx=x+(flip?30:-30), ly=y-84*scale;
  return body+
    '<g transform="translate('+lx+' '+ly+')"><circle r="13" fill="#ffffff" stroke="'+color+'" stroke-width="3"/><text x="0" y="5" text-anchor="middle" font-size="13" font-weight="900" fill="#24182d">'+label+'</text></g>';
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
    '<rect x="8" y="8" width="344" height="264" rx="24" fill="#fffdf8"/><rect x="12" y="12" width="336" height="256" rx="20" fill="none" stroke="#eadfe8" stroke-width="2"/>'+
    roomObject(s.env)+
    '<g filter="url(#softShadow)">'+
      solidFigure(ax,ay,as,ar,ap,af,"#f4c542","A")+
      solidFigure(bx,by,bs,br,bp,bf,"#b01f63","B")+
    '</g>'+
    '<g transform="translate(180 255)"><rect x="-150" y="-15" width="300" height="24" rx="12" fill="rgba(255,255,255,.88)"/><text x="0" y="2" text-anchor="middle" font-size="11.5" font-weight="700" fill="#3d2a46">'+s.caption+'</text></g>'+
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
  difficultyTag.textContent="Подробности: "+pose.difficulty;
  settingTag.textContent="Каталог: "+pose.setting;
  poseTip.textContent=categoryTip(category)+" "+pose.note;
  poseIllustration.innerHTML=sourcePreview(pose,meta);
  sourceLink.href=pose.source.url;
  sourceName.textContent=pose.source.name;\n  sourceFallback.href=pose.fallback;\n  sourceFallback.textContent=category==="anal"?"Если прямая страница не открылась — открыть полный straight-каталог ↗":"Если прямая страница не открылась — открыть полный каталог М + Ж ↗";
  resultCard.classList.remove("hidden");
  addHistory(meta.badge,pose.title);
  setTimeout(()=>resultCard.scrollIntoView({behavior:"smooth",block:"nearest"}),70);
}
function spin(){
  if(spinning)return;
  spinning=true;
  spinBtn.classList.add("spinning");
  wheelResult.textContent="Крутим...";
  wheelResult.classList.add("rolling");

  const chosen=nextCategory();
  const idx=categories.findIndex(c=>c.id===chosen.id);

  // Секторы заданы conic-gradient от -60°:
  // обычный центр = 0°, оральный = 120°, анальный = 240°.
  // Стрелка стоит на 0° (сверху), поэтому выбранный центр
  // должен закончить вращение ровно под стрелкой.
  const center=idx*120;
  const target=(360-center)%360;
  const current=((rotation%360)+360)%360;
  const correction=(target-current+360)%360;
  rotation+=1440+correction;

  wheel.style.transform="rotate("+rotation+"deg)";

  window.setTimeout(()=>{
    wheelResult.textContent="Выпало: "+chosen.label;
    wheelResult.classList.remove("rolling");
    wheelResult.dataset.category=chosen.id;
    render(chosen.id,nextPose(chosen.id));
    spinning=false;
    spinBtn.classList.remove("spinning");
  },3150);
}
function rerollPose(){
  if(!currentCategory)return;
  render(currentCategory,nextPose(currentCategory));
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


async function copySiteLink(){
  const cleanUrl=window.location.origin+window.location.pathname;
  try{
    await navigator.clipboard.writeText(cleanUrl);
    copyStatus.textContent="Ссылка скопирована ✓";
    copyLinkBtn.textContent="Скопировано ✓";
  }catch{
    const area=document.createElement("textarea");
    area.value=cleanUrl;
    area.setAttribute("readonly","");
    area.style.position="fixed";
    area.style.opacity="0";
    document.body.appendChild(area);
    area.select();
    document.execCommand("copy");
    area.remove();
    copyStatus.textContent="Ссылка скопирована ✓";
    copyLinkBtn.textContent="Скопировано ✓";
  }
  window.setTimeout(()=>{
    copyStatus.textContent="";
    copyLinkBtn.textContent="Скопировать ссылку";
  },2200);
}

spinBtn.addEventListener("click",spin);
copyLinkBtn.addEventListener("click",copySiteLink);
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
