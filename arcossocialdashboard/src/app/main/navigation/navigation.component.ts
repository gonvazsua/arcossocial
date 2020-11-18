import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'src/app/common/local-storage.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  user: string;

  constructor(private localStorageService: LocalStorageService) {
    this.user = localStorageService.userCode;
  }

  ngOnInit(): void {
  }

}
