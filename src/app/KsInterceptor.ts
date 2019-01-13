import {HttpInterceptor, HttpEvent, HttpRequest, HttpHandler, HttpErrorResponse, HttpHeaderResponse, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { catchError, mergeMap, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { GlobalService } from './global.service';

@Injectable()
export class KsInterceptor implements HttpInterceptor {
    constructor(private router: Router,
        private gs: GlobalService){}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{ 
        if (!req.url.includes("/api/user/login")){
            const authToken = this.gs.getToken();
            const authReq = req.clone({ setHeaders: { Authorization: authToken } });
        console.log("interceptor....."+req.urlWithParams)
        return next.handle(authReq).pipe(map((event: any)=>{
            if (event instanceof HttpResponse && event.status != 200){

            }
        });        


        };

    }
}