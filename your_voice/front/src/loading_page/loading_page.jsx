import './loading_page.css'
import React from 'react'
import { RingLoader } from 'react-spinners';

//npm install react-spinners


function loading_page() {
  return (
    <div className='ringLoader'>
      <RingLoader
        color="#36d7b7"
        cssOverride={{}}
        size={200}
        speedMultiplier={0.8}
      />
      <div className='loaderText'>
        <h1>소리를 분석중입니다</h1>
      </div>
    </div>

  )
}
export default loading_page;