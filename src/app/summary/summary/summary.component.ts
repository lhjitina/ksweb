import { Component, OnInit, ChangeDetectorRef, ElementRef } from '@angular/core';
import { FormBuilder,  FormGroup, FormControl, AbstractControl, Validators} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { RespData, RespPage, PageRequest } from './../../common/dto';
import { GlobalService } from 'src/app/global.service';
import { FileUploader } from 'ng2-file-upload';
import { NzModalRef, NzModalService, NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit {
  summaries: Summary[] = [];
  searchFormGroup: FormGroup;
  uploadFormGroup: FormGroup;
  fuzzySearchFormGroup: FormGroup;

  uploader:FileUploader;
  bShowUplodModal: boolean = false;
  bHasClicked: boolean = false;

  constructor(private fb: FormBuilder,
              private http: HttpClient,
              private gs: GlobalService,
              private er: ElementRef,
              private modal: NzModalService,
              private msg: NzMessageService) {
    this.searchFormGroup = this.fb.group({
      name: [''],
      startDate: [''],
      endDate: ['']
    });
    this.fuzzySearchFormGroup = this.fb.group({
      keys: ['']
    }); 
    this.uploadFormGroup = this.fb.group({
      meetingDate: ['', Validators.required]
    });
              }

  ngOnInit() {
    this.onSearch();
    this.initUploader();
  }

  onSearch(): void{
    var page = new PageRequest();
    var sd = this.searchFormGroup.get("startDate").value;
    var ed = this.searchFormGroup.get("endDate").value;
    if (moment.isDate(sd)) { 
      page.append("startDate", moment(sd).format("YYYY-MM-DD")) 
    };
    if (moment.isDate(ed)) { 
      page.append("endDate", moment(ed).format("YYYY-MM-DD")) 
    };
    page.append("name", this.searchFormGroup.get("name").value);
    
    this.http.post("/api/summary/list", page).subscribe((res: RespPage)=>{
      console.log(res);
      if (res.code == 0){
        this.summaries = res.data;        
      }
      else{
        console.log(res.message);
        this.summaries = [];
      }
    })
  }

  onDownload(name: string): void{
    var url = "/api/summary/content/" + name;
    this.http.get(url, { responseType: 'blob'}).subscribe((res: Blob)=>{
      var a = document.createElement('a');
      document.body.appendChild(a);
      a.href = URL.createObjectURL(res);
      a.style.display = "false";
      a.download = name;
      a.click();
      URL.revokeObjectURL(a.href);
    });
  }

  perSum(): boolean{
    return this.gs.getUser().perSum;
  }
  
  initUploader(): void{
    this.uploader = new FileUploader({});
    this.uploader.onCompleteAll=()=>{
      this.bShowUplodModal = false;
      this.uploader.clearQueue();
      this.er.nativeElement.querySelector(".reg-upload").value='';
      this.onSearch();
    }
    this.uploader.onSuccessItem=(item: any, response: string, status: number, headers: any): any=>{
      let res: RespData = JSON.parse(response);
      if (status != 200){
        this.msg.create('error', "发生错误：" + status);
      }
      else if (res.code != 0){
        this.msg.create('error', res.message);
      }
    };  
  }

  setUploadParams(): void{
    var upUrl = "/api/summary/upload?meetingDate=";
    var meetingDate = moment(this.uploadFormGroup.get("meetingDate").value).format("YYYY-MM-DD");
    upUrl += meetingDate;

    this.uploader.setOptions({
      url: upUrl,
      authToken: this.gs.getToken(),
      removeAfterUpload: true, 
      maxFileSize: 10240000,
      method: "POST"    
    })
  }

  onUpload(): void{
    this.uploader.clearQueue();
    let e = this.er.nativeElement.querySelector(".reg-upload");
    e.click();
    this.bHasClicked = false;
  }

  selectFileChange(event: any): void{
    if (this.uploader.queue.length>0){
      this.bShowUplodModal = true;
    }
  }

  nzOnCancel():void{
    this.bShowUplodModal = false;
    this.uploader.cancelAll();
    this.uploader.clearQueue(); 
    this.er.nativeElement.querySelector(".reg-upload").value='';
  }

  nzOnOk(): void{
    console.log("start upload....")
    if (this.uploadFormGroup.valid){
      this.setUploadParams();
      this.uploader.uploadAll();
      this.bHasClicked = true;
    }
    else{
      console.log("....upload param error.....")
    }
  }

  onDelete(sum: Summary): void{
    this.modal.confirm({
      nzTitle: '您确定要删除该纪要吗？',
      nzContent: sum.name,
      nzOkType : 'danger',
      nzOnOk: () =>{
        this.http.get("/api/summary/delete", {
          params:{
            name: sum.name
          }
        }).subscribe((res: any)=>{
          this.onSearch();
        });
      }
    });    
  }
  cardTitle(i: any, data: any): string{
    let info = data as Summary;
    i += 1;
    return "[" + i + "] " + info.name; 
  }

  onFuzzySearch(): void{
    var page = new PageRequest();  
    page.append("keys", this.fuzzySearchFormGroup.get("keys").value);
    this.http.post("/api/summary/fuzzy", page).subscribe((res: RespPage)=>{
      if (res.code == 0){
        this.summaries = res.data;
      }
      else{
        this.summaries = [];
      }
    })     
  } 
}


export class Summary {
  public name: string;
  public meetingDate: Date;
  public state: string;
  public operatorName: string;
  public operatorId: number;
  public operateTime: Date;
  
  constructor(){}

  public static clone(c: Summary){
    var r = new Summary();
    r.name = c.name;
    r.meetingDate = c.meetingDate;
    r.state = c.state;
    r.operateTime = c.operateTime;
    r.operatorId = c.operatorId;
    r.operatorName = c.operatorName;  
    return r;
  }
}

