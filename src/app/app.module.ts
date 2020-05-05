import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {MaterialModule} from './tick42/material/material.module';

import {AppComponent} from './app.component';
import { NewEmployeeComponent } from './tick42/components/new-employee/new-employee.component';
import { AreaDetailsComponent } from './tick42/components/area-details/area-details.component';
import { EmployeeDetailsComponent } from './tick42/components/employee-details/employee-details.component';
import { CompanyDetailsComponent } from './tick42/components/company-details/company-details.component';

@NgModule({
  declarations: [
    AppComponent,
    NewEmployeeComponent,
    AreaDetailsComponent,
    EmployeeDetailsComponent,
    CompanyDetailsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [EmployeeDetailsComponent]
})
export class AppModule {
}
