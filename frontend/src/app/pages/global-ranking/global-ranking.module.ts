import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { GlobalRankingRoutingModule } from "./global-ranking-routing.module";
import { GlobalRankingComponent } from "./global-ranking.component";
import { MaterialModule } from "../../../shared/modules/material.module";

@NgModule({
  declarations: [GlobalRankingComponent],
  imports: [CommonModule, MaterialModule, GlobalRankingRoutingModule],
})
export class GlobalRankingModule {}
