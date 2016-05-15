
var width = 1080;
var height = 1920;
var scale = 4;
var mousedown = false;
var x1 = 0;
var y1 = 0;

function runScript(script) {
    console.log('run ', script);

    $.post('/api/script', { script: script }, function (data) {
        console.log('script ran', data);
    });
}

function sendTap(x, y) {
    $.post('/api/tap', { x: x*scale, y: y*scale }, function (data) {});
}

function sendKey(key) {
    $.post('/api/key', { key: key }, function (data) {});
}

function sendSwipe(x1, y1, x2, y2) {
    $.post('/api/swipe', { x1: x1*scale, y1: y1*scale, x2: x2*scale, y2: y2*scale }, function (data) {});
}

function getScreen() {
    var surface = $('#surface')[0];
    var ctx = surface.getContext('2d');

    var img = new Image();
    img.onload = function () {
        ctx.drawImage(img, 0, 0, width/scale, height/scale);
        setTimeout(getScreen, 0);
    };
    img.onerror = function () {
        setTimeout(getScreen, 100);
    };
    img.src = '/api/screen?' + Date.now();
}

$(function () {
    $('#unlock').on('click', runScript.bind(null, 'unlock.sh'));
    $('#tether').on('click', runScript.bind(null, 'tether.sh'));
    $('#menu').on('click', sendKey.bind(null, 'KEYCODE_MENU'));
    $('#home').on('click', sendKey.bind(null, 'KEYCODE_HOME'));
    $('#back').on('click', sendKey.bind(null, 'KEYCODE_BACK'));

    $('#surface').css({ width: width/scale, height: height/scale });
    $('#surface').attr('width', (width/scale));
    $('#surface').attr('height', (height/scale));

    $('#surface').on('click', function (event) {
        if (event.button === 0) {
            sendTap(event.offsetX, event.offsetY);
        }
    });

    $('#surface').on('mousedown', function (event) {
        if (event.button === 2) {
            mousedown = true;
            x1 = event.offsetX;
            y1 = event.offsetY;
        }
    });

    $('#surface').on('mouseup', function (event) {
        if (event.button === 2) {
            if (!mousedown) return;

            sendSwipe(x1, y1, event.offsetX, event.offsetY);

            mousedown = false;
        }
    });

    getScreen();
});
