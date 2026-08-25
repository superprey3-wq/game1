import Phaser from 'phaser';

class Xenojungle extends Phaser.Scene {
  constructor(){super('xeno');}
  create(){
    this.cameras.main.setBackgroundColor('#071a17');
    this.physics.world.setBounds(0,0,3200,2200);
    this.makeWorld();
    this.player=this.physics.add.sprite(1600,1100,'hero').setScale(.8).setCollideWorldBounds(true).setDepth(10);
    this.player.body.setCircle(28,18,18);
    this.cameras.main.startFollow(this.player,true,.08,.08);
    this.cameras.main.setZoom(1.15);
    this.keys=this.input.keyboard.addKeys('W,A,S,D');
    this.enemies=this.physics.add.group();
    this.projectiles=this.physics.add.group();
    this.xp=0; this.level=1; this.hp=100; this.crystals=0; this.lastShot=0;
    for(let i=0;i<18;i++) this.spawnEnemy(i%5);
    this.physics.add.overlap(this.projectiles,this.enemies,(p,e)=>{p.destroy();e.hp-=34;this.flash(e);if(e.hp<=0)this.killEnemy(e)});
    this.physics.add.overlap(this.player,this.enemies,(p,e)=>{if(!this.hurtUntil||this.time.now>this.hurtUntil){this.hp-=10;this.hurtUntil=this.time.now+600;this.cameras.main.shake(120,.006);this.updateHud();}});
    this.hud=this.add.text(24,22,'',{fontFamily:'Arial',fontSize:'20px',fontStyle:'bold',color:'#eafff6',stroke:'#07110f',strokeThickness:5}).setScrollFactor(0).setDepth(100);
    this.bossText=this.add.text(this.scale.width/2,35,'КСЕНОДЖУНГЛИ',{fontSize:'26px',fontStyle:'bold',color:'#a8ffcf',stroke:'#06110e',strokeThickness:6}).setOrigin(.5,0).setScrollFactor(0).setDepth(100);
    this.updateHud();
    this.time.delayedCall(45000,()=>this.spawnBoss());
  }
  preload(){
    const base='https://raw.githubusercontent.com/ETdoFresh/kenney.nl/master/';
    this.load.image('hero',base+'Top-down%20Shooter/PNG/Man%20Blue/manBlue_gun.png');
    this.load.image('robot',base+'Top-down%20Shooter/PNG/Robot%201/robot1_hold.png');
    this.load.image('alien',base+'Platformer%20Pack%20Redux/PNG/Enemies/slimeBlue.png');
    this.load.image('plant',base+'Top-down%20Shooter/PNG/Tiles/tile_183.png');
    this.load.image('crate',base+'Top-down%20Shooter/PNG/Tiles/tile_129.png');
  }
  makeWorld(){
    const g=this.add.graphics().setDepth(-20);
    g.fillStyle(0x0b2a22,1).fillRect(0,0,3200,2200);
    for(let i=0;i<420;i++){
      const x=Phaser.Math.Between(0,3200),y=Phaser.Math.Between(0,2200),r=Phaser.Math.Between(3,16);
      g.fillStyle(Phaser.Math.RND.pick([0x123d2c,0x18513a,0x274c31,0x0f3027]),Phaser.Math.FloatBetween(.25,.7)).fillCircle(x,y,r);
    }
    for(let i=0;i<75;i++){
      const x=Phaser.Math.Between(60,3140),y=Phaser.Math.Between(60,2140),r=Phaser.Math.Between(18,48);
      g.fillStyle(0x102e25,.9).fillCircle(x+8,y+12,r); g.fillStyle(0x247247,.9).fillCircle(x,y,r);
      g.fillStyle(0x5fcf78,.35).fillCircle(x-r*.25,y-r*.25,r*.55);
    }
    for(let i=0;i<35;i++){
      const x=Phaser.Math.Between(100,3100),y=Phaser.Math.Between(100,2100);
      g.fillStyle(0x55f4d0,.15).fillCircle(x,y,Phaser.Math.Between(25,55));g.fillStyle(0x6fffe1,.8).fillTriangle(x,y-25,x-12,y+18,x+12,y+18);
    }
  }
  spawnEnemy(type){
    const a=Phaser.Math.FloatBetween(0,Math.PI*2),d=Phaser.Math.Between(480,850);let x=1600+Math.cos(a)*d,y=1100+Math.sin(a)*d;
    const key=type===2||type===3?'robot':'alien'; const e=this.enemies.create(x,y,key).setDepth(8);
    e.type=type;e.hp=[55,70,65,160,90][type];e.speed=[125,80,105,55,70][type];e.setScale(type===3?1.25:.8);e.setTint([0x8cffb2,0xff9f8c,0x8cdcff,0xffcf70,0xd79cff][type]);
  }
  spawnBoss(){
    const e=this.enemies.create(this.player.x+650,this.player.y,'alien').setDepth(9).setScale(3.2).setTint(0xff5c92);e.type=5;e.hp=1800;e.speed=42;e.boss=true;
    this.bossText.setText('⚠ КОРОЛЕВА КСЕНО ⚠').setColor('#ff8eb1');this.cameras.main.flash(350,120,20,55);
  }
  update(t){
    if(!this.player)return; let vx=(this.keys.D.isDown?1:0)-(this.keys.A.isDown?1:0),vy=(this.keys.S.isDown?1:0)-(this.keys.W.isDown?1:0);let v=new Phaser.Math.Vector2(vx,vy).normalize().scale(245);this.player.setVelocity(v.x,v.y);
    let target=null,dist=1e9;this.enemies.children.iterate(e=>{if(!e)return;const d=Phaser.Math.Distance.Between(this.player.x,this.player.y,e.x,e.y);if(d<dist){dist=d;target=e;}this.physics.moveToObject(e,this.player,e.speed);});
    if(target&&t>this.lastShot+230){this.lastShot=t;const p=this.projectiles.create(this.player.x,this.player.y,'crate').setScale(.16).setTint(0x6ffff0).setDepth(12);p.body.setCircle(12);this.physics.moveToObject(p,target,650);this.time.delayedCall(1100,()=>p.active&&p.destroy());this.tweens.add({targets:this.player,scaleX:.86,scaleY:.74,duration:60,yoyo:true});}
  }
  flash(e){e.setAlpha(.35);this.time.delayedCall(70,()=>e.active&&e.setAlpha(1));}
  killEnemy(e){this.xp+=12;this.crystals+=Phaser.Math.Between(0,2);const x=e.x,y=e.y;e.destroy();for(let i=0;i<7;i++){const s=this.add.circle(x,y,Phaser.Math.Between(2,6),0x72ffd8,.9).setDepth(20);this.tweens.add({targets:s,x:x+Phaser.Math.Between(-55,55),y:y+Phaser.Math.Between(-55,55),alpha:0,duration:400,onComplete:()=>s.destroy()});}if(this.xp>=this.level*100){this.level++;this.cameras.main.flash(180,70,255,190);}this.updateHud();this.time.delayedCall(800,()=>this.spawnEnemy(Phaser.Math.Between(0,4)));}
  updateHud(){this.hud?.setText(`HP ${Math.max(0,this.hp)}/100   LV ${this.level}   XP ${this.xp}/${this.level*100}   ◆ ${this.crystals}`);}
}

new Phaser.Game({type:Phaser.WEBGL,parent:'game',width:1280,height:720,backgroundColor:'#071a17',physics:{default:'arcade',arcade:{debug:false}},scale:{mode:Phaser.Scale.RESIZE,autoCenter:Phaser.Scale.CENTER_BOTH},scene:Xenojungle});
