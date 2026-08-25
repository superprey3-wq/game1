import Phaser from 'phaser';

const WORLD_W = 3600;
const WORLD_H = 2400;
const WEAPONS = [
  { name:'Импульсная винтовка', key:'pulse', color:0x70fff0, cooldown:220, damage:28 },
  { name:'Плазменный кастер', key:'plasma', color:0x7cff75, cooldown:420, damage:52 },
  { name:'Ракетный блок', key:'rocket', color:0xffb15e, cooldown:820, damage:85 },
  { name:'Призматический лазер', key:'laser', color:0x7fdcff, cooldown:680, damage:72 },
  { name:'Цепная молния', key:'chain', color:0xc98cff, cooldown:760, damage:50 },
  { name:'Криопушка', key:'frost', color:0x9feaff, cooldown:560, damage:44 }
];

class Xenojungle extends Phaser.Scene {
  constructor(){ super('xeno'); }

  preload(){
    const base='https://raw.githubusercontent.com/ETdoFresh/kenney.nl/master/';
    const ufo=base+'alien-ufo-pack/PNG/';
    this.load.image('hero',base+'Top-down%20Shooter/PNG/Man%20Blue/manBlue_gun.png');
    this.load.image('robot',base+'Top-down%20Shooter/PNG/Robot%201/robot1_hold.png');
    this.load.image('alien',base+'Platformer%20Pack%20Redux/PNG/Enemies/slimeBlue.png');
    this.load.image('pet',ufo+'dome.png');
    this.load.image('laserBlue',ufo+'laserBlue2.png');
    this.load.image('laserGreen',ufo+'laserGreen2.png');
    this.load.image('laserBeige',ufo+'laserBeige2.png');
  }

  create(){
    this.cameras.main.setBackgroundColor('#061511');
    this.physics.world.setBounds(0,0,WORLD_W,WORLD_H);
    this.createGeneratedTextures();
    this.makeWorld();

    this.player=this.physics.add.sprite(WORLD_W/2,WORLD_H/2,'hero').setScale(.92).setCollideWorldBounds(true).setDepth(20);
    this.player.body.setCircle(28,18,18);
    this.player.setDrag(900,900);
    this.playerShadow=this.add.ellipse(this.player.x,this.player.y+31,58,22,0x000000,.36).setDepth(15);

    this.pet=this.physics.add.sprite(this.player.x-80,this.player.y+60,'pet').setScale(.6).setTint(0x8ffff2).setDepth(19);
    this.petGlow=this.add.circle(this.pet.x,this.pet.y,38,0x54f8df,.11).setDepth(14);

    this.cameras.main.startFollow(this.player,true,.075,.075);
    this.cameras.main.setZoom(1.06);
    this.keys=this.input.keyboard.addKeys('W,A,S,D,ONE,TWO,THREE,FOUR,FIVE,SIX');

    this.enemies=this.physics.add.group();
    this.projectiles=this.physics.add.group();
    this.enemyProjectiles=this.physics.add.group();

    this.xp=0; this.level=1; this.hp=100; this.maxHp=100; this.crystals=0;
    this.weaponIndex=0; this.weaponLevels=[1,0,0,0,0,0]; this.lastShot=0; this.hurtUntil=0;
    this.boss=null; this.bossSpawned=false; this.upgradeOpen=false;

    for(let i=0;i<22;i++) this.spawnEnemy(i%5);

    this.physics.add.overlap(this.projectiles,this.enemies,(p,e)=>this.projectileHit(p,e));
    this.physics.add.overlap(this.player,this.enemies,(p,e)=>this.playerHit(e.touchDamage || 10));
    this.physics.add.overlap(this.player,this.enemyProjectiles,(p,b)=>{ const d=b.damage||9; b.destroy(); this.playerHit(d); });

    this.createHud();
    this.createUpgradeUI();
    this.updateHud();

    this.time.addEvent({delay:9000,loop:true,callback:()=>this.spawnWave()});
    this.time.delayedCall(50000,()=>this.spawnBoss());
    this.scale.on('resize',()=>this.layoutHud());
  }

  createGeneratedTextures(){
    const g=this.make.graphics({x:0,y:0,add:false});
    g.clear(); g.fillStyle(0xffc15f,1); g.fillRoundedRect(0,5,34,14,6); g.fillStyle(0xffffff,1); g.fillTriangle(34,4,48,12,34,20); g.generateTexture('rocketTex',48,24);
    g.clear(); g.fillStyle(0x9feaff,.28); g.fillCircle(20,20,19); g.fillStyle(0xd8ffff,1); g.fillCircle(20,20,8); g.generateTexture('frostTex',40,40);
    g.destroy();
  }

