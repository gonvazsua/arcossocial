import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

declare const M: any;

@Component({
  selector: 'app-confirmmodal',
  templateUrl: './confirmmodal.component.html',
  styleUrls: ['./confirmmodal.component.css']
})
export class ConfirmModalComponent implements OnInit {

  @Input() text: string;
  @Input() modalId: string;
  @Output() confirmEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void {
    const modal = document.querySelector('#' + this.modalId);
    const optionsModal = {dismissible: false};
    var instances = M.Modal.init(modal, optionsModal); 
  }

  ngAfterViewInit(): void {
    const modal = document.querySelector('#' + this.modalId);
    const optionsModal = {dismissible: false};
    var instances = M.Modal.init(modal, optionsModal); 
    console.log("Modal ID: ");
    console.log(instances);
  }

  closeConfirmModal(event) {
    if(!event) return;
    const modal = document.querySelector('#' + this.modalId);
    const modalInstance = M.Modal.getInstance(modal);
    modalInstance.close();
  }

  openConfirmModal() {
    const modal = document.querySelector('#' + this.modalId);
    const modalInstance = M.Modal.getInstance(modal);
    modalInstance.open();
  }

  confirmOrCancel(confirmResult: boolean) {
    const modal = document.querySelector('#' + this.modalId);
    const modalInstance = M.Modal.getInstance(modal);
    modalInstance.close();
    this.confirmEvent.emit(confirmResult);
  }

}
