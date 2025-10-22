AOS.init({duration:700,once:true});

document.querySelectorAll('.chip').forEach(b=>{
  b.addEventListener('click',()=>{
    document.querySelectorAll('.chip').forEach(x=>x.classList.remove('active'));
    b.classList.add('active');
    const filter = b.dataset.filter;
    highlightFilter(filter);
  });
});

function highlightFilter(name){
  // visual helper: briefly pulse the matching info cards
  const cards = document.querySelectorAll('.card.p-4');
  cards.forEach((c,i)=>{
    c.style.transform = 'scale(1)';
    c.style.opacity = '1';
    c.style.transition = 'transform .25s ease, opacity .25s ease';
  });
  if(name === 'info'){
    cards.forEach((c,i)=> {
      c.style.transform = 'translateY(0)';
    });
  } else {
    cards.forEach((c,i)=> {
      c.style.transform = 'translateY(0)';
    });
  }
}