  makeWorld(){
    const ground=this.add.graphics().setDepth(-40);
    ground.fillStyle(0x081f19,1).fillRect(0,0,WORLD_W,WORLD_H);
    for(let i=0;i<760;i++){
      const x=Phaser.Math.Between(0,WORLD_W), y=Phaser.Math.Between(0,WORLD_H), r=Phaser.Math.Between(3,18);
      ground.fillStyle(Phaser.Math.RND.pick([0x0f3227,0x174431,0x1b5239,0x263d2f,0x113025]),Phaser.Math.FloatBetween(.25,.7)).fillCircle(x,y,r);
    }
    for(let i=0;i<110;i++){
      const x=Phaser.Math.Between(70,WORLD_W-70),y=Phaser.Math.Between(70,WORLD_H-70),r=Phaser.Math.Between(24,56);
      ground.fillStyle(0x020b09,.55).fillEllipse(x+8,y+18,r*1.55,r*.7);
      ground.fillStyle(Phaser.Math.RND.pick([0x246846,0x2e7f50,0x3a7448]),.95).fillCircle(x,y,r);
      ground.fillStyle(0x70dc78,.22).fillCircle(x-r*.25,y-r*.3,r*.6);
      for(let k=0;k<5;k++){
        const a=(k/5)*Math.PI*2+Phaser.Math.FloatBetween(-.25,.25);
        ground.lineStyle(Phaser.Math.Between(4,9),0x3a9b59,.8);
        ground.lineBetween(x,y,x+Math.cos(a)*r*1.4,y+Math.sin(a)*r*1.4);
      }
    }
    for(let i=0;i<52;i++){
      const x=Phaser.Math.Between(120,WORLD_W-120), y=Phaser.Math.Between(120,WORLD_H-120);
      ground.fillStyle(0x5ffff0,.08).fillCircle(x,y,Phaser.Math.Between(30,70));
      ground.fillStyle(0x72ffe5,.75).fillTriangle(x,y-34,x-15,y+22,x+15,y+22);
      ground.fillStyle(0xe2fff8,.7).fillTriangle(x+4,y-25,x-2,y+10,x+9,y+6);
    }
    for(let i=0;i<28;i++){
      const x=Phaser.Math.Between(130,WORLD_W-130),y=Phaser.Math.Between(130,WORLD_H-130),w=Phaser.Math.Between(70,140),h=Phaser.Math.Between(36,70);
      ground.fillStyle(0x06100f,.5).fillRoundedRect(x-w/2+8,y-h/2+12,w,h,10);
      ground.fillStyle(0x34443f,.95).fillRoundedRect(x-w/2,y-h/2,w,h,10);
      ground.lineStyle(4,0x70b697,.6).strokeRoundedRect(x-w/2,y-h/2,w,h,10);
      if(i%3===0)ground.fillStyle(0x7d48a8,.35).fillCircle(x,y,Phaser.Math.Between(10,18));
    }
  }

  createHud(){
    this.hudPanel=this.add.rectangle(18,18,430,104,0x06110f,.82).setOrigin(0).setScrollFactor(0).setDepth(100).setStrokeStyle(2,0x4f9d7c,.55);
    this.hpBg=this.add.rectangle(36,42,300,18,0x211c1c,.95).setOrigin(0,.5).setScrollFactor(0).setDepth(102);
    this.hpBar=this.add.rectangle(36,42,300,18,0x5ff29a,1).setOrigin(0,.5).setScrollFactor(0).setDepth(103);
    this.hpText=this.add.text(348,30,'',{fontFamily:'Arial',fontSize:'16px',fontStyle:'bold',color:'#effff6'}).setScrollFactor(0).setDepth(104);
    this.hud=this.add.text(36,62,'',{fontFamily:'Arial',fontSize:'16px',fontStyle:'bold',color:'#cffff0',lineSpacing:5}).setScrollFactor(0).setDepth(104);
    this.worldTitle=this.add.text(0,24,'КСЕНОДЖУНГЛИ',{fontFamily:'Arial',fontSize:'25px',fontStyle:'bold',color:'#b8ffdc',stroke:'#04100c',strokeThickness:6}).setOrigin(.5,0).setScrollFactor(0).setDepth(104);
    this.weaponBadge=this.add.text(0,60,'',{fontFamily:'Arial',fontSize:'16px',fontStyle:'bold',color:'#e7fff7',backgroundColor:'#0b2b22',padding:{x:12,y:7}}).setOrigin(.5,0).setScrollFactor(0).setDepth(104);
    this.bossUi=this.add.container(0,108).setScrollFactor(0).setDepth(105).setVisible(false);
    this.bossBg=this.add.rectangle(0,0,520,18,0x24111b,.94).setOrigin(.5);
    this.bossBar=this.add.rectangle(-260,0,520,18,0xff5b91,1).setOrigin(0,.5);
    this.bossLabel=this.add.text(0,-30,'КОРОЛЕВА КСЕНО',{fontFamily:'Arial',fontSize:'17px',fontStyle:'bold',color:'#ffb0c8',stroke:'#12060c',strokeThickness:4}).setOrigin(.5);
    this.bossUi.add([this.bossBg,this.bossBar,this.bossLabel]);
    this.layoutHud();
  }

