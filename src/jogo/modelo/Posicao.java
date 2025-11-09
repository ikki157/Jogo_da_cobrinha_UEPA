package jogo.modelo;

import java.util.Objects;

public class Posicao {
    private int posicaoX;
    private int posicaoY;

    public Posicao(int x, int y) {
        this.posicaoX = x;
        this.posicaoY = y;
    }

    //Gera uma copia da posição para facilita o crescimento da cobra
    public Posicao copiar() {
        return new Posicao(this.posicaoX, this.posicaoY);
    }

    //getters
    public int getPosicaoX() {
        return posicaoX;
    }

    public int getPosicaoY() {
        return posicaoY;
    }

    //Lógica da colisão, aqui é verifica a posição do corpo e da cabeça da cobra
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        Posicao posicao = (Posicao) obj;
        return posicaoX == posicao.posicaoX && posicaoY == posicao.posicaoY;
    }

    @Override
    public int hashCode() {
        return Objects.hash(posicaoX, posicaoY);
    }

    @Override
    public String toString() {
        return "(" + posicaoX + ", " + posicaoY + ")";
    }
}