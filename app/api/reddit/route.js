// app/api/reddit/route.js
import axios from 'axios';
import { NextResponse } from 'next/server';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query');

  console.log('Received query:', query); // Debugging log to check if query parameter is present

  if (!query) {
    return NextResponse.json(
      { error: 'Query parameter is required.' },
      { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } }
    );
  }

  // Temporary: Return dummy data for testing
  const dummyData = [
    {
      title: 'Test Subreddit',
      description: 'This is a test description',
      created: Date.now() / 1000,
      restricted: false,
      members: 12345,
      online: 200,
      discord_url: null,
    },
  ];
  console.log('Returning dummy data'); // Debugging log
  return NextResponse.json(dummyData, { headers: { 'Access-Control-Allow-Origin': '*' } });

  try {
    const searchResponse = await axios.get(
      `https://www.reddit.com/subreddits/search.json?q=${query}`
    );
    console.log('Search response:', searchResponse.data); // Debugging log

    if (!searchResponse.data || !searchResponse.data.data || !Array.isArray(searchResponse.data.data.children)) {
      return NextResponse.json(
        { error: 'Unexpected response structure from Reddit API.' },
        { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } }
      );
    }

    const subredditDetails = await Promise.all(
      searchResponse.data.data.children.map(async (subreddit) => {
        const name = subreddit.data.display_name;

        try {
          const subredditResponse = await axios.get(
            `https://www.reddit.com/r/${name}/about.json`
          );
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
            console.warn(`Access denied for subreddit: ${name}`);
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
    return NextResponse.json(filteredSubredditDetails, { headers: { 'Access-Control-Allow-Origin': '*' } });
  } catch (error) {
    console.error("Failed to fetch data from Reddit API", error);
    return NextResponse.json(
      { error: 'Failed to fetch data from Reddit.' },
      { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } }
    );
  }
}
