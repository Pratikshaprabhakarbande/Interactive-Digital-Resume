document.addEventListener('DOMContentLoaded', ()=>{
  // Create two canvas layers: matrix and subtle particles
  const matrix = document.createElement('canvas');
  matrix.id = 'matrixCanvas';
  const dots = document.createElement('canvas');
  dots.id = 'bgCanvas';
  document.body.appendChild(matrix);
  document.body.appendChild(dots);

  const mCtx = matrix.getContext('2d');
  const dCtx = dots.getContext('2d');

  let W = window.innerWidth, H = window.innerHeight;
  function resizeCanvases(){
    W = window.innerWidth; H = window.innerHeight;
    const DPR = Math.max(1, window.devicePixelRatio || 1);
    matrix.width = Math.floor(W * DPR); matrix.height = Math.floor(H * DPR);
    matrix.style.width = W + 'px'; matrix.style.height = H + 'px';
    mCtx.setTransform(DPR,0,0,DPR,0,0);
    dots.width = Math.floor(W * DPR); dots.height = Math.floor(H * DPR);
    dots.style.width = W + 'px'; dots.style.height = H + 'px';
    dCtx.setTransform(DPR,0,0,DPR,0,0);
  }

  // MATRIX EFFECT
  const cols = Math.floor(W / 18);
  let drops = [];
  // Slim charset for a calmer matrix effect
  const charset = '01+-';
  function initDrops(){
      drops = [];
      const count = Math.max(18, Math.floor(W/18));
      for(let i=0;i<count; i++) drops[i] = Math.floor(Math.random()*H/18);
  }

  function drawMatrix(){
    mCtx.fillStyle = 'rgba(11,15,14,0.06)';
    mCtx.fillRect(0,0,W,H);
    const fontSize = 14;
    mCtx.font = fontSize + 'px Roboto Mono, Share Tech Mono, monospace';
    for(let i=0;i<drops.length;i++){
      const text = charset.charAt(Math.floor(Math.random()*charset.length));
      const x = i * fontSize;
      const y = drops[i] * fontSize;
      // glow
        mCtx.fillStyle = 'rgba(0,212,255,0.08)';
      mCtx.fillText(text, x, y);
        mCtx.fillStyle = 'rgba(0,255,150,0.5)';
      mCtx.fillText(text, x, y);
      drops[i]++;
      if(drops[i]*fontSize > H && Math.random() > 0.975) drops[i]=0;
    }
  }

  // SUBTLE PARTICLES / CYBER DOTS
  let particles = [];
  function initParticles(){
      particles = [];
      const count = Math.floor(Math.max(16, W/30));
      for(let i=0;i<count;i++) particles.push({x:Math.random()*W,y:Math.random()*H,r: Math.random()*1.2+0.3, vx:(Math.random()-0.5)*0.12, vy:(Math.random()-0.5)*0.12});
  }
  function drawParticles(){
    dCtx.clearRect(0,0,W,H);
      dCtx.fillStyle = 'rgba(0,255,150,0.03)';
    for(let p of particles){
      dCtx.beginPath(); dCtx.arc(p.x,p.y,p.r,0,Math.PI*2); dCtx.fill();
      p.x += p.vx; p.y += p.vy;
      if(p.x < -10) p.x = W + 10; if(p.x > W + 10) p.x = -10;
      if(p.y < -10) p.y = H + 10; if(p.y > H + 10) p.y = -10;
    }
  }

  // ANIMATION LOOP
  let lastTime = performance.now();
  function loop(now){
    const dt = Math.min(60, now - lastTime);
    lastTime = now;
    drawMatrix();
    drawParticles();
    requestAnimationFrame(loop);
  }

  // Typing animation for hero subtitle (.lead)
  const leadEl = document.querySelector('.lead');
  if(leadEl){
    const fullText = leadEl.textContent.trim();
    leadEl.textContent = '';
    let idx = 0;
    function typeTick(){
      if(idx <= fullText.length){
        leadEl.textContent = fullText.slice(0, idx) + (idx % 2 === 0 ? '▌' : '');
        idx++;
        setTimeout(typeTick, 24 + Math.random()*30);
      } else {
        leadEl.textContent = fullText; // ensure final
      }
    }
    setTimeout(typeTick, 600);
  }

  // Reveal sections on scroll
  const sections = Array.from(document.querySelectorAll('.section'));
  sections.forEach(s=>s.classList.add('reveal'));
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting) e.target.classList.add('visible');
    });
  }, {threshold:0.12});
  sections.forEach(s=>obs.observe(s));

  // Menu toggle and smooth scroll (preserve existing behavior)
  const menu = document.getElementById('menuBtn');
  const nav = document.querySelector('.nav');
  menu && menu.addEventListener('click', ()=>{
    if(nav.style.display === 'block') nav.style.display = '';
    else nav.style.display = 'block';
  });
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', (e)=>{
      const href = a.getAttribute('href');
      if(href.length>1){
        e.preventDefault();
        const el = document.querySelector(href);
        if(el) el.scrollIntoView({behavior:'smooth',block:'start'});
      }
    })
  });

  function startAll(){
    resizeCanvases();
    initDrops();
    initParticles();
    lastTime = performance.now();
    requestAnimationFrame(loop);
  }
  window.addEventListener('resize', ()=>{ resizeCanvases(); initDrops(); initParticles(); });
  startAll();
});
