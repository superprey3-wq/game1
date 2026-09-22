const рекомендованныеЛинии={
"EXP-линия":["Aldous","Alice","Argus","Arlott","Benedetta","Chou","Cici","Dyrroth","Edith","Esmeralda","Freya","Guinevere","Lapu-Lapu","Lukas","Masha","Minsitthar","Paquito","Phoveus","Ruby","Silvanna","Sora","Sun","Terizla","Thamuz","Uranus","X.Borg","Yu Zhong","Zilong"],
"Лес":["Aamon","Alpha","Alucard","Aulus","Balmond","Bane","Barats","Baxia","Fanny","Fredrinn","Gusion","Hanzo","Harley","Hayabusa","Helcurt","Hirara","Joy","Julian","Karina","Lancelot","Leomord","Ling","Martis","Natalia","Nolan","Popol and Kupa","Roger","Saber","Suyou","Yi Sun-shin","Yin"],
"Мид":["Aurora","Cecilion","Chang'e","Cyclops","Eudora","Faramis","Gord","Kadita","Kagura","Kimmy","Lunox","Luo Yi","Lylia","Nana","Novaria","Odette","Pharsa","Selena","Vale","Valentina","Valir","Vexana","Xavier","Yve","Zetian","Zhask","Zhuxin"],
"Голд-линия":["Beatrix","Brody","Bruno","Claude","Clint","Granger","Hanabi","Harith","Irithel","Ixia","Karrie","Layla","Lesley","Melissa","Miya","Moskov","Natan","Obsidia","Wanwan"],
"Роум":["Akai","Angela","Atlas","Badang","Belerick","Carmilla","Chip","Diggie","Estes","Floryn","Franco","Gatotkaca","Gloo","Grock","Hilda","Hylos","Jawhead","Johnson","Kaja","Kalea","Khaleed","Khufra","Lolita","Marcel","Mathilda","Minotaur","Rafaela","Tigreal"]
};

const герои=[...new Set(Object.values(рекомендованныеЛинии).flat())].sort((a,b)=>a.localeCompare(b));
const линии=["EXP-линия","Лес","Мид","Голд-линия","Роум"];
const линииГероя=Object.fromEntries(герои.map(герой=>[
  герой,
  Object.keys(рекомендованныеЛинии).filter(линия=>рекомендованныеЛинии[линия].includes(герой))
]));

const сборки=[
  {name:"Стеклянная пушка",items:["Сапоги заклинателя","Священный кристалл","Божественный глеф","Кровавые крылья","Жезл гения","Зимняя корона"],note:"Максимум урона, минимум права на ошибку."},
  {name:"Крит-машина",items:["Быстрые сапоги","Берсеркерская ярость","Великий драконий меч","Когти Хааса","Рёв малефика","Ветер природы"],note:"Если критануло — ты гений. Если нет — так и было задумано."},
  {name:"Пулемёт",items:["Быстрые сапоги","Коса коррозии","Золотой посох","Меч охотника на демонов","Говорящий с ветром","Морской алебард"],note:"Скорость атаки важнее здравого смысла."},
  {name:"Бессмертный холодильник",items:["Прочные сапоги","Шлем стража","Античная кираса","Щит Афины","Бессмертие","Сияющая броня"],note:"Твоя задача — надоесть врагам раньше, чем они убьют тебя."},
  {name:"Вампир",items:["Магические сапоги","Боевой топор","Крылья королевы","Бесконечная битва","Оракул","Бессмертие"],note:"Чем дольше драка, тем веселее."},
  {name:"Спам навыками",items:["Магические сапоги","Зачарованный талисман","Молниеносный жезл","Жезл гения","Божественный глеф","Зимняя корона"],note:"Кнопки должны страдать вместе с тобой."},
  {name:"Гибридный боец",items:["Прочные сапоги","Боевой топор","Громовой пояс","Крылья королевы","Рёв малефика","Бессмертие"],note:"Немного урона, немного жира, много наглости."},
  {name:"Антихил-полиция",items:["Воинские сапоги","Морской алебард","Боевой топор","Рёв малефика","Крылья королевы","Бессмертие"],note:"Сегодня лечение запрещено."},
  {name:"Скорость и хаос",items:["Быстрые сапоги","Говорящий с ветром","Коса коррозии","Золотой посох","Ветер природы","Бессмертие"],note:"Главное правило — двигаться быстрее, чем думаешь."},
  {name:"Роумер-монстр",items:["Ботинки роумера","Господство льда","Античная кираса","Щит Афины","Бессмертие","Шлем стража"],note:"Ты не герой поддержки. Ты ходячая проблема."}
];

