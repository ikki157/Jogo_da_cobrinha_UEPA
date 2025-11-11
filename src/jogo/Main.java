package jogo;

import jogo.controles.Jogo;
import jogo.modelo.Cobra;

import java.io.IOException;
import java.util.Scanner;

public class Main {

    public static void main(String[] args) throws InterruptedException, IOException {

        Scanner scanner = new Scanner(System.in);
        Jogo jogo = new Jogo(20, 10);

        System.out.println("=== JOGO DA COBRINHA ===");
        System.out.println("Use W, A, S, D para mover e ENTER após cada tecla");
        System.out.println("Pressione ENTER para começar...");
        scanner.nextLine();

        while (!jogo.isJogoEstaTerminado()) {

            limparConsole();

            System.out.println("Pontuação: " + jogo.getPontuacao());
            System.out.println();

            for (int y = 0; y < jogo.getTabuleiro().getAltura(); y++) {
                for (int x = 0; x < jogo.getTabuleiro().getLargura(); x++) {
                    switch (jogo.getTabuleiro().getTipoNa(x, y)) {
                        case VAZIO -> System.out.print(" ");
                        case COMIDA -> System.out.print("🍎");
                        case CORPO_COBRA -> System.out.print("■");
                        case CABECA_COBRA -> System.out.print("●");
                    }
                }
                System.out.println();
            }

            if (System.in.available() > 0) {
                char tecla = (char) System.in.read();
                switch (Character.toUpperCase(tecla)) {
                    case 'W' -> jogo.mudarDirecaoDaCobra(Cobra.Direcao.CIMA);
                    case 'S' -> jogo.mudarDirecaoDaCobra(Cobra.Direcao.BAIXO);
                    case 'A' -> jogo.mudarDirecaoDaCobra(Cobra.Direcao.ESQUERDA);
                    case 'D' -> jogo.mudarDirecaoDaCobra(Cobra.Direcao.DIREITA);
                }
            }

            jogo.atualizar();

            Thread.sleep(900);
        }

        limparConsole();
        System.out.println("GAME OVER!");
        System.out.println("Pontuação final: " + jogo.getPontuacao());
    }


    private static void limparConsole() {
        try {
            if (System.getProperty("os.name").contains("Windows")) {
                new ProcessBuilder("cmd", "/c", "cls").inheritIO().start().waitFor();
            } else {
                System.out.print("\033[H\033[2J");
                System.out.flush();
            }
        } catch (Exception e) {
            System.out.println(e);
        }
    }
}
