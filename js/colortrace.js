var rx = 160;
var gx = 110;
var bx = 130;
var cw = 10;//colorwindowr
var hw = 10;
var sw = 30;
var vw = 30;
var trace = [];
function isXColor(r, g, b) {
    var hsv = rgbToHsv(r, g, b);
    var hsvx = rgbToHsv(rx, gx, bx);
    if (hsv[0] > hsvx[0] - hw && hsv[0] < hsvx[0] + hw
        && hsv[1] > hsvx[1] - sw && hsv[1] < hsvx[1] + sw
        && hsv[2] > hsvx[2] - vw && hsv[2] < hsvx[2] + vw) {
        return true;
    } else {
        return false;
    }
}


var prevX, prevY;
function drawFrame() {
    count = 0; xcm = 0; ycm = 0;
    context.drawImage(video, 0, 0);

    var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    var data = imageData.data;

    for (x = 0; x < imageData.width; x++) {
        for (y = 0; y < imageData.height; y++) {
            var k = 4 * (y * imageData.width + x);
            r = data[k]; g = data[k + 1]; b = data[k + 2];
            if (isXColor(r, g, b)) {
                count += 1; xcm += x; ycm += y;
            }
        }
    }

    xcm /= count; ycm /= count;
    xcm = parseInt(xcm); ycm = parseInt(ycm);
    // overwrite original image
    context.putImageData(imageData, 0, 0);
    context.fillRect(xcm - 10, ycm - 10, 20, 20);
    context.fillStyle = 'white';
    context.strokeStyle = 'red';
    
    context.fill();
    context.stroke();
    requestAnimationFrame(function () {
        drawFrame(canvas, context, video);
    });
}

function init() {
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    video = document.getElementById("video");
    drawFrame();
    videoObj = { "video": true };
    if (navigator.webkitGetUserMedia) {
        navigator.webkitGetUserMedia(videoObj, function (stream) {
            video.srcObject = stream;
            video.play();
        }, function (error) {
            console.log("Video capture error: ", error.code)
        });
    }
}

init();







function setColor(color) {
    var hex = hexTorgb(color);
    rx = hex[0];
    gx =  hex[1];
    bx =  hex[2];
    trace = [];
}

function hexTorgb(hex) {
    var r = hex.substring(1, 3);
    var g = hex.substring(3, 5);
    var b = hex.substring(5, 7);
    return [parseInt(r, 16), parseInt(g, 16), parseInt(b, 16)];
}



function rgbToHsv(r, g, b) {
    r = r / 255, g = g / 255, b = b / 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, v = max;

    var d = max - min;
    s = max == 0 ? 0 : d / max;

    if (max == min) {
        h = 0; // achromatic
    } else {
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return [h * 255, s * 255, v * 255];
}

function hsvToRgb(h, s, v) {
    var r, g, b;
    var i = Math.floor(h * 6);
    var f = h * 6 - i;
    var p = v * (1 - s);
    var q = v * (1 - f * s);
    var t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

