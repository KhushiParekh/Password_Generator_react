
import { useCallback, useState , useEffect, useRef} from 'react'
import './App.css'

function App() {
  //useRef hook
  const passref= useRef(null);//set default value in() to get the ref we will take that from the input tag
  const copyButtonRef = useRef(null);
  
  const [length, setLength] = useState(8);
  const [numAllowed , setNumAllowed] =useState(false);
  const [charAllowed , setCharAllowed] =useState(false);
  const [password , setPassword] = useState("");
  const [copied, setCopied] = useState(false);

//we need passwordGenerator var but we need to call itfor nums, char, lenght so using callback for that
//useCallback(fn, dependencies (which is given in arr)) == useCallback( ()=> {} , [])
  const passwordGenerator = useCallback(()=> {

    let pass = "";
    //to stet the normal pass from this for a given length
    let str="ABCDEFGHIJKLMOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    if(numAllowed) str+="0123456789";
    if(charAllowed) str+="%$#@!&*{}[]~`+=";

    //now we need to get the str acc to length so..
    for(let i=1; i<=length; i++){
      let chari =Math.floor(Math.random()*str.length +1);
      pass+=str.charAt(chari);

    }
    setPassword(pass);
  }
   ,[length,numAllowed,charAllowed,setPassword])
  
   const copytoClipboard= useCallback(()=>{
     passref.current?.select();
      window.navigator.clipboard.writeText(password)
      // setCopied((prev)=>!prev);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 200);
  
  }, [password]);

  //useEffect
   useEffect(()=> {passwordGenerator()} , [length,numAllowed,charAllowed,passwordGenerator])
   // Handle keydown events to increase or decrease length with arrow keys
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowUp' || e.key == 'ArrowRight') {
        setLength((prevLength) => Math.min(prevLength + 1, 101)); 
        // setCopied((prev)=>!prev);// Max length is 101
      } else if (e.key === 'ArrowDown'|| e.key == 'ArrowLeft') {
        setLength((prevLength) => Math.max(prevLength - 1, 8));
        // setCopied((prev)=>!prev); // Min length is 8
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  
  // useEffect(() => {
  //   if (copied) {
  //     const button = document.getElementById('copy-button');
  //     button.classList.add('bounce-down');
  //     setTimeout(() => {
  //       button.classList.remove('bounce-down');
  //     }, 500);
  //   }
  // }, [copied]);
  useEffect(() => {
    if (copied) {
      copyButtonRef.current.classList.add('bounce-down');
      setTimeout(() => {
        copyButtonRef.current.classList.remove('bounce-down');
      }, 200);
    }
  }, [copied]);
  return (
    <>
      <div className="w-full max-w-xl max-h-full px-4 pb-5 mx-auto text-orange-500 bg-gray-700 rounded-lg shadow-md my-44">
        <h1 className='pt-6 my-5 text-2xl font-semibold text-center text-white'>Password Generator</h1>
        <div className="flex gap-3 overflow-hidden rounded-lg shadow">
          <input type="text" value={password} ref={passref} placeholder='Get Your Password' readOnly className='w-full px-3 py-2 rounded outline-none'/>
          <button ref={copyButtonRef} onClick={copytoClipboard} className="px-3 py-0 text-white bg-orange-500 rounded-md outline-none shrink-0">Copy</button>
        </div>
        <div className="flex text-lg gap-x-7">
          <div className='flex items-center pt-3 gap-x-1 '>
            { <input type="range" value={length} min={8} max={101} onChange={(e)=> {setLength(e.target.value)}} className='cursor-pointer' />/* e.target: Refers to the DOM element that triggered the event (in this case, the input element).*/}
            <label >Length ({length})</label>
          </div>
          <div className='flex items-center pt-3 gap-x-1'>
            <input type="checkbox" Checked={numAllowed} id='numsinput' onChange={(e)=> {setNumAllowed((prev)=>!prev)}} />
            <label htmlFor="numsinput">Numbers</label>
          </div>
          <div className='flex items-center pt-3 gap-x-1'>
            <input type="checkbox" Checked={numAllowed} id='charsinput' onChange={(e)=> {setCharAllowed((prev)=>!prev)}} />
            <label htmlFor="charsinput">Special Charaters</label>
          </div>
        </div>
      </div>
    </>
  )
}

export default App