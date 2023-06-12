import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { RankingRoutingModule } from "./ranking-routing.module";
import { RankingComponent } from "./ranking.component";
import { MaterialModule } from "../../../shared/modules/material.module";
import { CountdownComponent } from "../../components/countdown/countdown.component";

@NgModule({
  declarations: [RankingComponent],
  imports: [CommonModule, MaterialModule, RankingRoutingModule, CountdownComponent],
})
export class RankingModule {}
