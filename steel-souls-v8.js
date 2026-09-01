'use strict';

// Steel & Souls visual/combat patch for Chronicles of the Hollow Crown v7.
document.title='Skybound Frog — Steel & Souls';
const menuText=document.querySelector('#menu .panel p');
if(menuText)menuText.textContent='Steel & Souls — пиксельный souls-like: мечи, живые локации, NPC, загадки, тайные подземелья и двуязычный лор.';
const hint=document.querySelector('#menu .panel div[style*="font-size:13px"]');
if(hint)hint.textContent='A/D — ходьба · W/Пробел — прыжок · Shift — рывок · F/X — удар · E — взаимодействие · Q/1–6 — оружие';
if(NPCS?.smith?.lines){NPCS.smith.lines[0]='Клинок помнит хозяина. Нашёл оружие — оно останется с тобой.';NPCS.smith.lines[2]='Не поднимай меч на каждого, кто выглядит чудовищем. Некоторые из нас просто слишком долго жили.'}
if(LORE?.l16){LORE.l16.ru='Клинок Пустоты не режет металл. Он вырывает кусок расстояния между тобой и целью.\n\nПоэтому стены иногда тоже забывают, что были целыми.';LORE.l16.en='The Void Blade does not cut metal. It tears away a piece of distance between you and the target.\n\nThat is why walls sometimes forget they were whole.'}

Object.assign(WEAP,{
 blaster:{name:'РЖАВЫЙ МЕЧ',rate:.34,dmg:1.4,cost:8,reach:60,kind:'sword'},
 rapid:{name:'РЫЦАРСКИЙ МЕЧ',rate:.25,dmg:1.8,cost:9,reach:66,kind:'sword'},
 spread:{name:'КЛЕЙМОР',rate:.62,dmg:3.2,cost:18,reach:82,kind:'greatsword'},
 rocket:{name:'КОПЬЁ ПЕПЛА',rate:.48,dmg:2.7,cost:14,reach:108,kind:'spear'},
 frost:{name:'ЛЕДЯНОЙ КЛИНОК',rate:.40,dmg:2.2,cost:11,reach:74,kind:'frost',frost:true},
 void:{name:'КЛИНОК ПУСТОТЫ',rate:.68,dmg:4.8,cost:20,reach:94,kind:'void',pierce:true}
});
refreshMeta();

A.fireTrap=new Image();A.fireTrap.crossOrigin='anonymous';A.fireTrap.src=B+'Traps/Fire/On%20(16x32).png';

const oldGrantDungeonReward=grantDungeonReward;
grantDungeonReward=function(id){oldGrantDungeonReward(id);if(id==='mine')toast='ОРУЖИЕ: ЛЕДЯНОЙ КЛИНОК';if(id==='ash')toast='ОРУЖИЕ: КЛИНОК ПУСТОТЫ'};

fire=function(){
 const z=WEAP[meta.equipped]||WEAP.blaster;
 if(p.fire>0||p.stam<z.cost)return;
 p.fire=z.rate;p.stam-=z.cost;snd('shoot');
 const reach=z.reach||64,h=z.kind==='greatsword'?76:z.kind==='spear'?34:58;
 const box={x:p.face>0?p.x+p.w-4:p.x-reach+4,y:p.y+(p.h-h)/2,w:reach,h,face:p.face,type:meta.equipped,dmg:z.dmg+(meta.up.damage||0)*.3};
 w.slashes=w.slashes||[];w.slashes.push({...box,life:.16,max:.16});
 for(const e of w.en){if(e.dead||!hit(box,e))continue;damageEnemy(e,box.dmg,{type:meta.equipped,vx:p.face,pierce:!!z.pierce});e.vx+=p.face*(z.kind==='greatsword'?280:z.kind==='spear'?170:210);if(z.kind==='greatsword')e.vy-=120}
 burst(p.x+p.w/2+p.face*reach*.65,p.y+24,z.frost?'#9deaff':z.kind==='void'?'#b785ff':'#f2e0ad',4);
};

updateShots=function(dt){w.slashes=w.slashes||[];for(const a of w.slashes)a.life-=dt;w.slashes=w.slashes.filter(a=>a.life>0)};

