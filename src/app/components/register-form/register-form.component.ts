import { Component, inject } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FireAuthService } from '@services/fireauth.service';
import { ToastrService } from 'ngx-toastr';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [InputGroupModule, InputGroupAddonModule, ReactiveFormsModule],
  templateUrl: './register-form.component.html',
})
export class RegisterFormComponent {
  private toastSvc = inject(ToastrService);
  private fireAuth = inject(FireAuthService);
  loading = false;
  registerForm = new FormGroup({
    name: new FormControl<string | null>(null, {
      validators: [Validators.required],
    }),
    email: new FormControl<string | null>(null, {
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl<string | null>(null, {
      validators: [Validators.required, Validators.minLength(8)],
    }),
  });

  async register() {
    this.loading = true;
    let { email, name, password } = this.registerForm.value;
    if (!this.fireAuth.datavalidation(email, password, name)) {
      this.loading = false;
      return;
    }
    if (
      typeof email !== 'string' ||
      typeof name !== 'string' ||
      typeof password !== 'string'
    )
      return;
    try {
      const { user } = await this.fireAuth.registerWithEmailAndPassword(
        email,
        password
      );
      if (user.displayName === null) {
        await this.fireAuth.updateUser(user, { name });
      }
      this.toastSvc.success(
        'El usuario ha sido registrado correctamente, inicia sesión',
        'Registro completo'
      );
      this.registerForm.reset();
    } catch (error) {
      if (error instanceof FirebaseError) {
        const message = this.fireAuth.checkErrorMessage(error.code, email);
        this.toastSvc.error(message, 'Error');
      } else {
        this.toastSvc.error(
          'Ha ocurrido un error inesperado, inténtalo más tarde',
          'Error'
        );
      }
    } finally {
      this.loading = false;
    }
  }
}
