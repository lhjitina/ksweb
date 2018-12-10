import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgZorroAntdModule, NZ_I18N, zh_CN } from 'ng-zorro-antd';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { IconDefinition } from '@ant-design/icons-angular';
import { NZ_ICON_DEFAULT_TWOTONE_COLOR, NZ_ICONS } from 'ng-zorro-antd';
import { FileUploadModule } from 'ng2-file-upload';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
registerLocaleData(zh);

import { RegulationComponent } from './regulation/regulation.component';
import { MeetingsummaryComponent } from './meetingsummary/meetingsummary.component';
import { RegulationdetailComponent } from './regulationdetail/regulationdetail.component';
import { ConsoleComponent } from './console/console.component';
import { RegulationmanagmentComponent } from './regulationmanagment/regulationmanagment.component';
import { SummarymanagementComponent } from './summarymanagement/summarymanagement.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    RegulationComponent,
    MeetingsummaryComponent,
    RegulationdetailComponent,
    ConsoleComponent,
    RegulationmanagmentComponent,
    SummarymanagementComponent,

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
  providers: [ { provide: NZ_I18N, useValue: zh_CN } ],
  bootstrap: [AppComponent]
})
export class AppModule { }
