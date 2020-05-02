import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-area-details',
  templateUrl: './area-details.component.html',
  styleUrls: ['./area-details.component.css']
})
export class AreaDetailsComponent {
  @Input() public isAreaDetailsVisible: { employees: number, projects: number };
  @Output() public hideDetails = new EventEmitter<void>();
}
