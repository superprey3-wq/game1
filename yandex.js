export class YandexBridge {
  constructor(){this.ysdk=null;this.player=null;this.lang='ru';this.ready=false}
  async init(){
    try{
      if(!window.YaGames) return this._fallback();
      this.ysdk=await window.YaGames.init();
      this.lang=this.ysdk.environment?.i18n?.lang||'ru';
      try{this.player=await this.ysdk.getPlayer({scopes:false})}catch{}
      this.ysdk.features?.LoadingAPI?.ready?.();
      this.ready=true;
      return this;
    }catch(e){console.warn('Yandex SDK fallback',e);return this._fallback()}
  }
  _fallback(){this.lang=(navigator.language||'ru').slice(0,2);this.ready=true;return this}
  gameplayStart(){try{this.ysdk?.features?.GameplayAPI?.start?.()}catch{}}
  gameplayStop(){try{this.ysdk?.features?.GameplayAPI?.stop?.()}catch{}}
  async save(data){
    try{localStorage.setItem('arena_companions_save_v2',JSON.stringify(data))}catch{}
    try{if(this.player)await this.player.setData({save:data},true)}catch(e){console.warn('cloud save',e)}
  }
  async load(){
    try{if(this.player){const d=await this.player.getData(['save']);if(d?.save)return d.save}}catch{}
    try{return JSON.parse(localStorage.getItem('arena_companions_save_v2')||localStorage.getItem('arena_companions_save')||'null')}catch{return null}
  }
  async fullscreen(){
    return new Promise(resolve=>{
      if(!this.ysdk?.adv?.showFullscreenAdv)return resolve(false);
      this.gameplayStop();
      this.ysdk.adv.showFullscreenAdv({callbacks:{onClose:(wasShown)=>resolve(!!wasShown),onError:()=>resolve(false)}});
    })
  }
  async rewarded(){
    return new Promise(resolve=>{
      if(!this.ysdk?.adv?.showRewardedVideo)return resolve(false);
      let rewarded=false;this.gameplayStop();
      this.ysdk.adv.showRewardedVideo({callbacks:{onRewarded:()=>rewarded=true,onClose:()=>resolve(rewarded),onError:()=>resolve(false)}});
    })
  }
  async submitScore(name,score){
    try{
      if(!this.ysdk?.leaderboards||!Number.isFinite(score))return false;
      if(this.ysdk.isAvailableMethod&&!(await this.ysdk.isAvailableMethod('leaderboards.setScore')))return false;
      await this.ysdk.leaderboards.setScore(name,Math.max(0,Math.floor(score)));
      return true;
    }catch(e){console.warn('leaderboard',e);return false}
  }
}
