import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/common/local-storage.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  @Input() userName: string;
  @Input() isAdmin: boolean;

  constructor(private localStorageService: LocalStorageService, private router: Router) {}

  ngOnInit(): void {
  }

  logout() {
    this.localStorageService.clear();
    this.router.navigate(['/login']);
  }

}
