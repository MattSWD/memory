import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "./guards/auth.guard";

const routes: Routes = [
  {
    path: "",
    loadChildren: () => import("./pages/start-game/start-game.module").then((m) => m.StartGameModule),
  },
  {
    path: "loading-game",
    canActivate: [AuthGuard],
    loadChildren: () => import("./pages/loading-game/loading-game.module").then((m) => m.LoadingGameModule),
  },
  {
    path: "game",
    canActivate: [AuthGuard],
    loadChildren: () => import("./pages/game/game.module").then((m) => m.GameModule),
  },
  {
    path: "ranking",
    canActivate: [AuthGuard],
    loadChildren: () => import("./pages/ranking/ranking.module").then((m) => m.RankingModule),
  },
  {
    path: "global-ranking",
    loadChildren: () => import("./pages/global-ranking/global-ranking.module").then((m) => m.GlobalRankingModule),
  },
  {
    path: "**",
    redirectTo: "",
    pathMatch: "full",
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: "reload" })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
