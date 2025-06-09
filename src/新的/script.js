// 全局变量
let currentSlideIndex = 0;
let totalSlides = 0;
let timerInterval = null;
let timerSeconds = 0;
let isTimerRunning = false;
let scriptOpen = false;

// 初始化
document.addEventListener('DOMContentLoaded', function() {
  initializeSlides();
  initializeParticles();
  // 延迟更新按钮状态，确保DOM完全加载
  setTimeout(() => {
    updateNavButtons();
    updatePageIndicator();
  }, 100);
});

// 初始化幻灯片
function initializeSlides() {
  const slides = document.querySelectorAll('#ppt-root section');
  totalSlides = slides.length;
  
  slides.forEach((slide, index) => {
    if (index !== 0) {
      slide.classList.remove('active');
    }
  });
}

// 下一张幻灯片
function nextSlide() {
  if (currentSlideIndex < totalSlides - 1) {
    changeSlide(currentSlideIndex + 1);
  } else {
    console.log('已经是最后一页了');
  }
}

// 上一张幻灯片
function prevSlide() {
  if (currentSlideIndex > 0) {
    changeSlide(currentSlideIndex - 1);
  } else {
    console.log('已经是第一页了');
  }
}

// 跳转到指定幻灯片
function currentSlide(index) {
  changeSlide(index - 1);
}

// 切换幻灯片
function changeSlide(newIndex) {
  if (newIndex < 0 || newIndex >= totalSlides) return;
  
  const slides = document.querySelectorAll('#ppt-root section');
  const currentSlide = slides[currentSlideIndex];
  const newSlide = slides[newIndex];
  
  // 添加退出动画
  currentSlide.classList.add('slide-out');
  
  setTimeout(() => {
    currentSlide.classList.remove('active', 'slide-out');
    newSlide.classList.add('active');
    currentSlideIndex = newIndex;
    updateNavButtons();
    updatePageIndicator();
  }, 400);
}

// 更新导航按钮状态
function updateNavButtons() {
  // 获取所有上一页按钮（通过onclick属性识别）
  const allPrevBtns = document.querySelectorAll('button[onclick*="prevSlide"]');
  const allNextBtns = document.querySelectorAll('button[onclick*="nextSlide"]');
  
  // 更新所有上一页按钮
  allPrevBtns.forEach(btn => {
    btn.disabled = currentSlideIndex === 0;
    if (currentSlideIndex === 0) {
      btn.style.opacity = '0.5';
      btn.style.cursor = 'not-allowed';
    } else {
      btn.style.opacity = '1';
      btn.style.cursor = 'pointer';
    }
  });
  
  // 更新所有下一页按钮
  allNextBtns.forEach(btn => {
    btn.disabled = currentSlideIndex === totalSlides - 1;
    if (currentSlideIndex === totalSlides - 1) {
      btn.style.opacity = '0.5';
      btn.style.cursor = 'not-allowed';
    } else {
      btn.style.opacity = '1';
      btn.style.cursor = 'pointer';
    }
  });
}

// 更新页面指示器
function updatePageIndicator() {
  const dots = document.querySelectorAll('.dot');
  dots.forEach((dot, index) => {
    dot.classList.toggle('active', index === currentSlideIndex);
  });
}

// 切换提示稿面板
function toggleScript() {
  const panel = document.getElementById('script-panel');
  const container = document.getElementById('ppt-container');
  const mainContent = document.querySelector('.main-content');
  
  scriptOpen = !scriptOpen;
  
  if (scriptOpen) {
    panel.classList.add('open');
    container.classList.add('shifted');
    if (mainContent) mainContent.classList.add('shifted');
  } else {
    panel.classList.remove('open');
    container.classList.remove('shifted');
    if (mainContent) mainContent.classList.remove('shifted');
  }
}

// 计时器功能
function toggleTimer() {
  const startBtn = document.getElementById('start-btn');
  const timerContainer = document.getElementById('timer-container');
  
  if (isTimerRunning) {
    clearInterval(timerInterval);
    timerContainer.classList.remove('timer-running');
    isTimerRunning = false;
    
    // 更新原始按钮（隐藏的）
    if (startBtn) {
      startBtn.textContent = '开始';
    }
    
    // 更新嵌入的按钮
    const startBtnEmbedded = document.getElementById('start-btn-embedded');
    if (startBtnEmbedded) {
      startBtnEmbedded.textContent = '开始';
    }
  } else {
    timerInterval = setInterval(updateTimer, 1000);
    timerContainer.classList.add('timer-running');
    isTimerRunning = true;
    
    // 更新原始按钮（隐藏的）
    if (startBtn) {
      startBtn.textContent = '暂停';
    }
    
    // 更新嵌入的按钮
    const startBtnEmbedded = document.getElementById('start-btn-embedded');
    if (startBtnEmbedded) {
      startBtnEmbedded.textContent = '暂停';
    }
  }
}

