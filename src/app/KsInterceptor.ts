import {HttpInterceptor, HttpEvent, HttpRequest, HttpHandler, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { GlobalService } from './global.service';
import { RespData } from './common/dto';
import { NzMessageService } from 'ng-zorro-antd';
@Injectable()
export class KsInterceptor implements HttpInterceptor {
    constructor(private router: Router,
        private gs: GlobalService,
        private msg: NzMessageService){}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{ 
        const authToken = this.gs.getToken();
        console.log("authtoken:" + authToken);
        const authReq = req.clone({ setHeaders: { Authorization: authToken } });
        console.log("interceptor....."+req.urlWithParams)
        return next.handle(authReq).pipe(
            tap(
                (event: any) =>{
                     if (event instanceof HttpResponse){
                        let res = event.body as RespData;
                        console.log("res body:")
                        console.log(event.body)
                        if (res.code != 0){
                            console.log("error code: " + res.code);
                            this.msg.create('error', res.message);
                        }
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
                        default:{
                            this.msg.create('error', "服务器发生错误，错误码："+error.status);
                        }
                    }
                }
            )
           
            )
    }
}