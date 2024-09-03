// FontAwesome CDN Configuration
window.FontAwesomeCdnConfig = {
    autoA11y: { enabled: false },
    asyncLoading: { enabled: false },
    reporting: { enabled: false },
    useUrl: "use.fontawesome.com",
    faCdnUrl: "https://cdn.fontawesome.com:443",
    code: "d1341f9b7a"
  };
  


  // Utility Functions
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  async function typewriteTitle(text) {
    document.title = '';
    for (let i = 0; i < text.length; i++) {
      document.title += text.charAt(i);
      console.log(document.title);
      await sleep(250);
    }
  }


  
  // Raindrops Script
  let ctx, cW, cH, raindrops;
  let rainStrength = 1;
  let mouseX = 0;
  
  function initCanvas() {
    const canvas = document.getElementById("particleCanvas");
    ctx = canvas.getContext("2d");
  
    canvas.width = 1920 * 0.75;
    canvas.height = 1080 * 0.75;
  
    cW = canvas.width;
    cH = canvas.height;
  
    mouseX = cW / 2;
  }
  
  class Raindrops {
    constructor() {
      this.drops = [];
      this.splashes = [];
    }
  
    addDrop() {
      const x = (Math.random() * (cW + 100)) - 100;
      const s = (Math.random() * 7) + 2;
  
      this.drops.push({
        x: x,
        y: 0,
        velY: 2,
        width: s / 3,
        height: s * 1.2,
        speed: s,
        life: 60
      });
    }
  
    render() {
      for (let i = 0; i < rainStrength; i++) {
        this.addDrop();
      }
  
      ctx.save();
      ctx.clearRect(0, 0, cW, cH);
      ctx.fillStyle = 'rgb(255, 255, 255)';
  
      this.drops.forEach((drop, index) => {
        ctx.fillRect(drop.x, drop.y, drop.width, drop.height);
  
        const direction = (mouseX - cW / 2) * 0.01;
        drop.x += direction;
        drop.y += drop.speed * 2;
  
        if (drop.y + drop.height > cH) {
          this.splashes.push({
            x: drop.x + (Math.random() * 20 - 10),
            y: drop.y,
            width: drop.width,
            height: drop.height,
            velY: drop.velY,
            speed: drop.speed,
            life: drop.life
          });
  
          this.drops.splice(index, 1);
        }
      });
  
      this.splashes.forEach((splash, index) => {
        ctx.fillRect(splash.x, splash.y, splash.width / 3, splash.height / 3);
  
        splash.y -= splash.velY * splash.speed / 6;
        splash.life--;
        splash.velY -= 0.1;
  
        if (splash.life <= 0) {
          this.splashes.splice(index, 1);
        }
      });
  
      ctx.restore();
    }
  }
  
  function init() {
    raindrops = new Raindrops();
    loop();
  }
  
  function render() {
    raindrops.render();
  }
  
  function loop() {
    requestAnimationFrame(loop);
    render();
  }
  
  window.addEventListener('mousemove', (event) => {
    mouseX = event.clientX - ctx.canvas.getBoundingClientRect().left;
  });
  
  window.addEventListener('load', () => {
    initCanvas();
    init();
    typewriteTitle('Arta');
  });
  