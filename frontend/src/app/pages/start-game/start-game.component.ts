import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { LoginFormGroup } from "../../models/typed-form-group";
import { GameService } from "../../services/game.service";

@Component({
  selector: "app-start-game",
  templateUrl: "./start-game.component.html",
  styleUrls: ["./start-game.component.css"],
})
export class StartGameComponent {
  public loginForm: FormGroup<LoginFormGroup> = this.createLoginForm();

  constructor(private router: Router, private gameService: GameService) {}

  /**
   * Metodo per la creazione del ReactiveFormGroup
   * relativo alla pseudo-login del giocatore;
   */
  public createLoginForm(): FormGroup<LoginFormGroup> {
    return new FormGroup<LoginFormGroup>({
      nickname: new FormControl<string | null>(null, {
        updateOn: "change",
        asyncValidators: [this.gameService?.uniqueNicknameValidator()],
        validators: [
          Validators.required,
          Validators.maxLength(25),
          Validators.pattern("^(?!\\s)(?!.*\\s$)[a-zA-Z0-9\\s()-]+$"),
        ],
      }),
    });
  }

  /**
   * Visualizzazione 'mat-error' in caso di FormControl non valido;
   */
  public retrieveMatErrorMessage(): string {
    const nicknameFormControl: FormControl<string> = this.loginForm.get("nickname") as FormControl<string>;
    if (nicknameFormControl.hasError("maxlength")) return "Il Nickname non può superare i 25 caratteri";
    if (nicknameFormControl.hasError("pattern")) return "Caratteri speciali, spazi iniziali e/o finali non consentiti";
    if (nicknameFormControl.hasError("notUnique")) return "Nickname già in possesso di un altro giocatore";
    return "Campo Obbligatorio";
  }

  /**
   * Metodo per il reset della 'loginForm';
   */
  public resetLoginForm(): void {
    this.loginForm.reset();
  }

  /**
   * Submit della 'loginForm' e successiva navigazione
   * verso la pagina di Countdown;
   */
  public submitLoginForm(): void {
    const nickname: string = this.loginForm.get("nickname")?.value!;
    this.gameService.setMatchData({ nickname: nickname });
    window.localStorage.setItem("nickname", nickname);
    this.router.navigate(["loading-game"]);
  }
}
