import { TPricePrecision } from "src/store/reducers/book";

type TBitfinexInfoMessage = {
  event: "info";
  platform: { status: number };
  serverId: string;
  version: 2;
};

type TBitfinexSubscribeMessage = {
  event: "subscribed";
  channel: string;
  chanId: number;
};

type TBitfinexUnsubscribeMessage = {
  event: "unsubscribed";
  channel: string;
};

export type TBitfinexBookEntry = [number, number, number];
type TBitfinexBookResult = TBitfinexBookEntry | TBitfinexBookEntry[];

type TBitfinexMessage =
  | TBitfinexInfoMessage
  | TBitfinexSubscribeMessage
  | TBitfinexUnsubscribeMessage;

type TBitfinexSubscribeRequest = {
  event: "subscribe";
  channel: "book";
  [key: string]: string;
};

type TBitfinexUnsubscribeRequest = {
  event: "unsubscribe";
  chanId: number;
};

class BitfinexSocket {
  private sock: WebSocket;
  private chanId: number;
  private subscribed = false;
  private precision: TPricePrecision = 0;

  private bookCallback: (data: TBitfinexBookEntry[]) => void;
  private subscriptionCallback: (subscribed: boolean) => void;

  constructor() {
    this.sock = new WebSocket(`wss://api-pub.bitfinex.com/ws/2`);
    this.sock.addEventListener("open", () => {
      console.log(`Socket opened.`);
      this.subscribe();
    });

    this.sock.addEventListener("close", () => {
      console.log(`Socket closed.`);
    });

    this.sock.addEventListener("message", (message) =>
      this.onMessage(JSON.parse(message.data))
    );
  }

  private subscribe() {
    const subscribeRequest: TBitfinexSubscribeRequest = {
      event: "subscribe",
      channel: "book",
      symbol: "tBTCUSD",
      prec: "P" + this.precision,
      freq: "F0",
      len: "25",
      subId: "kyle-windsor",
    };

    this.sock.send(JSON.stringify(subscribeRequest));
  }

  private onMessage(message: any) {
    if (message.event) {
      let data = message as TBitfinexMessage;
      if (data.event === "subscribed") {
        this.chanId = data.chanId;
        console.log(`Subscribed to channel ${this.chanId}.`);
        this.subscribed = true;
        if (this.subscriptionCallback) {
          this.subscriptionCallback(true);
        }
      } else if (data.event === "unsubscribed") {
        console.log(`Unsubscribed to channel ${this.chanId}.`);
        this.subscribed = false;
        this.chanId = undefined;
        if (this.subscriptionCallback) {
          this.subscriptionCallback(false);
        }
        this.subscribe();
      } else if (data.event === "info") {
        console.log(`Socket info received.`);
      } else {
        console.error(data);
      }
    } else {
      if (message[0] === this.chanId) {
        if (message[1] === "hb") {
          // do nothing
        } else {
          let data = message[1] as TBitfinexBookResult;
          let arr: TBitfinexBookEntry[] = [];
          if (data.length > 3) {
            // todo figure out something better to identify this as a book entry vs snapshot
            arr = data as TBitfinexBookEntry[];
          } else {
            arr = [data as TBitfinexBookEntry];
          }

          if (this.bookCallback) {
            this.bookCallback(arr);
          }
        }
      }
    }
  }

  public onBookData(callback: typeof this.bookCallback) {
    this.bookCallback = callback;
  }

  public onSubscriptionChanged(callback: typeof this.subscriptionCallback) {
    this.subscriptionCallback = callback;
  }

  public setPricePrecision(precision: TPricePrecision) {
    this.precision = precision;

    if (this.sock && this.sock.readyState === 1) {
      const subscribeRequest: TBitfinexUnsubscribeRequest = {
        event: "unsubscribe",
        chanId: this.chanId,
      };

      this.sock.send(JSON.stringify(subscribeRequest));
    }
  }
}

export default BitfinexSocket;
