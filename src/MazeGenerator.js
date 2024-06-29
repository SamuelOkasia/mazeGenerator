// src/MazeGenerator.js
import React, { useState, useRef} from 'react';
import Maze from './Maze';
import './style.css';

/**
 * MazeGenerator is a React component that generates and displays a maze
 * using the Maze class. It allows the user to specify the number of rows
 * and columns for the maze grid.
 */
function MazeGenerator() {
    const [rowsCols, setRowsCols] = useState(20);
    const canvasRef = useRef(null);

    /**
     * Handles the form submission to generate a new maze.
     * The form submission event.
     */
    const generateMaze = (e) => {
        e.preventDefault();
        if (rowsCols === "") {
            alert("Please enter all fields");
            return;
        }
        if (rowsCols > 50) {
            alert("Maze too large!");
            return;
        }
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const newMaze = new Maze(rowsCols, rowsCols, ctx);
        newMaze.setup();
        newMaze.draw();
    };

    return (
        <div className="maze-generator">
            <h1 className="title">Maze Generator</h1>
            <form id="settings" onSubmit={generateMaze} className='settings'>
                <div className='maze_input'>
                    <div className='maze_input'>
                        <p className='label'>Rows/Columns</p>
                        <input id="number" type="number" value={rowsCols} onChange={(e) => setRowsCols(e.target.value)} />
                    </div>
                </div>
                <input id="submit" type="submit" value="Generate Maze" className='button'/>
            </form>
            <canvas className="maze" ref={canvasRef}></canvas>
        </div>
    );
}

export default MazeGenerator;