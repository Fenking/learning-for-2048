var board=new Array();
var score=0;
var hasConflicted=new Array();//判断单步是否产生每格一次叠加

var startx=0;
var starty=0;
var endx=0;
var endy=0;

$(document).ready(function () {
    newgame();
});

function prepareForMobile(){//手机屏幕自适应
    if(documentWidth>500){
        gridContainerWidth=500;
        cellSpace=20;
        cellSideLength=100;
    }
    $('#grid-container').css('width',gridContainerWidth-2*cellSpace);
    $('#grid-container').css('height',gridContainerWidth-2*cellSpace);
    $('#grid-container').css('padding',cellSpace);
    $('#grid-container').css('border-radius',0.02*gridContainerWidth);

    $('.grid-cell').css('width',cellSideLength);
    $('.grid-cell').css('height',cellSideLength);
    $('.grid-cell').css('border-radius',0.02*cellSideLength);
}

function newgame(){
    prepareForMobile();
    //初始化棋盘格子
    init();
    //随机找两个格子生成数字
    generateOneNumber();
    generateOneNumber();
}

function init(){
    for(var i=0;i<4;i++){//初始格子设定
        for(var j=0;j<4;j++){
            
            var gridCell=$("#grid-cell-"+i+"-"+j);
            gridCell.css('top',getPosTop(i,j));
            gridCell.css('left',getPosLeft(i,j));
        }
    }
    for(var i=0;i<4;i++){//二维数组化
        board[i]=new Array();
        hasConflicted[i]=new Array();//二维数组化hasConflicted
        for(var j=0;j<4;j++){
            board[i][j]=0;
            hasConflicted[i][j]=false;
        }
    }//二维数组化hasConflicted
    updateBoardView();
    score=0;
    $('#score').text(score);
}

function updateBoardView(){
    $(".number-cell").remove();//清空格子
    for(var i=0;i<4;i++){
        for(var j=0;j<4;j++){//重新赋值
            $("#grid-container").append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>');
            var theNumberCell=$('#number-cell-'+i+'-'+j);

            if(board[i][j]==0){//是否显现
                theNumberCell.css('width','0px');//无大小
                theNumberCell.css('height','0px');
                theNumberCell.css('top',getPosTop(i,j)+cellSideLength/2);//放置在格子中间
                theNumberCell.css('left',getPosLeft(i,j)+cellSideLength/2);
                // theNumberCell.css('font-size',0.2*cellSideLength+'px');
            }else{//显现的情况
                theNumberCell.css('width',cellSideLength);
                theNumberCell.css('height',cellSideLength);
                theNumberCell.css('top',getPosTop(i,j));
                theNumberCell.css('left',getPosLeft(i,j));
                theNumberCell.css('background-color',getNumberBackgroundColor(board[i][j]));//显示不同背景色
                theNumberCell.css('color',getNumberColor(board[i][j]));//显示内容颜色
                // theNumberCell.text(board[i][j]);//显示内容
                theNumberCell.text(getNumberText(board[i][j]));
                // theNumberCell.css('font-size',0.2*cellSideLength+'px');
            }
            hasConflicted[i][j]=false;
        }
    }
    $(".number-cell").css('line-height',cellSideLength+'px');//字体集中在了这里
    $(".number-cell").css('font-size',0.2*cellSideLength+'px');
}

function generateOneNumber(){
    if(nospace(board)){
        return false;//return false有阻止表单继续进行的作用 相当于强制让下面成为了else 即不写else也可阻止下面运行
    }else{
        //随机位置
        // var randx=parseInt(Math.floor(Math.random()*4));
        // var randy=parseInt(Math.floor(Math.random()*4));
        // while(true){
        //     if(board[randx][randy]==0){
        //         break;
        //     }else{
        //         randx=parseInt(Math.floor(Math.random()*4));
        //         randy=parseInt(Math.floor(Math.random()*4));
        //     }
        // }
        var randx,randy;
        do{
            randx=parseInt(Math.floor(Math.random()*4));
            randy=parseInt(Math.floor(Math.random()*4));
        } while(board[randx][randy]!=0)
        //随机数字
        var randNumber=Math.random()<0.5?2:4;
        //在随即位置显示随机数字
        board[randx][randy]=randNumber;
        showNumberWithAnimation(randx,randy,randNumber);
        return true;
    }
}

