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

export type TBitfinexBookEntry = [number, number, number];
type TBitfinexBookResult = TBitfinexBookEntry | TBitfinexBookEntry[];

type TBitfinexMessage = TBitfinexInfoMessage | TBitfinexSubscribeMessage;

type TBitfinexSubscribeRequest = {
  event: "subscribe";
  channel: string;
  [key: string]: string;
};

class BitfinexSocket {
  private sock: WebSocket;
  private chanId: number;
  private bookCallback: (data: TBitfinexBookEntry[]) => void;

  constructor() {
    this.sock = new WebSocket(`wss://api-pub.bitfinex.com/ws/2`);
    this.sock.addEventListener("open", () => {
      console.log(`Socket opened.`);

      const subscribeRequest: TBitfinexSubscribeRequest = {
        event: "subscribe",
        channel: "book",
        symbol: "tBTCUSD",
        prec: "P0",
        freq: "F0",
        len: "25",
        subId: "kyle-windsor",
      };

      this.sock.send(JSON.stringify(subscribeRequest));
    });

    this.sock.addEventListener("close", () => {
      console.log(`Socket closed.`);
    });

    this.sock.addEventListener("message", (message) =>
      this.onMessage(JSON.parse(message.data))
    );
  }

  private onMessage(message: any) {
    if (message.event) {
      let data = message as TBitfinexMessage;
      if (data.event === "subscribed") {
        this.chanId = data.chanId;
        console.log(`Subscribed to channel ${this.chanId}.`);
      } else if (data.event === "info") {
        console.log(`Socket info received.`);
      } else {
        console.error(data);
      }
    } else {
      if (message[0] === this.chanId) {
        let data = message[1] as TBitfinexBookResult;
        let arr: TBitfinexBookEntry[] = [];
        if (data.length > 3) {
          // todo figure out something better
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

  public onBookData(callback: typeof this.bookCallback) {
    this.bookCallback = callback;
  }
}

export default BitfinexSocket;
