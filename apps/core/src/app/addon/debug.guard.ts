import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot } from "@angular/router";
import { environment } from "../../environments/environment";

function loadScript(url: string) {
    return new Promise(function (resolve) {
      const head = document.getElementsByTagName('head')[0]
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.addEventListener('load', function () {
        resolve(script)
      }, { once: true });
      script.src = url
      head.appendChild(script)
    })
  }

@Injectable()
export class DebugGuard implements CanActivate {
  async canActivate(route: ActivatedRouteSnapshot) {
    if (route.queryParamMap.has('load') && !environment.production) {
      await loadScript(route.queryParamMap.get('load'));
    }
    return true;
  }
}