// Yandex Games cloud progress sync with localStorage fallback.
(function(){
'use strict';
const KEYS=['moonfang-meta','moonfang-run','moonfang-hi','game1-lang'];
let player=null, syncing=false;
function snapshot(){const out={};for(const k of KEYS){const v=localStorage.getItem(k);if(v!==null)out[k]=v;}return out;}
function apply(data){if(!data||typeof data!=='object')return;for(const k of KEYS){if(typeof data[k]==='string'&&localStorage.getItem(k)===null)localStorage.setItem(k,data[k]);}}
async function connect(){
  const ysdk=window.ysdk; if(!ysdk||typeof ysdk.getPlayer!=='function'||player)return;
  try{player=await ysdk.getPlayer({scopes:false});const cloud=await player.getData(['moonfangSave']);apply(cloud&&cloud.moonfangSave);window.dispatchEvent(new Event('game1-cloud-ready'));}catch(e){console.warn('Yandex save unavailable',e);}
}
async function save(){if(syncing)return;await connect();if(!player)return;syncing=true;try{await player.setData({moonfangSave:snapshot()},true);}catch(e){console.warn('Yandex save failed',e);}finally{syncing=false;}}
const rawSet=localStorage.setItem.bind(localStorage),rawRemove=localStorage.removeItem.bind(localStorage);
localStorage.setItem=function(k,v){rawSet(k,v);if(KEYS.includes(String(k)))setTimeout(save,0);};
localStorage.removeItem=function(k){rawRemove(k);if(KEYS.includes(String(k)))setTimeout(save,0);};
addEventListener('yandex-ready',()=>{connect().then(save);});
addEventListener('pagehide',()=>{save();});
setTimeout(()=>{connect().then(save);},1500);
window.Game1CloudSave={save,connect};
})();