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
"🎙️ До первой смерти комментируй свои действия голосом спортивного комментатора.",
"🎭 После каждого убийства говори новую пафосную фразу героя. Повторяться нельзя.",
"😂 После каждой смерти придумай смешное оправдание, почему это был «тактический размен».",
"🧠 Перед каждой большой дракой вслух назови свою гениальную тактику — даже если её нет.",
"👑 Выбери случайного союзника «королём катки» и обращайся к нему только «Ваше Величество».",
"🎤 После каждого ассиста говори: «Я всё сделал сам, просто килл отдал».",
"🤫 Один успешный ганг проведи полностью шёпотом.",
"📣 Каждый раз, когда ульта готова перед дракой, объявляй: «Главная кнопка заряжена!»",
"😎 Если пережил драку с менее чем 15% здоровья — 10 секунд рассказывай, какой ты бессмертный.",
"🎬 До 5-й минуты озвучивай свои действия как трейлер фильма: «Он идёт на линию…»",
"🦸 Придумай своему герою новое супергеройское имя и называй его так всю катку.",
"🐢 Каждый раз, когда команда идёт на Черепаху, называй её «финальным боссом ранней игры».",
"👔 Лорда всю катку называй только «директором». Например: «Пойдём к директору».",
"💼 После каждого возвращения на базу объявляй: «Ушёл на закупку бизнеса».",
"🎯 Перед попыткой забрать килл выбери цель и вслух назови её «клиентом».",
"🥷 Один раз зайди в куст и минимум 10 секунд изображай секретного агента.",
"📢 Если сделал дабл-килл — следующие 20 секунд комментируй игру максимально пафосно.",
"🫡 После каждого спасения союзника говори: «Служба спасения прибыла».",
"🤝 Один очевидный килл обязательно отдай союзнику и торжественно объяви это подарком.",
"🎲 После первой смерти выбери новое правило: агрессивная игра или максимально осторожная — и держись его 3 минуты.",
"🎵 После удачного убийства пропой имя своего героя вместо обычной реакции.",
"💬 До 8-й минуты после каждого убийства или ассиста говори зрителям одну короткую «мудрость победителя».",
"🚕 Если играешь с перемещением/рывком — хотя бы один раз назови свой заход «такси до базы».",
"🧱 После уничтожения башни устрой ей короткую «прощальную речь».",
"🪄 Если промахнулся важным навыком — сразу скажи: «Это был предупредительный выстрел».",
"🔥 Если выиграл драку 1 в 2 или хуже — 15 секунд веди себя как финальный босс.",
"🎧 Одну минуту после 10-й минуты комментируй только звуками: «бум», «шух», «бах», но игровые решения оставляй нормальными.",
"👀 Перед заходом в опасный куст вслух спроси чат: «Ну что, там смерть?» — и только потом заходи.",
"🏆 Если закончил серию из 3 убийств/ассистов без смерти — придумай себе чемпионский титул.",
"📺 В одной командной драке называй союзников по ролям: «танк вперёд», «маг работает», «керри живёт»."
];

