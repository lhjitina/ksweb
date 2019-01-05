export class Resp{
    code: number;
    message: string;
    data: any;
}

export class RespPage extends Resp{
    pageIndex: number;
    pageSize: number;
    total: number;    
}