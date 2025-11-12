// --- 1. Inicialização ---
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const pontuacaoSpan = document.getElementById('pontuacao');

// --- 2. Nossas Variáveis de Controle ---
const LARGURA_TABULEIRO = 20;
const ALTURA_TABULEIRO = 10;
const TAMANHO_BLOCO = 20;

// --- 3. Controle de Velocidade ---
const VELOCIDADE_JOGO_MS = 200;

// --- 4. Variáveis de Imagem ---
const imagens = {};
let imagensCarregadasCount = 0;
const totalImagens = 5;

// --- 5. Variáveis de Interpolação (Fluidez) ---
let corpoAnterior = [];

// --- 6. Funções de Carregamento de Imagem ---
function carregarImagem(nome, caminho) {
    const img = new Image();
    img.src = caminho;
    img.onload = () => {
        imagensCarregadasCount++;
        if (imagensCarregadasCount === totalImagens) {
            iniciarJogoAposCarregamento();
        }
    };
    img.onerror = () => {
        console.error(`Erro ao carregar a imagem: ${caminho}`);
        imagensCarregadasCount++;
        if (imagensCarregadasCount === totalImagens) {
            iniciarJogoAposCarregamento();
        }
    };
    imagens[nome] = img;
}

// Carregar todas as imagens
carregarImagem('background', 'assets/background.png');
carregarImagem('steak', 'assets/steak.png');
carregarImagem('dog_head', 'assets/dog_head.png');
carregarImagem('dog_tail', 'assets/dog_tail.png');
carregarImagem('dog_body', 'assets/dog_body.png');

// --- 7. Classes de Modelo (Tradução de .java para .js) ---

const Direcao = {
    CIMA: 'CIMA',
    BAIXO: 'BAIXO',
    ESQUERDA: 'ESQUERDA',
    DIREITA: 'DIREITA'
};

class Cobra {
    constructor() {
        let posInicial = { x: Math.floor(LARGURA_TABULEIRO / 3), y: Math.floor(ALTURA_TABULEIRO / 2) };

        // MUDANÇA: Cada parte do corpo agora armazena sua própria "facing" (direção horizontal)
        this.corpo = [
            // Posição 0: Cabeça
            { x: posInicial.x, y: posInicial.y, facing: Direcao.DIREITA },
            // Posição 1: Rabo
            { x: posInicial.x - 1, y: posInicial.y, facing: Direcao.DIREITA }
        ];

        this.direcao = Direcao.DIREITA;
        this.precisaCrescer = false;
    }

    getCabeca() {
        return this.corpo[0];
    }

    mover() {
        const cabecaAtual = this.getCabeca();
        // A nova cabeça começa como uma cópia da antiga
        let novaCabeca = { ...cabecaAtual };

        // MUDANÇA: Atualiza a posição E a direção "facing"
        switch (this.direcao) {
            case Direcao.CIMA:
                novaCabeca.y -= 1;
                // Mantém a direção horizontal anterior
                novaCabeca.facing = cabecaAtual.facing;
                break;
            case Direcao.BAIXO:
                novaCabeca.y += 1;
                // Mantém a direção horizontal anterior
                novaCabeca.facing = cabecaAtual.facing;
                break;
            case Direcao.ESQUERDA:
                novaCabeca.x -= 1;
                // Vira para a esquerda
                novaCabeca.facing = Direcao.ESQUERDA;
                break;
            case Direcao.DIREITA:
                novaCabeca.x += 1;
                // Vira para a direita
                novaCabeca.facing = Direcao.DIREITA;
                break;
        }

        this.corpo.unshift(novaCabeca);

        if (!this.precisaCrescer) {
            this.corpo.pop();
        } else {
            this.precisaCrescer = false;
        }
    }

    crescer() {
        this.precisaCrescer = true;
    }

    mudarDirecao(novaDirecao) {
        // A lógica de 180 graus permanece a mesma
        if ((this.direcao === Direcao.CIMA && novaDirecao !== Direcao.BAIXO) ||
            (this.direcao === Direcao.BAIXO && novaDirecao !== Direcao.CIMA) ||
            (this.direcao === Direcao.ESQUERDA && novaDirecao !== Direcao.DIREITA) ||
            (this.direcao === Direcao.DIREITA && novaDirecao !== Direcao.ESQUERDA)) {

            this.direcao = novaDirecao;
        }
    }

