import { NgOptimizedImage } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-empty-turns',
  standalone: true,
  imports: [NgOptimizedImage, RouterLink],
  templateUrl: './empty-turns.component.html',
})
export class EmptyTurnsComponent {
  @Input({ required: true }) isBarber: boolean = false;
  @Input() showText = true;
  private readonly toastSvc = inject(ToastrService);
  localName = environment.localName;
  baseUrl = environment.baseUrl;
  async share() {
    if ('share' in navigator) {
      try {
        await navigator.share({
          title: `Agenda tu turno en ${this.localName}`,
          text: 'Ingresano a este link podrás agendar tu turno 😀',
          url: this.baseUrl + '/schedule',
        });
      } catch (error) {
        console.log(error);
        this.toastSvc.error(
          'Ha ocurrido un error al compartir el link, intentalo más tarde',
          'Error'
        );
      }
    } else if ('clipboard' in navigator) {
      try {
        await window.navigator.clipboard.writeText(this.baseUrl + '/schedule');
        this.toastSvc.info(
          'Tu navegador no soporta la funcionalidad de compartir, el link fue copiado al portapapeles.',
          'Compartir'
        );
      } catch (error) {
        console.log(error);
        this.toastSvc.error(
          'Tu navegador no soporta la funcionalidad de compartir',
          'Error'
        );
      }
    } else {
      this.toastSvc.info(
        'Tu dispositivo no soporta las funcionalidades de compartir o copiar a portapapeles, descarga el código QR y compártelo.',
        'Lo siento'
      );
    }
  }
}
