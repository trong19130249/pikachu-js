// dom
const wrapperPikachu = document.querySelector('#wrapper-pikachu');
const svg = document.getElementById("svg");
const score = document.querySelector('#score');
const timeLine = document.querySelector('#time');
const levelText = document.querySelector('#level');
const countFindDom= document.querySelector('#count-find');
const modalDom = document.querySelector('#modal-final');
const exchangeDom =document.querySelector('#count-exchange');
// class pikachu 16,9
const ncol = 16;
const nrow = 9;
const ncell = nrow * ncol;
const nCouble = ncell / 2;
const WIDTH_CELL = 40;
const HEIGHT_CELL = 50;
const VAL_GO = -1;

let totalFind;
let totalScore;
let totalExchange;
let time;
let level;
let intervalCountDown ;
itemChosen = [];
//style div
wrapperPikachu.style.width = WIDTH_CELL * (ncol + 2) + "px";
wrapperPikachu.style.height = HEIGHT_CELL * (nrow + 2) + "px";

const listImg = ['./img/ic_0', './img/ic_1', './img/ic_2', './img/ic_3', './img/ic_4',
    './img/ic_5', './img/ic_6', './img/ic_7', './img/ic_8', './img/ic_9',
    './img/ic_10', './img/ic_11', './img/ic_12', './img/ic_13', './img/ic_14',
    './img/ic_15', './img/ic_16', './img/ic_17', './img/ic_18', './img/ic_19',
    './img/ic_20', './img/ic_21', './img/ic_22', './img/ic_23', './img/ic_24',
    './img/ic_25', './img/ic_26', './img/ic_27', './img/ic_28', './img/ic_29',
    './img/ic_30', './img/ic_31', './img/ic_32', './img/ic_33', './img/ic_34',
    './img/ic_35'];
let arrayPikachu;

// console.log(nCouble);
function initArray2DPikachu() {
    arrayPikachu = newArray2D(nrow + 2, ncol + 2, VAL_GO)
    for (let i = 0; i < nCouble; i++) {
        // console.log(itemRandom);
        let col = i % ncol;
        let row = Math.floor(i / ncol);
        let val = i % listImg.length;
        arrayPikachu[row + 1][col + 1] = val;
        let col1 = (i + nCouble) % ncol + 1;
        let row1 = Math.floor((i + nCouble) / ncol) + 1;
        arrayPikachu[row1][col1] = val;
    }
}


initGame();
handleClick();
// hàm khởi tạo game
function initGame() {
    level = 1;
    time = 600;
    totalScore = 0;
    totalFind = 100;
    totalExchange=3;
    initArray2DPikachu();
    shuffle(arrayPikachu, nrow, ncol);
    changePikachu();
    let timeTemporary  = time;
    intervalCountDown = setInterval(function (){
        countDown(timeTemporary);
    },1000);
    levelText.innerHTML = level;
    countFindDom.innerHTML = totalFind;
    score.innerHTML = totalScore;
    exchangeDom.innerHTML = totalExchange;
}

// hàm các xử lý sự kiện
function handleClick(){
    document.querySelector('#find').addEventListener('click', function () {
        if (totalFind > 0) {
            let input = findLine();
            if (input!=null){
                resetChosen();
                itemChosen.push(document.querySelector(`[data-row="${input[0][0]}"][data-col="${input[0][1]}"]`));
                itemChosen.push(document.querySelector(`[data-row="${input[1][0]}"][data-col="${input[1][1]}"]`));
                itemChosen[0].classList.add('rotate');
                itemChosen[1].classList.add('rotate');
                this.style.pointerEvents = 'none';
                let that = this;
                setTimeout(function (){
                    checkForMatch();
                    that.style.pointerEvents = 'auto';
                    countFindDom.innerHTML = totalFind;

                    totalFind--;

                }, 200);
            }
        }
    });
    document.querySelector('#exchange').addEventListener('click', function () {
    if (totalExchange){
        shuffle(arrayPikachu, nrow, ncol);
        changePikachu();
        totalExchange--;
        exchangeDom.innerHTML = totalExchange;
    }
    });
    document.querySelector('#level-up').addEventListener('click', function () {
        gameUp();
    });
    document.querySelector("#restart").addEventListener('click', function () {
        restartGame();
    });
}
function restartGame(){
    clearInterval(intervalCountDown);
    initGame();
}
function changePikachu() {
    while (!canPlay()) {
        shuffle(arrayPikachu, nrow, ncol);
    }
    displayBoard();
}
// hàm đếm ngược thời gian
function countDown(totalTime){
        time--;
        timeLine.style.width = 100 * (time/totalTime) + '%';
        if (time === 0) {
            gameOver();
        }
}

