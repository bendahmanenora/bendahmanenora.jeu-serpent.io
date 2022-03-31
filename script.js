window.onload = function()
{

    var canvasWidth = 900;
    var canvasHeight = 600;
    var blockSize = 30;
    var ctx;
    var delay= 1000;
    var applee;
    var widthInBlock = canvasWidth/blockSize;
    var heightInBlocks = canvasHeight/blockSize;

    
   //var  xCoord = 0;// initialiser la varibale 
   //var  yCoord = 0; // initialiser la varibale 
    var snakee;
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
       
        
        refresgCanvas();
    }
    
    function refresgCanvas(){
                
    ctx.clearRect(0,0,canvasWidth,  canvasHeight);
   
   
        snakee.advance();
        if(snakee.checkCollision())
        {
            //Game over
        }
       else
       {
        snakee.draw();
        applee.draw();
        // qui permets d'exucte la fonction refresgCanvas a un delai de 1s
         setTimeout(refresgCanvas,delay);
        
       }
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
                    this.body.pop();
                };
            
                this.setDirection = function(newDirection)
                {
                var allowedDiction;
                switch(this.direction)
                    {
                        case "left":
                            case "right":
                            allowedDiction = ["up", "down"];
                                break;
                            case "down":   
                            case "up":
                        allowedDiction = ["left", "right"] ;
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
                var maxX= widthInBlock-1;
                var maxY=  heightInBlocks-1;
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
                var x = postion[0]*blockSize+radius;
                
                var y = postion[1]*blockSize+radius;
                ctx.arc(x,y, radius,0 , Math.PI*2, true);
                ctx.fill();
                ctx.restore();
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
                                default:
                                return;
                            
                            }
                    snakee.setDirection(newDirection);
                 }

}

