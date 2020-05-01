import {Component, Inject} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

import {Employee} from '../models';

@Component({
  selector: 'app-new-employee',
  templateUrl: './new-employee.component.html',
  styleUrls: ['./new-employee.component.css']
})
export class NewEmployeeComponent {
  emplForm: FormGroup;
  employee: Employee;

  constructor(public matDialogRef: MatDialogRef<NewEmployeeComponent>,
              @Inject(MAT_DIALOG_DATA) private _data: Employee,
              private _formBuilder: FormBuilder
  ) {
    this.employee = this._data;
    this.emplForm = this._createAEmployeeFromm();
  }

  private _createAEmployeeFromm(): FormGroup {
    return this._formBuilder.group({
      firstName: [this.employee.firstName, Validators.required],
      lastName: [this.employee.lastName, Validators.required],
      dateOfBirth: [this.employee.dateOfBirth, Validators.required],
      jobTitle: [this.employee.jobTitle, Validators.required],
      jobArea: [this.employee.jobArea, Validators.required],
      jobType: [this.employee.jobType, Validators.required]
    });
  }
}
