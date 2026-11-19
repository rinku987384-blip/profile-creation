const KEY='pc_profiles_v1';
const $=id=>document.getElementById(id);
const form=$('pform'), list=$('list'), emptyMsg=$('emptyMsg');
let photoData='';
function getAll(){try{return JSON.parse(localStorage.getItem(KEY))||[]}catch{return[]}}
function saveAll(a){localStorage.setItem(KEY,JSON.stringify(a))}
function esc(s){return String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function makeUsername(value){return String(value||'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').trim().toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,30)}
function profileUsername(profile){const username=makeUsername(profile.username||profile.name);return username.length>=3?username:`user-${profile.id||'profile'}`}
function updateUsernamePreview(){const username=makeUsername(form.elements.username.value);$('usernamePreview').textContent=username.length>=3?`${location.origin}${location.pathname}?user=${encodeURIComponent(username)}`:'Username se aapka profile link banega.'}
function encodeProfileData(profile){const bytes=new TextEncoder().encode(JSON.stringify(profile));let binary='';for(const byte of bytes)binary+=String.fromCharCode(byte);return btoa(binary).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')}
function decodeProfileData(value){try{const base64=value.replace(/-/g,'+').replace(/_/g,'/');const binary=atob(base64.padEnd(Math.ceil(base64.length/4)*4,'='));const bytes=Uint8Array.from(binary,char=>char.charCodeAt(0));return JSON.parse(new TextDecoder().decode(bytes))}catch{return null}}
function createProfileLink(profile){
  const username=profileUsername(profile),shared={name:profile.name,username,role:profile.role,location:profile.location||'',bio:profile.bio||'',skills:Array.isArray(profile.skills)?profile.skills:[],github:profile.github||'',website:profile.website||'',photo:profile.photo||''};
  const url=new URL(location.href);url.search=new URLSearchParams({user:username}).toString();url.hash=`profile=${encodeProfileData(shared)}`;
  let photoIncluded=Boolean(shared.photo);
  if(url.href.length>8000&&photoIncluded){shared.photo='';url.hash=`profile=${encodeProfileData(shared)}`;photoIncluded=false}
  return{url:url.href,photoIncluded}
}
async function copyText(text){
  if(navigator.clipboard?.writeText){try{await navigator.clipboard.writeText(text);return}catch{}}
  const input=document.createElement('textarea');input.value=text;input.setAttribute('readonly','');input.style.position='fixed';input.style.opacity='0';document.body.appendChild(input);input.select();const copied=document.execCommand('copy');input.remove();if(!copied)throw new Error('Clipboard copy was not available.')
}
function showCopied(button,photoIncluded){const previous=button.textContent;button.textContent=photoIncluded?'Link copied!':'Copied (photo omitted)';window.setTimeout(()=>{if(button.isConnected)button.textContent=previous},2200)}
window.copyProfileLink=async(id,button)=>{
  const profile=getAll().find(item=>item.id===id);if(!profile)return;
  const link=createProfileLink(profile);
  try{await copyText(link.url);showCopied(button,link.photoIncluded)}catch{alert('Link copy nahi ho paya. Browser clipboard permission check karein.')}
};
window.copySharedProfileLink=async(button)=>{
  const profile=decodeProfileData(new URLSearchParams(location.hash.slice(1)).get('profile')||'');if(!profile)return;
  const link=createProfileLink(profile);
  try{await copyText(link.url);showCopied(button,link.photoIncluded)}catch{alert('Link copy nahi ho paya. Browser clipboard permission check karein.')}
};
form.photo?.addEventListener('change',e=>{
  const f=e.target.files[0]; if(!f) return;
  const r=new FileReader(); r.onload=()=>{photoData=r.result; $('pvImg').src=photoData; $('pvImg').style.display='block'; $('pvAvatar').style.display='none';}; r.readAsDataURL(f);
});
form.elements.name.addEventListener('input',()=>{if(!form.elements.username.dataset.edited){form.elements.username.value=makeUsername(form.elements.name.value);updateUsernamePreview()}});
form.elements.username.addEventListener('input',()=>{form.elements.username.dataset.edited='true';updateUsernamePreview()});
form.addEventListener('input',()=>{
  const d=new FormData(form);
  $('pvName').textContent=d.get('name')||'Aapka Naam';
  $('pvAvatar').textContent=(d.get('name')||'?').trim().charAt(0).toUpperCase()||'?';
  $('pvRole').textContent=[d.get('role'),d.get('location')].filter(Boolean).join(' • ')||'Aapka Role';
  $('pvBio').textContent=d.get('bio')||'Yahan aapki bio dikhegi...';
  $('pvSkills').innerHTML=String(d.get('skills')||'').split(',').map(s=>s.trim()).filter(Boolean).map(s=>`<span>${esc(s)}</span>`).join('');
});
$('resetBtn').onclick=()=>{form.reset();photoData='';$('pvImg').style.display='none';$('pvAvatar').style.display='block';form.dispatchEvent(new Event('input'))};
form.addEventListener('submit',e=>{
  e.preventDefault();
  const d=new FormData(form);
  if(!d.get('name')||!d.get('role')){alert('Naam aur Role zaroori hai');return}
  const arr=getAll();
  const username=makeUsername(d.get('username')||d.get('name'));
  if(username.length<3){alert('Username kam se kam 3 letters ka hona chahiye.');return}
  if(arr.some(profile=>profileUsername(profile)===username)){alert('Ye username pehle se use ho raha hai. Dusra username chunein.');return}
  arr.unshift({id:Date.now(),username,name:d.get('name').trim(),role:d.get('role'),location:d.get('location'),bio:d.get('bio'),skills:String(d.get('skills')||'').split(',').map(s=>s.trim()).filter(Boolean),github:d.get('github'),website:d.get('website'),photo:photoData,ts:new Date().toLocaleString('hi-IN')});
  saveAll(arr); render(); form.reset(); photoData=''; form.dispatchEvent(new Event('input'));
  form.elements.username.dataset.edited='';
  document.getElementById('profiles').scrollIntoView({behavior:'smooth'});
});
function render(q=''){
  const requestedUser=new URLSearchParams(location.search).get('user');
  if(requestedUser){renderSharedProfile(requestedUser);return}
  const arr=getAll().filter(p=>(p.name+' '+profileUsername(p)+' '+(p.skills||[]).join(' ')+' '+(p.role||'')).toLowerCase().includes(q.toLowerCase()));
  emptyMsg.style.display=arr.length?'none':'block';
  list.innerHTML=arr.map(p=>`
    <div class="pcard">
      <div class="pc-head"></div>
      ${p.photo?`<img class="avatar-img" src="${p.photo}" alt="">`:`<div class="avatar">${esc((p.name||'?').charAt(0).toUpperCase())}</div>`}
      <h3>${esc(p.name)}</h3>
      <p class="username">@${esc(profileUsername(p))}</p>
      <p class="role">${esc(p.role)}${p.location?' • '+esc(p.location):''}</p>
      ${p.bio?`<p class="bio">${esc(p.bio)}</p>`:''}
      <div class="chips">${(p.skills||[]).map(s=>`<span>${esc(s)}</span>`).join('')}</div>
      <div class="row" style="justify-content:center">
        <a class="btn small ghost" href="${esc(createProfileLink(p).url)}" target="_blank" rel="noopener noreferrer">View Public Profile</a>
        ${p.github?`<a class="btn small ghost" href="${esc(p.github)}" target="_blank">GitHub</a>`:''}
        ${p.website?`<a class="btn small ghost" href="${esc(p.website)}" target="_blank">Link</a>`:''}
        <button class="btn small ghost" onclick="copyProfileLink(${Number(p.id)},this)">Copy Link</button>
        <button class="btn small primary" onclick="shareProfile(${p.id})">Share</button>
      </div>
      <div><button class="del" onclick="delProfile(${p.id})">Delete</button></div>
    </div>`).join('');
}
function renderSharedProfile(username){
  const section=$('sharedProfile'),encoded=new URLSearchParams(location.hash.slice(1)).get('profile'),profile=encoded?decodeProfileData(encoded):null;
  $('hero').hidden=true;$('create').hidden=true;$('profiles').hidden=true;document.querySelector('.seo').hidden=true;document.querySelector('.nav nav').hidden=true;section.hidden=false;
  if(!profile||profileUsername(profile)!==username){section.innerHTML='<h1>Profile link nahi mila</h1><p class="muted">Yeh link adhura ya invalid hai. Profile owner se naya link mangwayein.</p><a class="btn primary" href="'+esc(location.pathname)+'">Website par wapas jaayein</a>';return}
  const homeUrl=location.origin+location.pathname,externalUrl=value=>{try{const url=new URL(/^https?:\/\//i.test(value)?value:`https://${value}`);return['http:','https:'].includes(url.protocol)?url.href:''}catch{return''}};
  const github=externalUrl(profile.github||''),website=externalUrl(profile.website||'');
  section.innerHTML=`<div class="shared-profile-card"><div class="pc-head"></div>${profile.photo?`<img class="avatar-img" src="${esc(profile.photo)}" alt="${esc(profile.name)}">`:`<div class="avatar">${esc((profile.name||'?').charAt(0).toUpperCase())}</div>`}<span class="username">@${esc(username)}</span><h1>${esc(profile.name)}</h1><p class="role">${esc(profile.role||'')}${profile.location?' • '+esc(profile.location):''}</p>${profile.bio?`<p class="bio">${esc(profile.bio)}</p>`:''}<div class="chips">${(Array.isArray(profile.skills)?profile.skills:[]).map(skill=>`<span>${esc(skill)}</span>`).join('')}</div><div class="row" style="justify-content:center">${github?`<a class="btn small ghost" href="${esc(github)}" target="_blank" rel="noopener noreferrer">GitHub</a>`:''}${website?`<a class="btn small ghost" href="${esc(website)}" target="_blank" rel="noopener noreferrer">Website</a>`:''}</div><div class="row" style="justify-content:center"><button class="btn primary" onclick="copySharedProfileLink(this)">Copy profile link</button><a class="btn ghost" href="${esc(homeUrl)}">Website home</a></div></div>`;
}
window.delProfile=id=>{saveAll(getAll().filter(p=>p.id!==id));render($('search').value)};
window.shareProfile=id=>{
  const p=getAll().find(x=>x.id===id); if(!p)return;
  const link=createProfileLink(p);
  if(navigator.share){navigator.share({title:`${p.name} (@${profileUsername(p)})`,text:`${p.name} ka profile dekhein`,url:link.url}).catch(error=>{if(error.name!=='AbortError')window.copyProfileLink(id,document.querySelector(`[onclick="copyProfileLink(${id},this)"]`))})}else{window.copyProfileLink(id,document.querySelector(`[onclick="copyProfileLink(${id},this)"]`))}
};
$('search').addEventListener('input',e=>render(e.target.value));
$('exportBtn').onclick=()=>{
  const blob=new Blob([JSON.stringify(getAll(),null,2)],{type:'application/json'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='profiles.json';a.click();
};
render();
