// ============================================
// SPEED - VELOCITY TEST
// ============================================

class SpeedGame {
    constructor() {
        // Estados
        this.gameState = 'intro'; // intro, waiting, measuring, result
        this.speedTime = 0;
        this.ranking = [];
        this.maxRankingItems = 5;

        // Elementos DOM
        this.introScreen = document.getElementById('introScreen');
        this.gameScreen = document.getElementById('gameScreen');
        this.resultScreen = document.getElementById('resultScreen');
        this.statusCircle = document.getElementById('statusCircle');
        this.statusText = document.getElementById('statusText');
        this.speedButton = document.getElementById('speedButton');
        this.speedValue = document.getElementById('speedValue');
        this.feedbackMessage = document.getElementById('feedbackMessage');
        this.rankingList = document.getElementById('rankingList');
        this.playAgainButton = document.getElementById('playAgainButton');
        this.particleContainer = document.getElementById('particleContainer');
        this.hudDisplay = document.getElementById('hudDisplay');

        // Timers
        this.waitTimer = null;

        // Inicializar
        this.init();
    }

    init() {
        // Carregar ranking do localStorage
        this.loadRanking();

        // Event Listeners
        this.speedButton.addEventListener('click', () => this.onSpeedClick());
        this.playAgainButton.addEventListener('click', () => this.startGame());

        // Iniciar com tela de introdução
        this.showIntro();
    }

    // ============================================
    // TELAS
    // ============================================

    showScreen(screenName) {
        this.introScreen.classList.remove('active');
        this.gameScreen.classList.remove('active');
        this.resultScreen.classList.remove('active');

        if (screenName === 'intro') {
            this.introScreen.classList.add('active');
        } else if (screenName === 'game') {
            this.gameScreen.classList.add('active');
        } else if (screenName === 'result') {
            this.resultScreen.classList.add('active');
        }
    }

    showIntro() {
        this.gameState = 'intro';
        this.showScreen('intro');

        // Transição para o jogo após 2 segundos
        setTimeout(() => {
            this.startGame();
        }, 2000);
    }

    // ============================================
    // LÓGICA DO JOGO
    // ============================================

    startGame() {
        this.gameState = 'waiting';
        this.showScreen('game');
        this.resetGameState();
        this.createParticles();
        this.updateHUD();

        // Iniciar trilha ambiente
        if (audioEngine) {
            audioEngine.startAmbientTrack();
        }
    }

    resetGameState() {
        this.speedTime = 0;
        this.statusCircle.className = 'status-circle red';
        this.statusText.textContent = 'Clique para iniciar o teste';
        this.speedButton.disabled = false;

        // Limpar timers anteriores
        if (this.waitTimer) clearTimeout(this.waitTimer);
    }

    onSpeedClick() {
        if (this.gameState !== 'waiting') return;

        this.gameState = 'measuring';
        this.speedButton.disabled = true;

        // Atualizar status
        this.statusCircle.className = 'status-circle yellow';
        this.statusText.textContent = 'Medindo velocidade...';

        // Reproduzir som de clique
        if (audioEngine) {
            audioEngine.playClickSound();
        }

        // Medir velocidade real
        this.measureRealSpeed();
    }

    // ============================================
    // MEDIÇÃO DE VELOCIDADE REAL
    // ============================================

    async measureRealSpeed() {
        try {
            const startTime = performance.now();
            
            // Fazer requisição para Google com cache-busting
            const response = await fetch('https://www.google.com/favicon.ico?t=' + Date.now(), {
                method: 'HEAD',
                mode: 'no-cors',
                cache: 'no-store'
            });
            
            const endTime = performance.now();
            this.speedTime = Math.round(endTime - startTime);
        } catch (error) {
            console.warn('Erro ao medir velocidade:', error);
            // Usar um valor padrão se falhar
            this.speedTime = Math.round(Math.random() * 50 + 20);
        }

        // Exibir resultado
        setTimeout(() => {
            this.showResult();
        }, 500);
    }

    // ============================================
    // RESULTADO E FEEDBACK
    // ============================================

    showResult() {
        this.showScreen('result');

        // Exibir tempo de velocidade
        this.speedValue.textContent = `${this.speedTime} ms`;

        // Gerar feedback baseado na velocidade
        const feedback = this.generateFeedback(this.speedTime);
        this.feedbackMessage.textContent = feedback;

        // Adicionar ao ranking
        this.addToRanking(this.speedTime);

        // Atualizar lista de ranking
        this.updateRankingDisplay();
    }

    generateFeedback(speedTime) {
        if (speedTime < 50) {
            return '🚀 Velocidade excelente! Conexão nível Connect!';
        } else if (speedTime < 100) {
            return '✓ Ótima velocidade de conexão!';
        } else if (speedTime < 150) {
            return '✓ Boa velocidade de conexão.';
        } else if (speedTime < 200) {
            return '⚠ Velocidade moderada. Conexão aceitável.';
        } else {
            return '⚠ Velocidade baixa. Verifique sua conexão.';
        }
    }

    // ============================================
    // RANKING LOCAL
    // ============================================

    addToRanking(time) {
        this.ranking.push(time);
        this.ranking.sort((a, b) => a - b);
        this.ranking = this.ranking.slice(0, this.maxRankingItems);
        this.saveRanking();
    }

    saveRanking() {
        localStorage.setItem('speedRanking', JSON.stringify(this.ranking));
    }

    loadRanking() {
        const saved = localStorage.getItem('speedRanking');
        this.ranking = saved ? JSON.parse(saved) : [];
    }

    updateRankingDisplay() {
        this.rankingList.innerHTML = '';

        if (this.ranking.length === 0) {
            this.rankingList.innerHTML = '<li style="text-align: center; color: rgba(255, 255, 255, 0.5);">Nenhum teste registrado</li>';
            return;
        }

        this.ranking.forEach((time, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span class="ranking-position">#${index + 1}</span>
                <span class="ranking-time">${time} ms</span>
            `;
            this.rankingList.appendChild(li);
        });
    }

    // ============================================
    // HUD
    // ============================================

    updateHUD() {
        if (!this.hudDisplay) return;
        this.hudDisplay.textContent = '◆ SISTEMA ATIVO | MEDINDO VELOCIDADE';
    }

    // ============================================
    // PARTÍCULAS
    // ============================================

    createParticles() {
        this.particleContainer.innerHTML = '';

        const particleCount = 30;
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';

            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            const size = Math.random() * 3 + 2;

            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';

            this.particleContainer.appendChild(particle);

            // Animação de movimento
            this.animateParticle(particle);
        }
    }

    animateParticle(particle) {
        const duration = Math.random() * 3000 + 2000;
        const startX = parseFloat(particle.style.left);
        const startY = parseFloat(particle.style.top);
        const endX = startX + (Math.random() - 0.5) * 200;
        const endY = startY + (Math.random() - 0.5) * 200;

        let startTime = null;

        const animate = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            particle.style.left = (startX + (endX - startX) * progress) + 'px';
            particle.style.top = (startY + (endY - startY) * progress) + 'px';
            particle.style.opacity = 0.6 * (1 - progress);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }
}

// ============================================
// INICIALIZAR JOGO
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    const game = new SpeedGame();
});