function resetTimer() {
  clearInterval(timerInterval);
  timerSeconds = 0;
  updateTimerDisplay();
  document.getElementById('start-btn').textContent = '开始';
  document.getElementById('timer-container').classList.remove('timer-running');
  isTimerRunning = false;
}

function updateTimer() {
  timerSeconds++;
  updateTimerDisplay();
}

function updateTimerDisplay() {
  const hours = Math.floor(timerSeconds / 3600);
  const minutes = Math.floor((timerSeconds % 3600) / 60);
  const seconds = timerSeconds % 60;
  
  const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
  // 更新原始计时器显示（隐藏的）
  const timerDisplay = document.getElementById('timer-display');
  if (timerDisplay) {
    timerDisplay.textContent = timeString;
  }
  
  // 更新嵌入的计时器显示
  const timerDisplayEmbedded = document.getElementById('timer-display-embedded');
  if (timerDisplayEmbedded) {
    timerDisplayEmbedded.textContent = timeString;
  }
}

// 键盘导航
document.addEventListener('keydown', function(e) {
  switch(e.key) {
    case 'ArrowRight':
    case ' ':
      e.preventDefault();
      nextSlide();
      break;
    case 'ArrowLeft':
      e.preventDefault();
      prevSlide();
      break;
    case 'Home':
      e.preventDefault();
      changeSlide(0);
      break;
    case 'End':
      e.preventDefault();
      changeSlide(totalSlides - 1);
      break;
    case 'Escape':
      if (scriptOpen) {
        toggleScript();
      }
      break;
  }
});

