import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyfilesComponent } from './myfiles/myfiles.component';
import { RegisterComponent } from './userauth/register/register.component';
import { LoginComponent } from './userauth/login/login.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: MyfilesComponent },
  { path: 'myfiles', component: MyfilesComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
