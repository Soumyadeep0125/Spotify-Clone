import { createContext, useEffect, useRef, useState } from "react";
import { songsData } from "../assets/assets";

export const PlayerContext = createContext();

const PlayerContextProvider = (props) => {
  const audioRef = useRef(new Audio(songsData[0].audioSrc));
  const seekBg = useRef();
  const seekBar = useRef();

  const [track, setTrack] = useState(songsData[0]);
  const [PlayStatus, setPlayStatus] = useState(false);
  const [time, setTime] = useState({
    currentTime: {
      second: 0,
      minute: 0,
    },
    totalTime: {
      second: 0,
      minute: 0,
    },
  });

  const play = () => {
    audioRef.current.play();
    setPlayStatus(true);
  };
  
  const pause = () => {
    audioRef.current.pause();
    setPlayStatus(false);
  };

  const playWithId = async(id) => {
    await setTrack(songsData[id]);
    await audioRef.current.play();
    setPlayStatus(true);
  }

  const prev = async()=>{
    if(track.id>0){
      await setTrack(songsData[track.id-1]);
      await audioRef.current.play();
      setPlayStatus(true)
    }
  }

  const next = async()=>{
    if(track.id<songsData.length-1){
      await setTrack(songsData[track.id+1]);
      await audioRef.current.play();
      setPlayStatus(true)
    }
  }

  const seekSong = async(e)=>{
    audioRef.current.currentTime =((e.nativeEvent.offsetX / seekBg.current.offsetWidth)*audioRef.current.duration)
  }

  useEffect(() => {
    const audio = audioRef.current;
    const updateSeekBar = () => {
      seekBar.current.style.width = (Math.floor(audio.currentTime / audio.duration * 100)) + "%";
      setTime({
        currentTime: {
          second: Math.floor(audio.currentTime % 60),
          minute: Math.floor(audio.currentTime / 60),
        },
        totalTime: {
          second: Math.floor(audio.duration % 60),
          minute: Math.floor(audio.duration / 60),
        },
      });
    };

    audio.ontimeupdate = updateSeekBar;

    return () => {
      audio.ontimeupdate = null;
    };
  }, []);

  const contextValue = {
    audioRef,
    seekBar,
    seekBg,
    track,
    setTrack,
    time,
    setTime,
    PlayStatus,
    setPlayStatus,
    play,
    pause,
    playWithId,
    prev,next,
    seekSong
  };

  return (
    <PlayerContext.Provider value={contextValue}>
      {props.children}
    </PlayerContext.Provider>
  );
};

export default PlayerContextProvider;
