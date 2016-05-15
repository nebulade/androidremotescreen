#!/usr/bin/env node

'use strict';

var express = require('express'),
    execFile = require('child_process').execFile,
    spawn = require('child_process').spawn,
    bodyParser = require('body-parser'),
    fs = require('fs'),
    path = require('path');

var app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/api/script', function (req, res) {
    console.log('Run script', req.body.script);

    execFile('/bin/bash', [ path.join(__dirname, req.body.script) ], (error, stdout, stderr) => {
        if (error) {
            console.log(error, stdout, stderr);
            return res.sendStatus(500);
        }

        res.status(200).send(stdout);
    });
});

app.post('/api/tap', function (req, res) {
    execFile('adb', [ 'shell', 'input', 'tap', req.body.x, req.body.y ],(error, stdou, stderr) => {
        res.sendStatus(200);
    });
});

app.post('/api/swipe', function (req, res) {
    execFile('adb', [ 'shell', 'input', 'swipe', req.body.x1, req.body.y1, req.body.x2, req.body.y2 ],(error, stdou, stderr) => {
        res.sendStatus(200);
    });
});

app.post('/api/key', function (req, res) {
    execFile('adb', [ 'shell', 'input', 'keyevent', req.body.key ],(error, stdou, stderr) => {
        res.sendStatus(200);
    });
});

app.get('/api/screen', function (req, res) {
    res.status(200).type('image/png');

    var prog = spawn('/bin/bash', [ path.join(__dirname, 'screenshot.sh') ], { maxBuffer: 20*1024*1024, encoding: 'binary' });
    prog.stdout.pipe(res);
    prog.on('close', function () { res.end(); });
});

app.listen(3000, function () {
    console.log('Touchery listening on port 3000!');
});
