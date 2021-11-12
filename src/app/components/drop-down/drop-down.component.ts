import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'drop-down',
  templateUrl: './drop-down.component.html',
  styleUrls: ['./drop-down.component.scss']
})
export class DropDownComponent implements OnInit {
  @Input() data: Array<any> = [];
  @Input() value: string = '';
  @Output() onChangeValue = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }

  change(event: any) {
    this.onChangeValue.emit(event);
  }

}
