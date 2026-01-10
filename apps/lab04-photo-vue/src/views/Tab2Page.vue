<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Photo Gallery</ion-title>
        <div style="padding-left: 20px; font-size: 0.8em; color: gray; padding-bottom: 5px;">
          โดย นาย ชญาศักดิ์ อบเชย รหัส 663380009-5
        </div>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Photo Gallery</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-grid>
        <ion-row>
          <ion-col size="3" v-for="photo in photos" :key="photo.filepath">
            <ion-img :src="photo.webviewPath"></ion-img>
          </ion-col>
        </ion-row>
      </ion-grid>

      <ion-fab vertical="bottom" horizontal="center" slot="fixed">
        <ion-fab-button @click="takePhoto">
          <ion-icon :icon="camera"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { camera } from 'ionicons/icons';
import { 
  IonPage, IonHeader, IonFab, IonFabButton, IonIcon, 
  IonToolbar, IonTitle, IonContent, IonGrid, IonRow, 
  IonCol, IonImg 
} from '@ionic/vue';
import { usePhotoGallery } from '@/composables/usePhotoGallery';

const { photos, takePhoto } = usePhotoGallery();
</script>