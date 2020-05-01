import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {BehaviorSubject, forkJoin} from 'rxjs';
import {map} from 'rxjs/operators';

import {ICompany, ICompanyAddress, Employee, Project, ItemNode} from './models';
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

  private _initialize(treeData): void {
    const data = Utils.buildFileTree(treeData, 0);
    this.dataChange$$.next(data);
  }

  private _getCompanies(): void {
    const companies$ = this._http.get('../assets/data/companies.json').pipe(map((companies) => companies as ICompany[]));
    const employees$ = this._http.get('../assets/data/employees.json').pipe(map((employees) => employees as Employee[]));
    const projects$ = this._http.get('../assets/data/projects.json').pipe(map((projects) => projects as Project[]));
    const companyAddresses$ = this._http.get('../assets/data/company-addresses.json').pipe(
      map((companyAddresses) => companyAddresses as ICompanyAddress[]));

    forkJoin([companies$, companyAddresses$, employees$, projects$]).subscribe(
      ([companies, companyAddresses, employees, projects]) =>
        this._mapData(companies, companyAddresses, employees, projects));
  }

  private _mapData(companies: ICompany[],
                   companyAddresses: ICompanyAddress[],
                   employees: Employee[],
                   projects: Project[]
  ): void {
    companies.forEach((company) => {
      company.address = companyAddresses.find((address) => address.companyId === company.id);
      company.projects = projects.filter((project) => project.companyId === company.id);
      company.employees = employees.filter((employee) => employee.companyId === company.id);
      company.jobAreas = Utils.groupBy(company.employees, 'jobArea');
    });
    companies = Utils.mapJobAreaNames(companies);
    this._initialize(companies);
  }
}
