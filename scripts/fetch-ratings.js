// scripts/fetch-ratings.js
const fs = require('fs/promises');

// Note: Node 18+ has 'fetch' built-in, which is used here.
// No need for 'node-fetch' package.

const LEETCODE = process.env.LEETCODE_USERNAME || 'Charith28';
const CODECHEF = process.env.CODECHEF_USERNAME || 'kakarlacharith';

// --- LeetCode API Query ---
// LeetCode's profile page is JS-rendered, so direct HTML scraping fails.
// We use their GraphQL API endpoint for reliable data retrieval.
const LEETCODE_API_URL = 'https://leetcode.com/graphql';
const LEETCODE_QUERY = `
query userContestRanking($username: String!) {
  userContestRanking(username: $username) {
    rating
  }
}
`;

async function fetchLeetCodeRating() {
    const res = await fetch(LEETCODE_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'github-actions-rating-fetcher'
        },
        body: JSON.stringify({
            query: LEETCODE_QUERY,
            variables: { username: LEETCODE }
        })
    });

    if (!res.ok) throw new Error(`LeetCode API returned ${res.status}`);
    const data = await res.json();
    
    // Check if the user exists and has a contest ranking
    const ranking = data?.data?.userContestRanking;
    
    // Return the rounded rating or null if not found
    return ranking?.rating ? Math.round(ranking.rating) : null;
}

// --- CodeChef HTML Scrape (Updated Regex) ---
async function fetchText(url) {
    const res = await fetch(url, { headers: { 'User-Agent': 'github-actions' } });
    if (!res.ok) throw new Error(`${url} returned ${res.status}`);
    return await res.text();
}

function parseCodeChef(html) {
    // Updated regex to look specifically for the rating number inside the span with class 'rating'
    const m = html.match(/current-rating.*?rating">([\d,]+)</i);
    if (!m) {
         // Fallback if the first pattern fails (sometimes the class changes)
         const fallback = html.match(/rating-number[^>]*>([\d,]+)/i);
         return fallback ? parseInt(fallback[1].replace(/,/g, ''), 10) : null;
    }
    return parseInt(m[1].replace(/,/g, ''), 10);
}

// --- Main Execution ---
async function main() {
    const outPath = 'public/ratings.json';
    const result = { leetcode: null, codechef: null, fetched_at: new Date().toISOString() };

    // 1. Fetch LeetCode
    try {
        result.leetcode = await fetchLeetCodeRating();
        console.log(`LeetCode Rating: ${result.leetcode}`);
    } catch (e) { 
        console.error('LeetCode fetch failed:', e.message); 
    }

    // 2. Fetch CodeChef
    try {
        const ccHtml = await fetchText(`https://www.codechef.com/users/${CODECHEF}`);
        result.codechef = parseCodeChef(ccHtml);
        console.log(`CodeChef Rating: ${result.codechef}`);
    } catch (e) { 
        console.error('CodeChef fetch failed:', e.message); 
    }

    // 3. Save result
    await fs.mkdir('public', { recursive: true });
    await fs.writeFile(outPath, JSON.stringify(result, null, 2), 'utf8');
    console.log('Ratings saved to', outPath);
}

main();