import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-banner',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './banner.component.html',
})
export class BannerComponent {
  localName = environment.localName;
  direction = environment.direction;
  schedule = environment.schedule;
  ubication = environment.ubication;
}
