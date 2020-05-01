import {FlatTreeControl} from '@angular/cdk/tree';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';

import {Subscription} from 'rxjs';

import {ChecklistDatabase} from './database.service';
import {IDetails, ItemFlatNode, ItemNode} from './models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ChecklistDatabase]
})
export class AppComponent implements OnInit, OnDestroy {
  public treeControl: FlatTreeControl<ItemFlatNode>;
  public dataSource: MatTreeFlatDataSource<ItemNode, ItemFlatNode>;
  public panelOpenState = false;
  public details: IDetails;

  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  private _flatNodeMap = new Map<ItemFlatNode, ItemNode>();
  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  private _nestedNodeMap = new Map<ItemNode, ItemFlatNode>();
  private _treeFlattener: MatTreeFlattener<ItemNode, ItemFlatNode>;
  private _subscription: Subscription = new Subscription();

  constructor(private _database: ChecklistDatabase) {
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

  public hasNoContent = (_: number, _nodeData: ItemFlatNode) => _nodeData.item.label === '';

  public addNewItem(node: ItemFlatNode): void {
    const parentNode = this._flatNodeMap.get(node);
    if (parentNode) {
      this._database.insertItem(parentNode, '');
      this.treeControl.expand(node);
    }
  }

  public getDetails(node: ItemFlatNode): void {
    this.details = node.item.data;
    this.details.fullAddress = `${this.details.address.country}, ${this.details.address.state},
    ${this.details.address.city}, ${this.details.address.street}`;
    console.log(this.details);
  }

  public saveNode(node: ItemFlatNode, itemValue: string): void {
    const nestedNode = this._flatNodeMap.get(node);
    if (nestedNode) {
      this._database.updateItem(nestedNode, itemValue);
    }
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
