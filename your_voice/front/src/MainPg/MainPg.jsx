function MainPg(){

    return(
    <div className="main-box">
     <div className="voice">   
     <h2 className='voiceDsEg'>Disaese in voice</h2>    
       
        
           <p>AI가 목소리를 분석하여  </p>
            <p> 음성질환유무를 진단합니다. </p>
            <a href="#"><button className='voiceDg'>진단받기</button></a>
        </div>


        <div className='covid'>
        <h2 className='voiceDsEg'>COVID19</h2>    
        
        <p>AI가 당신의 기침소리를 분석하여 </p>
        <p>COVID19를 진단합니다 </p>
        <a href="#"><button className='covidDg'>진단받기</button></a>
        </div>
    
    
    </div>
    );
}

export default MainPg