import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaperComponent } from './paper/paper.component';
import { AppComponent } from './app.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'paper',
    pathMatch: 'full',
  },
  { path: 'paper', component: PaperComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
