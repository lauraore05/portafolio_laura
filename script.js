/* ===== Portfolio – script.js ===== */

// ——— Custom Cursor ———
const cursor = document.getElementById('cursor');
const cursorDot = document.getElementById('cursorDot');
let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;
let dotX = 0, dotY = 0;
const trailParticles = [];

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  createTrailParticle(e.clientX, e.clientY);
});

// Interactive elements for cursor hover state
const hoverTargets = 'a, button, .btn, .project-card, .skill-badge, .contact-link, .nav-pill-item';

document.addEventListener('mouseover', (e) => {
  if (e.target.closest(hoverTargets)) {
    cursor.classList.add('hover');
  }
});

document.addEventListener('mouseout', (e) => {
  if (e.target.closest(hoverTargets)) {
    cursor.classList.remove('hover');
  }
});

document.addEventListener('mousedown', () => cursor.classList.add('click'));
document.addEventListener('mouseup', () => cursor.classList.remove('click'));

// Smooth cursor follow with lerp
function animateCursor() {
  const ease = 0.15;
  const dotEase = 0.35;

  cursorX += (mouseX - cursorX) * ease;
  cursorY += (mouseY - cursorY) * ease;
  dotX += (mouseX - dotX) * dotEase;
  dotY += (mouseY - dotY) * dotEase;

  if (cursor) {
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
  }
  if (cursorDot) {
    cursorDot.style.left = dotX + 'px';
    cursorDot.style.top = dotY + 'px';
  }

  requestAnimationFrame(animateCursor);
}
animateCursor();

// Trail particles
function createTrailParticle(x, y) {
  if (Math.random() > 0.3) return; // throttle
  const particle = document.createElement('div');
  particle.className = 'cursor-trail-particle';
  particle.style.left = x + 'px';
  particle.style.top = y + 'px';
  particle.style.width = (Math.random() * 4 + 2) + 'px';
  particle.style.height = particle.style.width;
  document.body.appendChild(particle);

  let opacity = 0.5;
  let scale = 1;
  const fadeInterval = setInterval(() => {
    opacity -= 0.04;
    scale -= 0.06;
    if (opacity <= 0) {
      particle.remove();
      clearInterval(fadeInterval);
      return;
    }
    particle.style.opacity = opacity;
    particle.style.transform = `translate(-50%, -50%) scale(${Math.max(0, scale)})`;
  }, 25);
}

// ——— Ripple effect on buttons ———
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    btn.style.setProperty('--ripple-x', x + '%');
    btn.style.setProperty('--ripple-y', y + '%');
  });
});

// ——— Nav pill: active link on scroll ———
const navPillItems = document.querySelectorAll('.nav-pill-item');
const sections = document.querySelectorAll('section[id]');

