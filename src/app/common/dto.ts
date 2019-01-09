
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