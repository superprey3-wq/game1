const categories = [
  { id:"vaginal", label:"Обычный", badge:"Обычный секс", color:"#ff5c8a" },
  { id:"oral", label:"Оральный", badge:"Оральный", color:"#9b6dff" },
  { id:"anal", label:"Анальный", badge:"Анальный", color:"#ff9b5c" }
];


function siteSlug(name){
  return name.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g,"")
    .replace(/&/g," and ")
    .replace(/['’]/g,"-")
    .replace(/[^a-z0-9]+/g,"-")
    .replace(/^-+|-+$/g,"")
    .replace(/-+/g,"-");
}
const SOURCE_BASE="https://educacionsexual.org/en/sex-positions/";

const ordinaryGroups=[["Advanced Edge Doggy Style",["Doggy style on the edge with hand support","Doggy style on the edge with elbow support","Doggy style on the edge with knee support"]],["Amazon on the chair",["Reverse Cowgirl","Cowgirl with arm support","Amazon with legs raised"]],["Amazona on the table",["Reverse Cowgirl","Amazona with support","Amazona with rotation"]],["Apex",["Tilted Peak","Seated Peak","Supported Peak"]],["Ark of Love",["Leaning Love Ark","Love Ark with Support","Arca de Amor Rotada"]],["Asian Cowgirl",["Asian Cowgirl Leaning","Asian Cowgirl with Hand Support","Asian Cowgirl with Legs Open"]],["Astrologer",["Astrologer with chair support","Astrologer with wall support","Astrologer with table support"]],["Athlete's Hold",["Athlete's Seated Grip","Athlete's Supported Grip","Athlete's Leaning Hold"]],["Back Delights",["Elevated Rear Delights","Rear Delights with Hand Support","Back Delights with Bent Legs"]],["Back Door",["Raised Rear Entry","Doggy Style with Legs Spread","Backdoor with Rotation"]],["Backrest",["Rear Support with Inclination","Posterior Support with Circular Movements","Posterior Support with Manual Stimulation"]],["Backstroke",["Doggy Style with a Twist","Seated Doggy Style","Rear Entry with Support"]],["Balcony of Sighs",["Balcony of Sighs Seated","Balcony of Sighs Leaning","Balcony of Sighs Lying Down"]],["Bear Hug",["Bear Hug with Inclination","Bear Hug with Rotation","Bear Hug with Arm Support"]],["Bermuda Triangle",["Classic Variant","Tilted Variant","Elevated Variant"]],["Blazing Embrace",["Fiery Embrace with Inclination","Fiery Embrace with Lateral Support","Fiery Embrace with Hand Support"]],["Boat",["Deep Boat","Side Car","Reversed Cowgirl"]],["Breeze",["Brisa Acostada","Seated Breeze","Supported Breeze"]],["Bright Moon",["Tilted Bright Moon","Bright Elevated Moon","Rotating Bright Moon"]],["Burning Desire",["Classic Burning Desire","Deep Burning Desire"]],["Butterfly Hug",["Butterfly Hug with Elevation","Butterfly Hug with Circular Movements","Butterfly Hug with Knee Support"]],["Canadian Mountain",["Canadian Mountain with Elevation","Canadian Mountain with Arm Support","Canadian Mountain with Legs Open"]],["Captivity",["Deep Captivity","Lateral Captivity","Captivity with Support"]],["Clamshell",["Concha Abrazada Elevada","Conque Embrassée Latérale","Concha Abrazada avec Soutien"]],["Classic Embrace Position",["Classic Hug with Elevation","Classic Hug with Rotation","Classic Hug with Arm Support"]],["Classic Harp",["Arpa Inclinada","Arpa Elevada","Rotating Harp"]],["Classical Dancer",["Classical Dancer with Support","Classical Dancer in Bed","Classical Dancer Against the Wall"]],["Clitoral Dragon",["Clitoral Dragon Elevated","Lateral Clitoral Dragon","Clitoral Dragon Sitting"]],["Close Breathing",["Closed Breathing with Circular Movements","Closed Breathing with Forward Lean","Closed-Leg Breathing with Legs Interlaced"]],["Corona",["Classic Crown","Elevated Crown","Supported Crown"]],["Cowboy",["Reverse Cowboy","Side Cowboy","Cowboy with Support"]],["Cowgirl",["Reverse Cowgirl","Side mount","Supported Ride"]],["Cowgirl Bent Over",["Classic Cowgirl Bent","Cowgirl Bent Kneeling","Reclined Cowgirl"]],["Crazy Monkey",["Crazy Monkey with Bed Support","Crazy Monkey with Wall Support","Crazy Monkey with Chair Support"]],["Crazy Train",["Crazy Elevated Train","Crazy Train Lateral","Crazy Train Seated"]],["Crimson Mount",["Inclined Crimson Mount","Crimson Supported Ride","Crimson Mount Sideways"]],["Crouching Tiger",["Crouching Tiger with Bent Legs","Crouching Tiger with Knee Support","Crouching Tiger with Circular Movements"]],["Deep Adoration",["Deep Adoration with Lean","Deep Adoration with Knee Support","Deep Adoration with Circular Movement"]],["Deep Drumming",["The Elevated Drumming","The Side Drum","The Deep Spotting"]],["Deep Ebony",["Deep Ebony with Bed Support","Deep Ebony with Sofa Support","Deep Ebony with Table Support"]],["Deep Ecstasy",["Elevated Ecstasy","Inclined Ecstasy","Rotary Ecstasy"]],["Deep Impalement",["Deep Penetration with Bed Support","Deep Thrusting in the Shower","Deep Thrusting with Circular Movements"]],["Deep Initiation",["Deep Initiation with Elbow Support","Deep Thrusting with Legs Apart","Deep Initiation with Lateral Inclination"]],["Deep Longing",["High Aspiration","Crossed Longing","Suspended Longing"]],["Deep prone",["Prona avec oreiller","Position allongée avec stimulation externe","Prona avec lubrifiant"]],["Deep Ride",["Classic Deep Ride","Deep Cowgirl with Legs Extended","Deep Ride with Hand Support"]],["Deeply Embracing",["Deeply Embracing with Legs Elevated","Deeply Embracing with Circular Movements","Deeply Embracing with Partner Support"]],["Depth",["Adjusted Depth","Dynamic Depth","Inclined Depth"]],["Diamond",["Inclined Diamond","Raised Diamond","Rotating Diamond"]],["Doggy on the edge",["Doggy style with knee support","Doggy style with hand support","Doggy style with elbow support"]],["Dolphin",["Dolphin with support","Inverted Dolphin","Dolphin with legs raised"]],["Ecstasy",["Reverse Ecstasy","Lateral Ecstasy","Seated Ecstasy"]],["Ecstasy Waterfall",["Gentle Waterfall","Dynamic Waterfall","Inverted waterfall"]],["Edge of the bed",["Mirror variant"]],["El Rodeo",["Cowgirl with legs raised","Cowboy with arm support","Rodeo with circular movements"]],["Embraced by the Moon",["Embraced in the Moon with circular movement","Embraced in the Moon with leg support","Embraced in the Moon with forward lean"]],["Entangled Spoon",["Leaning Spooning","Spoon Elevated","Crossed Spooning"]],["Explorer",["Seated Explorer","Supported Explorer","Supported Side Foot Explorer"]],["Explosion of Pleasure",["Soft Explosion","Elevated Explosion","Sideways Explosion"]],["Face on pillow",["Face down on pillow with bent legs","Face on pillow with manual stimulation","Face down on pillow with rotation"]],["Fallen Warrior",["Receiving Warrior with Elevation","Fallen Warrior with Wall Support","Fallen Warrior with Circular Movements"]],["Female Plow",["Inclined Cowgirl","Rotating Grind","Supported Cowgirl"]],["Fire Hydrant",["Elevated Fire Fountain","Fire Fountain Manual","Side Fire Source"]],["Fireman",["Firefighter with wall support","Firefighter with support on a chair","Firefighter with floor support"]],["Flame",["Seated Blaze","Supported Burpee","Leaning Burst"]],["Forbidden Fruit",["Forbidden Fruit Classic","Forbidden Fruit Elevated","Forbidden Fruit Sideways"]],["Frog Position",["Elevated Frog","Frog with Support","Sleeping Frog"]],["Frog Style",["Frog Leaning Style","Frog Elevated Style","Frog Spin Style"]],["G Force",["Wall support","Support on a chair","Floor support"]],["Goddess Pose",["The Bent-Over Goddess","The Spinning Goddess","The Elevated Goddess"]],["Grasshopper",["Elevated Grasshopper","Crossed Grasshopper","Inverted Grasshopper"]],["Harmonious Penetration",["Harmonious Penetration with Hand Support","Harmonious Penetration with Elbow Support","Harmonious Penetration with Back Support"]],["Heart Link",["Deep Heart Link","Swinging Heart Link","Inclined Heart Link"]],["Heaven on Your Feet",["The Leaning Sky","Heaven with Support","The Rotating Sky"]],["Hill",["Deep Hill","Colina Suspensa","Inclined Hill"]],["Hip Swing",["Inverted pendulum","Circular pendulum"]],["Honeymoon",["Honeymoon Elevated","Wedding Night Incline","Seated Honey Moon"]],["Hummingbird",["Hummingbird with lateral support","Inverted Hummingbird","Hummingbird with hand support"]],["Ice Cream Sitting",["Seated Ice Cream with Inclination","Seated Ice Cream with Circular Movements","Ice Sitting with Hand Support"]],["Impaler",["Inverted Pounding","Side Spooning","Supported pegger"]],["Interlaced Leaves",["Crossed Legs Top","Crossed Sideways Leaves","Inverted Crossed Legs"]],["Interlaced Ride",["Reverse Cowgirl","Side mount","Suspended Mount"]],["Intimate Arch",["Deep Arch","Arch with Support","Circular Arch"]],["Intimate Link",["Intimate Link with Legs Open","Intimate Leg Crossed Link","Intimate Link with Knee Support"]],["Intimate Spooning",["Spoon with clitoral massage"]],["Intimate Style",["Intimate Style with Support","Intimate Style Against the Wall","Intimate Style in the Water"]],["Iron Throne",["Iron Throne with knee support","Iron Throne with Arm Support","Iron Throne with Wall Support"]],["Kneeling face to face",["Face to face with support","Face to face with legs intertwined","Face to face with mutual stimulation"]],["Love Basket",["Elevated Love Basket","Side Love Basket","Love Basket with Support"]],["Love Mechanics",["Classic Love Mechanics","Mechanics of Inclined Love","Rotative Love Mechanics"]],["Love Prison",["Prison of Love Elevated","Prison of Love with Support","Inverted Love Prison"]],["Low doggy",["Doggy style with support on elbows","Doggy style with a pillow under the hips","Doggy style with support on hands and knees"]],["Magic Carpet",["Elevated Magic Carpet","Magic Carpet Sides","Magic Carpet with Bent Legs"]],["Mature Lady",["Elevated Mature Lady","Mature Woman with Arm Support","Mature Woman with Bent Legs"]],["Mexican Style",["Mexican Style with Circular Movements","Mexican Style with Leg Support","Mexican Style with Manual Stimulation"]],["Midnight Moon",["Midnight Incline Moon","Midnight Moon Seated","Midnight Moon Supported"]],["Mirror",["Mirror on the Bed","Shower Mirror","Mirror on the Sofa"]],["Mixed Spoon",["Inverted mixed spoon","Spoon with kisses"]],["Mountain Creek",["Mountain Stream with Bed Support","Mountain Stream with Sofa Support","Mountain Stream with Wall Support"]],["Mounted Rider",["Cowgirl Elevated","Kneeling Cowgirl","Supported Standing Rider"]],["Moving Mountain",["Mountain with support","Spinning Mountain","Mountain with intertwined legs"]],["Narcissus",["Narcissus with lateral support","Narcissus with entwined legs","Narcissus with chair support"]],["Navigator",["Side-by-Side Rider","Supported Rider","Rotative Rider"]],["Need for Speed",["Fast and Furious in Bed","Couch Crazy Speed","Furious Speed Against the Wall"]],["On a Chair (Straddling)",["Face to face","From behind"]],["On the Sofa",["Leaning on the backrest","About the armrest"]],["On the Table",["Seated face to face","Lying down with legs up"]],["Passionate Dancer",["Passionate Dancer with Inclination","Passionate Dancer with Circular Movements","Passionate Dancer with Bed Support"]],["Passionate Explorer",["Passionate Explorer with Inclination","Passionate Explorer with Rotation","Passionate Explorer with Leg Support"]],["Pleasure Bench",["Inverted Bench","Side bench","Elevated bench"]],["Pleasure Wall",["Pleasure wall with lateral support","Pleasure wall with chair support","Pleasure wall with front wall support"]],["Posterior Relaxation",["Posterior Relaxation with Inclination","Posterior Relaxation with Leg Support","Posterior Relaxation with Circular Movements"]],["Praying Mantis",["Hanging Mantis","Leaning Mantis","Mantis Rotada"]],["Princess Elevated",["Princess Elevated with Knee Support","Princess Elevated with Legs Stretched","Princess Elevated with Ankle Support"]],["Prison Guard",["Prison Warden with lateral support","Prison Warden with wall support","Prison Guard with floor support"]],["Punishment",["Elevated Punishment","Bent-Over Punishment","Seated Punishment"]],["Slow Dance",["Slow Dance with Support","Slow Dance Against the Wall","Slow Dance on the Floor"]],["Snake",["Lying Down Snake","Standing Serpent","Snake with Support"]],["Snow angel",["Snow angel with legs raised","Snow angel with knee support","Snow angel with circular motion"]],["Snow Glide",["Elevated Snow Drift","Side Snow Glide","Snow Sitting Slide"]],["Soft Landing",["Soft Landing with Inclination","Soft Landing with Arm Support","Soft Landing with Rotation"]],["Spanish Guitar",["Spanish Guitar with Circular Movements","Spanish Guitar Tilted","Spanish Guitar with Wall Support"]],["Speed Bump",["Quick Dip with Inclination","Quickie with Knee Support","Quick Bumps with Circular Movements"]],["Sphinx",["Inverted Sphinx","Side Sphinx","Sphinx with Arm Support"]],["Spider Monkey",["Spider Monkey with Bed Support","Spider Monkey with Chair Support","Spider Monkey with Wall Support"]],["Spread Eagle",["Spread Eagle with Elevation","Spread Eagle Side","Spread Eagle with Rotation"]],["Standing against the wall, leg raised",["Leg over shoulder","Sitting on the edge of a table","Support on a chair"]],["Standing Face to Face",["With elevated leg","Against the wall"]],["Standing from Behind",["Leaning over the table","Against the wall"]],["Starfish",["Starfish with hand support","Starfish with forearm support","Starfish with support on the elbows"]],["Strength",["Classic Strength","Flexed Strength","Elevated Strength"]],["Submissive",["Elevated Receiver","Receptive with Back Support","Submissive with Legs Open"]],["Superwoman",["Superwoman with support on the bed","Superwoman with support on a chair","Superwoman with hands supporting"]],["Surfboard",["Elevated Surfboard","Side Surfing Board","Reverse Cowgirl"]],["Tangle",["Entanglement with pillow support","Tangled with bent legs","Up against the wall"]]];
const oralGroups=[["Anilingus (Rim Job)",["On all fours","Lying down with legs up"]],["Frog position oral",["Oral in frog position with legs open","Frog position oral with pillows","Frog position oral with eye contact"]],["Hot Lunch",["Spicy Lunch with Superficial Penetration","Spicy Lunch with Manual Stimulation","Spicy Lunch with Oral Sex"]],["Mouth between thighs",["Mouth between thighs in the side position","Mouth between thighs with legs open","Mouth between thighs with pillow support"]],["Oral in the shower",["Oral in the shower with support","Oral in the shower standing up"]],["Oral Sex on the Penis (Fellatio)",["On your knees","Lying on your side"]],["Oral Sex on the Vulva (Cunnilingus)",["Sitting on the edge","Top position (sitting on the face)","Lying down with legs on shoulders"]],["Oral standing with the other kneeling",["Standing oral with wall support","Oral standing with legs apart","Oral standing with hands free"]],["Oral with hip holding",["Oral with legs elevated","Oral with manual stimulation","Oral with rhythm change"]],["Pleasure Servant",["Classic Pleasure Servant","Servant of Inverted Pleasure","Reclining Pleasure Servant"]],["Pleasure Star",["Oral pleasure star","Manual pleasure star","Mixed pleasure star"]],["Snake Charmer",["Classic Variant","Oral Variant","Manual Stimulation Variant"]],["Surprise Blow",["Reverse Surprise Blow","Side Surprise Blow","Elevated Surprise Hit"]],["Sweet Pillow",["Reversed Sweetness Pillow","Sweet Side Pillow","High Sweetness Pad"]],["The 69",["69 from the side","69 superior"]],["The Gallows",["The Leaning Gallows","The Reverse Cowgirl","The Seated Gallows"]],["The Sigh",["The Deep Sigh","The Lateral Sigh","The Elevated Sigh"]],["The Whispering Garden II",["The Garden of Deep Whispers","The Whispering Garden with Tension","Le Jardin des Chuchotements Inversé"]],["The Whisper of the Garden",["The Whispering Garden","La Danza del Té","The Garden Embrace"]],["69 classic lying down",["69 in the shower","69 with a mirror"]],["69 in the Chair",["Variant 1: With arm support","Variant 2: With leg support","Variant 3: With pillow support"]],["69 lateral",["69 inverted sideways","69 lateral with legs entwined","69 lateral with pillow support"]],["69 standing leaning against the wall",["69 in bed","69 on the floor","69 in the shower"]],["Love Mechanics",["Classic Love Mechanics","Mechanics of Inclined Love","Rotative Love Mechanics"]],["The Deep Caress",["The Seated Caress","The Lying Caress","The Foot Caress"]]];
const analGroups=[["The Whispering Whirlpool",["The Vertical Whirlpool","The Whirlwind in Bed","The Pillow Whirlpool"]],["The Burning Skeleton Dance",["The Burning Spiral","The Bone Hug","The Bone Caress"]],["The Dance of Venus",["The Flight of Aphrodite","The Dance of Pleasure","The Sacred Movement"]],["The Rose Garden",["The Deep Rose Garden","The Hanging Rose","The Vertical Rose"]],["The Whispering Flying Squirrel",["The Inverted Flying Squirrel","The Sleeping Flying Squirrel","The Flying Squirrel on the Wall"]],["The Waterfall of Sighs",["The Whispering Waterfall","The Vertical Waterfall","The Rhythmic Waterfall"]],["The Whispered Dream",["Deep Sleep","The Whispered Dream in Bed","The Whispered Dream with Movement"]],["The Venus Spiral",["The Inverted Spiral","The Sensual Whirlpool","Le Tornado de Plaisir"]],["The Butterfly Flight",["The Flight of the Open Wings","Flight in the Dark","The Whispered Flight"]],["The Whispering Pendulum",["The Afrodite Swing","The Pleasure Swing","The Deep Whisper"]],["The Whispering Spiral V",["The Whispering Spiral in Bed","The Whisper Spiral with Chair","The Whisper Spiral Standing Up"]],["The Polar Hug",["The Inclined Polar Hug","The Polar Bear Hug with Support","The Rotating Polar Hug"]],["The Hummingbird Flight III",["The Hummingbird Flight with Inclination","The Hummingbird Flight with Caressing","The Hummingbird's Flight in Bed"]],["The Night Whisper",["The Deep Flight","The Moon Dance","The Night Kiss"]],["The Coffee Dance: Backstage Whisper",["The Coffee Sigh","The Coffee Kiss","The Coffee Dance"]],["The Whisper Dance",["The Silver Spiral","The Swan's Flight","The Posterior Caress"]],["The Rhythm Lady",["The Inverted Rhythm Lady","The High Beat Lady","The Sensual Rhythm Lady"]],["The Chair of Pleasure",["The Inclined Chair","The Spinning Chair","The Suspended Chair"]],["The Hummingbird Dance",["The Flight of the Falcon","Le Bal des Plumes","The Caress of the Wind"]],["Advanced Edge Doggy Style",["Doggy style on the edge with hand support","Doggy style on the edge with elbow support","Doggy style on the edge with knee support"]],["The Wild Horse",["Forward-Leaning Variant"]],["Cuddled Bloodhound",["Elevated Spooning","Spooning Lateral","Chien en cuillère inversé"]],["The Staircase",["The Low Staircase","The High Staircase","The Side Ladder"]],["The Mason's Workshop",["The Elevated Mason","The Relaxed Mason","The Inverted Bricklayer"]],["Seated Fairy",["Seated Fairy with Legs Crossed","Fairy Sitting with Hand Support","Fairy Squatting with Legs Apart"]],["The Airplane",["The Tilted Airplane","The Airplane with Support","The Rotating Plane"]],["The Phoenix Embrace",["The Elevated Phoenix Hug","The Embrace of the Inclined Phoenix","The Phoenix Turned Embrace"]],["The Dive",["Deep Penetration","Side Entry","The Inverted Dive"]],["Crazy Train",["Crazy Elevated Train","Crazy Train Lateral","Crazy Train Seated"]],["Doggy on the edge",["Doggy style with knee support","Doggy style with hand support","Doggy style with elbow support"]]];

function makePool(category,groups){
  let n=0;
  return groups.flatMap(([baseTitle,variants])=>{
    const url=SOURCE_BASE+siteSlug(baseTitle)+"/";
    const baseEntry={
      id:category+"-"+(n++),
      title:baseTitle,
      description:"Реальная отдельная позиция из энциклопедии. На странице источника есть иллюстрация, положение тел, пошаговое объяснение и советы.",
      difficulty:"на странице",
      setting:"реальная позиция",
      scene:category==="oral"?"oralLie":category==="anal"?"analSide":"face",
      note:"Название взято из каталога educacionsexual.org — это не искусственно созданная вариация.",
      source:{name:baseTitle,url}
    };
    const variationEntries=(variants||[]).map(v=>({
      id:category+"-"+(n++),
      title:baseTitle+" — "+v,
      description:"Реальная вариация позиции «"+baseTitle+"». Ссылка открывает страницу базовой позиции, где эта вариация перечислена и объясняется.",
      difficulty:"на странице",
      setting:"реальная вариация",
      scene:category==="oral"?"oralLie":category==="anal"?"analSide":"face",
      note:"Эта вариация указана в каталоге источника.",
      source:{name:baseTitle+" · "+v,url}
    }));
    return [baseEntry,...variationEntries];
  });
}

const pools={
  vaginal:makePool("vaginal",ordinaryGroups),
  oral:makePool("oral",oralGroups),
  anal:makePool("anal",analGroups)
};

function sourcePreview(pose,meta){
  return '<a class="catalog-preview" href="'+pose.source.url+'" target="_blank" rel="noopener noreferrer">'+
    '<span class="catalog-preview-icon">↗</span>'+
    '<span class="catalog-preview-kicker">Иллюстрация и пошаговая инструкция на источнике</span>'+
    '<strong>'+escapeHtml(pose.title)+'</strong>'+
    '<span class="catalog-preview-domain">educacionsexual.org</span>'+
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
const sourceName=document.getElementById("sourceName");
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
  sourceName.textContent=pose.source.name;
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
