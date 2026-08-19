// Procedural WebAudio keeps the Yandex build tiny and avoids unlicensed music/assets.
export class AudioEngine{
 constructor(){this.ctx=null;this.enabled=true;this.music=true;this.master=.22;this.loopTimer=null}
 unlock(){if(!this.ctx){const C=window.AudioContext||window.webkitAudioContext;if(C)this.ctx=new C()}if(this.ctx?.state==='suspended')this.ctx.resume()}
 tone(freq=440,d=.08,type='sine',gain=.12){if(!this.enabled||!this.ctx)return;const o=this.ctx.createOscillator(),g=this.ctx.createGain();o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(gain*this.master,this.ctx.currentTime);g.gain.exponentialRampToValueAtTime(.0001,this.ctx.currentTime+d);o.connect(g).connect(this.ctx.destination);o.start();o.stop(this.ctx.currentTime+d)}
 shot(){this.tone(520,.045,'square',.08)}
 pickup(){this.tone(820,.06,'sine',.09)}
 level(){this.tone(660,.12,'triangle',.12);setTimeout(()=>this.tone(990,.16,'triangle',.1),80)}
 hit(){this.tone(105,.05,'sawtooth',.08)}
 boss(){this.tone(75,.35,'sawtooth',.15)}
 reward(){[660,880,1100].forEach((f,i)=>setTimeout(()=>this.tone(f,.16,'triangle',.11),i*90))}
 suspend(){try{this.ctx?.suspend()}catch{}}
 resume(){try{this.ctx?.resume()}catch{}}
 setEnabled(v){this.enabled=!!v;if(!v)this.suspend();else this.resume()}
}
