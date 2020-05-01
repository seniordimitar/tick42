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
  jobAreas?: Employee[];
  projects?: Project[];
  fullAddress?: string;
  employees?: Employee[];
}

export interface ICompany {
  id: string;
  name: string;
  business: string;
  slogan: string;
  address?: ICompanyAddress;
  jobAreas?: object;
  projects?: Project[];
  employees?: Employee[];
}

export interface ICompanyAddress {
  id: string;
  city: string;
  country: string;
  street: string;
  state: string;
  companyId: string;
}

export class Employee {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  companyId: string;
  jobTitle: string;
  jobArea: string;
  jobType: string;
}

export class Project {
  id: string;
  name: string;
  department: string;
  employeesId: string[];
  companyId: string;
  employees?: Employee[];
}
