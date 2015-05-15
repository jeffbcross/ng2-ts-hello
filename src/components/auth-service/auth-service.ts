/// <reference path="../../../typings/rx/rx.lite.d.ts" />
/// <reference path="../../../typings/firebase/firebase.d.ts" />
declare var Rx;
import {FIREBASE_PATH} from '../../config';

export class AuthService {
  authObservable: Rx.Observable<FirebaseAuthResult>;
  constructor() {
    var firebaseRef = new Firebase(FIREBASE_PATH);
    var authResult = firebaseRef.getAuth();
    this.authObservable = Rx.Observable.create((observer: Rx.Observer<FirebaseAuthResult>) => {
      firebaseRef.onAuth(onAuth);
      function onAuth(result: FirebaseAuthResult) { observer.onNext(result); }
      return function() { firebaseRef.offAuth(onAuth); }
    });
  }
}