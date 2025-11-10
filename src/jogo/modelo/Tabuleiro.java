package jogo.modelo;

public class Tabuleiro {
    private final int largura;
    private final int altura;

    public Tabuleiro(int largura, int altura) {
        this.largura = largura;
        this.altura = altura;
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
}