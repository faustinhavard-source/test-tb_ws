document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.horizontal-container');
    const bridgeStructure = document.querySelector('.bridge-structure');
    const bridgeTowers = document.getElementById('bridge-towers');
    const bridgeCables = document.getElementById('bridge-cables');
    const clouds = document.getElementById('clouds');
    const progressFill = document.querySelector('.progress-fill');
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('.section');

    let scrollPosition = 0;
    let maxScroll = container.scrollWidth - window.innerWidth;

    // Create pixel art Golden Gate towers
    function createPixelTowers() {
        bridgeTowers.innerHTML = '';
        const totalWidth = window.innerWidth * 5;
        const numTowers = 7;
        const towerSpacing = totalWidth / (numTowers + 1);

        // Add road
        const road = document.createElement('div');
        road.className = 'pixel-road';
        bridgeTowers.appendChild(road);

        // Add water
        const water = document.createElement('div');
        water.className = 'pixel-water';
        bridgeTowers.appendChild(water);

        // Create towers
        for (let i = 1; i <= numTowers; i++) {
            const tower = document.createElement('div');
            tower.className = 'pixel-tower';
            tower.style.left = `${i * towerSpacing - 16}px`;

            tower.innerHTML = `
                <div class="tower-cap"></div>
                <div class="tower-beam-top"></div>
                <div class="tower-pillars">
                    <div class="tower-pillar"></div>
                    <div class="tower-pillar"></div>
                </div>
                <div class="tower-base"></div>
            `;

            bridgeTowers.appendChild(tower);
        }
    }

    // Create pixel art cables
    function createPixelCables() {
        bridgeCables.innerHTML = '';
        const totalWidth = window.innerWidth * 5;
        const numTowers = 7;
        const towerSpacing = totalWidth / (numTowers + 1);

        // Create SVG for cables
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.style.width = '100%';
        svg.style.height = '100%';
        svg.style.position = 'absolute';
        svg.style.bottom = '0';
        svg.style.left = '0';

        // Main cables between towers (catenary curves)
        for (let i = 0; i <= numTowers; i++) {
            const startX = i * towerSpacing;
            const endX = (i + 1) * towerSpacing;
            const midX = (startX + endX) / 2;

            // Tower heights (from bottom of bridge structure)
            const towerTop = 160; // Height where cables attach
            const sagDepth = 100; // How much cable sags

            // Main cable path (stepped for pixel look)
            const steps = 20;
            let pathD = `M ${startX} ${200 - towerTop}`;

            for (let s = 1; s <= steps; s++) {
                const t = s / steps;
                const x = startX + (endX - startX) * t;
                // Parabolic sag
                const sag = 4 * sagDepth * t * (1 - t);
                const y = 200 - towerTop + sag;
                // Snap to pixel grid (4px steps)
                const snappedY = Math.round(y / 4) * 4;
                pathD += ` L ${Math.round(x)} ${snappedY}`;
            }

            const cable = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            cable.setAttribute('d', pathD);
            cable.setAttribute('stroke', '#535353');
            cable.setAttribute('stroke-width', '3');
            cable.setAttribute('fill', 'none');
            svg.appendChild(cable);

            // Vertical suspender cables
            const numSuspenders = 8;
            for (let j = 1; j < numSuspenders; j++) {
                const t = j / numSuspenders;
                const x = startX + (endX - startX) * t;
                const sag = 4 * sagDepth * t * (1 - t);
                const cableY = 200 - towerTop + sag;
                const roadY = 200 - 48; // Road level

                const suspender = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                suspender.setAttribute('x1', Math.round(x));
                suspender.setAttribute('y1', Math.round(cableY / 4) * 4);
                suspender.setAttribute('x2', Math.round(x));
                suspender.setAttribute('y2', roadY);
                suspender.setAttribute('stroke', '#535353');
                suspender.setAttribute('stroke-width', '2');
                svg.appendChild(suspender);
            }
        }

        bridgeCables.appendChild(svg);
    }

    // Create pixel clouds
    function createPixelClouds() {
        clouds.innerHTML = '';
        const totalWidth = window.innerWidth * 5;

        // Cloud positions
        const cloudPositions = [];
        for (let i = 0; i < 25; i++) {
            cloudPositions.push({
                x: Math.random() * totalWidth,
                y: Math.random() * 50,
                size: Math.random() > 0.5 ? 'large' : 'small'
            });
        }

        cloudPositions.forEach(pos => {
            const cloud = document.createElement('div');
            cloud.className = 'pixel-cloud';
            cloud.style.left = `${pos.x}px`;
            cloud.style.top = `${pos.y}px`;

            if (pos.size === 'large') {
                // Large pixel cloud
                cloud.innerHTML = `
                    <div class="c1" style="left: 8px; top: 0;"></div>
                    <div class="c1" style="left: 16px; top: 0;"></div>
                    <div class="c1" style="left: 0; top: 8px;"></div>
                    <div class="c1" style="left: 8px; top: 8px;"></div>
                    <div class="c1" style="left: 16px; top: 8px;"></div>
                    <div class="c1" style="left: 24px; top: 8px;"></div>
                    <div class="c1" style="left: 32px; top: 8px;"></div>
                    <div class="c1" style="left: 8px; top: 16px;"></div>
                    <div class="c1" style="left: 16px; top: 16px;"></div>
                    <div class="c1" style="left: 24px; top: 16px;"></div>
                `;
            } else {
                // Small pixel cloud
                cloud.innerHTML = `
                    <div class="c1" style="left: 0; top: 0;"></div>
                    <div class="c1" style="left: 8px; top: 0;"></div>
                    <div class="c1" style="left: 16px; top: 0;"></div>
                    <div class="c1" style="left: 4px; top: 8px;"></div>
                    <div class="c1" style="left: 12px; top: 8px;"></div>
                `;
            }

            clouds.appendChild(cloud);
        });
    }

    // Initialize bridge
    createPixelTowers();
    createPixelCables();
    createPixelClouds();

    // Handle wheel scroll
    function handleScroll(e) {
        e.preventDefault();
        scrollPosition += e.deltaY * 1.2;
        scrollPosition = Math.max(0, Math.min(scrollPosition, maxScroll));
        updatePosition();
    }

    // Update all positions
    function updatePosition() {
        container.style.transform = `translateX(${-scrollPosition}px)`;
        bridgeStructure.style.transform = `translateX(${-scrollPosition}px)`;
        clouds.style.transform = `translateX(${-scrollPosition * 0.3}px)`;

        const progress = (scrollPosition / maxScroll) * 100;
        progressFill.style.width = `${progress}%`;

        updateActiveSection();
    }

    // Update active section
    function updateActiveSection() {
        const windowWidth = window.innerWidth;

        sections.forEach((section, index) => {
            const sectionStart = index * windowWidth;
            const sectionEnd = sectionStart + windowWidth;

            if (scrollPosition >= sectionStart - windowWidth / 2 &&
                scrollPosition < sectionEnd - windowWidth / 2) {

                navLinks.forEach(link => link.classList.remove('active'));
                const correspondingLink = document.querySelector(`a[href="#${section.id}"]`);
                if (correspondingLink) {
                    correspondingLink.classList.add('active');
                }
            }
        });
    }

    // Nav link click
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetIndex = Array.from(sections).findIndex(s => s.id === targetId);

            if (targetIndex !== -1) {
                const targetPosition = targetIndex * window.innerWidth;
                animateScroll(targetPosition);
            }
        });
    });

    // Smooth scroll animation
    function animateScroll(targetPosition) {
        const startPosition = scrollPosition;
        const distance = targetPosition - startPosition;
        const duration = 800;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            const easeOutCubic = 1 - Math.pow(1 - progress, 3);

            scrollPosition = startPosition + (distance * easeOutCubic);
            updatePosition();

            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        }

        requestAnimationFrame(animation);
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
            const targetPosition = Math.min(scrollPosition + window.innerWidth, maxScroll);
            animateScroll(targetPosition);
        } else if (e.key === 'ArrowLeft') {
            const targetPosition = Math.max(scrollPosition - window.innerWidth, 0);
            animateScroll(targetPosition);
        }
    });

    // Touch support
    let touchStartX = 0;
    let touchStartScroll = 0;

    document.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartScroll = scrollPosition;
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
        const touchX = e.touches[0].clientX;
        const diff = touchStartX - touchX;
        scrollPosition = Math.max(0, Math.min(touchStartScroll + diff * 1.5, maxScroll));
        updatePosition();
    }, { passive: true });

    // Wheel event
    window.addEventListener('wheel', handleScroll, { passive: false });

    // Resize handling
    window.addEventListener('resize', () => {
        maxScroll = container.scrollWidth - window.innerWidth;
        scrollPosition = Math.min(scrollPosition, maxScroll);
        createPixelTowers();
        createPixelCables();
        createPixelClouds();
        updatePosition();
    });

    // Initialize
    updatePosition();
});
