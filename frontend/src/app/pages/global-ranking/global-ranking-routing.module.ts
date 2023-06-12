import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { GlobalRankingComponent } from "./global-ranking.component";

const routes: Routes = [
  {
    path: "",
    component: GlobalRankingComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GlobalRankingRoutingModule {}
