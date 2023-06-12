import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoadingGameComponent } from "./loading-game.component";

const routes: Routes = [
  {
    path: "",
    component: LoadingGameComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoadingGameRoutingModule {}
