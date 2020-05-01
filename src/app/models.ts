export class ItemNode {
  children: ItemNode[];
  item: string;
}

export class ItemFlatNode {
  item: string;
  level: number;
  expandable: boolean;
}

export interface ICompany {
  id: string;
  name: string;
  business: string;
  slogan: string;
  address?: ICompanyAddress;
  jobAreas?: IEmployee[];
  projects?: IProject[];
}

export interface ICompanyAddress {
  id: string;
  city: string;
  country: string;
  street: string;
  state: string;
  companyId: string;
}

export interface IEmployee {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  companyId: string;
  jobTitle: string;
  jobArea: string;
  jobType: string;
}

export interface IProject {
  id: string;
  name: string;
  department: string;
  employeesId: string[];
  companyId: string;
}
