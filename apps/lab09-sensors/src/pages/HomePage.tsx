import './HomePage.css';
import React, { useEffect, useMemo, useState } from "react";
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, 
  IonButton, IonCard, IonCardContent, IonText, IonBadge, IonButtons,
  IonInput, IonGrid, IonRow, IonCol, IonIcon
} from "@ionic/react";
import { 
  flagOutline, checkmarkCircleOutline, warningOutline, 
  starOutline, analyticsOutline, timerOutline 
} from 'ionicons/icons';

import { MotionService } from "../core/MotionService";
import { TtsService } from "../core/TtsService";
import { HapticsService } from "../core/HapticsService";
import { ArmWorkoutEngine } from "../core/ArmWorkoutEngine";
import type { WorkoutState } from "../core/types";

export const HomePage: React.FC = () => {
  // ==========================================
  // ส่วน Logic ทั้งหมดยังคงเดิม ไม่มีการแก้ไขใดๆ
  // ==========================================
  const [state, setState] = useState<WorkoutState | null>(null);
  const [targetReps, setTargetReps] = useState<number>(10);
  const [errorCount, setErrorCount] = useState<number>(0);

  const engine = useMemo(() => new ArmWorkoutEngine(), []);
  const motion = useMemo(() => new MotionService(), []);
  const tts = useMemo(() => new TtsService(), []);
  const haptic = useMemo(() => new HapticsService(), []);

  useEffect(() => {
    const unsubscribe = engine.onChange(setState);
    return () => unsubscribe();
  }, [engine]);

  useEffect(() => {
    if (state?.status === "STOPPED") {
      motion.stop();
    }
  }, [state?.status, motion]);

  useEffect(() => {
    if (state?.status === "RUNNING" && state?.repDisplay && state.repDisplay > 0) {
      tts.speak(state.repDisplay.toString());
      haptic.warning();
    }
  }, [state?.repDisplay, state?.status, tts, haptic]);

  useEffect(() => {
    const msg = state?.stats.lastMessage;
    
    if (state?.status === "RUNNING" && msg && msg !== "OK") {
      setErrorCount(prev => prev + 1);
      
      let textToSpeak = msg;
      const lowerMsg = msg.toLowerCase();
      if (lowerMsg.includes("fast")) textToSpeak = "เร็วเกินไป";
      else if (lowerMsg.includes("slow")) textToSpeak = "ช้าเกินไป";
      else if (lowerMsg.includes("low")) textToSpeak = "ยกแขนต่ำเกินไป";
      else if (lowerMsg.includes("vertical") || lowerMsg.includes("angle")) textToSpeak = "กรุณายกแนวตั้ง";

      tts.speak(textToSpeak);
    }
  }, [state?.stats.lastMessage, state?.status, tts]);

  useEffect(() => {
    const isSuccess = state?.status === "STOPPED" && (state?.repDisplay ?? 0) >= targetReps && targetReps > 0;
    
    if (isSuccess) {
      tts.speak(`เก่งมาก ทำได้ตั้ง ${state?.repDisplay} ครั้งเลย`);
    }
  }, [state?.status, state?.repDisplay, targetReps, tts]);

  const start = async () => {
    setErrorCount(0);
    try {
      await tts.speak(`เริ่มกายบริหารแขน ${targetReps} ครั้ง ยกขึ้นจนสุดแล้วลดลง`);
    } catch (e) {
      console.warn("TTS Error: Language not supported", e);
    }
    
    engine.start(targetReps);
    await motion.start((s) => engine.process(s));
    console.log("Motion started");
  };

  const stop = async () => {
    await motion.stop();
    engine.stop();
  };

  const isRunning = state?.status === "RUNNING";
  const isSuccess = state?.status === "STOPPED" && (state?.repDisplay ?? 0) >= targetReps && targetReps > 0;

  // ==========================================
  // ส่วน UI ด้านล่างถูกปรับเปลี่ยนธีม (สี, พื้นหลัง, เงา)
  // ==========================================
  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar style={{ '--background': '#0f172a', borderBottom: '1px solid #1e293b' }}>
          <IonTitle slot="start" style={{ color: '#00e5ff', fontWeight: 'bold' }}>Lab09 Sensors</IonTitle>
          <IonButtons slot="end">
            <div className="ion-padding-horizontal" style={{ textAlign: 'right' }}>
              <IonText style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                663380009-5<br />
                ชญาศักดิ์ อบเชย
              </IonText>
            </div>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent 
        className="ion-padding ion-text-center"
        style={{ 
          '--background': isSuccess ? '#022c22' : '#0b1120', // ดำสลับเขียวเข้มตอนสำเร็จ
          transition: 'background 0.5s ease-in-out'
        }}
      >
        
        {/* Badge Status */}
        <div style={{ marginTop: '10px' }}>
          <IonBadge 
            style={{ 
              padding: '8px 16px', borderRadius: '20px', fontSize: '0.9rem',
              backgroundColor: isSuccess ? '#059669' : isRunning ? '#0284c7' : '#334155',
              color: '#ffffff'
            }}
          >
            {isSuccess ? "🎉 สำเร็จเป้าหมาย!" : isRunning ? "⚡ กำลังจับการเคลื่อนไหว..." : "รอการเริ่มต้น"}
          </IonBadge>
        </div>

        {/* Rep Counter */}
        <div style={{ margin: '40px 0' }}>
          <IonText>
            <h1 style={{ 
              fontSize: '7rem', 
              margin: '0', 
              fontWeight: '900', 
              color: isSuccess ? '#34d399' : '#ffffff',
              textShadow: isSuccess ? '0 0 20px rgba(52, 211, 153, 0.4)' : 'none',
              transition: 'color 0.3s'
            }}>
              {state?.repDisplay ?? 0}
            </h1>
          </IonText>
          <IonText style={{ color: '#64748b' }}>
            <h2 style={{ fontWeight: 'bold' }}>/ {targetReps} ครั้ง</h2>
          </IonText>
        </div>

        {/* Input Control */}
        {!isRunning && !isSuccess && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
            <IonButton fill="clear" style={{ '--color': '#00e5ff', fontSize: '1.5rem' }} onClick={() => setTargetReps(prev => Math.max(1, prev - 1))}>
              -
            </IonButton>
            <div style={{ 
              borderBottom: '2px solid #00e5ff', 
              width: '80px', 
              backgroundColor: '#1e293b', 
              borderRadius: '8px 8px 0 0' 
            }}>
              <IonInput 
                type="number" 
                value={targetReps}
                className="ion-text-center"
                style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#ffffff', '--padding-bottom': '5px' }}
                onIonInput={(e: any) => {
                  const val = parseInt(e.detail.value, 10);
                  if (!isNaN(val) && val > 0) {
                    setTargetReps(val);
                  }
                }}
              />
            </div>
            <IonButton fill="clear" style={{ '--color': '#00e5ff', fontSize: '1.5rem' }} onClick={() => setTargetReps(prev => prev + 1)}>
              +
            </IonButton>
          </div>
        )}

        {/* Feedback Message */}
        <IonCard style={{ 
          borderRadius: '15px', 
          '--background': state?.stats.lastMessage === "OK" ? '#064e3b' : '#7f1d1d',
          border: `1px solid ${state?.stats.lastMessage === "OK" ? '#059669' : '#ef4444'}`,
          boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
        }}>
          <IonCardContent>
            <div style={{ minHeight: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <IonText style={{ color: '#ffffff' }}>
                <h3 style={{ margin: 0, fontWeight: 'bold' }}>
                  {state?.stats.lastMessage || "กด Start เพื่อเริ่ม"}
                </h3>
              </IonText>
            </div>
          </IonCardContent>
        </IonCard>

        {/* Success Grid Dashboard */}
        {isSuccess && (
          <IonCard style={{ 
            borderRadius: '15px', 
            '--background': '#1e293b', 
            border: '1px solid #10b981',
            boxShadow: '0 0 20px rgba(16, 185, 129, 0.15)'
          }}>
            <IonCardContent>
              <IonText>
                <h2 style={{ fontWeight: 'bold', marginBottom: '20px', textAlign: 'center', color: '#ffffff' }}>
                  📊 สรุปผลการฝึก
                </h2>
              </IonText>
              
              <IonGrid>
                <IonRow className="ion-text-center">
                  <IonCol size="4">
                    <IonIcon icon={flagOutline} style={{ color: '#3b82f6', fontSize: '2rem' }}/>
                    <h3 style={{ margin: '5px 0', fontWeight: 'bold', color: '#ffffff' }}>{targetReps}</h3>
                    <IonText style={{ fontSize: '0.8rem', color: '#94a3b8' }}>เป้าหมาย</IonText>
                  </IonCol>
                  <IonCol size="4">
                    <IonIcon icon={checkmarkCircleOutline} style={{ color: '#22c55e', fontSize: '2rem' }}/>
                    <h3 style={{ margin: '5px 0', fontWeight: 'bold', color: '#ffffff' }}>{state?.repDisplay}</h3>
                    <IonText style={{ fontSize: '0.8rem', color: '#94a3b8' }}>ถูกท่า</IonText>
                  </IonCol>
                  <IonCol size="4">
                    <IonIcon icon={warningOutline} style={{ color: '#ef4444', fontSize: '2rem' }}/>
                    <h3 style={{ margin: '5px 0', fontWeight: 'bold', color: '#ffffff' }}>{errorCount}</h3>
                    <IonText style={{ fontSize: '0.8rem', color: '#94a3b8' }}>ผิดท่า</IonText>
                  </IonCol>
                </IonRow>

                <IonRow className="ion-text-center" style={{ marginTop: '15px' }}>
                  <IonCol size="4">
                    <IonIcon icon={starOutline} style={{ color: '#eab308', fontSize: '2rem' }}/>
                    <h3 style={{ margin: '5px 0', fontWeight: 'bold', color: '#ffffff' }}>{state?.stats.score}</h3>
                    <IonText style={{ fontSize: '0.8rem', color: '#94a3b8' }}>คะแนนสะสม</IonText>
                  </IonCol>
                  <IonCol size="4">
                    <IonIcon icon={analyticsOutline} style={{ color: '#a855f7', fontSize: '2rem' }}/>
                    <h3 style={{ margin: '5px 0', fontWeight: 'bold', color: '#ffffff' }}>
                      {targetReps > 0 ? Math.round(((state?.repDisplay ?? 0) / targetReps) * 100) : 0}%
                    </h3>
                    <IonText style={{ fontSize: '0.8rem', color: '#94a3b8' }}>ความแม่นยำ</IonText>
                  </IonCol>
                  <IonCol size="4">
                    <IonIcon icon={timerOutline} style={{ color: '#06b6d4', fontSize: '2rem' }}/>
                    <h3 style={{ margin: '5px 0', fontWeight: 'bold', color: '#ffffff' }}>
                      {state?.stats.avgSpeed ? state.stats.avgSpeed.toFixed(1) : "0.0"}s
                    </h3>
                    <IonText style={{ fontSize: '0.8rem', color: '#94a3b8' }}>เฉลี่ย/ครั้ง</IonText>
                  </IonCol>
                </IonRow>
              </IonGrid>

            </IonCardContent>
          </IonCard>
        )}

        {/* Action Buttons */}
        <div style={{ marginTop: '30px', paddingBottom: '30px' }}>
          <IonButton 
            expand="block" 
            shape="round" 
            style={{ 
              height: '55px', 
              fontSize: '1.2rem', 
              fontWeight: 'bold',
              '--background': isSuccess ? '#10b981' : '#00e5ff',
              '--color': isSuccess ? '#ffffff' : '#000000',
              '--box-shadow': isSuccess ? '0 4px 15px rgba(16, 185, 129, 0.4)' : '0 4px 15px rgba(0, 229, 255, 0.4)'
            }} 
            onClick={start} 
            disabled={isRunning}
          >
            {isSuccess ? "เริ่มใหม่อีกครั้ง" : "Start"}
          </IonButton>
          
          <IonButton 
            expand="block" 
            fill="clear" 
            shape="round" 
            style={{ 
              marginTop: '15px', 
              fontWeight: 'bold',
              '--color': '#ef4444' 
            }} 
            onClick={stop} 
            disabled={!isRunning}
          >
            Stop / ยุติการทำงาน
          </IonButton>
        </div>

      </IonContent>
    </IonPage>
  );
};

export default HomePage;