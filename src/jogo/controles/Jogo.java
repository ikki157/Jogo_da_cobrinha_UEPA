package jogo.controles;

import jogo.modelo.Cobra;
import jogo.modelo.Comida;
import jogo.modelo.Posicao;
import jogo.modelo.Tabuleiro;

public class Jogo {

    private final Tabuleiro tabuleiro;
    private final Cobra cobra;
    private final Comida comida;
    private boolean jogoEstaTerminado;
    private int pontuacao;

    public Jogo(int largura, int altura) {
        this.tabuleiro = new Tabuleiro(largura, altura);

        Posicao posInicial = new Posicao(largura / 3, altura / 2);
        this.cobra = new Cobra(posInicial, Cobra.Direcao.DIREITA);

        this.comida = new Comida(largura, altura);
        this.gerarNovaComida();

        this.jogoEstaTerminado = false;
        this.pontuacao = 0;

        atualizarEstadoTabuleiro();
    }

    public void atualizar() {
        if (jogoEstaTerminado) {
            return;
        }

        cobra.mover();

        if (verificarColisoes()) {
            jogoEstaTerminado = true;
            return;
        }

        if (verificarComida()) {
            pontuacao += 10;
            cobra.crescer();
            gerarNovaComida();
        }

        atualizarEstadoTabuleiro();
    }

    private void atualizarEstadoTabuleiro() {
        tabuleiro.limparCelulas();

        tabuleiro.setTipoNa(comida.getPosicao(), Tabuleiro.TipoCelula.COMIDA);

        for (Posicao p : cobra.getCorpo()) {
            tabuleiro.setTipoNa(p, Tabuleiro.TipoCelula.CORPO_COBRA);
        }

        tabuleiro.setTipoNa(cobra.getCabeca(), Tabuleiro.TipoCelula.CABECA_COBRA);
    }

    private boolean verificarColisoes() {
        Posicao cabeca = cobra.getCabeca();

        if (tabuleiro.isForaDosLimites(cabeca)) {
            return true;
        }

        if (cobra.colidiuComCorpo()) {
            return true;
        }

        return false;
    }

    private boolean verificarComida() {
        return cobra.getCabeca().equals(comida.getPosicao());
    }

    private void gerarNovaComida() {
        do {
            comida.gerarNovaPosicao(tabuleiro.getLargura(), tabuleiro.getAltura());
        } while (cobra.getCorpo().contains(comida.getPosicao()));
    }

    public void mudarDirecaoDaCobra(Cobra.Direcao novaDirecao) {
        cobra.mudarDirecao(novaDirecao);
    }

    public Tabuleiro getTabuleiro() {
        return tabuleiro;
    }

    public Cobra getCobra() {
        return cobra;
    }

    public Comida getComida() {
        return comida;
    }

    public boolean isJogoEstaTerminado() {
        return jogoEstaTerminado;
    }

    public int getPontuacao() {
        return pontuacao;
    }
}