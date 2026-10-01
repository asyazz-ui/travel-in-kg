window.requestAnimFrame = (() => {
    return window.requestAnimationFrame || function (callback) {
        window.setTimeout(callback, 1000 / 60);
    };
})();

window.addEventListener('load', () => {
    const canvas = document.getElementById('canvas');
    if (!canvas) return;

    const c = canvas.getContext('2d', { alpha: false });
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const pointer = { x: null, y: null };
    const target = { x: 0, y: 0, errx: 0, erry: 0 };
    const lastTarget = { x: 0, y: 0 };
    const lakeImage = new Image();
    const lakeSrc = 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Lake%20Issyk-Kul%2C%20Kyrgyzstan.jpg';

    const imageLayer = document.createElement('canvas');
    const imageCtx = imageLayer.getContext('2d');
    const revealLayer = document.createElement('canvas');
    const revealCtx = revealLayer.getContext('2d');

    let cssWidth = 0;
    let cssHeight = 0;
    let t = 0;
    let streams = [];
    let imageReady = false;

    const dist = (p1x, p1y, p2x, p2y) => Math.hypot(p2x - p1x, p2y - p1y);

    const setCanvasSize = (element, ctx) => {
        element.width = Math.floor(cssWidth * dpr);
        element.height = Math.floor(cssHeight * dpr);
        if (ctx && typeof ctx.setTransform === 'function') {
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }
    };

    class Segment {
        constructor(parent, length, angle, first) {
            this.pos = first
                ? { x: parent.x, y: parent.y }
                : { x: parent.nextPos.x, y: parent.nextPos.y };
            this.l = length;
            this.ang = angle;
            this.nextPos = {
                x: this.pos.x + this.l * Math.cos(this.ang),
                y: this.pos.y + this.l * Math.sin(this.ang),
            };
        }

        update(targetPoint) {
            this.ang = Math.atan2(targetPoint.y - this.pos.y, targetPoint.x - this.pos.x);
            this.pos.x = targetPoint.x + this.l * Math.cos(this.ang - Math.PI);
            this.pos.y = targetPoint.y + this.l * Math.sin(this.ang - Math.PI);
            this.nextPos.x = this.pos.x + this.l * Math.cos(this.ang);
            this.nextPos.y = this.pos.y + this.l * Math.sin(this.ang);
        }

        fallback(targetPoint) {
            this.pos.x = targetPoint.x;
            this.pos.y = targetPoint.y;
            this.nextPos.x = this.pos.x + this.l * Math.cos(this.ang);
            this.nextPos.y = this.pos.y + this.l * Math.sin(this.ang);
        }

        traceOn(ctx) {
            ctx.lineTo(this.nextPos.x, this.nextPos.y);
        }
    }

    class AuroraStream {
        constructor(x, y, length, segmentCount) {
            this.x = x;
            this.y = y;
            this.l = length;
            this.n = segmentCount;
            this.rand = Math.random();
            this.hue = 150 + this.rand * 55;
            this.segments = [new Segment(this, this.l / this.n, 0, true)];

            for (let i = 1; i < this.n; i++) {
                this.segments.push(new Segment(this.segments[i - 1], this.l / this.n, 0, false));
            }
        }

        move(prevTarget, currentTarget) {
            const angle = Math.atan2(currentTarget.y - this.y, currentTarget.x - this.x);
            const travel = dist(prevTarget.x, prevTarget.y, currentTarget.x, currentTarget.y) + 4;
            const tailTarget = {
                x: currentTarget.x - 0.8 * travel * Math.cos(angle),
                y: currentTarget.y - 0.8 * travel * Math.sin(angle),
            };

            this.segments[this.n - 1].update(tailTarget);

            for (let i = this.n - 2; i >= 0; i--) {
                this.segments[i].update(this.segments[i + 1].pos);
            }

            if (dist(this.x, this.y, currentTarget.x, currentTarget.y) <= this.l + travel) {
                this.segments[0].fallback({ x: this.x, y: this.y });
                for (let i = 1; i < this.n; i++) {
                    this.segments[i].fallback(this.segments[i - 1].nextPos);
                }
            }
        }

        isActive(currentTarget) {
            return dist(this.x, this.y, currentTarget.x, currentTarget.y) <= this.l;
        }

        traceOn(ctx) {
            ctx.moveTo(this.x, this.y);
            for (let i = 0; i < this.n; i++) {
                this.segments[i].traceOn(ctx);
            }
        }

        reveal(ctx, currentTarget) {
            if (!this.isActive(currentTarget)) return;
            ctx.beginPath();
            this.traceOn(ctx);
            ctx.strokeStyle = `rgba(255,255,255,${0.22 + this.rand * 0.12})`;
            ctx.lineWidth = 16 + this.rand * 16;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.stroke();
        }

        glow(ctx, currentTarget) {
            if (!this.isActive(currentTarget)) return;
            ctx.globalCompositeOperation = 'lighter';
            ctx.beginPath();
            this.traceOn(ctx);
            ctx.strokeStyle = `hsla(${this.hue}, 100%, ${58 + this.rand * 24}%, ${0.5 + this.rand * 0.24})`;
            ctx.lineWidth = 1 + this.rand * 2.2;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.stroke();
            ctx.globalCompositeOperation = 'source-over';
        }

        particle(ctx, currentTarget) {
            ctx.beginPath();
            if (this.isActive(currentTarget)) {
                ctx.arc(this.x, this.y, 1 + this.rand * 1.5, 0, 2 * Math.PI);
                ctx.fillStyle = `hsla(${this.hue}, 80%, 78%, 0.75)`;
            } else {
                ctx.arc(this.x, this.y, this.rand * 1.6, 0, 2 * Math.PI);
                ctx.fillStyle = `hsla(${this.hue}, 70%, 45%, 0.18)`;
            }
            ctx.fill();
        }
    }

    const buildStreams = () => {
        const area = cssWidth * cssHeight;
        const numStreams = Math.max(80, Math.min(180, Math.round(area / 13500)));
        const maxLength = Math.min(260, cssWidth * 0.2);
        const minLength = Math.max(50, cssWidth * 0.055);
        const segmentCount = cssWidth < 700 ? 16 : 20;

        streams = [];
        for (let i = 0; i < numStreams; i++) {
            streams.push(
                new AuroraStream(
                    Math.random() * cssWidth,
                    Math.random() * cssHeight,
                    Math.random() * (maxLength - minLength) + minLength,
                    segmentCount
                )
            );
        }
    };

    const paintImageCover = () => {
        imageCtx.clearRect(0, 0, cssWidth, cssHeight);
        if (!imageReady) return;

        const imgRatio = lakeImage.naturalWidth / lakeImage.naturalHeight;
        const viewportRatio = cssWidth / cssHeight;
        let drawWidth = cssWidth;
        let drawHeight = cssHeight;
        let offsetX = 0;
        let offsetY = 0;

        if (imgRatio > viewportRatio) {
            drawHeight = cssHeight;
            drawWidth = drawHeight * imgRatio;
            offsetX = (cssWidth - drawWidth) / 2;
        } else {
            drawWidth = cssWidth;
            drawHeight = drawWidth / imgRatio;
            offsetY = (cssHeight - drawHeight) / 2;
        }

        imageCtx.drawImage(lakeImage, offsetX, offsetY, drawWidth, drawHeight);
    };

    const resizeCanvas = () => {
        cssWidth = window.innerWidth;
        cssHeight = window.innerHeight;

        setCanvasSize(canvas, c);
        canvas.style.width = `${cssWidth}px`;
        canvas.style.height = `${cssHeight}px`;
        setCanvasSize(imageLayer, imageCtx);
        setCanvasSize(revealLayer, revealCtx);

        buildStreams();
        paintImageCover();

        if (!target.x && !target.y) {
            target.x = cssWidth / 2;
            target.y = cssHeight / 2;
            lastTarget.x = target.x;
            lastTarget.y = target.y;
        }
    };

    const updateTarget = () => {
        if (pointer.x !== null && pointer.y !== null) {
            target.errx = pointer.x - target.x;
            target.erry = pointer.y - target.y;
        } else {
            const orbitRadius = Math.max(100, Math.min(cssWidth, cssHeight) * 0.28);
            target.errx =
                cssWidth / 2 +
                (orbitRadius * Math.sqrt(2) * Math.cos(t)) / (Math.pow(Math.sin(t), 2) + 1) -
                target.x;
            target.erry =
                cssHeight / 2 +
                (orbitRadius * Math.sqrt(2) * Math.cos(t) * Math.sin(t)) / (Math.pow(Math.sin(t), 2) + 1) -
                target.y;
        }

        target.x += target.errx / 11;
        target.y += target.erry / 11;
        t += 0.009;
    };

    const drawRevealMask = () => {
        if (!imageReady) return;

        revealCtx.clearRect(0, 0, cssWidth, cssHeight);

        const revealRadius = Math.max(130, Math.min(cssWidth, cssHeight) * 0.16);
        const glow = revealCtx.createRadialGradient(
            target.x,
            target.y,
            revealRadius * 0.12,
            target.x,
            target.y,
            revealRadius
        );
        glow.addColorStop(0, 'rgba(255,255,255,1)');
        glow.addColorStop(0.48, 'rgba(255,255,255,0.72)');
        glow.addColorStop(1, 'rgba(255,255,255,0)');

        revealCtx.fillStyle = glow;
        revealCtx.beginPath();
        revealCtx.arc(target.x, target.y, revealRadius, 0, 2 * Math.PI);
        revealCtx.fill();

        for (let i = 0; i < streams.length; i++) {
            streams[i].reveal(revealCtx, target);
        }

        revealCtx.globalCompositeOperation = 'source-in';
        revealCtx.drawImage(imageLayer, 0, 0, cssWidth, cssHeight);
        revealCtx.globalCompositeOperation = 'source-over';
    };

    const drawGlowOrb = () => {
        const travel = dist(lastTarget.x, lastTarget.y, target.x, target.y);
        const outerRadius = 10 + Math.min(travel * 1.1, 22);
        const orbGradient = c.createRadialGradient(target.x, target.y, 1, target.x, target.y, outerRadius);
        orbGradient.addColorStop(0, 'rgba(220,255,250,0.98)');
        orbGradient.addColorStop(0.4, 'rgba(128,244,225,0.82)');
        orbGradient.addColorStop(1, 'rgba(64,182,184,0)');

        c.globalCompositeOperation = 'lighter';
        c.fillStyle = orbGradient;
        c.beginPath();
        c.arc(target.x, target.y, outerRadius, 0, 2 * Math.PI);
        c.fill();
        c.globalCompositeOperation = 'source-over';
    };

    const draw = () => {
        c.clearRect(0, 0, cssWidth, cssHeight);

        const sky = c.createLinearGradient(0, 0, 0, cssHeight);
        sky.addColorStop(0, '#04070b');
        sky.addColorStop(1, '#09121a');
        c.fillStyle = sky;
        c.fillRect(0, 0, cssWidth, cssHeight);

        updateTarget();

        for (let i = 0; i < streams.length; i++) {
            streams[i].move(lastTarget, target);
        }

        drawRevealMask();

        if (imageReady) {
            c.drawImage(revealLayer, 0, 0, cssWidth, cssHeight);
        }

        c.fillStyle = 'rgba(3, 5, 8, 0.16)';
        c.fillRect(0, 0, cssWidth, cssHeight);

        drawGlowOrb();

        for (let i = 0; i < streams.length; i++) {
            streams[i].particle(c, target);
            streams[i].glow(c, target);
        }

        lastTarget.x = target.x;
        lastTarget.y = target.y;
    };

    const loop = () => {
        window.requestAnimFrame(loop);
        draw();
    };

    canvas.addEventListener('mousemove', (event) => {
        const rect = canvas.getBoundingClientRect();
        pointer.x = event.clientX - rect.left;
        pointer.y = event.clientY - rect.top;
    }, { passive: true });

    canvas.addEventListener('mouseleave', () => {
        pointer.x = null;
        pointer.y = null;
    });

    window.addEventListener('resize', resizeCanvas);

    lakeImage.decoding = 'async';
    lakeImage.onload = () => {
        imageReady = true;
        paintImageCover();
    };
    lakeImage.src = lakeSrc;

    resizeCanvas();
    loop();
});
