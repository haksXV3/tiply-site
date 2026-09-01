/* ══════════════════════════════════════════════════════════════════════
   CONFIGURATION
   ══════════════════════════════════════════════════════════════════════ */

/* ┌────────────────────────────────────────────────────────────────────┐
   │  UNE SEULE LIGNE À CHANGER POUR ACTIVER L'ENVOI DU FORMULAIRE      │
   └────────────────────────────────────────────────────────────────────┘

   Colle ici l'URL du formulaire, entre apostrophes. Rien d'autre à faire :
   tout le code d'envoi est écrit et éprouvé en dessous.

       Formspree   'https://formspree.io/f/xxxxxxxx'
       FormSubmit  'https://formsubmit.co/ajax/xxxxxxxx'
       Web3Forms   'https://api.web3forms.com/submit'
       Sur mesure  n'importe quelle URL acceptant du POST JSON

   Si cette valeur repasse à null, le formulaire se replie sur l'ouverture de
   la messagerie du visiteur — cela fonctionne encore, mais on perd du monde
   en route. */
const FORM_ENDPOINT = 'https://formspree.io/f/maqdaraz';

/* Clé d'accès, uniquement si le service en réclame une dans le corps de la
   requête (Web3Forms). Formspree et FormSubmit n'en ont pas besoin. */
const FORM_ACCESS_KEY = null;

/* Boîte de réception utilisée par le repli mailto ci-dessus.
   Assemblée en deux morceaux pour gêner les robots collecteurs. */
const CONTACT_MAILBOX = ['hachahbar', 'litesoft.fr'].join('@');

/* Respect de « réduire les animations » (OS/navigateur). Quand c'est
   activé, on coupe les boucles décoratives : particules, étoiles, cochon. */
const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


/* TOGGLE */
const tog=document.getElementById('tog');
const lm=document.getElementById('lm'),la=document.getElementById('la');
const BASE={std:29,prem:49};const D=0.85;let ann=false;
function upd(){
  const aS=Math.round(BASE.std*D),yS=Math.round(aS*12),sS=Math.round(BASE.std*12-yS);
  document.getElementById('pn1').textContent=ann?aS:BASE.std;
  document.getElementById('pf1').textContent=ann?'facturé annuellement · + location iPhone ~20–25 €/mois':'+ location iPhone ~20–25 €/mois';
  const pa1=document.getElementById('pa1');
  if(ann){pa1.textContent='soit '+yS+'€/an — économie '+sS+'€';pa1.classList.add('show')}
  else{pa1.textContent='';pa1.classList.remove('show')}
  const aP=Math.round(BASE.prem*D),yP=Math.round(aP*12),sP=Math.round(BASE.prem*12-yP);
  document.getElementById('pn2').textContent=ann?aP:BASE.prem;
  document.getElementById('pf2').textContent=ann?'facturé annuellement · + location iPhone ~20–25 €/mois':'+ location iPhone ~20–25 €/mois';
  const pa2=document.getElementById('pa2');
  if(ann){pa2.textContent='soit '+yP+'€/an — économie '+sP+'€';pa2.classList.add('show')}
  else{pa2.textContent='';pa2.classList.remove('show')}
}
/* Le switch est un <div role="switch"> : il faut lui câbler le clavier
   à la main, et tenir aria-checked à jour (ce qui n'était pas fait). */
function toggleBilling(){
  ann = !ann;
  tog.classList.toggle('act', ann);
  tog.setAttribute('aria-checked', ann ? 'true' : 'false');
  lm.classList.toggle('on', !ann);
  la.classList.toggle('on', ann);
  upd();
}
tog.addEventListener('click', toggleBilling);
tog.addEventListener('keydown', function(e){
  if(e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar'){
    e.preventDefault();
    toggleBilling();
  }
});
upd();

/* SIMULATOR */
const tr=document.getElementById('tr'),cr=document.getElementById('cr');
function fmt(n){n=Math.round(n);return n>=1000?(n/1000).toFixed(1).replace('.0','')+'k€':n+'€'}
// Simulator offer selection
var simComm = 0.08;
var simLabel = 'Standard 8 %';
document.querySelectorAll('.sob').forEach(function(btn){
  btn.addEventListener('click', function(){
    document.querySelectorAll('.sob').forEach(function(b){ b.classList.remove('active'); });
    btn.classList.add('active');
    simComm = parseFloat(btn.getAttribute('data-comm'));
    simLabel = btn.getAttribute('data-label');
    sim();
  });
});
// Set Essentielle active by default
var firstSob = document.querySelector('.sob');
if(firstSob){ simComm = parseFloat(firstSob.getAttribute('data-comm')); simLabel = firstSob.getAttribute('data-label'); }

function sim(){
  const t=parseFloat(tr.value),c=parseInt(cr.value);
  document.getElementById('tv').textContent=t+' €';
  document.getElementById('cv').textContent=c;
  document.getElementById('sw').textContent=fmt(t*c*30*0.12);
  const wt=t*c*30*0.35*1.20;
  document.getElementById('st').textContent=fmt(wt);
  document.getElementById('sm').textContent=fmt(wt*(1-simComm));
  var lbl = document.getElementById('smlabel');
  if(lbl) lbl.textContent='net reversé ('+simLabel+')';
}
tr.addEventListener('input',sim);cr.addEventListener('input',sim);sim();

