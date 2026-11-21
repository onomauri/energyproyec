import { google } from 'googleapis';
import path from 'path';
import { encryptId } from './cryptoToken';

const auth = new google.auth.GoogleAuth({
  keyFile: path.join(process.cwd(), 'google-credentials.json'),
  scopes: [Buffer.from('aHR0cHM6Ly93d3cuZ29vZ2xlYXBpcy5jb20vYXV0aC9kcml2ZQ==', 'base64').toString()],
});

export const drive = google.drive({ version: 'v3', auth });

export async function createClientDriveStructure(clientName: string) {
  const rootFolderId = process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID;

  if (!rootFolderId) {
    throw new Error('Falta GOOGLE_DRIVE_ROOT_FOLDER_ID en el archivo .env');
  }

  const clientFolder = await drive.files.create({
    requestBody: {
      name: clientName,
      mimeType: 'application/vnd.google-apps.folder',
      parents: [rootFolderId],
    },
    fields: 'id',
  });

  const clientFolderId = clientFolder.data.id;

  if (!clientFolderId) {
    throw new Error('No se pudo obtener el ID de la carpeta creada en Drive');
  }

  const today = new Date().toISOString().slice(0, 10);
  await drive.files.create({
    requestBody: {
      name: today,
      mimeType: 'application/vnd.google-apps.folder',
      parents: [clientFolderId],
    },
    fields: 'id',
  });

  return clientFolderId;
}

export async function getClientPhotosByDate(clientFolderId: string) {
  const foldersRes = await drive.files.list({
    q: `'${clientFolderId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
    fields: 'files(id, name)',
    orderBy: 'name desc',
  });

  const dateFolders = foldersRes.data.files || [];

  const gallery = await Promise.all(
    dateFolders.map(async (folder) => {
      const photosRes = await drive.files.list({
        q: `'${folder.id}' in parents and mimeType contains 'image/' and trashed = false`,
        fields: 'files(id, name, mimeType)',
        orderBy: 'createdTime desc',
      });

      return {
        folderId: encryptId(folder.id!),
        date: folder.name!,
        photos: (photosRes.data.files || []).map((file) => {
          const token = encryptId(file.id!);
          return {
            id: token,
            name: file.name!,
            url: `/api/drive-image/${token}`,
          };
        }),
      };
    })
  );

  return gallery;
}

export async function deleteDriveFile(fileId: string) {
  const meta = await drive.files.get({
    fileId,
    fields: "parents",
  });

  const parents = meta.data.parents || [];
  if (parents.length > 0) {
    await drive.files.update({
      fileId,
      removeParents: parents.join(","),
    });
  } else {
    await drive.files.delete({ fileId });
  }
}
