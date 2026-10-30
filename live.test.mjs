import test from 'node:test';
import assert from 'node:assert/strict';
import {createService} from './live.mjs';

const ORIGIN='https://narfu-timetable-111621.github.io';
function fixture(start='10:00',end='11:35'){
 const days=Array.from({length:6},(_,i)=>`<div class="list"><div class="dayofweek">${String(26+i).padStart(2,'0')}.10.2026</div>${i?'':`<div class="timetable_sheet"><span class="time_para">${start}–${end}</span><span class="num_para">2</span><span class="discipline">Компьютерные технологии в машиностроении (<nobr>Коваленко О.Л.</nobr>)</span><span class="kindOfWork">Практическое занятие</span><span class="auditorium"><b>ауд. А-Л41, к.1</b>, г.Архангельск, пр.Ломоносова, 41, к.1</span><span class="group">Подгруппа 111621_1</span></div>`}</div>`).join('');
 return '<title>Расписание 111621</title><span class="visible-sm visible-md">26.10.2026</span>'+days;
}
const request=(query='')=>new Request('https://api.example/api/timetable'+query,{headers:{Origin:ORIGIN}});

test('sequential refreshes fetch the school again and expose changed course times',async()=>{
 let calls=0;const options=[];
 const service=createService({fetchImpl:async(url,init)=>{calls++;options.push(init);assert.equal(url,'https://ruz.narfu.ru/?timetable&group=20991');return new Response(fixture(calls===1?'10:00':'12:00'));}});
 const first=await service(request());assert.equal(first.status,200);
 assert.equal((await first.json()).events[0].start,'10:00');
 const second=await service(request('?check=2'));const data=await second.json();
 assert.equal(data.events[0].start,'12:00');assert.equal(calls,2);
 assert.equal(data.events[0].zh,'机械工程计算机技术');assert.equal(data.events[0].room,'А-Л41, к.1');
 assert.equal(data.via,'live-proxy');assert.equal(data.fresh,true);
 assert.equal(second.headers.get('Access-Control-Allow-Origin'),ORIGIN);
 assert.match(second.headers.get('Cache-Control'),/no-store/);
 assert.ok(options.every(o=>o.cache==='no-store'));
});
test('a school failure never returns an old course list as fresh',async()=>{
 let calls=0;const service=createService({fetchImpl:async()=>new Response(++calls===1?fixture():'unavailable',{status:calls===1?200:503})});
 assert.equal((await service(request())).status,200);
 const failed=await service(request());const data=await failed.json();
 assert.equal(failed.status,502);assert.equal(data.fresh,false);assert.equal(data.events,undefined);
});
test('invalid school HTML is rejected',async()=>{
 const service=createService({fetchImpl:async()=>new Response('<title>Other group</title>')});
 assert.equal((await service(request())).status,502);
});
test('simultaneous requests share only the in-flight school fetch',async()=>{
 let unblock;let calls=0;
 const service=createService({fetchImpl:async()=>{calls++;await new Promise(resolve=>{unblock=resolve;});return new Response(fixture());}});
 const a=service(request());const b=service(request());unblock();
 assert.equal((await a).status,200);assert.equal((await b).status,200);assert.equal(calls,1);
});
test('cross-origin and arbitrary proxy requests cannot trigger school reads',async()=>{
 let calls=0;const service=createService({fetchImpl:async()=>{calls++;return new Response(fixture());}});
 assert.equal((await service(new Request('https://api.example/api/timetable',{headers:{Origin:'https://other.example'}}))).status,403);
 assert.equal((await service(request('?url=https://other.example'))).status,400);
 assert.equal((await service(new Request('https://api.example/api/timetable',{method:'POST',headers:{Origin:ORIGIN}}))).status,405);
 assert.equal(calls,0);
});
test('preflight supports the public timetable without authentication',async()=>{
 const response=await createService()(new Request('https://api.example/api/timetable',{method:'OPTIONS',headers:{Origin:ORIGIN}}));
 assert.equal(response.status,204);assert.equal(response.headers.get('Access-Control-Allow-Origin'),ORIGIN);
 assert.equal(response.headers.get('Access-Control-Allow-Credentials'),null);
});
