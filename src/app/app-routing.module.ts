import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { IspisVoznjiComponent } from './components/ispis-voznji/ispis-voznji.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthGuard } from './services/guard/auth.guard';
import { IspisZgradaComponent } from './components/ispis-zgrada/ispis-zgrada.component';
import { IspisLiftovaComponent } from './components/ispis-liftova/ispis-liftova.component';

const routes: Routes = [
{path: '', pathMatch: 'full', redirectTo: 'ispis-zgrada'},
{path: 'ispis-voznji/:id', component: IspisVoznjiComponent },
{path: 'sign-in',component: SignInComponent},
{path: 'sign-up',component:SignUpComponent},
{path: 'verify-email',component:VerifyEmailComponent},
{path: 'forgot-password',component:ForgotPasswordComponent},
{path:'ispis-zgrada',component:IspisZgradaComponent, canActivate: [AuthGuard]},
{path: 'dashboard',component:DashboardComponent, canActivate: [AuthGuard]},
{path: 'ispis-liftova/:id',component:IspisLiftovaComponent,canActivate:[AuthGuard]}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
