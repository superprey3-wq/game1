import {WORLDS,META_UPGRADES,ACHIEVEMENTS} from './content.js';

export function normalizeSave(raw={}){
  return {
    best:Number(raw.best||0), runs:Number(raw.runs||0), kills:Number(raw.kills||0),
    victories:Number(raw.victories||0), bosses:Number(raw.bosses||0), coins:Number(raw.coins||0),
    worldWins:{...(raw.worldWins||{})}, meta:{...(raw.meta||{})}, achievements:{...(raw.achievements||{})},
    unlockedHeroes:Array.isArray(raw.unlockedHeroes)?raw.unlockedHeroes:['knight','mage','ranger','berserk','rogue'],
    unlockedPets:Array.isArray(raw.unlockedPets)?raw.unlockedPets:['fox','owl','slime','dragon','wolf']
  };
}

export function worldUnlocked(world,save){return (save.victories||0)>=world.unlock}
export function availableWorlds(save){return WORLDS.filter(w=>worldUnlocked(w,save))}
export function metaLevel(save,id){return Number(save.meta?.[id]||0)}
export function metaCost(def,level){return Math.floor(def.baseCost*Math.pow(1.42,level))}
export function buyMeta(save,id){
  const def=META_UPGRADES.find(x=>x.id===id); if(!def)return {ok:false};
  const level=metaLevel(save,id); if(level>=def.max)return {ok:false,reason:'max'};
  const cost=metaCost(def,level); if(save.coins<cost)return {ok:false,reason:'coins',cost};
  save.coins-=cost; save.meta[id]=level+1; return {ok:true,cost,level:level+1};
}

export function applyMeta(player,save){
  player.damage*=1+metaLevel(save,'power')*.03;
  player.maxHp*=1+metaLevel(save,'vitality')*.03; player.hp=player.maxHp;
  player.crit=Math.min(.65,(player.crit||0)+metaLevel(save,'fortune')*.02);
  player.pickup*=1+metaLevel(save,'magnet')*.05;
}

export function runRewards({elapsed=0,kills=0,bosses=0,win=false}){
  const base=Math.floor(elapsed/6)+Math.floor(kills*.35)+bosses*25+(win?180:0);
  return Math.max(10,base);
}

export function updateAchievements(save,stats){
  const values={first_blood:stats.kills,hundred:save.kills,survivor5:stats.elapsed,boss1:save.bosses,victory1:save.victories};
  let gained=0;
  for(const a of ACHIEVEMENTS){
    if(save.achievements[a.id])continue;
    if((values[a.id]||0)>=a.goal){save.achievements[a.id]=true;save.coins+=a.reward;gained+=a.reward}
  }
  return gained;
}

export function completeRun(save,{elapsed,kills,bosses=0,win=false,worldId='emerald'}){
  save.best=Math.max(save.best,elapsed); save.runs++; save.kills+=kills; save.bosses+=bosses;
  if(win){save.victories++;save.worldWins[worldId]=(save.worldWins[worldId]||0)+1}
  const coins=runRewards({elapsed,kills,bosses,win}); save.coins+=coins;
  const achievementCoins=updateAchievements(save,{elapsed,kills,bosses,win});
  return {coins,achievementCoins};
}
