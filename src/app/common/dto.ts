
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
    param: any;

    constructor(){
        this.num = 1;
        this.size = 100;
        this.param = {};
    }

    append(key: string, value: string){
        var str = JSON.stringify(this.param);
        if (str.length > 2){
            str = str.replace("}", ",");
        }
        else{
            str = "{";
        }
        str = str + '"' + key + '":"' + value + '"}';
        this.param = JSON.parse(str);
    }
}

export function RespDataParser(rd: RespData, data:(data: any)=>void, err?:(msg: string, code?: number)=>void){
    if (rd.code == 0){
        data(rd.data);
    }
    else if (err != undefined){
        err(rd.message, rd.code);
    }
}

export function RespPageParser(rp: RespPage, 
                                data:(data: any)=>void, 
                                page?: (pnum?: number, psize?: number, total?: number)=>void, 
                                err?:(msg: string, code?: number)=>void){
    if (rp.code == 0){
        data(rp.data);
        if (page != undefined){
            page(rp.num, rp.size, rp.total);
        }
    }
    else if (err != undefined){
        err(rp.message, rp.code);
    }
}