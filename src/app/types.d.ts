export interface ServiceBentoItem {
  title: string;
  description: string;
  colSpanDesktop: colSpanDesktop;
  colSpanMobile: colSpanMobile;
  image: string;
  class?: string;
}

export interface BarberInfo {
  name: string;
  phone: string;
}

export interface BarberService {
  id: number;
  service: string;
  price: number;
}

export interface Environments {
  production: boolean;
  localName: string;
  direction: string;
  barbers: BarberInfo[];
  services: BarberService[];
  schedule: string;
  ubication: string;
  firebase: {
    projectId: string;
    appId: string;
    storageBucket: string;
    apiKey: string;
    authDomain: string;
    messagingSenderId: string;
  };
}

type colSpanMobile =
  | 'col-span-1'
  | 'col-span-2'
  | 'col-span-3'
  | 'col-span-4'
  | 'col-span-5'
  | 'col-span-6'
  | 'col-span-7'
  | 'col-span-8'
  | 'col-span-9'
  | 'col-span-10'
  | 'col-span-11'
  | 'col-span-12';

type colSpanDesktop =
  | 'md:col-span-1'
  | 'md:col-span-2'
  | 'md:col-span-3'
  | 'md:col-span-4'
  | 'md:col-span-5'
  | 'md:col-span-6'
  | 'md:col-span-7'
  | 'md:col-span-8'
  | 'md:col-span-9'
  | 'md:col-span-10'
  | 'lg:col-span-1'
  | 'lg:col-span-2'
  | 'lg:col-span-3'
  | 'lg:col-span-4'
  | 'lg:col-span-5'
  | 'lg:col-span-6'
  | 'lg:col-span-7'
  | 'lg:col-span-8'
  | 'lg:col-span-9'
  | 'lg:col-span-10';
