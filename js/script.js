AOS.init({duration:700,easing:'ease-out-back',once:true});

function updateClock() {
  const now = new Date();

  // Obtener hora, minutos y segundos
  let hours = now.getHours();
  let minutes = now.getMinutes();
  let seconds = now.getSeconds();

  // Formatear con ceros
  hours = hours.toString().padStart(2, '0');
  minutes = minutes.toString().padStart(2, '0');
  seconds = seconds.toString().padStart(2, '0');

  // Mostrar la hora
  document.getElementById('digitalTime').textContent = `${hours}:${minutes}:${seconds}`;

  // Mostrar la fecha completa
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = now.toLocaleDateString('es-CO', options);
  document.getElementById('digitalDate').textContent = formattedDate;
}

// Actualizar cada segundo
setInterval(updateClock, 1000);
updateClock(); // Ejecutar inmediatamente al cargar




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
