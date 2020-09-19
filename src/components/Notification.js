import React from "react";

const Notification = ({message, setMessage, style}) => { 
  //type error, success
  return(
    <div style={{...style}} className={message.type} onClick={()=>setMessage({...message,show:false})}>
      <p>{message.text}</p>
    </div>
  );
};

export default Notification;