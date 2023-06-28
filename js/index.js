// https://en.wikipedia.org/wiki/Sieve_of_Eratosthenes

const waitTime = 10;

/**
 * class to render the grid and find the prime numbers
 * @class SieveOfEratosthenes
 */
class SieveOfEratosthenes {
    static isRunning = false;
    /**
     * @constructor
     * @param {Array} matrix - 2D array of numbers
     * @param {Number} max - max number
     */
    constructor(matrix, max) {
        this.matrix = matrix;
        this.max = max;

        // set the outline context
        this.outlineContext = this.#getContext("#444", true);
        
        // maximum cell size
        var maxCellSize = 50;
        
        // set the cell size
        this.cellSize = Math.floor(window.innerWidth / (matrix.length + 1));
        this.cellSize = Math.min(this.cellSize, maxCellSize);

        //this.padding = size / 10;
        this.padding = Math.floor(this.cellSize / 10);

        // adjust the canvas size to fit the grid
        this.outlineContext.canvas.width = (this.cellSize + this.padding) * matrix[0].length + this.padding;
        this.outlineContext.canvas.height = (this.cellSize + this.padding) * matrix.length + this.padding;

        this.primes = matrix.map(row => row.slice());
    }



    /**
     * a function to get the center of the canvas
     * @public @method getCenter
     * @param {*} w - width
     * @param {*} h - height
     * @return {Object} - x and y
     */
    #getCenter(w, h) {
        return {
            x: window.innerWidth / 2 - w / 2 + "px",
            y: window.innerHeight / 2 - h / 2 + "px"
        };
    }

    /**
     * a function to draw the grid
     * @private @method getContext
     * @param {*} color - background color
     * @param {*} isTransparent - if true, background color is transparent
     * @return {CanvasRenderingContext2D}
     */
    #getContext(color = "#111", isTransparent = false) {
        this.canvas = document.createElement("canvas");
        this.context = this.canvas.getContext("2d");
        this.canvas.style.position = "absolute";
        this.canvas.style.background = color;
        if (isTransparent) {
            this.canvas.style.backgroundColor = "transparent";
        }
        this.canvas.style.overflowY = "auto";
        document.body.appendChild(this.canvas);

        return this.context;
    }

    /**
     * An async function to wait for a given time
     * @param {*} ms 
     * @returns Promise
     */
    #wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Create a function to check if the number is prime
     * The function should return a color
     * Blue if the number is prime
     * Red if the number is a multiple of a prime number
     * @public @method setTileColor
     * @param {*} n - number
     * @returns {String} - color
     */
    #setTileColor(n) {
        // Check if n is less than 2 (not prime)
        if (n < 2) {
            return '#ff0000';
        }
        
        // Check if n is divisible by any number from 2 to the square root of n
        for (let i = 2, sqrt = Math.sqrt(n); i <= sqrt; i++) {
            if (n % i === 0) {
                return '#ff0000';
            }
        }

        // n is not divisible by any number, so it is prime
        return '#0000ff';
    }

    /**
     * Find the index of the element in the 2D array
     * @param {*} arr 
     * @param {*} element 
     * @returns 
     */
    #findElementIn2DArray(arr, element) {
        for (let i = 0; i < arr.length; i++) {
          const rowIndex = i;
          const colIndex = arr[i].indexOf(element);
          
          if (colIndex !== -1) {
            return { row: rowIndex, col: colIndex };
          }
        }
        
        return { row: -1, col: -1 }; // Element not found
      }
      

    /**
     * A function to render the grid
     * @public @method render
     */
    async render() {
        // set the running flag to true
        SieveOfEratosthenes.isRunning = true;
        
        // set the font size and padding
        let fontSize = Math.ceil(this.cellSize / 2);
        this.outlineContext.font = fontSize + "px Courier";
        let fontPadding = Math.ceil(fontSize / 2);

        // draw the grid
        try {
            for (let row = 0; row < this.matrix.length; row++) {
                for (let col = 0; col < this.matrix[row].length; col++) {

                    // fill the cell with the color
                    this.outlineContext.fillStyle = this.#setTileColor(this.matrix[row][col]);

                    // fill the multiples of the prime number with red
                    if(this.outlineContext.fillStyle == '#0000ff') {
                        await this.#wait (waitTime);

                        // draw the cell
                        this.outlineContext.fillRect(col * (this.cellSize + this.padding),
                        row * (this.cellSize + this.padding),
                        this.cellSize, this.cellSize);

                        // draw the number
                        var width = this.outlineContext.measureText(this.matrix[row][col]).width;
                        this.outlineContext.fillStyle = "white";
                        this.outlineContext.fillText(this.matrix[row][col], col * (this.cellSize + this.padding) + this.cellSize / 2 - width / 2, row * (this.cellSize + this.padding) + this.cellSize / 2 + fontPadding);
                        for (let i = this.matrix[row][col] + this.matrix[row][col]; i <= this.max; i += this.matrix[row][col]) {
                            const findElement = this.#findElementIn2DArray(this.matrix, i);
                            if((findElement.row != -1 && findElement.col != -1) && this.primes[findElement.row][findElement.col] != 'found') {

                                await this.#wait (waitTime);

                                // fill the cell with the color
                                this.outlineContext.fillStyle = '#ff0000';
                                
                                // draw the cell
                                this.outlineContext.fillRect(findElement.col * (this.cellSize + this.padding),
                                findElement.row * (this.cellSize + this.padding),
                                this.cellSize, this.cellSize);

                                // draw the number
                                var width = this.outlineContext.measureText(i).width;
                                this.outlineContext.fillStyle = "white";
                                this.outlineContext.fillText(i, findElement.col * (this.cellSize + this.padding) + this.cellSize / 2 - width / 2, findElement.row * (this.cellSize + this.padding) + this.cellSize / 2 + fontPadding);
                                //this.outlineContext.fillText(i, findElement.col * (this.cellSize + this.padding) + this.cellSize / 2 - width / 2, findElement.row * (this.cellSize + this.padding) + this.cellSize / 2 + 10);
                                this.primes[findElement.row][findElement.col] = 'found';
                            }
                        }
                    }
                }     
            }
        } catch (error) {
            console.log(error);
        } finally {
            SieveOfEratosthenes.isRunning = false;
        }
    }

    /**
     * A function to clear the canvas
     * @public @method clean
     */
    clean() {
        this.outlineContext.clearRect(0, 0, this.outlineContext.canvas.width, this.outlineContext.canvas.height);
        this.outlineContext.canvas.width = 0;
    }

    /**
     * 
     * @returns boolean - true if the algorithm is running, false otherwise
     */
    checkIfRunning() {
        return SieveOfEratosthenes.isRunning;
    }
}

