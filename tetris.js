class TetrisGame {
  constructor(container) {
    this.container = container;
    this.board = [];
    this.piece = null;
    this.score = 0;
    this.lines = 0;
    this.level = 1;
    this.speed = 1000;
    this.gameOver = false;

    for (let i = 0; i < 20; i++) {
      this.board[i] = [];
      for (let j = 0; j < 10; j++) {
        this.board[i][j] = 0;
      }
    }

    this.piece = this.createPiece();
    this.render();
    this.update();

    document.addEventListener('keydown', (event) => {
      switch (event.key) {
        case 'ArrowLeft':
          this.movePiece(-1, 0);
          break;
        case 'ArrowRight':
          this.movePiece(1, 0);
          break;
        case 'ArrowDown':
          this.movePiece(0, 1);
          break;
        case 'ArrowUp':
          this.rotatePiece();
          break;
      }
    });
  }

  createPiece() {
    const shapes = [
      [[1, 1], [1, 1]],
      [[1, 1, 1, 1]],
      [[1, 1, 0], [0, 1, 1]],
      [[0, 1, 1], [1, 1, 0]],
      [[1, 0, 0], [1, 1, 1]],
      [[0, 0, 1], [1, 1, 1]],
      [[1, 1, 1], [0, 1, 0]]
    ];
  
    const colors = ['yellow', 'pink', 'lightgreen', 'darkgreen', 'purple', 'red', 'orange'];
  
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    const color = colors[Math.floor(Math.random() * colors.length)];
  
    return { x: 5, y: 0, shape, color };
  }

  render() { 
    const container = this.container; 
    container.innerHTML = ''; 
  
    if (this.gameOver) { 
      const gameOverText = document.createElement('div'); 
      gameOverText.textContent = 'Game Over!'; 
      gameOverText.style.fontSize = '36px'; 
      gameOverText.style.textAlign = 'center'; 
      gameOverText.style.color = 'white'; 
      gameOverText.style.position = 'absolute'; 
      gameOverText.style.top = '40%'; 
      gameOverText.style.left = '50%'; 
      gameOverText.style.transform = 'translate(-50%, -50%)'; 
      container.appendChild(gameOverText); 
    
      const scoreText = document.createElement('div'); 
      scoreText.textContent = `Final Score: ${this.score}`; 
      scoreText.style.fontSize = '24px'; 
      scoreText.style.textAlign = 'center'; 
      scoreText.style.color = 'white'; 
      scoreText.style.position = 'absolute'; 
      scoreText.style.top = '50%'; 
      scoreText.style.left = '50%'; 
      scoreText.style.transform = 'translate(-50%, -50%)'; 
      container.appendChild(scoreText); 
    }
     else { 
      for (let i = 0; i < 20; i++) { 
        const row = document.createElement('div'); 
        row.style.display = 'flex'; 
        row.style.justifyContent = 'center'; 
  
        for (let j = 0; j < 10; j++) { 
          const cell = document.createElement('div'); 
          cell.style.width = '20px'; 
          cell.style.height = '20px'; 
          cell.style.border = '1px solid #322'; 
          cell.style.background = 'black'; 
  
          if (this.board[i][j] === 1) { 
            cell.style.background = 'blue'; 
          } 
  
          row.appendChild(cell); 
        } 
  
        container.appendChild(row); 
      } 
  
      const piece = this.piece; 
      for (let i = 0; i < piece.shape.length; i++) { 
        for (let j = 0; j < piece.shape[i].length; j++) { 
          if (piece.shape[i][j] === 1) { 
            const cell = container.children[piece.y + i].children[piece.x + j]; 
            cell.style.background = piece.color; 
          } 
        } 
      } 
  
      const scoreText = document.createElement('div'); 
      scoreText.textContent = `Score: ${this.score}`; 
      scoreText.style.fontSize = '24px'; 
      scoreText.style.textAlign = 'center'; 
      scoreText.style.color = 'white'; 
      container.appendChild(scoreText); 
    } 
  }

  update() {
    if (this.gameOver) {
      return;
    }

    const piece = this.piece;
    piece.y += 1;

    if (this.checkCollision(piece)) {
      piece.y -= 1;
      this.freezePiece(piece);
      this.checkForCompletedLines();
      this.piece = this.createPiece();
      if (this.checkGameOver()) {
        this.gameOver = true;
      }
    }

    this.render();

    setTimeout(() => {
      this.update();
    }, this.speed);
  }

  checkCollision(piece) {
    for (let i = 0; i < piece.shape.length; i++) {
      for (let j = 0; j < piece.shape[i].length; j++) {
        if (piece.shape[i][j] === 1) {
          if (piece.y + i >= 20 || piece.x + j < 0 || piece.x + j >= 10) {
            return true;
          }
          if (this.board[piece.y + i][piece.x + j] === 1) {
            return true;
          }
        }
      }
    }
    return false;
  }
  freezePiece(piece) {
    for (let i = 0; i < piece.shape.length; i++) {
    for (let j = 0; j < piece.shape[i].length; j++) {
    if (piece.shape[i][j] === 1) {
    this.board[piece.y + i][piece.x + j] = 1;
    }
    }
    }
    }
    
    checkForCompletedLines() {
    let completedLines = 0;
    for (let i = 0; i < 20; i++) {
    let completed = true;
    for (let j = 0; j < 10; j++) {
    if (this.board[i][j] === 0) {
    completed = false;
    break;
    }
    }
    if (completed) {
    this.removeLine(i);
    completedLines++;
    }
    }
    this.score += completedLines * completedLines * 10;
    this.lines += completedLines;
    this.speed = Math.max(100, this.speed - (completedLines * 50));
    }
    
    removeLine(lineIndex) {
    for (let i = lineIndex; i > 0; i--) {
    for (let j = 0; j < 10; j++) {
    this.board[i][j] = this.board[i - 1][j];
    }
    }
    for (let j = 0; j < 10; j++) {
    this.board[0][j] = 0;
    }
    }
    
    checkGameOver() {
    for (let i = 0; i < 10; i++) {
    if (this.board[0][i] === 1) {
    return true;
    }
    }
    return false;
    }
    
    movePiece(dx, dy) {
    const piece = this.piece;
    piece.x += dx;
    piece.y += dy;
    
    if (this.checkCollision(piece)) {
      piece.x -= dx;
      piece.y -= dy;
    }
    
    this.render();
    
    }
    
    rotatePiece() {
    const piece = this.piece;
    const newShape = [];
    
    for (let i = 0; i < piece.shape[0].length; i++) {
      newShape[i] = [];
      for (let j = 0; j < piece.shape.length; j++) {
        newShape[i][j] = piece.shape[piece.shape.length - 1 - j][i];
      }
    }
    
    piece.shape = newShape;
    
    if (this.checkCollision(piece)) {
      piece.shape = newShape.reverse();
    }
    
    this.render();
    
    }
    }
    
    const container = document.getElementById('game-container');
    new TetrisGame(container);
    