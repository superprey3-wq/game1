export class YandexBridge {
  constructor(){this.ysdk=null;this.player=null;this.lang='en';this.ready=false}
  async init(){
    try{
      if(!window.YaGames) return this._fallback();
      this.ysdk=await window.YaGames.init();
      this.lang=this.ysdk.environment?.i18n?.lang||'en';
      try{this.player=await this.ysdk.getPlayer({scopes:false})}catch{}
      this.ysdk.features?.LoadingAPI?.ready?.();
      this.ready=true; return this;
    }catch(e){console.warn('Yandex SDK fallback',e);return this._fallback()}
  }
  _fallback(){this.lang=(navigator.language||'en').slice(0,2);this.ready=true;return this}
  gameplayStart(){try{this.ysdk?.features?.GameplayAPI?.start?.()}catch{}}
  gameplayStop(){try{this.ysdk?.features?.GameplayAPI?.stop?.()}catch{}}
  async save(data){localStorage.setItem('arena_companions_save',JSON.stringify(data));try{if(this.player)await this.player.setData({save:data},true)}catch(e){console.warn(e)}}
  async load(){try{if(this.player){const d=await this.player.getData(['save']);if(d?.save)return d.save}}catch{}try{return JSON.parse(localStorage.getItem('arena_companions_save')||'null')}catch{return null}}
  async fullscreen(){return new Promise(resolve=>{if(!this.ysdk?.adv?.showFullscreenAdv)return resolve(false);this.gameplayStop();this.ysdk.adv.showFullscreenAdv({callbacks:{onClose:()=>{this.gameplayStart();resolve(true)},onError:()=>{this.gameplayStart();resolve(false)},onOffline:()=>{this.gameplayStart();resolve(false)}}})})}
  async rewarded(){return new Promise(resolve=>{if(!this.ysdk?.adv?.showRewardedVideo)return resolve(false);let rewarded=false;this.gameplayStop();this.ysdk.adv.showRewardedVideo({callbacks:{onRewarded:()=>rewarded=true,onClose:()=>{this.gameplayStart();resolve(rewarded)},onError:()=>{this.gameplayStart();resolve(false)}}})})}
}
