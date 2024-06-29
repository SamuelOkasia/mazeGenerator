
/**
 * This code creates a maze using a Depth-First Search (DFS) algorithm with backtracking.
 * It utilizes a stack to manage the cells that need to be visited.
 *
 * The Maze class is responsible for setting up the grid, initializing the cells, and
 * drawing the maze on a canvas. The Cell class represents each cell in the maze and
 * contains methods for checking neighboring cells, drawing walls, and removing walls
 * between adjacent cells.
 */

/**
 * Represents a Maze.
 */
class Maze {

    constructor(rows, columns, ctx) {
        this.size = 500;
        this.columns = columns;
        this.rows = rows;
        this.grid = [];
        this.stack = [];
        this.ctx = ctx;
        this.current = null;
        this.generationComplete = false;
    }

    /**
     * Sets up the grid with Cell objects and initializes the starting cell.
     */
    setup() {
        for (let r = 0; r < this.rows; r++) {
            let row = [];
            for (let c = 0; c < this.columns; c++) {
                let cell = new Cell(r, c, this.grid, this.size);
                row.push(cell);
            }
            this.grid.push(row);
        }
        this.current = this.grid[0][0];
        this.grid[this.rows - 1][this.columns - 1].goal = true;
    }

    /**
     * Draws the maze on the canvas.
     */
    draw() {
        this.ctx.canvas.width = this.size;
        this.ctx.canvas.height = this.size;
        this.ctx.canvas.style.background = "black";
        this.current.visited = true;
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.columns; c++) {
                this.grid[r][c].show(this.size, this.rows, this.columns, this.ctx);
            }
        }
        let next = this.current.checkNeighbours();
        if (next) {
            next.visited = true;
            this.stack.push(this.current);
            this.current.highlight(this.columns, this.ctx);
            this.current.removeWalls(this.current, next);
            this.current = next;
        } else if (this.stack.length > 0) {
            let cell = this.stack.pop();
            this.current = cell;
            this.current.highlight(this.columns, this.ctx);
        } else {
            this.generationComplete = true;
            return;
        }
        window.requestAnimationFrame(() => {
            this.draw();
        });
    }
}

/**
 * Represents a Cell in the maze.
 */
class Cell {
    constructor(rowNum, colNum, parentGrid, parentSize) {
        this.rowNum = rowNum;
        this.colNum = colNum;
        this.visited = false;
        this.walls = { topWall: true, rightWall: true, bottomWall: true, leftWall: true };
        this.goal = false;
        this.parentGrid = parentGrid;
        this.parentSize = parentSize;
    }

    /**
     * Checks the neighbouring cells that have not been visited.
     * Returns neighbouring cell that has not been visited, or undefined if there are none.
     */
    checkNeighbours() {
        let grid = this.parentGrid;
        let row = this.rowNum;
        let col = this.colNum;
        let neighbours = [];
        let top = row !== 0 ? grid[row - 1][col] : undefined;
        let right = col !== grid.length - 1 ? grid[row][col + 1] : undefined;
        let bottom = row !== grid.length - 1 ? grid[row + 1][col] : undefined;
        let left = col !== 0 ? grid[row][col - 1] : undefined;
        if (top && !top.visited) neighbours.push(top);
        if (right && !right.visited) neighbours.push(right);
        if (bottom && !bottom.visited) neighbours.push(bottom);
        if (left && !left.visited) neighbours.push(left);
        if (neighbours.length !== 0) {
            let random = Math.floor(Math.random() * neighbours.length);
            return neighbours[random];
        } else {
            return undefined;
        }
    }

    /**
     * Draws the top wall of the cell.
     */
    drawTopWall(x, y, size, columns, rows, ctx) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + size / columns, y);
        ctx.stroke();
    }

    /**
     * Draws the right wall of the cell.
     */
    drawRightWall(x, y, size, columns, rows, ctx) {
        ctx.beginPath();
        ctx.moveTo(x + size / columns, y);
        ctx.lineTo(x + size / columns, y + size / rows);
        ctx.stroke();
    }

    /**
     * Draws the bottom wall of the cell.
     */
    drawBottomWall(x, y, size, columns, rows, ctx) {
        ctx.beginPath();
        ctx.moveTo(x, y + size / rows);
        ctx.lineTo(x + size / columns, y + size / rows);
        ctx.stroke();
    }

    /**
     * Draws the left wall of the cell.
     */
    drawLeftWall(x, y, size, columns, rows, ctx) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + size / rows);
        ctx.stroke();
    }

    /**
     * Highlights the current cell.
     */
    highlight(columns, ctx) {
        let x = (this.colNum * this.parentSize) / columns + 1;
        let y = (this.rowNum * this.parentSize) / columns + 1;
        ctx.fillStyle = "purple";
        ctx.fillRect(x, y, this.parentSize / columns - 3, this.parentSize / columns - 3);
    }

    /**
     * Removes the walls between two cells.
     */
    removeWalls(cell1, cell2) {
        let x = cell1.colNum - cell2.colNum;
        if (x === 1) {
            cell1.walls.leftWall = false;
            cell2.walls.rightWall = false;
        } else if (x === -1) {
            cell1.walls.rightWall = false;
            cell2.walls.leftWall = false;
        }
        let y = cell1.rowNum - cell2.rowNum;
        if (y === 1) {
            cell1.walls.topWall = false;
            cell2.walls.bottomWall = false;
        } else if (y === -1) {
            cell1.walls.bottomWall = false;
            cell2.walls.topWall = false;
        }
    }

    /**
     * Draws the cell on the canvas.
     */
    show(size, rows, columns, ctx) {
        let x = (this.colNum * size) / columns;
        let y = (this.rowNum * size) / rows;
        ctx.strokeStyle = "#ffffff";
        ctx.fillStyle = "#001F2E";
        ctx.strokeStyle = '#ffffff'
        ctx.lineWidth = 2;

        if (this.walls.topWall) this.drawTopWall(x, y, size, columns, rows, ctx);
        if (this.walls.rightWall) this.drawRightWall(x, y, size, columns, rows, ctx);
        if (this.walls.bottomWall) this.drawBottomWall(x, y, size, columns, rows, ctx);
        if (this.walls.leftWall) this.drawLeftWall(x, y, size, columns, rows, ctx);
        if (this.visited) {
            ctx.fillRect(x + 1, y + 1, size / columns - 2, size / rows - 2);
        }
        if (this.goal) {
            ctx.fillStyle = "rgb(209, 100, 0)";
            ctx.fillRect(x + 1, y + 1, size / columns - 2, size / rows - 2);
        }
    }
}

export default Maze;