import { Injectable, OnDestroy } from "@angular/core";
import { GlobalRanking, Match } from "../models/database-entity";
import {
  BehaviorSubject,
  debounceTime,
  distinctUntilChanged,
  first,
  map,
  Observable,
  Subject,
  switchMap,
  takeUntil,
} from "rxjs";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { AbstractControl, AsyncValidatorFn } from "@angular/forms";
import { ToastrService } from "ngx-toastr";

@Injectable({
  providedIn: "root",
})
export class GameService implements OnDestroy {
  protected _OnDestroy: Subject<void> = new Subject<void>();
  private matchData: BehaviorSubject<Match> = new BehaviorSubject<Match>({});

  constructor(private router: Router, private httpClient: HttpClient, private toastrService: ToastrService) {
    /* Funzione in ascolto del completamento di 'matchData'.
     * All'emissione dell'ultimo valore del BehaviorSubject si
     * scatena il salvataggio del 'Match'; */
    this.matchData$.pipe(takeUntil(this._OnDestroy)).subscribe({ complete: () => this.storeMatch() });
  }

  /**
   * Metodo per il recupero del 'matchData' come Observable;
   */
  public get matchData$(): Observable<Match> {
    return this.matchData.asObservable();
  }

  /**
   * Metodo per il recupero del valore appartenente a 'matchData';
   */
  public get matchDataValue(): Match {
    return this.matchData.getValue();
  }

  /**
   * Metodo per la valorizzazione di 'matchData';
   */
  public setMatchData(match: Match): void {
    this.matchData.next(match);
  }

  /**
   * Metodo per il completamento di 'matchData';
   */
  public completeMatchData(): void {
    this.matchData.complete();
  }

  /**
   * Navigazione verso la pagina di riepilogo contenente
   * il punteggio effettuato e la classifica parziale;
   */
  private navigateToRanking(matchId: string): void {
    this.router
      .navigate(["ranking"], { queryParams: { id: matchId } })
      .then(() => window.localStorage.removeItem("nickname"));
  }

  /**
   * Navigazione verso la pagina di riepilogo contenente
   * il punteggio effettuato e la classifica parziale;
   */
  public navigateToGlobalRanking(): void {
    this.router.navigate(["global-ranking"]);
  }

  /**
   * Navigazione verso la home e reset dell'intero Applicativo;
   */
  public resetAndStartNewMatch(): void {
    this.router.navigate([""]);
  }

  /**
   * Metodo per il recupero di un singolo Match attraverso
   * il 'nickname' della persona. Query necessaria a stabilire
   * se il 'nickname' che sta inserendo il nuovo giocatore
   * è 'univoco' nel DB;
   */
  public uniqueNicknameValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> =>
      control.valueChanges.pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap((controlValue: string) =>
          this.httpClient.post<{ response: Match | null }>("http://localhost:3000/api/match/retrieve", {
            nickname: controlValue,
          })
        ),
        map((response: { response: Match | null }) => {
          return response.response == null ? null : { notUnique: true };
        }),
        first()
      );
  }

  /**
   * Metodo per il salvataggio di un Match una volta concluso
   * il tempo a disposizione dell'utente o una volta completato
   * il Memory;
   */
  public storeMatch(): void {
    let matchId!: string;
    this.httpClient
      .post<{ matchId: string }>("http://localhost:3000/api/match/store", this.matchDataValue)
      .pipe(takeUntil(this._OnDestroy))
      .subscribe({
        next: (response: { matchId: string }): void => {
          matchId = response.matchId;
          this.toastrService.success("Match salvato con successo!");
        },
        error: () => this.toastrService.error("Impossibile salvare il Match svolto!"),
        complete: () => this.navigateToRanking(matchId),
      });
  }

  /**
   * Metodo per il recupero di un singolo Match tramite 'id'.
   * Recupero comprensivo dei tre Match antecedenti e ai tre match
   * successivi a esso;
   */
  public retrievePartialRanking$(matchId: string): Observable<Match[]> {
    return this.httpClient
      .get<{ response: Match[] }>("http://localhost:3000/api/match/retrieve/ranking", {
        params: { id: matchId },
      })
      .pipe(map((response: { response: Match[] }) => [...response.response]));
  }

  /**
   * Metodo per il recupero della lista completa dei Match
   * ordinata per 'time' e 'createdAt';
   */
  public retrieveGlobalRanking$(pageNumber: number): Observable<GlobalRanking> {
    return this.httpClient.get<GlobalRanking>("http://localhost:3000/api/match/retrieve/global-ranking", {
      params: { page: pageNumber },
    });
  }

  ngOnDestroy() {
    this._OnDestroy.next();
    this._OnDestroy.complete();
  }
}
