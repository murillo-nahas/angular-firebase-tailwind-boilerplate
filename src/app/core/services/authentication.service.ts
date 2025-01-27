import { Injectable } from '@angular/core';
import {
  Auth,
  User,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

interface UserLogin {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private auth: Auth, private firestore: AngularFirestore) {}

  async login({ email, password }: UserLogin): Promise<any> {
    try {
      const result = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );

      const user = result?.user;

      if (user) {
        return user;
      }

      return null;
    } catch (error) {
      console.error(error);
    }
  }

  async register(email: string, password: string, data: any): Promise<any> {
    try {
      const result = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );

      const uid = result.user?.uid;

      if (uid) {
        data.userUid = uid;

        await this.firestore.collection('users').doc(uid).set(data);

        return { success: true, uid: uid };
      }
    } catch (error) {
      console.error(error);
    }
  }

  async sendPasswordResetEmail(email: string): Promise<any> {
    try {
      const passwordReset = await sendPasswordResetEmail(this.auth, email);

      if (passwordReset !== null) {
        return passwordReset;
      }
    } catch (error) {
      console.error(error);
    }
  }

  async logout() {
    const signedOutUser = await signOut(this.auth);

    return signedOutUser;
  }

  isAuthenticatedUser(): Observable<User | null> {
    return new Observable((subscriber) => {
      const unsubscribe = onAuthStateChanged(
        this.auth,
        (user) => {
          subscriber.next(user);
          subscriber.complete();
        },
        (error) => {
          subscriber.error(error);
        }
      );

      return { unsubscribe };
    });
  }
}