const общиеЗадания=[
  "До 5-й минуты нельзя умирать. Умер — задание провалено.",
  "После каждого убийства или ассиста отправь союзникам позитивный эмодзи.",
  "Сделай минимум 3 ассиста подряд, не забирая килл.",
  "Хотя бы один раз спаси союзника и сразу уйди, не продолжая драку.",
  "После первой смерти смени стиль игры: если агрессировал — играй осторожно, и наоборот.",
  "Выиграй одну драку, начав её с обхода через куст.",
  "Сломай хотя бы одну башню лично.",
  "Прими участие минимум в 60% убийств команды.",
  "Сделай серию из 3 убийств/ассистов без возвращения на базу.",
  "До конца матча ни разу не напиши токсичное сообщение.",
  "Хотя бы один раз отдай очевидный килл союзнику.",
  "После удачной командной драки сразу зови команду на объект, а не на ещё один килл."
];

const безумныеЗадания=[
  "Первые 7 минут нельзя пользоваться кнопкой Recall — возвращайся только ногами или после смерти.",
  "После каждого своего убийства ты обязан сменить линию или сторону карты.",
  "Выбери случайного союзника своим VIP и трижды спаси именно его.",
  "До 10-й минуты нельзя начинать драку первым. Только контратака.",
  "После каждой смерти вслух назови причину, почему это был «тактический ресет».",
  "Весь матч нельзя преследовать врага дальше следующего куста. Дисциплина прежде жадности.",
  "Первую большую командную драку сыграй максимально защитно, даже если герой убийца.",
  "Если сделаешь дабл-килл, следующую минуту обязан играть только на объекты."
];

const заданияПоЛиниям={
  "EXP-линия":[
    "Выиграй хотя бы одну честную дуэль 1 на 1 на EXP-линии.",
    "До 6-й минуты не проси помощи, а потом сам сделай успешную ротацию.",
    "После 8-й минуты первым из своей линии приди на важный командный объект."
  ],
  "Лес":[
    "Забери первого Turtle или участвуй в его убийстве.",
    "Сделай два успешных ганга на разные линии.",
    "Хотя бы один раз забери вражеский бафф и уйди живым."
  ],
  "Мид":[
    "После зачистки двух волн подряд обязательно сделай ротацию на боковую линию.",
    "Помоги обеим боковым линиям хотя бы по одному разу.",
    "До 8-й минуты сделай минимум два ассиста вне мида."
  ],
  "Голд-линия":[
    "До 5-й минуты не умирай и сохрани башню.",
    "Сломай первую башню на своей линии или участвуй в её разрушении.",
    "После получения двух основных предметов участвуй в каждой ближайшей командной драке."
  ],
  "Роум":[
    "Выбери одного союзника VIP и трижды спаси его за матч.",
    "Первые 5 минут не забирай ни одного лишнего крипа у союзников.",
    "Организуй минимум две успешные засады из кустов."
  ]
};

const $=id=>document.getElementById(id);
const случайный=массив=>массив[Math.floor(Math.random()*массив.length)];

let этап=1;
let состояние={hero:null,lane:null,build:null,task:null};
let последниеГерои=[];
let история=JSON.parse(localStorage.getItem("mlbbSequentialHistory")||"[]");

function доступныеГерои(){
  if(!$("noRepeat").checked) return герои;
  const безПовторов=герои.filter(герой=>!последниеГерои.includes(герой));
  return безПовторов.length ? безПовторов : герои;
}

function рекомендовано(герой){
  const arr=линииГероя[герой]||[];
  return arr.length ? arr.join(", ") : "любая линия";
}

