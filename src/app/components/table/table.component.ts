import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent {
  @Input() userData: any
  @Output() deleteData = new EventEmitter();

  constructor() {}

  deleteRecord(id: string | number) {
    alert('Are you sure you want to delete this record?')
    this.deleteData.emit(id)
  }
}
