import { apiService } from './api';

export async function addContact({ name, email, message }) {
  try {
    await apiService.submitContactForm({ name, email, message });
    return { success: true };
  } catch (error) {
    throw error;
  }
}