/**
 * A function to create a matrix of numbers set up in a grid
 * @param {*} number 
 * @returns matrix - 2D ar ray of numbers set up in a grid
 */
function createMatrix(number) {
    // Calculate the square root of the number
    const squareRoot = Math.sqrt(number);
  
    // Round up to the nearest integer to determine the matrix dimensions
    const rows = Math.ceil(squareRoot);
    const columns = Math.ceil(number / rows);
  
    // Create the matrix array
    const matrix = [];
  
    // Populate the matrix with values
    // Start with 2 as 1 is not a prime number
    let count = 2;
    for (let i = 0; i < rows; i++) {
      const row = [];
      for (let j = 0; j < columns; j++) {
        // Only insert values if there are remaining numbers
        if (count <= number) {
          row.push(count);
          count++;
        }
      }
      if (row.length > 0)
        matrix.push(row);
    }
    return matrix;
}

// input element
const inputElement = document.getElementById('myInput');

const inputButton = document.getElementById('myButton');

// initialize the grid system
let gridSystem = new SieveOfEratosthenes(createMatrix(100), 100);

function checkInput(userInput) {
    // Cancel the default action, if needed
    if(gridSystem.checkIfRunning()) {
        alert('Already running, please wait!');
        return;
    } else {
        // grab the input value
        const inputValue = inputElement.value;
        // check if the input value is valid
        if (inputValue == '') {
            alert('Please enter a number!');
            return;
        }
        else if (inputValue < 2) {
            alert('Please enter a number greater than 1!');
            return;
        }
        else if (inputValue > 5000) {
            alert('Please enter a number less than 5000!');
            return;
        }
        else if (inputValue % 1 != 0) {
            alert('Please enter a whole number!');
            return;
        }
        
        let CAP = inputValue;

        // Create a matrix of numbers
        let matrix = createMatrix(CAP);

        // Calculate the size of the cell

        // clean the canvas
        gridSystem.clean();

        // create a new grid system
        gridSystem = new SieveOfEratosthenes(matrix, CAP);

        // render the grid system
        gridSystem.render();
    }
}

// Add an event listener to the input element
inputElement.addEventListener('keydown', function(event) {
    // Press the enter key
    if (event.key === 'Enter') {
        checkInput(inputElement);
    }
});

// Add an event listener to the button
inputButton.addEventListener('click', function(event) {
    if (event.type === 'click') {
        checkInput(inputButton);
    }
});