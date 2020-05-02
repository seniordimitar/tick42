import {Component, EventEmitter, Input, Output} from '@angular/core';
import {IDetails, Project} from '../../models/models';

@Component({
  selector: 'app-company-details',
  templateUrl: './company-details.component.html',
  styleUrls: ['./company-details.component.css']
})
export class CompanyDetailsComponent {
  @Input() public isCompanyDetailsVisible: IDetails;
  @Output() public hideDetails = new EventEmitter<void>();
  @Output() public addProject = new EventEmitter<IDetails>();
  @Output() public removeProject = new EventEmitter<object>();
  @Output() public addEmployee = new EventEmitter<Project>();
  @Output() public removeEmployee = new EventEmitter<object>();

  public removeEmp(employee, project): void {
    this.removeEmployee.emit({employee, project});
  }

  public removeProj(project, company): void {
    this.removeProject.emit({project, company});
  }
}
