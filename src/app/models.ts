export class ItemNode {
  children: ItemNode[];
  item: Item;
}

class Item {
  label: string;
  data?: any;
}

export class ItemFlatNode {
  item: Item;
  level: number;
  expandable: boolean;
}

export interface IDetails {
  id: string;
  name: string;
  business: string;
  slogan: string;
  address?: ICompanyAddress;
  jobAreas?: IEmployee[];
  projects?: IProject[];
  fullAddress?: string;
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
