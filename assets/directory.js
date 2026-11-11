(()=>{
  const form=document.querySelector('#directorySearch');
  const input=document.querySelector('#directoryQuery');
  const entries=[...document.querySelectorAll('#directoryEntries .portal-card')];
  const count=document.querySelector('#directoryCount');
  const empty=document.querySelector('#directoryEmpty');
  const filter=()=>{
    const terms=input.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
    let visible=0;
    entries.forEach(entry=>{
      entry.hidden=!terms.every(term=>entry.textContent.toLowerCase().includes(term));
      if(!entry.hidden)visible++;
    });
    count.textContent=visible+' of '+entries.length+' starting points shown';
    empty.hidden=visible!==0;
  };
  input.value=new URLSearchParams(window.location.search).get('q')||'';
  input.addEventListener('input',filter);
  form.addEventListener('submit',event=>{event.preventDefault();filter()});
  document.querySelector('#directoryClear').addEventListener('click',()=>{input.value='';filter();input.focus()});
  filter();
})();
