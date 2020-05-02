import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Employee} from '../../models/models';

@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.css']
})
export class EmployeeDetailsComponent {
  @Input() public isEmployeeDetailsVisible: Employee;
  @Output() public hideDetails = new EventEmitter<void>();
}
