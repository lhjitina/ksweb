import {HttpInterceptor, HttpEvent, HttpRequest, HttpHandler, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { catchError, mergeMap, filter, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { GlobalService } from './global.service';
import { EventHandlerVars } from '@angular/compiler/src/compiler_util/expression_converter';
import { routerNgProbeToken } from '@angular/router/src/router_module';

@Injectable()
export class KsInterceptor implements HttpInterceptor {
    constructor(private router: Router,
        private gs: GlobalService){}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{ 
        const authToken = this.gs.getToken();
        console.log("authtoken:" + authToken);
        const authReq = req.clone({ setHeaders: { Authorization: authToken } });
        console.log("interceptor....."+req.urlWithParams)
        return next.handle(authReq).pipe(
            tap(event=>{
                if (event instanceof HttpResponse && event.status == 401){
                    console.log("un authorized");
                    this.router.navigateByUrl("/login");
                }
            })
            )
    }
}