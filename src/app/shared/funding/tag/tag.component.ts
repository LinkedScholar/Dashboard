import { Component, Input, OnInit, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import * as d3 from 'd3';

export type Tag = {
  text : string,
  uuid: string,
}

@Component({
  selector: 'ls-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss']
})
export class TagComponent implements OnInit {
  @Input() text: string;
  @Input() uuid: string;
  hash: number;
  color: string;

  @Output() remove = new EventEmitter();

  constructor() {

  }

  ngOnInit(): void {
    this.hashUid();
    this.color = colorFromHash(this.hash);
  }

  removeTag() {
    this.remove.emit(this.uuid);
  }
  

  hashUid() {
    this.hash = simpleHash(this.uuid);
  }
}
function simpleHash(uuid: string, maxValue = 10): number {
  let hash = 0;
  for (let i = 0; i < uuid.length; i++) {
    const char = uuid.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  const constrainedHash = Math.abs(hash) % maxValue;
  return constrainedHash + 1;
}

function colorFromHash(hash: number): string {
  let color = d3.schemePastel1[hash % d3.schemePastel1.length];
  return color;
}


