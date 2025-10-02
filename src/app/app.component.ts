import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { OverViewComponent } from './Components/over-view/over-view.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, OverViewComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'StellarCrew';
}