// xáo trộn mảng 2 chiều
function shuffle(array, row, col) {
    let currentIndex = row * col, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        let r1 = Math.floor(currentIndex / col) + 1;
        let c1 = currentIndex % col + 1;
        let r2 = Math.floor(randomIndex / col) + 1;
        let c2 = randomIndex % col + 1;
        let temp = array[r1][c1];
        array[r1][c1] = array[r2][c2];
        array[r2][c2] = temp;
    }
    return array;
}
// tạo mảng mới
function newArray2D(row, col, valDefault) {
    let arr = new Array(row);
    for (let i = 0; i < arr.length; i++) {
        arr[i] = new Array(col);
    }
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i].length; j++) {
            arr[i][j] = valDefault;
        }
    }
    return arr;
}
// hiển thị dựa trên array 2d
function displayBoard() {
    wrapperPikachu.innerHTML = '';
    for (let i = 1; i < arrayPikachu.length - 1; i++) {
        for (let j = 1; j < arrayPikachu[i].length - 1; j++) {
            if (arrayPikachu[i][j] != -1) {

                let wrapper = document.createElement('div');
                let img = document.createElement('img');
                wrapper.classList.add('pikachu');
                wrapper.style.width = WIDTH_CELL + "px";
                wrapper.style.height = HEIGHT_CELL + "px";
                wrapper.style.left = (j) * WIDTH_CELL + 'px';
                wrapper.style.top = (i) * HEIGHT_CELL + 'px';
                img.src = listImg[arrayPikachu[i][j]] + '.png';
                wrapper.setAttribute('data-row', i);
                wrapper.setAttribute('data-col', j);
                wrapper.appendChild(img);
                wrapper.addEventListener('click', eventClick);
                wrapperPikachu.appendChild(wrapper);
            }
        }
    }
}

function eventClick() {
    // console.log(e.target);
    itemChosen.push(this);
    this.classList.add('active');
    if (itemChosen.length === 2) {
        setTimeout(checkForMatch, 200);
        // checkForMatch();
    }
}
// reset lại bộ chọn
function resetChosen() {
    if (itemChosen.length>0) {
        itemChosen[0].classList.remove('active');
        if (itemChosen.length>1) {
            itemChosen[1].classList.remove('active');
        }
    }
    itemChosen = [];
}

