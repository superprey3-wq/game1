import Phaser from 'phaser';

const WEAPONS = [
  {name:'Импульсная винтовка', cd:220, speed:760, damage:34, tint:0x6ffff0, scale:.15, count:1},
  {name:'Плазменный кастер', cd:430, speed:560, damage:58, tint:0x7dff7a, scale:.23, count:1},
  {name:'Ракетный блок', cd:820, speed:440, damage:92, tint:0xffb95a, scale:.28, count:3, spread:.14},
  {name:'Призматический лазер', cd:680, speed:980, damage:78, tint:0xe684ff, scale:.12, count:1, pierce:2},
  {name:'Цепная молния', cd:900, speed:0, damage:68, tint:0xa8d8ff, chain:true},
  {name:'Криопушка', cd:560, speed:500, damage:50, tint:0x8fe8ff, scale:.26, count:1, slow:true}
];

class Xenojungle extends Phaser.Scene {
  constructor(){ super('xeno'); }

  preload(){
    const base='https://raw.githubusercontent.com/ETdoFresh/kenney.nl/master/';
    this.load.image('hero',base+'Top-down%20Shooter/PNG/Man%20Blue/manBlue_gun.png');
    this.load.image('robot',base+'Top-down%20Shooter/PNG/Robot%201/robot1_hold.png');
    this.load.image('alien',base+'Platformer%20Pack%20Redux/PNG/Enemies/slimeBlue.png');
    this.load.image('ufo',base+'Alien%20UFO%20pack/PNG/Ships/shipBlue_manned.png');
    this.load.image('bolt',base+'Alien%20UFO%20pack/PNG/Lasers/laserBlue01.png');
    this.load.image('bolt2',base+'Alien%20UFO%20pack/PNG/Lasers/laserRed01.png');
    this.load.image('crate',base+'Top-down%20Shooter/PNG/Tiles/tile_129.png');
  }

  create(){
    this.cameras.main.setBackgroundColor('#04100e');
    this.physics.world.setBounds(0,0,3600,2400);
    this.makeWorld();

    this.enemies=this.physics.add.group();
    this.projectiles=this.physics.add.group();
    this.enemyProjectiles=this.physics.add.group();

    this.player=this.physics.add.sprite(1800,1200,'hero').setScale(.84).setCollideWorldBounds(true).setDepth(20);
    this.player.body.setCircle(28,18,18);
    this.player.setTint(0xdfffee);
    this.playerGlow=this.add.circle(this.player.x,this.player.y,58,0x73ffe2,.12).setDepth(5);

    this.orb=this.physics.add.sprite(this.player.x-90,this.player.y-70,'ufo').setScale(.38).setDepth(18).setTint(0x74fff0);
    this.orbGlow=this.add.circle(this.orb.x,this.orb.y,42,0x6ffff0,.18).setDepth(6);

    this.cameras.main.startFollow(this.player,true,.08,.08);
    this.cameras.main.setZoom(1.18);
    this.keys=this.input.keyboard.addKeys('W,A,S,D');

    this.xp=0; this.level=1; this.hp=100; this.maxHp=100; this.crystals=0; this.lastShot=0; this.weaponIndex=0; this.weaponLevel=[1,1,1,1,1,1]; this.upgradeOpen=false;
    this.lastOrbShot=0; this.boss=null;

    for(let i=0;i<22;i++) this.spawnEnemy(i%5);

    this.physics.add.overlap(this.projectiles,this.enemies,(p,e)=>this.hitEnemy(p,e));
    this.physics.add.overlap(this.enemyProjectiles,this.player,(p)=>{p.destroy();this.hurtPlayer(12);});
    this.physics.add.overlap(this.player,this.enemies,(_,e)=>{if(!this.hurtUntil||this.time.now>this.hurtUntil)this.hurtPlayer(e.boss?22:(e.type===3?16:9));});

    this.createHud();
    this.updateHud();
    this.time.delayedCall(48000,()=>this.spawnBoss());
    this.time.addEvent({delay:1500,loop:true,callback:()=>this.rangedEnemyFire()});
  }

