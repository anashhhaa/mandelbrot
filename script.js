

window.onload = function() {

    var canvas = document.getElementById("viewport"); 
    var context = canvas.getContext("2d");
    

    var imagew = canvas.width;
    var imageh = canvas.height;
    

    var imagedata = context.createImageData(imagew, imageh);
    
    // Pan and zoom parameters
    var offsetx = -imagew/2;
    var offsety = -imageh/2;
    var panx = -100;
    var pany = 0;
    var zoom = 150;
    

    var palette = [];
    

    var maxiterations = 250;
    

    function init() {
  
        canvas.addEventListener("mousedown", onMouseDown);
        

        generatePalette();
        

        generateImage();
    

        main(0);
    }

    function main(tframe) {
   
        window.requestAnimationFrame(main);
        

        context.putImageData(imagedata, 0, 0);
    }
    

    function generatePalette() {
  
        var roffset = 24;
        var goffset = 16;
        var boffset = 0;
        for (var i=0; i<256; i++) {
            palette[i] = { r:roffset, g:goffset, b:boffset};
            
            if (i < 64) {
                roffset += 3;
            } else if (i<128) {
                goffset += 3;
            } else if (i<192) {
                boffset += 3;
            }
        }
    }
    

    function generateImage() {

        for (var y=0; y<imageh; y++) {
            for (var x=0; x<imagew; x++) {
                iterate(x, y, maxiterations);
            }
        }
    }


    function iterate(x, y, maxiterations) {
 
        var x0 = (x + offsetx + panx) / zoom;
        var y0 = (y + offsety + pany) / zoom;
        

        var a = 0;
        var b = 0;
        var rx = 0;
        var ry = 0;
        

        var iterations = 0;
        while (iterations < maxiterations && (rx * rx + ry * ry <= 4)) {
            rx = a * a - b * b + x0;
            ry = 2 * a * b + y0;
            

            a = rx;
            b = ry;
            iterations++;
        }
        

        var color;
        if (iterations == maxiterations) {
            color = { r:0, g:0, b:0}; // Black
        } else {
            var index = Math.floor((iterations / (maxiterations-1)) * 255);
            color = palette[index];
        }
        

        var pixelindex = (y * imagew + x) * 4;
        imagedata.data[pixelindex] = color.r;
        imagedata.data[pixelindex+1] = color.g;
        imagedata.data[pixelindex+2] = color.b;
        imagedata.data[pixelindex+3] = 255;
    }
    

    function zoomFractal(x, y, factor, zoomin) {
        if (zoomin) {
    
            zoom *= factor;
            panx = factor * (x + offsetx + panx);
            pany = factor * (y + offsety + pany);
        } else {
    
            zoom /= factor;
            panx = (x + offsetx + panx) / factor;
            pany = (y + offsety + pany) / factor;
        }
    }
    

    function onMouseDown(e) {
        var pos = getMousePos(canvas, e);
        

        var zoomin = true;
        if (e.ctrlKey) {
            zoomin = false;
        }
        

        var zoomfactor = 2;
        if (e.shiftKey) {
            zoomfactor = 1;
        }
        
        zoomFractal(pos.x, pos.y, zoomfactor, zoomin);
        

        generateImage();
    }
    

    function getMousePos(canvas, e) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: Math.round((e.clientX - rect.left)/(rect.right - rect.left)*canvas.width),
            y: Math.round((e.clientY - rect.top)/(rect.bottom - rect.top)*canvas.height)
        };
    }
    

    init();
};
