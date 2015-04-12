IPv4.js
-------

IPv4 utils for nodejs/iojs.

```
npm install ipv4.js
```

Examples
--------

```js
var ipv4 = require('ipv4.js');
```

```js
ipv4.aton('192.168.0.1')  // -1062731775
ipv4.ntoa(0xffffffff)  // '255.255.255.255'
ipv4.not('255.255.0.0') // '0.0.255.255'
ipv4.or('1.1.0.0', '0.0.1.1')  // '1.1.1.1'
ipv4.xor('0.255.255.255', '192.255.255.255') // '192.0.0.0'
ipv4.next('192.168.0.1')  // '192.168.0.2'
ipv4.prev('192.168.0.1')  // '192.168.0.0'
ipv4.network('192.168.0.0/24')
// => 
// { address: '192.168.0.0',
//   bitmask: 24,
//   mask: '255.255.255.0',
//   hostmask: '0.0.0.255',
//   broadcast: '192.168.0.255',
//   first: '192.168.0.1',
//   last: '192.168.0.254',
//   size: 254 }
```

License
--------

MIT. (c) Chao Wang <hit9@icloud.com>
