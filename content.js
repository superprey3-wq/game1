// Arena of Companions production content catalog.
// Data-driven content keeps balancing/rendering separate and makes future worlds easy to add.
export const WORLDS=[
 {id:'emerald',unlock:0,duration:600,name:{ru:'Изумрудная чаща',en:'Emerald Wilds'},theme:{ground:'#10291f',grid:'#2e5a3d',accent:'#7ee787'},enemies:['sprout','fang','shaman'],boss:'ancient'},
 {id:'dunes',unlock:3,duration:600,name:{ru:'Пепельные дюны',en:'Ashen Dunes'},theme:{ground:'#342318',grid:'#765333',accent:'#ffbf69'},enemies:['scarab','raider','djinn'],boss:'colossus'},
 {id:'frost',unlock:7,duration:660,name:{ru:'Ледяной предел',en:'Frostbound Reach'},theme:{ground:'#132936',grid:'#37677b',accent:'#8bd8ff'},enemies:['wisp','wolf','frostmage'],boss:'wyrm'},
 {id:'abyss',unlock:12,duration:720,name:{ru:'Бездна',en:'The Abyss'},theme:{ground:'#21152e',grid:'#513268',accent:'#d88cff'},enemies:['eye','crawler','warlock'],boss:'voidlord'}
];

export const ENEMIES={
 sprout:{hp:1,speed:.9,damage:.8,r:14,color:'#79c56a'},fang:{hp:.9,speed:1.3,damage:.9,r:13,color:'#d6df72'},shaman:{hp:1.5,speed:.72,damage:1.2,r:18,color:'#8bd48a',ranged:true},
 scarab:{hp:1.15,speed:1.1,damage:1,r:15,color:'#e0a447'},raider:{hp:1.4,speed:1.0,damage:1.15,r:17,color:'#cb7048'},djinn:{hp:1.7,speed:.82,damage:1.35,r:19,color:'#ca8bea',ranged:true},
 wisp:{hp:.85,speed:1.45,damage:.9,r:12,color:'#9ce9ff'},wolf:{hp:1.25,speed:1.25,damage:1.1,r:16,color:'#b9d7e8'},frostmage:{hp:1.8,speed:.7,damage:1.45,r:19,color:'#74bfff',ranged:true},
 eye:{hp:1.1,speed:1.2,damage:1.1,r:14,color:'#d885ff'},crawler:{hp:1.6,speed:1.05,damage:1.3,r:18,color:'#8f68bf'},warlock:{hp:2,speed:.68,damage:1.6,r:20,color:'#bc72ff',ranged:true}
};

export const BOSSES={
 ancient:{name:{ru:'Древний Страж',en:'Ancient Guardian'},hp:1,speed:.8,r:44,color:'#8bd36c',pattern:'slam',telegraph:'#d7ff9a'},
 colossus:{name:{ru:'Песчаный Колосс',en:'Sand Colossus'},hp:1.25,speed:.68,r:49,color:'#e29a4d',pattern:'charge',telegraph:'#ffd28c'},
 wyrm:{name:{ru:'Ледяной Змей',en:'Frost Wyrm'},hp:1.15,speed:1.0,r:45,color:'#72cfff',pattern:'spiral',telegraph:'#d5f5ff'},
 voidlord:{name:{ru:'Владыка Бездны',en:'Void Lord'},hp:1.5,speed:.82,r:52,color:'#bb65ff',pattern:'teleport',telegraph:'#f3c2ff'}
};

export const WEAPONS=[
 {id:'arc',name:{ru:'Звёздная дуга',en:'Star Arc'},max:5,kind:'projectile',baseDamage:1,rate:1,icon:'✦',color:'#ffe274'},
 {id:'orbit',name:{ru:'Кольцо стража',en:'Guardian Ring'},max:5,kind:'orbit',baseDamage:.65,rate:.15,icon:'◉',color:'#8cf2ff'},
 {id:'nova',name:{ru:'Небесная нова',en:'Sky Nova'},max:5,kind:'pulse',baseDamage:1.4,rate:3.2,icon:'✺',color:'#c58cff'},
 {id:'blades',name:{ru:'Теневые клинки',en:'Shadow Blades'},max:5,kind:'spread',baseDamage:.8,rate:.7,icon:'◆',color:'#ff8cc6'},
 {id:'storm',name:{ru:'Грозовая печать',en:'Storm Sigil'},max:5,kind:'area',baseDamage:1.7,rate:2.4,icon:'ϟ',color:'#9cb7ff'},
 {id:'flame',name:{ru:'Дыхание дракона',en:'Dragon Breath'},max:5,kind:'cone',baseDamage:.45,rate:.12,icon:'♨',color:'#ff8f62'}
];

