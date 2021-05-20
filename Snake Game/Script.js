
    const board_border = 'black';
    const board_background = "white";
    const snake_col = 'Green';
    const snake_border = 'darkgreen';
    let snake_speed = 200;
    
    
    // snake components ..
    let snake = [
      {x: 200, y: 200},
      {x: 190, y: 200},
      {x: 180, y: 200},
      /*{x: 170, y: 200},
      {x: 160, y: 200}*/
    ]

    let head = snake[0];
    

    let score = 0;
    // True if changing direction
    let changing_direction = false;
    
    let food_x;
    let food_y;
    // Horizontal velocity
    let dx = 10;
    // Vertical velocity
    let dy = 0;
    
    // Score and results ..
    function score_with_speed()
    {
      
      // changing speed with high score ..
      if(score < 50 && score >= 0) { snake_speed = 200; }
      else if(score >= 50 && score < 100) { 
        snake_speed = 100;
        document.getElementById("high_score").innerHTML = "Keep Going!!";
        
      }
      else if(score >= 100 && score < 200) {
        snake_speed  = 80;
        document.getElementById("high_score").innerHTML = "Awesome!!";
        
      }
      else if(score >= 200 && score < 300) {
        snake_speed = 50;
        document.getElementById("high_score").innerHTML = "Excellent!!";
        
      }
      else { snake_speed = 40;
        document.getElementById("high_score").innerHTML = "Unstoppable!!";
        
      }
        
    }
    
    
    // Get the canvas element
    const snakeboard = document.getElementById("snakeboard");
    // Return a two dimensional drawing context
    const snakeboard_ctx = snakeboard.getContext("2d");
   
    
    
    // ...... ..... <<< ✅ Start game >>> .... .....
    function start_game() 
    {
      document.getElementById("snake_img").hidden = true;
      document.getElementById("start").hidden = true;
      document.getElementById('score_txt').hidden = false;
      main();
      gen_food();
      document.addEventListener("keydown", change_direction);


    }
    

    // main function called repeatedly to keep the game running
    function main() {
      
      if (has_game_ended()) return;
      
      // increase speed with score ..
      score_with_speed();

      changing_direction = false;
      setTimeout(function onTick() 
      {
        clear_board();
        drawFood();
        move_snake();
        drawSnake();
        // Repeat
        main();
      }, snake_speed);
    }

    // draw a border around the canvas
    function clear_board() {
      //  Select the colour to fill the drawing
      snakeboard_ctx.fillStyle = board_background;
      //  Select the colour for the border of the canvas
      snakeboard_ctx.strokestyle = board_border;
      // Draw a "filled" rectangle to cover the entire canvas
      snakeboard_ctx.fillRect(0, 0, snakeboard.width, snakeboard.height);
      // Draw a "border" around the entire canvas
      snakeboard_ctx.strokeRect(0, 0, snakeboard.width, snakeboard.height);
    }
    
    // Draw the snake on the canvas
    function drawSnake() {
      // Draw each part
      snake.forEach(drawSnakePart)
    }

    function drawFood() {
       // image of food ..
      
      snakeboard_ctx.fillStyle = 'red';
      snakeboard_ctx.fillRect(food_x, food_y, 10, 10);
      snakeboard_ctx.strokeRect(food_x, food_y, 10, 10);
    }
    
    // Draw one snake part
    function drawSnakePart(snakePart) {

      // Set the colour of the snake part
      snakeboard_ctx.fillStyle = snake_col;
      // Set the border colour of the snake part
      snakeboard_ctx.strokestyle = snake_border;
      // Draw a "filled" rectangle to represent the snake part at the coordinates
      // the part is located
      snakeboard_ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
      // Draw a border around the snake part
      snakeboard_ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
    }

    // ... when snake hit the wall or itself ..
    function after_hit()
    {
      let msg = 
        confirm("You Scored " + score + " \nDo you want to play again ??");
      if(msg == true)
      {
        location.reload();
      }else{ return true; }

    }


    
    function has_game_ended() 
    {
      for (let i = 4; i < snake.length; i++) 
      {
        // if snake hit itself ..
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) 
        {
          alert("Game Over! 😲\n Snake hit itself");
          
          after_hit();
          
          return true; // to stop the snake ..
        }
      
      }

      // if snake hit walls ..
      const hitLeftWall   = snake[0].x == 0;
      const hitRightWall  = snake[0].x == snakeboard.width - 10;
      const hitToptWall   = snake[0].y == 0;
      const hitBottomWall = snake[0].y == snakeboard.height - 10;
      if(hitBottomWall || hitLeftWall || hitRightWall || hitToptWall)
      {
        alert("Game Over 😲\nSnake hit the wall");
        after_hit();
        return true;
      }
    
      
    }

    function random_food(min, max) {
      return Math.round((Math.random() * (max-min) + min) / 10) * 10;
    }

    function gen_food() 
    {
      // Generate a random number the food x-coordinate
      food_x = random_food(0, snakeboard.width - 10);
      // Generate a random number for the food y-coordinate
      food_y = random_food(0, snakeboard.height - 10);
      // if the new food location is where the snake currently is, 
      // generate a new food location
      snake.forEach(function has_snake_eaten_food(part) {
        const has_eaten = part.x == food_x && part.y == food_y;
        if (has_eaten) gen_food();
      });
    }

    function change_direction(event) {
      const LEFT_KEY  = 37;
      const RIGHT_KEY = 39;
      const UP_KEY    = 38;
      const DOWN_KEY  = 40;
      
    // Prevent the snake from reversing
    
      if (changing_direction) return;
      changing_direction = true;
      const keyPressed = event.keyCode;
      const goingUp     = dy === -10;
      const goingDown   = dy ===  10;
      const goingRight  = dx ===  10;
      const goingLeft   = dx === -10;
      if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -10;
        dy = 0;
      }
      if (keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -10;
      }
      if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = 10;
        dy = 0;
      }
      if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = 10;
      }
    }

    function move_snake() {
      // Create the new Snake's head
      const head = {x: snake[0].x + dx, y: snake[0].y + dy};
      // Add a new head to the beginning of snake body
      snake.unshift(head);
      const has_eaten_food = snake[0].x === food_x && snake[0].y === food_y;
      if (has_eaten_food) {
        // Increase score
        score += 5;
        // Display score on screen
        document.getElementById('score').innerHTML = score;
        // Generate new food location
        gen_food();
      } else {
        // Remove the last part of snake body
        snake.pop();
      }
    }


// .. Night Mode .. Light Mode ..
function night()
{
  document.getElementById("body").style.transition = "all 2s";
  document.getElementById("body").style.backgroundColor = "#000033";
  document.getElementById("Mode").style.color = "gold";
  document.getElementById("score_txt").style.color = "white";
  document.getElementById("score").style.color = "gold";
  board_background.fillStyle = "#ffdb4d";


}

function light()
{
  document.getElementById("body").style.transition = "all 2s";
  document.getElementById("body").style.backgroundColor = "bisque";
  document.getElementById("Mode").style.color = "black";
  document.getElementById("score_txt").style.color = "black";
  document.getElementById("score").style.color = "blue";
}