  layoutHud(){
    const w=this.scale.width;
    if(this.worldTitle)this.worldTitle.setX(w/2);
    if(this.weaponBadge)this.weaponBadge.setX(w/2);
    if(this.bossUi)this.bossUi.setX(w/2);
    if(this.upgradeContainer)this.upgradeContainer.setPosition(w/2,this.scale.height/2);
  }

  createUpgradeUI(){
    this.upgradeContainer=this.add.container(this.scale.width/2,this.scale.height/2).setScrollFactor(0).setDepth(300).setVisible(false);
    const shade=this.add.rectangle(0,0,4000,2200,0x020706,.82);
    const panel=this.add.rectangle(0,0,760,360,0x081915,.98).setStrokeStyle(3,0x61d5a2,.7);
    const title=this.add.text(0,-135,'ВЫБЕРИ УЛУЧШЕНИЕ',{fontFamily:'Arial',fontSize:'28px',fontStyle:'bold',color:'#dffff1'}).setOrigin(.5);
    this.upgradeContainer.add([shade,panel,title]);
    this.upgradeCards=[];
    for(let i=0;i<3;i++){
      const x=(i-1)*235;
      const card=this.add.rectangle(x,25,205,220,0x0d2a22,.98).setStrokeStyle(2,0x6bc6a1,.65).setInteractive({useHandCursor:true});
      const icon=this.add.circle(x,-42,28,0x70fff0,.24).setStrokeStyle(2,0x70fff0,.85);
      const text=this.add.text(x,12,'',{fontFamily:'Arial',fontSize:'18px',fontStyle:'bold',align:'center',color:'#effff8',wordWrap:{width:175}}).setOrigin(.5,0);
      card.on('pointerover',()=>card.setFillStyle(0x164638,.98));
      card.on('pointerout',()=>card.setFillStyle(0x0d2a22,.98));
      card.on('pointerdown',()=>this.chooseUpgrade(i));
      this.upgradeContainer.add([card,icon,text]);
      this.upgradeCards.push({card,icon,text,weaponIndex:0});
    }
  }

  showUpgrade(){
    if(this.upgradeOpen)return;
    this.upgradeOpen=true; this.physics.world.pause();
    const pool=Phaser.Utils.Array.Shuffle([0,1,2,3,4,5]).slice(0,3);
    this.upgradeCards.forEach((c,i)=>{
      c.weaponIndex=pool[i];const w=WEAPONS[pool[i]];
      c.icon.setFillStyle(w.color,.25).setStrokeStyle(2,w.color,.9);
      c.text.setText(`${w.name}\n\nУр. ${this.weaponLevels[pool[i]]} → ${this.weaponLevels[pool[i]]+1}\n\nУрон +12%`);
    });
    this.upgradeContainer.setVisible(true);
  }

  chooseUpgrade(cardIndex){
    const idx=this.upgradeCards[cardIndex].weaponIndex;
    this.weaponLevels[idx]++;this.weaponIndex=idx;
    this.upgradeContainer.setVisible(false);this.upgradeOpen=false;this.physics.world.resume();
    this.cameras.main.flash(160,80,255,185);this.updateHud();
  }

  spawnWave(){
    const count=Math.min(10,4+Math.floor(this.level*.8));
    for(let i=0;i<count;i++)this.time.delayedCall(i*120,()=>this.spawnEnemy(Phaser.Math.Between(0,4),true));
  }

