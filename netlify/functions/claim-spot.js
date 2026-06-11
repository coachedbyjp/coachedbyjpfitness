// netlify/functions/claim-spot.js
import { getStore } from '@netlify/blobs';
const MAX_SPOTS = 8;

export default async (req, context) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' } });
  }
  if (req.method !== 'POST') return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });

  let body;
  try { body = await req.json(); } catch { return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 }); }

  const { program } = body;
  const valid = ['Muscle & Strength','Fat Loss & Recomposition','General Fitness & Health','Sport & Athletic Performance'];
  if (!program || !valid.includes(program)) return new Response(JSON.stringify({ error: 'Invalid program' }), { status: 400 });

  const store = getStore('jp-spots');
  const current = await store.get(program);
  const count = current ? parseInt(current) : 0;

  if (count >= MAX_SPOTS) {
    return new Response(JSON.stringify({ success: false, soldOut: true, count }), { headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
  }
  const newCount = count + 1;
  await store.set(program, String(newCount));
  return new Response(JSON.stringify({ success: true, soldOut: false, count: newCount, remaining: MAX_SPOTS - newCount }), { headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
};
export const config = { path: '/api/claim-spot' };