'use strict';

document.title='Skybound Frog — Steel & Souls: V24 World Restored';
const m26=document.querySelector('#menu .panel p');
if(m26)m26.textContent='V24 WORLD RESTORED — мир, враги, лут и кузнец возвращены к состоянию v24. Из v25 оставлена только замена героя на зверька.';

// Restore v24 gameplay/world pipeline exactly. v25 saved these references before overriding them.
if(typeof makeBase25==='function')makeWorld=makeBase25;
if(typeof worldBase25==='function')drawWorld=worldBase25;
if(typeof nearBase25==='function')nearestInteractive=nearBase25;
if(typeof interactBase25==='function')interact=interactBase25;
if(typeof labelBase25==='function')interactLabel=labelBase25;

// Keep only the requested character swap from v25.
if(typeof drawBeastHero25==='function')drawPlayer=drawBeastHero25;

// Remove any v25 exit object if a world was somehow already created before this patch loaded.
if(w&&w.exit25){
 if(Number.isFinite(w.exit25.originalGoal))w.goal=w.exit25.originalGoal;
 delete w.exit25;
}

// Keep v24's start behavior/toast instead of the v25 gate setup message.
if(typeof startBase25==='function'){
 startGame=function(from=0){startBase25(from);toast='V24 WORLD RESTORED · ИЗМЕНЁН ТОЛЬКО ГЕРОЙ';toastT=3.5;};
}

refreshMeta();
