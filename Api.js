const express = require("express");
const path = require("path");
const app = express();
const bodyP = require("body-parser");
const compiler = require("compilex");
const options = { stats: true };
compiler.init(options);

app.use(bodyP.json());

// Use relative path for serving static files
app.use("/codemirror-5.65.9", express.static(path.join(__dirname, "codemirror-5.65.9")));

app.get("/", function (req, res) {
    compiler.flush(function () {
        console.log("deleted");
    });
    // Use path.join to correctly resolve the file path
    res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/compile", function (req, res) {
    var code = req.body.code;
    var input = req.body.input;
    var lang = req.body.lang;
    try {
        if (lang == "Cpp") {
            if (!input) {
                var envData = { OS: "windows", cmd: "g++", options: { timeout: 10000 } }; 
                compiler.compileCPP(envData, code, function (data) {
                    res.send(data.output ? data : { output: "error" });
                });
            } else {
                var envData = { OS: "windows", cmd: "g++", options: { timeout: 10000 } }; 
                compiler.compileCPPWithInput(envData, code, input, function (data) {
                    res.send(data.output ? data : { output: "error" });
                });
            }
        } else if (lang == "Java") {
            var envData = { OS: "windows" };
            if (!input) {
                compiler.compileJava(envData, code, function (data) {
                    res.send(data.output ? data : { output: "error" });
                });
            } else {
                compiler.compileJavaWithInput(envData, code, input, function (data) {
                    res.send(data.output ? data : { output: "error" });
                });
            }
        } else if (lang == "Python") {
            var envData = { OS: "windows" };
            if (!input) {
                compiler.compilePython(envData, code, function (data) {
                    res.send(data.output ? data : { output: "error" });
                });
            } else {
                compiler.compilePythonWithInput(envData, code, input, function (data) {
                    res.send(data.output ? data : { output: "error" });
                });
            }
        }
    } catch (e) {
        console.log("error", e);
    }
});

app.listen(8000, () => {
    console.log("Server is running on http://localhost:8000");
});
