export default class EventSocket extends WebSocket {
    listeners = {};
    #connectedResolve;
    connectedSignal = new Promise(r => this.#connectedResolve = r);
    constructor(...args) {
        super(...args);

        this.onopen = () => {
            console.log("Connected to socket server.");
            this.#connectedResolve();
        }
        this.onmessage = (msg) => {
            try {
                msg = JSON.parse(msg.data);
            } catch {
                console.error("Non JSON message:", msg);
            }
            if (this.listeners[msg.event]?.length)
                for (const listener of this.listeners[msg.event])
                    listener(msg?.data || msg);
        }
        this.onclose = () => {
            console.log("Disconnected from socket server.");
            throw new Error("Socket connection closed.");
        }
        this.onerror = (err) => {
            console.error("Socket error:", err);
            throw new Error("Socket error.");
        }
    }

    on(event, callback) {
        this.listeners[event] ||= [];
        this.listeners[event].push(callback.bind(this));
    }

    once(event, callback) {
        function fn() {
            callback.apply(this, arguments);
            this.listeners[event].splice(this.listeners[event].indexOf(fn), 1);
        }
        this.on(event, fn);
    }

    emit(event, data) {
        this.send(JSON.stringify({
            event,
            data
        }));
    }
}