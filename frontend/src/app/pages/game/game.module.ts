import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { GameRoutingModule } from "./game-routing.module";
import { GameComponent } from "./game.component";
import { MaterialModule } from "../../../shared/modules/material.module";
import { CardComponent } from "../../components/card/card.component";
import { CountdownComponent } from "../../components/countdown/countdown.component";

@NgModule({
  declarations: [GameComponent],
  imports: [CommonModule, GameRoutingModule, MaterialModule, CardComponent, CountdownComponent],
})
export class GameModule {}
