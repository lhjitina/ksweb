import {HttpInterceptor, HttpEvent, HttpRequest, HttpHandler, HttpErrorResponse, HttpHeaderResponse, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { catchError, mergeMap, map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class KsInterceptor implements HttpInterceptor {
    constructor(private router: Router){}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{ 
        var authReq = req.clone({headers: req.headers.append("authorization", "hello")});
        console.log("interceptor....."+req.urlWithParams)
        return next.handle(authReq);
    };

    HandleResp(reeponse: HttpResponse<any>){

    }

}