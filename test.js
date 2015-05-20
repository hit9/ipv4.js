var assert = require('assert');
var ntt = require('ntt');
var ipv4 = require('./index');

var runTest = function(fn, cases) {
  for (var i = 0; i < cases.length; i++) {
    var item = cases[i];
    var got = fn.apply(null, item.args);
    assert.deepEqual(got, item.except);
  }
};

ntt('ipv4.js', function(test) {
  test('aton', function(done) {
    runTest(ipv4.aton, [
      {args: ['0.0.0.0'], except: 0},
      {args: ['0.0.0.255'], except: 0xff},
      {args: ['0.0.1.0'], except: 0x100},
      {args: ['192.168.0.1'], except: 3232235521},
      {args: ['0.255.255.255'], except: 0x00ffffff},
      {args: ['255.255.255.255'], except: 0xffffffff},
    ]);
    done();
  });

  test('ntoa', function(done) {
    runTest(ipv4.ntoa, [
      {args: [0], except: '0.0.0.0'},
      {args: [0xff], except: '0.0.0.255'},
      {args: [0xffff], except: '0.0.255.255'},
      {args: [0xffffff], except: '0.255.255.255'},
      {args: [0xffffffff], except: '255.255.255.255'},
    ]);
    done();
  });

  test('not', function(done) {
    runTest(ipv4.not, [
      {args: ['0.0.0.0'], except: '255.255.255.255'},
      {args: ['0.0.1.1'], except: '255.255.254.254'},
      {args: ['1.1.1.1'], except: '254.254.254.254'},
      {args: ['255.255.0.0'], except: '0.0.255.255'},
    ]);
    done();
  });

  test('or', function(done) {
    runTest(ipv4.or, [
      {args: ['0.0.0.0', '255.255.0.0'], except: '255.255.0.0'},
      {args: ['0.0.1.1', '1.1.0.0'], except: '1.1.1.1'},
      {args: ['1.1.1.1', '254.254.254.254'], except: '255.255.255.255'},
      {args: ['255.255.0.0', '0.0.255.255'], except: '255.255.255.255'},
    ]);
    done();
  });

  test('xor', function(done) {
    runTest(ipv4.xor, [
      {args: ['0.255.255.255', '255.255.255.255'], except: '255.0.0.0'},
      {args: ['192.255.255.255', '255.255.255.255'], except: '63.0.0.0'},
    ]);
    done();
  });

  test('prev', function(done) {
    runTest(ipv4.prev, [
      {args: ['255.255.255.255'], except: '255.255.255.254'},
      {args: ['0.0.0.0'], except: '255.255.255.255'},
      {args: ['0.0.0.1'], except: '0.0.0.0'},
      {args: ['192.168.0.1'], except: '192.168.0.0'},
    ]);
    done();
  });

  test('next', function(done) {
    runTest(ipv4.next, [
      {args: ['255.255.255.255'], except: '0.0.0.0'},
      {args: ['0.0.0.0'], except: '0.0.0.1'},
      {args: ['0.0.0.1'], except: '0.0.0.2'},
      {args: ['192.168.0.1'], except: '192.168.0.2'},
    ]);
    done();
  });

  test('network', function(done) {
    runTest(ipv4.network, [
      {args: ['192.168.0.0/24'], except: {
        address: '192.168.0.0',
        bitmask: 24,
        mask: '255.255.255.0',
        hostmask: '0.0.0.255',
        broadcast: '192.168.0.255',
        first: '192.168.0.1',
        last: '192.168.0.254',
        size: 254,
      }},
    ]);
    done();
  });
});
