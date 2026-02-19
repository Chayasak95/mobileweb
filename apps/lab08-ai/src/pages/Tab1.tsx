import React, { useRef, useState } from "react";
import {
  IonButton,
  IonContent,
  IonHeader,
  IonImg,
  IonPage,
  IonSpinner,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonChip,
  IonBadge,
  IonText
} from "@ionic/react";
import { cameraOutline, imageOutline, sparklesOutline, warningOutline, scanOutline } from "ionicons/icons";

// Import Services และ Interfaces ที่คุณสร้างไว้
import { PhotoService } from "../core/photo.service";
import { GeminiVisionService } from "../core/gemini.service";
import type { Base64Image, ImageAnalysisResult } from "../core/ai.interface";

const Tab1: React.FC = () => {
  // --- States ---
  const [img, setImg] = useState<Base64Image | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [result, setResult] = useState<ImageAnalysisResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // --- Refs ---
  const fileEl = useRef<HTMLInputElement>(null);

  // --- Handlers ---
  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const b64 = await PhotoService.fromFile(file);
      setImg(b64);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
    } catch (error) {
      console.error("File selection error:", error);
    } finally {
      setLoading(false);
    }
  };

  const onTakePhoto = async () => {
    setLoading(true);
    try {
      const b64 = await PhotoService.fromCamera();
      setImg(b64);
      setPreviewUrl(`data:${b64.mimeType};base64,${b64.base64}`);
      setResult(null);
    } catch (error) {
      console.error("Camera error:", error);
    } finally {
      setLoading(false);
    }
  };

  const onAnalyze = async () => {
    if (!img) return;
    setLoading(true);
    try {
      const analysis = await GeminiVisionService.analyze(img);
      setResult(analysis);
    } catch (error) {
      console.error("Analysis error:", error);
      alert("เกิดข้อผิดพลาดในการวิเคราะห์ภาพ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>
            <IonIcon icon={sparklesOutline} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            Gemini Vision จัดทำโดย ชญาศักดิ์ อบเชญ
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding" color="light">
        <input
          ref={fileEl}
          type="file"
          accept="image/*"
          hidden
          onChange={onFileChange}
        />

        {/* จัดปุ่มอัปโหลดและถ่ายภาพให้อยู่แถวเดียวกันด้วย Grid */}
        <IonGrid className="ion-no-padding">
          <IonRow>
            <IonCol size="6" className="ion-padding-end">
              <IonButton expand="block" fill="outline" onClick={() => fileEl.current?.click()}>
                <IonIcon slot="start" icon={imageOutline} />
                แกลเลอรี
              </IonButton>
            </IonCol>
            <IonCol size="6" className="ion-padding-start">
              <IonButton expand="block" onClick={onTakePhoto}>
                <IonIcon slot="start" icon={cameraOutline} />
                กล้องถ่ายรูป
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>

        {/* แสดงภาพ Preview หรือกล่องว่างเปล่าถ้ายังไม่เลือกภาพ */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          minHeight: previewUrl ? 'auto' : '200px',
          backgroundColor: previewUrl ? 'transparent' : '#e0e0e0',
          borderRadius: '16px',
          marginTop: '20px',
          marginBottom: '20px',
          border: previewUrl ? 'none' : '2px dashed #a0a0a0'
        }}>
          {previewUrl ? (
            <IonImg src={previewUrl}
              style={{
                width: '100%',
                maxWidth: '400px',
                borderRadius: '16px',
                boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
                overflow: 'hidden'
              }} />
          ) : (
            <div className="ion-text-center" style={{ color: '#7a7a7a' }}>
              <IonIcon icon={imageOutline} style={{ fontSize: '48px' }} />
              <p>ยังไม่มีรูปภาพ</p>
            </div>
          )}
        </div>

        {/* ปุ่มวิเคราะห์ภาพ */}
        <IonButton
          expand="block"
          color="tertiary"
          shape="round"
          size="large"
          disabled={!img || loading}
          onClick={onAnalyze}
          style={{ marginBottom: '20px', fontWeight: 'bold' }}
        >
          <IonIcon slot="start" icon={scanOutline} />
          {loading ? "กำลังให้ AI ประมวลผล..." : "วิเคราะห์ภาพ"}
        </IonButton>

        {/* แสดง Spinner ตอนโหลด */}
        {loading && (
          <div className="ion-text-center ion-padding">
            <IonSpinner name="bubbles" color="tertiary" />
            <p><IonText color="medium">โปรดรอสักครู่ Gemini กำลังทำงาน...</IonText></p>
          </div>
        )}

        {/* แสดงผลลัพธ์เป็น Card UI */}
        {result && !loading && (
          <IonCard style={{ margin: '0', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <IonCardHeader style={{ paddingBottom: '0' }}>
              <IonCardTitle color="primary" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                ผลการวิเคราะห์
              </IonCardTitle>
            </IonCardHeader>
            
            <IonCardContent>
              {/* Caption */}
              <div style={{ marginTop: '10px', marginBottom: '15px' }}>
                {/* เปลี่ยน color เป็น var(--ion-text-color) เพื่อให้ปรับตาม Light/Dark mode อัตโนมัติ */}
                <p style={{ fontSize: '1rem', color: 'var(--ion-text-color)', lineHeight: '1.5' }}>
                  " {result.caption} "
                </p>
              </div>

              {/* Tags */}
              <div style={{ marginBottom: '15px' }}>
                {result.tags.map((tag, index) => (
                  <IonChip key={index} color="secondary" outline>
                    <IonLabel>{tag}</IonLabel>
                  </IonChip>
                ))}
              </div>

              {/* Objects List */}
              {result.objects && result.objects.length > 0 && (
                <>
                  <IonText color="medium"><b>วัตถุที่ตรวจพบ:</b></IonText>
                  <IonList lines="full" style={{ background: 'transparent' }}>
                    {result.objects.map((obj, index) => (
                      <IonItem key={index} style={{ '--background': 'transparent' }}>
                        <IonLabel>{obj.name}</IonLabel>
                        {obj.confidence && (
                          <IonBadge slot="end" color="success">
                            {Math.round(obj.confidence * 100)}%
                          </IonBadge>
                        )}
                      </IonItem>
                    ))}
                  </IonList>
                </>
              )}

              {/* Safety Warning */}
              {result.safety?.isSensitive && (
                <IonItem color="warning" lines="none" style={{ borderRadius: '8px', marginTop: '10px' }}>
                  <IonIcon icon={warningOutline} slot="start" />
                  <IonLabel className="ion-text-wrap">
                    <b>ภาพอ่อนไหว:</b> {result.safety.notes || "เนื้อหาอาจไม่เหมาะสม"}
                  </IonLabel>
                </IonItem>
              )}
            </IonCardContent>
          </IonCard>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Tab1;