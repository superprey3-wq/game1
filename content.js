// Arena of Companions production content catalog.
// Keep gameplay data separate from rendering so new worlds/content can be added safely.
export const WORLDS=[
 {id:'emerald',unlock:0,duration:600,name:{ru:'Изумрудная чаща',en:'Emerald Wilds'},theme:{ground:'#10291f',grid:'#2e5a3d'},enemies:['sprout','fang','shaman'],boss:'ancient'},
 {id:'dunes',unlock:3,duration:600,name:{ru:'Пепельные дюны',en:'Ashen Dunes'},theme:{ground:'#342318',grid:'#765333'},enemies:['scarab','raider','djinn'],boss:'colossus'},
 {id:'frost',unlock:7,duration:660,name:{ru:'Ледяной предел',en:'Frostbound Reach'},theme:{ground:'#132936',grid:'#37677b'},enemies:['wisp','wolf','frostmage'],boss:'wyrm'},
 {id:'abyss',unlock:12,duration:720,name:{ru:'Бездна',en:'The Abyss'},theme:{ground:'#21152e',grid:'#513268'},enemies:['eye','crawler','warlock'],boss:'voidlord'}
];

export const WEAPONS=[
 {id:'arc',name:{ru:'Звёздная дуга',en:'Star Arc'},max:5,kind:'projectile'},
 {id:'orbit',name:{ru:'Кольцо стража',en:'Guardian Ring'},max:5,kind:'orbit'},
 {id:'nova',name:{ru:'Небесная нова',en:'Sky Nova'},max:5,kind:'pulse'},
 {id:'blades',name:{ru:'Теневые клинки',en:'Shadow Blades'},max:5,kind:'projectile'},
 {id:'storm',name:{ru:'Грозовая печать',en:'Storm Sigil'},max:5,kind:'area'},
 {id:'flame',name:{ru:'Дыхание дракона',en:'Dragon Breath'},max:5,kind:'cone'}
];

export const EVOLUTIONS=[
 {weapon:'arc',requires:'owl',id:'constellation',name:{ru:'Созвездие',en:'Constellation'}},
 {weapon:'orbit',requires:'wolf',id:'moon_guard',name:{ru:'Лунный караул',en:'Moon Guard'}},
 {weapon:'nova',requires:'slime',id:'life_star',name:{ru:'Звезда жизни',en:'Life Star'}},
 {weapon:'blades',requires:'fox',id:'nine_tails',name:{ru:'Девять хвостов',en:'Nine Tails'}},
 {weapon:'flame',requires:'dragon',id:'elder_flame',name:{ru:'Древнее пламя',en:'Elder Flame'}}
];

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
