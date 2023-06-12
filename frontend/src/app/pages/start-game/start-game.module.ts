import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { StartGameRoutingModule } from "./start-game-routing.module";
import { StartGameComponent } from "./start-game.component";
import { ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "../../../shared/modules/material.module";

@NgModule({
  declarations: [StartGameComponent],
  imports: [CommonModule, StartGameRoutingModule, MaterialModule, ReactiveFormsModule],
})
export class StartGameModule {}
