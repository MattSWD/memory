import { Component, OnDestroy, OnInit } from "@angular/core";
import { delay, Subject, takeUntil } from "rxjs";
import { GameService } from "../../services/game.service";
import { ToastrService } from "ngx-toastr";
import { GlobalRanking, Match } from "../../models/database-entity";
import { MatTableDataSource } from "@angular/material/table";

@Component({
  selector: "app-global-ranking",
  templateUrl: "./global-ranking.component.html",
  styleUrls: ["./global-ranking.component.css"],
})
export class GlobalRankingComponent implements OnInit, OnDestroy {
  public totalPages: number = 0;
  public currentPage: number = 1;
  public totalElements: number = 0;
  public showTable: boolean = false;
  public isLoading: boolean = false;
  public dataSource!: MatTableDataSource<Match>;
  protected _OnDestroy: Subject<void> = new Subject<void>();
  public displayedColumns: string[] = ["rank", "nickname", "time"];

  constructor(private gameService: GameService, private toastrService: ToastrService) {}

  ngOnInit() {
    this.retrieveGlobalRanking();
  }

  /**
   * Metodo per il recupero della lista completa dei Match
   * ordinata per 'time' e 'createdAt'.
   * L'uso dell'operatore 'delay' è unicamente per dare
   * all'utente un senso di "caricamento" attraverso lo spinner;
   */
  public retrieveGlobalRanking(pageNumber: number = this.currentPage): void {
    this.isLoading = true;

    this.gameService
      .retrieveGlobalRanking$(pageNumber)
      .pipe(delay(1000), takeUntil(this._OnDestroy))
      .subscribe({
        next: (globalRanking: GlobalRanking) => {
          this.totalPages = globalRanking.totalPages;
          this.currentPage = globalRanking.currentPage;
          this.totalElements = globalRanking.totalElements;
          this.dataSource = new MatTableDataSource<Match>(
            globalRanking.response.map((match: Match, index: number) => {
              return {
                _id: match._id,
                nickname: match.nickname,
                time: match.time,
                createdAt: match.createdAt,
                updatedAt: match.updatedAt,
                rank: this.getRank(index, globalRanking.elementsPerPage, globalRanking.currentPage),
              };
            })
          );
        },
        error: () => {
          this.isLoading = false;
          this.showTable = true;
          this.toastrService.error("Impossibile recuperare la classifica globale.");
        },
        complete: () => {
          this.isLoading = false;
          this.showTable = true;
        },
      });
  }

  /**
   * Metodo per la valorizzazione della 'posizione'
   * per ogni singolo Match;
   */
  private getRank(index: number, elementsPerPage: number, currentPage: number): number {
    if (currentPage == 1) return index + 1;
    return elementsPerPage * (currentPage - 1) + index + 1;
  }

  /**
   * Metodo per l'assegnazione della classe
   * 'loading' per il mat-progress-bar;
   */
  public getProgressBarClass(): string {
    return this.isLoading ? "" : "no-loading";
  }

  /**
   * Navigazione verso una nuova partita;
   */
  public startNewMatch(): void {
    this.gameService.resetAndStartNewMatch();
  }

  ngOnDestroy() {
    this._OnDestroy.next();
    this._OnDestroy.complete();
  }
}
