const fs = require('fs');
const path = require('path');

class UniqueIntHandler {
    constructor() {
        this.seen = new Array(2047).fill(false); // Tracks integers from -1023 to 1023
    }

    async processFile(inputFilePath, outputFilePath) {
        try {
            // Load data from the input file
            const inputData = await fs.promises.readFile(inputFilePath, 'utf8');
            let uniqueIntegers = [];

            // Process the file line by line
            const lines = inputData.split(/\r?\n/);
            for (let line of lines) {
                line = line.trim(); // Clean unnecessary spaces and newlines from the line

                // Filter out empty lines and invalid integer values
                if (this.isValidInteger(line)) {
                    const num = parseInt(line);

                    // Check if the number is unique
                    if (!this.seen[num + 1023]) {
                        uniqueIntegers.push(num);
                        this.seen[num + 1023] = true; // Mark as seen
                    }
                }
            }

            // Apply bubble sort to the unique integers
            this.bubbleSort(uniqueIntegers);

            // Save sorted integers to the output file
            const outputData = uniqueIntegers.join('\n') + '\n';
            await fs.promises.writeFile(outputFilePath, outputData, 'utf8');

        } catch (err) {
            console.error(`Error processing file ${inputFilePath}:`, err.message);
        }
    }

    isValidInteger(value) {
        return !isNaN(value) && Number.isInteger(parseFloat(value));
    }

    bubbleSort(arr) {
        let n = arr.length;
        for (let i = 0; i < n - 1; i++) {
            for (let j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    // Swap elements to sort them
                    [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                }
            }
        }
    }
}

async function main() {
    const inputDir = path.join(__dirname, '../sample_inputs');
    const outputDir = path.join(__dirname, '../sample_results');

    // Make the output directory if it isn't present
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }

    // Initialize timer to track execution time
    const startTime = Date.now();

    try {
        // Retrieve all file names from the input directory
        const inputFiles = await fs.promises.readdir(inputDir);

        for (const inputFile of inputFiles) {
            const inputFilePath = path.join(inputDir, inputFile);
            const outputFilePath = path.join(outputDir, `${inputFile}_results.txt`);

            // Initialize a UniqueIntHandler and execute file processing
            const uniqueIntHandler = new UniqueIntHandler();
            await uniqueIntHandler.processFile(inputFilePath, outputFilePath);
        }
    } catch (err) {
        console.error('Error reading directory or processing files:', err.message);
    }

    // Record the end time for runtime calculation
    const endTime = Date.now();
    const elapsedTime = endTime - startTime; // Measure processing time in milliseconds
    console.log(`Time taken: ${elapsedTime} ms`);
}

// Execute the main function
main();
