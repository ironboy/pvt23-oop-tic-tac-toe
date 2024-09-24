let urlPrefix = 'https://sse.nodehill.com';
let token;

export default class Network {

  static startConnection(_user, _channel, listener) {

    const user = _user, channel = _channel;

    const eventSource = new EventSource(urlPrefix + `/api/listen/${channel}/${user}/0`);

    eventSource.addEventListener('token', event => {
      token = JSON.parse(event.data);
    });

    eventSource.onmessage = event => {
      listener(JSON.parse(event.data));
    }

    eventSource.onerror = error => {
      eventSource.close();
    }
  }

  static async send(message) {
    return await (await fetch(urlPrefix + `/api/send/${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
      mode: 'cors'
    })).json();
  }

}