function checkForMatch() {
    if (itemChosen.length == 2) {
        // console.log(itemChosen);
        let row1 = parseInt(itemChosen[0].getAttribute('data-row'));
        let col1 = parseInt(itemChosen[0].getAttribute('data-col'));
        let row2 = parseInt(itemChosen[1].getAttribute('data-row'));
        let col2 = parseInt(itemChosen[1].getAttribute('data-col'));
        if (!(row1 === row2 && col1 === col2)) {
            if (arrayPikachu[row1][col1] === arrayPikachu[row2][col2]) {
                let line = checkTwoPoint(new Point(row1, col1), new Point(row2, col2));
                if (line) {
                    drawPath([new Point(row1, col1), line.p1, line.p2, new Point(row2, col2)]);
                    arrayPikachu[row1][col1] = VAL_GO;
                    arrayPikachu[row2][col2] = VAL_GO;

                    itemChosen[0].style.display = "none";
                    itemChosen[1].style.display = "none";

                    handleLevel(row1, col1, row2, col2);
                    duplicates();
                    if (checkWin()) {
                        gameUp()
                    } else {
                        changePikachu();

                    }
                    setTimeout(function () {
                        svg.innerHTML = "";
                    }, 200)
                    totalScore += 100;
                    updateScore();


                }
            }
        }
        resetChosen();
    }
}
// các hàm xử lý cho từng level
function handleLevel(row1, col1, row2, col2) {
    switch (level) {
        case 1:
            break;
        case 2:
            if(row1==row2){
                dragLeftRow( row1, Math.min(col1,col2));

            }else{
                dragLeftRow(row1, col1);
                dragLeftRow(row2, col2);
            }
            break;
        case 3:
            if (row1 == row2) {
                dragRightRow( row1, Math.max(col1,col2));
            }else{
                dragRightRow(row1, col1);
                dragRightRow(row2, col2);
            }
            break;
        case 4:
            if (col1 == col2) {
                dragTopCol( Math.min(row1,row2), col1);
            }else{
                dragTopCol(row1, col1);
                dragTopCol(row2, col2);
            }
            break;
        case 5:
            if (col1 == col2) {
                dragBottomCol( Math.max(row1,row2), col1);
            }else{
                dragBottomCol(row1, col1);
                dragBottomCol(row2, col2);
            }

            break;
        case 6:
            if (row1 == row2) {
                if (col1<=ncol/2&&col2<=ncol/2){
                    dragCenterRow(row1, Math.max(col1,col2));
                }else{
                    dragCenterRow(row1, Math.min(col1,col2));
                }


            }else{
            dragCenterRow(row1, col1);
            dragCenterRow(row2, col2);
            }

            break;
        default:
            break;
    }
}

function dragLeftRow(row, col) {
    let k = col;
    for (let i = col; i < arrayPikachu[row].length-1; i++) {
        if (arrayPikachu[row][i] != VAL_GO && i != k) {
            movePosition(row, i, row, k);
            k++;
        }
    }
}
function dragCenterRow(row,col){
    let k = col;
    if (col<=arrayPikachu[row].length/2){
        for (let i = col; i > 0; i--) {
            if (arrayPikachu[row][i] != VAL_GO && i != k) {
                movePosition(row, i, row, k);
                k--;
            }
        }
    }else{
        for (let i = col; i <  arrayPikachu[row].length-1; i++) {
            if (arrayPikachu[row][i] != VAL_GO && i != k) {
                movePosition(row, i, row, k);
                k++;
            }
        }
    }
    // duplicates();

}

function dragRightRow(row, col) {
    let k = col;
    for (let i = col; i >0; i--) {
        if (arrayPikachu[row][i] != VAL_GO && i != k) {
            movePosition(row, i, row, k);
            k--;
        }
    }
}
function dragTopCol(row, col) {
    let k = row;
    for (let i = row; i < arrayPikachu.length; i++) {
        if (arrayPikachu[i][col] != VAL_GO && i != k) {
            movePosition(i, col, k, col);
            k++;
        }
    }
}
function dragBottomCol(row, col) {
    let k = row;
    for (let i = row; i >0; i--) {
        if (arrayPikachu[i][col] != VAL_GO && i != k) {
            movePosition(i, col, k, col);
            k--;
        }
    }
}
function movePosition(r1, c1, r2, c2) {
    let elementDom = document.querySelector(`[data-row="${r1}"][data-col="${c1}"]`);
    // console.log(elementDom);
    elementDom.style.left = (c2) * WIDTH_CELL + 'px';
    elementDom.style.top = (r2) * HEIGHT_CELL + 'px';
    arrayPikachu[r2][c2] = arrayPikachu[r1][c1];
    arrayPikachu[r1][c1] = -1;
    elementDom.setAttribute('data-row', r2);
    elementDom.setAttribute('data-col', c2);

}

function updateScore() {
    score.innerHTML = totalScore;
}


// initTest();
//truc hoanh
function checkPathX(y1, y2, x) {
    let min = Math.min(y1, y2);
    let max = Math.max(y1, y2);
    for (let i = min + 1; i < max; i++) {
        if (arrayPikachu[x][i] !== VAL_GO) {
            return false;
        }
    }
    return true;
}

// truc tung
function checkPathY(x1, x2, y) {
    let min = Math.min(x1, x2);
    let max = Math.max(x1, x2);
    for (let i = min + 1; i < max; i++) {
        if (arrayPikachu[i][y] !== VAL_GO) {
            return false;
        }
    }
    return true;
}

