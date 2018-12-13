import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'BtPrinter',
  moduleId: module.id,
  templateUrl: './bt-printer.component.html',
})
export class BtPrinterComponent implements OnInit {
  deviceUUID: string = "unknown";

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.deviceUUID = this.route.snapshot.params['UUID'];
  }

}
