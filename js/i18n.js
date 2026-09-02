(function(){
const dict={
ru:{title:'Ночная Охота',play:'ИГРАТЬ',continue:'ПРОДОЛЖИТЬ',settings:'НАСТРОЙКИ',language:'ЯЗЫК',ru:'Русский',en:'English',controls:'УПРАВЛЕНИЕ',desktop:'ПК',mobile:'ТЕЛЕФОН',move:'Движение',jump:'Прыжок',attack:'Атака',dash:'Рывок',interact:'Действие',pause:'Пауза',loading:'Загрузка охоты…',hintPc:'A/D или ←/→ — движение · Space — прыжок · J/Z — атака · K/X — рывок · E — действие',hintMobile:'Используйте экранные кнопки для движения, прыжка, атаки и рывка.'},
en:{title:'Night Hunt',play:'PLAY',continue:'CONTINUE',settings:'SETTINGS',language:'LANGUAGE',ru:'Русский',en:'English',controls:'CONTROLS',desktop:'PC',mobile:'PHONE',move:'Move',jump:'Jump',attack:'Attack',dash:'Dash',interact:'Interact',pause:'Pause',loading:'Loading the hunt…',hintPc:'A/D or ←/→ — move · Space — jump · J/Z — attack · K/X — dash · E — interact',hintMobile:'Use the on-screen buttons to move, jump, attack and dash.'}
};
let lang='ru';
function norm(v){return String(v||'').toLowerCase().startsWith('ru')?'ru':'en'}
window.I18N={dict,get lang(){return lang},set(v,save=true){lang=norm(v);document.documentElement.lang=lang;if(save)try{localStorage.setItem('night-hunt-lang',lang)}catch(e){};window.dispatchEvent(new CustomEvent('languagechange',{detail:{lang}}));return lang},t(k){return dict[lang][k]||dict.en[k]||k},init(platformLang){let saved=null;try{saved=localStorage.getItem('night-hunt-lang')}catch(e){};return this.set(saved||platformLang||navigator.language,false)}};
})();
