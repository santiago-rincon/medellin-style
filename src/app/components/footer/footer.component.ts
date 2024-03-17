import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  localName = environment.localName;
  schedule = environment.schedule;
}