  makeWorld(){
    const bg=this.add.graphics().setDepth(-50);
    bg.fillStyle(0x071712,1).fillRect(0,0,3600,2400);
    for(let i=0;i<620;i++){
      const x=Phaser.Math.Between(0,3600),y=Phaser.Math.Between(0,2400),r=Phaser.Math.Between(2,18);
      bg.fillStyle(Phaser.Math.RND.pick([0x0b2b22,0x123f2e,0x15543a,0x283a2d]),Phaser.Math.FloatBetween(.22,.62)).fillCircle(x,y,r);
    }

    for(let i=0;i<120;i++){
      const x=Phaser.Math.Between(60,3540),y=Phaser.Math.Between(60,2340),r=Phaser.Math.Between(24,62);
      const shadow=this.add.ellipse(x+10,y+18,r*2.1,r*.7,0x000000,.28).setDepth(-16);
      const bush=this.add.container(x,y).setDepth(-14);
      bush.add(this.add.circle(0,0,r,0x1f6b45,.95));
      bush.add(this.add.circle(-r*.28,-r*.18,r*.48,0x3aa75d,.82));
      bush.add(this.add.circle(r*.27,-r*.1,r*.36,0x7de27a,.48));
      if(i%5===0) bush.add(this.add.circle(0,-r*.25,r*.12,0xc66cff,.8));
      this.tweens.add({targets:bush,angle:Phaser.Math.Between(-3,3),duration:Phaser.Math.Between(1800,3400),yoyo:true,repeat:-1,ease:'Sine.InOut'});
    }

    for(let i=0;i<48;i++){
      const x=Phaser.Math.Between(120,3480),y=Phaser.Math.Between(120,2280),s=Phaser.Math.Between(18,42);
      this.add.ellipse(x+5,y+13,s*1.5,s*.45,0x000000,.28).setDepth(-13);
      const glow=this.add.circle(x,y,s*1.25,0x62ffe1,.08).setDepth(-12);
      const crystal=this.add.triangle(x,y,0,-s*.9,-s*.55,s*.65,s*.55,s*.65,0x68ffe1,.92).setDepth(-11);
      this.tweens.add({targets:[glow,crystal],alpha:{from:.55,to:1},duration:Phaser.Math.Between(900,1800),yoyo:true,repeat:-1});
    }

    for(let i=0;i<34;i++){
      const x=Phaser.Math.Between(100,3500),y=Phaser.Math.Between(100,2300),w=Phaser.Math.Between(70,150),h=Phaser.Math.Between(30,68);
      this.add.rectangle(x+7,y+12,w,h,0x000000,.24).setDepth(-12).setAngle(Phaser.Math.Between(0,180));
      this.add.rectangle(x,y,w,h,Phaser.Math.RND.pick([0x34483f,0x4d5e54,0x273a35]),.88).setDepth(-11).setAngle(Phaser.Math.Between(0,180)).setStrokeStyle(2,0x75b99a,.4);
    }

    const fog=this.add.graphics().setDepth(-5);
    for(let i=0;i<16;i++){
      const x=Phaser.Math.Between(0,3600),y=Phaser.Math.Between(0,2400),r=Phaser.Math.Between(160,320);
      fog.fillStyle(0x58d9a1,.025).fillCircle(x,y,r);
    }
  }

  createHud(){
    this.hud=this.add.text(28,22,'',{fontFamily:'Arial',fontSize:'20px',fontStyle:'bold',color:'#eafff6',stroke:'#04100e',strokeThickness:6}).setScrollFactor(0).setDepth(200);
    this.weaponText=this.add.text(28,56,'',{fontFamily:'Arial',fontSize:'16px',fontStyle:'bold',color:'#8fffe0',stroke:'#04100e',strokeThickness:5}).setScrollFactor(0).setDepth(200);
    this.bossText=this.add.text(this.scale.width/2,28,'КСЕНОДЖУНГЛИ',{fontSize:'28px',fontStyle:'bold',color:'#a8ffcf',stroke:'#04100e',strokeThickness:7}).setOrigin(.5,0).setScrollFactor(0).setDepth(200);

    this.hpBg=this.add.rectangle(28,92,300,16,0x081411,.9).setOrigin(0,.5).setScrollFactor(0).setDepth(200).setStrokeStyle(2,0x7df5c7,.6);
    this.hpBar=this.add.rectangle(31,92,294,10,0x4ff0a5,1).setOrigin(0,.5).setScrollFactor(0).setDepth(201);
    this.xpBg=this.add.rectangle(28,116,300,10,0x081411,.85).setOrigin(0,.5).setScrollFactor(0).setDepth(200);
    this.xpBar=this.add.rectangle(31,116,294,6,0x7d8cff,1).setOrigin(0,.5).setScrollFactor(0).setDepth(201);

    this.upgradePanel=this.add.container(this.scale.width/2,this.scale.height/2).setScrollFactor(0).setDepth(400).setVisible(false);
    const panelBg=this.add.rectangle(0,0,850,340,0x05110f,.96).setStrokeStyle(3,0x64ffd7,.65);
    const title=this.add.text(0,-135,'ВЫБЕРИ УЛУЧШЕНИЕ',{fontSize:'28px',fontStyle:'bold',color:'#effff8'}).setOrigin(.5);
    this.upgradePanel.add([panelBg,title]);
  }

