IPv4.js
-------

```
npm install ipv4.js
```

Examples
--------

```js
var ipv4 = require('ipv4.js');
```

```js
ipv4.atoi('192.168.0.1')  // -1062731775
ipv4.ntoa(0xffffffff)  // '255.255.255.255'
ipv4.not('255.255.0.0') // '0.0.255.255'
ipv4.or('1.1.0.0', '0.0.1.1')  // '1.1.1.1'
ipv4.next('192.168.0.1')  // '192.168.0.2'
```
