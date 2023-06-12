import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { LoadingGameRoutingModule } from "./loading-game-routing.module";
import { LoadingGameComponent } from "./loading-game.component";
import { CountdownComponent } from "../../components/countdown/countdown.component";
import { MaterialModule } from "../../../shared/modules/material.module";

@NgModule({
  declarations: [LoadingGameComponent],
  imports: [CommonModule, LoadingGameRoutingModule, CountdownComponent, MaterialModule],
})
export class LoadingGameModule {}