$(document).keydown(function (event) { 
    // event.preventDefault();//阻挡原有行动
    switch(event.keyCode){//左
        case 37:
            event.preventDefault();//阻挡原有行动并不影响其他按键
            if(moveLeft()){
                setTimeout("generateOneNumber()",220);//当可以执行move时 增加一个数字并判断游戏是否结束
                setTimeout("isGameover()",300);
            }break;//不可即不处理
        case 38://上
            event.preventDefault();
            if(moveUP()){
                setTimeout("generateOneNumber()",220);
                setTimeout("isGameover()",300);
            }break;
        case 39://右
            event.preventDefault();
            if(moveRight()){
                setTimeout("generateOneNumber()",220);
                setTimeout("isGameover()",300);
            }break;
        case 40://下
            event.preventDefault();
            if(moveDown()){
                setTimeout("generateOneNumber()",220);
                setTimeout("isGameover()",300);
            }break;
        default://其他
            break;
    }
});

document.addEventListener('touchstart',function(event){//触摸起点判断
    startx=event.touches[0].pageX;
    starty=event.touches[0].pageY;
});

document.addEventListener('touchmove',function(event){
    event.preventDefault();
});

document.addEventListener('touchend',function(event){//触摸终点判断
    endx=event.changedTouches[0].pageX;
    endy=event.changedTouches[0].pageY;

    var deltax=endx-startx;
    var deltay=endy-starty;

    if(Math.abs(deltax)<0.1*documentWidth && Math.abs(deltay)<0.1*documentWidth) return;

    var containerx = $('#grid-container').offset().left;//棋盘格外触控不进行滑动
    if(containerx>=startx) return true;
    if(containerx+gridContainerWidth<=startx) return true;

    var containery = $('#grid-container').offset().top;
    if(containery>=starty) return true;
    if(containery+gridContainerWidth<=starty) return true;

    if(Math.abs(deltax)>=Math.abs(deltay)){//此次为x
        if(deltax>0){
            //move right
            if(moveRight()){
                setTimeout("generateOneNumber()",220);
                setTimeout("isGameover()",300);
            }
        }else{
            //move left
            if(moveLeft()){
                setTimeout("generateOneNumber()",220);
                setTimeout("isGameover()",300);
            }
        }
    }else{
        if(deltay>0){
            //move down
            if(moveDown()){
                setTimeout("generateOneNumber()",220);
                setTimeout("isGameover()",300);
            }
        }else{
            //move up
            if(moveUP()){
                setTimeout("generateOneNumber()",220);
                setTimeout("isGameover()",300);
            }
        }
    }
});

function isGameover(){
    if(nospace(board)){
        if(!canMoveLeft(board) && !canMoveUP(board) && !canMoveRight(board) && !canMoveDown(board)){
            alert("game over");
        }
    }
}
// function isGameover(){
//     if( nospace( board ) && nomove( board ) ){
//         gameover();
//     }
// }

// function gameover(){
//     alert('gameover!');
// }

