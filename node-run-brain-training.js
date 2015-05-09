Net = require('../neurona/brain/net');

fs = require('fs');
try {
    var net = Net.from(require('./net-data.json'));
    console.log('loading brain from file...');
} catch (e) {
    var net = new Net([9, 9*9, 9*9*9, 9*9, 2]);
    console.log('creating new brain...');
}

var exiting = false;

function exitFunc() {
    if (exiting) return;
    exiting = true;
    saveBrain();
    process.exit();
}

function saveBrain() {
    console.log('saving brain to file...');
    fs.writeFileSync('./net-data.json', JSON.stringify(net));
}

//do something when app is closing
process.on('exit', exitFunc);

//catches ctrl+c event
process.on('SIGINT', exitFunc);

//catches uncaught exceptions
// process.on('uncaughtException', exitHandler.bind(null, {exit:true}));


function cc(func) {
    var a = 0,
        b = 0,
        c = 0,
        d = 0,
        e = 0,
        f = 0,
        g = 0,
        h = 0,
        i = 0;

    for (a = 0; a < 9; a++)
    for (b = 0; b < 9; b++)
    if (b !== a)
    for (c = 0; c < 9; c++)
    if (c !== a && c !== b)
    for (d = 0; d < 9; d++)
    if (d !== a && d !== b && d !== c)
    for (e = 0; e < 9; e++)
    if (e !== a && e !== b && e !== c && e !== d)
    if (!func([a,b,c,d,e]))
    for (f = 0; f < 9; f++)
    if (f !== a && f !== b && f !== c && f !== d && f !== e)
    if (!func([a,b,c,d,e,f]))
    for (g = 0; g < 9; g++)
    if (g !== a && g !== b && g !== c && g !== d && g !== e && g !== f)
    if (!func([a,b,c,d,e,f,g]))
    for (h = 0; h < 9; h++)
    if (h !== a && h !== b && h !== c && h !== d && h !== e && h !== f && h !== g)
    if (!func([a,b,c,d,e,f,g,h]))
    for (i = 0; i < 9; i++)
    if (i !== a && i !== b && i !== c && i !== d && i !== e && i !== f && i !== g && i !== h)
        func([a,b,c,d,e,f,g,h,i], true);
}

Array.prototype.odds = function() {
    var odds = [];
    for (var i = 1; i < this.length; i+=2) {
        odds.push(this[i]);
    }
    return odds;
};

Array.prototype.evens = function() {
    var evens = [];
    for (var i = 0; i < this.length; i+=2) {
        evens.push(this[i]);
    }
    return evens;
};

Array.prototype.scramble = function scramble() {
    var arr = [];

    for (var i = 0, j = this.length - 1; i < j; i++, j--) {
        if (Math.random() > 0.5) {
            arr.push(this[i]);
            arr.push(this[j]);
        } else {
            arr.push(this[j]);
            arr.push(this[i]);
        }
    }
    return arr;
};

function pb (a) {
    console.log(a.slice(0,3).join(' ').replace(/\-1/g, 'O').replace(/1/g, 'X').replace(/0/g, ' '));
    console.log(a.slice(3,6).join(' ').replace(/\-1/g, 'O').replace(/1/g, 'X').replace(/0/g, ' '));
    console.log(a.slice(6,9).join(' ').replace(/\-1/g, 'O').replace(/1/g, 'X').replace(/0/g, ' '));
}

try {
    var vvv = require('./net-training-data.json');
    console.log('loading training data from file...');
} catch (e) {
    console.log('creating new training data...');
    var xwins = 0;
    var owins = 0;
    var vvv = [];

    cc(function (arr, print) {
        var xwon = false, owon = false,
        xpos = arr.evens().sort().join(''), opos = arr.odds().sort().join('');

        if (
            (xpos.indexOf('012') !== -1) ||
            (xpos.indexOf('345') !== -1) ||
            (xpos.indexOf('678') !== -1) ||
            (xpos.indexOf('036') !== -1) ||
            (xpos.indexOf('147') !== -1) ||
            (xpos.indexOf('258') !== -1) ||
            (xpos.indexOf('048') !== -1) ||
            (xpos.indexOf('246') !== -1)
        ) xwins+=+(print = xwon = true);
        if (
            (opos.indexOf('012') !== -1) ||
            (opos.indexOf('345') !== -1) ||
            (opos.indexOf('678') !== -1) ||
            (opos.indexOf('036') !== -1) ||
            (opos.indexOf('147') !== -1) ||
            (opos.indexOf('258') !== -1) ||
            (opos.indexOf('048') !== -1) ||
            (opos.indexOf('246') !== -1)
        ) owins+=+(print = owon = true);



    // print
        if (print) {
            var n = [ 0, 0, 0,
                      0, 0, 0,
                      0, 0, 0,
                      xwon ? 1 : -1,
                      owon ? 1 : -1  ];
            for (var i = xpos.length - 1; i >= 0; i--) {
                n[xpos[i]] = 1;
            }
            for (var i = opos.length - 1; i >= 0; i--) {
                n[opos[i]] = -1;
            }
            vvv.push(n);

            //net.feedForward(n);
            //net.backPropigate([+xwon, +owon]);
        }
        return print;
    });

    console.log('saving training data to file...');
    fs.writeFileSync('./net-training-data.json', JSON.stringify(vvv));

}

var d = Date.now();

var sampleIndex = 0;
var totalError = 0;

function train() {
    var aveError = 0;
    for (var i = 0; i < 500 && sampleIndex < vvv.length; i++, sampleIndex++) {
        net.feedForward(vvv[sampleIndex].slice(0,9));
        net.backPropigate(vvv[sampleIndex].slice(-2));
        aveError+=net.error;
        totalError += net.error;
    }


    console.log('time: %sm', (Date.now()-d)/1000/60);
    console.log('done: %s%', parseInt(sampleIndex/vvv.length*10000)/100);
    console.log('error: %s%', parseInt(aveError/500*10000)/100);

    if (sampleIndex < vvv.length) {
        setTimeout(train, 0);
    } else {
        console.log('time: %sm', (Date.now()-d)/1000/60);
        console.log('done: 100%');
        console.log('total error: %s%', parseInt(totalError/vvv.length*10000)/100);

        setTimeout(saveBrain, 0);
        setTimeout(start, 0);
    }
}

function start() {
    console.log('starting training...');
    sampleIndex = 0;
    totalError = 0;

    d = Date.now();

    vvv = vvv.scramble()
             .scramble()
             .scramble()
             .scramble()
             .scramble();

    train();
}

start();