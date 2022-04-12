// variable globale
var snake;
var apple;
var snakeGame;
window.onload = function()
{ 
    snakeGame = new SnakeGeme(900, 430, 30, 100);
    snake = new Snake([[6, 4], [5, 4], [4, 4], [3, 4], [2, 4]], "right");
    apple = new Apple([10, 10]);
    snakeGame.init(snake,apple);
}
//événement pour les touches de clavier
document.onkeydown = function handleKeyDown(e)
{
     var key = e.keyCode;
     var newDirection;
     switch(key)
            {
                 case 37:
                 newDirection ="left";
                 break;
                 case 38:
                 newDirection ="up";
                 break;
                 case 39:
                 newDirection ="right";
                 break;
                 case 40:
                 newDirection ="down"; 
                 break;
                 case 32:
                    snake = new Snake([[6,4],[5,4],[4,4],[3,4],[2,4]],"right");
                    apple = new Apple([10,10]);
                    snakeGame.init(snake,apple);
                     return;
                 default:
                  return;
             
             }
             snakeGame.snake.setDirection(newDirection);
}
// fonction de jeu 
function SnakeGeme(canvasWidth, canvasHeight, blockSize, delay)
{
    this.canvas= document.createElement('canvas');
    this.canvas.width= canvasWidth;
    this.canvas.height= canvasHeight;
    this.canvas.style.border ="1px solid gray";
    this.canvas.style.margin = "50px auto";
    this.canvas.style.display = "block";
    this.canvas.style.backgroundColor = "#ddd";
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d'); 
    this.blockSize = blockSize;
    this.delay = delay;
    this.snake;
    this.apple;
    this.widthInBlock = canvasWidth/blockSize;
    this.heightInBlocks = canvasHeight/blockSize;
    this.score;
    var instance = this;
    var timeout;

    this.init = function (snake, apple) 
    {
        this.snake= snake;
        this.apple= apple;
        this.score= 0;
        clearTimeout(timeout);
        refresgCanvas();   
    } 
    var refresgCanvas = function()
    {
                
        instance.snake.advance();
        if(instance.checkCollision())
        {
            instance.gameOver();
        }
       else
       {
           if(instance.snake.isEatingapple(instance.apple))
           { 
               instance.score++;
               instance.snake.ateApple= true;
               do
               {
                instance.apple.setNewPostion(instance.widthInBlock,instance.heightInBlocks);

               }
               while(instance.apple.isOnSnake(instance.snake))
               
            
           }
        instance.ctx.clearRect(0,0,instance.canvas.width, instance.canvas.height);
        instance.drawScor();
        
        instance.snake.draw(instance.ctx, instance.blockSize);
        instance.apple.draw(instance.ctx, instance.blockSize);
        // qui permets d'exucte la fonction refresgCanvas a un delai de 1s
        timeout = setTimeout(refresgCanvas,delay); 
       }
    } 
    this.checkCollision = function()
            {
                var wallCollision= false;
                var snakCollision = false;
                var head = this.snake.body[0];
                var rest = this.snake.body.slice(1);
                var snakeX = head[0];
                var snakeY = head[1];
                var minX = 0;
                var minY = 0;
                var maxX = this.widthInBlock - 1;
                var maxY = this.heightInBlocks - 1;
                var isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX;
                var isNotBetweenverticallWalls = snakeY < minY || snakeY > maxY;
                if(isNotBetweenHorizontalWalls || isNotBetweenverticallWalls)
                {
                    wallCollision = true;
                }
                for( var i= 0; i< rest.length; i++)
                {
                    if(snakeX === rest[i][0] && snakeY === rest[i][1])
                    {
                        snakCollision = true;
                    }
                }  
               return wallCollision || snakCollision;
            }; 
    //function gime ouvre
    this.gameOver = function()
    { // Début de gameOver
        this.ctx.save(); 
        this.ctx.font = "bold 30px sans-serif";
        this.ctx.fillStyle = "#000";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.strokeStyle="white";
        this.ctx.lineWidth="5";
         var centerX = this.canvas.width / 2;
         var centerY = this.canvas.height / 2;  


        this.ctx.strokeText("Game Over", centerX, centerY -180);
        this.ctx.fillText("Game Over", centerX, centerY -180);

        this.ctx.font = "bold 30px sans-serif";
        this.ctx.strokeText("Appuyez sur la touche Espace pour rejouer", centerX, centerY -120);

        this.ctx.fillText("Appuyez sur la touche Espace pour rejouer",  centerX, centerY -120);
        this.ctx.restore(); 
     }; // --- Fin de gameOver
     //
     this.drawScor = function()
     {
         this.ctx.save();
         this.ctx.font = "bold 200px sans-serif";
         this.ctx.fillStyle = "gray";
         this.ctx.textAlign = "center";
         this.ctx.textBaseline = "middle";
         var centerX = this.canvas.width / 2;
         var centerY = this.canvas.height / 2; 
         this.ctx.fillText(this.score.toString(), centerX, centerY);
         this.ctx.restore();
     };
}

