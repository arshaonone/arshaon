document.addEventListener('DOMContentLoaded', () => {

  // 1. HORIZONTAL SCROLL FOR VENTURES
  const venturesScroll = document.querySelector('.ventures-scroll');
  if (venturesScroll) {
    let isDown = false;
    let startX;
    let scrollLeft;

    venturesScroll.addEventListener('mousedown', (e) => {
      isDown = true;
      venturesScroll.style.cursor = 'grabbing';
      startX = e.pageX - venturesScroll.offsetLeft;
      scrollLeft = venturesScroll.scrollLeft;
    });

    window.addEventListener('mouseup', () => {
      isDown = false;
      venturesScroll.style.cursor = 'grab';
    });

    venturesScroll.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - venturesScroll.offsetLeft;
      const walk = (x - startX) * 2;
      venturesScroll.scrollLeft = scrollLeft - walk;
    });
  }

  // 2. RADAR CHART VISUALIZER
  const canvas = document.getElementById('radarChart');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    
    // Config
    const padding = 20;
    const cw = canvas.parentElement.clientWidth;
    const ch = canvas.parentElement.clientHeight;
    
    canvas.width = cw;
    canvas.height = ch;
    
    const center = { x: cw / 2, y: ch / 2 };
    const radius = Math.min(cw, ch) / 2 - padding;

    // Data - Full stack capability
    const data = [
      { label: 'Frontend', value: 0.95 },
      { label: 'Backend', value: 0.88 },
      { label: 'Design', value: 0.85 },
      { label: 'Business', value: 0.92 },
      { label: 'Mobile', value: 0.90 }
    ];
    
    const sides = data.length;
    const angleStep = (Math.PI * 2) / sides;
    
    // Animation progress
    let progress = 0;
    const duration = 1500; // ms
    let startTime = null;

    function drawPolygon(r, color, fill = false) {
      ctx.beginPath();
      for (let i = 0; i < sides; i++) {
        // -Math.PI/2 to start from top
        const angle = i * angleStep - Math.PI / 2;
        const x = center.x + r * Math.cos(angle);
        const y = center.y + r * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      
      if (fill) {
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = '#D4AF37'; // Gold border
        ctx.lineWidth = 1.5;
        ctx.stroke();
      } else {
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    function drawSpokes() {
      ctx.beginPath();
      for (let i = 0; i < sides; i++) {
        const angle = i * angleStep - Math.PI / 2;
        ctx.moveTo(center.x, center.y);
        ctx.lineTo(center.x + radius * Math.cos(angle), center.y + radius * Math.sin(angle));
      }
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    function drawData(p) {
      ctx.beginPath();
      for (let i = 0; i < sides; i++) {
        const angle = i * angleStep - Math.PI / 2;
        // Apply animation progress 'p'
        const r = radius * data[i].value * p;
        const x = center.x + r * Math.cos(angle);
        const y = center.y + r * Math.sin(angle);
        
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      
      // Gradient fill
      const grad = ctx.createRadialGradient(center.x, center.y, 0, center.x, center.y, radius);
      grad.addColorStop(0, 'rgba(212, 175, 55, 0.4)');
      grad.addColorStop(1, 'rgba(212, 175, 55, 0.05)');
      
      ctx.fillStyle = grad;
      ctx.fill();
      
      ctx.strokeStyle = '#D4AF37';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Draw points
      for (let i = 0; i < sides; i++) {
        const angle = i * angleStep - Math.PI / 2;
        const r = radius * data[i].value * p;
        const x = center.x + r * Math.cos(angle);
        const y = center.y + r * Math.sin(angle);
        
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#111';
        ctx.fill();
        ctx.strokeStyle = '#D4AF37';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    }

    function render(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      // Easing out quint
      const t = Math.min(elapsed / duration, 1);
      progress = 1 - Math.pow(1 - t, 5);

      ctx.clearRect(0, 0, cw, ch);
      
      // Draw 3 background grid polygons
      drawPolygon(radius, 'rgba(255, 255, 255, 0.1)');
      drawPolygon(radius * 0.66, 'rgba(255, 255, 255, 0.05)');
      drawPolygon(radius * 0.33, 'rgba(255, 255, 255, 0.05)');
      
      drawSpokes();
      drawData(progress);

      if (t < 1) {
        requestAnimationFrame(render);
      }
    }

    // Only start animation when in view
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          requestAnimationFrame(render);
          observer.unobserve(canvas);
        }
      });
    }, { threshold: 0.5 });
    
    observer.observe(canvas);
  }
});
