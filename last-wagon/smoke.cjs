const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
const elements=new Map(), memory=new Map();
function el(){return {style:{},children:[],textContent:'',append(...n){this.children.push(...n)},replaceChildren(...n){this.children=n},addEventListener(){},getContext(){return new Proxy({},{get:()=>()=>{}})}}}
const doc={hidden:false,head:el(),getElementById(id){if(!elements.has(id))elements.set(id,el());return elements.get(id)},createElement:el,addEventListener(){}};
const context={console,document:doc,innerWidth:390,innerHeight:844,devicePixelRatio:1,window:{},addEventListener(){},requestAnimationFrame(){},setTimeout(){},clearTimeout(){},localStorage:{getItem:k=>memory.get(k),setItem:(k,v)=>memory.set(k,v)}};
vm.createContext(context);vm.runInContext(fs.readFileSync(__dirname+'/game.js','utf8'),context);
const evalJS=s=>vm.runInContext(s,context);
evalJS('start();tick(.04);draw(.016)');assert.equal(evalJS('mode'),'battle');
evalJS('run.time=59.99;tick(.02)');assert.equal(evalJS('mode'),'choice');
evalJS('run.wave=3;run.time=179.99;run.hp=run.max;enemies=[];spawn=99;setMode("battle");tick(.02)');assert.equal(evalJS('mode'),'result');assert.equal(evalJS('save.unlocked'),2);assert.equal(evalJS('save.cleared.length'),1);
const coins=evalJS('save.coins');evalJS('finish("win")');assert.equal(evalJS('save.coins'),coins);
evalJS('selected=2;start();run.coins=100;finish("loss")');assert.equal(evalJS('save.coins'),coins+35);assert.equal(evalJS('save.unlocked'),2);
evalJS('selected=1;start();pause()');assert.equal(evalJS('mode'),'paused');evalJS('resume()');assert.equal(evalJS('mode'),'battle');
evalJS('sdk={adv:{showRewardedVideo:({callbacks})=>{window.cb=callbacks}}}; window.grants=0;rewarded(()=>window.grants++)');assert.equal(evalJS('adBusy'),true);evalJS('window.cb.onRewarded();window.cb.onRewarded();window.cb.onClose()');assert.equal(evalJS('window.grants'),1);assert.equal(evalJS('adBusy'),false);
evalJS('rewarded(()=>window.grants++);window.cb.onClose()');assert.equal(evalJS('window.grants'),1);
evalJS('rewarded(()=>window.grants++);window.cb.onError()');assert.equal(evalJS('adBusy'),false);
evalJS('sdk=null;rewarded(()=>window.grants++)');assert.equal(evalJS('window.grants'),1);
assert.ok(memory.has('last-wagon-v1'));evalJS('depot();inventory();draw(.016)');
console.log('PASS: wave checkpoint, victory unlock, idempotent payout, loss payout, pause, rewarded success/duplicate/skip/error/offline, save, UI draw');
