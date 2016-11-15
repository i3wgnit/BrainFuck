function add( num ) {
    var str = "";
    for ( i = 0; i < Math.abs( num ); i++ ) {
        str += ( Math.sign( num ) ).toString( 10 ).charAt( 0 );
    }
    return str;
}

function write( str ) {
    var poss = [],
        unq = [],
        buff = [],
        bf = "";

    // Setting up input as variable for later parsing
    var input = str,
        rst = "";

    // Setting up rst as unique chars
    input.split( "" )
        .forEach( function( el ) {
        if ( rst.search( el ) < 0 ) {
            rst += el;
        }
    } );
    rst = rst.split( "" ).sort().join( "" );

    // Setting up targets from rst charcode
    var targets = rst.split( "" )
        .map( function( el ) {
        return el.charCodeAt( 0 );
    } );

    // Should solve for smallest positive integer k
    // let s and a be integers element of [-16,16]-{0}
    // s+ka mod 256 = 0
    function cycle( s, a ) {
        var k = 0, sum = s % 256;
        for ( ; ( k < 256 ) && ( sum != 0 ); k++ ) {
            sum = ( sum + a + 256 ) % 256;
        }
        if ( sum != 0 ) {
            return -1;
        }
        return k;
    }

    // Should solve for smallest |i|+diff
    // where i is positive integer
    // let k and t be integer element of [1,255]
    // diff = |t-(k*i mod 256)|
    function targetsProps( k ) {
        var props = [], i = -16;
        props[0] = targets.slice();
        props[1] = targets.slice();
        for ( ; i <= 16; i++ ) {
            var n = ( k * i + Math.pow( 2, 16 ) ) % 256;
            targets.forEach( function( el, ix ) {
                var d = Math.abs( targets[ix] - n );
                if ( props[0][ix] + Math.abs( props[1][ix] ) > d + Math.abs( i ) ) {
                    props[0][ix] = d;
                    props[1][ix] = i;
                }
            } );
        }
        return props;
    }

    // Listing different start, add options
    for ( var i = -128; i <= 128; i++ ) {
        for ( var j = -128; j <= 128; j++ ) {
            var k = cycle( i, j );
            if ( k > 0 ) {
                poss.push( [ i, j, k, Math.abs( i ) + Math.abs( j ) ] );
            }
        }
    }
    poss.sort( function( a, b ) {
        return a[3] - b[3];
    } ).forEach( function( el ) {
        if ( unq.indexOf( el[2] ) < 0 ) {
            var props = targetsProps( el[2] ),
                t = el[3] + props.reduce( function( a, b ) {
                    var _a = a.slice().reduce( function( c, d ) {
                            return c + d;
                        }, 0 ),
                        _b = b.slice().reduce( function( e, f ) {
                            return Math.abs( e ) + Math.abs( f );
                        }, 0 );
                    return _a + _b;
                } );

            unq.push( el[2] );
            buff.push( el );

            el.push( props, t )
        }
    } );

    bfff = buff.sort( function( a, b ) {
        return a[5] - b[5];
    } );
    bff = bfff[0];
    bf += add( bff[0] ) + "[";
    for ( var i = 0; i < bff[4][1].length; i++ ) {
        bf += ">" + add( bff[4][1][i] );
    }
    for ( var i = 0; i < bff[4][1].length; i++ ) {
        bf += "<";
    }
    bf += add ( bff[1] ) + "]";
    console.log( targets, bff[4][0] );
    return bf.replace( /1/gi, "+" );
}