function checkRectX(p1, p2) {
    // find point have y min and max
    let pMinY = p1, pMaxY = p2;
    if (p1.y > p2.y) {
        pMinY = p2;
        pMaxY = p1;
    }
    for (let y = pMinY.y; y <= pMaxY.y; y++) {
        if (y > pMinY.y && arrayPikachu[pMinY.x][y] !== VAL_GO) {
            return -1;
        }


        // check two line
        if ((arrayPikachu[pMaxY.x][y] === VAL_GO || y === pMaxY.y)
            && checkPathY(pMinY.x, pMaxY.x, y)
            && checkPathX(y, pMaxY.y, pMaxY.x)) {
            // console.log("Rect x");
            // console.log("(" + pMinY.x + "," + pMinY.y + ") -> ("
            //     + pMinY.x + "," + y + ") -> (" + pMaxY.x + "," + y
            //     + ") -> (" + pMaxY.x + "," + pMaxY.y + ")");
            // if three line is true return column y
            return y;
        }
    }
    // have a line in three line not true then return -1
    return -1;
}

function checkRectY(p1, p2) {
    // find point have y min and max
    let pMinX = p1, pMaxX = p2;
    if (p1.x > p2.x) {
        pMinX = p2;
        pMaxX = p1;
    }
    // find line and y begin
    for (let x = pMinX.x; x <= pMaxX.x; x++) {
        if (x > pMinX.x && arrayPikachu[x][pMinX.y] !== VAL_GO) {
            return -1;
        }

        // check two line
        if ((arrayPikachu[x][pMaxX.y] === VAL_GO || x == pMaxX.x)
            && checkPathX(pMinX.y, pMaxX.y, x)
            && checkPathY(x, pMaxX.x, pMaxX.y)) {
            // console.log("Rect y");
            // console.log("(" + pMinX.x + "," + pMinX.y + ") -> (" + x
            //     + "," + pMinX.y + ") -> (" + x + "," + pMaxX.y
            //     + ") -> (" + pMaxX.x + "," + pMaxX.y + ")");
            // if three line is true return column y
            return x;
        }
    }
    return -1;
}

function checkMoreLineX(p1, p2, type) {
    let pMinY = p1, pMaxY = p2;
    if (p1.y > p2.y) {
        pMinY = p2;
        pMaxY = p1;
    }
    // find line and y begin
    let y = pMaxY.y + type;
    let row = pMinY.x;
    let colFinish = pMaxY.y;
    if (type == -1) {
        colFinish = pMinY.y;
        y = pMinY.y + type;
        row = pMaxY.x;
        // console.log("colFinish = " + colFinish);
    }

    // find column finish of line

    // check more
    if ((arrayPikachu[row][colFinish] === VAL_GO || pMinY.y === pMaxY.y)
        && checkPathX(pMinY.y, pMaxY.y, row)) {
        while (arrayPikachu[pMinY.x][y] === VAL_GO
        && arrayPikachu[pMaxY.x][y] === VAL_GO) {
            if (checkPathY(pMinY.x, pMaxY.x, y)) {

                // console.log("TH X " + type);
                // console.log("(" + pMinY.x + "," + pMinY.y + ") -> ("
                //     + pMinY.x + "," + y + ") -> (" + pMaxY.x + "," + y
                //     + ") -> (" + pMaxY.x + "," + pMaxY.y + ")");
                return y;
            }
            y += type;
        }
    }
    return -1;
}

function checkMoreLineY(p1, p2, type) {
    // console.log("check more y");
    let pMinX = p1, pMaxX = p2;
    if (p1.x > p2.x) {
        pMinX = p2;
        pMaxX = p1;
    }
    let x = pMaxX.x + type;
    let col = pMinX.y;
    let rowFinish = pMaxX.x;
    if (type == -1) {
        rowFinish = pMinX.x;
        x = pMinX.x + type;
        col = pMaxX.y;
    }
    if ((arrayPikachu[rowFinish][col] === VAL_GO || pMinX.x === pMaxX.x)
        && checkPathY(pMinX.x, pMaxX.x, col)) {
        while (arrayPikachu[x][pMinX.y] === VAL_GO
        && arrayPikachu[x][pMaxX.y] === VAL_GO) {
            if (checkPathX(pMinX.y, pMaxX.y, x)) {
                // console.log("TH Y " + type);
                // console.log("(" + pMinX.x + "," + pMinX.y + ") -> ("
                //     + x + "," + pMinX.y + ") -> (" + x + "," + pMaxX.y
                //     + ") -> (" + pMaxX.x + "," + pMaxX.y + ")");
                return x;
            }
            x += type;
        }
    }
    return -1;
}

