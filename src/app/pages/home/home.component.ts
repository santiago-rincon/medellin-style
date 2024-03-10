import { Component } from '@angular/core';
import { BannerComponent } from '@components/banner/banner.component';
import { ServicesListComponent } from '@components/services-list/services-list.component';
import { ServiceBentoItem } from 'src/app/types';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [BannerComponent, ServicesListComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  localName = environment.localName;
  services: ServiceBentoItem[] = [
    {
      title: 'Corte de cabello',
      description:
        'Disfruta de un corte de cabello clásico con el toque distintivo de nuestra barbería. Nuestros barberos expertos están capacitados para crear cortes que se adapten a tu estilo y personalidad. Desde estilos cortos y definidos hasta cortes de tazón retro, te garantizamos un acabado impecable que resaltará tu individualidad.',
      colSpanDesktop: 'lg:col-span-6',
      colSpanMobile: 'col-span-10',
      image: '/assets/corte.webp',
      class: 'bg-center',
    },
    {
      title: 'Arreglo de barba',
      description:
        'Confía en nuestros barberos especializados para dar forma y estilo a tu barba. Ya sea que prefieras un aspecto bien recortado o un estilo más desenfadado.',
      colSpanDesktop: 'lg:col-span-4',
      colSpanMobile: 'col-span-10',
      image: '/assets/barba.webp',
    },
    {
      title: 'Corte de infantil',
      description:
        'En nuestra barbería, también nos encargamos de los más pequeños. Con nuestro servicio de corte infantil, garantizamos cortes de cabello divertidos y a la moda que harán que tus hijos se sientan geniales.',
      colSpanDesktop: 'lg:col-span-4',
      colSpanMobile: 'col-span-10',
      image: '/assets/baby.webp',
      class: 'bg-center',
    },
    {
      title: 'Arreglo de cejas',
      description:
        'Para un aspecto pulido y bien cuidado, prueba nuestro servicio de arreglo de cejas diseñado especialmente para hombres. Nuestros expertos barberos se encargarán de dar forma y definir tus cejas de manera natural y masculina.',
      colSpanDesktop: 'lg:col-span-6',
      colSpanMobile: 'col-span-10',
      image: '/assets/cejas.webp',
      class: 'bg-center',
    },
  ];
}
