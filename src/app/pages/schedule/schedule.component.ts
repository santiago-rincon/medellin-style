import { calendarConfig, allHours, fields } from './config';
import { CalendarModule } from 'primeng/calendar';
import { Component, OnInit, inject } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputMaskModule } from 'primeng/inputmask';
import { PrimeNGConfig } from 'primeng/api';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { environment } from 'src/environments/environment.development';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputGroupAddonModule,
    InputGroupModule,
    InputMaskModule,
    CalendarModule,
    DatePipe,
    DropdownModule,
    DividerModule,
    CurrencyPipe,
  ],
  templateUrl: './schedule.component.html',
})
export class ScheduleComponent implements OnInit {
  private readonly config = inject(PrimeNGConfig);
  toastScv = inject(ToastrService);
  minDate = new Date();
  disabledDates = [0];
  barbers = environment.barbers;
  services = environment.services;
  hours = this.generateHours([1200, 1230]);
  scheduleForm = new FormGroup({
    barber: new FormControl<string | null>('Will', {
      validators: [Validators.required],
    }),
    service: new FormControl<number | null>(0, {
      validators: [Validators.required],
    }),
    client: new FormControl<string | null>('Pepe', {
      validators: [Validators.required],
    }),
    phone: new FormControl<string | null>('313-835-5260', {
      validators: [Validators.required],
    }),
    date: new FormControl<Date | null>(new Date(), {
      validators: [Validators.required],
    }),
    hour: new FormControl<number | null>(930, {
      validators: [Validators.required],
    }),
  });
  ngOnInit() {
    this.config.setTranslation(calendarConfig);
  }

  onSubmit() {
    const values = Object.entries(this.scheduleForm.value);
    for (const i of values) {
      if (i[1] === null || i[1] === '') {
        this.toastScv.error(
          `El campo ${fields[i[0] as keyof typeof fields]} es requerido`,
          'Error'
        );
        return;
      }
    }
    const { barber, client, date, hour, phone, service } =
      this.scheduleForm.value;
    if (date?.getDay() === 0) {
      this.toastScv.error(
        'El día domingo no hay servicio, selecciona otro día',
        'Error'
      );
      return;
    }
    console.log(date);

    const info = {
      service: this.services[service as number],
      client,
      phone: phone?.replace(/-/g, ''),
      date,
    };
  }

  private generateHours(disabledHours: number[] = []) {
    const hours = allHours;
    return hours.filter(hour => !disabledHours.includes(hour.hourF));
  }
}