const TERRAIN_SRC={hills:[96,0],cave:[128,48],sky:[160,16],lava:[192,64],castle:[224,32]};
function terrainTileV8(x,y,variant=0){
 const im=A.terrain;if(!im||!im.complete||!im.naturalWidth)return false;
 const base=TERRAIN_SRC[w?.theme]||TERRAIN_SRC.hills;
 const sx=Math.max(0,Math.min(im.naturalWidth-16,base[0]+(variant%3)*16));
 const sy=Math.max(0,Math.min(im.naturalHeight-16,base[1]+(Math.floor(variant/3)%3)*16));
 ctx.drawImage(im,sx,sy,16,16,x,y,32,32);return true;
}
function drawTerrainBlockV8(s,kind='ground'){
 const topH=kind==='ground'?96:32;
 if(!A.terrain?.complete||!A.terrain.naturalWidth){ctx.fillStyle='#45586a';ctx.fillRect(s.x,s.y,s.w,s.h);return}
 const yEnd=Math.min(s.y+s.h,s.y+topH);
 for(let yy=s.y;yy<yEnd;yy+=32)for(let xx=s.x;xx<s.x+s.w;xx+=32)terrainTileV8(xx,yy,((xx/32+yy/32)|0)%7);
 if(s.h>topH){ctx.fillStyle=w.theme==='lava'?'#241014':w.theme==='cave'?'#11151e':w.theme==='castle'?'#12131b':'#17251f';ctx.fillRect(s.x,s.y+topH,s.w,s.h-topH)}
 if(kind!=='ground'){ctx.globalAlpha=.55;ctx.fillStyle='#07101c';for(let xx=s.x+12;xx<s.x+s.w;xx+=36){ctx.beginPath();ctx.moveTo(xx,s.y+s.h);ctx.lineTo(xx+8,s.y+s.h+10+(xx%17));ctx.lineTo(xx+16,s.y+s.h);ctx.fill()}ctx.globalAlpha=1}
}
function drawBonfireV8(b){
 ctx.fillStyle='#3a2417';ctx.save();ctx.translate(b.x+21,b.y+40);ctx.rotate(.45);ctx.fillRect(-20,-4,40,8);ctx.rotate(-.9);ctx.fillRect(-20,-4,40,8);ctx.restore();
 const f=Math.floor(performance.now()/95);
 if(!drawSheet(A.fireTrap,16,32,f,b.x+5,b.y-3,34,58,false)){ctx.fillStyle='#ff8a3c';ctx.beginPath();ctx.moveTo(b.x+21,b.y);ctx.lineTo(b.x+7,b.y+34);ctx.lineTo(b.x+35,b.y+34);ctx.fill()}
 if(b.lit){ctx.globalAlpha=.18;ctx.fillStyle='#ffd46c';ctx.beginPath();ctx.arc(b.x+21,b.y+20,48,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1}
}
function drawParchmentV8(n){
 const bob=Math.sin(performance.now()/280+n.x*.01)*2;ctx.save();ctx.translate(n.x,n.y+bob);
 ctx.fillStyle=n.read?'#8f8062':'#ead38f';ctx.beginPath();ctx.moveTo(4,4);ctx.lineTo(25,2);ctx.lineTo(31,8);ctx.lineTo(28,29);ctx.lineTo(7,31);ctx.lineTo(2,25);ctx.closePath();ctx.fill();
 ctx.fillStyle='#5b4630';ctx.fillRect(8,10,15,2);ctx.fillRect(8,16,12,2);ctx.fillRect(8,22,16,2);ctx.fillStyle='#922f35';ctx.fillRect(22,24,6,6);ctx.restore();
}
function drawWeaponIconV8(type,x,y,scale=1,angle=-.65){
 const z=WEAP[type]||WEAP.blaster;ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.scale(scale,scale);
 const long=z.kind==='spear'?48:z.kind==='greatsword'?38:32;ctx.fillStyle=z.kind==='void'?'#a67cff':z.kind==='frost'?'#a7ecff':'#dce2ea';
 if(z.kind==='spear'){ctx.fillRect(-2,-26,4,52);ctx.beginPath();ctx.moveTo(0,-36);ctx.lineTo(-7,-24);ctx.lineTo(7,-24);ctx.fill()}
 else{ctx.fillRect(-4,-long,8,long+18);ctx.fillStyle='#9ea8b6';ctx.fillRect(-7,-long+4,14,4);ctx.fillStyle='#6d452a';ctx.fillRect(-5,14,10,15);ctx.fillStyle='#d7b45c';ctx.fillRect(-12,10,24,5)}ctx.restore();
}

drawBackground=function(){
 const bg=A[w?.bg||'blue'];if(bg?.complete&&bg.naturalWidth){for(let x=-((cam*.10)%256)-256;x<VW+256;x+=256)ctx.drawImage(bg,x,0,256,VH)}else{ctx.fillStyle='#10182a';ctx.fillRect(0,0,VW,VH)}
 const t=w?.theme,par=cam*.16;ctx.globalAlpha=.42;
 if(t==='hills'){ctx.fillStyle='#102a20';for(let x=-(par%360)-220;x<1150;x+=360){ctx.beginPath();ctx.arc(x+120,500,210,Math.PI,0);ctx.fill();ctx.beginPath();ctx.arc(x+275,505,130,Math.PI,0);ctx.fill()}ctx.fillStyle='#173929';for(let x=-(cam*.28%520)-120;x<1100;x+=520){ctx.fillRect(x,300,20,190);ctx.beginPath();ctx.arc(x+10,285,55,0,Math.PI*2);ctx.fill()}}
 else if(t==='cave'){ctx.fillStyle='#05070b';for(let x=-(par%190)-60;x<1100;x+=190){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x+38,88);ctx.lineTo(x+72,20);ctx.lineTo(x+108,140);ctx.lineTo(x+150,0);ctx.fill()}ctx.strokeStyle='#70809933';ctx.lineWidth=4;for(let x=80-(cam*.22%280);x<1100;x+=280){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,210);ctx.stroke();ctx.beginPath();ctx.arc(x,225,16,0,Math.PI*2);ctx.stroke()}}
 else if(t==='sky'){ctx.fillStyle='#fff';for(let x=-(par%280)-80;x<1100;x+=280){let yy=105+(Math.abs(x)%170);ctx.beginPath();ctx.arc(x+70,yy,38,0,Math.PI*2);ctx.arc(x+112,yy,55,0,Math.PI*2);ctx.arc(x+165,yy+8,32,0,Math.PI*2);ctx.fill()}}
 else if(t==='lava'){ctx.fillStyle='#4a1014';ctx.fillRect(0,500,VW,40);for(let x=-(par%260)-100;x<1100;x+=260){ctx.beginPath();ctx.moveTo(x,490);ctx.lineTo(x+80,245);ctx.lineTo(x+160,360);ctx.lineTo(x+240,490);ctx.fill()}}
 else if(t==='castle'){ctx.fillStyle='#080813';for(let x=-(par%360)-80;x<1100;x+=360){ctx.fillRect(x+55,170,135,320);ctx.fillRect(x+25,130,45,360);ctx.fillRect(x+180,130,45,360);ctx.beginPath();ctx.arc(x+122,255,52,Math.PI,0);ctx.fill()}}
 ctx.globalAlpha=1;if(inDungeon){ctx.fillStyle='#0006';ctx.fillRect(0,0,VW,VH)}
};