const crazyTasks=[
"🤡 После каждой смерти до следующего убийства разговаривай голосом мультяшного злодея.",
"🎭 Всю катку изображай, что твой герой — очень важный начальник, а союзники его сотрудники.",
"📻 2 минуты комментируй матч как радиоведущий: спокойно, серьёзно и с «срочными новостями».",
"🧙 До первой большой командной драки называй все свои способности «заклинаниями древних».",
"🍿 После каждого вражеского промаха говори: «Спасибо за контент».",
"🛎️ Каждый раз, когда тебя гангают двое или больше, говори: «Доставка приехала».",
"🎤 Если сделал дабл-килл, 30 секунд разговаривай только рифмами. Не получилось — хотя бы пытайся.",
"🧑‍⚖️ После каждой смерти устрой 10-секундный «суд» и назначь виновного: себя, карту, миньона или судьбу.",
"🕵️ Выбери одного врага «главным подозреваемым» и каждый его выход на карту комментируй как расследование.",
"👶 Одну минуту после первой смерти объясняй происходящее так, будто учишь играть человека, который впервые видит MLBB.",
"🧛 После каждого добивания говори: «Ещё один в коллекцию». После своей смерти — «коллекция закрыта».",
"🎪 До первого Лорда каждую командную драку объявляй как новый номер циркового шоу.",
"🦁 Если пережил драку один против нескольких — сделай 10-секундную победную речь без мата.",
"📦 Каждый купленный законченный предмет объявляй как распаковку: название + зачем он тебе нужен.",
"🎮 Если случайно нажал навык впустую, обязан уверенно сказать: «Проверял кнопку, всё работает».",
"🧊 После трёх смертей подряд следующие 2 минуты сохраняй абсолютно спокойный голос, что бы ни происходило.",
"💎 При первом легендарном/очень сильном моменте придумай название этому моменту, как будто это клип для YouTube.",
"🚨 При каждом появлении Лорда говори: «Внимание, директор вышел из кабинета».",
"🎬 Последнюю минуту матча, если база ещё жива, комментируй как финальную сцену фильма.",
"🧠 После каждого серьёзного фейла сразу объясни зрителям «научную причину», почему это якобы было правильно."
];

const laneTasks={
"Линия опыта":[
"⚔️ Выиграй одну дуэль 1 на 1 и после неё объяви себя «хозяином линии».",
"🧱 До первой ротации защищай свою башню как «семейную недвижимость» и так её называй.",
"🚶 После 6-й минуты сделай успешную ротацию и скажи: «Командировка окончена успешно».",
"🥊 Если враг вызывает тебя на долгий 1 на 1, комментируй бой как боксёрский поединок."
],
"Лес":[
"🌿 Первый успешный ганг объяви как «проверку линии службой леса».",
"🐢 Перед первой Черепахой скажи короткую мотивационную речь команде/зрителям.",
"🦹 Выбери одного вражеского керри «главной целью контракта» и минимум дважды успешно приди к нему.",
"🗺️ Один раз после убийства монстра объяви маршрут следующего ганга как навигатор: «через 200 метров поворот на мид»."
],
"Линия золота":[
"💰 Каждый крупный предмет называй «новой инвестицией».",
"🏦 До 5-й минуты не умирай; если получилось — объяви, что «банк пережил кризис».",
"🎯 После первого соло-килла скажи: «Инвестиция окупилась».",
"🤑 После каждого удачного размена на линии оцени его вслух: «прибыльно» или «убыточно»."
],
"Роум":[
"🛡️ Выбери одного союзника VIP и минимум трижды появись рядом, когда ему реально нужна помощь.",
"🚑 После каждого успешного спасения союзника говори: «Скорая помощь прибыла».",
"👮 Одну минуту играй как «охранник»: называй ближайшего керри «объектом под защитой».",
"📡 Перед каждой хорошей инициацией произноси: «Связь установлена, начинаем операцию»."
],
"Мид":[
"✨ После каждого удачного прокаста говори: «Магия работает».",
"🧙 Один успешный ганг на боковую линию объяви как «выезд волшебника на заказ».",
"📚 До 8-й минуты придумай названия двум своим комбинациям навыков и используй их на стриме.",
"🔮 Перед первой большой дракой сделай «предсказание», кого заберут первым."
]
};

