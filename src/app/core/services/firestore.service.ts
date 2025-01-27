import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  docData,
  orderBy,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  constructor(private firestore: Firestore, private af: AngularFirestore) {}

  async checkIfFieldExists(
    docRef: string,
    field: string,
    value: string
  ): Promise<boolean> {
    try {
      const docReference = this.af.collection(docRef, (ref) =>
        ref.where(field, '==', value)
      );

      const querySnapshot = await docReference.get().toPromise();

      return !querySnapshot!.empty;
    } catch (error) {
      return false;
    }
  }

  getDocWithFilter(
    collectionRef: string,
    object: string,
    value: any
  ): Observable<any[]> {
    return this.af
      .collection(collectionRef, (ref) => ref.where(object, '==', value))
      .valueChanges();
  }

  addDoc(data: any, collect: string) {
    const docRef = collection(this.firestore, collect);
    return addDoc(docRef, data);
  }

  updateDoc(collection: string, id: string, data: any) {
    const docReference = doc(this.firestore, `${collection}/${id}`);
    return updateDoc(docReference, data);
  }

  getDocById(collection: string, id: string): Observable<any> {
    const docReference = doc(this.firestore, `${collection}/${id}`);
    return docData(docReference, { idField: 'id' }) as Observable<any>;
  }

  getCollection(docRef: string): Observable<any[]> {
    const docReference = collection(this.firestore, docRef);
    return collectionData(docReference, { idField: 'id' }) as Observable<any[]>;
  }

  getCollectionWithOrderBy(
    docRef: string,
    orderField: string,
    orderDirection: 'asc' | 'desc'
  ): Observable<any[]> {
    const docReference = collection(this.firestore, docRef);
    const orderedQuery = query(
      docReference,
      orderBy(orderField, orderDirection)
    );
    return collectionData(orderedQuery, { idField: 'id' }) as Observable<any[]>;
  }

  getCollectionWithRoleCondition(
    docRef: string,
    field: string,
    condition: string
  ): Observable<any[]> {
    const usersCollection = collection(this.firestore, docRef);
    const q = query(usersCollection, where(field, 'in', condition));
    return collectionData(q, { idField: 'id' }) as Observable<any[]>;
  }

  deleteDoc(collection: string, id: string) {
    const docRef = doc(this.firestore, `${collection}/${id}`);
    return deleteDoc(docRef);
  }
}
