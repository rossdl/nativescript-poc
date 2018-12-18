import { Injectable } from "@angular/core";
import { getJSON } from "tns-core-modules/http";
import { ParkingEvent } from "./EventModels";

@Injectable()
export class EventService { 
    private readonly rootUrl: string = "http://192.168.125.59/OPUsite/EPServer/Api/SiteConfigEvents/"

    constructor() { }

    getEvents(): Promise<ParkingEvent[]> {
        console.log('get-events');
        return this.get("SiteEvents");
    }

    getEventRates(): Promise<any> {
        console.log('get-event-rates');
        return Promise.all([this.get("EventRates"), this.get("SiteRates")]);
    }

    private get<T>(api: string): Promise<T> {
        return getJSON(`${this.rootUrl}${api}`);
    }
}