import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not defined.');
  console.error('Run with: node --env-file=.env.local scripts/migrate-videos-to-supabase.mjs');
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const BUCKET = 'reel-videos';

const TARGET_FILES = [
  'src/components/HeroSection.tsx',
  'src/components/FeaturedShowcase.tsx',
  'src/data/reelVideos.ts',
  'src/data/gridVideos.ts',
  'src/data/packagesVideo.ts',
];

// Matches Cloudinary video and image (poster) delivery URLs
const CLOUDINARY_REGEX = /https:\/\/res\.cloudinary\.com\/[a-zA-Z0-9_-]+\/(?:video|image)\/upload\/[a-zA-Z0-9_\/,.-]+\.(mp4|mov|webm|jpg|jpeg|png)/g;

const CONTENT_TYPES = {
  mp4: 'video/mp4',
  mov: 'video/quicktime',
  webm: 'video/webm',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
};

async function migrate() {
  console.log('Starting Cloudinary -> Supabase Storage migration...');

  const urlMap = new Map();
  const filesContent = {};

  for (const relativePath of TARGET_FILES) {
    const filePath = path.resolve(relativePath);
    if (!fs.existsSync(filePath)) {
      console.warn(`Warning: File not found: ${relativePath}`);
      continue;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    filesContent[relativePath] = content;

    const matches = content.match(CLOUDINARY_REGEX);
    if (matches) {
      for (const match of matches) {
        urlMap.set(match.trim(), null);
      }
    }
  }

  const uniqueUrls = Array.from(urlMap.keys());
  console.log(`Found ${uniqueUrls.length} unique Cloudinary URLs.`);

  if (uniqueUrls.length === 0) {
    console.log('No Cloudinary URLs found to migrate.');
    return;
  }

  for (let i = 0; i < uniqueUrls.length; i++) {
    const cloudinaryUrl = uniqueUrls[i];
    const filename = path.basename(new URL(cloudinaryUrl).pathname);
    const ext = filename.split('.').pop().toLowerCase();

    console.log(`\n[${i + 1}/${uniqueUrls.length}] Migrating: ${filename}`);

    try {
      console.log('   Downloading...');
      const response = await fetch(cloudinaryUrl);
      if (!response.ok) {
        throw new Error(`Failed to download: ${response.statusText}`);
      }
      const buffer = Buffer.from(await response.arrayBuffer());

      console.log('   Uploading to Supabase Storage...');
      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(filename, buffer, {
          contentType: CONTENT_TYPES[ext] || 'application/octet-stream',
          upsert: true,
        });

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      const { data: publicUrlData } = supabase.storage.from(BUCKET).getPublicUrl(filename);
      console.log(`   Success! New URL: ${publicUrlData.publicUrl}`);
      urlMap.set(cloudinaryUrl, publicUrlData.publicUrl);
    } catch (err) {
      console.error(`   Failed to migrate ${filename}:`, err.message);
    }
  }

  console.log('\nUpdating files in codebase with Supabase Storage URLs...');
  for (const relativePath of TARGET_FILES) {
    let content = filesContent[relativePath];
    if (!content) continue;

    let updated = false;
    for (const [cloudinaryUrl, newUrl] of urlMap.entries()) {
      if (newUrl && content.includes(cloudinaryUrl)) {
        content = content.split(cloudinaryUrl).join(newUrl);
        updated = true;
      }
    }

    if (updated) {
      const filePath = path.resolve(relativePath);
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`   Updated: ${relativePath}`);
    }
  }

  console.log('\nMigration finished.');
}

migrate().catch(console.error);