function checkTwoPoint(p1, p2) {
    // console.log("test",p1,p2);
    // check line with x
    if (p1.x == p2.x) {
        if (checkPathX(p1.y, p2.y, p1.x)) {
            // console.log("check line with x")
            return new MyLine(p1, p2);
        }
    }
    // check line with y
    if (p1.y == p2.y) {
        // console.log("check line with y")
        if (checkPathY(p1.x, p2.x, p1.y)) {
            return new MyLine(p1, p2);
        }
    }

    let t = -1; // t is column find

    // check in rectangle with x
    if ((t = checkRectX(p1, p2)) != -1) {
        // console.log('RectX');
        return new MyLine(new Point(p1.x, t), new Point(p2.x, t));
    }

    // check in rectangle with y
    if ((t = checkRectY(p1, p2)) != -1) {
        // console.log('RectY');
        return new MyLine(new Point(t, p1.y), new Point(t, p2.y));
    }
    // check more right
    if ((t = checkMoreLineX(p1, p2, 1)) != -1) {
        // console.log('checkMoreLineX right');
        return new MyLine(new Point(p1.x, t), new Point(p2.x, t));
    }
    // check more left
    if ((t = checkMoreLineX(p1, p2, -1)) != -1) {
        // console.log('checkMoreLineX left');

        return new MyLine(new Point(p1.x, t), new Point(p2.x, t));
    }
    // check more down
    if ((t = checkMoreLineY(p1, p2, 1)) != -1) {
        // console.log('checkMoreLineY down');

        return new MyLine(new Point(t, p1.y), new Point(t, p2.y));
    }
    // check more up
    if ((t = checkMoreLineY(p1, p2, -1)) != -1) {
        // console.log('checkMoreLineY up');

        return new MyLine(new Point(t, p1.y), new Point(t, p2.y));
    }
    return null;
}
function findLine() {
    for (let i = 1; i < arrayPikachu.length - 1; i++) {
        for (let j = 1; j < arrayPikachu[i].length - 1; j++) {
            if (arrayPikachu[i][j] !== VAL_GO) {
                for (let n = 1; n < arrayPikachu.length - 1; n++) {
                    for (let m = 1; m < arrayPikachu[n].length - 1; m++) {
                        if ((n !== i || m !== j) && arrayPikachu[n][m] !== VAL_GO && arrayPikachu[n][m] === arrayPikachu[i][j]) {
                            if (checkTwoPoint(new Point(i, j), new Point(n, m))) {
                                return [[i, j], [n, m]];
                            }
                        }
                    }
                }
            }
        }
    }
    return null;
}
function canPlay() {
    for (let i = 1; i < arrayPikachu.length - 1; i++) {
        for (let j = 1; j < arrayPikachu[i].length - 1; j++) {
            if (arrayPikachu[i][j] !== VAL_GO) {
                for (let n = 1; n < arrayPikachu.length - 1; n++) {
                    for (let m = 1; m < arrayPikachu[n].length - 1; m++) {
                        if ((n !== i || m !== j) && arrayPikachu[n][m] !== VAL_GO && arrayPikachu[n][m] === arrayPikachu[i][j]) {
                            if (checkTwoPoint(new Point(i, j), new Point(n, m))) {
                                return true;
                            }
                        }
                    }
                }
            }
        }
    }
    return false;
}

function Point(x, y) {
    this.x = x;
    this.y = y;
}

function MyLine(p1, p2) {
    this.p1 = p1;
    this.p2 = p2;
}

function checkWin() {
    let count = 0;
    for (let i = 1; i < arrayPikachu.length - 1; i++) {
        for (let j = 1; j < arrayPikachu[i].length - 1; j++) {
            if (arrayPikachu[i][j] === VAL_GO) {
                count++;
            } else {
                return false;
            }
        }
    }
    if (count == (nCouble * 2)) {
        return true;
    }
    return false;
}

