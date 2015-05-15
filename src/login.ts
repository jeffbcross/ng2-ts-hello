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
import {LocalVariable} from './components/assign-local-directive/assign-local-directive';
import {AuthService} from './components/auth-service/auth-service';

@Component({
  selector: 'gh-login',
  injectables: [AuthService]
})
@View({
  template: `
    <div>
      <span *assign-local="#unwrapped to auth | async">
        <paper-button raised (click)="authService.login()" *ng-if="!unwrapped">Login</paper-button>
        <span *ng-if="unwrapped">
          Welcome, {{unwrapped.github.displayName}}!
          <img [src]="unwrapped.github.cachedUserProfile.avatar_url" width="50" height="50">
          <paper-button raised (click)="authService.logout()">Logout</paper-button>
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
  authService: AuthService;
  constructor(authService:AuthService) {
    this.authService = authService;
    this.auth = authService.authObservable;
  }
}
