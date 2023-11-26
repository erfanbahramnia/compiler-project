import autoBind from  "auto-bind"

class LexicalAnalysis {
    #letterWords = [
        "q", "w", "e", "r", "t", "y", "u",
        "i", "o", "p", "a", "s", "d", "f",
        "g", "h", "j", "k", "l", "z", "x",
        "c", "v", "b", "n", "m"
    ];
    #numbers = [
        "0", "1", "2", "3", "4", "5",
        "6", "7", "8", "9"
    ];
    #idTable = [];

    constructor() {
        autoBind(this);
    };

    analysisLexims(words) {
        let lines = [];
        let errors = [];

        for (let i = 0; i < words.length; i++) {
            let line = [];
            for (let j = 0; j < words[i].length; j++) {
                let token = "";

                // ----- check lexim
                // check key lexims
                token = this.operandsLeximAnalysis(words[i][j]);
                if(token) {
                    // success
                    line.push(token);
                    continue;
                };

                token = this.signsLeximAnalysis(words[i][j]);
                if(token) {
                    // success
                    line.push(token);
                    continue;
                };

                token = this.conditionLeximAnalysis(words[i][j]);
                if(token) {
                    // success
                    line.push(token);
                    continue;
                };

                token = this.loopLeximAnalysis(words[i][j]);
                if(token) {
                    // success
                    line.push(token);
                    continue;
                };

                token = this.DeclareKeyWordsAnalysis(words[i][j]);
                if(token) {
                    // success
                    line.push(token);
                    continue;
                };

                token = this.functionCallLeximAnalysis(words[i][j]);
                if(token) {
                    // success
                    line.push(token);
                    continue;
                };

                token = this.inheretanceLeximAnalysis(words[i][j]);
                if(token) {
                    // success
                    line.push(token);
                    continue;
                };
                
                // check function lexim
                token = this.functionLeximAnalysis(words[i][j]);
                if(token) {
                    // success
                    line.push(token);
                    continue;
                };
                // check variable lexim
                token = this.variablLeximAnalysis(words[i][j]);
                if(token) {
                    // success
                    line.push(token);
                    continue;
                };

                if(!isNaN(words[i][j])) {  
                    token = this.numsLeximAnalysis(words[i][j]);
                    if(token) {
                        // success
                        line.push(token);
                        continue;
                    };
                }

                token = this.stringLeximAnalysis(words[i][j]);
                if(token) {
                    // success
                    line.push(token);
                    continue;
                };

                // ----- check token created or not
                if(!token) {
                    const error = {
                        message: `error at line ${i+1} : lexim ${words[i][j]} is not valid!`,
                        line: i,
                        word: words[i][j]
                    };
                    errors.push(error);
                    line.push(`<error>`);
                };
            };
            lines.push(line);
        };
        
        return {
            tokens: this.getTokens(lines),
            errors
        };
    };



    stringLeximAnalysis(word) {
        if((word[0] == '"') && (word[word.length - 1] == '"')) 
            return this.createToken(word, "string");
        
        return "";
    }

    // check integer and float nums
    numsLeximAnalysis(word) {

        word = word.split(".");
        if(word.length <= 2) {
            for (let i = 0; i < word.length; i++) {
                word[i] = parseInt(word[i]);                
            };

            if(word.length == 1) 
                return this.createToken(word[0], "int")
            
            if(word.length == 2)     
                return this.createToken(word.join("."), "float")
        }
        return "";
    }

    // analysis operands
    operandsLeximAnalysis(word) {
        switch(word) {
            case "+>":
                return this.createToken(word, "+>");
            case "->":
                return this.createToken(word, "->");
            case "*>":
                return this.createToken(word, "*>");
            case "/>":
                return this.createToken(word, "/>");
            case ":=":
                return this.createToken(word, ":=");
            case ":==":
                return this.createToken(word, ":==");
            case "<":
                return this.createToken(word, "<");  
            case ">":
                return this.createToken(word, ">");  
        }
        return "";
    };

    signsLeximAnalysis(char) {
        switch(char) {
            case "(":
                return this.createToken(char, "(");
            case ")":
                return this.createToken(char, ")");
            case "{":
                return this.createToken(char, "{");
            case "}":
                return this.createToken(char, "}");
            case ",":
                return this.createToken(char, ",");
        }
    }

    // analysis function lexem
    functionLeximAnalysis(word) {
        let lengthOfWord = word.length;
        
        let state = 1;
        let i = 0
        while(i <= lengthOfWord) {
            switch(state) {
                case 1:
                    // check lex start with $ or not
                    if(word[i] === "$") {
                        state = 2;
                        i++;
                    }
                    else {
                        // if lex not starting with $ guid to trap
                        state = 4;
                        i++;
                    }
                    break;
                case 2:
                    // check second character of lex is english letter or not
                    if (this.#letterWords.includes(word[i].toLowerCase())) {
                        state = 3;
                        i++;
                    }
                    else {
                        // guid to trap
                        state = 4;
                        i++;
                    }
                    break;
                case 3:
                    // this case is final state
                    // check lex is ended or not
                    if (i === lengthOfWord) {
                        return this.createToken(word, "function");
                    }
                    else if (this.#letterWords.includes(word[i].toLowerCase()) || this.#numbers.includes(word[i])) {
                        state = 3;
                        i++;
                    }
                    else {
                        // guid to trap
                        state = 4;
                        i++;
                    }
                    break;
                case 4:
                    // this case is a trap
                    return "";
            }
        }
    };

    // analysis variable lexem
    variablLeximAnalysis(word) {
        let lengthOfWord = word.length;
        
        let state = 1;
        let i = 0
        while(i <= lengthOfWord) {
            switch(state) {
                case 1:
                    // check second character of lex is english letter or not
                    if (this.#letterWords.includes(word[i].toLowerCase())) {
                        state = 2;
                        i++;
                    }
                    else {
                        // guid to trap
                        state = 3;
                        i++;
                    }
                    break;
                case 2:
                    // this case is final state
                    // check lex is ended or not
                    if (i === lengthOfWord) {
                        return this.createToken(word, "variable");
                    }
                    else if (this.#letterWords.includes(word[i].toLowerCase()) || this.#numbers.includes(word[i])) {
                        state = 2;
                        i++;
                    }
                    else {
                        // guid to trap
                        state = 3;
                        i++;
                    }
                    break;
                case 3:
                    // this case is a trap
                    return "";
            }
        }
    };

    // analysis condition lexems (if, else)
    conditionLeximAnalysis(word) {
        let lengthOfWord = word.length;

        // check <if> lexim
        let state = 1;
        let i = 0;
        while( i <= lengthOfWord ) {
            switch(state) {
                case 1:
                    if (word[i] === "i") {
                        state = 2;
                        i++;
                    }
                    else {
                        // guid to trap
                        state = 4;
                    }
                    break;
                case 2:
                    if (word[i] === "f") {
                        state = 3;
                        i++;
                    }
                    else {
                        // guid to trap
                        state = 4;
                    }
                    break;
                case 3:
                    // final state
                    if (i === lengthOfWord) {
                        // success
                        return this.createToken("", "if");
                    }
                    else {
                        // guid to trap
                        state = 4;
                    }
                    break;
                case 4:
                    // trap state
                    i++;
                    break;
            }
        };

        // check <else> lexim
        state = 1;
        i = 0;
        while( i <= lengthOfWord ) {
            switch(state) {
                case 1:
                    if (word[i] === "e") {
                        state = 2;
                        i++;
                    }
                    else {
                        // guid to trap
                        state = 6;
                    }
                    break;
                case 2:
                    if (word[i] === "l") {
                        state = 3;
                        i++;
                    }
                    else {
                        // guid to trap
                        state = 6;
                    }
                    break;
                case 3:
                    if (word[i] === "s") {
                        state = 4;
                        i++;
                    }
                    else {
                        // guid to trap
                        state = 6;
                    }
                    break;
                case 4:
                    if (word[i] === "e") {
                        state = 5;
                        i++;
                    }
                    else {
                        // guid to trap
                        state = 6;
                    }
                    break;
                case 5:
                    // final state
                    if (i === lengthOfWord) {
                        // success
                        return this.createToken("", "else");
                    }
                    else {
                        // guid to trap
                        state = 6;
                    }
                    break;
                case 6:
                    // trap state
                    i++;
                    break;
            }
        }

        return ""
    };
    
    // analysis loop lexems (loop, loopAgain, stopThis)
    loopLeximAnalysis(word) {
        let lengthOfWord = word.length;

        // check loop lexim
        let state = 1;
        let i = 0;
        while(i <= lengthOfWord) {
            switch(state) {
                case 1:
                    if(word[i] === "l") {
                        state = 2;
                        i++;
                    } else {
                        // guid to trap
                        state = 5;
                    }
                    break;
                case 2:
                    if(word[i] === "o") {
                        state = 3;
                        i++;
                    } else {
                        // guid to trap
                        state = 5;
                    }
                    break;
                case 3:
                    if(word[i] === "o") {
                        state = 4;
                        i++;
                    } else {
                        // guid to trap
                        state = 5;
                    }
                    break;
                case 4:
                    if(word[i] === "p" && ((i+1) === lengthOfWord)) {
                        // success
                        return this.createToken(word, "loop")
                    } else {
                        // guid to trap
                        state = 5;
                    }
                    break;
                case 5:
                    // trap state
                    i++;
                    break;
            };
        };

        // check loopAgain lexim
        state = 1;
        i = 0;
        while(i <= lengthOfWord) {
            switch(state) {
                case 1:
                    if(word[i] === "l") {
                        state = 2;
                        i++;
                    } else {
                        // guid to trap
                        state = 10;
                    }
                    break;
                case 2:
                    if(word[i] === "o") {
                        state = 3;
                        i++;
                    } else {
                        // guid to trap
                        state = 10;
                    }
                    break;
                case 3:
                    if(word[i] === "o") {
                        state = 4;
                        i++;
                    } else {
                        // guid to trap
                        state = 10;
                    }
                    break;
                case 4:
                    if(word[i] === "p") {
                        state = 5;
                        i++;
                    } else {
                        // guid to trap
                        state = 10;
                    }
                    break;
                case 5:
                    if(word[i] === "A") {
                        state = 6;
                        i++;
                    } else {
                        // guid to trap
                        state = 10;
                    }
                    break;
                case 6:
                    if(word[i] === "g") {
                        state = 7;
                        i++;
                    } else {
                        // guid to trap
                        state = 10;
                    }
                    break;
                case 7:
                    if(word[i] === "a") {
                        state = 8;
                        i++;
                    } else {
                        // guid to trap
                        state = 10;
                    }
                    break;
                case 8:
                    if(word[i] === "i") {
                        state = 9;
                        i++;
                    } else {
                        // guid to trap
                        state = 10;
                    }
                    break;
                case 9:
                    if(word[i] === "n" && ((i+1) === lengthOfWord)) {
                        // success
                        return this.createToken(word, "loopAgain")
                    } else {
                        // guid to trap
                        state = 10;
                    }
                    break;
                case 10:
                    // trap state
                    i++;
                    break;
            };
        };


        // check stopThis lexim
        state = 1;
        i = 0;
        while(i <= lengthOfWord) {
            switch(state) {
                case 1:
                    if(word[i] === "s") {
                        state = 2;
                        i++;
                    } else {
                        // guid to trap
                        state = 9;
                    }
                    break;
                case 2:
                    if(word[i] === "t") {
                        state = 3;
                        i++;
                    } else {
                        // guid to trap
                        state = 9;
                    }
                    break;
                case 3:
                    if(word[i] === "o") {
                        state = 4;
                        i++;
                    } else {
                        // guid to trap
                        state = 9;;
                    }
                    break;
                case 4:
                    if(word[i] === "p") {
                        state = 5;
                        i++;
                    } else {
                        // guid to trap
                        state = 9;
                    }
                    break;
                case 5:
                    if(word[i] === "T") {
                        state = 6;
                        i++;
                    } else {
                        // guid to trap
                        state = 9;
                    }
                    break;
                case 6:
                    if(word[i] === "h") {
                        state = 7;
                        i++;
                    } else {
                        // guid to trap
                        state = 9;
                    }
                    break;
                case 7:
                    if(word[i] === "i") {
                        state = 8;
                        i++;
                    } else {
                        // guid to trap
                        state = 9;
                    }
                    break;
                case 8:
                    if(word[i] === "s" && ((i+1) === lengthOfWord)) {
                        // success
                        return this.createToken(word, "stopThis")
                    } else {
                        // guid to trap
                        state = 9;
                    }
                    break;
                case 9:
                    // trap state
                    i++;
                    break;
            };
        };

        return "";
    };

    // analysis key word of variable declare (var, func, class)
    DeclareKeyWordsAnalysis(word) {
        // get length of the lexim
        let lengthOfWord = word.length;

        // variable declare lexim(var)
        let state = 1;
        let i = 0;
        while(i < 3) {
            switch(state) {
                case 1:
                    if (word[i] === "v") {
                        state = 2;
                        i++;
                    } else {
                        // guid to trap
                        state = 4;
                    }
                    break;
                case 2:
                    if (word[i] === "a") {
                        state = 3;
                        i++;
                    } else {
                        // guid to trap
                        state = 4;
                    }
                    break;
                case 3:
                    if (word[i] === "r" && ((i+1) === lengthOfWord)) {
                        return this.createToken(word, "var")
                    } else {
                        // guid to trap
                        state = 4;
                    }
                    break;
                case 4:
                    i++;
                    break;
            };
        };

        // function declare lexim(func)
        state = 1;
        i = 0;
        while(i < 4) {
            switch(state) {
                case 1:
                    if (word[i] === "f") {
                        state = 2;
                        i++;
                    } else {
                        // guid to trap
                        state = 5;
                    }
                    break;
                case 2:
                    if (word[i] === "u") {
                        state = 3;
                        i++;
                    } else {
                        // guid to trap
                        state = 5;
                    }
                    break;
                case 3:
                    if (word[i] === "n") {
                        state = 4;
                        i++
                    } else {
                        // guid to trap
                        state = 5;
                    }
                    break;
                case 4:
                    if (word[i] === "c" && ((i+1) === lengthOfWord)) {
                        return this.createToken(word, "func")
                    } else {
                        // guid to trap
                        state = 5;
                    }
                    break;
                case 5:
                    i++;
                    break;
            }
        };

        // class declare lexim(class)
        state = 1;
        i = 0;
        while(i < 5) {
            switch(state) {
                case 1:
                    if (word[i] === "c") {
                        state = 2;
                        i++;
                    } else {
                        // guid to trap
                        state = 6;
                    }
                    break;
                case 2:
                    if (word[i] === "l") {
                        state = 3;
                        i++;
                    } else {
                        // guid to trap
                        state = 6;
                    }
                    break;
                case 3:
                    if (word[i] === "a") {
                        state = 4;
                        i++
                    } else {
                        // guid to trap
                        state = 6;
                    }
                    break;
                case 4:
                    if (word[i] === "s") {
                        state = 5;
                        i++;
                    } else {
                        // guid to trap
                        state = 6;
                    }
                    break;
                case 5:
                    if (word[i] === "s" && ((i+1) === lengthOfWord)) {
                        return this.createToken(word, "class")
                    } else {
                        // guid to trap
                        state = 6;
                    }
                    break;
                case 6:
                    // trap state
                    i++;
                    break;
            }
        };

        return "";
    };

    // analysis of function calling (call)
    functionCallLeximAnalysis(word) {
        // get length of the lexim
        let lengthOfWord = word.length;

        let state = 1;
        let i = 0;
        while(i < 4) {
            switch(state) {
                case 1:
                    if (word[i] === "c") {
                        state = 2;
                        i++
                    } else {
                        // guid to trap
                        state = 5;
                    }
                    break;
                case 2:
                    if (word[i] === "a") {
                        state = 3;
                        i++
                    } else {
                        // guid to trap
                        state = 5;
                    }
                    break;
                case 3:
                    if (word[i] === "l") {
                        state = 4;
                        i++
                    } else {
                        // guid to trap
                        state = 5;
                    }
                    break;
               case 4:
                    if (word[i] === "l" && ((i+1) === lengthOfWord)) {
                        return this.createToken(word, "call");
                    } else {
                        // guid to trap
                        state = 5;
                    }
                    break;
                case 5:
                    // trap state
                    return "";
            };
        };
    };

    // analysis of class inheretance (extend)
    inheretanceLeximAnalysis(word) {
        // get length of the lexim
        let lengthOfWord = word.length;

        let state = 1;
        let i = 0;
        while(i < 6) {
            switch(state) {
                case 1:
                    if (word[i] === "e") {
                        state = 2;
                        i++
                    } else {
                        // guid to trap
                        state = 7;
                    }
                    break;
                case 2:
                    if (word[i] === "x") {
                        state = 3;
                        i++
                    } else {
                        // guid to trap
                        state = 7;
                    }
                    break;
                case 3:
                    if (word[i] === "t") {
                        state = 4;
                        i++
                    } else {
                        // guid to trap
                        state = 7;
                    }
                    break;
               case 4:
                    if (word[i] === "e") {
                        state = 5;
                        i++;
                    } else {
                        // guid to trap
                        state = 7;
                    }
                    break;
                case 5:
                    if (word[i] === "n") {
                        state = 6;
                        i++
                    } else {
                        // guid to trap
                        state = 7;
                    }
                    break;
                case 6:
                    if (word[i] === "d" && ((i+1) === lengthOfWord)) {
                        return this.createToken(word, "extend");
                    } else {
                        // guid to trap
                        state = 7;
                    }
                    break;
                case 7:
                    // trap state
                    return "";
            };
        };
    };

    // create token for any lexim
    createToken(word, type) {
        switch(type) {
            case "if": 
                return "<conditionIF>";
            case "else": 
                return "<conditionElse>";
            case "loop":
                return "<loop>";
            case "loopAgain":
                return "<loopAgain>";
            case "stopThis":
                return "<stopThis>";
            case "var":
                return "<var>";
            case "func":
                return "<func>";
            case "class":
                return "<class>";
            case "call":
                return "<call>";
            case "extend":
                return "<extend>";
            case "+>":
                return "<sum>";
            case "->":
                return "<subtraction>";
            case "*>":
                return "<multiply>";
            case "/>":
                return "<divide>";
            case ":=":
                return "<assignment>";
            case ":==":
                return "<compare>";
            case "<":
                return "<smallThan>";
            case ">":
                return "<biggerThan>";
            case "(":
                return "<openParentheses>";
            case ")":
                return "<closeParentheses>";
            case "{":
                return "<openCurlyBracket>";
            case "}":
                return "<closeCurlyBracket>";
            case ",":
                return "<comma>";
            case "string":
                return `<string,${word.split('"')[1]}>`;
            case "float": 
                return `<float,${word}>`;
            case "int":
                return `<int,${word}>`;
            case "function":
                return this.setInIdTable(word);
            case "variable":
                return this.setInIdTable(word);
        };
    };

    // add functions, variables, classes and ... to id table then return token
    setInIdTable(name) {
        for (let i = 0; i < this.#idTable.length; i++) {
            if(this.#idTable[i]["name"] === name) {
                return `<id,${this.#idTable[i]["id"]}>`;
            }           
        }
        // make new row in id table
        const newId = {
            id: this.#idTable.length + 1,
            name
        };
        // add new row to id table
        this.#idTable.push(newId);
        // return token
        return `<id,${newId.id}>`;
    };

    // write token in txt file
    getTokens(tokens) {
        // save token as strings
        let stringTokens = [];
        for (let i = 0; i < tokens.length; i++) {
            stringTokens[i] = (tokens[i].join(" "));
        };
        
        return stringTokens;
    };

    // get table of ids
    getIdTable() {
        return this.#idTable;
    }
};

export default LexicalAnalysis;