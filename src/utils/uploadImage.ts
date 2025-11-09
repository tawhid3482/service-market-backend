// import * as ftp from "basic-ftp";
// import path from "path";
// import { Readable } from "stream";
// import { envVars } from "../config/env";

// // ✅ Multer file type সঠিকভাবে ব্যবহার
// export const uploadToFTP = async (file: Express.Multer.File): Promise<string> => {
//   const client = new ftp.Client();
//   client.ftp.verbose = false;

//   try {
//     await client.access({
//       host: envVars.CPANEL_HOST,
//       user: envVars.CPANEL_USER,
//       password: envVars.CPANEL_PASS,
//       secure: false,
//     });

//     const remoteFileName = `${Date.now()}_${file.originalname}`;
//     const remotePath = path.posix.join(envVars.CPANEL_UPLOAD_PATH, remoteFileName);

//     const stream = Readable.from(file.buffer);
//     await client.uploadFrom(stream, remotePath);

//     return `https://${envVars.CPANEL_DOMAIN}/images/${remoteFileName}`;
//   } catch (err) {
//     console.error("FTP Upload Error:", err);
//     throw new Error("Image upload failed");
//   } finally {
//     client.close();
//   }
// };
