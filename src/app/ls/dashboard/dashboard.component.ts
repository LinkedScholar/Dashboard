import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Prompt } from '../../shared/funding/funding-prompt/funding-prompt.component';
import { FundingBridgeService } from '../../shared/funding-bridge.service';

@Component({
  selector: 'ls-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit{
  constructor(
    private router: Router,
    private fundingBackend: FundingBridgeService) {}

  ngOnInit(): void {
    
  }

  handleResultSelection(selectedItem: any): void {
    if (selectedItem.type == 'person'){
      this.router.navigate(["/ls/person", selectedItem.id]);
    }
    else if (selectedItem.type == 'institution') {
      this.router.navigate(["/ls/institution", selectedItem.id]);
    }
    else{
      this.submitSearch(selectedItem);
    }
  }

  submitSearch(searchElement: any): void {
    this.router.navigate(['/ls/search'], { queryParams: { q: searchElement.name , t: searchElement.type } });
  }

  prompt(result : Prompt) {
    this.fundingBackend.setPrompt("", result.description, result.keywords, result.researchAreas);
    this.router.navigate(['/ls/funding']);
  }
}
