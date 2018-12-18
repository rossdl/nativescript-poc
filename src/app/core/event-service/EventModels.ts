export class ParkingEvent {
    EventID: string;
    EventDesc: string;
    EventStart: string;
    EventEnd: string;
    IsDefault: boolean;
    LastUpdated: string;
    AllowReEntry: boolean;
    ReEntryTimeout: number;
    AllowPassback: boolean;
    PassbackTimeout: number;
}

export class EventRate {
    EventID: string;
    LotID: number;
    RateID: number;
}

export class SiteRate {
    RateID: number;
    RateStart: string;
    RateEnd: string;
    Fee: number;
    RateName: string;
}
