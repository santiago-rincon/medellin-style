import { inject } from '@angular/core';
import {
  Auth,
  User,
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  user,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from '@angular/fire/auth';
import { ToastrService } from 'ngx-toastr';

export class FireAuthService {
  private readonly auth: Auth = inject(Auth);
  private readonly toastSvc = inject(ToastrService);
  currentUser$ = user(this.auth);
  constructor() {
    console.log('Init service');
  }
  registerWithEmailAndPassword(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  loginWithGoogle() {
    return signInWithPopup(this.auth, new GoogleAuthProvider());
  }

  loginWithEmailAndPassword(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  resetPassword(email: string) {
    return sendPasswordResetEmail(this.auth, email);
  }

  signOut() {
    return this.auth.signOut();
  }

  updateUser(user: User, { name }: { name: string }) {
    return updateProfile(user, { displayName: name });
  }

  getCurrentUser() {
    return this.auth.currentUser;
  }

  datavalidation(
    email: string | null | undefined,
    password?: string | null | undefined,
    name?: string | null | undefined
  ) {
    if (name !== undefined && (name === null || name === '')) {
      this.toastSvc.error('El campo de nombre no puede estar vacío', 'Error');
      return false;
    }
    if (email === null || email === undefined || email === '') {
      this.toastSvc.error(
        'El campo de correo electrónico no puede estar vacío',
        'Error'
      );
      return false;
    }
    if (password !== undefined && (password === null || password === '')) {
      this.toastSvc.error(
        'El campo de contraseña no puede estar vacío',
        'Error'
      );
      return false;
    }
    const regex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (email.match(regex) === null) {
      this.toastSvc.error('El correo electrónico no es válido', 'Error');
      return false;
    }
    if (password !== undefined && password.length < 8) {
      this.toastSvc.error(
        'La contraseña debe tener al menos 8 carácteres',
        'Error'
      );
      return false;
    }
    return true;
  }

  checkErrorMessage(code: string, email?: string) {
    switch (code) {
      case 'auth/email-already-in-use':
        return `El correo "${email}" ya ha sido registrado`;
      case 'auth/invalid-email':
        return `El correo "${email}" no es válido`;
      case 'auth/weak-password':
        return 'La contraseña debe tener al menos 8 carácteres';
      case 'auth/popup-closed-by-user':
        return 'Se ha cerrado la ventana emergente';
      case 'auth/invalid-credential':
        return 'Correo o contraseña incorrecta';
      default:
        return 'Ha ocurrido un error inesperado, inténtalo más tarde';
    }
  }
}
