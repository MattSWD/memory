import { Component, OnDestroy, OnInit } from "@angular/core";
import { GameService } from "../../services/game.service";
import { MatTableDataSource } from "@angular/material/table";
import { Match } from "../../models/database-entity";
import { ActivatedRoute } from "@angular/router";
import { delay, Subject, takeUntil } from "rxjs";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-ranking",
  templateUrl: "./ranking.component.html",
  styleUrls: ["./ranking.component.css"],
})
export class RankingComponent implements OnInit, OnDestroy {
  private matchId!: string;
  public currentMatch: Match = {};
  public showTable: boolean = false;
  public dataSource!: MatTableDataSource<Match>;
  protected _OnDestroy: Subject<void> = new Subject<void>();
  public displayedColumns: string[] = ["rank", "nickname", "time"];

  constructor(
    private gameService: GameService,
    private activatedRoute: ActivatedRoute,
    private toastrService: ToastrService
  ) {
    this.matchId = this.activatedRoute.snapshot.queryParams["id"];
  }

  ngOnInit(): void {
    this.retrievePartialRanking();
  }

  /**
   * Metodo per il recupero del 'dataSource'.
   * L'uso dell'operatore 'delay' è unicamente per dare
   * all'utente un senso di "caricamento" attraverso lo spinner;
   */
  private retrievePartialRanking(): void {
    this.gameService
      .retrievePartialRanking$(this.matchId)
      .pipe(delay(1000), takeUntil(this._OnDestroy))
      .subscribe({
        next: (matches: Match[]) => {
          this.currentMatch = { ...matches.find((singleMatches: Match) => singleMatches._id === this.matchId) };
          this.dataSource = new MatTableDataSource<Match>([...matches]);
        },
        error: () => {
          this.showTable = true;
          this.toastrService.error("Impossibile recuperare la classifica parziale.");
        },
        complete: () => (this.showTable = true),
      });
  }

  /**
   * Metodo per l'assegnazione della classe
   * 'current-match' per la riga corrispondente
   * al match appena salvato;
   */
  public getRowClass(element: Match): string {
    return element._id === this.matchId ? "current-match" : "";
  }

  /**
   * Metodo per la navigazione verso la
   * 'global-ranking' paginata;
   */
  public navigateToGlobalRanking(): void {
    this.gameService.navigateToGlobalRanking();
  }

  ngOnDestroy() {
    this._OnDestroy.next();
    this._OnDestroy.complete();
  }
}