const roleTasks={
"tank":[
"🧱 Один раз войди в драку первым и, если выжил, скажи: «Стена прошла техосмотр».",
"🚪 Перед хорошей инициацией объяви: «Открываю вход для команды»."
],
"assassin":[
"🥷 Перед одним ганком выбери цель и тихо скажи: «Контракт принят».",
"💨 После убийства постарайся уйти живым и объяви: «Работа выполнена, эвакуация»."
],
"mage":[
"🪄 Дай смешное название своей ульте и используй его каждый раз, когда её нажимаешь.",
"🔮 Перед одним важным прокастом скажи, сколько врагов, по твоему мнению, выживут."
],
"marksman":[
"🎯 До первого большого предмета называй каждого добитого крипа «вкладом в будущее».",
"🔫 После серии из трёх убийств/ассистов скажи: «Орудие вышло на рабочую мощность»."
],
"fighter":[
"🥊 Один затяжной файт комментируй как раунд чемпионского боя.",
"💪 Если пережил долгую драку на низком здоровье — объяви себя «последним боссом линии»."
],
"support":[
"💖 Выбери союзника «любимчиком саппорта» и минимум дважды спаси его.",
"📣 После хорошего сейва скажи: «Поддержка одобрена, следующий!»"
]
};

const BUILD_POOLS={
  physicalBurst:["Blade of Despair","Blade of the Heptaseas","Hunter Strike","Malefic Roar","Sky Piercer","Endless Battle","Sea Halberd","Rose Gold Meteor","Great Dragon Spear","War Axe"],
  magicBurst:["Genius Wand","Divine Glaive","Holy Crystal","Lightning Truncheon","Blood Wings","Wishing Lantern","Glowing Wand","Winter Crown","Concentrated Energy","Starlium Scythe"],
  marksman:["Corrosion Scythe","Demon Hunter Sword","Golden Staff","Wind of Nature","Windtalker","Berserker's Fury","Great Dragon Spear","Haas's Claws","Malefic Gun","Malefic Roar","Sea Halberd","Rose Gold Meteor"],
  magicDps:["Feather of Heaven","Glowing Wand","Genius Wand","Concentrated Energy","Holy Crystal","Divine Glaive","Blood Wings","Winter Crown","Wishing Lantern","Clock of Destiny","Starlium Scythe"],
  physicalBruiser:["War Axe","Queen's Wings","Thunder Belt","Endless Battle","Brute Force Breastplate","Oracle","Immortality","Sea Halberd","Rose Gold Meteor","Hunter Strike","Malefic Roar"],
  magicBruiser:["Concentrated Energy","Glowing Wand","Clock of Destiny","Blood Wings","Winter Crown","Oracle","Brute Force Breastplate","Immortality","Genius Wand","Divine Glaive"],
  tankRoam:["Dominance Ice","Antique Cuirass","Athena's Shield","Radiant Armor","Guardian Helmet","Immortality","Oracle","Blade Armor","Cursed Helmet","Thunder Belt","Brute Force Breastplate","Queen's Wings"],
  supportRoam:["Flask of the Oasis","Fleeting Time","Dominance Ice","Oracle","Athena's Shield","Radiant Armor","Immortality","Guardian Helmet","Brute Force Breastplate","Thunder Belt","Cursed Helmet"]
};
const BOOT_POOLS={
  physicalBurst:["Rapid Boots","Magic Boots","Tough Boots","Warrior Boots"],
  magicBurst:["Arcane Boots","Magic Boots","Tough Boots"],
  marksman:["Swift Boots","Tough Boots","Warrior Boots"],
  magicDps:["Arcane Boots","Magic Boots","Swift Boots"],
  physicalBruiser:["Tough Boots","Warrior Boots","Magic Boots"],
  magicBruiser:["Tough Boots","Magic Boots","Arcane Boots"],
  tankRoam:["Tough Boots","Warrior Boots","Rapid Boots"],
  supportRoam:["Tough Boots","Rapid Boots","Demon Boots","Magic Boots"]
};

let heroes=[],items=[],stage=1,hero=null,lane=null,build=[],buildProfile=null,task=null,recent=[],laneRotation=0,itemFilter="Все";
let history=JSON.parse(localStorage.getItem("mlbbVisualHistory")||"[]");