// 增强粒子背景效果 - 动态彩色粒子系统
function initializeParticles() {
  const canvas = document.getElementById('particle-bg');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let stars = [];
  let waves = [];
  let animationId;
  let mouse = { x: 0, y: 0 };
  let time = 0;
  
  // 颜色主题
  const colors = {
    primary: [79, 195, 247],    // #4fc3f7
    secondary: [129, 199, 132], // #81c784
    accent: [33, 150, 243],     // #2196f3
    warm: [255, 112, 67],       // #ff7043
    cool: [156, 39, 176]        // #9c27b0
  };
  
  function resizeCanvas() {
    canvas.width = 1920;
    canvas.height = 1080;
    createParticles();
    createStars();
    createWaves();
  }
  
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
  
  // 鼠标移动事件监听
  canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = (e.clientX - rect.left) * (1920 / rect.width);
    mouse.y = (e.clientY - rect.top) * (1080 / rect.height);
  });
  
  function createParticles() {
    particles = [];
    const particleCount = 150;
    
    for (let i = 0; i < particleCount; i++) {
      const colorKeys = Object.keys(colors);
      const colorKey = colorKeys[Math.floor(Math.random() * colorKeys.length)];
      
      particles.push({
        x: Math.random() * 1920,
        y: Math.random() * 1080,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: Math.random() * 3 + 1,
        opacity: Math.random() * 0.6 + 0.3,
        color: colors[colorKey],
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        trail: [],
        type: Math.random() > 0.8 ? 'special' : 'normal'
      });
    }
  }
  
  function createStars() {
    stars = [];
    const starCount = 80;
    
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * 1920,
        y: Math.random() * 1080,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.8 + 0.2,
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.03 + 0.01
      });
    }
  }
  
  function createWaves() {
    waves = [];
    const waveCount = 3;
    
    for (let i = 0; i < waveCount; i++) {
      waves.push({
        y: 200 + i * 300,
        amplitude: 30 + Math.random() * 20,
        frequency: 0.002 + Math.random() * 0.001,
        phase: Math.random() * Math.PI * 2,
        speed: 0.01 + Math.random() * 0.005,
        opacity: 0.1 + Math.random() * 0.1
      });
    }
  }
  
  function drawStars() {
    for (const star of stars) {
      const twinkle = Math.sin(time * star.twinkleSpeed + star.twinklePhase) * 0.3 + 0.7;
      const opacity = star.opacity * twinkle;
      
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
      ctx.fill();
      
      // 星光效果
      if (twinkle > 0.8) {
        ctx.beginPath();
        ctx.moveTo(star.x - star.size * 3, star.y);
        ctx.lineTo(star.x + star.size * 3, star.y);
        ctx.moveTo(star.x, star.y - star.size * 3);
        ctx.lineTo(star.x, star.y + star.size * 3);
        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.5})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
  
  function drawWaves() {
    for (const wave of waves) {
      ctx.beginPath();
      ctx.moveTo(0, wave.y);
      
      for (let x = 0; x <= 1920; x += 10) {
        const y = wave.y + Math.sin(x * wave.frequency + time * wave.speed + wave.phase) * wave.amplitude;
        ctx.lineTo(x, y);
      }
      
      ctx.strokeStyle = `rgba(${colors.primary[0]}, ${colors.primary[1]}, ${colors.primary[2]}, ${wave.opacity})`;
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }
  
  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 绘制背景波浪
    drawWaves();
    
    // 绘制星星
    drawStars();
    
    // 绘制粒子
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      
      // 脉冲效果
      const pulse = Math.sin(time * p.pulseSpeed + p.pulsePhase) * 0.3 + 0.7;
      const currentRadius = p.radius * pulse;
      const currentOpacity = p.opacity * pulse;
      
      // 绘制粒子轨迹
      if (p.trail.length > 1) {
        ctx.beginPath();
        ctx.moveTo(p.trail[0].x, p.trail[0].y);
        for (let t = 1; t < p.trail.length; t++) {
          ctx.lineTo(p.trail[t].x, p.trail[t].y);
        }
        ctx.strokeStyle = `rgba(${p.color[0]}, ${p.color[1]}, ${p.color[2]}, ${currentOpacity * 0.3})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      
      // 绘制粒子主体
      ctx.beginPath();
      ctx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2);
      
      if (p.type === 'special') {
        // 特殊粒子 - 渐变效果
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, currentRadius * 2);
        gradient.addColorStop(0, `rgba(${p.color[0]}, ${p.color[1]}, ${p.color[2]}, ${currentOpacity})`);
        gradient.addColorStop(1, `rgba(${p.color[0]}, ${p.color[1]}, ${p.color[2]}, 0)`);
        ctx.fillStyle = gradient;
      } else {
        ctx.fillStyle = `rgba(${p.color[0]}, ${p.color[1]}, ${p.color[2]}, ${currentOpacity})`;
      }
      ctx.fill();
      
      // 绘制连线 - 彩色连线
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const distance = Math.sqrt((p.x - p2.x) ** 2 + (p.y - p2.y) ** 2);
        
        if (distance < 120) {
          const lineOpacity = 0.3 * (1 - distance / 120) * currentOpacity;
          
          // 混合两个粒子的颜色
          const mixedColor = [
            Math.floor((p.color[0] + p2.color[0]) / 2),
            Math.floor((p.color[1] + p2.color[1]) / 2),
            Math.floor((p.color[2] + p2.color[2]) / 2)
          ];
          
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(${mixedColor[0]}, ${mixedColor[1]}, ${mixedColor[2]}, ${lineOpacity})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      }
    }
    
    // 鼠标交互光环
    if (mouse.x > 0 && mouse.y > 0) {
      const ringRadius = 50 + Math.sin(time * 0.05) * 10;
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, ringRadius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${colors.accent[0]}, ${colors.accent[1]}, ${colors.accent[2]}, 0.4)`;
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }
  
  function updateParticles() {
    for (const p of particles) {
      // 更新轨迹
      p.trail.push({ x: p.x, y: p.y });
      if (p.trail.length > 8) {
        p.trail.shift();
      }
      
      // 鼠标交互效果
      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 200 && distance > 0) {
        const force = (200 - distance) / 200 * 0.03;
        p.vx += (dx / distance) * force;
        p.vy += (dy / distance) * force;
      }
      
      // 添加随机扰动
      p.vx += (Math.random() - 0.5) * 0.01;
      p.vy += (Math.random() - 0.5) * 0.01;
      
      // 限制最大速度
      const maxSpeed = 2;
      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (speed > maxSpeed) {
        p.vx = (p.vx / speed) * maxSpeed;
        p.vy = (p.vy / speed) * maxSpeed;
      }
      
      p.x += p.vx;
      p.y += p.vy;
      
      // 边界检测 - 柔和反弹
      if (p.x < 0 || p.x > 1920) {
        p.vx = -p.vx * 0.8;
        p.x = Math.max(0, Math.min(1920, p.x));
      }
      if (p.y < 0 || p.y > 1080) {
        p.vy = -p.vy * 0.8;
        p.y = Math.max(0, Math.min(1080, p.y));
      }
      
      // 添加阻尼
      p.vx *= 0.995;
      p.vy *= 0.995;
    }
  }
  
  function animate() {
    time += 1;
    drawParticles();
    updateParticles();
    animationId = requestAnimationFrame(animate);
  }
  
  createParticles();
  animate();
}