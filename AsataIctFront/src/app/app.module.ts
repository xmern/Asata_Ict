import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { FlexLayoutModule, FlexModule } from '@angular/flex-layout';
import { AppComponent } from './app.component';
import { FileTableComponent } from './file-table/file-table.component';
import { LoginComponent } from './userauth/login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { HttpGatewayService } from './services/http-gateway.service';
import { ErrorModalComponent } from './error-modal/error-modal.component';
import { UserDataService } from './services/userauth/user-data.service';
import { MyfilesComponent } from './myfiles/myfiles.component';
import { FilesizePipe } from './filesize.pipe';
import { FilenamePipe } from './filename.pipe';
import { FilenameDPipe } from './filename-d.pipe';
import { RegisterComponent } from './userauth/register/register.component';

@NgModule({
  declarations: [
    AppComponent,
    FileTableComponent,
    LoginComponent,
    ErrorModalComponent,
    MyfilesComponent,
    FilesizePipe,
    FilenamePipe,
    FilenameDPipe,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule
    //FlexLayoutModule,
      ],
  providers: [HttpGatewayService,UserDataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
