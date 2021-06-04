
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';

@Injectable()
export class CompatibleRoutes implements CanActivate {
  constructor(private router: Router) { }
  async canActivate(route: ActivatedRouteSnapshot): Promise<UrlTree> {
    switch (route.url[0].path) {
      case 'gkd':
      case 'alpha':
        return this.router.createUrlTree(['/', 'overlay'], {
          queryParams: {
            ...route.queryParams,
            p: 'bilibili',
            bilichat: '',
            id: +route.params.id,
            o: 'gamma'
          }
        });
      case 'bilibili':
        return this.router.createUrlTree(['/', 'overlay'], {
          queryParams: {
            ...route.queryParams,
            p: 'bilibili',
            id: +route.params.id,
            o: 'gamma'
          }
        });
      case 'acfun':
        return this.router.createUrlTree(['/', 'overlay'], {
          queryParams: {
            ...route.queryParams,
            p: 'acfun',
            id: +route.params.id,
            o: 'gamma'
          }
        });
    }
    throw new Error('NOT EXPECTED ROUTE');
  }

}
