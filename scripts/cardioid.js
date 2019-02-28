let sin = Math.sin;
let cos = Math.cos;
Number.prototype.toRadians = function () {
    return this.valueOf() * (Math.PI / 180);
};
(function(){
    let scr;
    let spacing = 10;
    let ctx;    
    let dcl = {};
    
    function draw(t){
        t = t/100;
        dcl.clear();
        for(let i = 100;i<=300;i+=spacing){
            let steps = i/360;
            let xd = sin(i/100)+t;
            let yd = cos(i/100)+t;
            ctx.beginPath();
            let maxmag = 0;
            for(d = 0;d<360;d+=steps){
                let dr = d.toRadians();
                let x = i* (1- cos(dr)) * cos(dr);
                let y = i* (1- cos(dr)) * sin(dr);
                let v = dcl.vector(x,y,scr.height/(d+1));
                v = v.rotateZ((yd+xd)*4).rotateY(yd).rotateX(-xd/10).project(scr.width,scr.height,90,200);
                if(d>0){
                    ctx.lineTo(v.x,v.y);
                } else {
                    ctx.moveTo(v.x,v.y);
                }
                if(v.mag>maxmag){
                    maxmag = v.mag;
                }
            }
            let a = 1/Math.log(maxmag*2);
            ctx.strokeStyle = "rgba(255,255,255,"+a.toFixed(2)+")";
            ctx.stroke();
        }
        requestAnimationFrame(draw);
    }


    dcl.clear = function(){
        ctx.clearRect(0,0,scr.width, scr.height);
    }
    dcl.rect = function (x, y, width, height, color, lineWidth, lineColor) {
        height = height || width;
        if (color.isColor) {
            color = color.toStyle();
        }
        ctx.fillStyle = color || "blue";
        ctx.fillRect(x, y, width, height);
        if (lineWidth) {
            lineColor = lineColor || "#000088";
            ctx.strokeStyle = lineColor;
            ctx.lineWidth = lineWidth;
            ctx.strokeRect(x, y, width, height);
        }
    };
    dcl.trig = function (deg) {
        var r = deg.toRadians();
        var c = cos(r);
        var s = sin(r);
        return {
            rad: r,
            cos: c,
            sin: s,
            transform: function (a, b) {
                return { a: a * c - b * s, b: a * s + b * c };
            }
        };
    };
    dcl.vector = function (x, y, z, w) {
        x = x || 0;
        y = y || 0;
        z = z || 0;
        w = w === undefined || w === null ? 1 : w;
    
        function magsqr() {
            return x * x + y * y + z * z + w * w;
        }
    
        function mag() {
            return Math.sqrt(magsqr());
        }
    
        return {
            x: x,
            y: y,
            z: z,
            w: w,
            rotateX: function (angle) {
                var tv = dcl.trig(angle).transform(y, z);
                return dcl.vector(x, tv.a, tv.b);
            },
            rotateY: function (angle) {
                var tv = dcl.trig(angle).transform(x, z);
                return dcl.vector(tv.a, y, tv.b);
            },
            rotateZ: function (angle) {
                var tv = dcl.trig(angle).transform(x, y);
                return dcl.vector(tv.a, tv.b, z);
            },
            project: function (width, height, fov, distance) {
                var factor = fov / (distance + z);
                var nx = x * factor + width / 2;
                var ny = y * factor + height / 2;
                return dcl.vector(nx, ny, z, 0);
            },
            mag: mag()
        }
    }
    function setup() {
        var canvas = document.createElement('canvas');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.id = 'space';
        canvas.style.padding = 0;
        canvas.style.margin = 'auto';
        canvas.style.position = 'absolute';
        canvas.style.top = 0;
        canvas.style.left = 0;
        canvas.style.right = 0;
        canvas.style.bottom = 0;
        canvas.style.width = canvas.width;
        canvas.style.height = canvas.height;
        document.body.appendChild(canvas);
        ctx = canvas.getContext('2d');
        scr = {                
                width: canvas.width,
                height: canvas.height
        }
        canvas.style.backgroundColor = 'black';
        document.body.style.backgroundColor = 'black';      
    }

    
    

    setup();
    draw(0);
})();