  spawnEnemy(type,aroundPlayer=false){
    const a=Phaser.Math.FloatBetween(0,Math.PI*2),d=Phaser.Math.Between(520,820);
    const cx=aroundPlayer?this.player.x:WORLD_W/2,cy=aroundPlayer?this.player.y:WORLD_H/2;
    const x=Phaser.Math.Clamp(cx+Math.cos(a)*d,45,WORLD_W-45),y=Phaser.Math.Clamp(cy+Math.sin(a)*d,45,WORLD_H-45);
    const key=(type===2||type===3)?'robot':'alien';const e=this.enemies.create(x,y,key).setDepth(18);
    e.type=type;e.maxHp=[55,72,68,170,105][type];e.hp=e.maxHp;e.speed=[138,72,110,52,65][type];e.touchDamage=[7,8,9,18,10][type];
    e.attackRange=[50,390,330,62,440][type];e.attackCooldown=[0,1650,1150,0,2600][type];e.lastAttack=Phaser.Math.Between(0,1000);
    e.setScale(type===3?1.35:type===2?.72:.88).setTint([0x8affb0,0xff9a7d,0x77ddff,0xffcb67,0xd892ff][type]);
    e.shadow=this.add.ellipse(x,y+26,type===3?70:46,type===3?26:17,0x000000,.33).setDepth(13);
    return e;
  }

  spawnBoss(){
    if(this.bossSpawned)return;this.bossSpawned=true;
    const x=Phaser.Math.Clamp(this.player.x+700,120,WORLD_W-120),y=Phaser.Math.Clamp(this.player.y,120,WORLD_H-120);
    const core=this.enemies.create(x,y,'alien').setScale(3.5).setTint(0xff4f91).setDepth(22);
    core.type=5;core.maxHp=2200;core.hp=core.maxHp;core.speed=38;core.touchDamage=24;core.attackRange=520;core.attackCooldown=1350;core.lastAttack=0;core.boss=true;
    core.shadow=this.add.ellipse(x,y+75,180,60,0x000000,.42).setDepth(14);
    core.crown=this.add.image(x,y-75,'pet').setScale(1.35).setTint(0xff8bd4).setDepth(23);
    core.glow=this.add.circle(x,y,115,0xff4f91,.08).setDepth(16);
    this.boss=core;this.bossUi.setVisible(true);this.worldTitle.setText('⚠ ВЛАДЫЧИЦА КСЕНО ⚠').setColor('#ff9fc1');
    this.cameras.main.flash(420,145,20,70);this.cameras.main.shake(450,.012);
  }

  update(time){
    if(!this.player||this.upgradeOpen)return;
    const vx=(this.keys.D.isDown?1:0)-(this.keys.A.isDown?1:0),vy=(this.keys.S.isDown?1:0)-(this.keys.W.isDown?1:0);
    const move=new Phaser.Math.Vector2(vx,vy);if(move.lengthSq()>0)move.normalize().scale(250);this.player.setVelocity(move.x,move.y);
    this.playerShadow.setPosition(this.player.x,this.player.y+31);
    const petTarget=new Phaser.Math.Vector2(this.player.x-75,this.player.y+55);
    this.pet.x=Phaser.Math.Linear(this.pet.x,petTarget.x,.075);this.pet.y=Phaser.Math.Linear(this.pet.y,petTarget.y,.075);this.pet.rotation+=.015;this.petGlow.setPosition(this.pet.x,this.pet.y);

    let target=null,nearest=Infinity;
    this.enemies.children.iterate(e=>{
      if(!e||!e.active)return;
      if(e.shadow)e.shadow.setPosition(e.x,e.y+(e.boss?75:26));if(e.crown)e.crown.setPosition(e.x,e.y-75);if(e.glow)e.glow.setPosition(e.x,e.y);
      const dx=this.player.x-e.x,dy=this.player.y-e.y,dist=Math.hypot(dx,dy);if(dist<nearest){nearest=dist;target=e;}
      if(dist>e.attackRange)this.physics.moveToObject(e,this.player,e.speed);else{e.setVelocity(0,0);if(e.attackCooldown&&time-e.lastAttack>e.attackCooldown){e.lastAttack=time;this.enemyShoot(e);}}
      e.rotation=Math.atan2(dy,dx);
    });

    const weapon=WEAPONS[this.weaponIndex],level=Math.max(1,this.weaponLevels[this.weaponIndex]);
    const cooldown=weapon.cooldown/Math.min(1.8,1+(level-1)*.09);
    if(target&&time>this.lastShot+cooldown){this.lastShot=time;this.fireWeapon(target,weapon,level);}
    if(this.boss&&this.boss.active){this.bossBar.width=520*Math.max(0,this.boss.hp/this.boss.maxHp);if(this.boss.hp<this.boss.maxHp*.5&&!this.boss.phase2){this.boss.phase2=true;this.boss.speed=58;this.boss.attackCooldown=760;this.boss.setTint(0xff256f);this.cameras.main.flash(300,255,35,95);}}
  }

