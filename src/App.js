import './App.css';
import {useState,useEffect} from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import io from 'socket.io-client';
const socket = io("http://localhost:5000")
function App() {
  
  const [board, setboard] = useState(["","","","","","","","",""])
  const [turn, setturn] = useState()
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [play, setPlay] = useState(false)
  const [roomname, setRoomname] = useState("")
  const [gameroomname, setgameroomname] = useState("")
  const [resume, setResume] = useState(true)
  const handleClose = () => {
    window.location.reload();
    setOpen(false);
    
  };
  const changeturn =(index)=>{
      setResume(false)
      if( board[index]==""){
        //board[index]="X"
        socket.emit('keydown',index)
        //setboard(board)
        //setturn("O")
      }
      
      /*let wincom=[
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6],
      ]
      for(let i=0;i<wincom.length;i++){
        let com= wincom[i]
        let p1=com[0]
        let p2=com[1]
        let p3=com[2]
        if(board[p1] !="" && board[p2] !="" && board[p3] !="" && board[p1]==board[p2] && board[p3]==board[p2] && board[p1]==board[p3] ){
          console.log("wins")
          setOpen(true)
          setMessage(`player ${turn} Won!`)
          setboard(["","","","","","","","",""])
          return
        }
      }
      if(board[0] !="" && board[1] !="" && board[2] !="" && board[3] !="" && board[4] !="" && board[5] !="" && 
      board[6] !="" && board[7] !="" && board[8] !="" )
        {
          setOpen(true)
          setMessage("draw !")
          setboard(["","","","","","","","",""])
        }*/

  }
   const createroom = (e) =>{
    e.preventDefault()
    setturn(1)
    socket.emit('create-room')
    setPlay(true)
    
  }
  const joinroom=(e)=>{
    e.preventDefault()
    setturn(2)
    socket.emit('join-room',roomname)
    setPlay(true)
    
  }
  const handleGameCode= (gameCode)=> {
    setgameroomname(gameCode)
  }
  const handleGameState= (gameState)=> {
    setboard(JSON.parse(gameState))
  }  
  const handleGameOver=(winner)=>{
    console.log(JSON.parse(winner))
     let playerindex=JSON.parse(winner)
    
    if(playerindex.winner === 1)
      setMessage(`player X Won!`)
    if(playerindex.winner === 2)
      setMessage(`player O Won!`)
    if(playerindex.winner === 0)
      setMessage(`Match Draw`)
    setOpen(true)
    setboard(["","","","","","","","",""])
  }
  const handlePlayer=(player)=>{
    console.log(player+" turn now")
      setResume(true)

  }
  useEffect(() => {
    socket.on('gameCode', handleGameCode);
    socket.on('gameState',handleGameState);
    socket.on('gameOver',handleGameOver);
    socket.on('player',handlePlayer);
  }, [])
  

  return (
    <div className="App">
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Result"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>ok</Button>
        </DialogActions>
        </Dialog>
        
        { 
          play ? ( resume ?(<div><p>{gameroomname}</p><div className="board">
            
          {
            
            board.map((box,index) => {
              return (
                  <div key={index} onClick={()=>changeturn(index)} className="square"  >
                    <div className="symbol" >
                    {box}</div>
                  </div>
              )
            })
          }</div></div>):
          (<div><p>{"wait"}</p><div className="board">
            
          {
            
            board.map((box,index) => {
              return (
                  <div key={index}  className="square"  >
                    <div className="symbol" >
                    {box}</div>
                  </div>
              )
            })
          }</div></div>)):(  <div>
            <form onSubmit={joinroom}>
                <TextField
                  id="outlined-number"
                  label="Enter Room ID"
                  type="number"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={e =>{setRoomname(e.target.value)}}/>
                <Button type="submit" variant="contained">Join Room</Button>
            </form>
            <div>
                <form onSubmit={createroom}>
                <Button type="submit" variant="contained">Create Room</Button>
                </form>
            </div>
            
          </div>) 
        
        }
        
      
    </div>
  );
}

export default App;
