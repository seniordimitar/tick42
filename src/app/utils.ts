import {ItemNode} from './models';

export class Utils {

  public static mapEmployees(companyEmployees, key) {
    return companyEmployees.reduce((jobArea, employee) => {
      const value = employee[key];
      jobArea[value] = (jobArea[value] || []).concat(`${employee.firstName} ${employee.lastName}`);
      return jobArea;
    }, {});
  }

  public static mapJobAreaNames(companies) {
    return companies.reduce((acc, company) => {
      acc[company.name] = company.jobAreas;
      return acc;
    }, {});
  }

  public static buildFileTree(obj: { [key: string]: any }, level: number): ItemNode[] {
    return Object.keys(obj).reduce<ItemNode[]>((accumulator, key) => {
        const value = obj[key];
        const node = new ItemNode();
        node.item = key;

        if (value) {
          if (typeof value === 'object') {
            node.children = Utils.buildFileTree(value, level + 1);
          } else {
            node.item = value;
          }
        }
        return accumulator.concat(node);
    }, []);
  }
}