function Snake(body, direction)
    {
        this.body = body; 
        this.direction = direction;
        this.ateApple= false;
        this.draw = function(ctx, blockSize)
           {
                ctx.save();
                ctx.fillStyle = "gray";
                    for(var i = 0; i < this.body.length; i++)
                        {   
                        var x = this.body[i][0] * blockSize; 
                        var y = this.body[i][1] * blockSize;
                        ctx.fillRect(x ,y , blockSize, blockSize);
                        }
                    ctx.restore();
             };
                // function pour faire avancer le serpent
        this.advance= function()
            {
                var nextPostion = this.body[0].slice();
                    switch(this.direction)
                        {
                            case "left":
                                nextPostion[0] -= 1;
                                break;
                            case "right":
                            nextPostion[0] += 1;
                                break;
                            case "down":
                            nextPostion[1] += 1;
                            break;
                            case "up":
                            nextPostion[1] -= 1;
                                break;
                            default:
                            throw("invalid direction");
                        }
                this.body.unshift(nextPostion);
                    if(!this.ateApple)
                      this.body.pop();
                    else
                    this.ateApple= false;
            };
            
        this.setDirection = function(newDirection)
            {
                var allowedDiction;
                switch(this.direction)
                    {
                            case "left":
                            case "right":
                              allowedDiction = ["up","down"];
                                break;
                            case "down":   
                            case "up":
                              allowedDiction = ["left","right"];
                                break;
                            default:
                            throw("invalid direction");
                    }
                if( allowedDiction.indexOf(newDirection) > -1)
                    {
                    this.direction = newDirection; 
                    }
                
            };
        this.isEatingapple= function(appleToEat)
            {
              var head = this.body[0];
              if(head[0] === appleToEat.postion[0] && head[1] === appleToEat.postion[1])
        
                return true;
              else
              
                return false;
              
            };
           
 }
 // fin de fonction snake
 
        // function apple
function Apple(postion)
    {
        this.postion = postion;
        this.draw = function(ctx, blockSize)
            { 
                ctx.save();
                ctx.fillStyle = "#33cc33";
                ctx.beginPath();
                var radius = blockSize/2;
                var x = this.postion[0]*blockSize + radius;
                
                var y = this.postion[1]*blockSize + radius;
                ctx.arc(x,y, radius, 0, Math.PI*2, true);
                ctx.fill();
                ctx.restore();
                
            };
        this.setNewPostion = function(widthInBlock,heightInBlocks )
          {
            var newX = Math.round(Math.random() * (widthInBlock -1));
            var newY = Math.round(Math.random() * (heightInBlocks -1));
            this.postion=[newX, newY];
         };

        this.isOnSnake = function(snakeToCkeck)
          {
            var isOnSnake = false;
             for (var i = 0; i < snakeToCkeck.body.length; i++)
                {
                    if(this.postion[0] === snakeToCkeck.body[i][0] && this.postion[1] === snakeToCkeck.body[i][1])
                        {
                            isOnSnake= true;
                        }
                }
                return isOnSnake;
          };
    }   
   