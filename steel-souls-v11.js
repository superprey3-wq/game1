'use strict';

document.title='Skybound Frog — Steel & Souls: Handbound Blade';
const menuTextV11=document.querySelector('#menu .panel p');
if(menuTextV11)menuTextV11.textContent='Handbound Blade — оружие теперь сидит именно в руках героя: хват, вторая рука для тяжёлого оружия, бег, прыжок и комбо двигают клинок вместе с телом.';

function handboundPoseV11(){
 if(!p)return null;
 const face=p.face||1,z=WEAP[meta.equipped]||WEAP.blaster,now=performance.now();
 const moving=Math.abs(p.vx)>35&&p.on,airborne=!p.on;
 let hx=face*10,hy=29,ang=face*.58,lean=0;
 if(moving){const s=Math.sin(now/78);hx=face*(10+s*1.8);hy=28+s*1.6;ang=face*(.52+s*.06);lean=face*1.4}
 if(airborne){hx=face*11;hy=25;ang=face*(p.vy<0?.34:.78);lean=face*1.8}
 if(p.attack){
  const a=p.attack,q=clamp(a.t/a.dur,0,1),c=a.combo||1;
  if(c===1){
   if(q<.28){const t=q/.28;ang=(-1.70+.42*t)*face;hx=face*(8+5*t);hy=25-4*t;lean=-face*2*t}
   else if(q<.68){const t=(q-.28)/.40;ang=(-1.28+2.42*t)*face;hx=face*(13+12*Math.sin(Math.PI*t));hy=21+8*t;lean=face*5*Math.sin(Math.PI*t)}
   else{const t=(q-.68)/.32;ang=(1.14-.56*t)*face;hx=face*(14-4*t);hy=29;lean=face*(4-4*t)}
  }else if(c===2){
   if(q<.25){const t=q/.25;ang=(1.42-.24*t)*face;hx=face*(10+4*t);hy=23;lean=face*2}
   else if(q<.70){const t=(q-.25)/.45;ang=(1.18-2.55*t)*face;hx=face*(14+12*Math.sin(Math.PI*t));hy=23+6*t;lean=face*5.5*Math.sin(Math.PI*t)}
   else{const t=(q-.70)/.30;ang=(-1.37+.48*t)*face;hx=face*(14-4*t);hy=29;lean=face*(4-4*t)}
  }else{
   if(q<.32){const t=q/.32;ang=(-2.62+.30*t)*face;hx=face*(7+4*t);hy=18-4*t;lean=-face*3*t}
   else if(q<.70){const t=(q-.32)/.38;ang=(-2.32+3.88*t)*face;hx=face*(11+17*Math.sin(Math.PI*t));hy=14+16*t;lean=face*7*Math.sin(Math.PI*t)}
   else{const t=(q-.70)/.30;ang=(1.56-.80*t)*face;hx=face*(15-5*t);hy=30;lean=face*(5-5*t)}
  }
 }
 return{face,z,hx,hy,ang,lean,twoHanded:z.kind==='greatsword'||z.kind==='spear'};
}

function drawHandboundArmV11(cx,cy,handX,handY,face,front){
 ctx.save();ctx.translate(cx,cy);ctx.scale(face,1);
 const sx=front?7:2,sy=front?25:23,tx=Math.abs(handX),ty=handY;
 ctx.strokeStyle=front?'#7fd36f':'#4a8e52';ctx.lineWidth=7;ctx.lineCap='round';
 ctx.beginPath();ctx.moveTo(sx,sy);ctx.quadraticCurveTo((sx+tx)*.55,sy-3,tx,ty);ctx.stroke();
 ctx.fillStyle=front?'#9aeb85':'#61ad67';ctx.beginPath();ctx.arc(tx,ty,4.8,0,Math.PI*2);ctx.fill();ctx.restore();
}

function drawHandboundWeaponV11(type,cx,cy,pose){
 const z=pose.z,hx=cx+pose.hx,hy=cy+pose.hy;
 drawSwordSpriteV9(type,hx,hy,z.kind==='greatsword'?.91:z.kind==='spear'?.86:.72,pose.ang,pose.face<0,1);
 ctx.save();ctx.translate(hx,hy);ctx.fillStyle='#9aeb85';ctx.beginPath();ctx.arc(0,0,5,0,Math.PI*2);ctx.fill();
 if(pose.twoHanded){const dx=Math.cos(pose.ang)*8,dy=Math.sin(pose.ang)*8;ctx.fillStyle='#76c96d';ctx.beginPath();ctx.arc(-dx,-dy,4.6,0,Math.PI*2);ctx.fill()}
 ctx.restore();
}

drawPlayer=function(){
 if(!p)return;
 const skin=meta.skin||'frog',moving=Math.abs(p.vx)>30,pose=handboundPoseV11(),a=p.attack;
 const act=!p.on?(p.vy<0?'Jump':'Fall'):moving?'Run':'Idle',im=A[skin+act],flip=p.face<0;
 if(p.inv>0&&Math.floor(p.inv*12)%2)return;
 const breath=!moving&&p.on&&!a?Math.sin(performance.now()/260)*.8:0,runBob=moving&&p.on?Math.sin(performance.now()/70)*1.4:0;
 const cx=p.x+p.w/2,cy=p.y;
 ctx.save();ctx.translate(pose.lean,breath+runBob);
 drawHandboundArmV11(cx,cy,pose.hx,pose.hy,pose.face,false);
 if(!drawSheet(im,32,32,Math.floor(performance.now()/(a?125:110)),p.x,p.y,48,48,flip)){ctx.fillStyle='#63d66b';ctx.fillRect(p.x,p.y,p.w,p.h)}
 drawHandboundWeaponV11(meta.equipped,cx,cy,pose);
 drawHandboundArmV11(cx,cy,pose.hx,pose.hy,pose.face,true);
 if(pose.twoHanded){const hx=cx+pose.hx-pose.face*7,hy=cy+pose.hy+5;ctx.fillStyle='#76c96d';ctx.beginPath();ctx.arc(hx,hy,4.6,0,Math.PI*2);ctx.fill()}
 ctx.restore();
 if(p.dashT>0){ctx.globalAlpha=.20;for(let i=1;i<4;i++){ctx.fillStyle='#8bdcff';ctx.fillRect(p.x-p.face*i*18,p.y+8,34,30)}ctx.globalAlpha=1}
};

const damageEnemyV11=damageEnemy;
damageEnemy=function(e,dmg,src){
 const before=e.hp;damageEnemyV11(e,dmg,src);
 if(src&&src.type&&before>e.hp){e.hitT=Math.max(e.hitT||0,.18);if(p?.attack)p.attack.impact=Math.max(p.attack.impact||0,.045)}
};

const updateShotsV11=updateShots;
updateShots=function(dt){if(p?.attack?.impact>0){p.attack.impact=Math.max(0,p.attack.impact-dt);dt*=.32}updateShotsV11(dt)};

refreshMeta();
