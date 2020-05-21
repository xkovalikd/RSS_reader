<script>
	import { onMount } from 'svelte';
	import Article from "../components/Article.svelte";

	let rssUrl = 'https://www.sme.sk/rss-title';
	let rssList = [];
	let feedsContent = [];

	onMount(async() => {
		const newRssList = await fetch('/api/list').then(r => r.json());
		rssList = newRssList;
	});

	const refreshFeeds = async () => {
    const feeds = await fetch("/api/refresh").then(r => r.json());
    feedsContent = feeds
      .map(feed => {
        const { items, ...feedMeta } = feed;
        return items.map(item => ({ ...item, feed: feedMeta }));
      })
      .reduce((acc, val) => acc.concat(val), []);
  };

  const sortAsc = async () => {
	feedsContent = feedsContent.sort((a, b) => new Date(a.isoDate) - new Date(b.isoDate));
	return feedsContent;
	};

  const sortDesc = async () => {
    feedsContent = feedsContent.sort((a, b) => new Date(b.isoDate) - new Date(a.isoDate));
	return feedsContent;
  };

	const addRssToList = async () => {
		const {added, rssList: newRssList}  = await fetch('/api/add', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({url: rssUrl}),
		}).then(r => r.json());
		if (added){
			removeFromList(rssList[0]);
			rssList = newRssList;
			refreshFeeds();
		}
	};

	const removeFromList = async(url) => {
		const {removed, rssList: newRssList}  = await fetch('/api/del', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({url}),
		}).then(r => r.json());
		if (removed){
			rssList = newRssList;
			refreshFeeds();
		}
	};

</script>

<style>
  .container {
    display: block;
  }

  .articles {
    display: block;
    flex: 1;
    padding: 10px;
    flex-direction: column;
  }

  .feed-input {
    width: 90%;
	text-align:center;
	display: block;
  	margin: auto;
  }

  .button {
	width: 100px;
	display: block;
  	margin: auto;
	margin-top: 3px;
  }
  .button1 {
	width: 100px;
	display: block;
  	margin: auto;
	margin-top: 10px;
  }

  .articles-actions {
	border-top: 2px solid rgba(0, 0, 0, 1);
    display: box;
	align-content: center;
	margin-bottom: 10px;
  }

  .articles-list {
	display: block;
  }
</style>

<svelte:head>
	<title>RSS_reader</title>
</svelte:head>

<div class="add-feed">
	<input class="feed-input" type="text" placeholder="https://www.sme.sk/rss-title" bind:value={rssUrl}/>
	<button class="button" on:click={addRssToList}>Load</button>
	<button class="button" on:click={() => removeFromList(rssList[0])}>Remove</button>
</div>

<div class="container">
  <div class="articles">
    <div class="articles-actions">
      <button class="button1" on:click={refreshFeeds}>Reload</button>
	  <button class="button" on:click={sortDesc}>Newest</button>
	  <button class="button" on:click={sortAsc}>Oldest</button>
    </div>
    <div class="articles-list">
      {#each feedsContent as item}
        <Article {item} />
      {/each}
    </div>
  </div>
</div>