    colidiuComCorpo() {
        const cabeca = this.getCabeca();
        for (let i = 1; i < this.corpo.length; i++) {
            if (cabeca.x === this.corpo[i].x && cabeca.y === this.corpo[i].y) {
                return true;
            }
        }
        return false;
    }

    contem(pos) {
        return this.corpo.some(p => p.x === pos.x && p.y === pos.y);
    }
}

class Comida {
    constructor() {
        this.posicao = { x: 0, y: 0 };
        this.gerarNovaPosicao();
    }
    gerarNovaPosicao() {
        this.posicao.x = Math.floor(Math.random() * LARGURA_TABULEIRO);
        this.posicao.y = Math.floor(Math.random() * ALTURA_TABULEIRO);
    }
    getPosicao() {
        return this.posicao;
    }
}


// --- 8. Classe Jogo (Tradução de Jogo.java) ---
class Jogo {
    constructor() {
        this.cobra = new Cobra();
        this.comida = new Comida();
        this.pontuacao = 0;
        this.jogoEstaTerminado = false;
        this.gerarNovaComida();
    }
    isForaDosLimites(pos) {
        return pos.x < 0 || pos.x >= LARGURA_TABULEIRO || pos.y < 0 || pos.y >= ALTURA_TABULEIRO;
    }
    gerarNovaComida() {
        do {
            this.comida.gerarNovaPosicao();
        } while (this.cobra.contem(this.comida.getPosicao()));
    }
    atualizar() {
        if (this.jogoEstaTerminado) return;
        this.cobra.mover();
        const cabeca = this.cobra.getCabeca();
        if (this.isForaDosLimites(cabeca) || this.cobra.colidiuComCorpo()) {
            this.jogoEstaTerminado = true;
            return;
        }
        if (cabeca.x === this.comida.getPosicao().x && cabeca.y === this.comida.getPosicao().y) {
            this.pontuacao += 10;
            this.cobra.crescer();
            this.gerarNovaComida();
        }
    }
}

// --- 10. Renderização (Função de Desenho ATUALIZADA) ---
let jogo = new Jogo();

