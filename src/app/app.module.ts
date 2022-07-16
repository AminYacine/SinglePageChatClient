import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {ChatComponent} from './chat/chat.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AppRoutingModule} from "./app-routing.module";
import {LoginComponent} from './login/login.component';
import {ProfileComponent} from "./proflie/profile.component";
import {WebSocketService} from "./services/webSocketService/web-socket.service";
import {EventHandlerService} from "./services/eventHandlerService/event-handler.service";

@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    ProfileComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
