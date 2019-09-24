import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import { SetupPageComponent } from './pages/setup-page/setup-page.component';

const routes: Routes = [
   {path: '', component: SetupPageComponent},
   {path: '**', component: NotFoundPageComponent}
];

@NgModule({
   imports: [RouterModule.forRoot(routes)],
   exports: [RouterModule]
})
export class AppRoutingModule {
}