drawWorld=function(){
 ctx.save();ctx.translate(-cam,0);
 for(const s of w.sol)drawTerrainBlockV8(s,'ground');for(const s of w.plat)drawTerrainBlockV8(s,'platform');
 for(const s of w.moving){ctx.strokeStyle='#8396ad66';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(s.x+12,0);ctx.lineTo(s.x+12,s.y);ctx.moveTo(s.x+s.w-12,0);ctx.lineTo(s.x+s.w-12,s.y);ctx.stroke();drawTerrainBlockV8(s,'platform')}
 for(const s of w.falling){ctx.globalAlpha=(s.trigger||s.vy)?.72:1;drawTerrainBlockV8(s,'platform');ctx.globalAlpha=1}
 for(const sp of w.spikes)for(let i=0;i<sp.n;i++){const x=sp.x+i*28;if(!drawSheet(A.spike,16,16,Math.floor(performance.now()/160),x,486,28,34,false)){ctx.fillStyle='#d5d7de';ctx.beginPath();ctx.moveTo(x,520);ctx.lineTo(x+14,486);ctx.lineTo(x+28,520);ctx.fill()}}
 for(const b of w.bonfires)drawBonfireV8(b);for(const n of w.notes)drawParchmentV8(n);
 for(const r of w.riddles){ctx.fillStyle=r.done?'#405c4a':'#4a5362';ctx.beginPath();ctx.roundRect(r.x,r.y,r.w,r.h,7);ctx.fill();ctx.strokeStyle='#93a1b5';ctx.stroke();ctx.fillStyle='#cdd8e8';ctx.font='bold 24px serif';ctx.fillText('?',r.x+13,r.y+40)}
 for(const s of w.secrets){const vis=meta.abilities.spiritSight||meta.riddles.shadow||s.id==='crypt';ctx.globalAlpha=vis?.95:.16;drawTerrainBlockV8(s,'platform');ctx.strokeStyle=meta.abilities.spiritSight?'#a868ff':'#71809a';ctx.lineWidth=3;ctx.strokeRect(s.x+4,s.y+4,s.w-8,s.h-8);ctx.globalAlpha=1}
 for(const n of w.npcs){const skin=n.type==='elder'?'mask':n.type==='smith'?'virtual':n.type==='seer'?'pink':'frog';drawSheet(A[skin+'Idle'],32,32,Math.floor(performance.now()/180),n.x,n.y,44,52,false);ctx.fillStyle='#fff9';ctx.font='11px Arial';ctx.fillText(NPCS[n.type].name,n.x-12,n.y-10)}
 for(const c of w.coins){if(c.dead)continue;drawSheet(A.orange,32,32,Math.floor(c.t*10),c.x,c.y,28,28)}for(const q of w.pick){if(q.dead)continue;const im=q.type==='banana'?A.banana:q.type==='kiwi'?A.kiwi:q.type==='cherry'?A.cherry:A.melon;drawSheet(im,32,32,Math.floor(q.t*10),q.x,q.y,34,34)}
 for(const a of w.weapon){if(a.dead)continue;ctx.globalAlpha=.2;ctx.fillStyle='#f3df9f';ctx.beginPath();ctx.arc(a.x+20,a.y+20,30,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;drawWeaponIconV8(a.type,a.x+20,a.y+23,1.05,-.55)}
 if(inDungeon&&w.chest){ctx.fillStyle=w.chest.opened?'#5a4933':'#a97a36';ctx.fillRect(w.chest.x+5,w.chest.y+8,w.chest.w-10,w.chest.h-8);ctx.fillStyle='#d8b96a';ctx.fillRect(w.chest.x+5,w.chest.y+18,w.chest.w-10,5);ctx.fillRect(w.chest.x+21,w.chest.y+15,7,12)}
 if(inDungeon&&w.exit){ctx.fillStyle='#100d20';ctx.beginPath();ctx.roundRect(w.exit.x,w.exit.y,w.exit.w,w.exit.h,18);ctx.fill();ctx.strokeStyle='#a980df';ctx.lineWidth=4;ctx.stroke()}
 drawEnemies();drawProjectiles();drawPlayer();drawFX();ctx.restore();
};

drawEnemies=function(){
 for(const e of w.en){if(e.dead)continue;const f=Math.floor(e.t*8);
  if(e.type==='mush'){if(!drawSheet(A.mush,32,32,f,e.x,e.y,e.w,e.h,e.dir>0))drawBlob(e,'#d66')}else if(e.type==='pig'){if(!drawSheet(A.pig,36,30,f,e.x,e.y,e.w,e.h,e.dir>0))drawBlob(e,'#e88')}else if(e.type==='bat')drawSheet(A.bat,46,30,f,e.x,e.y,e.w,e.h,e.dir>0);else if(e.type==='ghost'){ctx.globalAlpha=.72;drawSheet(A.ghost,44,30,f,e.x,e.y,e.w,e.h,e.dir>0);ctx.globalAlpha=1}else if(e.type==='archer'){drawHumanoid(e,'#6e5942');drawWeaponIconV8('rocket',e.x+(e.dir>0?35:8),e.y+24,.48,e.dir>0?1.2:-1.2)}else if(e.type==='knight'){drawHumanoid(e,'#596473');drawWeaponIconV8('rapid',e.x+(e.dir>0?36:8),e.y+25,.62,e.dir>0?.9:-.9)}else if(e.type==='slime')drawBlob(e,'#6aa56c');else if(e.type==='boss'){drawHumanoid(e,'#40304f',true);drawWeaponIconV8(e.phase>=3?'void':'spread',e.x+e.w*.72,e.y+e.h*.58,1.2,e.dir>0?.7:-.7)}
  const bw=e.type==='boss'?110:Math.max(34,e.w),bx=e.x+e.w/2-bw/2,by=e.y-(e.type==='boss'?23:11);ctx.fillStyle='#190d12';ctx.fillRect(bx,by,bw,6);ctx.fillStyle=e.type==='boss'?'#b83f53':'#b94a55';ctx.fillRect(bx,by,bw*clamp(e.hp/e.maxHp,0,1),6);ctx.strokeStyle='#e6d7cf88';ctx.strokeRect(bx,by,bw,6)
 }
};

drawProjectiles=function(){
 for(const a of (w.slashes||[])){const t=1-a.life/a.max,alpha=Math.sin(Math.PI*clamp(t,0,1));ctx.save();ctx.globalAlpha=.55*alpha;ctx.strokeStyle=a.type==='frost'?'#bff5ff':a.type==='void'?'#c69bff':'#f2e2bf';ctx.lineWidth=a.type==='spread'?12:8;ctx.beginPath();const cx=a.face>0?a.x:a.x+a.w,cy=a.y+a.h/2,r=a.w*.8;ctx.arc(cx,cy,r,a.face>0?-.9:Math.PI-.9,a.face>0?.9:Math.PI+.9,a.face<0);ctx.stroke();ctx.restore()}
 for(const s of w.enemyShots){ctx.fillStyle='#c95462';ctx.beginPath();ctx.arc(s.x+5,s.y+5,6,0,Math.PI*2);ctx.fill()}
};

drawPlayer=function(){
 if(!p)return;const skin=meta.skin||'frog',moving=Math.abs(p.vx)>30,act=!p.on?(p.vy<0?'Jump':'Fall'):moving?'Run':'Idle',im=A[skin+act],flip=p.face<0;if(p.inv>0&&Math.floor(p.inv*12)%2)return;
 if(!drawSheet(im,32,32,Math.floor(performance.now()/110),p.x,p.y,48,48,flip)){ctx.fillStyle='#63d66b';ctx.fillRect(p.x,p.y,p.w,p.h)}if(!(w.slashes||[]).length)drawWeaponIconV8(meta.equipped,p.x+p.w/2+p.face*15,p.y+29,.58,p.face>0?.75:-.75);if(p.dashT>0){ctx.globalAlpha=.24;for(let i=1;i<4;i++){ctx.fillStyle='#8bdcff';ctx.fillRect(p.x-p.face*i*18,p.y+8,34,30)}ctx.globalAlpha=1}
};

drawHUD=function(){
 ctx.fillStyle='#050914dd';ctx.fillRect(12,12,470,92);ctx.fillStyle='#fff';ctx.font='bold 14px Arial';ctx.fillText(inDungeon?'ТАЙНОЕ ПОДЗЕМЕЛЬЕ':`МИР ${li+1}/10`,24,31);
 ctx.fillStyle='#251017';ctx.fillRect(24,40,260,18);ctx.fillStyle='#b83f53';ctx.fillRect(24,40,260*clamp(p.hp/p.maxHp,0,1),18);ctx.strokeStyle='#e5d7cf';ctx.strokeRect(24,40,260,18);ctx.fillStyle='#fff';ctx.font='bold 12px Arial';ctx.fillText(`HP ${p.hp}/${p.maxHp}`,31,54);
 ctx.fillStyle='#152235';ctx.fillRect(24,66,260,14);ctx.fillStyle='#5fae86';ctx.fillRect(24,66,260*(p.stam/p.maxSt),14);ctx.strokeStyle='#d9e4f5';ctx.strokeRect(24,66,260,14);ctx.fillStyle='#dfe9f7';ctx.font='10px Arial';ctx.fillText('ВЫНОСЛИВОСТЬ',31,77);
 drawWeaponIconV8(meta.equipped,315,62,.56,-.62);ctx.fillStyle='#fff';ctx.font='bold 13px Arial';ctx.fillText(WEAP[meta.equipped].name,338,58);ctx.font='11px Arial';ctx.fillText(`ДУШИ ${Math.floor(soulsRun)} · ОЧКИ ${score}`,338,78);
 ctx.fillStyle='#fff';ctx.font='bold 14px Arial';ctx.textAlign='right';ctx.fillText(w.title,945,30);ctx.font='12px Arial';ctx.fillText(w.sub,945,49);ctx.textAlign='left';
 if(nearInteract){ctx.fillStyle='#050914e8';ctx.fillRect(315,470,330,42);ctx.fillStyle='#ffd65a';ctx.font='bold 14px Arial';ctx.textAlign='center';ctx.fillText(interactLabel(nearInteract),480,496);ctx.textAlign='left'}if(toastT>0){ctx.fillStyle='#050914e8';ctx.fillRect(205,108,550,48);ctx.fillStyle='#fff';ctx.font='bold 17px Arial';ctx.textAlign='center';ctx.fillText(toast,480,138);ctx.textAlign='left'}if(inDungeon){ctx.fillStyle='#b67cff';ctx.font='bold 12px Arial';ctx.fillText('СЕКРЕТНАЯ ОБЛАСТЬ · SECRET AREA',24,122)}drawTouch();
};

const oldDrawTouch=drawTouch;
drawTouch=function(){oldDrawTouch();if(!('ontouchstart'in window)&&navigator.maxTouchPoints<1)return;ctx.fillStyle='#fff';ctx.font='bold 18px serif';ctx.textAlign='center';ctx.fillText('⚔',875,472);ctx.textAlign='left'};

refreshMeta();
