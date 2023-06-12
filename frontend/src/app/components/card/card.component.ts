import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { animate, state, style, transition, trigger } from "@angular/animations";
import { Card } from "../../models/card";

@Component({
  selector: "app-card",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./card.component.html",
  styleUrls: ["./card.component.css"],
  animations: [
    trigger("flip", [
      state(
        "hided",
        style({
          transform: "none",
        })
      ),
      state(
        "flipped",
        style({
          transform: "perspective(600px) rotateY(180deg)",
        })
      ),
      state(
        "matched",
        style({
          visibility: "false",
          transform: "scale(0.05)",
          opacity: 0,
        })
      ),
      transition("hided => flipped", [animate("400ms")]),
      transition("flipped => hided", [animate("400ms")]),
      transition("* => matched", [animate("400ms")]),
    ]),
  ],
})
export class CardComponent {
  @Input() singleCard: Card = { imageId: "", state: "hided" };
  @Output() cardClicked: EventEmitter<void> = new EventEmitter<void>();
}
