const _baseRenderGame=renderGame,_baseApplyAction=applyAction;
const PAIR_TESTS={values:VALUES,distance:DISTANCE};
function extraReset(type){
 if(PAIR_TESTS[type]) state={screen:'game',type,idx:0,answers:{host:null,guest:null},reveal:false,matches:0,done:false};
 else if(type==='birthday') state={screen:'game',type,idx:0,birth:{host:null,guest:null}};
 else if(type==='ice') state={screen:'game',type,idx:Math.floor(Math.random()*ICEBREAKERS.length)};
 else if(type==='flirt') state={screen:'game',type,idx:Math.floor(Math.random()*FLIRT.length),consent:{host:false,guest:false}};
 else if(type==='hide') state={screen:'game',type,idx:0,hider:'host',taskIdx:Math.floor(Math.random()*HIDE_TASKS.length),phase:'hide'};
 else return false;
 return true;
}
applyAction=function(a,v,who){
 if(a==='game'&&extraReset(v)){sync();renderFromState();return}
 if(PAIR_TESTS[state.type]&&a==='next'){
   if(state.reveal&&state.answers.host===state.answers.guest)state.matches++;
   state.idx++; if(state.idx>=PAIR_TESTS[state.type].length)state.done=true;
   state.answers={host:null,guest:null};state.reveal=false;sync();renderFromState();return;
 }
 if(state.type==='birthday'&&a==='birth'){
   if(/^\d{4}-\d{2}-\d{2}$/.test(String(v||'')))state.birth[who]=v;
   sync();renderFromState();return;
 }
 if(state.type==='ice'&&a==='next'){state.idx=(state.idx+1)%ICEBREAKERS.length;sync();renderFromState();return}
 if(state.type==='flirt'&&a==='consent'){state.consent[who]=!!v;sync();renderFromState();return}
 if(state.type==='flirt'&&a==='next'){state.idx=(state.idx+1)%FLIRT.length;sync();renderFromState();return}
 if(state.type==='hide'){
   if(a==='hidden'&&who===state.hider){state.phase='guess';sync();renderFromState();return}
   if(a==='reveal'&&state.phase==='guess'){state.phase='reveal';sync();renderFromState();return}
   if(a==='next'){state.idx++;state.hider=state.hider==='host'?'guest':'host';state.taskIdx=Math.floor(Math.random()*HIDE_TASKS.length);state.phase='hide';sync();renderFromState();return}
 }
 _baseApplyAction(a,v,who);
};
renderGame=function(){
 if(PAIR_TESTS[state.type])return renderPairTest();
 if(state.type==='birthday')return renderBirthday();
 if(state.type==='ice')return renderIce();
 if(state.type==='flirt')return renderFlirt();
 if(state.type==='hide')return renderHide();
 return _baseRenderGame();
};
function renderPairTest(){
 const arr=PAIR_TESTS[state.type],total=arr.length;
 if(state.done){$('roundPill').textContent='Результат';$('bar').style.width='100%';let pct=Math.round(state.matches/total*100);let txt=pct>=80?'Очень много похожих предпочтений 💞':pct>=55?'Хороший баланс сходств и различий ✨':'Вы заметно разные — отличный повод обсудить ответы 💬';$('gameCard').innerHTML=`<div class="bigemoji">🧭</div><div class="result">${pct}% совпадений</div><div class="question">${txt}</div><div class="muted">Процент отражает только ответы в этом тесте, а не «качество» отношений.</div><div class="actions"><button class="btn" onclick="dispatch('game','${state.type}')">Пройти снова</button></div>`;return}
 let q=arr[state.idx];round(state.idx,total);let h=`<div class="eyebrow">${esc(q[0])}</div><div class="question">Что ближе тебе?</div>`;h+=state.reveal?revealHTML('compat')+`<div class="muted">A · ${esc(q[1])}<br>B · ${esc(q[2])}</div>`+nextButton(state.idx===total-1?'Показать результат':'Дальше'):`<div class="options">${option(0,'A · '+q[1])}${option(1,'B · '+q[2])}</div>${waitHTML()}`;$('gameCard').innerHTML=h;
}
function zodiac(date){let d=new Date(date+'T12:00:00'),m=d.getMonth()+1,n=d.getDate();let z=(m===3&&n>=21)||(m===4&&n<=19)?['Овен','Огонь']:(m===4&&n>=20)||(m===5&&n<=20)?['Телец','Земля']:(m===5&&n>=21)||(m===6&&n<=20)?['Близнецы','Воздух']:(m===6&&n>=21)||(m===7&&n<=22)?['Рак','Вода']:(m===7&&n>=23)||(m===8&&n<=22)?['Лев','Огонь']:(m===8&&n>=23)||(m===9&&n<=22)?['Дева','Земля']:(m===9&&n>=23)||(m===10&&n<=22)?['Весы','Воздух']:(m===10&&n>=23)||(m===11&&n<=21)?['Скорпион','Вода']:(m===11&&n>=22)||(m===12&&n<=21)?['Стрелец','Огонь']:(m===12&&n>=22)||(m===1&&n<=19)?['Козерог','Земля']:(m===1&&n>=20)||(m===2&&n<=18)?['Водолей','Воздух']:['Рыбы','Вода'];return z}
function lifePath(s){let n=String(s).replace(/\D/g,'').split('').reduce((a,b)=>a+Number(b),0);while(n>9&&![11,22,33].includes(n))n=String(n).split('').reduce((a,b)=>a+Number(b),0);return n}
function hashDates(a,b){let s=a+'|'+b,h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function birthdayStats(a,b){let za=zodiac(a),zb=zodiac(b),la=lifePath(a),lb=lifePath(b),h=hashDates(a,b);let friendly={Огонь:['Огонь','Воздух'],Земля:['Земля','Вода'],Воздух:['Воздух','Огонь'],Вода:['Вода','Земля']};let elem=friendly[za[1]].includes(zb[1])?12:3;let life=Math.max(0,12-Math.min(12,Math.abs(la-lb)*2));let base=55+elem+life+((h%11)-5);let total=Math.max(48,Math.min(94,base));let cat=(shift)=>Math.max(42,Math.min(97,total+(((h>>shift)%19)-9)));return{za,zb,la,lb,total,rom:cat(1),talk:cat(5),energy:cat(9),everyday:cat(13)}}
function renderBirthday(){
 $('roundPill').textContent='Для развлечения';$('bar').style.width=state.birth.host&&state.birth.guest?'100%':'45%';
 let mine=state.birth[actor()]||'',both=state.birth.host&&state.birth.guest;
 if(!both){$('gameCard').innerHTML=`<div class="bigemoji">🎂</div><div class="question">Введите свою дату рождения</div><div class="muted">Дата станет видна партнёру после отправки. Итог использует знаки зодиака и простую нумерологию — это развлекательный расчёт, не научная оценка отношений.</div><div class="datebox"><input id="birthInput" type="date" value="${esc(mine)}"><button class="btn" onclick="dispatch('birth',$('birthInput').value)">Сохранить дату</button></div><div class="muted gapTop">${mine?'Твоя дата сохранена. Ждём второго игрока…':'Оба вводят дату отдельно.'}</div>`;return}
 let r=birthdayStats(state.birth.host,state.birth.guest),q=encodeURIComponent(`совместимость ${r.za[0]} ${r.zb[0]} отношения`);$('gameCard').innerHTML=`<div class="bigemoji">✨</div><div class="result">${r.total}%</div><div class="question">${esc(r.za[0])} + ${esc(r.zb[0])}</div><div class="compatgrid"><div><small>Романтика</small><b>${r.rom}%</b></div><div><small>Общение</small><b>${r.talk}%</b></div><div><small>Энергия пары</small><b>${r.energy}%</b></div><div><small>Бытовой ритм</small><b>${r.everyday}%</b></div></div><div class="report"><b>${esc(hostName())}</b>: ${r.za[0]} · стихия ${r.za[1]} · число ${r.la}<br><b>${esc(guestName())}</b>: ${r.zb[0]} · стихия ${r.zb[1]} · число ${r.lb}<br><br>${r.za[1]===r.zb[1]?'Одинаковые стихии часто описывают похожий темп и способы реагирования.':'Разные стихии в астрологической традиции трактуют как сочетание разных темпераментов.'} Числа жизненного пути здесь используются только как игровая нумерология.</div><div class="muted">Не воспринимайте проценты как факт или прогноз. Настоящую совместимость лучше смотреть по вашим ответам в тестах выше.</div><div class="actions"><button class="ghost" onclick="window.open('https://www.google.com/search?q=${q}','_blank','noopener')">🔎 Посмотреть трактовки в интернете</button><button class="btn" onclick="dispatch('game','birthday')">Другие даты</button></div>`;
}
function renderIce(){round(state.idx,ICEBREAKERS.length);$('gameCard').innerHTML=`<div class="bigemoji">🧊</div><div class="eyebrow">Тема для разговора</div><div class="question">${esc(ICEBREAKERS[state.idx%ICEBREAKERS.length])}</div><div class="muted">Не надо отвечать идеально — задача просто снова запустить разговор.</div>${nextButton('Другая тема')}`}
function renderFlirt(){
 $('roundPill').textContent='По желанию';$('bar').style.width=(state.consent.host&&state.consent.guest)?'100%':'30%';
 if(!(state.consent.host&&state.consent.guest)){let yes=state.consent[actor()];$('gameCard').innerHTML=`<div class="bigemoji">🌶️</div><div class="question">Флирт и взрослые карточки</div><div class="muted">Только для совершеннолетних и только если обоим комфортно. Здесь нет графических заданий — скорее флирт, романтика и мягкие взрослые темы.</div><div class="actions"><button class="btn" ${yes?'disabled':''} onclick="dispatch('consent',true)">${yes?'Ты согласился(ась) · ждём партнёра':'Мне 18+ и я хочу играть'}</button><button class="ghost" onclick="backMenu()">Не сейчас</button></div>`;return}
 let x=FLIRT[state.idx%FLIRT.length];$('gameCard').innerHTML=`<div class="bigemoji">${x[0]==='18+'?'🌶️':x[0]==='Челлендж'?'⚡':'💘'}</div><div class="eyebrow">${esc(x[0])}</div><div class="question">${esc(x[1])}</div>${nextButton('Следующая карточка')}`;
}
function renderHide(){
 $('roundPill').textContent=`Раунд ${state.idx+1}`;$('bar').style.width=state.phase==='hide'?'33%':state.phase==='guess'?'67%':'100%';let me=actor(),isHider=me===state.hider,hname=state.hider==='host'?hostName():guestName(),item=HIDE_TASKS[state.taskIdx%HIDE_TASKS.length];
 if(state.phase==='hide'){if(isHider)$('gameCard').innerHTML=`<div class="bigemoji">🕵️</div><div class="eyebrow">Секретное задание</div><div class="question">Спрячь у себя ${esc(item)}</div><div class="muted">Партнёр не видит название предмета. Спрячь его, затем нажми кнопку.</div><div class="actions"><button class="btn" onclick="dispatch('hidden')">Спрятано</button></div>`;else $('gameCard').innerHTML=`<div class="bigemoji">🙈</div><div class="question">${esc(hname)} что-то прячет…</div><div class="muted">Не подглядывай. Когда будет готово, начнётся угадывание.</div>`;return}
 if(state.phase==='guess'){$('gameCard').innerHTML=`<div class="bigemoji">❓</div><div class="question">Угадай, что спрятал(а) ${esc(hname)}</div><div class="muted">Задавай вопросы, на которые можно ответить «да/нет»: это мягкое? этим пользуются каждый день? оно помещается в карман?</div><div class="actions"><button class="btn" onclick="dispatch('reveal')">Показать ответ</button></div>`;return}
 $('gameCard').innerHTML=`<div class="bigemoji">🎉</div><div class="eyebrow">Был спрятан предмет</div><div class="question">${esc(item)}</div><div class="muted">В следующем раунде роли поменяются.</div>${nextButton('Следующий раунд')}`;
}