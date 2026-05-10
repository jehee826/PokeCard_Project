import React, { useRef, useState, useEffect } from 'react';
import { runOcrInference, initService } from './OcrService';
import styles from './AiCamera.module.css';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';


const AiCamera = () => {
  const navigate = useNavigate();
  const [result, setResult] = useState("");
  const [status, setStatus] = useState("모델 로딩 중...");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [capturedImg, setCapturedImg] = useState<string | null>(null);
  
  // 1. 서버에서 받은 공식 카드 이미지를 저장할 State 추가
  const [officialImg, setOfficialImg] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const TARGET_WIDTH = 400;
  const TARGET_HEIGHT = 558;

  useEffect(() => {
    initService().then(() => {
      setStatus("카메라 준비 완료");
      startCamera();
    });
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { min: 1080, ideal: 2000 },
          height: { min: 1920, ideal: 3600 },
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setStatus("SYSTEM ONLINE");
      }
    } catch (err) {
      console.error(err);
      setStatus("CAMERA ERROR");
    }
  };

  // 2. OCR 스캔과 API 요청을 하나로 묶은 통합 핸들러
  const handleScanProcess = async () => {
    if (!videoRef.current || !canvasRef.current || isAnalyzing) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // 초기화 및 피드백
    video.pause(); 
    setIsAnalyzing(true);
    setResult(""); 
    setOfficialImg(null); // 새로운 스캔 시작 시 기존 이미지 초기화
    setStatus("DATA SCANNING...");

    // 캔버스 이미지 크롭 및 복사 작업
    canvas.width = TARGET_WIDTH;
    canvas.height = TARGET_HEIGHT;

    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;
    const videoAspect = videoWidth / videoHeight;
    const targetAspect = TARGET_WIDTH / TARGET_HEIGHT;

    let sx, sy, sWidth, sHeight;
    if (videoAspect > targetAspect) {
      sHeight = videoHeight;
      sWidth = videoHeight * targetAspect;
      sx = (videoWidth - sWidth) / 2;
      sy = 0;
    } else {
      sWidth = videoWidth;
      sHeight = videoWidth / targetAspect;
      sx = 0;
      sy = (videoHeight - sHeight) / 2;
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(video, sx, sy, sWidth, sHeight, 0, 0, TARGET_WIDTH, TARGET_HEIGHT);

    // 하단 미리보기용 캡처 이미지 저장
    const base64 = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedImg(base64);

    // 카메라 재생 재개
    setTimeout(() => {
      video.play().catch(e => console.error("Video play error:", e));
    }, 800);

    // OCR 분석 및 서버 통신 수행
    try {
      const results = await runOcrInference(canvas);
      
      if (results && results.length > 0) {
        // OCR 결과를 문자열로 추출
        const extractedText = results.map((item: any) => item.text).join(", ");
        setResult(extractedText);
        setStatus("ANALYSIS COMPLETE. FETCHING DATA...");

        // 주의: 여기서 상태값인 'result' 대신, 방금 추출한 'extractedText'를 바로 넘겨야 합니다.
        await fetchCardDataFromServer(extractedText);
        
      } else {
        setStatus("RETRY SCAN");
      }
    } catch (error) {
      console.error(error);
      setStatus("SCAN ERROR");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 3. 서버로 데이터를 보내고 이미지를 받아오는 함수 분리
  const fetchCardDataFromServer = async (ocrResultText: string) => {
    console.log("현재 세션에 토큰이 있는가?:", sessionStorage.getItem('accessToken'));
    alert("현재 전송하려는 토큰: " + (sessionStorage.getItem('accessToken') ? "있음" : "없음(null)"));
    alert(sessionStorage.getItem('accessToken'));
    try {
      const token = sessionStorage.getItem('accessToken');
      console.log("AiCamera - Current Token in sessionStorage:", token);

      const response = await api.post('/api/main/ai', 
        { cardNumber: ocrResultText },
        {
          headers: {
            'Authorization': token ? `Bearer ${token}` : ''
          }
        }
      );
      
      const imageUrl = response.data.officialImageUrl;
      
      
      // 서버에서 받은 이미지 URL을 상태에 저장하여 렌더링 유도
      if (imageUrl) {
        setOfficialImg(imageUrl);
      }
      if (result) {
        setSearchTerm(result);
      }

      setStatus("CARD DATA RETRIEVED");
      alert(response.data.message || "카드 인식 성공 (프론트)");

    } catch (error: any) {
      console.error("서버 통신 오류:", error);
      const errorMsg = error.response?.data?.message || error.response?.data || "API SERVER ERROR";
      setStatus(errorMsg);
    }
    
    
  };
  const handleImgClick = () => {
    // 이동할 경로와 함께 state 전달
    navigate('/BuySellList', { state: { cardNumber: searchTerm } });
  };

  return (
    <div className={styles["pokedex-container"]}>
      <div className={styles["left-panel"]}>
        <div className={styles["status-leds"]}>
          <div className={styles["led"]} style={{backgroundColor: '#ffd93e'}}></div>
          <div className={styles["led"]} style={{backgroundColor: '#3eff3e'}}></div>
        </div>

        <div className={styles.screen}>
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
          <canvas ref={canvasRef} style={{ display: 'none' }} />
          {isAnalyzing && <div className={styles["scan-line"]}></div>}
        </div>

        <div style={{ marginTop: '30px', width: '100%' }}>
            <button 
              onClick={handleScanProcess} // 두 개의 함수를 하나로 통합한 함수 호출
              disabled={isAnalyzing}
              style={{ 
                padding: '15px 0', fontSize: '18px', fontWeight: 'bold', width: '70%',
                backgroundColor: isAnalyzing ? '#888' : '#ffcb05', 
                color: '#222', border: 'none', borderRadius: '10px', cursor: 'pointer'
              }}
            >
              {isAnalyzing ? "SCANNING..." : "START SCAN"}
            </button>
        </div>
      </div>

      <div className={styles["right-section"]}>
        <h1 className={styles["result-title"]}>POKEMON SCANNER</h1>
        <h4 className={styles["sub-title"]}>하단 공식 이미지 터치 시 장터로 이동됩니다.</h4>

        
        <div style={{ background: '#222', borderRadius: '10px', width: '95%', textAlign: 'left', margin: 'auto', padding: '15px' }}>
          <p style={{ color: '#888', fontSize: '12px', margin: 0 }}>SYSTEM STATUS:</p>
          <p style={{ color: '#3eff3e', fontWeight: 'bold', marginBottom: '20px' }}>{status}</p>
          
          <p style={{ color: '#888', fontSize: '12px', margin: 0 }}>OCR ANALYSIS:</p>
          <h2 style={{ fontSize: '18px', color: '#fff', wordBreak: 'break-all' }}>{result || "---"}</h2>
        </div>

        {/* 4. 서버에서 받아온 공식 이미지가 있을 경우 화면에 표시 */}
        {officialImg && (
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <p style={{ fontSize: '12px', color: '#ffcb05', fontWeight: 'bold' }}>POKEDEX OFFICIAL DATA</p>
            <img onClick={handleImgClick} // 이미지 클릭 시 장터 페이지로 이동
              src={officialImg} 
              alt="Official Card" 
              style={{ 
                width: '100%', 
                maxWidth: '250px', 
                borderRadius: '15px', 
                boxShadow: '0px 0px 15px rgba(255, 203, 5, 0.5)',
                marginTop: '10px'
              }} 
            />
          </div>
        )}

        {/* 기존의 스캔한 직후의 카메라 캡처본 (위 공식 이미지가 뜨면 가려지거나 아래로 밀려납니다) */}
        {capturedImg && !officialImg && (
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <p style={{ fontSize: '12px', color: '#888' }}>LAST CAPTURED DATA</p>
            <img src={capturedImg} alt="captured" className="capture-preview" style={{ maxWidth: '150px', borderRadius: '10px' }} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AiCamera;