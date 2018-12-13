import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, Subscription } from "rxjs";
import { distinctUntilChanged } from 'rxjs/operators';
import { Peripheral, StartScanningOptions } from "nativescript-bluetooth";
import bluetooth = require('nativescript-bluetooth');
import app = require('application');

declare let me: any;

@Component({
    selector: "Browse",
    moduleId: module.id,
    templateUrl: "./browse.component.html"
})
export class BrowseComponent implements OnInit, OnDestroy {
    private omarBluetooth: any;

    isEnabledSubscription: Subscription;
    isBluetoothEnabled = false;

    private readonly cmdPrint = "print";
    private readonly cmdGate = "gate";

    devices: any[];

    constructor(private router: Router) {
        //bluetooth.setCharacteristicLogging(false);
    }

    ngOnInit() {
        //bluetooth.requestCoarseLocationPermission();

        this.isEnabledSubscription = this.listenToBluetoothEnabled()
            .pipe(distinctUntilChanged())
            .subscribe(enabled => this.isBluetoothEnabled = enabled);

        this.omarStartBluetooth();
    }

    ngOnDestroy(): void {
        this.isEnabledSubscription.unsubscribe();
        this.omarStopBluetooth();
    }

    public listenToBluetoothEnabled(): Observable<boolean> {
        return new Observable(observer => {
            bluetooth.isBluetoothEnabled()
                .then(enabled => observer.next(enabled))

            let intervalHandle = setInterval(
                () => {
                    bluetooth.isBluetoothEnabled()
                        .then(enabled => observer.next(enabled))
                }
                , 1000);

            // stop checking every second on unsubscribe
            return () => clearInterval(intervalHandle);
        });
    }

    addDevice(name: string, UUID: string) {
        this.devices.push({ name, UUID });
    }

    omarStartBluetooth() {
        try {
            console.log('omarStartBluetooth');
            //console.dir(me.aflak.bluetooth.Bluetooth);

            //console.log('android context');
            //console.dir(app.android.context);

            if (me.aflak.bluetooth.Bluetooth) {
                this.omarBluetooth = new me.aflak.bluetooth.Bluetooth(app.android.context);
                this.omarBluetooth.onStart();
                this.omarBluetooth.enable();
            }
        }
        catch (e) {
            console.log('************ omarStartBluetooth ERROR ************')
            console.log(e);
        }
    }

    omarStopBluetooth() {
        try {
            console.log('omarStopBluetooth');

            if (this.omarBluetooth) {
                this.omarBluetooth.onStop();
            }
        }
        catch (e) {
            console.log('************ omarStopBluetooth ERROR ************')
            console.log(e);
        }
    }

    omarGetDevices() {
        if (!this.omarBluetooth) {
            return new java.util.ArrayList<android.bluetooth.BluetoothDevice>();
        }
        return this.omarBluetooth.getPairedDevices() as java.util.List<android.bluetooth.BluetoothDevice>;
    }    

    omarListDevices() {
        try {
            console.log('omarListDevices');

            if (this.omarBluetooth) {
                let devicesOmr = this.omarGetDevices();
                console.log('devices found', devicesOmr.size());
                for (let i = 0; i < devicesOmr.size(); i++) {
                    let dev = devicesOmr.get(i);
                    let name: string = dev.getName();
                    let uuid: string = name.toLowerCase().includes('gate') ? this.cmdGate : this.cmdPrint;
                    let p: Peripheral = { name: name, UUID: uuid, RSSI: 1 };  // use existing Peripheral for now, little change to UI
                    this.devices.push(p);
                }
            }
        }
        catch (e) {
            console.log('************ omarListDevices ERROR ************')
            console.log(e);
        }
    }
    
    private connectedName: string = null;

    omarConnect(name: string, peripheral: string) {
        // PoC of course
        try {
            if (this.connectedName !== name) {
                if (this.omarBluetooth.isConnected()) {
                    console.log(`Disconnect from ${this.connectedName}`);
                    this.omarBluetooth.disconnect();
                }

                console.log(`Connect to ${name}`);
                this.omarBluetooth.connectToName(name, true);
            }

            let attempt = 0;
            while (!this.omarBluetooth.isConnected() && attempt < 20) {
                this.sleep(500);
                attempt++;
            }

            if (!this.omarBluetooth.isConnected()) {
                console.log('can\'t connect, try again');
                this.omarReset();
                return;
            }

            this.connectedName = name;

            let message = peripheral === this.cmdGate
                ? this.omarVendGateMessage()
                : this.omarPrintMessage();

            console.log('send message', message);
            this.omarBluetooth.send(message, null);
        }
        catch (e) {
            console.log('************ omarPrint ERROR ************')
            console.log(e);
        }
        finally {
            //this.omarBluetooth.disconnect();
        }
    }

    omarReset() {
        console.log('omarReset');
        this.omarBluetooth.onStop();
        this.sleep(500);
        this.omarBluetooth = new me.aflak.bluetooth.Bluetooth(app.android.context);
        this.omarBluetooth.onStart();
        this.sleep(500);
        this.omarBluetooth.enable();
    }

    omarPrintMessage(): string {
        let message = "ABC";
        // let message = "! 0 200 200 300 1\r\n";
        // message += "T 5 0 60 0 TEST MESSAGE\r\n";
        // message += "B QR 50 60 M 2 U 6\r\n";
        // message += "H4A,E123456789\r\n";
        // message += "ENDQR\r\n";
        // message += "PRINT\r\n";
        return message;
    }

    omarVendGateMessage(): string {
        return String.fromCharCode(1).concat('\n');
    }

    sleep(ms: number): void {
        java.lang.Thread.sleep(ms);
    }

    scan() {
        this.devices = [];

        // serviceUUIDs: ['ffe5'],
        // serviceUUIDs: ['0000ffe5-0000-1000-8000-00805f9b34fb'],
        // let options : StartScanningOptions = { 
        //     seconds: 3, 
        //     onDiscovered: (peripheral: Peripheral) => {
        //       if(peripheral.name) {
        //         console.log(`UUID: ${peripheral.UUID} name: ${peripheral.name}`)
        //         this.devices.push(peripheral);
        //       }
        //     },
        //     skipPermissionCheck: false
        // };
        // bluetooth.startScanning(options);

        this.omarListDevices();
    }

    connect(UUID: string) {
        bluetooth.connect({
            UUID: UUID,
            onConnected: (peripheral: Peripheral) => {
                // alert('Connected');
                this.router.navigate(['btprinter', UUID]);
            },
            onDisconnected: (peripheral: Peripheral) => {
                this.router.navigate(['browse']);
            }
        })
    }

    onItemTap(event$: any) {
        console.log(event$);
    }

    navigateToController(UUID: string) {
        this.router.navigate(['btprinter', UUID]);
    }
}
