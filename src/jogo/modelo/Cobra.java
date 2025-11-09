package jogo.modelo;

import java.util.ArrayList;

public class Cobra {
    private ArrayList<Posicao> corpo;
    private Boolean precisaCrescer;
    private Direcao direcao;

    // getters
    public Posicao getCabeca(){
        return corpo.get(0);
    }

    public ArrayList<Posicao> getCorpo() {
        return new ArrayList<>(corpo);
    }

    //Direção
    public enum Direcao {
        CIMA, BAIXO, ESQUERDA, DIREITA
    }

    // Posição e direção inicial da cobra
    public Cobra(Posicao posicaoInicial, Direcao direcaoInicial ){
        this.corpo = new ArrayList<>();
        this.corpo.add(posicaoInicial);
        this.direcao = direcaoInicial;
        this.precisaCrescer = false;
    }

    // Métodos
    public void mover(){

        //Posição da cabeça da cobra
        Posicao cabecaAtual = corpo.get(0);
        Posicao novaCabeca = new Posicao(cabecaAtual.getPosicaoX(), cabecaAtual.getPosicaoY());

        int x = cabecaAtual.getPosicaoX();
        int y = cabecaAtual.getPosicaoY();

        //Lógica de movimento da cobra
        switch (direcao) {
            case CIMA -> novaCabeca = new Posicao(x, y - 1);
            case BAIXO -> novaCabeca = new Posicao(x, y + 1);
            case ESQUERDA -> novaCabeca = new Posicao(x - 1, y);
            case DIREITA -> novaCabeca = new Posicao(x + 1, y);
        }

        corpo.add(0, novaCabeca);

        //Lógica para o crescimento da cobra
        if (!precisaCrescer) {
        corpo.remove(corpo.size() - 1);
        } else {
            precisaCrescer = false;
        }}

    public void crescer(){
        precisaCrescer = true;
        System.out.println("Crescando");
    }

    public void mudarDirecao(Direcao novaDirecao){
        //Esse tanto de if previne que a cobra só consiga mexer a cabeça em 180°
        if ((this.direcao == Direcao.CIMA && novaDirecao != Direcao.BAIXO) ||
                (this.direcao == Direcao.BAIXO && novaDirecao != Direcao.CIMA) ||
                (this.direcao == Direcao.ESQUERDA && novaDirecao != Direcao.DIREITA) ||
                (this.direcao == Direcao.DIREITA && novaDirecao != Direcao.ESQUERDA)) {
            this.direcao = novaDirecao;
        }
    }

    //Reseta a posição da cobra
    public void reset(Posicao posicaoInicial, Direcao direcaoInicial) {
        corpo.clear();
        corpo.add(posicaoInicial);
        this.direcao = direcaoInicial;
        this.precisaCrescer = false;
    }

    //Colisão da cobra com o corpo
    public boolean colidiuComCorpo(){
        Posicao cabeca =  corpo.get(0);
        for (int i = 1; i < corpo.size(); i++){
           if (cabeca.equals(corpo.get(i))){
               return true;
           }
       }
        return false;
    }

    //É usado para verificar a posição atual da cobra
    @Override
    public String toString() {
        return "Cobra{" + "corpo=" + corpo + ", direcao=" + direcao + '}';
    }

}
