/// <reference path="../typings/angular2/angular2.d.ts" />
/// <reference path="../typings/firebase/firebase.d.ts" />

import {
  Component,
  Directive,
  View,
  EventEmitter,
  NgIf,
  ViewContainerRef,
  ProtoViewRef
} from "angular2/angular2";

@Directive({selector: '[assign-local]', properties: {'localVariable': 'assignLocalTo'}})
class LocalVariable {
  viewContainer: ViewContainerRef;
  protoViewRef: ProtoViewRef;
  view: any;
  constructor(viewContainer: ViewContainerRef, protoViewRef: ProtoViewRef) {
    this.viewContainer = viewContainer;
    this.protoViewRef = protoViewRef;
  }

  set localVariable(exp) {
    if (!this.viewContainer.length) {
      this.view = this.viewContainer.create(this.protoViewRef);
    }

    this.view.setLocal("$implicit", exp);
  }
}

@Component({selector: 'gh-login'})
@View({
  template: `
    <div>
      <span *assign-local="#unwrapped to auth | async">
        <button (click)="login()" *ng-if="!unwrapped">Login</button>
        <span *ng-if="unwrapped">
          Welcome, {{unwrapped.github.displayName}}!
          <img [src]="unwrapped.github.cachedUserProfile.avatar_url" width="50" height="50">
          <button (click)="logout()">Logout</button>
        </span>
      </span>
    </div>
    `,
  directives: [NgIf, LocalVariable]
})
export class LoginComponent {
  auth: EventEmitter;
  ref: Firebase;
  fullAuth: FirebaseAuthResult;
  constructor() {
    this.ref = new Firebase('https://ng2-projects.firebaseio.com');
    var authResult = this.ref.getAuth();
    this.auth = new EventEmitter();
    setTimeout(() => { this.auth.next(authResult); });
  }

  login() {
    this.ref.authWithOAuthPopup('github', (e) => {
      if (!e) {
        this.auth.next(this.ref.getAuth());
      } else {
        this.auth.throw(e);
      }
    });
  }

  logout() {
    this.ref.unauth();
    this.auth.next(null);
  }
}
