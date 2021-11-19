import { WebcamComponent } from './components/webcam/webcam.component';
import { ReportsComponent } from './components/reports/reports.component';
import { StudentWiseComponent } from './components/student-wise/student-wise.component';
import { DaywiseComponent } from './components/daywise/daywise.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CameraComponent } from './components/camera/camera.component';

const routes: Routes = [
  { path: 'daywise', component: DaywiseComponent },
  { path: 'student', component: StudentWiseComponent },
  { path: 'report', component: ReportsComponent },
  { path: 'camera', component: CameraComponent },
  { path: 'webcam', component: WebcamComponent },
  { path: '**', redirectTo: 'daywise' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
