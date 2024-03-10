import { inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  query,
  where,
} from '@angular/fire/firestore';
import { Turn } from '@types';

export class FirestoreService {
  private firestore = inject(Firestore);

  getBarbers() {
    const collectionRef = collection(this.firestore, 'barbers');
    return collectionData(collectionRef);
  }

  getTurnsByUuid(uuid: string, uuidField: 'uuidBarber' | 'uuidClient') {
    const collectionRef = collection(this.firestore, 'turns');
    const data = query(collectionRef, where(uuidField, '==', uuid));
    return collectionData(data);
  }

  addTurn(turn: Turn) {
    const collectionRef = collection(this.firestore, 'turns');
    return addDoc(collectionRef, <Turn>turn);
  }
}