function setActiveLink() {
  const scrollY = window.scrollY + 200;
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav-pill-item[href="#${id}"]`);
    if (link) {
      link.classList.toggle('active', scrollY >= top && scrollY < top + height);
    }
  });
}
window.addEventListener('scroll', setActiveLink);
setActiveLink();

// ——— Reveal on scroll (IntersectionObserver) ———
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Trigger letter animation for text-animate elements in this section
      const textAnimates = entry.target.querySelectorAll('.text-animate');
      textAnimates.forEach(el => el.classList.add('animate-active'));
      if (entry.target.classList.contains('text-animate')) {
        entry.target.classList.add('animate-active');
      }
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealElements.forEach(el => revealObserver.observe(el));

// ——— Split text to animated letters ———
function splitTextToLetters(element) {
  const text = element.textContent;
  element.innerHTML = '';
  element.classList.add('text-animate');

  [...text].forEach((char, i) => {
    const span = document.createElement('span');
    span.className = 'letter' + (char === ' ' ? ' space' : '');
    span.textContent = char === ' ' ? '\u00A0' : char;
    span.style.animationDelay = (i * 0.04) + 's';
    element.appendChild(span);
  });
}

// ——— Typewriter Effect for Hero Title ———
// ——— Typewriter Effect Loop Stable Version ———
(function initTypewriter() {
  const titleEl = document.getElementById('heroTitle');
  const cursorEl = document.getElementById('typewriterCursor');
  if (!titleEl || !cursorEl) return;

  const fullText = 'Hola, soy ';
  const gradientText = 'Laura';
  const fullString = fullText + gradientText;

  let charIndex = 0;
  let isDeleting = false;

  function renderText() {
    const currentText = fullString.slice(0, charIndex);

    const normalPart = currentText.slice(0, fullText.length);
    const gradientPart = currentText.slice(fullText.length);

    titleEl.innerHTML =
      normalPart +
      (gradientPart
        ? `<span class="gradient-text">${gradientPart}</span>`
        : '');

    titleEl.appendChild(cursorEl);
  }

  function typeEffect() {
    if (!isDeleting) {
      if (charIndex < fullString.length) {
        charIndex++;
        renderText();
        setTimeout(typeEffect, 100);
      } else {
        setTimeout(() => {
          isDeleting = true;
          typeEffect();
        }, 1500);
      }
    } else {
      if (charIndex > 0) {
        charIndex--;
        renderText();
        setTimeout(typeEffect, 55);
      } else {
        isDeleting = false;
        setTimeout(typeEffect, 400);
      }
    }
  }

  typeEffect();
})();

// Section titles
document.querySelectorAll('.section-title').forEach(title => {
  const children = [...title.childNodes];
  title.innerHTML = '';
  title.classList.add('text-animate');
  let letterIndex = 0;

  children.forEach(child => {
    if (child.nodeType === Node.TEXT_NODE) {
      [...child.textContent].forEach(char => {
        const span = document.createElement('span');
        span.className = 'letter' + (char === ' ' ? ' space' : '');
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.style.animationDelay = (letterIndex * 0.04) + 's';
        letterIndex++;
        title.appendChild(span);
      });
    } else if (child.nodeType === Node.ELEMENT_NODE) {
      const wrapper = child.cloneNode(false);
      wrapper.innerHTML = '';
      [...child.textContent].forEach(char => {
        const span = document.createElement('span');
        span.className = 'letter' + (char === ' ' ? ' space' : '');
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.style.animationDelay = (letterIndex * 0.04) + 's';
        letterIndex++;
        wrapper.appendChild(span);
      });
      title.appendChild(wrapper);
    }
  });
});


// ——— Magnetic Effect on Buttons ———
document.querySelectorAll('.btn, .contact-link').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
  });

  btn.addEventListener('mouseleave', () => {
    btn.style.transform = 'translate(0, 0)';
  });
});

// ——— Particle canvas background (mouse-reactive) ———
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let w, h, particles;
  let canvasMouseX = -9999, canvasMouseY = -9999;

  // Track mouse position
  window.addEventListener('mousemove', (e) => {
    canvasMouseX = e.clientX;
    canvasMouseY = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    canvasMouseX = -9999;
    canvasMouseY = -9999;
  });

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function createParticles() {
    const count = Math.floor((w * h) / 12000);
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        originX: 0,
        originY: 0,
        r: Math.random() * 1.8 + 0.5,
        dx: (Math.random() - 0.5) * 0.4,
        dy: (Math.random() - 0.5) * 0.4,
        opacity: Math.random() * 0.5 + 0.15,
      });
    }
    // Store origin positions for spring-back
    particles.forEach(p => {
      p.originX = p.x;
      p.originY = p.y;
    });
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    const mouseRadius = 120;

    particles.forEach(p => {
      // Mouse repulsion
      const distToMouse = Math.sqrt(
        (p.x - canvasMouseX) ** 2 + (p.y - canvasMouseY) ** 2
      );

      if (distToMouse < mouseRadius && canvasMouseX > 0) {
        const angle = Math.atan2(p.y - canvasMouseY, p.x - canvasMouseX);
        const force = (mouseRadius - distToMouse) / mouseRadius;
        p.x += Math.cos(angle) * force * 3;
        p.y += Math.sin(angle) * force * 3;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(100, 255, 218, ${p.opacity})`;
      ctx.fill();

      p.x += p.dx;
      p.y += p.dy;

      if (p.x < 0 || p.x > w) p.dx *= -1;
      if (p.y < 0 || p.y > h) p.dy *= -1;
    });

    // Draw lines between close particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(100, 255, 218, ${0.06 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    // Draw lines from mouse to close particles
    if (canvasMouseX > 0) {
      particles.forEach(p => {
        const dx = p.x - canvasMouseX;
        const dy = p.y - canvasMouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          ctx.beginPath();
          ctx.moveTo(canvasMouseX, canvasMouseY);
          ctx.lineTo(p.x, p.y);
          ctx.strokeStyle = `rgba(100, 255, 218, ${0.12 * (1 - dist / 150)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      });
    }

    requestAnimationFrame(draw);
  }

  resize();
  createParticles();
  draw();

  window.addEventListener('resize', () => {
    resize();
    createParticles();
  });
})();


// ——— Typewriter Contacto ———
(function initContactTypewriter() {
  const textEl = document.getElementById('contactType');
  if (!textEl) return;

  const fullText = 'Contacto';
  let charIndex = 0;
  let isDeleting = false;

  function typeEffect() {
    if (!isDeleting) {
      if (charIndex < fullText.length) {
        charIndex++;
        textEl.textContent = fullText.slice(0, charIndex);
        setTimeout(typeEffect, 100);
      }
    } 
  }

  textEl.textContent = '';
  typeEffect();
})();

// ——— Typewriter Sobre Mí (Solo una vez) ———
(function initAboutTypewriter() {
  const textEl = document.getElementById('aboutType');
  if (!textEl) return;

  const fullText = 'Sobre Mí';
  let charIndex = 0;

  function typeEffect() {
    if (charIndex < fullText.length) {
      charIndex++;
      textEl.textContent = fullText.slice(0, charIndex);
      setTimeout(typeEffect, 100);
    }
  }

  textEl.textContent = '';
  typeEffect();
})();

// ——— Typewriter Proyectos (Solo una vez) ———
(function initProjectsTypewriter() {
  const textEl = document.getElementById('projectsType');
  if (!textEl) return;

  const fullText = 'Proyectos';
  let charIndex = 0;

  function typeEffect() {
    if (charIndex < fullText.length) {
      charIndex++;
      textEl.textContent = fullText.slice(0, charIndex);
      setTimeout(typeEffect, 100);
    }
  }

  textEl.textContent = '';
  typeEffect();
})();
