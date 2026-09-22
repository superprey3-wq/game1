const SOURCE="https://raw.githubusercontent.com/Ceplin03/database-mlbb.Mobile-Legends-Bang-Bang/master";
const $=id=>document.getElementById(id), pick=a=>a[Math.floor(Math.random()*a.length)], shuffle=a=>[...a].sort(()=>Math.random()-.5);
const RU_HERO={"Aamon":"Аамон","Akai":"Акай","Aldous":"Алдос","Alice":"Алиса","Alpha":"Альфа","Alucard":"Алукард","Angela":"Анджела","Argus":"Аргус","Arlott":"Арлотт","Atlas":"Атлас","Aulus":"Аулус","Aurora":"Аврора","Badang":"Баданг","Balmond":"Балмонд","Bane":"Бэйн","Barats":"Баратс","Baxia":"Баксия","Beatrix":"Беатрикс","Belerick":"Белерик","Benedetta":"Бенедетта","Brody":"Броуди","Bruno":"Бруно","Carmilla":"Кармилла","Cecilion":"Сесилион","Chang'e":"Чанъэ","Chip":"Чип","Chou":"Чоу","Cici":"Сиси","Claude":"Клод","Clint":"Клинт","Cyclops":"Циклоп","Diggie":"Дигги","Dyrroth":"Дайрот","Edith":"Эдит","Esmeralda":"Эсмеральда","Estes":"Эстес","Eudora":"Эйдора","Fanny":"Фанни","Faramis":"Фарамис","Floryn":"Флорин","Franco":"Франко","Fredrinn":"Фредринн","Freya":"Фрейя","Gatotkaca":"Гатоткача","Gloo":"Глу","Gord":"Горд","Granger":"Грейнджер","Grock":"Грок","Guinevere":"Гвиневра","Gusion":"Госсен","Hanabi":"Ханаби","Hanzo":"Ханзо","Harith":"Харит","Harley":"Харли","Hayabusa":"Хаябуса","Helcurt":"Хелкарт","Hilda":"Хильда","Hirara":"Хирара","Hylos":"Хилос","Irithel":"Иритель","Ixia":"Иксия","Jawhead":"Джохэд","Johnson":"Джонсон","Joy":"Джой","Julian":"Джулиан","Kadita":"Кадита","Kagura":"Кагура","Kaja":"Кайя","Kalea":"Калея","Karina":"Карина","Karrie":"Кэрри","Khaleed":"Халид","Khufra":"Хуфра","Kimmy":"Кимми","Lancelot":"Ланселот","Lapu-Lapu":"Лапу-Лапу","Layla":"Лейла","Leomord":"Леоморд","Lesley":"Лесли","Ling":"Линг","Lolita":"Лолита","Lukas":"Лукас","Lunox":"Люнокс","Luo Yi":"Ло И","Lylia":"Лилия","Marcel":"Марсель","Martis":"Мартис","Masha":"Маша","Mathilda":"Матильда","Melissa":"Мелисса","Minotaur":"Минотавр","Minsitthar":"Минситтар","Miya":"Мия","Moskov":"Москов","Nana":"Нана","Natalia":"Наталья","Natan":"Натан","Nolan":"Нолан","Novaria":"Новария","Obsidia":"Обсидия","Odette":"Одетта","Paquito":"Пакито","Pharsa":"Фарса","Phoveus":"Фовеус","Popol and Kupa":"Пополь и Купа","Rafaela":"Рафаэла","Roger":"Роджер","Ruby":"Руби","Saber":"Сабер","Selena":"Селена","Silvanna":"Сильванна","Sora":"Сора","Sun":"Сан","Suyou":"Сую","Terizla":"Теризла","Thamuz":"Тамуз","Tigreal":"Тигрил","Uranus":"Уранус","Vale":"Вэйл","Valentina":"Валентина","Valir":"Валир","Vexana":"Вексана","Wanwan":"Ванван","X.Borg":"Икс.Борг","Xavier":"Ксавьер","Yi Sun-shin":"И Сун-син","Yin":"Инь","Yu Zhong":"Юй Чжун","Yve":"Ив","Zetian":"Цзэтянь","Zhask":"Жаск","Zhuxin":"Чжусинь","Zilong":"Зилонг"};
const RU_ITEM={"Berserker's Fury":"Ярость берсерка","Blade of Despair":"Клинок отчаяния","Blade of the Heptaseas":"Клинок семи морей","Corrosion Scythe":"Коса коррозии","Demon Hunter Sword":"Меч охотника на демонов","Endless Battle":"Бесконечная битва","Fleeting Time":"Мимолётное время","Golden Staff":"Золотой посох","Great Dragon Spear":"Копьё великого дракона","Haas's Claws":"Когти Хааса","Hunter Strike":"Удар охотника","Malefic Gun":"Зловещая пушка","Malefic Roar":"Зловещий рёв","Rose Gold Meteor":"Метеор розового золота","Sea Halberd":"Морская алебарда","Sky Piercer":"Небесный пронзатель","War Axe":"Боевой топор","Wind of Nature":"Ветер природы","Windtalker":"Говорящий с ветром","Winter Crown":"Зимняя корона","Fury Hammer":"Молот ярости","Legion Sword":"Меч легиона","Magic Blade":"Магический клинок","Ogre Tomahawk":"Томагавк огра","Regular Spear":"Обычное копьё","Rogue Meteor":"Метеор разбойника","Swift Crossbow":"Быстрый арбалет","Dagger":"Кинжал","Expert Gloves":"Перчатки мастера","Iron Hunting Bow":"Железный охотничий лук","Javelin":"Метательное копьё","Knife":"Нож","Vampire Mallet":"Молот вампира","Power Potion":"Зелье силы","Blood Wings":"Кровавые крылья","Clock of Destiny":"Часы судьбы","Concentrated Energy":"Концентрированная энергия","Divine Glaive":"Божественная глефа","Enchanted Talisman":"Зачарованный талисман","Feather of Heaven":"Перо небес","Flask of the Oasis":"Фляга оазиса","Genius Wand":"Жезл гения","Glowing Wand":"Пылающий жезл","Holy Crystal":"Священный кристалл","Ice Queen Wand":"Жезл ледяной королевы","Lightning Truncheon":"Молниеносный жезл","Starlium Scythe":"Коса Старлиума","Wishing Lantern":"Фонарь желаний","Azure Blade":"Лазурный клинок","Elegant Gem":"Изысканный самоцвет","Exotic Veil":"Экзотическая вуаль","Mystic Container":"Мистический сосуд","Tome of Evil":"Том зла","Book of Sages":"Книга мудрецов","Magic Necklace":"Магическое ожерелье","Magic Wand":"Магический жезл","Mystery Codex":"Таинственный кодекс","Power Crystal":"Кристалл силы","Flower of Hope":"Цветок надежды","Lantern of Hope":"Фонарь надежды","Magic Potion":"Магическое зелье","Antique Cuirass":"Античная кираса","Athena's Shield":"Щит Афины","Blade Armor":"Клинковая броня","Brute Force Breastplate":"Кираса грубой силы","Chastise Pauldron":"Карающий наплечник","Cursed Helmet":"Проклятый шлем","Dominance Ice":"Ледяное господство","Guardian Helmet":"Шлем стража","Immortality":"Бессмертие","Oracle":"Оракул","Queen's Wings":"Крылья королевы","Radiant Armor":"Сияющая броня","Thunder Belt":"Громовой пояс","Ares Belt":"Пояс Ареса","Black Ice Shield":"Щит чёрного льда","Dreadnaught Armor":"Броня дредноута","Molten Essence":"Расплавленная эссенция","Silence Robe":"Мантия тишины","Steel Legplates":"Стальные поножи","Healing Necklace":"Ожерелье исцеления","Hero's Ring":"Кольцо героя","Leather Jerkin":"Кожаная куртка","Magic Resist Cloak":"Плащ сопротивления магии","Vitality Crystal":"Кристалл жизненной силы","Rock Potion":"Каменное зелье","Arcane Boots":"Чародейские сапоги","Demon Boots":"Демонические сапоги","Magic Boots":"Магические сапоги","Rapid Boots":"Сапоги стремительности","Swift Boots":"Быстрые сапоги","Tough Boots":"Крепкие сапоги","Warrior Boots":"Сапоги воина","Boots":"Сапоги","Allow Throw":"Разрешить выбрасывание","Broken Heart":"Разбитое сердце","Throw Forbidden":"Выбрасывание запрещено","Bloody Retribution":"Кровавое возмездие","Flame Retribution":"Огненное возмездие","Ice Retribution":"Ледяное возмездие","Conceal":"Сокрытие","Dire Hit":"Смертельный удар","Encourage":"Воодушевление","Favor":"Благословение"};
const lanes=[
{name:"Линия опыта",short:"ОПЫТ",hint:"Линия опыта — чаще для бойцов и крепких дуэлянтов."},
{name:"Лес",short:"ЛЕС",hint:"Лес — фарм монстров, ганги и борьба за Черепаху и Лорда."},
{name:"Линия золота",short:"ЗОЛОТО",hint:"Линия золота — быстрый фарм золота, часто для стрелков."},
{name:"Роум",short:"РОУМ",hint:"Роум — помощь всей карте, контроль и защита союзников."},
{name:"Мид",short:"МИД",hint:"Мид — центральная линия, где чаще всего играют маги."}
];
const normalTasks=[
"Не умирай первые 5 минут. Умер раньше — челлендж провален.",
"Сделай 3 ассиста подряд, не забрав ни одного убийства.",
"После каждого своего убийства сразу смени линию или сторону карты.",
"Хотя бы один раз спаси союзника и сам останься жив.",
"Сломай хотя бы одну башню лично.",
"Прими участие минимум в 60% убийств своей команды.",
"Сделай серию из 3 убийств или ассистов без возвращения на базу.",
"Всю катку не пиши ни одного токсичного сообщения.",
"Хотя бы один очевидный килл отдай союзнику.",
"После выигранной командной драки сразу иди на башню, Черепаху или Лорда.",
"Дважды устрой успешную засаду из куста.",
"До 8-й минуты ни разу не лезь под вражескую башню за киллом.",
"Сделай минимум 10 ассистов за матч.",
"После каждой смерти назови одну свою ошибку и не повторяй её.",
"Хотя бы раз переживи драку, имея меньше 10% здоровья.",
"Если союзник сделал красивый момент, обязательно похвали его в чате.",
"Один раз сделай вид, что уходишь, а затем вернись в драку и помоги команде.",
"За матч помоги уничтожить минимум 3 башни.",
"Сделай одно убийство или ассист, начав атаку из куста.",
"После 10-й минуты одну минуту играй только на команду и объекты, не фарми.",
"Если сделал дабл-килл, следующую минуту нельзя гоняться за третьим врагом."
];
const crazyTasks=[
"Первые 7 минут нельзя нажимать «Возвращение». На базу — только пешком или после смерти.",
"После каждого убийства обязан написать в чат: «Это было по плану».",
"Выбери случайного союзника своим VIP и трижды спаси именно его.",
"До 10-й минуты нельзя начинать драку первым. Только контратака.",
"После каждой своей смерти скажи вслух: «Тактический ресет».",
"Первую большую командную драку сыграй максимально защитно, даже если твой герой убийца.",
"Если сделаешь дабл-килл, следующую минуту можешь атаковать только башни и монстров.",
"До первого Лорда нельзя писать ничего в чат, кроме «👍».",
"Если случайно украл килл у союзника, следующий очевидный килл обязан отдать.",
"После 12-й минуты нельзя стоять на одной линии дольше одной минуты."
];
const laneTasks={
"Линия опыта":["Выиграй хотя бы одну честную дуэль 1 на 1 на линии опыта.","До 6-й минуты не проси помощи, а потом сам сделай успешную ротацию.","После 8-й минуты первым со своей линии приди на важный командный объект."],
"Лес":["Забери первую Черепаху или обязательно участвуй в её убийстве.","Сделай два успешных ганга на разные линии.","Хотя бы один раз забери вражеского лесного монстра и уйди живым."],
"Линия золота":["До 5-й минуты не умирай и не потеряй свою башню.","Сломай первую башню на своей линии или участвуй в её разрушении.","После двух основных предметов не пропускай ближайшую командную драку."],
"Роум":["Выбери союзника VIP и трижды спаси его за матч.","Первые 5 минут не забирай ни одного крипа у союзников.","Организуй минимум две успешные засады из кустов."],
"Мид":["После зачистки двух волн подряд обязательно сделай ротацию на боковую линию.","Помоги и линии опыта, и линии золота хотя бы по одному разу.","До 8-й минуты сделай минимум два ассиста вне мида."]
};
let heroes=[],items=[],stage=1,hero=null,lane=null,build=[],task=null,recent=[],laneRotation=0,itemFilter="Все";
let history=JSON.parse(localStorage.getItem("mlbbVisualHistory")||"[]");

