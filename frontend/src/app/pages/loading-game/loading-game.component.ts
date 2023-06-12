import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-loading-game",
  templateUrl: "./loading-game.component.html",
  styleUrls: ["./loading-game.component.css"],
})
export class LoadingGameComponent {
  constructor(private router: Router) {}

  /**
   * Al termine del caricamento si avvia la logica del Memory;
   */
  public navigateToGame(): void {
    this.router.navigate(["game"]);
  }
}
