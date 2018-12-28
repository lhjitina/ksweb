import { CanDeactivate, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { GlobalService } from "../global.service";
import { CookieService } from "ngx-cookie-service";
import { Injectable } from "@angular/core";

@Injectable()
export class LoginGuard implements CanActivate{
    constructor(private cookie: CookieService,
                private rt: Router){}
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean{
        console.log(this.cookie.get("isLogin"));
        if (this.cookie.get("isLogin") == "true"){
            return true;
        }
        else{
            this.rt.navigateByUrl("login");
            return false;
        }
    }

}