export const EVOLUTIONS=[
 {weapon:'arc',requires:'owl',id:'constellation',name:{ru:'Созвездие',en:'Constellation'},bonus:'multishot'},
 {weapon:'orbit',requires:'wolf',id:'moon_guard',name:{ru:'Лунный караул',en:'Moon Guard'},bonus:'double_orbit'},
 {weapon:'nova',requires:'slime',id:'life_star',name:{ru:'Звезда жизни',en:'Life Star'},bonus:'heal_pulse'},
 {weapon:'blades',requires:'fox',id:'nine_tails',name:{ru:'Девять хвостов',en:'Nine Tails'},bonus:'nine_blades'},
 {weapon:'flame',requires:'dragon',id:'elder_flame',name:{ru:'Древнее пламя',en:'Elder Flame'},bonus:'burn'}
];

export const SKINS={
 knight:[
  {id:'royal',unlock:0,name:{ru:'Королевский',en:'Royal'},body:'#75a7ff',accent:'#ffd75e'},
  {id:'obsidian',unlock:3,name:{ru:'Обсидиан',en:'Obsidian'},body:'#4a4d68',accent:'#b870ff'},
  {id:'sunforged',unlock:8,name:{ru:'Солнечная сталь',en:'Sunforged'},body:'#f4a742',accent:'#fff2a8'}
 ],
 mage:[
  {id:'astral',unlock:0,name:{ru:'Астральная',en:'Astral'},body:'#bd7dff',accent:'#75e8ff'},
  {id:'ember',unlock:3,name:{ru:'Угольная',en:'Ember'},body:'#d76070',accent:'#ffbc6c'},
  {id:'void',unlock:8,name:{ru:'Бездны',en:'Void'},body:'#58346d',accent:'#df8cff'}
 ],
 ranger:[
  {id:'wild',unlock:0,name:{ru:'Лесная',en:'Wild'},body:'#68e39a',accent:'#d7f07a'},
  {id:'dune',unlock:3,name:{ru:'Пустынная',en:'Dune'},body:'#d49b55',accent:'#ffe1a3'},
  {id:'frost',unlock:8,name:{ru:'Северная',en:'Frost'},body:'#6dc5dd',accent:'#dff8ff'}
 ],
 berserk:[
  {id:'iron',unlock:0,name:{ru:'Железный',en:'Iron'},body:'#ff6b67',accent:'#d7d9e5'},
  {id:'bone',unlock:3,name:{ru:'Костяной',en:'Bone'},body:'#b98063',accent:'#f3ddb9'},
  {id:'inferno',unlock:8,name:{ru:'Инферно',en:'Inferno'},body:'#b63c35',accent:'#ffb14f'}
 ],
 rogue:[
  {id:'night',unlock:0,name:{ru:'Ночной',en:'Night'},body:'#ffd15c',accent:'#6a6d91'},
  {id:'neon',unlock:3,name:{ru:'Неоновый',en:'Neon'},body:'#55d9c5',accent:'#ff67cf'},
  {id:'phantom',unlock:8,name:{ru:'Фантом',en:'Phantom'},body:'#9a7de8',accent:'#d9ceff'}
 ]
};

export const META_UPGRADES=[
 {id:'power',max:10,baseCost:80,name:{ru:'Сила отряда',en:'Squad Power'},desc:{ru:'+3% урона за уровень',en:'+3% damage per level'}},
 {id:'vitality',max:10,baseCost:80,name:{ru:'Закалка',en:'Vitality'},desc:{ru:'+3% здоровья за уровень',en:'+3% health per level'}},
 {id:'fortune',max:8,baseCost:120,name:{ru:'Удача',en:'Fortune'},desc:{ru:'+2% удачи за уровень',en:'+2% luck per level'}},
 {id:'magnet',max:8,baseCost:100,name:{ru:'Притяжение',en:'Attraction'},desc:{ru:'+5% радиуса сбора',en:'+5% pickup radius'}}
];

export const ACHIEVEMENTS=[
 {id:'first_blood',goal:1,reward:50,name:{ru:'Первая кровь',en:'First Blood'}},
 {id:'hundred',goal:100,reward:100,name:{ru:'Охотник',en:'Hunter'}},
 {id:'survivor5',goal:300,reward:150,name:{ru:'Пять минут',en:'Five Minutes'}},
 {id:'boss1',goal:1,reward:200,name:{ru:'Охотник на боссов',en:'Boss Hunter'}},
 {id:'victory1',goal:1,reward:350,name:{ru:'Первый триумф',en:'First Triumph'}}
];

export function localized(entry,lang='en'){return entry?.[lang]??entry?.en??''}
