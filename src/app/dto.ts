export class Resp{
    code: number;
    msg: string;
    data: any;
}

export class RespPage extends Resp{
    pageIndex: number;
    pageSize: number;
    total: number;
}