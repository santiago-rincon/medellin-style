import { Component, Input } from '@angular/core';
import { User } from '@angular/fire/auth';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BarberInfo } from '@types';
import { DividerModule } from 'primeng/divider';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputMaskModule } from 'primeng/inputmask';
import { formatHour } from '@utils/hourManipulation';

@Component({
  selector: 'app-profile-preferents',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputGroupAddonModule,
    InputGroupModule,
    InputMaskModule,
    DividerModule,
  ],
  templateUrl: './profile-preferents.component.html',
})
export class ProfilePreferentsComponent {
  @Input({ required: true }) isBarber = false;
  @Input({ required: true }) barber: BarberInfo | undefined = undefined;
  @Input({ required: true }) user: User | null = null;
  updatePreferentsForm = new FormGroup({
    name: new FormControl<string | null>(this.user?.displayName ?? null, {
      validators: [Validators.required],
    }),
    phone: new FormControl<string | null>(this.user?.phoneNumber ?? null, {
      validators: [Validators.required],
    }),
    hourStart: new FormControl<string | null>(
      formatHour(this.barber?.firstTurn ?? 1200) ?? null,
      {
        validators: [Validators.required],
      }
    ),
    hourEnd: new FormControl<string | null>(
      formatHour(this.barber?.lastTurn ?? 1300),
      {
        validators: [Validators.required],
      }
    ),
  });

  onSubmit() {}
}