function moveLeft(){//左
    if(!canMoveLeft(board)){//移动判断
        return false;
    }else{
        for(var i=0;i<4;i++){
            for(var j=1;j<4;j++){
                if(board[i][j]!=0){
                    for(var k=0;k<j;k++){
                        if(board[i][k]==0&&noBlockHorizontal(i,k,j,board)){
                            //move
                            showMoveAnimation(i,j,i,k);//实施动画
                            board[i][k]=board[i][j];//更换值
                            board[i][j]=0;//清空原值
                            continue;
                        }else if(board[i][k]==board[i][j]&&noBlockHorizontal(i,k,j,board)&&hasConflicted[i][k]==false){
                            //move+add
                            showMoveAnimation(i,j,i,k);//实施动画
                            board[i][k]+=board[i][j];//值叠加
                            board[i][j]=0;//清空原值
                            //add score
                            score+=board[i][k];
                            updateScore(score);
                            //碰撞确认
                            hasConflicted[i][k]==true;
                            continue;
                        }
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()",200);//延迟刷新 使动画有时间播放
    return true;
}

function moveUP(){//上
    if(!canMoveUP(board)){//移动判断
        return false;
    }else{
        for(var i=1;i<4;i++){
            for(var j=0;j<4;j++){
                if(board[i][j]!=0){
                    for(var k=0;k<i;k++){
                        if(board[k][j]==0&&noBlockVertical(j,k,i,board)){
                            //move
                            showMoveAnimation(i,j,k,j);//实施动画
                            board[k][j]=board[i][j];//更换值
                            board[i][j]=0;//清空原值
                            continue;
                        }else if(board[k][j]==board[i][j]&&noBlockVertical(j,k,i,board)&&hasConflicted[k][j]==false){
                            //move+add
                            showMoveAnimation(i,j,k,j);//实施动画
                            board[k][j]+=board[i][j];//值叠加
                            board[i][j]=0;//清空原值
                            //add score
                            score+=board[k][j];
                            updateScore(score);
                            //碰撞确认
                            hasConflicted[k][j]==true;
                            continue;
                        }
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()",200);//延迟刷新 使动画有时间播放
    return true;
}

function moveRight(){//右
    if(!canMoveRight(board)){//移动判断
        return false;
    }else{
        for(var i=0;i<4;i++){
            for(var j=2;j>=0;j--){
                if(board[i][j]!=0){
                    for(var k=3;k>j;k--){
                        if(board[i][k]==0&&noBlockHorizontal(i,j,k,board)){//反向验证即可
                            //move
                            showMoveAnimation(i,j,i,k);//实施动画
                            board[i][k]=board[i][j];//更换值
                            board[i][j]=0;//清空原值
                            continue;
                        }else if(board[i][k]==board[i][j]&&noBlockHorizontal(i,j,k,board)&&hasConflicted[i][k]==false){
                            //move+add
                            showMoveAnimation(i,j,i,k);//实施动画
                            board[i][k]+=board[i][j];//值叠加
                            board[i][j]=0;//清空原值
                            //add score
                            score+=board[i][k];
                            updateScore(score);
                            //碰撞确认
                            hasConflicted[i][k]==true;
                            continue;
                        }
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()",200);//延迟刷新 使动画有时间播放
    return true;
}

function moveDown(){//下
    if(!canMoveDown(board)){//移动判断
        return false;
    }else{
        for(var i=2;i>=0;i--){
            for(var j=0;j<4;j++){
                if(board[i][j]!=0){
                    for(var k=3;k>i;k--){
                        if(board[k][j]==0&&noBlockVertical(j,i,k,board)){//反向验证即可
                            //move
                            showMoveAnimation(i,j,k,j);//实施动画
                            board[k][j]=board[i][j];//更换值
                            board[i][j]=0;//清空原值
                            continue;
                        }else if(board[k][j]==board[i][j]&&noBlockVertical(j,i,k,board)&&hasConflicted[k][j]==false){
                            //move+add
                            showMoveAnimation(i,j,k,j);//实施动画
                            board[k][j]+=board[i][j];//值叠加
                            board[i][j]=0;//清空原值
                            //add score
                            score+=board[k][j];
                            updateScore(score);
                            //碰撞确认
                            hasConflicted[k][j]==true;
                            continue;
                        }
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()",200);//延迟刷新 使动画有时间播放
    return true;
}
// var a=(156986461518121560+'').split('').map(v=>parseInt(v)).sort().reverse().join('')
// console.log(a)