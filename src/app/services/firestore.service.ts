import { inject } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  collectionData,
  addDoc,
  query,
  where,
  limit,
  orderBy,
  startAfter,
  deleteDoc,
  Timestamp,
} from '@angular/fire/firestore';
import { Turn } from '@types';
import { Observable } from 'rxjs';
interface Params {
  uuid: string;
  uuidField: 'uuidBarber' | 'uuidClient';
  dataLimit: number;
  lastTurn: Turn | undefined;
}
export class FirestoreService {
  private firestore = inject(Firestore);

  getBarbers() {
    const collectionRef = collection(this.firestore, 'barbers');
    return collectionData(collectionRef);
  }

  getTurnsByUuid(
    uuid: string,
    uuidField: 'uuidBarber' | 'uuidClient',
    date: Timestamp
  ) {
    const objDate = date.toDate();
    const nextDay = new Date(
      objDate.getFullYear(),
      objDate.getMonth(),
      objDate.getDate() + 1
    );
    const collectionRef = collection(this.firestore, 'turns');
    const data = query(
      collectionRef,
      where(uuidField, '==', uuid),
      where('date', '>=', date),
      where('date', '<', nextDay)
    );
    return collectionData(data);
  }

  getTurnsByUuuidLimit({ uuid, uuidField, dataLimit, lastTurn }: Params) {
    const collectionRef = collection(this.firestore, 'turns');
    const date = Timestamp.fromDate(new Date());
    let data;
    if (lastTurn === undefined) {
      data = query(
        collectionRef,
        orderBy('date'),
        where(uuidField, '==', uuid),
        where('date', '>=', date),
        limit(dataLimit)
      );
    } else {
      data = query(
        collectionRef,
        orderBy('date'),
        where(uuidField, '==', uuid),
        where('date', '>=', date),
        startAfter(lastTurn.date),
        limit(dataLimit)
      );
    }
    return collectionData(data, { idField: 'id' }) as Observable<Turn[]>;
  }

  addTurn(turn: Turn) {
    const collectionRef = collection(this.firestore, 'turns');
    return addDoc(collectionRef, <Turn>turn);
  }

  deleteTurn(id: string) {
    const docRef = doc(this.firestore, 'turns', id);
    return deleteDoc(docRef);
  }
}