// Vẽ đường đi
function drawPath(arrPoint) {
    let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    svg.appendChild(path);
    path.setAttribute("d", "M " + arrPoint.map(p => (WIDTH_CELL / 2 + p.y * WIDTH_CELL) + ',' + (HEIGHT_CELL / 2 + p.x * HEIGHT_CELL)).join(' '));

}
// tổng điểm
function totalScoreFinal(){
    return totalScore+totalFind*500+time*10+totalExchange*200;
}
// lên level
function levelUp(){
    if(level<6){
        level++;
        time+=6000;
        totalFind+=50;
        initArray2DPikachu();
        shuffle(arrayPikachu, nrow, ncol);
        changePikachu();
        let timeTemporary  = time;
        intervalCountDown = setInterval(function (){
            countDown(timeTemporary);
        },1000);
        levelText.innerHTML = level;
        countFindDom.innerHTML = totalFind;
        score.innerHTML = totalScore;

    }
}
// hiện thông báo lên level tổng kết điểm
function gameUp(){
    clearInterval(intervalCountDown);
    let html = `<ul class="list-item">
        <li id="level-final">
            <p>Cấp độ:</p>
            <p >${level}</p>
        </li>
        <li id="score-final">
            <p>Điểm:</p>
            <p >${totalScore}</p>
        </li>
       <li id="score-final">
            <p>Thời gian còn lại ${time}:</p>
            <p >${time*10}</p>
       </li>
        <li id="turn-final">
            <p>Item hoán đổi x${totalExchange}:</p>
            <p >${totalExchange*200}</p>
        </li>
        <li id="find-final">
            <p>Item tìm giúp x${totalFind}:</p>
            <p >${totalFind*500}</p>
        </li>
    </ul>
    <div id="total" class="total">
        <p>TỔNG CỘNG: ${totalScoreFinal()}</p>
    </div>
    <button class="modal__btn">Tiếp tục →</button>`

    modalDom.querySelector('#content').innerHTML = html;
    totalScore=totalScoreFinal();
    modalDom.classList.add('active');
    modalDom.querySelector(".modal__btn").addEventListener('click', function(e){
        levelUp();
        modalDom.classList.remove('active');
    })
}
function gameOver(){
    clearInterval(intervalCountDown);

    let html = `
    <h4 class="text-over">Game kết thúc</h4>
    <p>Bạn đã hết thời gian</p>
    <ul class="list-item">
        <li id="level-final">
            <p>Cấp độ:</p>
            <p >${level}</p>
        </li>
        <li id="score-final">
            <p>Điểm:</p>
            <p >${totalScore}</p>
        </li>
       
        <li id="turn-final">
            <p>Item hoán đổi x:</p>
            <p >1000</p>
        </li>
        <li id="find-final">
            <p>Item tìm giúp x${totalFind}:</p>
            <p >${totalFind*500}</p>
        </li>
    </ul>
    <div id="total" class="total">
        <p>TỔNG CỘNG: ${totalScoreFinal()}</p>
    </div>
    <button class="modal__btn">Chơi lại →</button>`
    modalDom.querySelector('#content').innerHTML = html;
    modalDom.classList.add('active');
    modalDom.querySelector(".modal__btn").addEventListener('click', function(e){
        initGame();
        modalDom.classList.remove('active');
    })

}
function duplicates(){
    const resultMap = new Map();
    // This will store the unique array values (to detect duplicates using indexOf)
    for (let i = 1; i < arrayPikachu.length - 1; i++) {
        for (let j = 1; j < arrayPikachu[i].length - 1; j++) {
            if (resultMap.has(arrayPikachu[i][j])) {
                resultMap.set(arrayPikachu[i][j], resultMap.get(arrayPikachu[i][j]) + 1);
            } else {
                resultMap.set(arrayPikachu[i][j], 1);
            }
        }
    }
    for (const [key, value] of resultMap) {
        if (value%2!==0) {
            console.log(key+' '+value);
        }
    }
    return resultMap;
}
