export class YandexBridge {
  constructor(){this.ysdk=null;this.player=null;this.lang='en';this.ready=false;this.adOpen=false}
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
  gameplayStart(){if(this.adOpen)return;try{this.ysdk?.features?.GameplayAPI?.start?.()}catch{}}
  gameplayStop(){try{this.ysdk?.features?.GameplayAPI?.stop?.()}catch{}}
  _pauseForAd(){this.adOpen=true;this.gameplayStop();try{window.dispatchEvent(new CustomEvent('arena:adopen'))}catch{}}
  _resumeAfterAd(){this.adOpen=false;try{window.dispatchEvent(new CustomEvent('arena:adclose'))}catch{}}
  async save(data){localStorage.setItem('arena_companions_save',JSON.stringify(data));try{if(this.player)await this.player.setData({save:data},true)}catch(e){console.warn(e)}}
  async load(){try{if(this.player){const d=await this.player.getData(['save']);if(d?.save)return d.save}}catch{}try{return JSON.parse(localStorage.getItem('arena_companions_save')||'null')}catch{return null}}
  async fullscreen(){
    return new Promise(resolve=>{
      if(!this.ysdk?.adv?.showFullscreenAdv)return resolve(false);
      this._pauseForAd();
      let opened=false;
      this.ysdk.adv.showFullscreenAdv({callbacks:{
        onOpen:()=>{opened=true},
        onClose:(wasShown)=>{this._resumeAfterAd();resolve(Boolean(wasShown??opened))},
        onError:()=>{this._resumeAfterAd();resolve(false)},
        onOffline:()=>{this._resumeAfterAd();resolve(false)}
      }});
    });
  }
  async rewarded(){
    return new Promise(resolve=>{
      if(!this.ysdk?.adv?.showRewardedVideo)return resolve(false);
      let rewarded=false;this._pauseForAd();
      this.ysdk.adv.showRewardedVideo({callbacks:{
        onOpen:()=>{},
        onRewarded:()=>{rewarded=true},
        onClose:()=>{this._resumeAfterAd();resolve(rewarded)},
        onError:()=>{this._resumeAfterAd();resolve(false)}
      }});
    });
  }
  showSticky(){try{return this.ysdk?.adv?.showBannerAdv?.()}catch(e){console.warn(e)}}
  hideSticky(){try{return this.ysdk?.adv?.hideBannerAdv?.()}catch(e){console.warn(e)}}
}
