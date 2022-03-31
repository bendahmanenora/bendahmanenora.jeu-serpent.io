window.onload = function()
{
    
    var canvasWidth = 900;
    var canvasHeight = 600;
    var blockSize = 30;
    var ctx;
    var delay= 100;
    var applee;
    var widthInBlock = canvasWidth/blockSize;
    var heightInBlocks = canvasHeight/blockSize;
    var snakee;
    var score;
    init();
    
    function init()// pour initialiser  
    {
    var canvas = document.createElement('canvas');
    canvas.width= canvasWidth;
    canvas.height= canvasHeight;
    canvas.style.border ="1px solid";
    document.body.appendChild(canvas);

    ctx = canvas.getContext('2d');
    snakee = new snake([[6,4], [5,4], [4,4],[3,4],[2,4]], "right");
    applee = new apple([10,10]); 
    //ctx.fillStyle ="#ff0000";// color
    //ctx.fillRect(30 ,30 , 100, 50); // icci 100 largeur 50 hauteur,
    score= 0;
       
        
        refresgCanvas();
    }
    
    function refresgCanvas(){
                
    ctx.clearRect(0,0,canvasWidth,  canvasHeight);
   
   
        snakee.advance();
        if(snakee.checkCollision())
        {
            gameOver();
        }
       else
       {
           if(snakee.isEatingapple(applee))
           { 
            score++;
               snakee.ateApple= true;
               do
               {
                applee.setNewPostion();

               }
               while(applee.isOnSnake(snakee))
               
               // le serpent a mange une pomme
           }
        ctx.clearRect(0,0,canvasWidth, canvasHeight)
        snakee.draw();
        applee.draw();
        drawScor();
        // qui permets d'exucte la fonction refresgCanvas a un delai de 1s
         setTimeout(refresgCanvas,delay);
        
       }
    }
    //function gime ouvre
    function gameOver()
    { // Début de gameOver
        ctx.save(); 
        //ctx.font = "bold 70px sans-sherif";
        //ctx.fillStyle = "#000";
        //ctx.textAlign ="center";
        //ctx.textBaseline = "middle";
        //ctx.strokeStyle = "white";
        //ctx.lineWidth = 5;
        //var centreX = canvasWidth / 2;
        //var centreY = canvasHeight /2;
       // ctx.strokeText("Game Over", centreX, centreY-180);
        ctx.fillText("Game Over", 5, 15);
        //ctx.font = "bold 30px sans-sherif";
        //ctx.strokeText("Appuyez sur la touche expace pour rejouer", centreX, centreY-120);
        ctx.fillText("Appuyez sur la touche expace pour rejouer",   5, 30);
        ctx.restore(); 
     } // --- Fin de gameOver
     // dunction restart 
     function restart()
    { // Début de restart
      snakee = new snake([[6,4],[5,4],[4,4],[3,4],[2,4]],"right");
      applee = new apple([10,10]);
      score =0; 
      clearTimeout(timeout); // réinitialise le timeout = même vitesse pour chaque partie
      refresgCanvas();  
    } // fin de restart
    // 
    function drawScor()
    {
        ctx.save();
        ctx.fillText(score.toString(), 5, canvasHeight-5);
        
        ctx.restore();
    }
    // creation function drawBlock
    function drawBlock(ctx, postion)
    {
     var x = postion[0] * blockSize; 
     var y = postion[1] * blockSize;
        ctx.fillRect(x ,y , blockSize, blockSize);
    }
    // function du serpent
   function snake(body, direction)
    {
            this.body = body; 
            this.direction = direction;
            this.ateApple= false;
            this.draw= function()
                {
                ctx.save();
                ctx.fillStyle ="#ff0000";
                    for(var i = 0; i < this.body.length; i++)
                        {
                            drawBlock(ctx, this.body[i]);
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
                    this.direction=newDirection; 
                    }
                
            };
            this.checkCollision = function()
            {
                var wallCollision= false;
                var snakCollision = false;
                var head = this.body[0];
                var rest = this.body.slice(1);
                var snakeX = head[0];
                var snakeY = head[1];
                var minX = 0;
                var minY = 0;
                var maxX = widthInBlock-1;
                var maxY =  heightInBlocks-1;
                var isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX;
                var isNotBetweenverticallWalls = snakeY < minY || snakeY > maxY;
                if(isNotBetweenHorizontalWalls || isNotBetweenverticallWalls)
                {
                    wallCollision = true;
                }
                for( var i= 0; i<rest.length; i++)
                {
                    if(snakeX == rest[1][0] && snakeY== rest[i][1])
                    {
                        snakCollision = true;
                    }
                }  
               return wallCollision || snakCollision;
            };
            this.isEatingapple= function(appleToEat)
            {
              var head = this.body[0];
              if(head[0] === appleToEat.postion[0] && head[1]=== appleToEat.postion[1])
              
                  return true;
              
              else
                  return false;
              
            };
        }
        // function pour la pomme

        function apple(postion)
        {
            this.postion = postion;
            this.draw = function()
                { 
                ctx.save();
                ctx.fillStyle = "#33cc33";
                ctx.beginPath();
                var radius = blockSize/2;
                var x = this.postion[0]*blockSize+radius;
                
                var y = this.postion[1]*blockSize+radius;
                ctx.arc(x,y, radius,0 , Math.PI*2, true);
                ctx.fill();
                ctx.restore();
                
            };
            this.setNewPostion = function()
                {
               var newX = Math.round(Math.random() * (widthInBlock -1));
               var newY = Math.round(Math.random() * (heightInBlocks -1));
               this.postion[newX,newY];
            };
            this.isOnSnake = function(snakeToCkeck)
            {
             var isOnSnake = false;
             for (var i = 0; i < snakeToCkeck.body.length; i++)
             {
                 if(this.postion[0] === snakeToCkeck.body[i][0] && this.postion[1]=== snakeToCkeck.body[i][1])
                 {
                     isOnSnake= true;
                 }
             }
             return isOnSnake;
            };

        }


// évènement qaund on clic sur clavier
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
                                    restart();
                                    return;
                                    break;
                                default:
                                return;
                            
                            }
                    snakee.setDirection(newDirection);
                 }

}

