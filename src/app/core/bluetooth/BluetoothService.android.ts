import { Injectable } from "@angular/core";
import app = require('application');
import { BluetoothDevice } from "./BluetoothDevice";

declare let me: any;

@Injectable()
export class BluetoothService {
    private bluetooth: any;
    private connectedName: string = null;

    private readonly className: string = this.constructor.name;

    constructor() { 
        console.log('hey', this.className);
    }

    isConnected(): boolean {
        return this.bluetooth.isConnected();
    }

    start() {
        try {
            console.log('startBluetooth');

            if (me.aflak.bluetooth.Bluetooth) {
                this.bluetooth = new me.aflak.bluetooth.Bluetooth(app.android.context);
                this.bluetooth.onStart();
                this.bluetooth.enable();
            }
        }
        catch (e) {
            this.logError("start", e);
        }
    }

    stop() {
        try {
            console.log('stopBluetooth');

            if (this.bluetooth) {
                this.bluetooth.onStop();
            }
        }
        catch (e) {
            this.logError("stop", e);
        }
    }

    getPairedDevices(): BluetoothDevice[] {
        if (!this.bluetooth) {
            return new Array<BluetoothDevice>();
        }

        let devices = new Array<BluetoothDevice>();
        let pairedDevices = this.bluetooth.getPairedDevices() as java.util.List<android.bluetooth.BluetoothDevice>;
        for (let i = 0; i < pairedDevices.size(); i++) {
            let dev = pairedDevices.get(i);
            devices.push(new BluetoothDevice(dev.getName(), dev.getAddress()));
        }

        return devices;
    }       

    connect(name: string) {
        // PoC of course
        try {
            if (this.connectedName !== name) {
                if (this.isConnected()) {
                    console.log(`Disconnect from ${this.connectedName}`);
                    this.bluetooth.disconnect();
                }

                console.log(`Connect to ${name}`);
                this.bluetooth.connectToName(name, true);
            }

            let attempt = 0;
            while (!this.bluetooth.isConnected() && attempt < 20) {
                this.sleep(500);
                attempt++;
            }

            if (!this.bluetooth.isConnected()) {
                console.log('can\'t connect, try again');
                this.reset();
                return;
            }

            this.connectedName = name;
        }
        catch (e) {
            this.logError("connect", e);
        }
    }

    send(message: string): void {
        this.bluetooth.send(message, null);
    }

    private reset() {
        console.log('reset');
        this.bluetooth.onStop();
        this.sleep(500);
        this.bluetooth.onStart();
        this.sleep(500);
        this.bluetooth.enable();
    }

    private sleep(ms: number): void {
        java.lang.Thread.sleep(ms);
    }

    private logError(method: string, e: any) {
        console.log(`************ ERROR ${this.className}.${method} ************`)
        console.log(e);
    }
}