  spawnEnemy(type){
    const angle=Phaser.Math.FloatBetween(0,Math.PI*2),d=Phaser.Math.Between(520,900);
    let x=Phaser.Math.Clamp(this.player?this.player.x+Math.cos(angle)*d:1800,80,3520),y=Phaser.Math.Clamp(this.player?this.player.y+Math.sin(angle)*d:1200,80,2320);
    const key=type===2||type===3?'robot':'alien';
    const e=this.enemies.create(x,y,key).setDepth(16);
    e.type=type; e.hp=[58,78,68,170,100][type]; e.maxHp=e.hp; e.speed=[132,76,108,54,68][type];
    e.setScale(type===3?1.3:(type===2?.78:.84));
    e.setTint([0x83ffab,0xff8d76,0x6fdcff,0xffc85f,0xd982ff][type]);
    e.phaseOffset=Phaser.Math.FloatBetween(0,Math.PI*2);
    if(type===4) this.tweens.add({targets:e,scaleX:e.scaleX*1.08,scaleY:e.scaleY*1.08,duration:800,yoyo:true,repeat:-1});
  }

  spawnBoss(){
    if(this.boss) return;
    const e=this.enemies.create(Phaser.Math.Clamp(this.player.x+720,200,3400),this.player.y,'alien').setDepth(18).setScale(3.4).setTint(0xff5c92);
    e.type=5;e.hp=1900;e.maxHp=1900;e.speed=44;e.boss=true;e.phase2=false;this.boss=e;
    e.aura=this.add.circle(e.x,e.y,150,0xff4c9b,.10).setDepth(10);
    this.tweens.add({targets:e.aura,scale:1.25,alpha:.03,duration:700,yoyo:true,repeat:-1});
    this.bossText.setText('⚠ КОРОЛЕВА КСЕНО ⚠').setColor('#ff8eb1');
    this.cameras.main.flash(380,145,15,70);this.cameras.main.shake(350,.008);
  }

  update(t){
    if(!this.player || this.upgradeOpen) return;
    let vx=(this.keys.D.isDown?1:0)-(this.keys.A.isDown?1:0),vy=(this.keys.S.isDown?1:0)-(this.keys.W.isDown?1:0);
    const v=new Phaser.Math.Vector2(vx,vy).normalize().scale(250);
    this.player.setVelocity(v.x,v.y);
    if(v.length()>0) this.player.rotation=Math.atan2(v.y,v.x);

    this.playerGlow.setPosition(this.player.x,this.player.y);
    const orbTarget=new Phaser.Math.Vector2(this.player.x-70,this.player.y-65);
    this.orb.x=Phaser.Math.Linear(this.orb.x,orbTarget.x,.08);this.orb.y=Phaser.Math.Linear(this.orb.y,orbTarget.y,.08);this.orbGlow.setPosition(this.orb.x,this.orb.y);

    let target=null,dist=1e9;
    this.enemies.children.iterate(e=>{
      if(!e)return;
      const d=Phaser.Math.Distance.Between(this.player.x,this.player.y,e.x,e.y);
      if(d<dist){dist=d;target=e;}
      const desired=e.type===1||e.type===2||e.type===4?(d<250?0:e.speed):e.speed;
      if(desired>0)this.physics.moveToObject(e,this.player,desired);else e.setVelocity(0,0);
      if(e.boss&&e.aura)e.aura.setPosition(e.x,e.y);
      if(e.boss&&!e.phase2&&e.hp<e.maxHp*.5){e.phase2=true;e.speed=68;e.setTint(0xff2d6f);this.cameras.main.flash(250,255,40,110);this.cameras.main.shake(280,.01);this.bossText.setText('КОРОЛЕВА КСЕНО — ФАЗА II');}
    });

    if(target){
      const aim=Math.atan2(target.y-this.player.y,target.x-this.player.x);this.player.rotation=aim;
      const w=WEAPONS[this.weaponIndex];
      if(t>this.lastShot+w.cd/Math.max(1,this.weaponLevel[this.weaponIndex]*.12+1)){this.lastShot=t;this.fireWeapon(target,w);}
      if(t>this.lastOrbShot+850){this.lastOrbShot=t;this.fireOrb(target);}
    }
  }

