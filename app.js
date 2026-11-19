const KEY='pc_profiles_v1';
const $=id=>document.getElementById(id);
const form=$('pform'), list=$('list'), emptyMsg=$('emptyMsg');
let photoData='';
function getAll(){try{return JSON.parse(localStorage.getItem(KEY))||[]}catch{return[]}}
function saveAll(a){localStorage.setItem(KEY,JSON.stringify(a))}
function esc(s){return String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
form.photo?.addEventListener('change',e=>{
  const f=e.target.files[0]; if(!f) return;
  const r=new FileReader(); r.onload=()=>{photoData=r.result; $('pvImg').src=photoData; $('pvImg').style.display='block'; $('pvAvatar').style.display='none';}; r.readAsDataURL(f);
});
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
  arr.unshift({id:Date.now(),name:d.get('name'),role:d.get('role'),location:d.get('location'),bio:d.get('bio'),skills:String(d.get('skills')||'').split(',').map(s=>s.trim()).filter(Boolean),github:d.get('github'),website:d.get('website'),photo:photoData,ts:new Date().toLocaleString('hi-IN')});
  saveAll(arr); render(); form.reset(); photoData=''; form.dispatchEvent(new Event('input'));
  document.getElementById('profiles').scrollIntoView({behavior:'smooth'});
});
function render(q=''){
  const arr=getAll().filter(p=>(p.name+' '+(p.skills||[]).join(' ')+' '+(p.role||'')).toLowerCase().includes(q.toLowerCase()));
  emptyMsg.style.display=arr.length?'none':'block';
  list.innerHTML=arr.map(p=>`
    <div class="pcard">
      <div class="pc-head"></div>
      ${p.photo?`<img class="avatar-img" src="${p.photo}" alt="">`:`<div class="avatar">${esc((p.name||'?').charAt(0).toUpperCase())}</div>`}
      <h3>${esc(p.name)}</h3>
      <p class="role">${esc(p.role)}${p.location?' • '+esc(p.location):''}</p>
      ${p.bio?`<p class="bio">${esc(p.bio)}</p>`:''}
      <div class="chips">${(p.skills||[]).map(s=>`<span>${esc(s)}</span>`).join('')}</div>
      <div class="row" style="justify-content:center">
        ${p.github?`<a class="btn small ghost" href="${esc(p.github)}" target="_blank">GitHub</a>`:''}
        ${p.website?`<a class="btn small ghost" href="${esc(p.website)}" target="_blank">Link</a>`:''}
        <button class="btn small primary" onclick="shareProfile(${p.id})">Share</button>
      </div>
      <div><button class="del" onclick="delProfile(${p.id})">Delete</button></div>
    </div>`).join('');
}
window.delProfile=id=>{saveAll(getAll().filter(p=>p.id!==id));render($('search').value)};
window.shareProfile=id=>{
  const p=getAll().find(x=>x.id===id); if(!p)return;
  const text=`${p.name} — ${p.role} | Profile Creation par dekho: ${location.href}#profiles`;
  if(navigator.share){navigator.share({title:p.name,text})}else{navigator.clipboard?.writeText(text);alert('Profile link copy ho gaya!')}
};
$('search').addEventListener('input',e=>render(e.target.value));
$('exportBtn').onclick=()=>{
  const blob=new Blob([JSON.stringify(getAll(),null,2)],{type:'application/json'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='profiles.json';a.click();
};
render();
