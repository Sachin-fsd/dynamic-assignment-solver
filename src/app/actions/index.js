'use server';
import { appendFile } from 'fs/promises';
import path from 'path';

export async function SaveUserData(data) {
    try {
        const filePath = path.join(process.cwd(), 'data.txt'); // Ensure correct path
        await appendFile(filePath, `${data}\n`, 'utf8'); // Use fs.promises
        return true;
    } catch (error) {
        console.error('Error in saving data:', error);
        return false;
    }
}