function desenhar(progress) {
    // 1. Desenhar o Fundo
    if (imagens.background && imagens.background.complete) {
        ctx.drawImage(imagens.background, 0, 0, canvas.width, canvas.height);
    } else {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // 2. Desenhar a Comida (sem rotação)
    const posComida = jogo.comida.getPosicao();
    if (imagens.steak && imagens.steak.complete) {
        ctx.drawImage(imagens.steak, posComida.x * TAMANHO_BLOCO, posComida.y * TAMANHO_BLOCO, TAMANHO_BLOCO, TAMANHO_BLOCO);
    } else {
        ctx.fillStyle = 'red';
        ctx.fillRect(posComida.x * TAMANHO_BLOCO, posComida.y * TAMANHO_BLOCO, TAMANHO_BLOCO, TAMANHO_BLOCO);
    }

    // 3. Desenhar a Cobra (COM ESPELHAMENTO)
    const corpoAtual = jogo.cobra.corpo;
    if (!corpoAnterior || corpoAnterior.length === 0) {
        corpoAnterior = corpoAtual.map(p => ({ ...p }));
    }

    for (let i = 0; i < corpoAtual.length; i++) {
        const parteAtual = corpoAtual[i];
        const parteAnterior = corpoAnterior[i] || parteAtual;

        // Posição interpolada
        const pixelX = (parteAnterior.x + (parteAtual.x - parteAnterior.x) * progress) * TAMANHO_BLOCO;
        const pixelY = (parteAnterior.y + (parteAtual.y - parteAnterior.y) * progress) * TAMANHO_BLOCO;

        // Centro da peça (para espelhamento)
        const pixelX_center = pixelX + TAMANHO_BLOCO / 2;
        const pixelY_center = pixelY + TAMANHO_BLOCO / 2;

        // MUDANÇA: Pega a direção "facing" da própria peça
        // A "parteAtual" tem a direção correta, mesmo durante a animação
        const facing = parteAtual.facing;

        const isHead = (i === 0);
        const isTail = (i === corpoAtual.length - 1);

        let imageToDraw = null;
        let fallbackColor = null;

        if (isHead) {
            imageToDraw = imagens.dog_head;
            fallbackColor = '#eee';
        } else if (isTail && corpoAtual.length > 1) {
            // MUDANÇA: O rabo precisa olhar para a peça da frente (i-1)
            // Usamos a "facing" da peça da frente
            const facingDoRabo = corpoAtual[i-1].facing;
            imageToDraw = imagens.dog_tail;
            fallbackColor = '#A0522D';

            // Re-atribui o facing para a lógica de espelhamento
            // (Esta é uma exceção, só para o rabo)
            // facing = facingDoRabo; // Vamos simplificar: o rabo usa o seu *próprio* facing

        } else {
            imageToDraw = imagens.dog_body;
            fallbackColor = '#8B4513';
        }

        // --- Lógica de Desenho com Espelhamento ---
        ctx.save();
        ctx.translate(pixelX_center, pixelY_center); // Move a origem para o centro

        // MUDANÇA: Lógica de espelhamento
        if (facing === Direcao.ESQUERDA) {
            ctx.scale(-1, 1); // Vira o canvas horizontalmente
        }
        // NÃO HÁ MAIS ctx.rotate()

        if (imageToDraw && imageToDraw.complete) {
            ctx.drawImage(imageToDraw, -TAMANHO_BLOCO / 2, -TAMANHO_BLOCO / 2, TAMANHO_BLOCO, TAMANHO_BLOCO);
        } else {
            ctx.fillStyle = fallbackColor;
            ctx.fillRect(-TAMANHO_BLOCO / 2, -TAMANHO_BLOCO / 2, TAMANHO_BLOCO, TAMANHO_BLOCO);
        }

        ctx.restore(); // Restaura o canvas
    }

    // 4. Atualizar pontuação
    pontuacaoSpan.textContent = jogo.pontuacao;
}


// --- 11. Controle de Input ---
document.addEventListener('keydown', (e) => {
    switch (e.key.toUpperCase()) {
        case 'W':
            jogo.cobra.mudarDirecao(Direcao.CIMA);
            break;
        case 'S':
            jogo.cobra.mudarDirecao(Direcao.BAIXO);
            break;
        case 'A':
            jogo.cobra.mudarDirecao(Direcao.ESQUERDA);
            break;
        case 'D':
            jogo.cobra.mudarDirecao(Direcao.DIREITA);
            break;
    }
});


// --- 12. O Game Loop Principal (O ÚNICO LOOP) ---
let lastLogicUpdateTime = 0;

function gameLoop(currentTime) {
    requestAnimationFrame(gameLoop);

    if (lastLogicUpdateTime === 0) {
        lastLogicUpdateTime = currentTime;
    }

    const elapsedSinceLogicUpdate = currentTime - lastLogicUpdateTime;

    if (elapsedSinceLogicUpdate >= VELOCIDADE_JOGO_MS) {
        corpoAnterior = jogo.cobra.corpo.map(p => ({ ...p }));
        jogo.atualizar();

        if (jogo.jogoEstaTerminado) {
            alert("GAME OVER! Pontuação final: " + jogo.pontuacao);
            jogo = new Jogo();
            corpoAnterior = jogo.cobra.corpo.map(p => ({ ...p }));
        }
        lastLogicUpdateTime = currentTime;
    }

    // --- Animação (Desenho) ---
    const elapsedForAnimation = currentTime - lastLogicUpdateTime;
    const progress = Math.min(elapsedForAnimation / VELOCIDADE_JOGO_MS, 1.0);
    desenhar(progress);
}

// --- 13. Função de Início (Chamada após imagens carregarem) ---
function iniciarJogoAposCarregamento() {
    alert("=== JOGO DA COBRINHA ===\nUse W, A, S, D para mover.\n\nPressione OK para começar...");
    corpoAnterior = jogo.cobra.corpo.map(p => ({ ...p }));
    requestAnimationFrame(gameLoop);
}