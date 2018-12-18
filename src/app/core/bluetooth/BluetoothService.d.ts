import { BluetoothDevice } from "./BluetoothDevice";

export declare class BluetoothService {
    isConnected(): boolean;
    start(): void;
    stop(): void;
    getPairedDevices(): BluetoothDevice[];
    connect(name: string): void;
    send(message: string): void;
}