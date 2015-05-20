'use strict';

var util          = require('util');
var createError   = require('create-error.js');

// errors
var IPv4Error      = createError('IPv4Error');
var IPv4TypeError  = createError('IPv4TypeError', IPv4Error);
var IPv4ValueError = createError('IPv4ValueError', IPv4Error);
var NetValueError  = createError('NetValueError', IPv4Error);

// address to integer
function aton(addr) {
  if (typeof addr !== 'string')
    throw new IPv4TypeError('string required');

  if (addr.length > 15)
    throw new IPv4ValueError('addr too long');

  var octs = addr.split('.');

  if (octs.length !== 4)
    throw new IPv4ValueError('4 octects required');

  var num = 0;

  for (var i = 0; i < 4; i++) {
    var oct = octs[i];
    var octi = parseInt(oct, 10);
    var octn = +oct;

    if (octi !== octn || octi !== (octi & 0xff) ||
        octi.toString() !== oct)
      throw IPv4ValueError(util.format('bad octect %s', oct));

    num += octi << ((4 - 1 - i) * 8) >>> 0;
  }

  return num;
};

// integer to string
function ntoa(num) {
  if (typeof num !== 'number' || num !== parseInt(num, 10))
    throw new IPv4TypeError('integer required');

  num = num >>> 0;

  var octs = [];

  for (var i = 0; i < 4; i++) {
    var oct = (num >> ((4 - 1 - i) * 8) >>> 0) & 0xff;
    octs.push(oct);
  }
  return octs.join('.');
}

// '0.0.255.255' => '255.255.0.0'
function not(addr) {
  return ntoa(aton(addr) ^ 0xffffffff);
}

// '0.0.1.1', '1.1.0.0'=> '1.1.1.1'
function or(addra, addrb) {
  return ntoa(aton(addra) | aton(addrb));
}

// '0.255.255.255', '192.255.255.255' => '192.0.0.0'
function xor(addra, addrb) {
  return ntoa(aton(addra) ^ aton(addrb));
}

// next ip address
function next(addr, incr) {
  return ntoa(aton(addr) + (incr || 1));
}

// prev ip address
function prev(addr, decr) {
  return ntoa(aton(addr) - (decr || 1));
}

// build network
function network(_net) {
  var list = _net.split('/')

  if (list.length !== 2)
    throw new NetValueError('bad network');

  var net = {};

  net.address = list[0];
  net.bitmask = +list[1];

  if (parseInt(net.bitmask, 10) !== net.bitmask ||
      (net.bitmask & 31) !== net.bitmask)
    throw new NetValueError('bad bitmask');

  net.mask = ntoa(0xffffffff >> (32 - net.bitmask)
              << (32 - net.bitmask))
  net.hostmask = not(net.mask);
  net.broadcast = or(net.address, net.hostmask);
  net.first = next(xor(net.hostmask, net.broadcast));
  net.last = prev(net.broadcast);
  net.size = aton(net.last) - aton(net.first) + 1;
  return net;
}

// exports
exports.aton           = aton;
exports.ntoa           = ntoa;
exports.not            = not;
exports.or             = or;
exports.xor            = xor;
exports.next           = next;
exports.prev           = prev;
exports.network        = network;
exports.IPv4Error      = IPv4Error;
exports.IPv4TypeError  = IPv4TypeError;
exports.IPv4ValueError = IPv4ValueError;
exports.NetValueError  = NetValueError;
