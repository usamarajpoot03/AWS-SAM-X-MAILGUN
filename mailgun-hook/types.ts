export interface Signature {
    timestamp: number;
    token: string;
    signature: string;
}

export interface EventData {
    id: string;
    timestamp: number;
    event: string;
}

export interface MailgunEvent {
    signature: Signature;
    'event-data': EventData;
}

export interface EventNotification {
    Provider: string;
    timestamp: number;
    type: string;
} 