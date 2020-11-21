import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-prettyboolean',
  templateUrl: './prettyboolean.component.html',
  styleUrls: ['./prettyboolean.component.css']
})
export class PrettybooleanComponent implements OnInit {

  @Input() value: boolean;

  constructor() { }

  ngOnInit(): void {
  }

}
