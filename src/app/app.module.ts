import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgZorroAntdModule, NZ_I18N, zh_CN } from 'ng-zorro-antd';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { IconDefinition } from '@ant-design/icons-angular';
import { NZ_ICON_DEFAULT_TWOTONE_COLOR, NZ_ICONS } from 'ng-zorro-antd';
import { FileUploadModule } from 'ng2-file-upload';
import { CookieService } from 'ngx-cookie-service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
registerLocaleData(zh);

import { RegulationComponent } from './regulationpkg/regulation/regulation.component';
import { RegulationdetailComponent } from './regulationpkg/regulationdetail/regulationdetail.component';
import { ConsoleComponent } from './console/console.component';
import { RegulationmanagmentComponent } from './regulationpkg/regulationmanagment/regulationmanagment.component';
import { SummarymanagementComponent } from './summary/summarymanagement/summarymanagement.component';
import { UserManagementComponent } from './user/user-management/user-management.component';
import { UserAddComponent } from './user/user-add/user-add.component';
import { UserEditComponent } from './user/user-edit/user-edit.component';
import { LoginComponent } from './login/login.component';
import { TestComponent } from './test/test.component';
import { PortalComponent } from './portal/portal.component';
import { KsInterceptor } from './KsInterceptor';
import { PolicyComponent } from './policy/policy/policy.component';
import { PolicydetailComponent } from './policy/policydetail/policydetail.component';
import { PolicymanagementComponent } from './policy/policymanagement/policymanagement.component';
import { SummaryComponent } from './summary/summary/summary.component';
import { SummarydetailComponent } from './summary/summarydetail/summarydetail.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { PdocComponent } from './partner/pdoc/pdoc.component';
import { PdocdetailComponent } from './partner/pdocdetail/pdocdetail.component';
import { PdocmanagementComponent } from './partner/pdocmanagement/pdocmanagement.component';
import { ContractComponent } from './contract/contract/contract.component';
import { ContractmanagementComponent } from './contract/contractmanagement/contractmanagement.component';
import { ContractdetailComponent } from './contract/contractdetail/contractdetail.component';
import { InfoportComponent } from './infoport/infoport/infoport.component';
import { InfdetailComponent } from './infoport/infdetail/infdetail.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    RegulationComponent,
    RegulationdetailComponent,
    ConsoleComponent,
    RegulationmanagmentComponent,
    SummarymanagementComponent,
    UserManagementComponent,
    UserAddComponent,
    UserEditComponent,
    LoginComponent,
    TestComponent,
    PortalComponent,
    PolicyComponent,
    PolicydetailComponent,
    PolicymanagementComponent,
    SummaryComponent,
    SummarydetailComponent,
    BreadcrumbComponent,
    PdocComponent,
    PdocdetailComponent,
    PdocmanagementComponent,
    ContractComponent,
    ContractmanagementComponent,
    ContractdetailComponent,
    InfoportComponent,
    InfdetailComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    NgZorroAntdModule,
    PdfViewerModule,
    ReactiveFormsModule,
    FileUploadModule
  ],
  providers: [{ provide: NZ_I18N, useValue: zh_CN },
              { provide: HTTP_INTERCEPTORS, useClass: KsInterceptor, multi: true},
              CookieService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
