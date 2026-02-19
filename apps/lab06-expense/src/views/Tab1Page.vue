<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="success">
        <ion-title>Expense Tracker</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <div class="ion-padding" style="text-align: center;">
        <h2>รวมรายรับ: {{ totalIncome }} | รวมรายจ่าย: {{ totalExpense }}</h2>
      </div>

      <ion-list>
        <ion-item-sliding v-for="item in expenses" :key="item.id">
          <ion-item>
            <ion-label>
              <h3>{{ item.title }}</h3>
              <p>{{ item.category }}</p>
            </ion-label>
            <ion-note slot="end" :color="item.type === 'income' ? 'success' : 'danger'">
              {{ item.type === 'income' ? '+' : '-' }}{{ item.amount }}
            </ion-note>
          </ion-item>

          <ion-item-options side="end">
            <ion-item-option color="primary" @click="editItem(item)">
              แก้ไข
            </ion-item-option>

            <ion-item-option color="danger" @click="deleteItem(item.id)">
              ลบ
            </ion-item-option>
          </ion-item-options>
        </ion-item-sliding>
      </ion-list>

      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button router-link="/tabs/add">
          <ion-icon :icon="add"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { collection, query, orderBy, onSnapshot, doc, deleteDoc } from 'firebase/firestore'; 
import { db } from '@/firebase';
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, 
  IonList, IonItem, IonLabel, IonNote, IonFab, IonFabButton, IonIcon,
  IonItemSliding, IonItemOptions, IonItemOption // เพิ่มคอมโพเนนต์ที่จำเป็น
} from '@ionic/vue';
import { add } from 'ionicons/icons';

const expenses = ref<any[]>([]);
const router = useRouter();

// ดึงข้อมูลแบบ Realtime
onMounted(() => {
  const q = query(collection(db, "expenses"), orderBy("createdAt", "desc"));
  onSnapshot(q, (snapshot) => {
    expenses.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  });
});

// ฟังก์ชันลบข้อมูล
const deleteItem = async (id: string) => {
  if (confirm("คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้?")) {
    try {
      await deleteDoc(doc(db, "expenses", id)); // ลบข้อมูลใน Firestore ตาม ID
      console.log("Deleted ID:", id);
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  }
};
const editItem = (item: any) => {
  // ตอนนี้ router จะไม่ error แล้วครับ
  router.push({ path: '/tabs/tab2', query: { id: item.id } });
};
// คำนวณยอดรวม
const totalIncome = computed(() => expenses.value.filter(e => e.type === 'income').reduce((s, e) => s + Number(e.amount), 0));
const totalExpense = computed(() => expenses.value.filter(e => e.type === 'expense').reduce((s, e) => s + Number(e.amount), 0));
</script>