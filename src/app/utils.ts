import {ItemNode} from './models';

export class Utils {

  public static mapEmployees(array, key) {
    return array.reduce((objectsByKeyValue, obj) => {
      const value = obj[key];
      objectsByKeyValue[value] = (objectsByKeyValue[value] || [])
        .concat(`${obj.firstName} ${obj.firstName}`);
      return objectsByKeyValue;
    }, {});
  }

  public static mapJobAreaNames(array) {
    return array.reduce((acc, item) => {
      acc[item.name] = item.jobAreas;
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