function обновитьШаги(){
  document.querySelectorAll(".step").forEach(btn=>{
    const n=Number(btn.dataset.step);
    btn.classList.toggle("active",n===этап);
    btn.classList.toggle("done",n<этап);
    btn.classList.toggle("locked",n>этап);
  });
  $("stepHero").textContent=состояние.hero||"Крутим первым";
  $("stepLane").textContent=состояние.lane||"После героя";
  $("stepBuild").textContent=состояние.build?.name||"После линии";
  $("stepTask").textContent=состояние.task?"Готово":"Финал";
}

function обновитьКарточки(){
  $("heroResult").textContent=состояние.hero||"—";
  $("heroInfo").textContent=состояние.hero
    ? "Обычно играет: "+рекомендовано(состояние.hero)+". Но рулетка линии решит сама."
    : "Сначала выбери героя.";

  $("laneResult").textContent=состояние.lane||"—";
  $("laneInfo").textContent=состояние.lane
    ? (линииГероя[состояние.hero]?.includes(состояние.lane)
      ? "Нормальный вариант для этого героя. Повезло!"
      : "Опа. Это необычная линия для героя — именно поэтому у нас рулетка.")
    : "Откроется после героя.";

  $("buildResult").textContent=состояние.build?.name||"—";
  $("buildItems").textContent=состояние.build
    ? состояние.build.items.join(" → ")+"\n"+состояние.build.note
    : "Откроется после линии.";

  $("taskResult").textContent=состояние.task||"—";
  $("taskInfo").textContent=состояние.task
    ? "Задание действует на весь матч. Выполнил — моральная победа уже твоя."
    : "Откроется после сборки.";

  $("heroCard").classList.toggle("revealed",!!состояние.hero);
  $("laneCard").classList.toggle("revealed",!!состояние.lane);
  $("laneCard").classList.toggle("lockedCard",!состояние.lane);
  $("buildCard").classList.toggle("revealed",!!состояние.build);
  $("buildCard").classList.toggle("lockedCard",!состояние.build);
  $("taskCard").classList.toggle("revealed",!!состояние.task);
  $("taskCard").classList.toggle("lockedCard",!состояние.task);
}

function настроитьРулетку(){
  if(этап===1){
    $("rouletteLabel").textContent="ЭТАП 1 · ГЕРОЙ";
    $("rouletteValue").textContent=состояние.hero||"Кто сегодня страдает?";
    $("rouletteHint").textContent="Сначала случайно выбираем героя из всех доступных.";
    $("roll").textContent="🎰 Крутить героя";
    $("roll").disabled=false;
  }else if(этап===2){
    $("rouletteLabel").textContent="ЭТАП 2 · ЛИНИЯ";
    $("rouletteValue").textContent=состояние.lane||"Куда отправим "+состояние.hero+"?";
    $("rouletteHint").textContent="Линия выпадает отдельно и может быть совершенно не родной для героя.";
    $("roll").textContent="🗺️ Крутить линию";
    $("roll").disabled=false;
  }else if(этап===3){
    $("rouletteLabel").textContent="ЭТАП 3 · СБОРКА";
    $("rouletteValue").textContent=состояние.build?.name||"Во что собираться?";
    $("rouletteHint").textContent="Это сборка-челлендж для весёлой катки, а не мета-рекомендация.";
    $("roll").textContent="🛠️ Крутить сборку";
    $("roll").disabled=false;
  }else if(этап===4){
    $("rouletteLabel").textContent="ЭТАП 4 · ЗАДАНИЕ";
    $("rouletteValue").textContent=состояние.task||"Как усложнить себе жизнь?";
    $("rouletteHint").textContent="Последний бросок — получаешь условие на весь матч.";
    $("roll").textContent="🎯 Крутить задание";
    $("roll").disabled=false;
  }else{
    $("rouletteLabel").textContent="РУЛЕТКА ГОТОВА";
    $("rouletteValue").textContent="Погнали в катку!";
    $("rouletteHint").textContent="Результат сохранён в истории. Можно начать новый раунд.";
    $("roll").textContent="↻ Новая рулетка";
    $("roll").disabled=false;
  }
  обновитьШаги();
  обновитьКарточки();
}

