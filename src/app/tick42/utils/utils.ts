import {ItemNode} from '../models/models';

export class Utils {

  public static groupBy(companyEmployees, key) {
    return companyEmployees.reduce((jobArea, employee) => {
      const value = employee[key];
      jobArea[value] = (jobArea[value] || [])
        .concat({label: `${employee.firstName} ${employee.lastName}`, data: employee});
      return jobArea;
    }, {});
  }

  public static mapJobAreaNames(companies) {
    return companies.reduce((acc, company) => {
      acc[company.name] = {label: company.jobAreas, data: company};
      return acc;
    }, {});
  }

  public static buildFileTree(obj: { [key: string]: any }, level: number): ItemNode[] {
    return Object.keys(obj).reduce<ItemNode[]>((accumulator, key) => {
      const value = obj[key];
      const node = new ItemNode();
      node.item = {
        label: key,
        data: value.data
      };

      if (value.label) {
        if (typeof value.label === 'object') {
          node.children = Utils.buildFileTree(value.label, level + 1);
        } else {
          node.item = {
            label: value.label,
            data: value.data
          };
        }
      } else {
        node.item = {
          label: key,
          data: value[0].data
        };
        node.children = Utils.buildFileTree(value, level + 1);
      }
      return accumulator.concat(node);
    }, []);
  }

  public static getCompanyAreaInfo(company, area) {
    return Object.keys(company.jobAreas).reduce((accumulator, key) => {
      if (key === area) {
        const value = company.jobAreas[key];
        return accumulator.concat(value);
      }
      return accumulator;
    }, []);
  }

  public static getProjectParticipants(projects, employees) {
    const participants = [];
    projects.forEach((project) => {
      employees.forEach((emp) => {
        const participant = project.employeesId.find( id => id === emp.data.id);
        if (participant) {
          participants.push(participant);
        }
      });
    });
    return participants;
  }
}