/* FAQ — accordéon.
   L'ouverture ne répondait qu'à la souris : les en-têtes sont désormais
   focusables et réagissent à Entrée / Espace, avec aria-expanded à jour. */
(function(){
  var cards = document.querySelectorAll('.faq-card');

  function toggle(card){
    var opening = !card.classList.contains('active');
    cards.forEach(function(c){
      c.classList.remove('active');
      var h = c.querySelector('.faq-card-header');
      if(h) h.setAttribute('aria-expanded', 'false');
    });
    if(opening){
      card.classList.add('active');
      var h = card.querySelector('.faq-card-header');
      if(h) h.setAttribute('aria-expanded', 'true');
    }
  }

  cards.forEach(function(card){
    var header = card.querySelector('.faq-card-header') || card;
    header.addEventListener('click', function(){ toggle(card); });
    header.addEventListener('keydown', function(e){
      if(e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar'){
        e.preventDefault();
        toggle(card);
      }
    });
  });
})();

/* Le scroll reveal est géré plus bas par « EFFECT 5 ». Un premier observateur
   posait ici une classe .vis dont plus aucune règle CSS ne dépendait :
   deux observateurs tournaient en parallèle pour un seul effet. */

/* ═══ CAROUSEL ═══ */
(function(){
  var slides = document.querySelectorAll('.cs-slide');
  var cards  = document.querySelectorAll('.cs-card');
  var fill   = document.getElementById('csFill');
  var stage  = document.getElementById('csStage');
  if(!slides.length) return;
  var N=slides.length, cur=0, DELAY=4500, startT=null, paused=false;

  function go(n){
    slides[cur].classList.remove('active');
    cards[cur] && cards[cur].classList.remove('active');
    cur = ((n % N) + N) % N;
    slides[cur].classList.add('active');
    cards[cur] && cards[cur].classList.add('active');
    if(fill) fill.style.width='0%';
    startT = null;
  }
  function tick(now){
    if(!paused){
      if(!startT) startT = now;
      if(fill) fill.style.width = Math.min((now-startT)/DELAY*100,100)+'%';
      if(now-startT >= DELAY) go(cur+1);
    }
    requestAnimationFrame(tick);
  }
  var bp=document.getElementById('csPrev'), bn=document.getElementById('csNext');
  bp && bp.addEventListener('click', function(){ go(cur-1); });
  bn && bn.addEventListener('click', function(){ go(cur+1); });
  cards.forEach(function(c){
    c.addEventListener('click', function(){ go(parseInt(c.getAttribute('data-c'))); });
  });
  if(stage){
    stage.addEventListener('mouseenter', function(){ paused=true; });
    stage.addEventListener('mouseleave', function(){ paused=false; startT=null; });
    var tx0=0;
    stage.addEventListener('touchstart', function(e){ tx0=e.touches[0].clientX; },{passive:true});
    stage.addEventListener('touchend',   function(e){
      var dx=e.changedTouches[0].clientX-tx0;
      if(Math.abs(dx)>40) go(cur+(dx<0?1:-1));
    },{passive:true});
  }
  requestAnimationFrame(tick);
})();


