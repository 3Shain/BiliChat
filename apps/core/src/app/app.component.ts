import { Component } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { debounceTime, filter, map, publishBehavior, refCount, tap } from 'rxjs/operators';

@Component({
  selector: 'comen-root',
  templateUrl: './app.component.html',
  styleUrls: [
    './app.component.scss'
  ]
})
export class AppComponent {
  constructor(private router: Router) { }

  routeState$ = this.router.events.pipe(
    filter(x => x instanceof NavigationStart || x instanceof NavigationEnd),
    map((event) => {
      if (event instanceof NavigationStart) {
        return 'loading';
      } else if (event instanceof NavigationEnd) {
        return 'ready';
      }
    }),
    debounceTime(0),
    publishBehavior('ready'),
    refCount()
  );
}
