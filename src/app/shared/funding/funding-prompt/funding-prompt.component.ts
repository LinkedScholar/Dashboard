import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Tag } from '../tag/tag.component';
import { FormControl } from '@angular/forms';
import { FundingBridgeService } from '../../funding-bridge.service';
import { Router } from '@angular/router';
import { NbMenuItem } from '@nebular/theme';


export type Prompt = {
  description: string,
  keywords: string[],
  researchAreas: string[]
}

@Component({
  selector: 'ls-funding-prompt',
  templateUrl: './funding-prompt.component.html',
  styleUrls: ['./funding-prompt.component.scss']
})
export class FundingPromptComponent implements OnInit{
  @Input() initialPrompt: Prompt
  @Input() hiddenHeader: boolean = false;

  @Output() outPrompt: EventEmitter<Prompt> = new EventEmitter<Prompt>();

  description: string = 'Random'
  
  promptKeywords: Tag[] = [ {
    text: 'Random',
    uuid: uuidv4()
  }]
  newKeyword : string;

  promptResearchAreas: Tag[] = [ {
    text: 'Random',
    uuid: uuidv4()
  }]

  researchAreas: NbMenuItem[] = [
    {
      title: 'Agricultural Sciences',
      children: [
        { title: 'Agricultural Biotechnology' },
        { title: 'Agriculture, Forestry, And Fisheries' },
        { title: 'Animal And Dairy Science' },
        { title: 'Other Agricultural Sciences' },
        { title: 'Veterinary Sciences' },
      ],
    },
    {
      title: 'Engineering And Technology',
      children: [
        { title: 'Chemical Engineering' },
        { title: 'Civil Engineering' },
        { title: 'Electrical Engineering' },
        { title: 'Electronic Engineering' },
        { title: 'Information Engineering' },
        { title: 'Environmental Biotechnology' },
        { title: 'Environmental Engineering' },
        { title: 'Industrial Biotechnology' },
        { title: 'Materials Engineering' },
        { title: 'Mechanical Engineering' },
        { title: 'Medical Engineering' },
        { title: 'Nanotechnology' },
        { title: 'Other Engineering And Technologies' },
      ],
    },
    {
      title: 'Humanities',
      children: [
        { title: 'Arts' },
        { title: 'History And Archaeology' },
        { title: 'Languages And Literature' },
        { title: 'Other Humanities' },
        { title: 'Philosophy, Ethics And Religion' },
      ],
    },
    {
      title: 'Medical And Health Sciences',
      children: [
        { title: 'Basic Medicine' },
        { title: 'Clinical Medicine' },
        { title: 'Health Sciences' },
        { title: 'Medical Biotechnology' },
        { title: 'Other Medical Sciences' },
      ],
    },
    {
      title: 'Natural Sciences',
      children: [
        { title: 'Biological Sciences' },
        { title: 'Chemical Sciences' },
        { title: 'Computer And Information Sciences' },
        { title: 'Earth And Related Environmental Sciences' },
        { title: 'Mathematics' },
        { title: 'Other Natural Sciences' },
        { title: 'Physical Sciences' },
      ],
    },
    {
      title: 'Social Sciences',
      children: [
        { title: 'Economics And Business' },
        { title: 'Educational Sciences' },
        { title: 'Law' },
        { title: 'Media And Communications' },
        { title: 'Other Social Sciences' },
        { title: 'Political Sciences' },
        { title: 'Psychology' },
        { title: 'Social Geography' },
        { title: 'Sociology' },
      ],
    },
  ];

  keywordControl = new FormControl();

  constructor(private router: Router) {}

  ngOnInit(): void {
    if (this.initialPrompt) {
      this.description = this.initialPrompt.description
      this.promptKeywords = this.initialPrompt.keywords.map(tag => ({text: tag, uuid: uuidv4()}))
      this.promptResearchAreas = this.initialPrompt.researchAreas.map(tag => ({text: tag, uuid: uuidv4()}))
    }
  }

  onAddKeyword(){
    let cleanedKeyword = this.newKeyword.replace(/\s/g, '');
    if (cleanedKeyword === "") return
    if (this.promptKeywords.find(tag => tag.text === cleanedKeyword)) return

    this.promptKeywords.push({text: this.newKeyword, uuid: uuidv4()});
    this.newKeyword = "";
  }

  removeTag(uuid: string){
    
    this.promptKeywords = this.promptKeywords.filter(tag => tag.uuid !== uuid);
  }

  addResearchArea(area: string, subarea: string){
    let text = area + " - " + subarea
    if (this.promptResearchAreas.find(tag => tag.text === text)) return

    this.promptResearchAreas.push({text: text, uuid: uuidv4()});
  }

  removeRATag(uuid: string){
    this.promptResearchAreas = this.promptResearchAreas.filter(tag => tag.uuid !== uuid);
  }

  isPromptReady() : boolean {
    if (this.description){
      return true
    }
    return false
  }

  prompt() {
    if (!this.isPromptReady()) return;

    this.outPrompt.emit(
      {
        description: this.description,
        keywords: this.promptKeywords.map(tag => tag.text),
        researchAreas: this.promptResearchAreas.map(tag => tag.text)
      } 
    )
  }
}

function uuidv4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}