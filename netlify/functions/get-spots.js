// netlify/functions/get-spots.js
import { getStore } from '@netlify/blobs';

export default async (req, context) => {
  const store = getStore('jp-spots');
  const programs = [
    'Muscle & Strength',
    'Fat Loss & Recomposition',
    'General Fitness & Health',
    'Sport & Athletic Performance',
  ];
  const spots = {};
  for (const prog of programs) {
    const val = await store.get(prog);
    spots[prog] = val ? parseInt(val) : 0;
  }
  return new Response(JSON.stringify(spots), {
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  });
};
export const config = { path: '/api/get-spots' };