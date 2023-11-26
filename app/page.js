"use client"
import { useState } from "react"
// functions
import { stringTo2DArray, stringTo2DArray2 } from "@/utils/funcs";
// compiler steps classes
import LexicalAnalysis from "@/utils/lexicalAnalysis";

export default function Home() {
  const [generateToken, setGenerateToken] = useState(false);
  const [errorMessage, setErrorMessage] = useState([]);

  const [language, setLanguage] = useState("");
  const [tokens, setTokens] = useState([]);
  const [tableId, setTableId] = useState("");
  const [ wordKeys, setWordKeys ] = useState([
    "<conditionIF>", "<conditionElse>", "<loop>",
    "<loopAgain>", "<stopThis>", "<var>", "<func>",
    "<class>","<call>", "<extend>"
  ])

  const generateHandler = () => {
    // set false by default
    setGenerateToken(false);

    // create 2D array for better lexim analysis
    const codes = stringTo2DArray(language);
    // stringTo2DArray2(language)
    
    // translate code to token
    const lexicalAnalysis = new LexicalAnalysis()
    try {
      // translate code to token
      const { errors, tokens } = lexicalAnalysis.analysisLexims(codes)
      setTokens(tokens);
      setErrorMessage(errors);
      // get table of ids
      setTableId(lexicalAnalysis.getIdTable());

      // render tokens
      setGenerateToken(true);
      // set error to zero
    } catch (error) {
      setErrorMessage(error.message);
      setGenerateToken(false);
    }

    
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-24">

      {/* get code  */}
      <div className="w-1/2 h-60 text-black">
        <textarea className="w-full h-full p-4 outline-none rounded-md resize-none duration-700 opacity-80 focus:opacity-100"  value={language} onChange={(e) => setLanguage(e.target.value)} />
      </div>
      {/* render error of code */}
      {
        errorMessage ?
          <div className="w-1/2 py-1 px-2 my-2 rounded-md text-black">
            {
              errorMessage.map(error => <p className="bg-red-500 w-full py-1 px-2 my-2 rounded-md text-black">{error.message}</p>)
            }
            {/* <p>{errorMessage}</p> */}
          </div>
            :
          null
      }

      {/* ask for generate code  */}
      <button className="bg-white text-black w-44 h-10 my-6 rounded-md duration-700 opacity-80 hover:opacity-100" onClick={generateHandler}>generate</button>

      {/* rendering tokens that created */}
      {
        (errorMessage) && (generateToken) ?
          <div className="w-1/2 mt-10">
            {/* table id */}
            <div className="flex items-center justify-center">
              <div className="w-full p-4 border-solid border-2 border-white rounded-md">
                <div className="flex items-center border-solid border-[1px] h-8 border-white">
                  <span className="font-bold w-1/2 pl-20">name</span>
                  <span className="font-bold w-1/2 pl-20">id</span>
                </div>
                {tableId.map(item => 
                  <div className="flex items-center border-solid border-[1px] h-8 border-white">
                    <span className="text-white w-1/2 pl-20">{item.name}</span>
                    <span className="text-white w-1/2 pl-20">{item.id}</span>
                  </div>
                )}
              </div>
            </div>
            {/* tokens */}
            <div className="w-full h-60 text-black bg-white rounded-md mt-6 p-4 overflow-scroll scrollbar scrollbar duration-700 opacity-90 hover:opacity-100">
              {
                tokens.map(line => 
                  // <p className="w-fit whitespace-nowrap">{line}</p>
                  <p className="w-fit whitespace-nowrap">
                    {
                        line.split(" ").map(word => {
                          if(word.split(",")[0] == "<id") {
                            return <span className="text-red-600 text-md">{word}</span>
                          }
                          else if(wordKeys.includes(word)) {
                            return <span className="text-blue-600 text-md">{word}</span>
                          }
                          else if(word.split(",")[0] == "<int" || word.split(",")[0] == "<float" || word.split(",")[0] == "<string") {
                            return <span className="text-yellow-800 text-md">{word}</span>
                          }
                          else if(word == "<error>") {
                            return <span className="text-red-800 font-bold text-md">{word}</span>
                          }
                          return <span className="text-md">{word}</span>
                        })
                    }
                  </p>
                )
              }
            </div>
          </div>
            :
          null
      }

    </main>
  )
}