/* ═══ COCHON BALADEUR ═══ */
(function(){
  var pig = document.getElementById('roaming-pig');
  var canvas = document.getElementById('pig-trail');
  if(!pig || !canvas) return;

  /* Décor pur : on n'impose pas une mascotte en mouvement permanent à qui
     a demandé des animations réduites. */
  if(REDUCED_MOTION){
    pig.style.display = 'none';
    canvas.style.display = 'none';
    var zone = document.getElementById('pig-click-zone');
    if(zone) zone.style.display = 'none';
    return;
  }

  var ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  window.addEventListener('resize', function(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  var SIZE = 100;
  var x = 200, y = 200;
  var dx = 1.8, dy = 1.1;
  var trail = [];
  var TLEN = 30;
  var t = 0;

  function step(){
    // Onglet en arrière-plan : on garde la boucle vivante mais on ne
    // calcule ni ne dessine rien.
    if(document.hidden){ requestAnimationFrame(step); return; }
    t++;
    var W = window.innerWidth;
    var H = window.innerHeight;

    // Occasionally change direction randomly
    if(t % 120 === 0){
      dx += (Math.random()-0.5)*0.8;
      dy += (Math.random()-0.5)*0.8;
    }

    // Clamp speed
    var spd = Math.sqrt(dx*dx+dy*dy);
    if(spd > 1.6){ dx=dx/spd*1.6; dy=dy/spd*1.6; }
    if(spd < 0.4){ dx=dx/spd*0.4; dy=dy/spd*0.4; }

    x += dx;
    y += dy;

    // Bounce walls
    if(x <= 0){ x=0; dx=Math.abs(dx); }
    if(x >= W-SIZE){ x=W-SIZE; dx=-Math.abs(dx); }
    if(y <= 0){ y=0; dy=Math.abs(dy); }
    if(y >= H-SIZE){ y=H-SIZE; dy=-Math.abs(dy); }

    // Flip
    if(dx < 0) pig.classList.add('flip');
    else pig.classList.remove('flip');

    // Bob
    var bob = Math.sin(t/20)*3;

    // Move pig
    pig.style.transform = 'translate('+x+'px,'+(y+bob)+'px)';
    if(clickZone) clickZone.style.transform = pig.style.transform;

    // Trail
    trail.push({x:x+SIZE/2, y:y+SIZE/2+bob});
    if(trail.length > TLEN) trail.shift();

    // Draw trail
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for(var i=1; i<trail.length; i++){
      var ratio = i/trail.length;
      var alpha = ratio * 0.5;
      var r = ratio * 12;

      // Glow dot
      var grd = ctx.createRadialGradient(trail[i].x,trail[i].y,0,trail[i].x,trail[i].y,r*1.8);
      grd.addColorStop(0,'rgba(184,148,255,'+alpha+')');
      grd.addColorStop(1,'rgba(152,116,242,0)');
      ctx.beginPath();
      ctx.arc(trail[i].x,trail[i].y,r*1.8,0,Math.PI*2);
      ctx.fillStyle=grd;
      ctx.fill();

      // Stars every 5 pts
      if(i%5===0 && ratio>0.3){
        ctx.save();
        ctx.globalAlpha=alpha*0.85;
        ctx.fillStyle=(i%10===0)?'#fbbf24':'#c4b0fa';
        ctx.translate(trail[i].x+(Math.random()-0.5)*16,trail[i].y+(Math.random()-0.5)*16);
        // draw a 5-point star
        ctx.beginPath();
        for(var s=0;s<10;s++){
          var ang = s*Math.PI/5 - Math.PI/2;
          var rad = (s%2===0)?(3+ratio*5):2;
          s===0?ctx.moveTo(Math.cos(ang)*rad,Math.sin(ang)*rad):ctx.lineTo(Math.cos(ang)*rad,Math.sin(ang)*rad);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
    }

    requestAnimationFrame(step);
  }

  // Delay start slightly to ensure DOM is ready
  setTimeout(function(){ requestAnimationFrame(step); }, 100);

  // Click interaction
  var phrases = [
    "Aïe ! 🐷", "Ouille !", "Gruik !", "Arrête ça pic !",
    "Sinon ça va toi ? 😅", "Hey ! 👋", "t'as pas une pièce ?",
    "Je bosse moi ! 💼", "Gruiiik ! 😤", "C'est quoi ce traitement ?!"
  ];
  var clickCount = 0;
  var exploded = false;
  var bubble = document.getElementById('pig-speech');
  var bubbleTimer = null;

  // La zone cliquable suit le cochon. Elle était recopiée par une seconde
  // boucle rAF permanente ; step() s'en charge maintenant, au moment même
  // où il pose la position.
  var clickZone = document.getElementById('pig-click-zone');

  function handlePigClick(){
    if(exploded) return;
    clickCount++;

    // EXPLOSION at 10 clicks
    if(clickCount >= 10){
      exploded = true;
      pig.style.transition = 'transform .15s, opacity .3s';
      pig.style.transform = pig.style.transform + ' scale(1.5)';
      
      // Spawn particles
      var colors = ['#9874f2','#fbbf24','#f87171','#34d399','#60a5fa','#f472b6'];
      for(var p=0; p<24; p++){
        var sp = document.createElement('div');
        sp.className = 'spark';
        sp.style.background = colors[p % colors.length];
        var angle = (p/24)*360;
        var dist = 80 + Math.random()*120;
        var sx = Math.cos(angle*Math.PI/180)*dist;
        var sy = Math.sin(angle*Math.PI/180)*dist;
        sp.style.setProperty('--sx', sx+'px');
        sp.style.setProperty('--sy', sy+'px');
        // Position at pig center
        var rect_x = x + 65;
        var rect_y = y + 65;
        sp.style.left = rect_x + 'px';
        sp.style.top  = rect_y + 'px';
        document.body.appendChild(sp);
        setTimeout(function(s){ document.body.removeChild(s); }, 900, sp);
      }

      // Boom emoji
      var boom = document.getElementById('pig-boom');
      boom.style.left = (x+15)+'px';
      boom.style.top  = (y+15)+'px';
      boom.classList.add('show');

      // Hide pig + zone
      setTimeout(function(){
        pig.style.opacity = '0';
        if(clickZone) clickZone.style.display = 'none';
        if(canvas) canvas.style.display = 'none';
        bubble.classList.remove('show');
      }, 150);

      setTimeout(function(){
        pig.style.display = 'none';
        boom.classList.remove('show');
      }, 800);

      return;
    }

    // Pick random phrase
    var txt = phrases[Math.floor(Math.random()*phrases.length)];
    bubble.textContent = txt;

    // Position bubble above pig
    var bx = x + 45;
    var by = y - 10;
    // Keep in viewport
    if(bx + 160 > window.innerWidth) bx = window.innerWidth - 170;
    if(by < 10) by = y + 95;
    bubble.style.left = bx + 'px';
    bubble.style.top = by + 'px';

    // Show
    bubble.classList.add('show');

    // Bounce effect on pig
    pig.style.filter = 'drop-shadow(0 6px 18px rgba(152,116,242,.5)) brightness(1.4)';
    setTimeout(function(){ pig.style.filter = 'drop-shadow(0 6px 18px rgba(152,116,242,.5))'; }, 300);

    // Hide after 2.5s
    clearTimeout(bubbleTimer);
    bubbleTimer = setTimeout(function(){ bubble.classList.remove('show'); }, 2500);
  }

  pig.addEventListener('click', handlePigClick);
  if(clickZone) clickZone.addEventListener('click', handlePigClick);
})();


// Burger menu
function closeMenu(){
  document.getElementById('burger').classList.remove('open');
  document.getElementById('burger').setAttribute('aria-expanded','false');
  document.getElementById('navlinks').classList.remove('open');
  var ov = document.getElementById('nav-overlay');
  if(ov) ov.classList.remove('show');
}
document.getElementById('burger').addEventListener('click', function(){
  var open = this.classList.toggle('open');
  this.setAttribute('aria-expanded', open);
  document.getElementById('navlinks').classList.toggle('open');
  var ov = document.getElementById('nav-overlay');
  if(ov) ov.classList.toggle('show');
});


/* ═══════════════════════════════════════════════════
   EFFECT 1 — TYPEWRITER
═══════════════════════════════════════════════════ */
(function(){
  var el     = document.getElementById('tw-text');
  var cursor = document.getElementById('tw-cursor');
  if(!el) return;

  /* Le titre, découpé en segments. Il est déjà écrit en dur dans le HTML
     (référencement, absence de JS) ; on le redessine ici caractère par
     caractère à partir de la même source.

     L'implémentation précédente concaténait '<span class="grad">' dans
     innerHTML : le navigateur refermait aussitôt la balise, si bien que le
     texte suivant atterrissait HORS du span et que le dégradé du titre
     n'apparaissait jamais. On construit donc de vrais nœuds DOM. */
  var SEGMENTS = [
    {text: 'Vos équipes méritent'},
    {br: true},
    {text: "d'être "},
    {text: 'récompensées', grad: true}
  ];

  var TOTAL = SEGMENTS.reduce(function(n, s){ return n + (s.text ? s.text.length : 0); }, 0);

  function render(shown){
    el.textContent = '';
    var left = shown;
    for(var i = 0; i < SEGMENTS.length; i++){
      var seg = SEGMENTS[i];
      if(seg.br){
        if(left > 0) el.appendChild(document.createElement('br'));
        continue;
      }
      if(left <= 0) break;
      var slice = seg.text.slice(0, left);
      if(seg.grad){
        var span = document.createElement('span');
        span.className = 'grad';
        span.textContent = slice;
        el.appendChild(span);
      } else {
        el.appendChild(document.createTextNode(slice));
      }
      left -= seg.text.length;
    }
  }

  if(REDUCED_MOTION){
    if(cursor) cursor.style.display = 'none';
    return;                       // le HTML d'origine fait déjà l'affaire
  }

  var shown = 0;
  function type(){
    render(++shown);
    if(shown < TOTAL) setTimeout(type, shown < 20 ? 55 : 45);
    else cursor.style.animation = 'twBlink .75s step-end infinite';
  }

  setTimeout(function(){
    render(0);
    cursor.style.animation = 'none';
    type();
  }, 400);
})();


/* ═══════════════════════════════════════════════════
   EFFECT 2 — ANIMATED COUNTERS
═══════════════════════════════════════════════════ */
(function(){
  var counters = document.querySelectorAll('.kpi-num[data-count]');
  if(!counters.length) return;
  // Les valeurs finales sont déjà dans le HTML : sans animation, rien à faire.
  if(REDUCED_MOTION) return;

  var observer = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(!entry.isIntersecting) return;
      var el = entry.target;
      var target = parseInt(el.getAttribute('data-count'));
      var prefix = el.getAttribute('data-prefix') || '';
      var suffix = el.getAttribute('data-suffix') || '';
      var unit = el.querySelector('.kpi-unit');
      var unitHTML = unit ? unit.outerHTML : '';
      
      var start = 0;
      var duration = 1800;
      var startTime = null;
      
      el.classList.add('counting');
      
      function animate(now){
        if(!startTime) startTime = now;
        var progress = Math.min((now - startTime) / duration, 1);
        // Ease out cubic
        var eased = 1 - Math.pow(1 - progress, 3);
        var current = Math.floor(eased * target);
        el.innerHTML = prefix + current + unitHTML;
        
        if(progress < 1){
          requestAnimationFrame(animate);
        } else {
          el.innerHTML = prefix + target + unitHTML;
          el.classList.remove('counting');
        }
      }
      
      requestAnimationFrame(animate);
      observer.unobserve(el);
    });
  }, {threshold: 0.5});

  counters.forEach(function(c){ observer.observe(c); });
})();


