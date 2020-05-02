import {FlatTreeControl} from '@angular/cdk/tree';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';

import {Subscription} from 'rxjs';

import { v4 as uuid } from 'uuid';

import {ChecklistDatabase} from './database.service';
import {IDetails, Employee, Project, ItemFlatNode, ItemNode} from './models';
import {MatDialog} from '@angular/material/dialog';
import {NewEmployeeComponent} from './new-employee/new-employee.component';
import {Utils} from './utils';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ChecklistDatabase]
})
export class AppComponent implements OnInit, OnDestroy {
  public treeControl: FlatTreeControl<ItemFlatNode>;
  public dataSource: MatTreeFlatDataSource<ItemNode, ItemFlatNode>;
  public isCompanyDetailsVisible: IDetails;
  public isEmployeeDetailsVisible: Employee;
  public isAreaDetailsVisible: { employees: number, projects: number };

  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  private _flatNodeMap = new Map<ItemFlatNode, ItemNode>();
  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  private _nestedNodeMap = new Map<ItemNode, ItemFlatNode>();
  private _treeFlattener: MatTreeFlattener<ItemNode, ItemFlatNode>;
  private _subscription: Subscription = new Subscription();
  private _currentEmployee: Employee;
  private _dialogRef$: any;

  constructor(private _database: ChecklistDatabase,
              private _matDialog: MatDialog
  ) {
  }

  public ngOnInit(): void {
    this._treeFlattener = new MatTreeFlattener(this._transformer, this._getLevel, this._isExpandable, this._getChildren);
    this.treeControl = new FlatTreeControl<ItemFlatNode>(this._getLevel, this._isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this._treeFlattener);
    this._initData();
  }

  public ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  public hasChild = (_: number, _nodeData: ItemFlatNode) => _nodeData.expandable;

  public getDetails(node: ItemNode): void {
    if (!node.item.data.dateOfBirth) {
      this.isAreaDetailsVisible = null;
      this.isEmployeeDetailsVisible = null;
      this.isCompanyDetailsVisible = node.item.data;
      this.isCompanyDetailsVisible.fullAddress = `${this.isCompanyDetailsVisible.address.country},
     ${this.isCompanyDetailsVisible.address.state},
    ${this.isCompanyDetailsVisible.address.city},
    ${this.isCompanyDetailsVisible.address.street}`;
      this.isCompanyDetailsVisible.projects.forEach((project) => {
        project.employees = this._getEmployees(project);
      });
    } else {
      this.isEmployeeDetailsVisible = null;
      this.isCompanyDetailsVisible = null;
      const company = this.dataSource.data.find( (item) => item.item.data.id === node.item.data.companyId);
      const employees = Utils.getCompanyAreaInfo(company.item.data, node.item.label);
      const projects = Utils.getProjectParticipants(company.item.data.projects, employees);
      this.isAreaDetailsVisible = {
        employees: employees.length,
        projects: projects.length
      };
    }
  }

  public getEmployee(employee): void {
    this.isAreaDetailsVisible = null;
    this.isCompanyDetailsVisible = null;
    this.isEmployeeDetailsVisible = employee;
  }

  public addProject(company): void {
    const project = new Project();
    project.id = uuid();
    project.name = '';
    project.department = '';
    project.employeesId = [];
    project.employees = [];
    project.companyId = company.id;
    company.projects.push(project);
  }

  public removeProject(project, company): void {
    const projIndex = company.projects.findIndex((proj) => proj.id === project.id);
    company.projects.splice(projIndex, 1);
  }

  public addEmployee(project): void {
    let employee = new Employee();
    employee.id = uuid();
    employee.firstName = '';
    employee.lastName = '';
    employee.dateOfBirth = '';
    employee.jobTitle = '';
    employee.jobArea = '';
    employee.jobType = '';
    employee.companyId = project.companyId;
    project.employeesId = project.employeesId.length ? project.employeesId : [];
    project.employees = project.employees.length ? project.employees : [];
    project.employeesId.push(employee.id);

    this._dialogRef$ = this._matDialog.open(NewEmployeeComponent, {data: employee});

    this._dialogRef$.afterClosed().subscribe(response => {
        if (!response) {
          this.removeEmployee(employee, project);
        } else {
          employee = {...response};
          project.employees.push(employee);
        }
      });
  }

  public removeEmployee(employee, project): void {
    const empIdsIndex = project.employeesId.findIndex((employeeId) => employeeId === employee.id);
    project.employeesId.splice(empIdsIndex, 1);
    const empIndex = project.employees.findIndex((e) => e.id === employee.id);
    project.employees.splice(empIndex, 1);
  }

  private _getEmployees(project): Employee[] {
    project.employees = [];
    project.employeesId.forEach((employeeId) => {
      this._currentEmployee = this.isCompanyDetailsVisible.employees.find((employee) => employee.id === employeeId);
    });
    if (this._currentEmployee) {
      project.employees.push(this._currentEmployee);
    }
    return project.employees;
  }

  private _initData(): void {
    this._subscription.add(
      this._database.dataChange$$.subscribe(data => {
        this.dataSource.data = data;
      })
    );
  }

  private _getLevel = (node: ItemFlatNode) => node.level;

  private _isExpandable = (node: ItemFlatNode) => node.expandable;

  private _getChildren = (node: ItemNode): ItemNode[] => node.children;

  private _transformer = (node: ItemNode, level: number) => {
    const existingNode = this._nestedNodeMap.get(node);
    const flatNode = existingNode && existingNode.item === node.item
      ? existingNode
      : new ItemFlatNode();
    flatNode.item = node.item;
    flatNode.level = level;
    flatNode.expandable = !!node.children;
    this._flatNodeMap.set(flatNode, node);
    this._nestedNodeMap.set(node, flatNode);
    return flatNode;
  }
}
