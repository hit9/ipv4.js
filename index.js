'use strict';

var util          = require('util');
var createError   = require('create-error.js');

// errors
var AddressError      = createError('AddressError');
var AddressTypeError  = createError('AddressTypeError', AddressError);
var AddressValueError = createError('AddressValueError', AddressError);

// address to integer
function aton(addr) {
  if (typeof addr !== 'string')
    throw new AddressTypeError('string required');

  var octs = addr.split('.');

  if (octs.length !== 4)
    throw new AddressValueError('4 octects required');

  var num = 0;

  for (var i = 0; i < 4; i++) {
    var oct = octs[i];
    var octi = parseInt(oct, 10);
    var octn = +oct;

    if (octi !== octn || octi !== (octi & 0xff) ||
        octi.toString() !== oct)
      throw AddressValueError(util.format('bad octect %s', oct));

    num += octi << ((4 - 1 - i) * 8);
  }
  return num;
};

// integer to string
function ntoa(num) {
  if (typeof num !== 'number' || num !== parseInt(num, 10))
    throw new AddressTypeError('integer required');

  var octs = [];

  for (var i = 0; i < 4; i++) {
    var oct = (num >> ((4 - 1 - i) * 8)) & 0xff;
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

// exports
exports.aton              = aton;
exports.ntoa              = ntoa;
exports.not               = not;
exports.or                = or;
exports.AddressError      = AddressError;
exports.AddressTypeError  = AddressTypeError;
exports.AddressValueError = AddressValueError;