/* ═══════════════════════════════════════════════════
   EFFECT 3 — HERO PARTICLES (mouse parallax)
═══════════════════════════════════════════════════ */
(function(){
  var canvas = document.getElementById('hero-particles');
  if(!canvas) return;
  if(REDUCED_MOTION){ canvas.style.display = 'none'; return; }
  var ctx = canvas.getContext('2d');

  /* La boucle ne tourne que si le hero est à l'écran ET l'onglet actif.
     Elle tournait jusqu'ici en permanence, y compris en pied de page ou
     dans un onglet d'arrière-plan. */
  var onScreen = true;
  new IntersectionObserver(function(es){ onScreen = es[0].isIntersecting; })
    .observe(canvas.closest('.hero') || canvas);

  var mouse = {x: 0, y: 0};
  var W, H;
  var particles = [];
  var N = 70; // number of particles

  function resize(){
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Mouse parallax
  document.addEventListener('mousemove', function(e){
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  // Init particles
  var colors = ['rgba(152,116,242,', 'rgba(196,176,250,', 'rgba(100,80,200,'];
  for(var i=0; i<N; i++){
    particles.push({
      x: Math.random() * 1200,
      y: Math.random() * 800,
      r: Math.random() * 2 + 0.5,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.5 + 0.1,
      color: colors[Math.floor(Math.random() * colors.length)],
      depth: Math.random() * 0.8 + 0.2, // parallax depth
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.02 + 0.005
    });
  }

  var frameCount=0,sts=[],ssc=0,nxt=220+Math.floor(Math.random()*280);
  function spawnStar(){var sp=5+Math.random()*7,ag=Math.PI/4+(Math.random()-.5)*.45;
    sts.push({x:Math.random()*W*1.2,y:-15,vx:Math.cos(ag)*sp,vy:Math.sin(ag)*sp,
    len:65+Math.random()*110,a:0,ma:.3+Math.random()*.28,life:0,maxL:50+Math.floor(Math.random()*70)});}
  function drawStars(){
    ssc++;if(ssc>=nxt){spawnStar();ssc=0;nxt=220+Math.floor(Math.random()*320);}
    for(var si=sts.length-1;si>=0;si--){var s=sts[si];s.x+=s.vx;s.y+=s.vy;s.life++;
      if(s.life<12)s.a=(s.life/12)*s.ma;else if(s.life>s.maxL-16)s.a=((s.maxL-s.life)/16)*s.ma;else s.a=s.ma;
      if(s.life>=s.maxL||s.x>W+80||s.y>H+80){sts.splice(si,1);continue;}
      var sp=Math.sqrt(s.vx*s.vx+s.vy*s.vy);
      var g=ctx.createLinearGradient(s.x-s.vx/sp*s.len,s.y-s.vy/sp*s.len,s.x,s.y);
      g.addColorStop(0,'rgba(255,255,255,0)');g.addColorStop(.65,'rgba(200,185,255,'+(s.a*.35)+')');g.addColorStop(1,'rgba(255,255,255,'+s.a+')');
      ctx.beginPath();ctx.strokeStyle=g;ctx.lineWidth=1.2;
      ctx.moveTo(s.x-s.vx/sp*s.len,s.y-s.vy/sp*s.len);ctx.lineTo(s.x,s.y);ctx.stroke();
      ctx.beginPath();ctx.arc(s.x,s.y,1.3,0,Math.PI*2);ctx.fillStyle='rgba(255,255,255,'+(s.a*1.4)+')';ctx.fill();}}
  function draw(){
    if(!onScreen || document.hidden){ requestAnimationFrame(draw); return; }
    ctx.clearRect(0,0,W,H);frameCount++;drawStars();

    var cx = W/2, cy = H/2;
    var mx = (mouse.x || cx) - cx;
    var my = (mouse.y || cy) - cy;

    // Draw connection lines between nearby particles
    for(var i=0; i<particles.length; i++){
      var p = particles[i];
      for(var j=i+1; j<particles.length; j++){
        var q = particles[j];
        var dx2 = p.x - q.x, dy2 = p.y - q.y;
        var dist = Math.sqrt(dx2*dx2 + dy2*dy2);
        if(dist < 120){
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(152,116,242,' + (0.06 * (1 - dist/120)) + ')';
          ctx.lineWidth = 0.5;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }
    }

    // Draw + move particles
    particles.forEach(function(p){
      // Parallax offset
      var ox = mx * p.depth * 0.04;
      var oy = my * p.depth * 0.04;

      // Drift
      p.x += p.vx;
      p.y += p.vy;
      p.pulse += p.pulseSpeed;

      // Wrap around
      if(p.x < 0) p.x = W;
      if(p.x > W) p.x = 0;
      if(p.y < 0) p.y = H;
      if(p.y > H) p.y = 0;

      var px = p.x + ox;
      var py = p.y + oy;
      var currentAlpha = p.alpha * (0.7 + 0.3 * Math.sin(p.pulse));
      var currentR = p.r * (0.8 + 0.3 * Math.sin(p.pulse * 1.3));

      // Glow
      var grd = ctx.createRadialGradient(px, py, 0, px, py, currentR * 4);
      grd.addColorStop(0, p.color + currentAlpha + ')');
      grd.addColorStop(1, p.color + '0)');
      ctx.beginPath();
      ctx.arc(px, py, currentR * 4, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();

      // Core dot
      ctx.beginPath();
      ctx.arc(px, py, currentR, 0, Math.PI * 2);
      ctx.fillStyle = p.color + (currentAlpha * 1.5) + ')';
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }
  draw();
})();


/* ═══════════════════════════════════════════════════
   EFFECT 4 — CARD MOUSE LIGHT
═══════════════════════════════════════════════════ */
/* .kpi-card est volontairement exclu : le bloc « KPI mirror » plus bas pose
   déjà --mx/--my et l'inclinaison sur ces cartes. Les deux gestionnaires
   écrivaient tour à tour le même style.transform. */
(function(){
  if(REDUCED_MOTION) return;
  var cards = document.querySelectorAll('.bc, .card, .howto-step-inner');
  cards.forEach(function(card){
    card.addEventListener('mousemove', function(e){
      var rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', ((e.clientX - rect.left) / rect.width * 100).toFixed(1) + '%');
      card.style.setProperty('--my', ((e.clientY - rect.top) / rect.height * 100).toFixed(1) + '%');

      var dx = (e.clientX - (rect.left + rect.width/2))  / rect.width  * 2;
      var dy = (e.clientY - (rect.top  + rect.height/2)) / rect.height * 2;
      card.style.transform =
        'translateY(-8px) perspective(600px) rotateY(' + (dx * 4) + 'deg) rotateX(' + (-dy * 4) + 'deg) scale(1.01)';
    });
    card.addEventListener('mouseleave', function(){
      card.style.transform = '';
    });
  });
})();


/* ═══════════════════════════════════════════════════
   EFFECT 5 — CINEMATIC SCROLL REVEAL
═══════════════════════════════════════════════════ */
(function(){
  var revEls = document.querySelectorAll('.rev');
  if(!revEls.length) return;

  function revealAll(){
    revEls.forEach(function(el){ el.classList.add('visible'); });
  }

  // Tout le contenu attend cette classe pour devenir visible. Si le
  // navigateur ne sait pas observer l'intersection, ou si les animations
  // sont bridées, on affiche tout d'emblée plutôt que de servir une page
  // blanche.
  if(!('IntersectionObserver' in window) || REDUCED_MOTION){
    revealAll();
    return;
  }

  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, {threshold: 0.12, rootMargin:'0px 0px -40px 0px'});

  revEls.forEach(function(el){ io.observe(el); });

  // Hero elements visible immediately
  document.querySelectorAll('.hero .rev').forEach(function(el){
    setTimeout(function(){ el.classList.add('visible'); }, 100);
  });
})();


/* Pricing → contact prefill */
function prefillContact(offreName){
  setTimeout(function(){
    var msg = document.getElementById('cmsg');
    if(msg && !msg.value){
      msg.value = "Bonjour, je suis intéressé par l'offre " + offreName + ". Pouvez-vous me contacter ?";
    }
  }, 300);
}


/* ══════════════════════════════════════════════════════════════════════
   FORMULAIRE DE CONTACT
   Le formulaire n'avait aucun gestionnaire : le soumettre rechargeait la
   page et la demande était perdue. Deux modes, selon FORM_ENDPOINT.
   ══════════════════════════════════════════════════════════════════════ */
(function(){
  var form = document.getElementById('cform');
  var box  = document.getElementById('sucmsg');
  if(!form || !box) return;

  var btn = form.querySelector('.csend');
  var btnLabel = btn ? btn.textContent : '';

  function say(text, kind){
    box.textContent = text;
    box.classList.remove('is-error');
    if(kind === 'error') box.classList.add('is-error');
    box.classList.add('show');
  }

  function busy(on){
    if(!btn) return;
    btn.disabled = on;
    btn.textContent = on ? 'Envoi…' : btnLabel;
  }

  function corpsDuMessage(data){
    return 'Nom : ' + data.name + '\n' +
           'Email : ' + data.email + '\n' +
           'Téléphone : ' + (data.tel || '—') + '\n' +
           'Établissement : ' + (data.type || '—') + '\n\n' +
           data.msg;
  }

  /* Repli sans serveur : on ouvre la messagerie du visiteur.
     Cela échoue silencieusement chez qui n'a pas de client mail configuré —
     fréquent sur mobile. On affiche donc toujours, en plus, l'adresse et de
     quoi copier le message, pour qu'aucune demande ne se perde. */
  function mailtoFallback(data){
    var sujet = 'Demande Tiply — ' + data.name;
    var corps = corpsDuMessage(data);
    var lien  = 'mailto:' + CONTACT_MAILBOX +
                '?subject=' + encodeURIComponent(sujet) +
                '&body=' + encodeURIComponent(corps);

    // Au-delà d'environ 2 000 caractères, l'URL mailto est tronquée par
    // certains systèmes : on n'y met qu'un renvoi, le texte reste copiable.
    if(lien.length > 2000){
      lien = 'mailto:' + CONTACT_MAILBOX + '?subject=' + encodeURIComponent(sujet);
    }

    // L'affichage est construit AVANT d'ouvrir la messagerie : si la
    // navigation est refusée (politique du navigateur, page embarquée, aucun
    // client mail), le visiteur garde l'adresse et son message sous les yeux
    // au lieu de se retrouver devant un formulaire qui n'a rien fait.
    box.textContent = '';
    box.classList.remove('is-error');
    box.classList.add('show');

    var p = document.createElement('p');
    p.textContent = 'Votre messagerie devrait s’ouvrir avec le message prérempli — ' +
                    'il ne reste qu’à l’envoyer.';
    box.appendChild(p);

    var p2 = document.createElement('p');
    p2.className = 'sucmsg-alt';
    p2.appendChild(document.createTextNode('Rien ne s’est passé ? Écrivez-nous à '));
    var a = document.createElement('a');
    a.href = 'mailto:' + CONTACT_MAILBOX;
    a.textContent = CONTACT_MAILBOX;
    p2.appendChild(a);
    p2.appendChild(document.createTextNode(' — '));

    var copier = document.createElement('button');
    copier.type = 'button';
    copier.className = 'sucmsg-copy';
    copier.textContent = 'copier mon message';
    copier.addEventListener('click', function(){
      var texte = sujet + '\n\n' + corps;
      var fini = function(ok){ copier.textContent = ok ? 'message copié ✓' : 'copie impossible'; };
      if(navigator.clipboard && navigator.clipboard.writeText){
        navigator.clipboard.writeText(texte).then(function(){ fini(true); }, function(){ fini(false); });
      } else {
        // Navigateurs anciens : on passe par une zone de texte temporaire.
        var ta = document.createElement('textarea');
        ta.value = texte;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        var ok = false;
        try { ok = document.execCommand('copy'); } catch(err){ ok = false; }
        document.body.removeChild(ta);
        fini(ok);
      }
    });
    p2.appendChild(copier);
    box.appendChild(p2);

    try { window.location.href = lien; } catch(err){ /* le repli ci-dessus suffit */ }
  }

  /* Corps de la requête. Les champs préfixés d'un souligné sont les
     conventions des services de formulaire : `_subject` intitule le mail
     reçu, `_gotcha` / `_honey` sont les pièges à robots qu'ils filtrent de
     leur côté, `_captcha:false` évite l'écran de vérification de FormSubmit
     après envoi. Un service ignore simplement les clés qu'il ne connaît pas,
     donc la même charge utile convient à tous. */
  function chargeUtile(data){
    // Ces clés-là composent le corps du mail reçu : on s'en tient au
    // strict nécessaire, avec des intitulés lisibles.
    var p = {
      'Nom': data.name,
      // Formspree règle le « Répondre à » du mail d'après un champ nommé
      // email, en minuscules. Une seule clé pour l'adresse, donc : la
      // dédoubler la ferait apparaître deux fois dans le corps du mail, et
      // _replyto n'est pas une directive — il s'afficherait tel quel.
      email: data.email,
      'Téléphone':     data.tel  || '—',
      'Établissement': data.type || '—',
      'Message':       data.msg,
      // _subject, en revanche, est bien une directive : il donne l'objet du
      // mail sans apparaître dans son corps.
      _subject: 'Tiply — ' + data.name + (data.type ? ' (' + data.type + ')' : '')
    };

    // Extras propres à chaque service. Les envoyer à tout le monde les ferait
    // apparaître comme des champs vides dans le mail reçu.
    if(/formsubmit\.co/.test(FORM_ENDPOINT)){
      p._honey = '';
      p._captcha = false;
      p._template = 'table';
    }
    if(FORM_ACCESS_KEY) p.access_key = FORM_ACCESS_KEY;
    return p;
  }

  /* Les services ne s'accordent pas sur ce qu'est un succès : Formspree
     renvoie {ok:true}, FormSubmit {success:"true"}, Web3Forms {success:true},
     et un endpoint maison se contente souvent d'un 200 vide. */
  function estUnSucces(reponse, corps){
    if(!reponse.ok) return false;
    if(!corps || typeof corps !== 'object') return true;
    if(corps.ok === true) return true;
    if(corps.success === true || corps.success === 'true') return true;
    if(corps.errors || corps.error) return false;
    return true;
  }

  function messageDErreur(corps){
    if(corps && Array.isArray(corps.errors) && corps.errors.length){
      return corps.errors.map(function(e){ return e.message || e; }).join(' ');
    }
    if(corps && typeof corps.message === 'string') return corps.message;
    return null;
  }

  form.addEventListener('submit', function(e){
    e.preventDefault();

    var data = {};
    new FormData(form).forEach(function(v, k){ data[k] = String(v).trim(); });

    // Piège à robots : rempli = robot. On feint le succès sans rien envoyer.
    if(data._gotcha){ say('🎉 Merci pour votre intérêt, on vous recontacte très vite !'); form.reset(); return; }

    if(!FORM_ENDPOINT){ mailtoFallback(data); return; }

    busy(true);
    fetch(FORM_ENDPOINT, {
      method: 'POST',
      headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
      body: JSON.stringify(chargeUtile(data))
    })
    .then(function(r){
      return r.json().catch(function(){ return null; })   // réponse vide tolérée
              .then(function(corps){ return {r: r, corps: corps}; });
    })
    .then(function(res){
      if(!estUnSucces(res.r, res.corps)){
        var e = new Error('envoi refusé');
        // Seul un message venant du service est montrable au visiteur ; le
        // texte des exceptions JavaScript (« Failed to fetch ») ne l'est pas.
        e.messageVisiteur = messageDErreur(res.corps);
        throw e;
      }
      say('🎉 Merci pour votre intérêt, on vous recontacte très vite !');
      form.reset();
    })
    .catch(function(err){
      // L'échec ne doit jamais faire perdre la demande : la saisie reste en
      // place et on redonne l'adresse directe.
      var detail = err && err.messageVisiteur ? ' (' + err.messageVisiteur + ')' : '';
      say('L’envoi n’a pas abouti' + detail + '. Votre message est toujours là — ' +
          'réessayez, ou écrivez-nous à ' + CONTACT_MAILBOX + ', nous répondons sous 24 h.', 'error');
    })
    .finally(function(){ busy(false); });
  });
})();


/* ══════════════════════════════════════════════════════════════════════
   VIDÉO DU HERO — chargée après la première peinture
   1,3 Mo qui, chargés d'emblée, retardaient l'affichage du titre.
   ══════════════════════════════════════════════════════════════════════ */
(function(){
  var v = document.getElementById('hero-video');
  if(!v || !v.dataset.src) return;

  // play() est sans effet si la lecture est déjà lancée : on peut l'appeler
  // à chaque étape sans risque. Un appel unique sur 'canplay' se révélait
  // fragile — selon le moment où la source est posée, l'événement pouvait
  // survenir avant l'écoute, et la vidéo restait figée sur la première image.
  function tryPlay(){
    var p = v.play();
    if(p && p.catch) p.catch(function(){ /* autoplay refusé : sans gravité */ });
  }

  function load(){
    // Pas de v.load() : il interrompt la lecture que l'attribut autoplay
    // vient d'amorcer.
    v.src = v.dataset.src;
    v.addEventListener('loadeddata', tryPlay);
    v.addEventListener('canplay', tryPlay);
    if(v.readyState >= 3) tryPlay();
  }

  var start = function(){
    if('requestIdleCallback' in window) requestIdleCallback(load, {timeout: 2000});
    else setTimeout(load, 600);
  };

  if(document.readyState === 'complete') start();
  else window.addEventListener('load', start, {once: true});
})();

/* KPI mirror effect */
(function(){
  if(REDUCED_MOTION) return;
  var kpiCards = document.querySelectorAll('.kpi-card');
  if(kpiCards.length < 3) return;
  // Card 0 (left): mirror X axis
  kpiCards[0].classList.add('kpi-mirror-l');
  // Card 2 (right): mirror X axis  
  kpiCards[2].classList.add('kpi-mirror-r');
  
  kpiCards.forEach(function(card){
    card.addEventListener('mousemove', function(e){
      var rect = card.getBoundingClientRect();
      var xRaw = (e.clientX - rect.left) / rect.width * 100;
      var yRaw = (e.clientY - rect.top)  / rect.height * 100;
      
      // Mirror X for left and right cards
      var x = xRaw;
      if(card.classList.contains('kpi-mirror-l')) x = 100 - xRaw;
      if(card.classList.contains('kpi-mirror-r')) x = 100 - xRaw;
      
      card.style.setProperty('--mx', x.toFixed(1) + '%');
      card.style.setProperty('--my', yRaw.toFixed(1) + '%');

      // Tilt
      var cx = rect.left + rect.width/2;
      var cy = rect.top + rect.height/2;
      var dx = (e.clientX - cx) / rect.width * 2;
      var dy = (e.clientY - cy) / rect.height * 2;
      card.style.transform =
        'translateY(-8px) perspective(600px) rotateY('+(dx*4)+'deg) rotateX('+(-dy*4)+'deg) scale(1.01)';
    });
    card.addEventListener('mouseleave', function(){
      card.style.transform = '';
    });
  });
})();

/* Un second systeme d etoiles filantes vivait ici : sa propre boucle rAF
   dessinait sur #hero-particles, mais le clearRect de la boucle des
   particules l effacait a chaque frame. Invisible, et une boucle
   d animation permanente pour rien. Les etoiles reellement affichees
   sont celles integrees a EFFECT 3. */
