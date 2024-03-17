import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { LoginFormComponent } from '@components/login-form/login-form.component';
import { RegisterFormComponent } from '@components/register-form/register-form.component';
import { ToastModule } from 'primeng/toast';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-sign',
  standalone: true,
  imports: [LoginFormComponent, RegisterFormComponent, NgClass, ToastModule],
  templateUrl: './sign.component.html',
})
export class SignComponent {
  localName = environment.localName;
}
