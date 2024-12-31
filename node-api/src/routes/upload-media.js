import nextConnect from 'next-connect';
import multer from 'multer';
import { createConnection } from 'mysql2/promise';
import { v4 as uuidv4 } from 'uuid'; // For generating random keys


const upload = multer({
  storage: multer.diskStorage({
    destination: '../../../public/uploads', // Save files to the public/uploads folder
    filename: (req, file, cb) => {
      const randomKey = uuidv4(); // Generate a random key
      const fileName = `${randomKey}-${file.originalname}`; // Create a unique file name
      cb(null, fileName);
    },
  }),
});

// Create a Next.js API route handler
const handler = nextConnect();

handler.use(upload.array('payloads')) // Use upload.array to handle multiple files
  .post(async (req, res) => {
    const { previews } = req.body; // Get the array of previews from the request body
    const files = req.files; // Get the uploaded files

    // Parse the previews from JSON string
    const previewUrls = Array.isArray(previews) ? previews : JSON.parse(previews);

    if (!previewUrls || previewUrls.length !== files.length) {
      return res.status(400).json({ message: 'Invalid input' });
    }

    try {
      // Create a connection to the MariaDB database
      const connection = await createConnection({
        host: 'localhost',
        user: 'saildb',
        password: process.env?.SAILDB_PASSWORD ?? "",
        database: 'marisail',
      });

      // Prepare the SQL statement
      const sql = 'INSERT INTO media_uploads (url, file_location) VALUES (?, ?)';
      const promises = files.map((file, index) => {
        const fileLocation = `/public/upload/${file.filename}`; // File location
        const url = previewUrls[index]; // Corresponding preview URL
        return connection.execute(sql, [url, fileLocation]);
      });

      // Execute all insert operations
      await Promise.all(promises);

      // Close the database connection
      await connection.end();

      res.status(200).json({ message: 'Files uploaded and data saved successfully' });
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

export default handler;
