package jogo.modelo;

public class Tabuleiro {
    private final int largura;
    private final int altura;
    private final TipoCelula[][] celulas;

    public enum TipoCelula {
        VAZIO,
        CORPO_COBRA,
        CABECA_COBRA,
        COMIDA
    }

    public Tabuleiro(int largura, int altura) {
        this.largura = largura;
        this.altura = altura;
        this.celulas = new TipoCelula[altura][largura];
        limparCelulas();
    }

    public int getLargura() {
        return largura;
    }

    public int getAltura() {
        return altura;
    }

    public boolean isForaDosLimites(Posicao pos) {
        int x = pos.getPosicaoX();
        int y = pos.getPosicaoY();
        return x < 0 || x >= largura || y < 0 || y >= altura;
    }

    public TipoCelula getTipoNa(int x, int y) {
        return celulas[y][x];
    }

    public void setTipoNa(Posicao pos, TipoCelula tipo) {
        if (!isForaDosLimites(pos)) {
            celulas[pos.getPosicaoY()][pos.getPosicaoX()] = tipo;
        }
    }

    public void limparCelulas() {
        for (int y = 0; y < altura; y++) {
            for (int x = 0; x < largura; x++) {
                celulas[y][x] = TipoCelula.VAZIO;
            }
        }
    }
}