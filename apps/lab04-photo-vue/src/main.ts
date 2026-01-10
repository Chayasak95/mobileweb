import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { IonicVue } from '@ionic/vue';

// ส่วนที่ต้องเพิ่ม: นำเข้า Custom Elements Loader
import { defineCustomElements } from '@ionic/pwa-elements/loader';

/* ...ข้อมูลสไตล์เดิมของ Ionic... */
import './theme/variables.css';

// ส่วนที่ต้องเพิ่ม: เรียกใช้ฟังก์ชัน loader ก่อน createApp()
defineCustomElements(window);

const app = createApp(App)
  .use(IonicVue)
  .use(router);

router.isReady().then(() => {
  app.mount('#app');
});