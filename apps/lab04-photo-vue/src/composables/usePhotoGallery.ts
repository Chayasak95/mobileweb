import { ref, onMounted, watch } from 'vue';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';

export interface UserPhoto {
  filepath: string;
  webviewPath?: string;
}

export const usePhotoGallery = () => {
  const photos = ref<UserPhoto[]>([]);
  const PHOTO_STORAGE = 'photos';

  // --- Step 5: โหลดรูปที่เคยบันทึกไว้ขึ้นมาแสดง ---
  const loadSaved = async () => {
    const photoList = await Preferences.get({ key: PHOTO_STORAGE });
    const photosInPreferences = photoList.value ? JSON.parse(photoList.value) : [];

    // สำหรับการรันบน Web ต้องอ่านไฟล์จาก Filesystem มาเป็น Base64 เพื่อแสดงผล
    for (const photo of photosInPreferences) {
      const readFile = await Filesystem.readFile({
        path: photo.filepath,
        directory: Directory.Data,
      });
      photo.webviewPath = `data:image/jpeg;base64,${readFile.data}`;
    }
    photos.value = photosInPreferences;
  };

  onMounted(loadSaved);

  // --- Step 4: ฟังก์ชันแปลงและบันทึกไฟล์ภาพลงเครื่อง ---
  const convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });

  const savePicture = async (photo: Photo, fileName: string): Promise<UserPhoto> => {
    const response = await fetch(photo.webPath!);
    const blob = await response.blob();
    const base64Data = await convertBlobToBase64(blob) as string;

    await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data
    });

    return {
      filepath: fileName,
      webviewPath: photo.webPath
    };
  };

  // --- Step 3: ฟังก์ชันถ่ายรูป ---
  const takePhoto = async () => {
    const photo = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100,
    });

    const fileName = Date.now() + '.jpeg';
    const savedFileImage = await savePicture(photo, fileName);
    photos.value = [savedFileImage, ...photos.value];
  };

  // บันทึกรายการชื่อไฟล์ลง Preferences ทุกครั้งที่มีรูปใหม่
  watch(photos, () => {
    Preferences.set({
      key: PHOTO_STORAGE,
      value: JSON.stringify(photos.value),
    });
  });

  return { photos, takePhoto };
};