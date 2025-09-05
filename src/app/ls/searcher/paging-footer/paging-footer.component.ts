import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ls-paging-footer',
  templateUrl: './paging-footer.component.html',
  styleUrls: ['./paging-footer.component.scss']
})
export class PagingFooterComponent {
  @Input() currentPage: number = 0
  @Input() maxPage: number = 0
  @Input() disabled: boolean = false
  @Output() search: EventEmitter<number> = new EventEmitter<number>();

  setCurrentPage(page: number) {
    if (page < 1) page = 1;
    if (page > this.maxPage) page = this.maxPage;
    if (page != this.currentPage) this.search.emit(page);
  }
}
