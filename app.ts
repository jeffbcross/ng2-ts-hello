import {Component, bootstrap, View} from "node_modules/angular/modules/angular2/angular2";
// import {Http, httpInjectables} from "node_modules/angular/modules/angular2/http";

@Component({
    selector: 'my-app'
})
@View({
    template: '<h1>Hello {{ people | json }}</h1>'
})
class MyAppComponent {
    
    people: Object;

    constructor(/*http:Http*/) {
        // http.request('people.json').subscribe(res => this.people = res.json());
    }
}

bootstrap(MyAppComponent);
