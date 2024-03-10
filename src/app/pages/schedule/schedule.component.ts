import { calendarConfig, fields } from './config';
import { CalendarModule } from 'primeng/calendar';
import { Component, OnInit, inject } from '@angular/core';
import { AsyncPipe, CurrencyPipe, DatePipe, JsonPipe } from '@angular/common';
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
import { BarberInfo, HandleSuscription, Turn } from '@types';
import { FirestoreService } from '@services/firestore.service';
import { Observable } from 'rxjs';
import { FireAuthService } from '@services/fire-auth.service';
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
    AsyncPipe,
    JsonPipe,
  ],
  templateUrl: './schedule.component.html',
})
export class ScheduleComponent implements OnInit {
  private readonly config = inject(PrimeNGConfig);
  private readonly toastScv = inject(ToastrService);
  private readonly firestoreSvc = inject(FirestoreService);
  private readonly fireAuth = inject(FireAuthService);
  private readonly currentUser$ = this.fireAuth.currentUser$;
  minDate = new Date();
  disabledDates = [0];
  barbers: BarberInfo[] = [];
  suscriptions: HandleSuscription[] = []; //TODO:Private
  services = environment.services;
  private busyTurns: Turn[] = [];
  hours: { hour: number; hourF: string }[] = [];
  scheduleForm = new FormGroup({
    barber: new FormControl<string | null>(null, {
      validators: [Validators.required],
    }),
    service: new FormControl<number | null>(null, {
      validators: [Validators.required],
    }),
    client: new FormControl<string | null>(null, {
      validators: [Validators.required],
    }),
    phone: new FormControl<string | null>(null, {
      validators: [Validators.required],
    }),
    date: new FormControl<Date | null>(new Date(), {
      validators: [Validators.required],
    }),
    hour: new FormControl<number | null>(null, {
      validators: [Validators.required],
    }),
  });

  ngOnInit() {
    this.config.setTranslation(calendarConfig);
    const barbers$ = this.firestoreSvc.getBarbers() as Observable<BarberInfo[]>;
    const barbersList = barbers$.subscribe(barbers => {
      if (barbers.length === 0) {
        this.toastScv.error(
          'No se ha podido leer la base de datos, intentalo más tarde',
          'Error'
        );
        return;
      }
      this.barbers = barbers;
    });
    const currentUser = this.currentUser$.subscribe(user => {
      if (user !== null) {
        this.scheduleForm.controls.client.setValue(user.displayName);
        this.scheduleForm.controls.phone.setValue(user.phoneNumber);
      }
    });
    this.suscriptions.push({ id: 'barbersList', suscription: barbersList });
    this.suscriptions.push({ id: 'currentUser', suscription: currentUser });
  }

  onSubmit() {
    // const values = Object.entries(this.scheduleForm.value);
    // for (const i of values) {
    //   if (i[1] === null || i[1] === '') {
    //     this.toastScv.error(
    //       `El campo ${fields[i[0] as keyof typeof fields]} es requerido`,
    //       'Error'
    //     );
    //     return;
    //   }
    // }
    // const { barber, client, date, hour, phone, service } =
    //   this.scheduleForm.value;
    // if (date?.getDay() === 0) {
    //   this.toastScv.error(
    //     'El día domingo no hay servicio, selecciona otro día',
    //     'Error'
    //   );
    //   return;
    // }
    // TODO verificar fecha minima y maxima
    // console.log(date);
    // const info = {
    //   service: this.services[service as number],
    //   client,
    //   phone: phone?.replace(/-/g, ''),
    //   date,
    // };
  }

  changeBarber(value: string | null) {
    const indexCurrentSuscription = this.suscriptions.findIndex(
      s => s.id === 'turnsList'
    );
    if (indexCurrentSuscription !== -1) {
      this.suscriptions[indexCurrentSuscription].suscription?.unsubscribe();
    }
    if (value === null) {
      this.hours = [];
      return;
    }
    const barber = this.barbers.find(b => b.uuid === value);
    if (barber === undefined) return;
    const { uuid } = barber;
    const data = this.firestoreSvc.getTurnsByUuid(
      uuid,
      'uuidBarber'
    ) as Observable<Turn[]>;
    const turnsList = data.subscribe(turns => {
      this.busyTurns = turns;
      const busyHours = this.getBusyHours(turns);
      this.hours = this.generateHours(barber, busyHours);
    });
    if (indexCurrentSuscription === -1) {
      this.suscriptions.push({ id: 'turnsList', suscription: turnsList });
    } else {
      this.suscriptions[indexCurrentSuscription] = {
        ...this.suscriptions[indexCurrentSuscription],
        suscription: turnsList,
      };
    }
  }

  changeDate() {
    const barber = this.barbers.find(
      b => b.uuid === this.scheduleForm.value.barber
    );
    if (barber === undefined) return;
    const busyHours = this.getBusyHours(this.busyTurns);
    this.hours = this.generateHours(barber, busyHours);
  }

  private getBusyHours(turns: Turn[]) {
    const selectedDate = this.scheduleForm.value.date;
    if (selectedDate === null || selectedDate === undefined) return [];
    const busyTurns = turns.filter(t => {
      const date = t.date.toDate();
      return (
        date.getDate() === selectedDate.getDate() &&
        date.getMonth() === selectedDate.getMonth() &&
        date.getFullYear() === selectedDate.getFullYear()
      );
    });
    if (busyTurns.length === 0) return [];
    return busyTurns.map(t => {
      const date = t.date.toDate();
      const busy =
        date.getHours().toString() +
        date.getMinutes().toString().padStart(2, '0');
      return Number(busy);
    });
  }

  private generateHours(barber: BarberInfo, busyHours: number[]) {
    let { firstTurn, lastTurn, steps, rest } = barber;
    let hours = [];
    // eslint-disable-next-line no-constant-condition
    while (true) {
      if (firstTurn >= lastTurn) {
        break;
      }
      if (Number(firstTurn.toString().slice(-2)) > 59) {
        firstTurn = hours[hours.length - 1].hour + steps + 40;
      }
      if (firstTurn >= rest[0] && firstTurn < rest[1]) {
        firstTurn = rest[1];
      }
      if (busyHours.includes(firstTurn)) {
        firstTurn += steps;
        if (Number(firstTurn.toString().slice(-2)) > 59) {
          firstTurn += 40;
        }
        continue;
      }
      hours.push({ hour: firstTurn, hourF: this.formatHour(firstTurn) });
      firstTurn += steps;
    }
    return hours;
  }

  private formatHour(value: number) {
    const hour = value.toString();
    const lengthHour = hour.length;
    if (lengthHour < 3) return value.toString();
    const firstDigitsOriginal = hour.slice(0, lengthHour - 2);
    const firstDigits =
      Number(firstDigitsOriginal) > 12
        ? (Number(firstDigitsOriginal) - 12).toString()
        : firstDigitsOriginal;
    const lastDigits = hour.slice(-2);
    return `${firstDigits}:${lastDigits} ${Number(firstDigitsOriginal) >= 12 ? 'PM' : 'AM'}`;
  }
}