function hName(h){return RU_HERO[h.name_hero]||h.name_hero}
function iName(i){return RU_ITEM[i["name-equipment"]]||i["name-equipment"]}
function heroImg(h){return SOURCE+"/images-hero/"+h["images-hero"]}
function itemImg(i){return SOURCE+"/logo-equipment/"+i["logo-equipment"]}
function esc(s){return String(s==null?"":s).replace(/[&<>"']/g,function(m){return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[m]})}
function category(i){const id=Number(i.id_equip);if(id<=34)return"Атака";if(id<=65)return"Магия";if(id<=91)return"Защита";if(id<=99)return"Передвижение";return"Особое"}
function boots(){return items.filter(i=>Number(i.id_equip)>=92&&Number(i.id_equip)<=98)}
function finals(){const bad=new Set(["Power Potion","Magic Potion","Rock Potion"]);const map=new Map();items.forEach(function(i){const id=Number(i.id_equip),price=Number(i["prize-gold"]);if(id<=91&&price>=1500&&!bad.has(i["name-equipment"]))map.set(i["name-equipment"],i)});return[...map.values()]}
function itemByName(name){return items.find(i=>i["name-equipment"]===name)}
function namedItems(names){return names.map(itemByName).filter(Boolean)}
function heroRoles(){return (hero&&Array.isArray(hero.role)?hero.role:[]).map(r=>String(r).toLowerCase())}
function getBuildProfile(){
  const roles=heroRoles(),isMage=roles.includes("mage"),isMarksman=roles.includes("marksman"),isSupport=roles.includes("support"),isTank=roles.includes("tank"),isAssassin=roles.includes("assassin");
  const name=hName(hero);
  if(!lane)return{key:"physicalBruiser",name:"Универсальная",reason:"Сначала должна выпасть линия."};

  if(lane.name==="Роум"){
    if(isSupport||isMage&&!isAssassin)return{key:"supportRoam",name:"Роум-поддержка",reason:name+" идёт в роум — собираем пользу команде, выживаемость и частые навыки."};
    return{key:"tankRoam",name:"Защитный роум",reason:name+" идёт в роум — даже если это убийца или стрелок, превращаем его в максимально живучего роумера."};
  }
  if(lane.name==="Лес"){
    if(isMage)return{key:"magicBurst",name:"Маг-убийца в лесу",reason:name+" идёт в лес — делаем агрессивную магическую сборку под быстрые убийства."};
    if(isMarksman&&!isTank)return{key:"marksman",name:"Лесной керри",reason:name+" идёт в лес — упор на быстрый урон и добивание целей."};
    return{key:"physicalBurst",name:"Убийца-лесник",reason:(isTank?name+" — танк, но выпал лес: собираем его агрессивно, почти как убийцу.":name+" идёт в лес — сборка на взрывной урон, пробивание и быстрые ганги.")};
  }
  if(lane.name==="Линия золота"){
    if(isMage)return{key:"magicDps",name:"Магический керри",reason:name+" идёт на линию золота — собираем постоянный магический урон для поздней игры."};
    return{key:"marksman",name:"Керри линии золота",reason:name+" идёт на линию золота — сборка под скорость атаки, крит или постоянный физический урон."};
  }
  if(lane.name==="Мид"){
    if(isMage||isSupport)return{key:"magicBurst",name:"Маг мида",reason:name+" идёт на мид — сборка под прокаст, магическое пробивание и сильные ротации."};
    return{key:"physicalBurst",name:"Физический убийца мида",reason:name+" идёт на мид без роли мага — собираем взрывной физический урон и пробивание."};
  }
  if(lane.name==="Линия опыта"){
    if(isMage)return{key:"magicBruiser",name:"Маг-боец EXP",reason:name+" идёт на линию опыта — магический урон сочетаем с выживаемостью для долгих дуэлей."};
    return{key:"physicalBruiser",name:"Боец EXP",reason:name+" идёт на линию опыта — собираем урон, восстановление и защиту для затяжных драк."};
  }
  return{key:"physicalBruiser",name:"Универсальная",reason:"Сборка адаптирована под героя и линию."};
}
function renderBuildContext(){
  buildProfile=getBuildProfile();
  if($("buildStyle"))$("buildStyle").textContent=buildProfile.name;
  if($("buildReason"))$("buildReason").textContent=buildProfile.reason;
}

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
  if(!hero)return;
  $("spinLane").disabled=true;
  const idx=Math.floor(Math.random()*lanes.length);
  const final=lanes[idx];
  const wheel=$("laneWheel");
  const spinner=$("laneSpinner");

  wheel.querySelectorAll(".laneMarker").forEach(el=>el.classList.remove("selected"));
  wheel.querySelector(".laneHub span").textContent="...";
  wheel.querySelector(".laneHub small").textContent="крутим";
  $("laneName").textContent="Крутим...";
  $("laneHint").textContent="Стрелка выбирает один из пяти секторов.";

  const targetAngle=idx*72;
  const base=Math.ceil(laneRotation/360)*360;
  laneRotation=base+1440+targetAngle;

  let finished=false;
  const finish=function(){
    if(finished)return;
    finished=true;
    lane=final;
    wheel.querySelectorAll(".laneMarker")[idx].classList.add("selected");
    wheel.querySelector(".laneHub span").textContent=final.short;
    wheel.querySelector(".laneHub small").textContent="выпало";
    $("laneName").textContent=final.name;
    $("laneHint").textContent=final.hint;
    $("spinLane").disabled=false;
    $("spinBuild").disabled=false;
    build=[];buildProfile=getBuildProfile();task=null;
    renderBuildContext();
    setTimeout(()=>go(3),650);
  };

  spinner.addEventListener("transitionend",finish,{once:true});
  requestAnimationFrame(()=>{spinner.style.transform="rotate("+laneRotation+"deg)"});
  setTimeout(finish,2450);
}
function randomBuild(){
  buildProfile=getBuildProfile();
  const bootPool=namedItems(BOOT_POOLS[buildProfile.key]||BOOT_POOLS.physicalBruiser);
  const itemPool=shuffle(namedItems(BUILD_POOLS[buildProfile.key]||BUILD_POOLS.physicalBruiser));
  const boot=pick(bootPool.length?bootPool:boots());
  let chosen=itemPool.filter(i=>i["name-equipment"]!==boot["name-equipment"]).slice(0,5);
  if(chosen.length<5){
    const used=new Set(chosen.map(i=>i["name-equipment"]));
    const fallback=shuffle(finals()).filter(i=>!used.has(i["name-equipment"])&&i["name-equipment"]!==boot["name-equipment"]);
    chosen=chosen.concat(fallback.slice(0,5-chosen.length));
  }
  return[boot].concat(chosen);
}
function itemCard(i,rolling){return'<div class="itemSlot'+(rolling?" rolling":"")+'"><img src="'+itemImg(i)+'" alt="'+esc(iName(i))+'"><strong>'+esc(iName(i))+'</strong><small>'+Number(i["prize-gold"]).toLocaleString("ru-RU")+' золота</small></div>'}
function showBuild(arr,rolling){renderBuildContext();$("buildSlots").innerHTML=arr.map(i=>itemCard(i,rolling)).join("");$("buildPrice").textContent=arr.reduce((s,x)=>s+Number(x["prize-gold"]||0),0).toLocaleString("ru-RU")+" золота"}
function spinBuild(){
  if(!lane)return;$("spinBuild").disabled=true;let t=0;const timer=setInterval(function(){showBuild(randomBuild(),true);if(++t>=12){clearInterval(timer);build=randomBuild();showBuild(build,false);$("spinBuild").disabled=false;$("spinTask").disabled=false;task=null;go(4)}},120)
}
function taskPool(){
  let p=normalTasks.concat(laneTasks[lane?lane.name:""]||[]);
  heroRoles().forEach(function(role){if(roleTasks[role])p=p.concat(roleTasks[role])});
  if($("crazyTasks").checked)p=p.concat(crazyTasks);
  return p;
}
function spinTask(){
  if(!build.length)return;$("spinTask").disabled=true;const machine=document.querySelector(".taskMachine"),pool=taskPool(),final=pick(pool);machine.classList.add("rolling");let t=0;
  const timer=setInterval(function(){$("taskText").textContent=pick(pool);if(++t>=15){clearInterval(timer);machine.classList.remove("rolling");task=final;$("taskText").textContent=final;$("taskSub").textContent="Задание действует на всю эту катку.";$("spinTask").disabled=false;stage=5;updateProgress();showFinal();saveHistory()}},90)
}
function showFinal(){
  $("finalCard").classList.remove("hidden");$("finalSummary").innerHTML='<div class="finalSummaryGrid"><div><small>ГЕРОЙ</small><strong>'+esc(hName(hero))+'</strong></div><div><small>ЛИНИЯ</small><strong>'+esc(lane.name)+'</strong></div><div><small>СБОРКА · '+esc(buildProfile?buildProfile.name:"")+'</small><strong>'+build.map(i=>esc(iName(i))).join(" · ")+'</strong></div><div><small>ЗАДАНИЕ</small><strong>'+esc(task)+'</strong></div></div>'
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
  stage=1;hero=null;lane=null;build=[];buildProfile=null;task=null;laneRotation=0;$("heroCenterPhoto").innerHTML="<span>?</span>";$("heroName").textContent="Кто выпадет?";$("heroOriginal").textContent="Нажми кнопку ниже";$("chosenHeroMini").textContent="Сначала выбери героя";$("laneName").textContent="—";$("laneHint").textContent="Нажми «Крутить линию» — стрелка остановится точно на выбранном секторе.";$("laneSpinner").style.transition="none";$("laneSpinner").style.transform="rotate(0deg)";requestAnimationFrame(()=>requestAnimationFrame(()=>{$("laneSpinner").style.transition=""}));$("laneWheel").querySelector(".laneHub span").textContent="?";$("laneWheel").querySelector(".laneHub small").textContent="крути";$("laneWheel").querySelectorAll(".laneMarker").forEach(el=>el.classList.remove("selected"));$("buildSlots").innerHTML='<div class="itemSlot empty">?</div>'.repeat(6);$("buildPrice").textContent="—";if($("buildStyle"))$("buildStyle").textContent="Сначала выбери героя и линию";if($("buildReason"))$("buildReason").textContent="Например: танк в лесу станет агрессивным лесником, а убийца в роуме — защитным роумером.";$("taskText").textContent="Сначала собери героя, линию и сборку.";$("taskSub").textContent="Все задания написаны по-русски и рассчитаны на одну катку.";$("finalCard").classList.add("hidden");$("spinLane").disabled=true;$("spinBuild").disabled=true;$("spinTask").disabled=true;renderOrbit();updateProgress();$("heroSection").scrollIntoView({behavior:"smooth",block:"start"})
}
async function load(){
  try{const r=await Promise.all([fetch("./data/heroes.json"),fetch("./data/items.json")]);heroes=await r[0].json();items=await r[1].json();$("heroCount").textContent=heroes.length;$("itemCount").textContent=items.length;renderOrbit();renderTabs();renderCatalog();showHistory()}
  catch(e){console.error(e);$("heroName").textContent="Ошибка загрузки данных";$("heroOriginal").textContent="Обнови страницу"}
}
$("spinHero").onclick=spinHero;$("spinLane").onclick=spinLane;$("spinBuild").onclick=spinBuild;$("spinTask").onclick=spinTask;$("restartAll").onclick=reset;$("newRound").onclick=reset;$("copyResult").onclick=copyResult;$("itemSearch").oninput=renderCatalog;$("clearHistory").onclick=function(){history=[];localStorage.removeItem("mlbbVisualHistory");showHistory()};window.addEventListener("resize",function(){if(heroes.length)renderOrbit(hero)});
load();
