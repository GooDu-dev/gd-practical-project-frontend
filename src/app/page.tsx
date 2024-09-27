import Image from "next/image";
import { MouseEventHandler } from "react";
const bluetooth = require('bluetooth')


export default function Home() {
  
  const clickHandler = () => {
    bluetooth.isOn().then((state: boolean) => {
      console.log(state)
    })
  }

  return (
    <div>
      <button
        onClick={clickHandler}
      >Click me</button>
    </div>
  );
}
