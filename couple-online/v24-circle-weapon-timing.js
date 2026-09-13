// v24: temporary weapons for circle fight
// Equipped weapons last about 4 seconds. Unclaimed pickups vanish after about 6 seconds.
if(typeof v23MoveFighter==='function'){
  const V24_OLD_MOVE=v23MoveFighter;
  v23MoveFighter=function(f,s,dt){
    V24_OLD_MOVE(f,s,dt);
    if(f?.weapon&&Number.isFinite(f.weaponUntil)&&f.weaponUntil-s.time>4000)f.weaponUntil=s.time+4000;
  };
}
if(typeof v23Step==='function'){
  const V24_OLD_STEP=v23Step;
  v23Step=function(s,dt){
    if(Array.isArray(s?.pickups))s.pickups=s.pickups.filter(p=>s.time-Number(p?.born||0)<6000);
    V24_OLD_STEP(s,dt);
  };
}
if(typeof v19Badge==='function'){
  const V24_OLD_BADGE=v19Badge;
  v19Badge=function(id,key){if(id==='circlefight')return'автобой · оружие временное';return V24_OLD_BADGE(id,key)};
}