import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not defined.');
  console.error('Run with: node --env-file=.env.local scripts/upload-videos-folder.mjs [folder]');
  process.exit(1);
}

const folder = process.argv[2] || 'videos';
const folderPath = path.resolve(folder);
if (!fs.existsSync(folderPath) || !fs.statSync(folderPath).isDirectory()) {
  console.error(`Error: folder not found: ${folderPath}`);
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

async function uploadFolder() {
  const files = fs.readdirSync(folderPath).filter((f) => {
    const ext = f.split('.').pop().toLowerCase();
    return Object.keys(CONTENT_TYPES).includes(ext);
  });

  if (files.length === 0) {
    console.log(`No supported video/image files found in ${folderPath}`);
    return;
  }

  console.log(`Found ${files.length} file(s) in ${folder}/`);
  const results = [];

  for (let i = 0; i < files.length; i++) {
    const filename = files[i];
    const ext = filename.split('.').pop().toLowerCase();
    const buffer = fs.readFileSync(path.join(folderPath, filename));

    console.log(`\n[${i + 1}/${files.length}] Uploading: ${filename}`);
    const { error } = await supabase.storage.from(BUCKET).upload(filename, buffer, {
      contentType: CONTENT_TYPES[ext],
      upsert: true,
    });

    if (error) {
      console.error(`   Failed: ${error.message}`);
      continue;
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(filename);
    console.log(`   Success: ${data.publicUrl}`);
    results.push({ filename, url: data.publicUrl });
  }

  console.log('\nSummary:');
  for (const r of results) {
    console.log(`${r.filename} -> ${r.url}`);
  }
}

uploadFolder();
