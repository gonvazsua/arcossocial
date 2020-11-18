import { Component, OnInit } from '@angular/core';
import { MainStateService } from './main.state.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor(public mainState: MainStateService) { }

  ngOnInit(): void {
    
  }

}
