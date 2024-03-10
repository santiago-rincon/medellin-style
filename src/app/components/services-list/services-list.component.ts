import { Component, Input } from '@angular/core';
import { BentoItemComponent } from '@components/bento-item/bento-item.component';
import { ServiceBentoItem } from 'src/app/types';

@Component({
  selector: 'app-services-list',
  standalone: true,
  imports: [BentoItemComponent],
  templateUrl: './services-list.component.html',
})
export class ServicesListComponent {
  @Input({ required: true }) localName = '';
  @Input({ required: true }) services: ServiceBentoItem[] = [];
}
