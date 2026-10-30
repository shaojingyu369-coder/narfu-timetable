import {readSchool} from './live.mjs';
const data=await readSchool();
console.log(JSON.stringify({source:data.sourceUrl,events:data.events.length,weeks:data.weeks.length,retrievedAt:data.retrievedAt,via:data.via}));
