import {HttpInterceptor, HttpEvent, HttpRequest, HttpHandler, HttpResponse, HttpErrorResponse } from '@angular/common/http';
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
            tap(
                (event: any) =>{
                     if (event instanceof HttpResponse){
                        if (event.status == 401){
                            console.log("un authorized");
                            this.router.navigateByUrl("/login");
                        }
                        else{
                            console.log("event status:" + event.status)
                        }
                    }
                    else{
                        console.log("not httpresponse")
                        console.log(event);
                    }
                },
                error=>{
                    console.log("error status=" + error.status);
                    switch(error.status){
                        case 401:{
                            console.log("error 401, router to login");
                            this.router.navigateByUrl("/login");
                            break;
                        }
                    }
                }
               // return Observable.create(observer => observer.next(event))
            )
           
            )
    }
}