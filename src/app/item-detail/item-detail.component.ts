import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ParkingEvent, SiteRate, EventRate } from "../core/event-service/EventModels";
import { EventService } from "../core/event-service/EventService";

@Component({
    selector: "ItemDetail",
    moduleId: module.id,
    templateUrl: "./item-detail.component.html"
})
export class ItemDetailComponent implements OnInit {
    item: ParkingEvent;
    rates: Array<SiteRate>;

    constructor(
        private eventService: EventService,
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        const id = this.route.snapshot.params.id;
        this.eventService.getEvents().then(events => {
            this.item = events.find(e => e.EventID === id);
            this.eventService.getEventRates().then(data => {
                let eventRates: EventRate[] = data[0];
                let siteRates: SiteRate[] = data[1];
                let rateIds = eventRates.filter(r => r.EventID === id).map(r => r.RateID);
                this.rates = siteRates.filter(r => rateIds.indexOf(r.RateID) !== -1);
            })
        });
    }
}
