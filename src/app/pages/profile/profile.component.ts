import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { User } from '@angular/fire/auth';
import { TableComponent } from '@components/table/table.component';
import { FireAuthService } from '@services/fireauth.service';
import { FirestoreService } from '@services/firestore.service';
import { BarberInfo, Turn } from '@types';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subject, take } from 'rxjs';
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [TableComponent],
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit, OnDestroy {
  private readonly fireAuth = inject(FireAuthService);
  private readonly fireStore = inject(FirestoreService);
  private readonly LIMIT = 5;
  private readonly toastSvc = inject(ToastrService);
  private destroy$ = new Subject<void>();
  isBarber: boolean | undefined = undefined;
  showButton = false;
  loadingMore = false;
  user: User | null = null;
  turns: Turn[] | undefined = undefined;
  loading = false;
  ngOnInit() {
    this.loading = true;
    const user = this.fireAuth.getCurrentUser();
    this.user = user;
    if (user === null) {
      this.loading = false;
      return;
    }
    const barbers = this.fireStore.getBarbers() as Observable<BarberInfo[]>;
    barbers.pipe(take(1)).subscribe(barbers => {
      const isBarber = barbers.some(barber => barber.uuid === user.uid);
      this.isBarber = isBarber;
      let turns$ = this.fireStore
        .getTurnsByUuuidLimit({
          dataLimit: this.LIMIT,
          lastTurn: undefined,
          uuid: user.uid,
          uuidField: isBarber ? 'uuidBarber' : 'uuidClient',
        })
        .pipe(take(1));
      turns$.subscribe(t => {
        this.turns = t;
        this.showButton = t.length === this.LIMIT;
        this.loading = false;
      });
    });
  }

  loadMoreResults() {
    this.loadingMore = true;
    const turns$ = this.fireStore.getTurnsByUuuidLimit({
      dataLimit: this.LIMIT,
      lastTurn: this.turns?.at(-1),
      uuid: this.user?.uid!,
      uuidField: this.isBarber ? 'uuidBarber' : 'uuidClient',
    });
    turns$.pipe(take(1)).subscribe(t => {
      console.log(t);
      this.turns = [...this.turns!, ...t];
      this.showButton = t.length === this.LIMIT;
      this.loadingMore = false;
    });
  }

  async deleteDoc(id: string) {
    try {
      await this.fireStore.deleteTurn(id);
      this.turns = this.turns?.filter(turn => turn.id !== id);
      this.toastSvc.success(
        'El turno ha sido cancelado, recuerda informarle al cliente',
        'Turno cancelado'
      );
    } catch (error) {
      this.toastSvc.error(
        'Ha ocurrido un error al cancelar el turno, intentalo más tarde',
        'Error'
      );
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  //TODO cargar solo los turnos mayores a hoy
  //TODO agregar configuración del barbero
}
