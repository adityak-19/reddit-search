// app/api/reddit/route.js
import axios from 'axios';
import { NextResponse } from 'next/server';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required.' }, { status: 400 });
  }

  try {
    // Fetch search results from Reddit API
    const searchResponse = await axios.get(`https://www.reddit.com/subreddits/search.json?q=${query}`);
    
    // Check if response structure is valid
    if (!searchResponse.data || !searchResponse.data.data || !Array.isArray(searchResponse.data.data.children)) {
      return NextResponse.json({ error: 'Unexpected response structure from Reddit API.' }, { status: 500 });
    }

    // Process subreddit details
    const subredditDetails = await Promise.all(
      searchResponse.data.data.children.map(async (subreddit) => {
        const name = subreddit.data.display_name;

        try {
          const subredditResponse = await axios.get(`https://www.reddit.com/r/${name}/about.json`);
          const data = subredditResponse.data.data;

          return {
            title: data.title,
            description: data.public_description,
            created: data.created_utc,
            restricted: data.over18,
            members: data.subscribers,
            online: data.accounts_active,
            discord_url: data.discord_url || null,
          };
        } catch (subredditError) {
          if (subredditError.response && subredditError.response.status === 403) {
            return {
              title: name,
              description: "Access denied or subreddit is private.",
              created: null,
              restricted: null,
              members: null,
              online: null,
              discord_url: null,
            };
          } else {
            console.error(`Failed to fetch details for subreddit ${name}`, subredditError);
            return null;
          }
        }
      })
    );

    const filteredSubredditDetails = subredditDetails.filter(Boolean);
    return NextResponse.json(filteredSubredditDetails);

  } catch (error) {
    console.error("Failed to fetch data from Reddit API", error);
    return NextResponse.json({ error: 'Failed to fetch data from Reddit.' }, { status: 500 });
  }
}
