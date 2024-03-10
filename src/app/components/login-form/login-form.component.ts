import { Component, inject } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { FireAuthService } from '@services/fire-auth.service';
import { FirebaseError } from '@angular/fire/app';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroupModule } from 'primeng/inputgroup';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DialogModule } from 'primeng/dialog';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [
    DividerModule,
    InputGroupAddonModule,
    InputGroupModule,
    ReactiveFormsModule,
    DialogModule,
  ],
  templateUrl: './login-form.component.html',
})
export class LoginFormComponent {
  private fireAuth = inject(FireAuthService);
  private toastSvc = inject(ToastrService);
  private router = inject(Router);
  loadingGoogle = false;
  loading = false;
  loadingReset = false;
  modalVisible = false;
  loginForm = new FormGroup({
    email: new FormControl<string | null>(null, {
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl<string | null>(null, {
      validators: [Validators.required, Validators.minLength(8)],
    }),
  });

  resetForm = new FormGroup({
    emailReset: new FormControl<string | null>(null, {
      validators: [Validators.required, Validators.email],
    }),
  });

  async resetPassword() {
    this.loadingReset = true;
    let { emailReset } = this.resetForm.value;
    if (!this.fireAuth.datavalidation(emailReset)) {
      this.loadingReset = false;
      return;
    }
    if (typeof emailReset !== 'string') return;
    try {
      await this.fireAuth.resetPassword(emailReset);
      this.toastSvc.success(
        'Se ha enviadoun link para restablecer tu contraseña, revisa el spam',
        'Revisa tu correo'
      );
      this.loginForm.reset();
      this.modalVisible = false;
    } catch (error) {
      if (error instanceof FirebaseError) {
        console.log(error.code);
        const message = this.fireAuth.checkErrorMessage(error.code);
        this.toastSvc.error(message, 'Error');
      } else {
        this.toastSvc.error(
          'Ha ocurrido un error inesperado, inténtalo más tarde',
          'Error'
        );
      }
    } finally {
      this.loadingReset = false;
    }
  }

  async signEmailAndPassword() {
    this.loading = true;
    let { email, password } = this.loginForm.value;
    if (!this.fireAuth.datavalidation(email, password)) {
      this.loading = false;
      return;
    }
    if (typeof email !== 'string' || typeof password !== 'string') return;
    try {
      const { user } = await this.fireAuth.loginWithEmailAndPassword(
        email,
        password
      );
      this.toastSvc.success(
        `${user.displayName?.split(' ')[0]}, has iniciado sesión correctamente`,
        'Bienvenido'
      );
      this.router.navigate(['/home']);
      this.loginForm.reset();
    } catch (error) {
      if (error instanceof FirebaseError) {
        console.log(error.code);
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

  async signGoogle() {
    try {
      this.loadingGoogle = true;
      const { user } = await this.fireAuth.loginWithGoogle();
      this.toastSvc.success(
        `${user.displayName?.split(' ')[0]}, has iniciado sesión correctamente`,
        'Bienvenido'
      );
      this.router.navigate(['/home']);
    } catch (error) {
      if (error instanceof FirebaseError) {
        const message = this.fireAuth.checkErrorMessage(error.code);
        this.toastSvc.error(message, 'Error');
      } else {
        this.toastSvc.error(
          'Ha ocurrido un error inesperado, inténtalo más tarde',
          'Error'
        );
      }
    } finally {
      this.loadingGoogle = false;
    }
  }
}
