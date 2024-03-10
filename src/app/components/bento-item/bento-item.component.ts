import { Component, Input } from '@angular/core';
import { ServiceBentoItem } from 'src/app/types';

@Component({
  selector: 'app-bento-item',
  standalone: true,
  imports: [],
  templateUrl: './bento-item.component.html',
})
export class BentoItemComponent {
  @Input({ required: true }) service: ServiceBentoItem = {
    title: '',
    description: '',
    colSpanDesktop: 'md:col-span-1',
    colSpanMobile: 'col-span-1',
    image: '',
  };
}
