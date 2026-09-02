// Yandex Games platform bridge for the new game.
// Safe on GitHub Pages: all methods become no-ops when the SDK is unavailable.
(function(){
  let ysdk=null, player=null, readySent=false;
  const api={
    async init(){
      if(typeof YaGames==='undefined') return null;
      try{
        ysdk=await YaGames.init();
        window.ysdk=ysdk;
        try{ player=await ysdk.getPlayer(); }catch(e){}
        window.yandexPlayer=player;
        window.dispatchEvent(new CustomEvent('yandex-ready',{detail:{ysdk,player}}));
        return ysdk;
      }catch(e){ console.warn('Yandex SDK init failed',e); return null; }
    },
    ready(){ if(ysdk&&!readySent){ readySent=true; ysdk.features?.LoadingAPI?.ready(); } },
    gameplayStart(){ try{ysdk?.features?.GameplayAPI?.start();}catch(e){} },
    gameplayStop(){ try{ysdk?.features?.GameplayAPI?.stop();}catch(e){} },
    lang(){ return ysdk?.environment?.i18n?.lang || navigator.language?.slice(0,2) || 'ru'; },
    async load(keys){ if(!player)return {}; try{return await player.getData(keys);}catch(e){return {};} },
    async save(data){ if(!player)return false; try{await player.setData(data,true);return true;}catch(e){return false;} }
  };
  window.YandexBridge=api;
  document.addEventListener('visibilitychange',()=>document.hidden?api.gameplayStop():api.gameplayStart());
  window.addEventListener('blur',()=>api.gameplayStop());
  window.addEventListener('focus',()=>api.gameplayStart());
})();
