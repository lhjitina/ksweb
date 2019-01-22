import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RegulationComponent } from './regulationpkg/regulation/regulation.component';
import { RegulationdetailComponent } from './regulationpkg/regulationdetail/regulationdetail.component';
import { ConsoleComponent } from './console/console.component';
import { RegulationmanagmentComponent } from './regulationpkg/regulationmanagment/regulationmanagment.component';
import { UserManagementComponent } from './user/user-management/user-management.component';
import { UserAddComponent } from './user/user-add/user-add.component';
import { UserEditComponent } from './user/user-edit/user-edit.component';
import { LoginComponent } from './login/login.component';
import { PortalComponent } from './portal/portal.component';
import { PolicyComponent } from './policy/policy/policy.component';
import { PolicydetailComponent } from './policy/policydetail/policydetail.component';
import { PolicymanagementComponent } from './policy/policymanagement/policymanagement.component';
import { SummaryComponent } from './summary/summary/summary.component';
import { SummarymanagementComponent } from './summary/summarymanagement/summarymanagement.component';
import { SummarydetailComponent } from './summary/summarydetail/summarydetail.component';
import { LoginGuard } from './guard/login.guard';
import { PdocComponent } from './partner/pdoc/pdoc.component';
import { PdocdetailComponent } from './partner/pdocdetail/pdocdetail.component';
import { PdocmanagementComponent } from './partner/pdocmanagement/pdocmanagement.component';
import { ContracttemplateComponent } from './contracttemplate/contracttemplate/contracttemplate.component';
import { ContracttemplatemanagementComponent } from './contracttemplate/contracttemplatemanagement/contracttemplatemanagement.component';
import { ContracttemplatedetailComponent } from './contracttemplate/contracttemplatedetail/contracttemplatedetail.component';
import { InfoportComponent } from './infoport/infoport/infoport.component';
import { InfdetailComponent } from './infoport/infdetail/infdetail.component';

const routes: Routes = [
  {path: "", component: LoginComponent},
  {path: "login", component: LoginComponent},
  {path: "portal", component: PortalComponent, children:[
      {path: "", component: HomeComponent},
      {path: "home", component: HomeComponent, children:[
        {path: "", component:InfoportComponent},
        {path: "shareinfo", component: InfoportComponent},
        {path: "infodetail", component: InfdetailComponent},
        {path: "policy", component: PolicyComponent},
        {path: "policydetail", component: PolicydetailComponent},
        {path: "regulation", component:RegulationComponent},
        {path: "regulationdetail", component: RegulationdetailComponent},
        {path: "summary", component: SummaryComponent},
        {path: "summarydetail", component: SummarydetailComponent},
        {path: "partnerdoc", component: PdocComponent},
        {path: "pdocdetail", component:PdocdetailComponent},
        {path: "contracttemplate", component: ContracttemplateComponent},
        {path: "contracttemplatedetail", component: ContracttemplatedetailComponent}      
      ]},

      {path: "console", component: ConsoleComponent, children:[
          {path: "", component: RegulationmanagmentComponent},
          {path: "policy", component: PolicymanagementComponent},
          {path: "policydetail", component: PolicydetailComponent},
          {path: "regulation", component: RegulationmanagmentComponent},
          {path: "regulationdetail", component: RegulationdetailComponent},
          {path: "summary", component: SummarymanagementComponent},
          {path: "summarydetail", component: SummarydetailComponent},
          {path: "user", component: UserManagementComponent},
          {path: "useredit", component: UserEditComponent},
          {path: "useradd", component: UserAddComponent},
          {path: "partnerdoc", component: PdocmanagementComponent},
          {path: "pdocdetail", component: PdocdetailComponent},
          {path: "contracttemplate", component: ContracttemplatemanagementComponent},
          {path: "contracttemplatedetail", component: ContracttemplatedetailComponent}
      ]},
  ], canActivate: [LoginGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [LoginGuard]
})
export class AppRoutingModule { }
