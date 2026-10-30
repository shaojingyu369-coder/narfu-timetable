import {SOURCE,parseTimetable,enrichEvent} from './school.mjs';

export async function readSchool({fetchImpl=fetch,clock=()=>new Date()}={}){
 const startedAt=clock().toISOString();
 const response=await fetchImpl(SOURCE,{
  headers:{'User-Agent':'Mozilla/5.0','Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8','Cache-Control':'no-cache'},
  cache:'no-store',signal:AbortSignal.timeout(18000)
 });
 if(!response.ok)throw new Error('School returned HTTP '+response.status);
 const html=await response.text();
 if(html.length>2000000)throw new Error('Unexpected school page size');
 const parsed=parseTimetable(html);
 const checkedAt=clock().toISOString();
 return {...parsed,events:parsed.events.map(enrichEvent),retrievedAt:checkedAt,checkedAt,requestStartedAt:startedAt,fresh:true,via:'live-proxy'};
}

export function createService({fetchImpl=fetch,clock=()=>new Date(),allowedOrigins=['https://narfu-timetable-111621.github.io']}={}){
 // Only overlap in-flight reads. Sequential button presses always fetch the school again.
 let pending;
 return async function handle(request){
  const origin=request.headers.get('Origin');
  const headers={'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store, max-age=0','CDN-Cache-Control':'no-store','Vercel-CDN-Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Vary':'Origin'};
  if(origin&&!allowedOrigins.includes(origin))return Response.json({error:'Origin is not allowed'},{status:403,headers});
  if(origin)headers['Access-Control-Allow-Origin']=origin;
  if(request.method==='OPTIONS')return new Response(null,{status:204,headers:{...headers,'Access-Control-Allow-Methods':'GET, OPTIONS','Access-Control-Allow-Headers':'Accept'}});
  if(request.method!=='GET')return Response.json({error:'Method not allowed'},{status:405,headers:{...headers,Allow:'GET, OPTIONS'}});
  const url=new URL(request.url);
  if([...url.searchParams.keys()].some(key=>!['check'].includes(key)))return Response.json({error:'Only the fixed school timetable is supported'},{status:400,headers});
  try{
   if(!pending){pending=readSchool({fetchImpl,clock});pending.then(()=>{pending=undefined;},()=>{pending=undefined;});}
   const data=await pending;
   return Response.json(data,{headers});
  }catch(error){
   console.warn('School timetable read failed:',error.name,error.message);
   return Response.json({fresh:false,via:'live-proxy',checkedAt:clock().toISOString(),error:'学校当前课表读取失败，请稍后重试。 / Не удалось получить расписание САФУ. Повторите позже.'},{status:error.name==='TimeoutError'?504:502,headers});
  }
 };
}
