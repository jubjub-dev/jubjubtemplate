import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import "@rainbow-me/rainbowkit/styles.css";
import { useEffect, useState } from 'react';
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {genRandomBabyJubValue} from "jubjublib"

import { Button } from 'jubjubui';

function App() {
 const [test, setTest] = useState<bigint>();
  useEffect(()=>{
    setTest(genRandomBabyJubValue())
  },[])
  useEffect(()=>{
    if (test) {
      console.log(`test changed ${test}`);
      console.log(test)
      
    }
    
  },[test])
  
  return (
   
<>
        <div>
          <a href="https://vitejs.dev" target="_blank">
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
        <h1>Vite + React</h1>
        <div className="card1">
          <ConnectButton label='Connect' />
          <Button> from UI lib </Button>
         
        </div>
        <div className="card1">
         
          <p>
            Edit <code>src/App.tsx</code> and save to test HMR
          </p>
        </div>
        <p className="read-the-docs">
          Click on the Vite and React logos to learn more
        </p>
</>
  );
}

export default App;
