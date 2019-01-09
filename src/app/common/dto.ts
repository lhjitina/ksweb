import { fillProperties } from "@angular/core/src/util/property";
import { filter } from "rxjs/operators";

export class RespData{
    code: number;
    message: string;
    data: any;
}

export class RespPage extends RespData{
    num: number;
    size: number;
    total: number;    
}

export class PageRequest{
    num: number;
    size: number;
    filter: any;

    PageRequest(){
        this.num = 1;
        this.size = 10;
        this.filter = null;
    }
}