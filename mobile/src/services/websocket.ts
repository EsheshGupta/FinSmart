/**
 * WebSocket client for live 10-minute price ticks
 */
export class PriceSocket {
  private ws: WebSocket | null = null;

  connect(token: string, onMessage: (data: unknown) => void) {
    this.ws = new WebSocket(
      `${process.env.FINSMART_WS_URL ?? 'ws://localhost:8000'}/ws/prices?token=${token}`
    );
    this.ws.onmessage = e => onMessage(JSON.parse(e.data));
  }

  disconnect() {
    this.ws?.close();
  }
}
