const canvas = document.getElementById('main');
const canvas2 = document.getElementById('main2');
const ctx = canvas.getContext('2d');
const ctx2 = canvas2.getContext('2d');
let mainCanvasData;
let idCounter = 0;

function distance(a,b){
    return Math.sqrt((a.x-b.x)*(a.x-b.x)+(a.y-b.y)*(a.y-b.y));
}

class Square {
    constructor(top, right, bottom, left, image) {
        this.top = top;
        this.right = right;
        this.bottom = bottom;
        this.left = left;
        this.image = image;
    }
}


class Board {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        canvas.width = width * 50;
        canvas.height = height * 50;
        canvas2.width = width * 50;
        canvas2.height = height * 50;
        this.x = new Array(this.width);
        for (let i = 0; i < this.width; i++) {
            let temparr = new Array(height);
            for (let j = 0; j < this.height; j++) {
                let bos = [undefined, undefined, undefined, undefined];
                temparr[j] = new Square(...bos, undefined)
            }
            this.x[i] = { y: [...temparr] };
        }
    }

    generate(isDrawen) {
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                let ans = this.chooseRandom(i, j);
                this.x[i].y[j] = ans;
            }
        }
        if (isDrawen) {
            this.draw();
        }
    }

    chooseRandom(i, j) {
        let possibles = new Array(options.length);
        let ust = true, alt = true, sol = true, sag = true;
        if (i == 0) {
            sol = false;
        }
        if (i == this.width - 1) {
            sag = false;
        }
        if (j == 0) {
            ust = false;
        }
        if (j == this.height - 1) {
            alt = false;
        }
        for (let k = 0; k < options.length; k++) {
            possibles[k] = true;
            if (ust) {
                if (this.x[i].y[j - 1].top != undefined) {
                    if (squares[k].top != this.x[i].y[j - 1].bottom) {
                        possibles[k] = false;
                    }
                }
            }
            if (sag) {
                if (this.x[i + 1].y[j].top != undefined) {
                    if (squares[k].right != this.x[i + 1].y[j].left) {
                        possibles[k] = false;
                    }
                }
            }
            if (alt) {
                if (this.x[i].y[j + 1].top != undefined) {
                    if (squares[k].bottom != this.x[i].y[j + 1].top) {
                        possibles[k] = false;
                    }
                }
            }
            if (sol) {
                if (this.x[i - 1].y[j].top != undefined) {
                    if (squares[k].left != this.x[i - 1].y[j].right) {
                        possibles[k] = false;
                    }
                }
            }
        }
        let ans = [];
        for (let i = 0; i < options.length; i++) {
            if (possibles[i] == true) {
                ans.push(i);
            }
        }
        let gec = false;
        let value;
        if (possibles[0] == true) {
            if (Math.random() * 100 > 1) {
                gec = true;
                value = 0;
            }
        }
        if (!gec) {
            value = ans[Math.floor(Math.random() * ans.length)];
        }
        let cevap = squares[value];
        if (value > 0 && value < 16) {
            objects[i][j] = [false, "water"];
        }
        else if (value == 17) {
            objects[i][j] = [false, "rock"];
        }
        else if (value == 0) {
            objects[i][j] = [true, "grass"];
        }
        else if (value == 16) {
            objects[i][j] = [true, "food"];
        }
        return cevap;
    }

    draw() {
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                ctx.drawImage(this.x[i].y[j].image, i * 50, j * 50, 50, 50);
            }
        }
    }
}

let width = 300;
let height = 200;
let objects = new Array(width);
for (let i = 0; i < width; i++) {
    objects[i] = new Array(height);
}

let board = new Board(width, height);
canvas.style.transform = "translate(-50%,-50%) scale(" + 25 / width + ")";
canvas2.style.transform = "translate(-50%,-50%) scale(" + 25 / width + ")";
//resim sayisi
const options = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
let images = [];
let path = "images/";
let sayac = 0;

loadImages();

function loadImages() {
    //resim sayisi
    if (sayac == 18) {
        prepare();
        return;
    }
    let tempimage = new Image(50, 50);
    tempimage.src = path + sayac + ".png";
    tempimage.onload = () => {
        images.push(tempimage);
        sayac++;
        loadImages();
    }
}

let squares;

class Organism {
    //yemek bulma ekle
    constructor(x, y, isHunter) {
        this.id = idCounter++;
        this.closestHunter;
        this.SightDistance = 10;
        this.speed = (Math.random()+0.5)/5;
        this.isHunter = isHunter;
        this.angle = Math.floor(Math.random() * 360);
        if (x == undefined || y == undefined) {
            this.x = Math.floor(Math.random() * width);
            this.y = Math.floor(Math.random() * height);
        }
        else {
            this.x = x;
            this.y = y;
        }
    }

