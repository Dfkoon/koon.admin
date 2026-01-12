import { db } from '../lib/firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc, query, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';

const COLLECTION_NAME = 'suggestions';

export const qnaService = {
    // Get all suggestions
    async getAllSuggestions() {
        try {
            const q = query(collection(db, COLLECTION_NAME), orderBy('timestamp', 'desc'));
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().timestamp?.toDate().toISOString() || new Date().toISOString()
            }));
        } catch (error) {
            console.error("Error fetching suggestions:", error);
            return [];
        }
    },

    // Reply to a suggestion
    async replyToSuggestion(id, replyText) {
        try {
            const docRef = doc(db, COLLECTION_NAME, id);
            await updateDoc(docRef, {
                reply: replyText,
                status: 'replied',
                replyDate: serverTimestamp()
            });
            return { success: true };
        } catch (error) {
            console.error("Error replying:", error);
            return { success: false, error };
        }
    },

    // Delete a suggestion
    async deleteSuggestion(id) {
        try {
            await deleteDoc(doc(db, COLLECTION_NAME, id));
            return { success: true };
        } catch (error) {
            console.error("Error deleting:", error);
            return { success: false, error };
        }
    },

    // Update suggestion (e.g. toggle public status)
    async updateSuggestion(id, data) {
        try {
            const docRef = doc(db, COLLECTION_NAME, id);
            await updateDoc(docRef, data);
            return { success: true };
        } catch (error) {
            console.error("Error updating:", error);
            return { success: false, error };
        }
    },

    // Get all reports
    async getAllReports() {
        try {
            const q = query(collection(db, 'question_reports'), orderBy('timestamp', 'desc'));
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().timestamp?.toDate().toISOString() || new Date().toISOString()
            }));
        } catch (error) {
            console.error("Error fetching reports:", error);
            return [];
        }
    },

    // Delete a report
    async deleteReport(id) {
        try {
            await deleteDoc(doc(db, 'question_reports', id));
            return { success: true };
        } catch (error) {
            console.error("Error deleting report:", error);
            return { success: false, error };
        }
    }
};

export default qnaService;
