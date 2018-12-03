import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RegulationComponent } from './regulation/regulation.component';
import { MeetingsummaryComponent } from './meetingsummary/meetingsummary.component';
import { RegulationdetailComponent } from './regulationdetail/regulationdetail.component';
import { ConsoleComponent } from './console/console.component';
import { RegulationmanagmentComponent } from './regulationmanagment/regulationmanagment.component';
import { SummarymanagementComponent } from './summarymanagement/summarymanagement.component';

const routes: Routes = [
  {path: "", component: HomeComponent},
  {path: "home", component: HomeComponent,
     children:[
        {path: "regulations", component:RegulationComponent},
        {path: "meetingsummary", component: MeetingsummaryComponent},
        {path: "regulationdetail", component: RegulationdetailComponent}
     ]},
  {path: "console", component: ConsoleComponent,
    children:[
      {path: "regulation", component: RegulationmanagmentComponent},
      {path: "summary", component: SummarymanagementComponent}
    ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