  fireWeapon(target,weapon,level){
    const damage=weapon.damage*(1+(level-1)*.12),sx=this.player.x,sy=this.player.y;this.player.rotation=Phaser.Math.Angle.Between(sx,sy,target.x,target.y);
    if(weapon.key==='laser'){
      const line=this.add.line(0,0,sx,sy,target.x,target.y,weapon.color,.85).setOrigin(0).setLineWidth(5).setDepth(27);
      const glow=this.add.line(0,0,sx,sy,target.x,target.y,weapon.color,.18).setOrigin(0).setLineWidth(16).setDepth(26);
      target.hp-=damage;this.hitEnemy(target,weapon.color);this.tweens.add({targets:[line,glow],alpha:0,duration:130,onComplete:()=>{line.destroy();glow.destroy();}});return;
    }
    if(weapon.key==='chain'){
      let current=target,from={x:sx,y:sy};const visited=new Set(),jumps=Math.min(5,2+Math.floor(level/2));
      for(let i=0;i<jumps&&current;i++){
        visited.add(current);current.hp-=damage*(1-i*.12);this.hitEnemy(current,weapon.color);
        const bolt=this.add.line(0,0,from.x,from.y,current.x,current.y,weapon.color,.9).setOrigin(0).setLineWidth(4).setDepth(28);this.tweens.add({targets:bolt,alpha:0,duration:120,onComplete:()=>bolt.destroy()});
        from={x:current.x,y:current.y};let next=null,nd=260;this.enemies.children.iterate(e=>{if(!e||!e.active||visited.has(e))return;const d=Phaser.Math.Distance.Between(from.x,from.y,e.x,e.y);if(d<nd){nd=d;next=e;}});current=next;
      }return;
    }
    const texture=weapon.key==='plasma'?'laserGreen':weapon.key==='rocket'?'rocketTex':weapon.key==='frost'?'frostTex':'laserBlue';
    const shots=weapon.key==='rocket'?Math.min(3,1+Math.floor(level/3)):1;
    for(let i=0;i<shots;i++){
      const p=this.projectiles.create(sx,sy,texture).setDepth(28);p.weapon=weapon.key;p.damage=damage;p.tintColor=weapon.color;p.setScale(weapon.key==='rocket'?.75:weapon.key==='frost'?.65:.58);
      p.rotation=Phaser.Math.Angle.Between(sx,sy,target.x,target.y)+(i-(shots-1)/2)*.13;this.physics.velocityFromRotation(p.rotation,weapon.key==='rocket'?420:weapon.key==='frost'?470:700,p.body.velocity);this.time.delayedCall(1600,()=>p.active&&p.destroy());
    }
    this.tweens.add({targets:this.player,scaleX:1.02,scaleY:.82,duration:55,yoyo:true});
  }

  projectileHit(p,e){
    if(!p.active||!e.active)return;const x=p.x,y=p.y,key=p.weapon,color=p.tintColor||0x70fff0;e.hp-=p.damage||28;
    if(key==='rocket'){this.cameras.main.shake(110,.005);this.enemies.children.iterate(o=>{if(!o||!o.active||o===e)return;if(Phaser.Math.Distance.Between(x,y,o.x,o.y)<105){o.hp-=p.damage*.45;this.hitEnemy(o,color);}});this.explosion(x,y,0xffb15e,18);}
    else if(key==='frost'){e.speed*=.82;this.time.delayedCall(1100,()=>{if(e.active)e.speed/=.82;});this.explosion(x,y,0x9feaff,10);}else this.spark(x,y,color,7);
    p.destroy();this.hitEnemy(e,color);
  }

  hitEnemy(e,color){if(!e.active)return;e.setAlpha(.35);this.time.delayedCall(65,()=>e.active&&e.setAlpha(1));this.spark(e.x,e.y,color,5);if(e.hp<=0)this.killEnemy(e);}

