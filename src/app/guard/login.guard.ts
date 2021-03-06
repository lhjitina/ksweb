import { CanDeactivate, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { GlobalService } from "../global.service";
import { CookieService } from "ngx-cookie-service";
import { Injectable } from "@angular/core";

@Injectable()
export class LoginGuard implements CanActivate{
    constructor(private gs: GlobalService,
                private rt: Router){}
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean{
        return this.gs.isLogin();
    }

}

