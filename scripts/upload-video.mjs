import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not defined.');
  console.error('Run with: node --env-file=.env.local scripts/upload-video.mjs <path-to-file>');
  process.exit(1);
}

const filePath = process.argv[2];
if (!filePath) {
  console.error('Usage: node --env-file=.env.local scripts/upload-video.mjs <path-to-file>');
  process.exit(1);
}

const BUCKET = 'reel-videos';
const CONTENT_TYPES = {
  mp4: 'video/mp4',
  mov: 'video/quicktime',
  webm: 'video/webm',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
};

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function upload() {
  const filename = path.basename(filePath);
  const ext = filename.split('.').pop().toLowerCase();
  const buffer = fs.readFileSync(filePath);

  console.log(`Uploading ${filename}...`);
  const { error } = await supabase.storage.from(BUCKET).upload(filename, buffer, {
    contentType: CONTENT_TYPES[ext] || 'application/octet-stream',
    upsert: true,
  });

  if (error) {
    console.error('Upload failed:', error.message);
    process.exit(1);
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(filename);
  console.log(`Done! Public URL:\n${data.publicUrl}`);
}

upload();
