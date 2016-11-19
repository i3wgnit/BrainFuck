function add( num ) {
    var str = "";
    for ( var i = 0; i < Math.abs( num ); i++ ) {
        str += ( Math.sign( num ) ).toString( 10 ).charAt( 0 ).replace( /1/, "+" );
    }
    return str;
}

function write( str ) {

    // Setting up input as variable for later
    var input = str.split( "" ).map( function( el ) {
            return el.charCodeAt( 0 );
        } ),
        targets = [];

    // Setting up targets as unique chars
    for ( var i = 0; i < input.length; i += 1 ) {
        if ( targets.indexOf( input[i] ) < 0 ) {
            targets.push( input[i] );
        }
    }

    // Should solve for smallest positive integer k
    // let s and a be integers element of [-128,128]-{0}
    // s+ka mod 256 = 0
    function cycle( s, a ) {

        // GCD variables
        var _a = a,
            signA = Math.sign( _a ),
            _b = 256 * signA,

            // Temp for GCD
            t = _a,

            // xGCD variables
            x = 1,
            u = 0,

            // Temp for xGCD
            m;
        while ( _b !== 0 ) {

            // xGCD loop
            m = x;
            x = u;
            u = m - x * Math.floor( _a / _b );

            // Basic GCD
            _a = _b;
            _b = t % _b;
            t = _a;
        }

        // d = _a, x = x

        // k = -s * a-1 / d % ( 256 / d )
        // if ( isInt( s / d ) ) possible;
        if ( Number.isInteger( s / _a ) ) {
            return ( -s * x / _a + Math.pow( 2, 16 ) ) % ( 256 / _a * signA );
        }
        return -1;
    }

    // Should solve for smallest |i|+diff
    // where i is positive integer
    // let k and t be integer element of [1,255]
    // diff = |t-(k*i mod 256)|
    function targetsProps( k ) {
        var props = {};
        props.diffs = targets.slice();
        props.offts = targets.map( function() {
            return 0;
        } );
        for ( var i = -16; i <= 16; i++ ) {
            var n = ( k * i + Math.pow( 2, 16 ) ) % 256;
            targets.forEach( function( el, ix ) {
                var d = targets[ix] - n;
                if ( Math.abs( props.diffs[ix] ) + Math.abs( props.offts[ix] ) >
                    Math.abs ( d ) + Math.abs( i ) ) {
                    props.diffs[ix] = d;
                    props.offts[ix] = i;
                }
            } );
        }
        return props;
    }

    // Listing different start & add options
    var list = [];
    for ( var i = -128; i <= 128; i++ ) {
        for ( var j = -128; j <= 128; j++ ) {
            var k = cycle( i, j );
            if ( k > 0 ) {

                // Add case to list
                var obj = { start: i,
                           add: j,
                           cycle: k };
                obj.char = Math.abs( i ) + Math.abs( j );

                list.push( obj );
            }
        }
    }

    // Sorting by cycle, then by char
    list = list.sort( function( a, b ) {
        var n = a.cycle - b.cycle;
        if ( n !== 0 ) {
            return n;
        }

        return a.char - b.char;
    } );

    // Loop through list[] for unique [cycle]
    var unq = [];
    for ( var i = 0; i < list.length; ) {
        unq.push( list[i] );
        var n = unq.slice( -1 )[0].cycle;
        for ( ; i < list.length; i += 1 ) {
            if ( list[i].cycle != n ) {
                break;
            }
        }
    }

    // Updating char and cycle to include diffs and offts
    unq.forEach( function( el ) {
            var props = targetsProps( el.cycle ),
                d = props.diffs.reduce( function( prev, nxt ) {
                        return prev + Math.abs( nxt );
                    }, 0 ),
                o = props.offts.reduce( function( prev, nxt ) {
                        return prev + Math.abs( nxt );
                    }, 0 );
            el.diffs = props.diffs;
            el.offts = props.offts;

            el.char += d + o;
            el.cycle *= o;
        } );

    // Then sort by char, then by cycle
    unq = unq.sort( function( a, b ) {
        var n = a.char - b.char;
        if ( n !== 0 ) {
            return n;
        }

        return a.cycle - b.cycle;
    } );

    // Create Output in string form
    var best = unq[0],
        bf = "";
    bf += add( best.start ) + "[";

    // Declarative instead of Functional for order
    for ( var i = 0; i < best.offts.length; i += 1 ) {
        bf += ">" + add( best.offts[i] );
    }
    best.offts.forEach( function() {
        bf += "<";
    } );
    bf += add( best.add ) + "]>";

    var curr = 0,
        set = {};
    for ( var i = 0; i < input.length; i += 1 ) {
        var l = targets.indexOf( input[i] ),
            sign = Math.sign( l - curr );
        for ( ; curr != l; curr += sign ) {
            bf += sign > 0 ? ">" : "<";
        }
        if ( typeof set[curr] === "undefined" ) {
            bf += add( best.diffs[curr] );
            set[curr] = true;
        }
        bf += ".";
    }
    return bf;
}
