import { db } from '../lib/firebase';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, orderBy, serverTimestamp } from 'firebase/firestore';

const COLLECTION_NAME = 'updates';

export const updatesService = {
    // Get all updates
    async getAllUpdates() {
        try {
            const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate().toISOString() || new Date().toISOString()
            }));
        } catch (error) {
            console.error("Error fetching updates:", error);
            return [];
        }
    },

    // Create a new update
    async createUpdate(data) {
        try {
            const docRef = await addDoc(collection(db, COLLECTION_NAME), {
                ...data,
                createdAt: serverTimestamp()
            });
            return { success: true, id: docRef.id };
        } catch (error) {
            console.error("Error creating update:", error);
            return { success: false, error };
        }
    },

    // Update an existing update
    async updateUpdate(id, data) {
        try {
            const docRef = doc(db, COLLECTION_NAME, id);
            await updateDoc(docRef, {
                ...data,
                updatedAt: serverTimestamp()
            });
            return { success: true };
        } catch (error) {
            console.error("Error updating update:", error);
            return { success: false, error };
        }
    },

    // Delete an update
    async deleteUpdate(id) {
        try {
            await deleteDoc(doc(db, COLLECTION_NAME, id));
            return { success: true };
        } catch (error) {
            console.error("Error deleting update:", error);
            return { success: false, error };
        }
    }
};
