const canvas = document.getElementById('heartILY');
const ctx = canvas.getContext('2d');

let particles = [];
const particleCount = 200; 
let rotationAngle = 0;
let scaleUnit = 0;

function init() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const minSide = Math.min(canvas.width, canvas.height);
    scaleUnit = minSide / 50; 
    
    particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(i * (Math.PI * 2 / particleCount), i));
    }
}

class Particle {
    constructor(angle, index) {
        this.index = index;
        this.angle = angle;
        const t = this.angle;
        
        this.baseX = 16 * Math.pow(Math.sin(t), 3);
        this.baseY = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
        this.baseZ = (Math.random() - 0.5) * 10; 
        
        this.offsetX = 0;
        this.offsetY = 0;
        this.randomSeed = Math.random() * 1000;
    }
    
    update() {
        this.offsetX = Math.sin(Date.now() * 0.001 + this.randomSeed) * 2;
        this.offsetY = Math.cos(Date.now() * 0.001 + this.randomSeed) * 2;
    }
    
    draw() {
        const currentX = this.baseX + this.offsetX;
        const currentY = this.baseY + this.offsetY;
        
        const x3d = currentX * Math.cos(rotationAngle) - this.baseZ * Math.sin(rotationAngle);
        const z3d = currentX * Math.sin(rotationAngle) + this.baseZ * Math.cos(rotationAngle);
        
        const perspective = 600 / (600 + z3d * (scaleUnit * 0.8)); 
        const screenX = canvas.width / 2 + x3d * scaleUnit * perspective;
        const screenY = canvas.height / 2 + currentY * scaleUnit * perspective;

        const size = (scaleUnit * 0.8) * perspective;
        const opacity = perspective > 1 ? 1 : perspective * 0.6;
        
        ctx.save();
        ctx.font = `bold ${size}px Arial`;
        ctx.textAlign = "center";
        ctx.fillStyle = `rgba(255, ${70 + z3d * 5}, ${130 + z3d * 5}, ${opacity})`;
        
        if (perspective > 1.1) {
            ctx.shadowBlur = 15;
            ctx.shadowColor = "#ff1e7d";
        }
        
        const text = (this.index === 0) ? "Hannah Bejo" : "I love you";
        ctx.fillText(text, screenX, screenY);
        
        ctx.restore();
    }
}

function animate() {
    ctx.fillStyle = '#050005';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    particles.sort((a, b) => {
        const zA = a.baseX * Math.sin(rotationAngle) + a.baseZ * Math.cos(rotationAngle);
        const zB = b.baseX * Math.sin(rotationAngle) + b.baseZ * Math.cos(rotationAngle);
        return zA - zB;
    });
    
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    
    rotationAngle += 0.008;
    requestAnimationFrame(animate);
}

init();
animate();

window.addEventListener('resize', init);