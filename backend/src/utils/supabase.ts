import { createClient } from '@supabase/supabase-js';
import { config } from '../config';

const supabase = config.SUPABASE_URL && config.SUPABASE_SERVICE_KEY
  ? createClient(config.SUPABASE_URL, config.SUPABASE_SERVICE_KEY)
  : null;

function getClient() {
  if (!supabase) {
    throw new Error('Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_KEY.');
  }
  return supabase;
}

export async function uploadToStorage(
  bucket: string,
  filePath: string,
  buffer: Buffer,
  contentType: string,
): Promise<string> {
  const client = getClient();
  const { error } = await client.storage.from(bucket).upload(filePath, buffer, {
    contentType,
    upsert: true,
  });
  if (error) throw new Error(`Supabase upload failed: ${error.message}`);

  const { data } = client.storage.from(bucket).getPublicUrl(filePath);
  return data.publicUrl;
}

export async function deleteFromStorage(bucket: string, filePath: string): Promise<void> {
  const client = getClient();
  const { error } = await client.storage.from(bucket).remove([filePath]);
  if (error) throw new Error(`Supabase delete failed: ${error.message}`);
}
