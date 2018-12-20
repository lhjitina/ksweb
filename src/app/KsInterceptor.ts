import {HttpInterceptor, HttpEvent, HttpRequest, HttpHandler, HttpErrorResponse, HttpHeaderResponse, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { catchError, mergeMap, map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class KsInterceptor implements HttpInterceptor {
    constructor(private router: Router){}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{       
        return next.handle(req).pipe(
            map((event: HttpEvent<any>)=>{
            if (event instanceof HttpResponse && event.status === 200){
                this.HandleResp(event);
             };
            return event;
        }),

        catchError((err: any)=>{
  //              if (err instanceof HttpErrorResponse && err.status === 0){
 //                   this.router.navigateByUrl("/login");                      }
 //               else {
  //                 this.router.navigateByUrl("/login");
  //              };
                return throwError(err);
            })
        );
    };

    HandleResp(reeponse: HttpResponse<any>){

    }

}