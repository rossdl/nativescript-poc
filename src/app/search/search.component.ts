import { Component, OnInit } from "@angular/core";
import { BarcodeScanner } from "nativescript-barcodescanner";

@Component({
    selector: "Search",
    moduleId: module.id,
    templateUrl: "./search.component.html"
})
export class SearchComponent implements OnInit {
    scanValue: string = "";

    constructor(private barcodeScanner: BarcodeScanner) {
        // Use the constructor to inject services.
    }

    ngOnInit(): void {
        // Use the "ngOnInit" handler to initialize data for the view.
    }

    scan() {
        console.log("do scan");
        this.barcodeScanner.scan({
            formats: "QR_CODE, CODE_39",
            beepOnScan: true,
        }).then(r => {
            console.log("scan result:");
            console.log(r.format, r.text);
            this.scanValue = r.text;
        });
    }
}
