import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MaterialModule } from "../../../shared/modules/material.module";
import { finalize, map, Observable, takeWhile, tap, timer } from "rxjs";

@Component({
  selector: "app-countdown",
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: "./countdown.component.html",
  styleUrls: ["./countdown.component.css"],
})
export class CountdownComponent {
  @Input() public seconds: number = 3;
  @Output() public timeExpired: EventEmitter<void> = new EventEmitter<void>();
  public time: number = 90000;

  /**
   * Observable che sfrutta gli operatori RxJS per un progressivo
   * aggiornamento dei secondi rimanenti. L'operatore 'finalize'
   * segnala infine lo scadere del tempo;
   */
  public timer$: Observable<number> = timer(0, 10).pipe(
    map((centiSecondsLeft: number) => this.seconds * 1000 - centiSecondsLeft * 10),
    tap((centiSecondsLeft: number) => (this.time = centiSecondsLeft)),
    takeWhile((centiSecondsLeft: number): boolean => centiSecondsLeft >= 0),
    finalize(() => this.timeExpired.emit())
  );
}
