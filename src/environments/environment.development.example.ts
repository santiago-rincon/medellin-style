import { Environments } from '@types';

export const environment: Environments = {
  production: false,
  localName: 'Medellín Style',
  direction: 'Calle 1 # 1 - 1',
  barbers: [
    {
      name: 'Will',
      phone: '300000000',
    },
  ],
  services: [
    { id: 0, service: 'Corte de cabello', price: 15000 },
    { id: 1, service: 'Corte de barba', price: 5000 },
    { id: 2, service: 'Arreglo de cejas', price: 5000 },
    { id: 3, service: 'Corte de cabello + barba', price: 16000 },
    { id: 4, service: 'Corte de cabello + cejas', price: 16000 },
    { id: 5, service: 'Corte de cabello + cejas + barba', price: 18000 },
  ],
  schedule: 'Lunes - Sabado 10:00 AM - 8:00 PM',
  ubication: 'https://maps.app.goo.gl/xxxxxxxxxxxx',
  firebase: {
    apiKey: '<YOUR_GoogleAPIKey_HERE>',
    authDomain: 'XXXXXXXXXXXXXXXXXXXXXXXXXXX',
    projectId: 'XXXXXXXXXXXXXXXXXXXXXXXXXXX',
    storageBucket: 'XXXXXXXXXXXXXXXXXXXXXXXXXXX',
    messagingSenderId: 'XXXXXXXXXXXXXXXXXXXXXXXXXXX',
    appId: 'XXXXXXXXXXXXXXXXXXXXXXXXXXX',
  },
};