function hName(h){return RU_HERO[h.name_hero]||h.name_hero}
function iName(i){return RU_ITEM[i["name-equipment"]]||i["name-equipment"]}
function heroImg(h){return SOURCE+"/images-hero/"+h["images-hero"]}
function itemImg(i){return SOURCE+"/logo-equipment/"+i["logo-equipment"]}
function esc(s){return String(s==null?"":s).replace(/[&<>"']/g,function(m){return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[m]})}
function category(i){const id=Number(i.id_equip);if(id<=34)return"Атака";if(id<=65)return"Магия";if(id<=91)return"Защита";if(id<=99)return"Передвижение";return"Особое"}
function boots(){return items.filter(i=>Number(i.id_equip)>=92&&Number(i.id_equip)<=98)}
function finals(){const bad=new Set(["Power Potion","Magic Potion","Rock Potion"]);const map=new Map();items.forEach(function(i){const id=Number(i.id_equip),price=Number(i["prize-gold"]);if(id<=91&&price>=1500&&!bad.has(i["name-equipment"]))map.set(i["name-equipment"],i)});return[...map.values()]}

function updateProgress(){
  document.querySelectorAll(".progressStep").forEach(function(el){const n=Number(el.dataset.progress);el.classList.toggle("active",n===stage);el.classList.toggle("done",n<stage);el.classList.toggle("locked",n>stage)});
  ["heroSection","laneSection","buildSection","taskSection"].forEach(function(id,idx){const n=idx+1;$(id).classList.toggle("activeStage",n===stage);$(id).classList.toggle("lockedStage",n>stage)});
}
function go(n){stage=n;updateProgress();const ids=["","heroSection","laneSection","buildSection","taskSection"];setTimeout(function(){$(ids[n]).scrollIntoView({behavior:"smooth",block:"start"})},180)}

function renderOrbit(selected){
  const orbit=$("heroOrbit"),faces=shuffle(heroes).slice(0,12);if(selected&&!faces.some(x=>x.id_hero===selected.id_hero))faces[0]=selected;
  orbit.innerHTML="";const radius=innerWidth<470?110:innerWidth<700?128:158;
  faces.forEach(function(h,i){const angle=360/faces.length*i-90,el=document.createElement("div");el.className="heroFace"+(selected&&h.id_hero===selected.id_hero?" selectedFace":"");el.style.transform="rotate("+angle+"deg) translateX("+radius+"px) rotate("+(-angle)+"deg)";el.innerHTML='<img src="'+heroImg(h)+'" alt="'+esc(hName(h))+'" loading="eager">';orbit.appendChild(el)});
}
function showHero(h){$("heroCenterPhoto").innerHTML='<img src="'+heroImg(h)+'" alt="'+esc(hName(h))+'">';$("heroName").textContent=hName(h);$("heroOriginal").textContent="Герой выбран";$("chosenHeroMini").innerHTML='Выбран герой: <b>'+esc(hName(h))+"</b>";renderOrbit(h)}
function spinHero(){
  $("spinHero").disabled=true;let pool=$("noRepeat").checked?heroes.filter(h=>!recent.includes(h.id_hero)):heroes;if(!pool.length)pool=heroes;const final=pick(pool),orbit=$("heroOrbit");orbit.classList.add("spinning");let t=0;
  const timer=setInterval(function(){const p=pick(pool);$("heroCenterPhoto").innerHTML='<img src="'+heroImg(p)+'" alt="">';$("heroName").textContent=hName(p);if(t%2===0)renderOrbit();if(++t>=18){clearInterval(timer);orbit.classList.remove("spinning");hero=final;recent=[final.id_hero].concat(recent.filter(id=>id!==final.id_hero)).slice(0,12);lane=null;build=[];task=null;showHero(final);$("spinHero").disabled=false;$("spinLane").disabled=false;go(2)}},85)
}
function spinLane(){
  if(!hero)return;$("spinLane").disabled=true;const idx=Math.floor(Math.random()*lanes.length),final=lanes[idx],center=idx*72+36,base=Math.ceil(laneRotation/360)*360;laneRotation=base+1440+(360-center);$("laneWheel").style.transform="rotate("+laneRotation+"deg)";$("laneWheel").querySelector(".laneHub").textContent="...";
  setTimeout(function(){lane=final;$("laneName").textContent=final.name;$("laneHint").textContent=final.hint;$("laneWheel").querySelector(".laneHub").textContent=final.short;$("spinLane").disabled=false;$("spinBuild").disabled=false;build=[];task=null;go(3)},1850)
}
function randomBuild(){const b=pick(boots()),rest=shuffle(finals()).filter(x=>x["name-equipment"]!==b["name-equipment"]).slice(0,5);return[b].concat(rest)}
function itemCard(i,rolling){return'<div class="itemSlot'+(rolling?" rolling":"")+'"><img src="'+itemImg(i)+'" alt="'+esc(iName(i))+'"><strong>'+esc(iName(i))+'</strong><small>'+Number(i["prize-gold"]).toLocaleString("ru-RU")+' золота</small></div>'}
function showBuild(arr,rolling){$("buildSlots").innerHTML=arr.map(i=>itemCard(i,rolling)).join("");$("buildPrice").textContent=arr.reduce((s,x)=>s+Number(x["prize-gold"]||0),0).toLocaleString("ru-RU")+" золота"}
function spinBuild(){
  if(!lane)return;$("spinBuild").disabled=true;let t=0;const timer=setInterval(function(){showBuild(randomBuild(),true);if(++t>=12){clearInterval(timer);build=randomBuild();showBuild(build,false);$("spinBuild").disabled=false;$("spinTask").disabled=false;task=null;go(4)}},120)
}
function taskPool(){let p=normalTasks.concat(laneTasks[lane?lane.name:""]||[]);if($("crazyTasks").checked)p=p.concat(crazyTasks);return p}
function spinTask(){
  if(!build.length)return;$("spinTask").disabled=true;const machine=document.querySelector(".taskMachine"),pool=taskPool(),final=pick(pool);machine.classList.add("rolling");let t=0;
  const timer=setInterval(function(){$("taskText").textContent=pick(pool);if(++t>=15){clearInterval(timer);machine.classList.remove("rolling");task=final;$("taskText").textContent=final;$("taskSub").textContent="Задание действует на всю эту катку.";$("spinTask").disabled=false;stage=5;updateProgress();showFinal();saveHistory()}},90)
}
function showFinal(){
  $("finalCard").classList.remove("hidden");$("finalSummary").innerHTML='<div class="finalSummaryGrid"><div><small>ГЕРОЙ</small><strong>'+esc(hName(hero))+'</strong></div><div><small>ЛИНИЯ</small><strong>'+esc(lane.name)+'</strong></div><div><small>СБОРКА</small><strong>'+build.map(i=>esc(iName(i))).join(" · ")+'</strong></div><div><small>ЗАДАНИЕ</small><strong>'+esc(task)+'</strong></div></div>'
}
function saveHistory(){
  const e={hero:hName(hero),lane:lane.name,build:build.map(iName).join(", "),task:task,time:new Date().toLocaleString("ru-RU",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"})};history=[e].concat(history).slice(0,10);localStorage.setItem("mlbbVisualHistory",JSON.stringify(history));showHistory()
}
function showHistory(){
  if(!history.length){$("history").innerHTML='<div class="historyEmpty">Пока пусто. Закончи первую рулетку.</div>';return}
  $("history").innerHTML=history.map(function(r){return'<div class="historyRow"><span><b>'+esc(r.hero)+'</b></span><span>'+esc(r.lane)+'</span><span>'+esc(r.build)+'</span><span>'+esc(r.task)+'</span><time>'+esc(r.time)+'</time></div>'}).join("")
}
function renderTabs(){
  const tabs=["Все","Атака","Магия","Защита","Передвижение","Особое"];$("itemTabs").innerHTML=tabs.map(t=>'<button class="'+(t===itemFilter?"active":"")+'" data-tab="'+t+'">'+t+"</button>").join("");
  document.querySelectorAll("#itemTabs button").forEach(function(b){b.onclick=function(){itemFilter=b.dataset.tab;renderTabs();renderCatalog()}})
}
function renderCatalog(){
  const q=$("itemSearch").value.trim().toLowerCase(),list=items.filter(function(i){return(itemFilter==="Все"||category(i)===itemFilter)&&iName(i).toLowerCase().includes(q)});
  $("itemCount").textContent=list.length;$("itemCatalog").innerHTML=list.map(function(i){return'<div class="catalogItem"><img src="'+itemImg(i)+'" alt="'+esc(iName(i))+'" loading="lazy"><strong>'+esc(iName(i))+'</strong><small>'+Number(i["prize-gold"]).toLocaleString("ru-RU")+' золота</small><em>'+category(i)+"</em></div>"}).join("")
}
function resultText(){return["Моя рулетка MLBB:","Герой: "+hName(hero),"Линия: "+lane.name,"Сборка: "+build.map(iName).join(" → "),"Задание: "+task].join("\n")}
async function copyResult(){const text=resultText();try{await navigator.clipboard.writeText(text);$("copyResult").textContent="✅ Скопировано";setTimeout(()=>$("copyResult").textContent="📋 Скопировать результат",1200)}catch(e){prompt("Скопируй результат:",text)}}
function reset(){
  stage=1;hero=null;lane=null;build=[];task=null;laneRotation=0;$("heroCenterPhoto").innerHTML="<span>?</span>";$("heroName").textContent="Кто выпадет?";$("heroOriginal").textContent="Нажми кнопку ниже";$("chosenHeroMini").textContent="Сначала выбери героя";$("laneName").textContent="—";$("laneHint").textContent="Мид — центральная линия, где обычно играют маги.";$("laneWheel").style.transform="rotate(0deg)";$("laneWheel").querySelector(".laneHub").textContent="?";$("buildSlots").innerHTML='<div class="itemSlot empty">?</div>'.repeat(6);$("buildPrice").textContent="—";$("taskText").textContent="Сначала собери героя, линию и сборку.";$("taskSub").textContent="Все задания написаны по-русски и рассчитаны на одну катку.";$("finalCard").classList.add("hidden");$("spinLane").disabled=true;$("spinBuild").disabled=true;$("spinTask").disabled=true;renderOrbit();updateProgress();$("heroSection").scrollIntoView({behavior:"smooth",block:"start"})
}
async function load(){
  try{const r=await Promise.all([fetch("./data/heroes.json"),fetch("./data/items.json")]);heroes=await r[0].json();items=await r[1].json();$("heroCount").textContent=heroes.length;$("itemCount").textContent=items.length;renderOrbit();renderTabs();renderCatalog();showHistory()}
  catch(e){console.error(e);$("heroName").textContent="Ошибка загрузки данных";$("heroOriginal").textContent="Обнови страницу"}
}
$("spinHero").onclick=spinHero;$("spinLane").onclick=spinLane;$("spinBuild").onclick=spinBuild;$("spinTask").onclick=spinTask;$("restartAll").onclick=reset;$("newRound").onclick=reset;$("copyResult").onclick=copyResult;$("itemSearch").oninput=renderCatalog;$("clearHistory").onclick=function(){history=[];localStorage.removeItem("mlbbVisualHistory");showHistory()};window.addEventListener("resize",function(){if(heroes.length)renderOrbit(hero)});
load();
