// This file centralizes all Google OAuth logic

import type { BudgetTrackSnapshot } from '../types';

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;
const SCOPES = 'https://www.googleapis.com/auth/drive.appdata';

let accessToken: string | null = null;

export function isConnectedToDrive(): boolean {
   return accessToken !== null;
}

export function connectToDrive(): Promise<string> {
   return new Promise((resolve, reject) => {
      const client = google.accounts.oauth2.initTokenClient({
         client_id: CLIENT_ID,
         scope: SCOPES,
         callback: (response) => {
            if (response.error) {
               reject(new Error(response.error));
               return;
            }
            accessToken = response.access_token;
            resolve(response.access_token);
         },
      });

      client.requestAccessToken();
   });
}

export function disconnectFromDrive(): void {
   if (accessToken) {
      google.accounts.oauth2.revoke(accessToken, () => {});
   }
   accessToken = null;
}

export function getAccessToken(): string | null {
   return accessToken;
}

const BACKUP_FILENAME = 'budgettracker-backup.json';

async function getExistingFileId(): Promise<string | null> {
   const response = await fetch(
      'https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&fields=files(id,name)',
      {
         headers: { Authorization: `Bearer ${accessToken}` },
      },
   );
   const data = await response.json();
   const file = data.files?.find(
      (f: { name: string }) => f.name === BACKUP_FILENAME,
   );
   return file?.id ?? null;
}

export async function saveSnapshotToDrive(
   snapshot: BudgetTrackSnapshot,
): Promise<void> {
   if (!accessToken) throw new Error('Not connected to Google Drive.');

   const fileId = await getExistingFileId();
   const body = JSON.stringify(snapshot);
   const blob = new Blob([body], { type: 'application/json' });

   const metadata = {
      name: BACKUP_FILENAME,
      parents: fileId ? undefined : ['appDataFolder'],
   };

   const form = new FormData();
   form.append(
      'metadata',
      new Blob([JSON.stringify(metadata)], { type: 'application/json' }),
   );
   form.append('file', blob);

   const url = fileId
      ? `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=multipart`
      : 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';

   const method = fileId ? 'PATCH' : 'POST';

   const response = await fetch(url, {
      method,
      headers: { Authorization: `Bearer ${accessToken}` },
      body: form,
   });

   if (!response.ok) throw new Error('Failed to save to Google Drive.');
}

export async function loadSnapshotFromDrive(): Promise<BudgetTrackSnapshot | null> {
   if (!accessToken) throw new Error('Not connected to Google Drive.');

   const fileId = await getExistingFileId();
   if (!fileId) return null;

   const response = await fetch(
      `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
      {
         headers: { Authorization: `Bearer ${accessToken}` },
      },
   );

   if (!response.ok) throw new Error('Failed to load from Google Drive.');

   const json = await response.json();
   return json as BudgetTrackSnapshot;
}
