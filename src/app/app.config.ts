import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { environment } from 'src/environments/environment.development';
import { FireAuthService } from '@services/fire-auth.service';
import { provideToastr } from 'ngx-toastr';
import { FirestoreService } from '@services/firestore.service';
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideToastr({ preventDuplicates: true }),
    importProvidersFrom(
      provideFirebaseApp(() => initializeApp(environment.firebase))
    ),
    importProvidersFrom(provideAuth(() => getAuth())),
    importProvidersFrom(provideFirestore(() => getFirestore())),
    FireAuthService,
    FirestoreService,
  ],
};
