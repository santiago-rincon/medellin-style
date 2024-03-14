import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Turn } from '@types';
import localeEs from '@angular/common/locales/es-CO';
import { registerLocaleData } from '@angular/common';
import { LOCALE_ID } from '@angular/core';
registerLocaleData(localeEs, 'es-CO');
@Component({
  selector: 'app-table',
  standalone: true,
  imports: [DatePipe],
  providers: [{ provide: LOCALE_ID, useValue: 'es-CO' }],
  templateUrl: './table.component.html',
})
export class TableComponent {
  @Input({ required: true }) data: Turn[] = [];
  @Input({ required: true }) isBarber: boolean = false;
  @Output() readonly delete = new EventEmitter<string>();

  deleteDoc(id: string | undefined) {
    console.log(id);
    if (id === undefined) return;
    this.delete.emit(id);
  }
}