function вариантыДляЭтапа(){
  if(этап===1) return доступныеГерои();
  if(этап===2) return линии;
  if(этап===3) return сборки.map(x=>x.name);
  if(этап===4){
    let pool=[...общиеЗадания,...(заданияПоЛиниям[состояние.lane]||[])];
    if($("crazy").checked) pool=pool.concat(безумныеЗадания);
    return pool;
  }
  return ["Новая рулетка"];
}

function применитьРезультат(value){
  if(этап===1){
    состояние={hero:value,lane:null,build:null,task:null};
    последниеГерои=[value,...последниеГерои.filter(x=>x!==value)].slice(0,10);
    этап=2;
  }else if(этап===2){
    состояние.lane=value;
    состояние.build=null;
    состояние.task=null;
    этап=3;
  }else if(этап===3){
    состояние.build=сборки.find(x=>x.name===value);
    состояние.task=null;
    этап=4;
  }else if(этап===4){
    состояние.task=value;
    этап=5;
    сохранитьВИсторию();
  }
  настроитьРулетку();
}

function крутить(){
  if(этап===5){
    сбросить();
    return;
  }
  $("roll").disabled=true;
  $("roulette").classList.add("spinning");
  const варианты=вариантыДляЭтапа();
  const финал=случайный(варианты);
  let кадр=0;
  const timer=setInterval(()=>{
    const показ=случайный(варианты);
    $("rouletteValue").textContent=typeof показ==="string" ? показ : показ.name;
    кадр++;
    if(кадр>=16){
      clearInterval(timer);
      $("roulette").classList.remove("spinning");
      $("roulette").classList.add("flash");
      setTimeout(()=>$("roulette").classList.remove("flash"),450);
      $("rouletteValue").textContent=typeof финал==="string" ? финал : финал.name;
      $("roll").disabled=false;
      setTimeout(()=>применитьРезультат(финал),280);
    }
  },55);
}

function сохранитьВИсторию(){
  const запись={
    hero:состояние.hero,
    lane:состояние.lane,
    build:состояние.build?.name||"",
    task:состояние.task,
    time:new Date().toLocaleString("ru-RU",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"})
  };
  история=[запись,...история].slice(0,12);
  localStorage.setItem("mlbbSequentialHistory",JSON.stringify(история));
  показатьИсторию();
}

function безопасно(s){
  return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[m]));
}

function показатьИсторию(){
  if(!история.length){
    $("history").innerHTML='<div class="historyEmpty">Пока пусто. Закончи первую рулетку — она появится здесь.</div>';
    return;
  }
  $("history").innerHTML=история.map(r=>
    '<div class="historyRow">'+
      '<span><b>'+безопасно(r.hero)+'</b></span>'+
      '<span>'+безопасно(r.lane)+'</span>'+
      '<span>'+безопасно(r.build)+'</span>'+
      '<span>'+безопасно(r.task)+'</span>'+
      '<time>'+безопасно(r.time)+'</time>'+
    '</div>'
  ).join("");
}

function сбросить(){
  этап=1;
  состояние={hero:null,lane:null,build:null,task:null};
  настроитьРулетку();
  window.scrollTo({top:0,behavior:"smooth"});
}

$("roll").addEventListener("click",крутить);
$("restart").addEventListener("click",сбросить);
$("clearHistory").addEventListener("click",()=>{
  история=[];
  localStorage.removeItem("mlbbSequentialHistory");
  показатьИсторию();
});
document.querySelectorAll(".step").forEach(btn=>{
  btn.addEventListener("click",()=>{
    const n=Number(btn.dataset.step);
    if(n<этап && этап<=4){
      этап=n;
      if(n===1) состояние={hero:null,lane:null,build:null,task:null};
      if(n===2) состояние={...состояние,lane:null,build:null,task:null};
      if(n===3) состояние={...состояние,build:null,task:null};
      if(n===4) состояние={...состояние,task:null};
      настроитьРулетку();
    }
  });
});

показатьИсторию();
настроитьРулетку();
