import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {ChatComponent} from "./chat/chat.component";
import {LoginComponent} from "./login/login.component";
import {AuthenticateGuard} from "./services/authGuard/authenticate-guard.service";

const routes: Routes = [
  {path: "login", component: LoginComponent},
  {path: "chat", component: ChatComponent, canActivate: [AuthenticateGuard]},
  {path: "", redirectTo: "/login", pathMatch: "full"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
