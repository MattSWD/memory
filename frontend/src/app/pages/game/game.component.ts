import { Component, OnInit, ViewChild } from "@angular/core";
import { Card } from "../../models/card";
import { GameService } from "../../services/game.service";
import { CountdownComponent } from "../../components/countdown/countdown.component";

@Component({
  selector: "app-game",
  templateUrl: "./game.component.html",
  styleUrls: ["./game.component.css"],
})
export class GameComponent implements OnInit {
  public cards: Card[] = [];
  public matchedCards: number = 0;
  public flippedCards: Card[] = [];
  public matchTotalTime: number = 90;
  public deck: string[] = ["0001", "0002", "0003", "0004", "0005", "0006"];

  @ViewChild("countdown") countdown!: CountdownComponent;

  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    this.initialCardsPlacement();
  }

  /**
   * Metodo per il posizionamento iniziale delle coppie di carte;
   */
  public initialCardsPlacement(): void {
    this.cards = [];
    this.deck.forEach((image: string) => {
      const card: Card = {
        imageId: image,
        state: "hided",
      };

      this.cards = [...this.cards, { ...card }, { ...card }];
    });

    this.cards = this.shuffleDeck(this.cards);
  }

  /**
   * Metodo per il mescolamento randomico delle carte;
   */
  public shuffleDeck(cards: Card[]): Card[] {
    return [...cards.sort(() => Math.random() - 0.5)];
  }

  /**
   * Metodo per il cambiamento di 'stato' al click di
   * una delle carte disposte nella griglia iniziale;
   */
  public onCardClick(index: number): void {
    const cardClicked: Card = this.cards[index];

    if (cardClicked.state === "hided" && this.flippedCards.length < 2) {
      cardClicked.state = "flipped";
      this.flippedCards.push(cardClicked);

      if (this.flippedCards.length > 1) {
        this.matchCheck();
      }
    } else if (cardClicked.state === "flipped") {
      cardClicked.state = "hided";
      this.flippedCards.pop();
    }
  }

  /**
   * Metodo per la verifica della corretta uguaglianza
   * tra una coppia di carte selezionate dall'utente;
   */
  public matchCheck(): void {
    setTimeout((): void => {
      const cardOne: Card = this.flippedCards[0];
      const cardTwo: Card = this.flippedCards[1];
      const nextState: "hided" | "matched" = cardOne.imageId === cardTwo.imageId ? "matched" : "hided";
      cardOne.state = cardTwo.state = nextState;

      this.flippedCards = [];

      if (nextState === "matched") {
        this.matchedCards++;

        if (this.matchedCards === this.deck.length) {
          this.onMatchEnd(this.countdown.time);
        }
      }
    }, 500);
  }

  /**
   * Metodo per la chiusura della partita in corso
   * allo scadere del tempo a disposizione dell'utente
   * o al completamento della partita stessa;
   */
  public onMatchEnd(time: number = 0): void {
    this.gameService.setMatchData({
      nickname: this.gameService.matchDataValue.nickname ?? window.localStorage.getItem("nickname")!,
      time: this.matchTotalTime * 1000 - time,
    });
    this.gameService.completeMatchData();
  }
}
