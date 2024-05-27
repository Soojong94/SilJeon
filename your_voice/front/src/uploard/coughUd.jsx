import React, { useState, useRef } from 'react';
import './bothloard.css'

const CoughUd = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const inputBtn = useRef(null);

    const inputbtn = () => {
        inputBtn.current.click();
    };

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleFileUpload = async () => {
        if (!selectedFile) {
            alert('파일을 선택해주세요.');
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await fetch('/upload', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                alert('파일이 성공적으로 업로드되었습니다.');
            } else {
                alert('파일 업로드에 실패했습니다.');
            }
        } catch (error) {
            console.error('파일 업로드 중 오류가 발생했습니다:', error);
            alert('파일 업로드 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className='parent-box'>
            <div className='box'>
                <h2 className='udH2'>기침 소리 업로드</h2>
                <div className="input-container">
                    <button className="inputbtn" onClick={inputbtn}>파일 선택</button>
                    <input type="file" onChange={handleFileChange} ref={inputBtn} className="file-input" />
                    <button className='btnUd' onClick={handleFileUpload}>업로드</button>
                </div>
            </div>
        </div>
    );
};

export default CoughUd;
