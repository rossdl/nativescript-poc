import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { ParkingEvent } from "../core/event-service/EventModels";
import { EventService } from "../core/event-service/EventService";
import { GestureEventData } from "tns-core-modules/ui/gestures/gestures";

@Component({
    selector: "Home",
    moduleId: module.id,
    templateUrl: "./home.component.html"
})
export class HomeComponent implements OnInit {
    items: Array<ParkingEvent>;

    constructor(private eventService: EventService, private router: RouterExtensions) { }

    ngOnInit(): void {
        this.loadEvents();
    }

    onRefresh(args: GestureEventData): void {
        this.loadEvents();
    }

    private loadEvents(): void {
        this.eventService.getEvents().then(events => {
            this.items = events
        });
    }
}
