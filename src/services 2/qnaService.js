import { db } from '../lib/firebase';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';

const COLLECTION_NAME = 'suggestions';

export const qnaService = {
    // Send a new question / suggestion
    async sendQuestion(text, category = null, senderName = null) {
        try {
            await addDoc(collection(db, COLLECTION_NAME), {
                text,
                category,
                senderName,
                answer: null,
                isPublic: false,
                createdAt: new Date().toISOString()
            });
            return { success: true };
        } catch (error) {
            console.error("Error sending question:", error);
            return { success: false, error };
        }
    },

    // Get all messages (for Admin)
    async getAllMessages() {
        try {
            const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
            const messages = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            return messages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } catch (error) {
            console.error("Error fetching messages:", error);
            return [];
        }
    },

    // Get public answered messages (for Students)
    async getPublicMessages() {
        try {
            const all = await this.getAllMessages();
            return all.filter(m => m.isPublic && m.answer);
        } catch (error) {
            console.error("Error fetching public messages:", error);
            return [];
        }
    },

    // Answer a question (Admin)
    async answerQuestion(id, answer) {
        try {
            const suggestionRef = doc(db, COLLECTION_NAME, id);
            await updateDoc(suggestionRef, {
                answer,
                isPublic: true,
                answeredAt: new Date().toISOString()
            });
            return { success: true };
        } catch (error) {
            console.error("Error answering question:", error);
            return { success: false, error };
        }
    },

    // Delete a question (Admin)
    async deleteQuestion(id) {
        try {
            await deleteDoc(doc(db, COLLECTION_NAME, id));
            return { success: true };
        } catch (error) {
            console.error("Error deleting question:", error);
            return { success: false, error };
        }
    },

    // --- Question Reports ---

    // Submit a new report
    async reportQuestion(reportData) {
        try {
            await addDoc(collection(db, 'reports'), {
                ...reportData,
                status: 'pending',
                createdAt: new Date().toISOString()
            });
            return { success: true };
        } catch (error) {
            console.error("Error reporting question:", error);
            return { success: false, error };
        }
    },

    // Get all reports (Admin)
    async getAllReports() {
        try {
            const querySnapshot = await getDocs(collection(db, 'reports'));
            const reports = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            return reports.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } catch (error) {
            console.error("Error fetching reports:", error);
            return [];
        }
    },

    // Delete a report (Admin)
    async deleteReport(id) {
        try {
            await deleteDoc(doc(db, 'reports', id));
            return { success: true };
        } catch (error) {
            console.error("Error deleting report:", error);
            return { success: false, error };
        }
    },

    // --- Aliases for AdminSuggestions compatibility ---
    async getAllSuggestions() { return this.getAllMessages(); },
    async replyToSuggestion(id, text) { return this.answerQuestion(id, text); },
    async deleteSuggestion(id) { return this.deleteQuestion(id); },
    async updateSuggestion(id, data) {
        try {
            const docRef = doc(db, COLLECTION_NAME, id);
            await updateDoc(docRef, data);
            return { success: true };
        } catch (error) {
            console.error("Error updating suggestion:", error);
            return { success: false, error };
        }
    }
};
