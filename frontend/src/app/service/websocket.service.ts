import { Injectable, OnInit, OnDestroy } from '@angular/core';
import * as Rx from 'rxjs';
import { BpmnaiService } from './bpmnai.service';

@Injectable()
export class WebsocketService implements OnInit, OnDestroy {
    private subject: Rx.Subject<MessageEvent>;
    private wsUrl = 'ws://localhost:7000/ws';
    private ws: WebSocket;

    private connected = false;
    private intervalId = null;

    constructor(private bpmnaiService: BpmnaiService) { }

    ngOnInit(): void {
        this.connect();
    }

    public isConnected() {
        return this.connected;
    }

    private setConnected(wsState: boolean) {
        this.connected = wsState;
        this.bpmnaiService.shareWsConnectionStatus(wsState);
    }

    private resetInterval() {
        this.setConnected(true);
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    public connect(): Rx.Subject<MessageEvent> {
        if (!this.subject) {
            this.subject = this.create(this.wsUrl);
        }

        return this.subject;
    }

    private create(url): Rx.Subject<MessageEvent> {
        this.ws = new WebSocket(url);

        this.ws.onopen = () => {
            console.log(`Websocket is connected to ${this.wsUrl}`);

            this.resetInterval();
        };

        this.ws.onmessage = (data) => {
            this.bpmnaiService.handleMessage(data.data);
        };

        this.ws.onclose = () => {
            this.setConnected(false);
            this.subject = null;
            console.log(`Websocket is disconnected from ${this.wsUrl}. Trying again in 3 seconds`);


            if (!this.intervalId) {
                this.intervalId = setInterval(() => {
                    this.connect();
                }, 3000);
            }
        };

        const observable = Rx.Observable.create((obs: Rx.Observer<MessageEvent>) => {
            // this.ws.onmessage = obs.next.bind(obs);
            this.ws.onerror = obs.error.bind(obs);
            // this.ws.onclose = obs.complete.bind(obs);
            return this.ws.close.bind(this.ws);
        });
        const observer = {
            next: (data: Object) => {
                if (this.ws.readyState === WebSocket.OPEN) {
                    this.ws.send(JSON.stringify(data));
                }
            },
        };

        return Rx.Subject.create(observer, observable);
    }

    public disconnect() {
        this.ws.close();
    }

    ngOnDestroy(): void {
        this.disconnect();
        this.subject.unsubscribe();
    }
}