  enemyShoot(e){
    const angle=Phaser.Math.Angle.Between(e.x,e.y,this.player.x,this.player.y),count=e.boss?(e.phase2?7:4):e.type===4?3:1;
    for(let i=0;i<count;i++){
      const spread=(i-(count-1)/2)*(e.boss?.18:.11),b=this.enemyProjectiles.create(e.x,e.y,'laserBeige').setScale(e.boss?.72:.48).setTint(e.boss?0xff5b91:0xffb57a).setDepth(25);
      b.damage=e.boss?(e.phase2?13:10):(e.type===4?11:8);b.rotation=angle+spread;this.physics.velocityFromRotation(b.rotation,e.boss?310:250,b.body.velocity);this.time.delayedCall(2400,()=>b.active&&b.destroy());
    }
  }

  playerHit(damage){
    if(this.time.now<this.hurtUntil)return;this.hurtUntil=this.time.now+560;this.hp=Math.max(0,this.hp-damage);this.player.setTint(0xff7b7b);this.time.delayedCall(100,()=>this.player.active&&this.player.clearTint());
    this.cameras.main.shake(120,.006);this.cameras.main.flash(70,110,0,0,false);this.updateHud();if(this.hp<=0)this.gameOver();
  }

  gameOver(){
    this.physics.world.pause();
    const t=this.add.text(this.scale.width/2,this.scale.height/2,'ЗАБЕГ ОКОНЧЕН\n\n1 жизнь • 1 возрождение за рекламу\nбудет подключено через Yandex Games',{fontFamily:'Arial',fontSize:'30px',fontStyle:'bold',align:'center',color:'#ffffff',backgroundColor:'#160b10',padding:{x:30,y:24}}).setOrigin(.5).setScrollFactor(0).setDepth(500);
    t.setInteractive({useHandCursor:true}).on('pointerdown',()=>location.reload());
  }

  killEnemy(e){
    if(!e||!e.active)return;const wasBoss=e.boss,x=e.x,y=e.y;if(e.shadow)e.shadow.destroy();if(e.crown)e.crown.destroy();if(e.glow)e.glow.destroy();e.destroy();this.explosion(x,y,wasBoss?0xff4f91:0x72ffd8,wasBoss?44:12);
    if(wasBoss){this.crystals+=75;this.boss=null;this.bossUi.setVisible(false);this.worldTitle.setText('КСЕНОДЖУНГЛИ — БОСС ПОВЕРЖЕН').setColor('#b8ffdc');this.cameras.main.flash(500,160,255,210);this.cameras.main.shake(500,.012);}
    else{this.xp+=14;this.crystals+=Phaser.Math.Between(0,2);this.time.delayedCall(700,()=>this.spawnEnemy(Phaser.Math.Between(0,4),true));const need=this.level*100;if(this.xp>=need){this.xp-=need;this.level++;this.time.delayedCall(100,()=>this.showUpgrade());}}
    this.updateHud();
  }

  spark(x,y,color,count){for(let i=0;i<count;i++){const s=this.add.circle(x,y,Phaser.Math.Between(2,5),color,.9).setDepth(35);this.tweens.add({targets:s,x:x+Phaser.Math.Between(-42,42),y:y+Phaser.Math.Between(-42,42),alpha:0,scale:.2,duration:Phaser.Math.Between(180,360),onComplete:()=>s.destroy()});}}
  explosion(x,y,color,count){const ring=this.add.circle(x,y,18,color,.18).setStrokeStyle(4,color,.8).setDepth(34);this.tweens.add({targets:ring,scale:5,alpha:0,duration:300,onComplete:()=>ring.destroy()});this.spark(x,y,color,count);}

  updateHud(){
    if(!this.hud)return;const ratio=this.hp/this.maxHp;this.hpBar.width=300*ratio;this.hpBar.setFillStyle(ratio>.55?0x5ff29a:ratio>.25?0xffc85f:0xff606f);this.hpText.setText(`${Math.ceil(this.hp)} / ${this.maxHp}`);
    const need=this.level*100;this.hud.setText(`УРОВЕНЬ ${this.level}     XP ${this.xp}/${need}\nКРИСТАЛЛЫ ◆ ${this.crystals}`);const w=WEAPONS[this.weaponIndex];this.weaponBadge.setText(`${w.name}  •  Ур. ${this.weaponLevels[this.weaponIndex]}`);
  }
}

new Phaser.Game({type:Phaser.WEBGL,parent:'game',width:1280,height:720,backgroundColor:'#061511',physics:{default:'arcade',arcade:{debug:false}},scale:{mode:Phaser.Scale.RESIZE,autoCenter:Phaser.Scale.CENTER_BOTH},render:{antialias:true,pixelArt:false,roundPixels:false},scene:Xenojungle});