  fireWeapon(target,w){
    if(w.chain){this.fireChain(target,w);return;}
    const count=w.count||1;
    for(let i=0;i<count;i++){
      const p=this.projectiles.create(this.player.x,this.player.y,'bolt').setScale(w.scale||.16).setTint(w.tint).setDepth(25);
      p.damage=w.damage*(1+(this.weaponLevel[this.weaponIndex]-1)*.18);p.pierce=w.pierce||0;p.slow=w.slow||false;
      const base=Math.atan2(target.y-this.player.y,target.x-this.player.x),spread=(w.spread||0)*(i-(count-1)/2);
      p.rotation=base+Math.PI/2+spread;
      p.setVelocity(Math.cos(base+spread)*w.speed,Math.sin(base+spread)*w.speed);
      this.add.circle(this.player.x,this.player.y,22,w.tint,.22).setDepth(19);
      this.time.delayedCall(1300,()=>p.active&&p.destroy());
    }
    this.tweens.add({targets:this.player,scaleX:.9,scaleY:.76,duration:70,yoyo:true});
  }

  fireOrb(target){
    const p=this.projectiles.create(this.orb.x,this.orb.y,'bolt').setScale(.11).setTint(0x8ffff0).setDepth(24);p.damage=18;p.pierce=0;
    this.physics.moveToObject(p,target,720);this.time.delayedCall(900,()=>p.active&&p.destroy());
    this.tweens.add({targets:this.orbGlow,scale:1.45,alpha:.35,duration:80,yoyo:true});
  }

  fireChain(target,w){
    let chain=[target],current=target;
    for(let i=0;i<3;i++){
      let next=null,bd=220;
      this.enemies.children.iterate(e=>{if(!e||chain.includes(e))return;const d=Phaser.Math.Distance.Between(current.x,current.y,e.x,e.y);if(d<bd){bd=d;next=e;}});
      if(next){chain.push(next);current=next;}
    }
    let sx=this.player.x,sy=this.player.y;
    chain.forEach((e,i)=>{const line=this.add.line(0,0,sx,sy,e.x,e.y,w.tint,1).setOrigin(0,0).setDepth(30).setLineWidth(3,1);this.tweens.add({targets:line,alpha:0,duration:150,onComplete:()=>line.destroy()});e.hp-=w.damage*(1-i*.15);this.flash(e);if(e.hp<=0)this.killEnemy(e);sx=e.x;sy=e.y;});
  }

  hitEnemy(p,e){
    if(!p.active||!e.active)return;
    e.hp-=p.damage||34;if(p.slow)e.speed*=.82;this.flash(e);
    const burst=this.add.circle(p.x,p.y,18,p.tintTopLeft||0x72ffd8,.35).setDepth(28);this.tweens.add({targets:burst,scale:1.8,alpha:0,duration:160,onComplete:()=>burst.destroy()});
    if((p.pierce||0)>0)p.pierce--;else p.destroy();
    if(e.hp<=0)this.killEnemy(e);
  }

  rangedEnemyFire(){
    if(this.upgradeOpen)return;
    this.enemies.children.iterate(e=>{
      if(!e||!e.active)return;
      const d=Phaser.Math.Distance.Between(e.x,e.y,this.player.x,this.player.y);
      if((e.type===1||e.type===2||e.type===4||e.boss)&&d<700){
        const shots=e.boss?(e.phase2?7:4):1;
        for(let i=0;i<shots;i++){
          const p=this.enemyProjectiles.create(e.x,e.y,'bolt2').setScale(e.boss?.22:.12).setTint(e.boss?0xff4d8f:0xff765f).setDepth(24);
          const base=Math.atan2(this.player.y-e.y,this.player.x-e.x),spread=(i-(shots-1)/2)*(e.boss?.15:0);
          p.rotation=base+Math.PI/2+spread;p.setVelocity(Math.cos(base+spread)*(e.boss?300:250),Math.sin(base+spread)*(e.boss?300:250));this.time.delayedCall(1800,()=>p.active&&p.destroy());
        }
      }
    });
  }

  hurtPlayer(amount){
    this.hp=Math.max(0,this.hp-amount);this.hurtUntil=this.time.now+650;this.player.setTint(0xff8b8b);this.time.delayedCall(120,()=>this.player.active&&this.player.setTint(0xdfffee));this.cameras.main.shake(140,.007);this.updateHud();
    if(this.hp<=0){this.hp=this.maxHp;this.cameras.main.fade(250,80,0,20);this.player.setPosition(1800,1200);this.hurtUntil=this.time.now+2200;}
  }

