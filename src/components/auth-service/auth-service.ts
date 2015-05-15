/// <reference path="../../../typings/rx/rx.all.d.ts" />
/// <reference path="../../../typings/firebase/firebase.d.ts" />
declare var Rx;
import {FIREBASE_PATH} from '../../config';
import {EventEmitter} from "angular2/angular2";

export class AuthService {
  firebaseRef: Firebase;
  authObservable: EventEmitter;
  constructor() {
    this.firebaseRef = new Firebase(FIREBASE_PATH);
    this.authObservable = new EventEmitter();
    // TODO: don't use EventEmitter, just create a pipe
    this.authObservable._subject = new Rx.ReplaySubject();
    this.firebaseRef.onAuth(
        (result: FirebaseAuthResult) => { this.authObservable._subject.onNext(result); });
  }

  login(): void {
    this.firebaseRef.authWithOAuthPopup('github', e => {
      if (e) return this.authObservable._subject.onError(e);
      this.authObservable._subject.onNext(this.firebaseRef.getAuth());
    });
  }

  logout(): void {
    this.firebaseRef.unauth();
    this.authObservable._subject.onNext(null);
  }
}