    live() {
        this.checkAround();
        this.properMove();
    }

    properMove() {
        //console.log(objects[Math.round(this.x)][Math.round(this.y)]);
        let rand = Math.round(Math.random()) - 0.5;
        this.angle += rand / Math.random() / Math.random() / 1000;
        let deltaX = Math.cos(this.angle) / 10;
        let deltaY = Math.sin(this.angle) / 10;
        deltaX*=this.speed;
        deltaY*=this.speed;
        if (this.x + deltaX > width-1 || this.x + deltaX < 1) {
            deltaX = -deltaX;
            this.angle+=Math.random()*10;
        }
        if (this.y + deltaY > height-1 || this.y + deltaY < 1) {
            deltaY = -deltaY;
            this.angle+=Math.random()*10;
        }
        if(!(this.x + deltaX > width-1 || this.x + deltaX < 1 || this.y + deltaY > height-1 || this.y + deltaY < 1)){
            if(this.closestHunter!=undefined){
                if(this.y-this.closestHunter.y<=0){
                    deltaY = -this.speed*0.1;
                }
                else {
                    deltaY = this.speed*0.1;
                }
                if(this.x-this.closestHunter.x<=0){
                    deltaX = -this.speed*0.1;
                }
                else {
                    deltaX = this.speed*0.1;
                }
            }
        }
        this.x += deltaX;
        this.y += deltaY;
        //devam et sin-cos
        //bir sürü paramere ekle kalıtımda işe yarayabilir
    }

    checkAround(){
        let min = Infinity;
        let temp = true;
        if(!this.isHunter){
            for(let organism of organisms){
                if(organism.id!=this.id){
                    let dist = distance(this,organism);
                    if(dist<this.SightDistance&&dist<min){
                        if(organism.isHunter){
                            this.closestHunter = organism;
                            temp = false;
                        }
                    }
                }
            }
            if(temp){
                this.closestHunter = undefined;
            }
        }
    }

    draw() {
        if (this.isHunter) {
            ctx2.fillStyle = "red";
        }
        else {
            ctx2.fillStyle = "yellow"
        }
        ctx2.beginPath();
        ctx2.arc(this.x * 50, this.y * 50, 10, 0, 2 * Math.PI); // değiş
        ctx2.fill();
    }

}

let prepare = () => {
    squares = [
        new Square("CCC", "CCC", "CCC", "CCC", images[0]),
        new Square("SSS", "SSS", "SSS", "SSS", images[1]),
        new Square("CSS", "SSC", "CCC", "CCC", images[2]),
        new Square("CCC", "CSS", "CSS", "CCC", images[3]),
        new Square("CCC", "CCC", "SSC", "CSS", images[4]),
        new Square("SSC", "CCC", "CCC", "SSC", images[5]),
        new Square("SSS", "SSC", "CCC", "SSC", images[6]),
        new Square("CCC", "CSS", "SSS", "CSS", images[7]),
        new Square("SSC", "CCC", "SSC", "SSS", images[8]),
        new Square("CSS", "SSS", "CSS", "CCC", images[9]),
        new Square("CSS", "SSS", "SSS", "CSS", images[10]),
        new Square("CCC", "CSS", "SSS", "SSS", images[11]),
        new Square("SSS", "SSC", "SSC", "SSS", images[12]),
        new Square("SSS", "SSS", "CSS", "SSC", images[13]),
        new Square("SSC", "CSS", "CSS", "SCC", images[14]),
        new Square("CSS", "SSC", "SSC", "CSS", images[15]),
        new Square("CCC", "CCC", "CCC", "CCC", images[16]),
        new Square("CCC", "CCC", "CCC", "CCC", images[17])
    ];
    board.generate(true);
}
let devam = true;
let ilk = true;
function start() {
    devam = true;
    if (ilk) {
        prepareOrganisms();
        ilk = false;
        setInterval(() => {
            if (devam) {
                resume();
            }
        }, 10)
    }
}

function stop() {
    devam = false;
}
let organisms = new Array();
function prepareOrganisms() {
    for (let i = 0; i < 50; i++) {
        organisms.push(new Organism(undefined, undefined, true));
    }
    organisms.push(new Organism(undefined, undefined, false));
}

function resume() {
    canvas2.width = canvas2.width;
    for (let organism of organisms) {
        organism.live();
        organism.draw();
    }
}