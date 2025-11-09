package jogo.modelo;

import java.util.Random;

public class Comida {
    private int posicaoX;
    private int posicaoY;
    private final Random gerador;

    public Comida(int maxX, int maxY) {
        gerador = new Random();
        gerarNovaPosicao(maxX, maxY);
    }

    //getters
    public int getPosicaoX() {
        return posicaoX;
    }

    public int getPosicaoY() {
        return posicaoY;
    }

    public Posicao getPosicao() {
        return new Posicao(posicaoX, posicaoY);
    }

    // Gera novas coordenadas dentro dos limites do tabuleiro
    public void gerarNovaPosicao(int maxX, int maxY) {
        posicaoX = gerador.nextInt(maxX);
        posicaoY = gerador.nextInt(maxY);
    }

    @Override
    public String toString() {
        return "Comida{" + "x=" + posicaoX + ", y=" + posicaoY + '}';
    }
}
