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

export const allHours = [
  { hour: '9:00AM', hourF: 900 },
  { hour: '9:30AM', hourF: 930 },
  { hour: '10:00AM', hourF: 1000 },
  { hour: '10:30AM', hourF: 1030 },
  { hour: '11:00AM', hourF: 1100 },
  { hour: '11:30AM', hourF: 1130 },
  { hour: '12:00PM', hourF: 1200 },
  { hour: '12:30PM', hourF: 1230 },
  { hour: '1:00PM', hourF: 1300 },
  { hour: '1:30PM', hourF: 1330 },
  { hour: '2:00PM', hourF: 1400 },
  { hour: '2:30PM', hourF: 1430 },
  { hour: '3:00PM', hourF: 1500 },
  { hour: '3:30PM', hourF: 1530 },
  { hour: '4:00PM', hourF: 1600 },
  { hour: '4:30PM', hourF: 1630 },
  { hour: '5:00PM', hourF: 1700 },
  { hour: '5:30PM', hourF: 1730 },
  { hour: '6:00PM', hourF: 1800 },
  { hour: '6:30PM', hourF: 1830 },
  { hour: '7:00PM', hourF: 1900 },
  { hour: '7:30PM', hourF: 1930 },
  { hour: '8:00PM', hourF: 2000 },
];

export const fields = {
  barber: 'barbero',
  service: 'servicios',
  client: 'nombre',
  phone: 'teléfono',
  date: 'fecha',
  hour: 'hora',
};