  flash(e){e.setAlpha(.28);this.time.delayedCall(65,()=>e.active&&e.setAlpha(1));}

  killEnemy(e){
    const x=e.x,y=e.y,boss=e.boss;if(e.aura)e.aura.destroy();if(boss)this.boss=null;e.destroy();
    this.xp+=boss?180:12;this.crystals+=boss?40:Phaser.Math.Between(0,2);
    for(let i=0;i<(boss?24:8);i++){const s=this.add.circle(x,y,Phaser.Math.Between(2,7),Phaser.Math.RND.pick([0x72ffd8,0xc778ff,0xffd36f]),.95).setDepth(32);this.tweens.add({targets:s,x:x+Phaser.Math.Between(-90,90),y:y+Phaser.Math.Between(-90,90),alpha:0,scale:2,duration:Phaser.Math.Between(250,520),onComplete:()=>s.destroy()});}
    if(boss){this.bossText.setText('КОРОЛЕВА ПОВЕРЖЕНА').setColor('#8fffd0');this.cameras.main.flash(420,80,255,180);}
    if(this.xp>=this.level*100){this.xp-=this.level*100;this.level++;this.openUpgrade();}
    this.updateHud();if(!boss)this.time.delayedCall(700,()=>this.spawnEnemy(Phaser.Math.Between(0,4)));
  }

  openUpgrade(){
    this.upgradeOpen=true;this.physics.pause();this.upgradePanel.removeAll(true);this.upgradePanel.setVisible(true);
    const bg=this.add.rectangle(0,0,900,360,0x04100e,.97).setStrokeStyle(3,0x68ffe0,.75);
    const title=this.add.text(0,-142,`УРОВЕНЬ ${this.level} — ВЫБЕРИ УЛУЧШЕНИЕ`,{fontSize:'28px',fontStyle:'bold',color:'#effff8'}).setOrigin(.5);this.upgradePanel.add([bg,title]);
    const pool=Phaser.Utils.Array.Shuffle([0,1,2,3,4,5]).slice(0,3);
    pool.forEach((idx,i)=>{
      const x=(i-1)*275;const card=this.add.rectangle(x,20,240,210,0x102a24,.96).setStrokeStyle(2,WEAPONS[idx].tint,.9).setInteractive({useHandCursor:true});
      const glow=this.add.rectangle(x,20,252,222,WEAPONS[idx].tint,.06);
      const name=this.add.text(x,-28,WEAPONS[idx].name,{fontSize:'19px',fontStyle:'bold',color:'#ffffff',align:'center',wordWrap:{width:210}}).setOrigin(.5);
      const lvl=this.add.text(x,45,`Уровень ${this.weaponLevel[idx]} → ${this.weaponLevel[idx]+1}\nУрон +18%`,{fontSize:'16px',color:'#bfffe9',align:'center'}).setOrigin(.5);
      card.on('pointerover',()=>card.setFillStyle(0x17463a,1));card.on('pointerout',()=>card.setFillStyle(0x102a24,.96));
      card.on('pointerdown',()=>{this.weaponIndex=idx;this.weaponLevel[idx]++;this.upgradeOpen=false;this.upgradePanel.setVisible(false);this.physics.resume();this.cameras.main.flash(160,80,255,200);this.updateHud();});
      this.upgradePanel.add([glow,card,name,lvl]);
    });
  }

  updateHud(){
    this.hud?.setText(`HP ${Math.max(0,this.hp)}/${this.maxHp}   LV ${this.level}   ◆ ${this.crystals}`);
    this.weaponText?.setText(`${WEAPONS[this.weaponIndex].name}  ·  ур. ${this.weaponLevel[this.weaponIndex]}`);
    if(this.hpBar)this.hpBar.width=294*(this.hp/this.maxHp);
    if(this.xpBar)this.xpBar.width=294*Math.min(1,this.xp/(this.level*100));
  }
}

new Phaser.Game({
  type:Phaser.WEBGL,
  parent:'game',
  width:1280,height:720,
  backgroundColor:'#04100e',
  physics:{default:'arcade',arcade:{debug:false}},
  scale:{mode:Phaser.Scale.RESIZE,autoCenter:Phaser.Scale.CENTER_BOTH},
  render:{antialias:true,pixelArt:false,roundPixels:false},
  scene:Xenojungle
});
