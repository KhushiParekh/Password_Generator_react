import { useCallback, useState, useRef, useEffect } from 'react';
import './App.css';

function App() {
  const passref = useRef(null);
  const copyButtonRef = useRef(null);

  const [length, setLength] = useState(8);
  const [numAllowed, setNumAllowed] = useState(false);
  const [charAllowed, setCharAllowed] = useState(false);
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);

  const passwordGenerator = useCallback(() => {
    let pass = "";
    let str = "ABCDEFGHIJKLMOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    if (numAllowed) str += "0123456789";
    if (charAllowed) str += "%$#@!&*{}[]~`+=";

    for (let i = 0; i < length; i++) {
      let chari = Math.floor(Math.random() * str.length);
      pass += str.charAt(chari);
    }
    setPassword(pass);
  }, [length, numAllowed, charAllowed]);

  const copytoClipboard = useCallback(() => {
    passref.current?.select();
    passref.current?.setSelectionRange(0, 99999); // For mobile devices
    document.execCommand("copy"); // Fallback method
    window.navigator.clipboard.writeText(password).then(() => {
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 200);
    });
  }, [password]);

  useEffect(() => {
    passwordGenerator();
  }, [length, numAllowed, charAllowed, passwordGenerator]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowRight') {
        setLength((prevLength) => Math.min(prevLength + 1, 101));
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') {
        setLength((prevLength) => Math.max(prevLength - 1, 8));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (copied) {
      const button = copyButtonRef.current;
      button.classList.add('bounce-down');
      setTimeout(() => {
        button.classList.remove('bounce-down');
      }, 500);
    }
  }, [copied]);

  return (
    <>
      <div className="w-full max-w-xl max-h-full px-4 pb-5 mx-auto text-orange-500 bg-gray-700 rounded-lg shadow-md my-44">
        <h1 className='pt-6 my-5 text-2xl font-semibold text-center text-white'>Password Generator</h1>
        <div className="flex gap-3 overflow-hidden rounded-lg shadow">
          <input type="text" value={password} ref={passref} placeholder='Get Your Password' readOnly className='w-full px-3 py-2 rounded outline-none'/>
          <button ref={copyButtonRef} id="copy-button" onClick={copytoClipboard} className="px-3 py-0 text-white bg-orange-500 rounded-md outline-none shrink-0">Copy</button>
        </div>
        <div className="flex text-lg gap-x-7">
          <div className='flex items-center pt-3 gap-x-1 '>
            <input type="range" value={length} min={8} max={101} onChange={(e) => setLength(parseInt(e.target.value))} className='cursor-pointer' />
            <label>Length ({length})</label>
          </div>
          <div className='flex items-center pt-3 gap-x-1'>
            <input type="checkbox" checked={numAllowed} id='numsinput' onChange={(e) => setNumAllowed((prev) => !prev)} />
            <label htmlFor="numsinput">Numbers</label>
          </div>
          <div className='flex items-center pt-3 gap-x-1'>
            <input type="checkbox" checked={charAllowed} id='charsinput' onChange={(e) => setCharAllowed((prev) => !prev)} />
            <label htmlFor="charsinput">Special Characters</label>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
