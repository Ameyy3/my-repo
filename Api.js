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
    try {
        if (lang === "Cpp") {
            const envData = { OS: "windows", cmd: "g++", options: { timeout: 10000 } };
            if (!input) {
                compiler.compileCPP(envData, code, function (data) {
                    if (data.error) {
                        res.send({ output: data.error });
                    } else {
                        res.send(data);
                    }
                });
            } else {
                compiler.compileCPPWithInput(envData, code, input, function (data) {
                    if (data.error) {
                        res.send({ output: data.error });
                    } else {
                        res.send(data);
                    }
                });
            }
        } else if (lang === "Java") {
            const envData = { OS: "windows" };
            if (!input) {
                compiler.compileJava(envData, code, function (data) {
                    if (data.error) {
                        res.send({ output: data.error });
                    } else {
                        res.send(data);
                    }
                });
            } else {
                compiler.compileJavaWithInput(envData, code, input, function (data) {
                    if (data.error) {
                        res.send({ output: data.error });
                    } else {
                        res.send(data);
                    }
                });
            }
        } else if (lang === "Python") {
            const envData = { OS: "windows" };
            if (!input) {
                compiler.compilePython(envData, code, function (data) {
                    if (data.error) {
                        res.send({ output: data.error });
                    } else {
                        res.send(data);
                    }
                });
            } else {
                compiler.compilePythonWithInput(envData, code, input, function (data) {
                    if (data.error) {
                        res.send({ output: data.error });
                    } else {
                        res.send(data);
                    }
                });
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
