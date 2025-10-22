AOS.init({duration:700,easing:'ease-out-back',once:true});

document.getElementById('mobileMenuBtn').addEventListener('click',function(){
  var m=document.getElementById('mobileMenu');
  m.style.display = m.style.display === 'block' ? 'none' : 'block';
});

function setClock(){
  const now=new Date();
  const hours=now.getHours();
  const minutes=now.getMinutes();
  const seconds=now.getSeconds();
  const hourHand=document.getElementById('hourHand');
  const minuteHand=document.getElementById('minuteHand');
  const secondHand=document.getElementById('secondHand');
  const hourDeg = ((hours % 12) + minutes/60) * 30;
  const minuteDeg = (minutes + seconds/60) * 6;
  const secondDeg = seconds * 6;
  hourHand.setAttribute('transform',`rotate(${hourDeg} 128 128)`);
  minuteHand.setAttribute('transform',`rotate(${minuteDeg} 128 128)`);
  secondHand.setAttribute('transform',`rotate(${secondDeg} 128 128)`);

  const pad=(v)=>v.toString().padStart(2,'0');
  const digitalTime=document.getElementById('digitalTime');
  digitalTime.textContent = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

  const digitalDate=document.getElementById('digitalDate');
  const locale='es-CO';
  const optWeek={weekday:'long'};
  const optDate={day:'numeric', month:'long', year:'numeric'};
  const weekday = now.toLocaleDateString(locale,optWeek);
  const dateStr = now.toLocaleDateString(locale,optDate);
  digitalDate.textContent = `${weekday}, ${dateStr}`;
}

setClock();
setInterval(setClock,1000);

(function animateSecondsSmooth(){
  const secondHand=document.getElementById('secondHand');
  if(!secondHand) return;
  secondHand.style.transition='transform 0.1s linear';
})();
