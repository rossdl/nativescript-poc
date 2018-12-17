import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";

import { AppRoutingModule, COMPONENTS } from "./app-routing.module";
import { AppComponent } from "./app.component";

import { BarcodeScanner } from 'nativescript-barcodescanner';
import { BluetoothService } from "./services/bluetooth/BluetoothService";

@NgModule({
    bootstrap: [
        AppComponent
    ],
    imports: [
        NativeScriptModule,
        AppRoutingModule
    ],
    declarations: [
        AppComponent,
        ...COMPONENTS
    ],
    providers: [
        BluetoothService,
        BarcodeScanner
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class AppModule { }
