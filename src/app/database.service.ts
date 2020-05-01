import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {BehaviorSubject, forkJoin} from 'rxjs';
import {map} from 'rxjs/operators';

import {ICompany, ICompanyAddress, IEmployee, IProject, ItemNode} from './models';
import {Utils} from './utils';

@Injectable()
export class ChecklistDatabase {
  public dataChange$$ = new BehaviorSubject<ItemNode[]>([]);

  constructor(private _http: HttpClient) {
    this._getCompanies();
  }

  get data(): ItemNode[] {
    return this.dataChange$$.value;
  }

  public insertItem(parent: ItemNode, name: string): void {
    if (parent.children) {
      parent.children.push({item: name} as ItemNode);
      this.dataChange$$.next(this.data);
    }
  }

  public updateItem(node: ItemNode, name: string): void {
    node.item = name;
    this.dataChange$$.next(this.data);
  }

  private _initialize(treeData): void {
    const data = Utils.buildFileTree(treeData, 0);
    this.dataChange$$.next(data);
  }

  private _getCompanies(): void {
    const companies$ = this._http.get('../assets/data/companies.json').pipe(map((companies) => companies as ICompany[]));
    const employees$ = this._http.get('../assets/data/employees.json').pipe(map((employees) => employees as IEmployee[]));
    const projects$ = this._http.get('../assets/data/projects.json').pipe(map((projects) => projects as IProject[]));
    const companyAddresses$ = this._http.get('../assets/data/company-addresses.json').pipe(
      map((companyAddresses) => companyAddresses as ICompanyAddress[]));

    forkJoin([companies$, companyAddresses$, employees$, projects$]).subscribe(
      ([companies, companyAddresses, employees, projects]) =>
        this._mapData(companies, companyAddresses, employees, projects));
  }

  private _mapData(companies: ICompany[],
                   companyAddresses: ICompanyAddress[],
                   employees: IEmployee[],
                   projects: IProject[]
  ): void {
    companies.forEach((company) => {
      company.address = companyAddresses.find((address) => address.companyId === company.id);
      company.projects = projects.filter((project) => project.companyId === company.id);
      const companyEmployees = employees.filter((employee) => employee.companyId === company.id);
      company.jobAreas = Utils.mapEmployees(companyEmployees, 'jobArea');
    });
    companies = Utils.mapJobAreaNames(companies);
    console.log(companies);
    this._initialize(companies);
  }
}
