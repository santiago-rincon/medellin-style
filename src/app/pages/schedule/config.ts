import { Timestamp } from '@angular/fire/firestore';
import { Translation } from 'primeng/api';

export const calendarConfig: Translation = {
  today: 'Hoy',
  clear: 'Limpiar',
  monthNames: [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ],
  dayNames: [
    'Domingo',
    'Lunes',
    'Martes',
    'Miercoles',
    'Jueves',
    'Viernes',
    'Sabado',
  ],
  monthNamesShort: [
    'Ene',
    'Feb',
    'Mar',
    'Abr',
    'May',
    'Jun',
    'Jul',
    'Ago',
    'Sep',
    'Oct',
    'Nov',
    'Dic',
  ],
  dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
  firstDayOfWeek: 1,
  dayNamesMin: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
};

export const fields = {
  barber: 'barbero',
  service: 'servicios',
  client: 'nombre',
  phone: 'teléfono',
  date: 'fecha',
  hour: 'hora',
};

export const voidTurn = {
  barberName: '',
  barberPhone: '',
  clientName: '',
  clientPhone: '',
  date: Timestamp.fromDate(new Date()),
  service: '',
  uuidBarber: '',
  uuidClient: '',
};
