import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RegulationComponent } from './regulationpkg/regulation/regulation.component';
import { MeetingsummaryComponent } from './meetingsummary/meetingsummary.component';
import { RegulationdetailComponent } from './regulationpkg/regulationdetail/regulationdetail.component';
import { ConsoleComponent } from './console/console.component';
import { RegulationmanagmentComponent } from './regulationpkg/regulationmanagment/regulationmanagment.component';
import { SummarymanagementComponent } from './summarymanagement/summarymanagement.component';
import { UserManagementComponent } from './user/user-management/user-management.component';
import { UserAddComponent } from './user/user-add/user-add.component';
import { UserEditComponent } from './user/user-edit/user-edit.component';

const routes: Routes = [
  {path: "", component: HomeComponent},
  {path: "home", component: HomeComponent,
    children:[
      {path: "", component:RegulationComponent},
      {path: "regulations", component:RegulationComponent},
      {path: "meetingsummary", component: MeetingsummaryComponent},
      {path: "regulationdetail", component: RegulationdetailComponent}
    ]},
  {path: "console", component: ConsoleComponent,
    children:[
      {path: "", component: RegulationmanagmentComponent},
      {path: "regulation", component: RegulationmanagmentComponent},
      {path: "regulationdetail", component: RegulationdetailComponent},
      {path: "summary", component: SummarymanagementComponent},
      {path: "user", component: UserManagementComponent},
      {path: "useredit", component:UserEditComponent},
      {path: "useradd", component: UserAddComponent}
    ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
