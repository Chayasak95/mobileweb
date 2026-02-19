<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>{{ expenseId ? 'แก้ไขรายการ' : 'เพิ่มรายการใหม่' }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-item>
        <ion-input label="ชื่อรายการ" v-model="title" placeholder="เช่น ค่าอาหาร"></ion-input>
      </ion-item>
      <ion-item>
        <ion-input label="จำนวนเงิน" type="number" v-model="amount"></ion-input>
      </ion-item>
      <ion-item>
        <ion-select label="ประเภท" v-model="type">
          <ion-select-option value="income">รายรับ</ion-select-option>
          <ion-select-option value="expense">รายจ่าย</ion-select-option>
        </ion-select>
      </ion-item>
      <ion-item>
        <ion-input label="หมวดหมู่" v-model="category"></ion-input>
      </ion-item>
      <ion-item>
        <ion-textarea label="หมายเหตุ" v-model="note"></ion-textarea>
      </ion-item>
      
      <ion-button expand="block" class="ion-margin-top" @click="saveExpense">
        {{ expenseId ? 'อัปเดตข้อมูล' : 'บันทึกข้อมูล' }}
      </ion-button>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { db } from "@/firebase";
// 1. นำเข้าคำสั่งสำหรับจัดการข้อมูล และคำสั่งนำทาง (Router) ให้ถูกต้อง
import { collection, addDoc, doc, getDoc, updateDoc } from "firebase/firestore"; 
import { useRouter, useRoute } from "vue-router"; 

// 2. นำเข้าคอมโพเนนต์ของ Ionic
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, 
  IonItem, IonInput, IonSelect, IonSelectOption, 
  IonTextarea, IonButton 
} from '@ionic/vue';

const router = useRouter();
const route = useRoute(); // ตัวนี้ใช้รับค่า id จากหน้า Tab1

const expenseId = ref<string | null>(null);
const title = ref("");
const amount = ref(0);
const type = ref("expense");
const category = ref("");
const note = ref("");

// ตรวจสอบว่าเป็นการแก้ไขข้อมูลหรือไม่เมื่อเปิดหน้าขึ้นมา
onMounted(async () => {
  const id = route.query.id as string;
  if (id) {
    expenseId.value = id;
    const docRef = doc(db, "expenses", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      title.value = data.title;
      amount.value = data.amount;
      type.value = data.type;
      category.value = data.category;
      note.value = data.note;
    }
  }
});

// 4. ฟังก์ชันบันทึกหรืออัปเดต
const saveExpense = async () => {
  try {
    const expenseData = {
      title: title.value,
      amount: Number(amount.value),
      type: type.value,
      category: category.value,
      note: note.value,
      updatedAt: new Date()
    };

    if (expenseId.value) {
      // อัปเดตข้อมูลเดิม
      await updateDoc(doc(db, "expenses", expenseId.value), expenseData);
    } else {
      // เพิ่มข้อมูลใหม่
      await addDoc(collection(db, "expenses"), {
        ...expenseData,
        createdAt: new Date()
      });
    }
    router.push("/tabs/tab1");
  } catch (e) {
    console.error("Error: ", e);
  }
};
</script>