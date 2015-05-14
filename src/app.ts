/// <reference path="typings/angular2/angular2.d.ts" />

import {Component, bootstrap, View} from "angular2/angular2";
import {LoginComponent} from "./login";

@Component({
    selector: 'my-app'
})
@View({
    template: '<div><h1>Hello {{ name }}</h1></div><gh-login></gh-login>',
    directives: [LoginComponent]
})
class MyAppComponent {
    name: string;

    constructor() {
        this.name = 'Alice';
    }
}

bootstrap(MyAppComponent);
