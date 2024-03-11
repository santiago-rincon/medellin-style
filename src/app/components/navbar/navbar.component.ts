import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { ToggleThemeService } from '@services/toggle-theme.service';
import { FireAuthService } from '@services/fire-auth.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MenubarModule, ButtonModule],
  providers: [ToggleThemeService],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit, OnDestroy {
  private theme = '';
  private suscription!: Subscription;
  private toastSvc = inject(ToastrService);
  private fireAuth = inject(FireAuthService);
  toggleIcon = 'pi pi-spin pi-spinner';
  toggleScv = inject(ToggleThemeService);
  items: MenuItem[] = [
    { label: 'Inicio', icon: 'pi pi-fw pi-home', routerLink: 'home' },
    { label: 'Agendar', icon: 'pi pi-fw pi-calendar', routerLink: 'schedule' },
    {
      label: 'Iniciar sesión',
      icon: 'pi pi-fw pi-sign-in',
      routerLink: 'sign',
      visible: false,
    },
    {
      label: 'Perfil',
      icon: 'pi pi-fw pi-user',
      routerLink: 'profile',
      visible: false,
    },
    {
      label: 'Cerrar sesión',
      icon: 'pi pi-fw pi-sign-out',
      command: async () => {
        try {
          await this.fireAuth.signOut();
          this.toastSvc.success('Sesión cerrada correctamente', 'Gracias');
        } catch (e) {
          this.toastSvc.error('No se ha podido cerrar la sesión', 'Error');
        }
      },
      visible: false,
    },
  ];
  activeItem = this.items[0];

  ngOnInit(): void {
    this.suscription = this.fireAuth.currentUser$.subscribe(user => {
      if (user !== null) {
        this.items = this.items.map((item, index) => {
          if (index === 0 || index === 1) return item;
          if (index === 2) return { ...item, visible: false };
          return { ...item, visible: true };
        });
      } else {
        this.items = this.items.map((item, index) => {
          if (index === 0 || index === 1) return item;
          if (index === 2) return { ...item, visible: true };
          return { ...item, visible: false };
        });
      }
    });
    const theme = localStorage.getItem('theme');
    if (theme !== null) {
      this.theme = theme;
      this.toggleIcon = theme === 'dark' ? 'pi pi-moon' : 'pi pi-sun';
      this.toggleScv.switchTheme(theme === 'dark');
      document.documentElement.classList.toggle('dark', theme === 'dark');
    } else {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.theme = isDark ? 'dark' : 'light';
      this.toggleIcon = isDark ? 'pi pi-moon' : 'pi pi-sun';
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      this.toggleScv.switchTheme(isDark);
      document.documentElement.classList.toggle('dark', isDark);
    }
  }

  ngOnDestroy(): void {
    this.suscription.unsubscribe();
  }

  onClick() {
    if (this.theme === 'dark') {
      localStorage.setItem('theme', 'light');
      this.toggleIcon = 'pi pi-sun';
      this.toggleScv.switchTheme(false);
      this.theme = 'light';
      document.documentElement.classList.toggle('dark', false);
    } else {
      localStorage.setItem('theme', 'dark');
      this.toggleIcon = 'pi pi-moon';
      this.toggleScv.switchTheme(true);
      this.theme = 'dark';
      document.documentElement.classList.toggle('dark', true);
    }
  }
}
