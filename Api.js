const express = require("express");
const app = express();
const bodyP = require("body-parser");
const compiler = require("compilex");

// Initialize compiler with options
const options = { stats: true };
compiler.init(options);

// Middleware
app.use(bodyP.json());
app.use("/codemirror-5.65.17", express.static("C:/Users/ameys/OneDrive/Desktop/Git/new project/codemirror-5.65.17"));

// Serve the main HTML file
app.get("/", function (req, res) {
    compiler.flush(function () {
        console.log("Previous compilation files deleted");
    });
    res.sendFile("C:/Users/ameys/OneDrive/Desktop/Git/new project/index.html");
});

// Handle code compilation requests
app.post("/compile", function (req, res) {
    const code = req.body.code;
    const input = req.body.input;
    const lang = req.body.lang;

    const startTime = Date.now(); // Start time

    const sendResponse = (data) => {
        const endTime = Date.now(); // End time
        const executionTime = endTime - startTime;
        res.send({
            output: data.output ? data.output : "error",
            executionTime: executionTime + " ms"
        });
    };

    try {
        if (lang === "Cpp") {
            const envData = { OS: "windows", cmd: "g++", options: { timeout: 10000 } };
            if (!input) {
                compiler.compileCPP(envData, code, sendResponse);
            } else {
                compiler.compileCPPWithInput(envData, code, input, sendResponse);
            }
        } else if (lang === "Java") {
            const envData = { OS: "windows" };
            if (!input) {
                compiler.compileJava(envData, code, sendResponse);
            } else {
                compiler.compileJavaWithInput(envData, code, input, sendResponse);
            }
        } else if (lang === "Python") {
            const envData = { OS: "windows" };
            if (!input) {
                compiler.compilePython(envData, code, sendResponse);
            } else {
                compiler.compilePythonWithInput(envData, code, input, sendResponse);
            }
        }
    } catch (e) {
        console.log("Compilation error:", e);
        res.send({ output: "Internal Server Error" });
    }
});

// Start the server
app.listen(8000, () => {
    console.log("Server running on http://localhost:8000");
});
