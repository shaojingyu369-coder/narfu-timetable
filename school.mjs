// School parser and verified bilingual names from the existing timetable.
const TEACHER_FULL_NAMES={"Багрецова Н.В.":{"ru":"Багрецова Нина Викторовна","zh":"巴格列佐娃·妮娜·维克托罗芙娜"},"Бадогина А.И.":{"ru":"Бадогина Алена Игоревна","zh":"巴多吉娜·阿廖娜·伊戈列芙娜"},"Бейм В.В.":{"ru":"Бейм Виктория Валерьевна","zh":"贝姆·维多利亚·瓦列里耶芙娜"},"Долгова И.И.":{"ru":"Долгова Ирина Ивановна","zh":"多尔戈娃·伊琳娜·伊万诺芙娜"},"Елепов А.А.":{"ru":"Елепов Александр Алексеевич","zh":"叶列波夫·亚历山大·阿列克谢耶维奇"},"Епимахова А.С.":{"ru":"Епимахова Александра Сергеевна","zh":"叶皮马霍娃·亚历山德拉·谢尔盖耶芙娜"},"Коваленко О.Л.":{"ru":"Коваленко Олег Леонидович","zh":"科瓦连科·奥列格·列昂尼多维奇"},"Лоренц А.С.":{"ru":"Лоренц Анатолий Сергеевич","zh":"洛伦茨·阿纳托利·谢尔盖耶维奇"},"Марьянчик В.А.":{"ru":"Марьянчик Виктория Анатольевна","zh":"马里扬奇克·维多利亚·阿纳托利耶芙娜"},"Попова Л.В.":{"ru":"Попова Лариса Владиславовна","zh":"波波娃·拉里萨·弗拉季斯拉沃芙娜"},"Степырева Е.В.":{"ru":"Степырева Елена Валерьевна","zh":"斯捷皮列娃·叶莲娜·瓦列里耶芙娜"},"Третьяков С.И.":{"ru":"Третьяков Сергей Иванович","zh":"特列季亚科夫·谢尔盖·伊万诺维奇"},"Шостенко Д.Н.":{"ru":"Шостенко Денис Николаевич","zh":"绍斯坚科·杰尼斯·尼古拉耶维奇"},"Вихарев А.Н.":{"ru":"Вихарев Александр Николаевич","zh":"维哈列夫·亚历山大·尼古拉耶维奇"},"Теселкин М.В.":{"ru":"Теселкин Михаил Владиславович","zh":"捷谢尔金·米哈伊尔·弗拉季斯拉沃维奇"}};
function fullTeacher(name=''){return TEACHER_FULL_NAMES[name.trim()]||Object.values(TEACHER_FULL_NAMES).find(v=>v.ru===name.trim())||null;}
const teacherSurnames = {'Шостенко':'绍斯坚科','Коваленко':'科瓦连科','Епимахова':'叶皮马霍娃','Попова':'波波娃','Елепов':'叶列波夫','Степырева':'斯捷皮列娃','Бейм':'贝姆','Марьянчик':'马里扬奇克','Лоренц':'洛伦茨','Бадогина':'巴多吉娜','Багрецова':'巴格列佐娃'};
export function teacherChinese(name='') {return fullTeacher(name)?.zh||null;}
export function locationChinese(location='') {
 if(!location)return null;
 if(!/Северной Двины|Ломоносова/.test(location))return null;
 return location.replace(/г\.\s*Архангельск/g,'阿尔汉格尔斯克市').replace(/наб\.\s*Северной Двины/g,'北德维纳河滨街').replace(/пр\.\s*Ломоносова/g,'罗蒙诺索夫大街').replace(/\bауд\.\s*/gu,'教室 ').replace(/ауд\.\s*/g,'教室 ').replace(/д\.\s*(\d+)/g,'$1号').replace(/(?:корп\.|к\.)\s*(\d+)/g,'$1号楼').replace(/罗蒙诺索夫大街,\s*(\d+)/g,'罗蒙诺索夫大街$1号').replace(/(街)\s*,\s*/g,'$1').replace(/\s*,\s*/g,'，').trim();
}
export function subgroupChinese(group=''){return group?group.replace(/Подгруппа\s*/g,'分组 ').replace(/Поток\s*/g,'合班 ').replace(/Немецкий язык/g,'德语').replace(/практика/g,'实习').replace(/_англ/g,'_英语').replace(/_нем/g,'_德语').replace(/_рус/g,'_俄语'):'';}
export function kindChinese(kind=''){return {'Лабораторная работа':'实验课','Лекция':'讲座','Практическое занятие':'实践课'}[kind]||'课程类型待译';}
export function enrichEvent(e){const full=fullTeacher(e.teacher);return {...e,teacherOriginal:e.teacherOriginal||e.teacher,teacher:full?.ru||e.teacher,teacherFullRu:full?.ru||null,teacherZh:full?.zh||null,roomZh:e.room?'教室 '+e.room:'教室待公布',locationZh:locationChinese(e.location),subgroupZh:subgroupChinese(e.subgroup),kindZh:kindChinese(e.kind)};}
export const SOURCE = 'https://ruz.narfu.ru/?timetable&group=20991';
export const OFFICIAL_CALENDAR = 'https://ruz.narfu.ru/?icalendar&oid=20991&cod=111621';
const translations = [
 ['Компьютерные технологии в машиностроении','机械工程计算机技术'],
 ['Устройство и диагностика элементов и систем бортовой автоматики технологических машин и оборудования','工艺机械与设备机载自动化元件及系统的结构与诊断'],
 ['Инновационное развитие транспортно-технологических машин и оборудования','运输与工艺机械设备的创新发展'],
 ['Методология и методы научного исследования','科学研究方法论与方法'],
 ['Академическое письмо и выступление','学术写作与演讲'],
 ['Иностранный язык в профессиональной сфере','专业外语'],
 ['Учебная практика, проектная практика','教学实习与项目实践'],
 ['Промышленный маркетинг и менеджмент','工业市场营销与管理'],
 ['Управление проектами','项目管理'],
];
export function translate(title) {
 const match = translations.find(([ru])=>title.startsWith(ru));
 if (!match) return null;
 return match[1] + (/русский/.test(title)?'（俄语）':/английский|англ/.test(title)?'（英语）':/немецкий/.test(title)?'（德语）':'');
}
const entities = {nbsp:' ',amp:'&',quot:'"',apos:"'",lt:'<',gt:'>',ndash:'–',mdash:'—'};
export function clean(s='') {return s.replace(/<!--[\s\S]*?-->/g,'').replace(/<[^>]*>/g,' ').replace(/&(#x[\da-f]+|#\d+|\w+);/gi,(m,k)=>k[0]==='#'?String.fromCodePoint(k[1].toLowerCase()==='x'?parseInt(k.slice(2),16):parseInt(k.slice(1),10)):(entities[k]??m)).replace(/\s+/g,' ').trim();}
function field(card,name){return (card.match(new RegExp('<span\\b[^>]*class="[^"\\n]*\\b'+name+'\\b[^"\\n]*"[^>]*>([\\s\\S]*?)<\\/span>','i'))||[])[1]||'';}
function hash(s){let n=2166136261;for(const c of s){n^=c.codePointAt(0);n=Math.imul(n,16777619);}return(n>>>0).toString(36);}
export function parseTimetable(html) {
 if (!/<title>[^<]*111621/.test(html)) throw new Error('页面身份校验失败 / Неверная группа');
 const weeks=[...html.matchAll(/<span class="visible-sm visible-md">(\d{2})\.(\d{2})\.(\d{4})<\/span>/g)].map(m=>`${m[3]}-${m[2]}-${m[1]}`);
 if (!weeks.length) throw new Error('未识别到学校周列表 / Формат недель изменён');
 const days = [], events = [], seen=new Set();
 const chunks=html.split(/<div\b[^>]*class="(?=[^"]*\blist\b)[^"]*"[^>]*>/i).slice(1);
 for (const chunk of chunks) {
  const d = chunk.match(/<div\b[^>]*class="dayofweek[^\"]*"[^>]*>[\s\S]*?(\d{2})\.(\d{2})\.(\d{4})[\s\S]*?<\/div>/i);
  if (!d) continue;
  const date=`${d[3]}-${d[2]}-${d[1]}`; days.push(date);
  for(const m of chunk.matchAll(/<div\b[^>]*class="[^\"]*\btimetable_sheet\b[^\"]*"[^>]*>([\s\S]*?)<\/div>/gi)) {
   const card=m[1]; const times=clean(field(card,'time_para')).match(/(\d{2}:\d{2})[–—-](\d{2}:\d{2})/);
   if(!times) continue;
   const disc=field(card,'discipline'), teacher=clean((disc.match(/<nobr>([\s\S]*?)<\/nobr>/)||[])[1]);
   const title=clean(disc.replace(/\s*\(<nobr>[\s\S]*?<\/nobr>\)/g,''));
   if(!title) throw new Error('课程标题缺失 / Нет названия занятия');
   const roomHTML=field(card,'auditorium'); const room=clean((roomHTML.match(/<b>([\s\S]*?)<\/b>/)||[])[1]).replace(/^ауд\.\s*/, '');
   const location=clean(roomHTML); const subgroup=clean(field(card,'group'));
   const event={date,start:times[1],end:times[2],slot:clean(field(card,'num_para')),title,zh:translate(title),teacher,kind:clean(field(card,'kindOfWork')),room,location,subgroup};
   const key=JSON.stringify(event);if(seen.has(key)) continue;seen.add(key);
   event.id=hash([date,event.slot,title,subgroup].join('|'));events.push(event);
  }
 }
 if(days.length<6) throw new Error('日期结构异常 / Формат дат изменён');
 // An unexpectedly empty source must not wipe a previously valid calendar.
 if(!events.length && !/x-qty:\s*0\b/.test(html)) throw new Error('未能确认空课表 / Пустое расписание не подтверждено');
 const sourceStatus=clean((html.match(/<p\b[^>]*class="status"[^>]*>([\s\S]*?)<\/p>/)||[])[1]);
 events.sort((a,b)=>(a.date+a.start+a.subgroup).localeCompare(b.date+b.start+b.subgroup));
 return {group:'111621',groupId:'20991',timezone:'Europe/Moscow',weeks:[...new Set(weeks)],days:[...new Set(days)],events,sourceStatus,sourceUrl:SOURCE};
}
export function matchesFilter(e, subgroup='all',language='all') {
 if(subgroup!=='all' && /Подгруппа 111621_[12](?:_|$)/.test(e.subgroup) && !e.subgroup.includes('111621_'+subgroup)) return false;
 const lang=/англ|английский/i.test(e.subgroup+' '+e.title)?'en':/нем|Немецкий/i.test(e.subgroup+' '+e.title)?'de':/рус|русский/i.test(e.subgroup+' '+e.title)?'ru':null;
 return language==='all'||!lang||lang===language;
}
const icescape = s=>String(s??'').replace(/\\/g,'\\\\').replace(/\r?\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;');
function fold(line){let out='',bytes=0;for(const c of line){const n=new TextEncoder().encode(c).length;if(bytes+n>75){out+='\r\n ';bytes=1;}out+=c;bytes+=n;}return out;}
export function toICS(data,subgroup='all',language='all') {
 const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//NARFU Bilingual Timetable//ZH-RU//EN','CALSCALE:GREGORIAN','METHOD:PUBLISH','X-WR-CALNAME:111621 · 中俄双语课表','X-WR-TIMEZONE:Europe/Moscow','REFRESH-INTERVAL;VALUE=DURATION:PT1H','X-PUBLISHED-TTL:PT1H'];
 const stamp=new Date(data.retrievedAt).toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');
 for(const raw of data.events.filter(e=>matchesFilter(e,subgroup,language))) {
  const e=enrichEvent(raw);
  // Dates are explicitly UTC+03, independent of the phone's timezone.
  const utc=time=>new Date(e.date+'T'+time+':00+03:00').toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');
  lines.push('BEGIN:VEVENT','UID:'+e.id+'@narfu-bilingual-20991','DTSTAMP:'+stamp,'DTSTART:'+utc(e.start),'DTEND:'+utc(e.end),'SUMMARY:'+icescape((e.zh?e.zh+' / ':'')+e.title),'LOCATION:'+icescape([e.locationZh,e.location].filter(Boolean).join(' / ')),'DESCRIPTION:'+icescape([e.kindZh+' / '+e.kind,'教师 / Преподаватель: '+[e.teacherZh,e.teacher].filter(Boolean).join(' / '),e.subgroupZh+(e.subgroup?' / '+e.subgroup:''),'学校课表 / Источник: '+SOURCE].filter(Boolean).join('\n')),'URL:'+SOURCE,'END:VEVENT');
 }
 lines.push('END:VCALENDAR');return lines.map(fold).join('\r\n')+'\r\n';
}

