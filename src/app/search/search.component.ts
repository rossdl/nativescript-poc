import { Component, OnInit } from "@angular/core";
import { BarcodeScanner } from "nativescript-barcodescanner";
import { CardIo } from "digitaltown-nativescript-card-io";
import { CreditCard } from "digitaltown-nativescript-card-io/card-io.common";

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
        this.barcodeScanner.scan({
            formats: "QR_CODE, CODE_39",
            beepOnScan: true,
        }).then(r => {
            console.log("scan result:");
            console.log(r.format, r.text);
            this.scanValue = r.text;
        });
    }

    card() {
        const cardIo = new CardIo();

        cardIo.scan({
            android: {
                requireExpiry: true,
                requireCvv: true,
                requirePostalCode: false,
                returnCardImage: false,
                usePaypalActionbarIcon: false
            }
        }).then((result: CreditCard) => {
            console.log("CARD.IO RESULT >>> ", result);
            this.scanValue = result.content;
        }, error => {
            console.log("CARD.IO ERROR >>> ", error);
        });
    }
}
