import {useState} from "react";

export default function useVisualMode(initial){
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  const transition = (newMode, replace = false) => {
    if (replace) {
      setMode(newMode)
      //last element of prev history gets replaced with newMode
      setHistory(prev => {
        return [...prev.slice(0, prev.length - 1), newMode];
      })
    } else {
    setMode(newMode)
    setHistory(prev => {
      return [...prev, newMode]
      })
    }
  };

  const back = () => {
    setHistory(prev => {
      const results = [...prev.slice(0, prev.length - 1)];
      setMode(results[(results.length - 1)])
      return results
    })
  };

  return {
    mode, 
    transition, 
    back
    }
}