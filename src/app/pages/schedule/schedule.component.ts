import { calendarConfig, fields, voidTurn } from './config';
import { CalendarModule } from 'primeng/calendar';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
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
import { BarberInfo, HandleSuscription, Turn } from '@types';
import { FirestoreService } from '@services/firestore.service';
import { Observable, Subject, debounceTime, take } from 'rxjs';
import { FireAuthService } from '@services/fireauth.service';
import {
  getBusyHours,
  generateHours,
  buildDate,
} from '@utils/hourManipulation';
import { Timestamp } from '@angular/fire/firestore';
import { DialogModule } from 'primeng/dialog';
import { User } from '@angular/fire/auth';
import localeEs from '@angular/common/locales/es-CO';
import { registerLocaleData } from '@angular/common';
import { LOCALE_ID } from '@angular/core';
registerLocaleData(localeEs, 'es-CO');
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
    DialogModule,
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'es-CO' }],
  templateUrl: './schedule.component.html',
})
export class ScheduleComponent implements OnInit, OnDestroy {
  private readonly config = inject(PrimeNGConfig);
  private readonly toastScv = inject(ToastrService);
  private readonly firestoreSvc = inject(FirestoreService);
  private readonly fireAuth = inject(FireAuthService);
  private readonly millisecondsPerDay = environment.millisecondsPerDay;
  private readonly schedule = environment.schedule;
  private dateSubject$ = new Subject<null>();
  private clientUuid: string | null = null;
  private suscriptions: HandleSuscription[] = [];
  barbers: BarberInfo[] = [];
  currentUser: User | null = null;
  loading = false;
  modalVisible = false;
  turn: Turn = voidTurn;
  disabledDates = [0];
  hours: { hour: number; hourF: string }[] = [];
  minDate = new Date();
  maxDate = new Date(this.minDate.getTime() + this.millisecondsPerDay[6]);
  services = environment.services;
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
    date: new FormControl<Date | null>(null, {
      validators: [Validators.required],
    }),
    hour: new FormControl<number | null>(null, {
      validators: [Validators.required],
    }),
  });

  ngOnInit() {
    this.config.setTranslation(calendarConfig);
    const today = new Date();
    const isDisabledDay = this.disabledDates.includes(today.getDay());
    this.scheduleForm.controls.date.setValue(
      isDisabledDay ? new Date(today.getTime() + 8.64e7) : today
    );
    const barbers$ = this.firestoreSvc.getBarbers() as Observable<BarberInfo[]>;
    barbers$.pipe(take(1)).subscribe(barbers => {
      if (barbers.length === 0) {
        this.toastScv.error(
          'No se ha podido leer la base de datos, intentalo más tarde',
          'Error'
        );
        return;
      }
      this.barbers = barbers;
    });
    this.fireAuth.currentUser$.pipe(take(1)).subscribe(user => {
      this.currentUser = user;
      if (user !== null) {
        this.scheduleForm.controls.client.setValue(user.displayName);
        this.scheduleForm.controls.phone.setValue(user.phoneNumber);
        this.clientUuid = user.uid;
      } else {
        this.toastScv.info(
          'Podrás agendar citas, pero no cancelarlas desde la web.',
          'No has iniciado sesión'
        );
      }
    });
    const changeDate = this.dateSubject$
      .pipe(debounceTime(500))
      .subscribe(() => {
        this.getDataFirestore();
      });
    this.suscriptions.push({ id: 'changeDate', suscription: changeDate });
  }

  async onSubmit() {
    this.loading = true;
    const values = Object.entries(this.scheduleForm.value);
    for (const i of values) {
      if (i[1] === null || i[1] === '' || i[1] === undefined) {
        this.toastScv.error(
          `El campo ${fields[i[0] as keyof typeof fields]} es requerido`,
          'Error'
        );
        this.loading = false;
        return;
      }
    }
    if (!this.validationsSubmit()) {
      this.loading = false;
      return;
    }
    const { barber, client, date, hour, phone, service } =
      this.scheduleForm.value;
    const selectedBarber = this.barbers.find(b => b.uuid === barber);
    const dateTimestamp = buildDate(date as Date, hour as number);
    if (dateTimestamp.getTime() < new Date().getTime()) {
      this.toastScv.error(
        'No puedes agendar a esta hora, ya sucedio, es tarde.',
        'Error'
      );
      this.loading = false;
      return;
    }
    if (selectedBarber === undefined) return;
    const newTurn: Turn = {
      barberName: selectedBarber.name,
      barberPhone: selectedBarber.phone,
      clientName: client as string,
      clientPhone: phone?.replaceAll('-', '') as string,
      date: Timestamp.fromDate(dateTimestamp),
      service: this.services[service as number].service,
      uuidBarber: selectedBarber.uuid,
      uuidClient: this.clientUuid !== null ? this.clientUuid : '',
    };
    this.turn = newTurn;
    try {
      await this.firestoreSvc.addTurn(newTurn);
      const indexCurrentSuscription = this.suscriptions.findIndex(
        s => s.id === 'turnsList'
      );
      if (indexCurrentSuscription !== -1) {
        this.suscriptions[indexCurrentSuscription].suscription?.unsubscribe();
      }
      this.modalVisible = true;
      this.scheduleForm.controls.barber.setValue(null);
      this.scheduleForm.controls.service.setValue(null);
      this.hours = [];
    } catch (error) {
      this.toastScv.error(
        'No se ha podido guardar el turno, intentalo más tarde',
        'Error'
      );
      return;
    } finally {
      this.loading = false;
    }
  }

  changeBarber() {
    this.getDataFirestore();
  }

  changeDate() {
    this.dateSubject$.next(null);
  }

  private getDataFirestore() {
    const indexCurrentSuscription = this.suscriptions.findIndex(
      s => s.id === 'turnsList'
    );
    if (indexCurrentSuscription !== -1) {
      this.suscriptions[indexCurrentSuscription].suscription?.unsubscribe();
    }
    if (!this.isValidDate()) return;
    const barber = this.barbers.find(
      b => b.uuid === this.scheduleForm.value.barber
    );
    if (barber === undefined) {
      this.hours = [];
      return;
    }
    const { uuid } = barber;
    const fireDate = this.firestoreSvc.getTurnsByUuid(
      uuid,
      'uuidBarber',
      Timestamp.fromDate(this.scheduleForm.value.date as Date)
    ) as Observable<Turn[]>;
    const turnsList = fireDate.subscribe(turns => {
      const busyHours = getBusyHours(turns, this.scheduleForm.value.date);
      this.hours = generateHours(barber, busyHours);
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

  private validationsSubmit() {
    const { barber, date, hour, service } = this.scheduleForm.value;
    if (this.barbers.find(b => b.uuid === barber) === undefined) {
      this.toastScv.error(
        'El barbero seleccionado no se encuentra en la base de datos',
        'Error'
      );
      return false;
    }
    if (this.services.find(s => s.id === service) === undefined) {
      this.toastScv.error(
        'El servicio seleccionado no se encuentra disponible',
        'Error'
      );
      return false;
    }
    const regex = /3\d{9}/;
    const phone = this.scheduleForm.value.phone?.replaceAll('-', '');
    if (phone === undefined || !regex.test(phone)) {
      this.toastScv.error('El teléfono no es válido', 'Error');
      return false;
    }

    if (date?.getDay() === 0) {
      this.toastScv.error(
        'El día domingo no hay servicio, selecciona otro día',
        'Error'
      );
      return false;
    }
    const minDateTimestamp = this.minDate.setHours(0, 0, 0, 0);
    const maxDateTimestamp = this.maxDate.setHours(23, 59, 59, 0);
    if (
      date!.getTime() < minDateTimestamp ||
      date!.getTime() > maxDateTimestamp
    ) {
      this.toastScv.error(
        'No puedes pedir turnos en la fecha seleccionada',
        'Error'
      );
      return false;
    }
    if (hour! < this.schedule[1] || hour! > this.schedule[2]) {
      this.toastScv.error(
        'No puedes pedir turnos fuera del horario de atención',
        'Error'
      );
      return false;
    }
    return true;
  }

  private isValidDate() {
    if (
      this.scheduleForm.value.date === null ||
      this.scheduleForm.value.date === undefined
    ) {
      this.hours = [];
      return false;
    }
    if (this.disabledDates.includes(this.scheduleForm.value.date.getDay())) {
      this.hours = [];
      return false;
    }
    return true;
  }

  ngOnDestroy() {
    this.suscriptions.forEach(s => s.suscription?.unsubscribe());
  }
}
