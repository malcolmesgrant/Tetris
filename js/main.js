//The main idea of the game is to make different pieces that drop down and rotate with a push of a button
//make box for game
const canvas = document.getElementById('tetris');
//take context out cuz u cant draw on Dom elements
const context = canvas.getContext('2d');
//change the size percentage with scale
context.scale(20, 20);
//I want the row thats filled to disappear
function arenaSweep(){
    var rowCount= 1;
    outer: for (var y= arena.length-1;y>0;--y){
      for (x=0; x < arena[y].length; ++x) {
        //I want to check what row has a zero in it to see if its filled
        if (arena[y][x] === 0){
          continue outer;
        }
      }
      //then i want to remove the line
      //the array references the Y for the next row to fill it with zeros
      const row = arena.splice(y, 1)[0].fill(0);
      //That row should be put at the top of the arena
      arena.unshift(row);
      ++y;

      player.score += rowCount * 10;
      //for every row i want to double the score i get
      rowCount *= 2;
      //update score
    }
}

function collide(arena, player) {
  const [m, o]= [player.matrix, player.pos]
  for (var y=0;y< m.length; ++y){
    for (var x=0; x<m[y].length;++x){
      if(m[y][x]!==0 &&
        (arena[y+o.y] &&
        arena[y+o.y][x+o.x])!==0){
          return true;
        }
    }
  }
  return false;
}//Create a matrix to represent the letters
function createMatrix(w, h){
  const matrix= [];
  //Change the shape that comes out
  while (h--){
    matrix.push(new Array(w).fill(0)) ;
  }
  return matrix;
}//create the game pieces, use the O.G. shapes
function createPiece(type) {
  if (type=== 'T'){

      return[//use extra line 3x3 because its easier to rotate
       [0, 0, 0],
       [1, 1, 1],
       [0, 1, 0],
   ];
 }else if (type=== 'O'){
   return[
  [2, 2],
  [2, 2],
  ];
}else if (type=== 'L'){

    return[
    [0, 3, 0],
    [0, 3, 0],
    [0, 3, 3],
 ];
}else if (type=== 'J'){

    return[
    [0, 4, 0],
    [0, 4, 0],
    [4, 4, 0],
 ];
}else if (type=== 'I'){

    return[
    [0, 5, 0, 0],
    [0, 5, 0, 0],
    [0, 5, 0, 0],
    [0, 5, 0, 0],
 ];
}else if (type=== 'S'){

    return[
    [0, 6, 6],
    [6, 6, 0],
    [0, 0, 0],
 ];
}else if (type=== 'Z'){

    return[
    [7, 7, 0],
    [0, 7, 7],
    [0, 0, 0],
    ];
  }
}//make black box
function draw(){
  context.fillStyle = '#000';
  context.fillRect(0, 0, canvas.width, canvas.height);
  drawMatrix(arena, {x:0, y:0});
  drawMatrix(player.matrix, player.pos);
}// the game needs to know the value of the arrays in the matrix
//so reference the context of the canvas to affect it
function drawMatrix(matrix, offset){
    matrix.forEach((row, y) => {
    row.forEach((value, x)  => {
      if( value!== 0) {
        context.fillStyle= colors[value];
        context.fillRect(x + offset.x,
                         y + offset.y,
                         1, 1);
      }
    });
  });
}

function merge(arena, player){
  player.matrix.forEach((row, y)=>{
  row.forEach((value, x)=>{
    if (value!==0){
      arena[y + player.pos.y][x + player.pos.x]= value;
    }
  });
});
}//player starts
function playerDrop() {
  player.pos.y++ ;
  if (collide(arena, player)){
    player.pos.y--;
    merge(arena, player);
    playerReset();
    arenaSweep();
    updateScore();
  }
  dropCounter=0;

}

function playerMove(dir) {
  player.pos.x+= dir;
  if (collide(arena, player)){
      player.pos.x-=dir;
  }
}//When the blocks hit the top we need to reset the game
function playerReset(){
  const pieces = 'ILJOTSZ';
  player.matrix= createPiece(pieces[pieces.length * Math.random() | 0]);
  player.pos.y=0;
  player.pos.x= (arena[0].length/ 2 | 0) -
                (player.matrix[0].length/ 2 | 0);
              //need a collide function to tell us when the game is over when all pieces get to the top
            if (collide(arena, player)){
              //this clears the arena
              arena.forEach(row=>row.fill(0));
              player.score=0;
              updateScore();
            }
}
function playerRotate (dir){
  var offset=1;
  rotate(player.matrix, dir);
  while(collide(arena, player)){
    player.pos.x+= offset;
    offset= -(offset + (offset > 0? 1:-1 ));
    if (offset>player.matrix[0].length){
      rotate(player.matrix, -dir);
      player.pos.x = pos;
      return;
    }
  }
}
function rotate(matrix, dir){
  for ( var y=0; y<matrix.length;++y){
    for ( var x=0; x< y; ++x) {
      [
        matrix[x][y],
        matrix[y][x],
      ]= [
        matrix[y][x],
        matrix[x][y],
      ];

    }

  }

  if (dir > 0) {
    matrix.forEach(row=> row.reverse());
  }else{
    matrix.reverse();
  }
}
  var dropCounter= 0;
  var dropInterval= 1000;

 var lastTime = 0;
function update(time=0){
  const deltaTime = time - lastTime;
  lastTime= time;

  dropCounter += deltaTime;
  if (dropCounter > dropInterval) {
    playerDrop();
  }

  draw();
  requestAnimationFrame(update);
}
function updateScore(){
  document.getElementById('score').innerText = player.score;
}
const colors = [
  null,
  '#FF0D72',
  '#0DC2FF',
  '#0DFF72',
  '#F538FF',
  '#FF8E0D',
  '#FFE138',
  '#3877FF',
];
const arena = createMatrix(12, 20);
const player = {
  pos:  {x: 0, y: 0},
  matrix: null,
  score: 0,
}

document.addEventListener('keydown', event =>{
  if (event.keyCode === 37){
    playerMove(-1);
  } else if (event.keyCode === 39){
    playerMove(1);
  } else if (event.keyCode === 40){
    playerDrop();
  }else if (event.keyCode === 81){
    playerRotate(-1);
  }else if (event.keyCode === 87){
    playerRotate(1);
}
});
playerReset();
//bootstrap so we can see
updateScore();
update();
