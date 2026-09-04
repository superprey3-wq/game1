// Extra RU localization + input cleanup for the Yandex build.
(function(){
'use strict';
// game1-patch previously reused F for attack while Moonfang uses F for Deeds.
// Keep the original action: Z/J/LMB attack, F opens Deeds.
addEventListener('keydown',function(e){
  if((e.key||'').toLowerCase()!=='f')return;
  if(typeof pending!=='undefined'&&!e.repeat) pending.feats=true;
  e.preventDefault(); e.stopImmediatePropagation();
},true);

const RU={
"MOONFANG CASTLE":"ЗАМОК ЛУННОГО КЛЫКА",
"NINE STAGES STAND BETWEEN YOU AND THE MOONFANG":"ДЕВЯТЬ ЭТАПОВ ОТДЕЛЯЮТ ТЕБЯ ОТ ЛУННОГО КЛЫКА",
"BLESSINGS:":"БЛАГОСЛОВЕНИЯ:","THE FORGE":"КУЗНИЦА","RELIC SATCHEL":"СУМКА РЕЛИКВИЙ",
"WORN":"НАДЕТО","BAG":"СУМКА","RESONANCE:":"РЕЗОНАНС:","PREFIX POWER":"СИЛА ЭФФЕКТА",
"THE HUNTER'S CHART":"КАРТА ОХОТНИКА","WALKED":"ИССЛЕДОВАНО",
"GOLD SHRINE  ORANGE FORGE  GREEN MERCHANT  CYAN OBELISK  PURPLE GUARDIAN":"ЗОЛОТО — СВЯТИЛИЩЕ  ОРАНЖ — КУЗНИЦА  ЗЕЛЁНЫЙ — ТОРГОВЕЦ  ГОЛУБОЙ — ОБЕЛИСК  ФИОЛЕТОВЫЙ — СТРАЖ",
"ALONG THE CASTLE":"ПО ЗАМКУ","GOLD FLECKS MARK WAYS YOU HAVE NOT WALKED":"ЗОЛОТЫЕ МЕТКИ ПОКАЗЫВАЮТ НЕИССЛЕДОВАННЫЕ ПУТИ",
"MARK THIS SPOT":"ОТМЕТИТЬ МЕСТО","WARP":"ПЕРЕМЕСТИТЬСЯ","CHART":"КАРТА",
"ITS PAIRINGS ARE UNKNOWN TO YOU":"ЕГО СОЧЕТАНИЯ ТЕБЕ ЕЩЁ НЕИЗВЕСТНЫ",
"BIND AN ATTRIBUTE TO SEE THE PAIRING":"СВЯЖИ СО СВОЙСТВОМ, ЧТОБЫ УВИДЕТЬ СОЧЕТАНИЕ",
"BIND AN ACTION TO SEE THE PAIRING":"СВЯЖИ С ДЕЙСТВИЕМ, ЧТОБЫ УВИДЕТЬ СОЧЕТАНИЕ",
"BIND ONE ACTION AND ONE ATTRIBUTE":"СВЯЖИ ДЕЙСТВИЕ И ОДНО СВОЙСТВО",
"DEED:":"ДОСТИЖЕНИЕ:","PHASE":"ФАЗА","NONE":"НЕТ","NONE BOUND":"НЕ СВЯЗАНО",
"TECHNIQUES":"ТЕХНИКИ","RANKS LEARNED":"РАНГОВ ИЗУЧЕНО","SKILLS":"НАВЫКИ","CURSES":"ПРОКЛЯТИЯ",
"CONTROLS":"УПРАВЛЕНИЕ","WALK":"ДВИЖЕНИЕ","CROUCH":"ПРИСЕСТЬ","DROP THROUGH A LEDGE":"СПРЫГНУТЬ С ПЛАТФОРМЫ",
"JUMP  (AGAIN IN AIR)":"ПРЫЖОК  (ЕЩЁ РАЗ В ВОЗДУХЕ)","STRIKE":"УДАР","THROW THE SUB-WEAPON":"БРОСИТЬ ДОП. ОРУЖИЕ",
"MOONLIT PLUNGE":"ЛУННЫЙ УДАР ВНИЗ","CHARGE THE CRESCENT":"ЗАРЯДИТЬ ПОЛУМЕСЯЦ","BACKDASH":"РЫВОК НАЗАД",
"PHANTOM STEP":"ПРИЗРАЧНЫЙ ШАГ","CLING;  X TO LEAP OFF":"ЦЕПЛЯТЬСЯ; X — ОТПРЫГНУТЬ","PRAY / TRADE / REST":"МОЛИТЬСЯ / ТОРГОВАТЬ / ОТДОХНУТЬ",
"THE FORGE MATRIX":"МЕНЮ КУЗНИЦЫ","DRAW A WEAPON":"ВЫБРАТЬ ОРУЖИЕ","ITEM CRASH":"СУПЕРУДАР","MUSIC":"МУЗЫКА","VOLUME":"ГРОМКОСТЬ",
"DEBUG OVERLAY":"ОТЛАДКА","RESUME THE HUNT":"ПРОДОЛЖИТЬ ОХОТУ","THINGS MAY BE MADE HERE":"ПРЕДМЕТОВ МОЖНО СОЗДАТЬ ЗДЕСЬ",
"YOU ALREADY CARRY IT":"ЭТО УЖЕ У ТЕБЯ ЕСТЬ","YOU ALREADY HOLD THIS ARCANA":"ЭТОТ АРКАН УЖЕ У ТЕБЯ",
"THIS WEAPON IS FULLY TEMPERED":"ОРУЖИЕ УЖЕ ПОЛНОСТЬЮ ЗАКАЛЕНО","YOU CARRY NO SUB-WEAPON TO INFUSE":"НЕТ ДОП. ОРУЖИЯ ДЛЯ ЗАЧАРОВАНИЯ",
"ALREADY BEATEN INTO YOUR ARM":"ЭТО УЖЕ ВПЛЕТЕНО В ТВОЁ ОРУЖИЕ","YOU CANNOT PAY FOR IT":"НЕ ХВАТАЕТ РЕСУРСОВ",
"THE MOONFANG IS BROKEN":"ЛУННЫЙ КЛЫК СЛОМЛЕН","THE CASTLE FALLS SILENT. THE MOON SETS AT LAST.":"ЗАМОК ЗАТИХАЕТ. ЛУНА НАКОНЕЦ ЗАХОДИТ.",
"BUT THE HUNT REMEMBERS ITS OWN.":"НО ОХОТА ПОМНИТ СВОИХ.","FIENDS SLAIN":"ВРАГОВ УБИТО","TREASURES":"СОКРОВИЩА","SOULS TAKEN":"ДУШ СОБРАНО",
"DEEDS EARNED":"ДОСТИЖЕНИЙ ПОЛУЧЕНО","TIMES CLEARED":"ПОБЕД","RETURN TO THE GATE":"ВЕРНУТЬСЯ К ВРАТАМ",
"MOONFANG FELLED":"ЛУННЫЙ КЛЫК ПОВЕРЖЕН","TODAY'S BEST":"РЕКОРД СЕГОДНЯ","SLAIN":"УБИТО","FORMS":"ФОРМЫ",
"UP  PRAY":"ВВЕРХ — МОЛИТЬСЯ","UP  RELICS    Q  CRAFT":"ВВЕРХ — РЕЛИКВИИ    Q — КУЗНИЦА","UP  TRADE":"ВВЕРХ — ТОРГОВАТЬ","UP  REST":"ВВЕРХ — ОТДОХНУТЬ",
"Z BUY":"Z — КУПИТЬ","Z LEARN":"Z — ИЗУЧИТЬ","Z WEAR":"Z — НАДЕТЬ","SALVAGE":"РАЗОБРАТЬ","TRANSMUTE":"ПРЕОБРАЗОВАТЬ","INFUSE":"ЗАЧАРОВАТЬ",
"ENTER TAKE THE ROAD":"ENTER — ВЫБРАТЬ ПУТЬ","ENTER  RETURN TO THE GATE":"ENTER — ВЕРНУТЬСЯ К ВРАТАМ"
};
function translate(s){
 if(window.GAME_LANG!=='ru'||typeof s!=='string')return s;
 let out=s;
 const keys=Object.keys(RU).sort((a,b)=>b.length-a.length);
 for(const k of keys) out=out.split(k).join(RU[k]);
 return out;
}
for(const name of ['drawText','drawTextShadow','drawTextCentered']){
 const old=window[name];
 if(typeof old==='function'&&!old.__g1extra){
   const fn=function(g,text,...rest){return old.call(this,g,translate(text),...rest)};
   fn.__g1extra=true; window[name]=fn;
 }
}
// Keep the title/menu readable in both languages and make the actual attack keys explicit.
const oldTitle=window.drawTitle;
if(typeof oldTitle==='function'){
 window.drawTitle=function(g){oldTitle(g);if(window.GAME_LANG==='ru'){
   const y=Math.max(8,VIEW_H-26);drawTextCentered(g,'АТАКА: Z / J / ЛКМ     ПРЫЖОК: X / SPACE     РЫВОК: C / SHIFT',VIEW_W/2,y,'#ffe080',1);
 }else{drawTextCentered(g,'ATTACK: Z / J / LMB     JUMP: X / SPACE     DASH: C / SHIFT',VIEW_W/2,VIEW_H-26,'#ffe080',1);}};
}
})();
