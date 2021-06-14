documentWidth=window.screen.availWidth;
gridContainerWidth=0.92*documentWidth;
cellSideLength=0.18*documentWidth;
cellSpace=0.04*documentWidth;

function getPosTop(i,j){
    return cellSpace+i*(cellSpace+cellSideLength);
}
function getPosLeft(i,j){
    return cellSpace+j*(cellSpace+cellSideLength);
}
function getNumberBackgroundColor(number){
    switch(number){
        case 2:return "#eee4da";break;
        case 4:return "#ede0c8";break;
        case 8:return "#f2b179";break;
        case 16:return "#f59563";break;
        case 32:return "#f67c5f";break;
        case 64:return "#f65e3b";break;
        case 128:return "#edcf72";break;
        case 256:return "#edcc61";break;
        case 512:return "#9c0";break;
        case 1024:return "#33b5e5";break;
        case 2048:return "#09c";break;
        case 4096:return "#a6c";break;
        case 8192:return "#93c";break;
    }
    return "black";
}
function getNumberColor(number){
    if(number<=4){
        return '#776e65';
    }else{
        return "white";
    }
}

function getNumberText(number){
    switch(number){
        case 2:return "高中数学";break;
        case 4:return "ttr";break;
        case 8:return "小吸血鬼";break;
        case 16:return "淀粉";break;
        case 32:return "太南";break;
        case 64:return "太北";break;
        case 128:return "你实";break;
        case 256:return "111";break;
        case 512:return "7782";break;
        case 1024:return "椎名文帝";break;
        case 2048:return "垃R";break;
        case 4096:return "gay帝";break;
        case 8192:return "李老板";break;
    }
    return "black";
}

function nospace(board){
    for(var i=0;i<4;i++){
        for(var j=0;j<4;j++){
            if(board[i][j]==0){
                return false;
            }
        }
    }
    return true;
}

function canMoveLeft(board){//判断是否可移动的必要性
    for(var i=0;i<4;i++){
        for(var j=1;j<4;j++){//第一列无需考虑
            if(board[i][j]!=0){
                if(board[i][j-1]==0||board[i][j-1]==board[i][j]) return true;
            }
        }
    }
    return false;
}

function canMoveUP(board){//判断是否可移动的必要性
    for(var i=1;i<4;i++){
        for(var j=0;j<4;j++){//第一行无需考虑
            if(board[i][j]!=0){
                if(board[i-1][j]==0||board[i-1][j]==board[i][j]) return true;
            }
        }
    }
    return false;
}

function canMoveRight(board){//判断是否可移动的必要性
    for(var i=0;i<4;i++){
        for(var j=2;j>=0;j--){//第四列无需考虑
            if(board[i][j]!=0){
                if(board[i][j+1]==0||board[i][j+1]==board[i][j]) return true;
            }
        }
    }
    return false;
}

function canMoveDown(board){//判断是否可移动的必要性
    for(var i=2;i>=0;i--){
        for(var j=0;j<4;j++){//第四行无需考虑
            if(board[i][j]!=0){
                if(board[i+1][j]==0||board[i+1][j]==board[i][j]) return true;
            }
        }
    }
    return false;
}

function noBlockHorizontal(row,col1,col2,board){//判断实际移动阻挡 （行 当前列 需求列 二维数组）
    for(var i=col1+1;i<col2;i++){//遍历中间表格元素 有非零则判断不可
        if(board[row][i]!=0){
            return false;
        }
    }return true;
}

function noBlockVertical(col,row1,row2,board){//判断实际移动阻挡 （列 当前行 需求行 二维数组）
    for(var i=row1+1;i<row2;i++){//遍历中间表格元素 有非零则判断不可
        if(board[i][col]!=0){
            return false;
        }
    }return true;
}

// function nomove( board ){
//     if( canMoveLeft( board ) ||
//         canMoveRight( board ) ||
//         canMoveUp( board ) ||
//         canMoveDown( board ) )
//         return false;

//     return true;
// }