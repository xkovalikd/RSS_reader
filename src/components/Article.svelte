<script>
  export let item;
</script>

<style>
  .item {
    text-align: center;
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
    border: 1px solid rgba(0, 0, 0, 0.5);
  }

  .item-link {
    font-size: 20px;
    text-decoration: none;
    font-weight: bold;
  }

  .item-content {
    padding-top: 10px;
  }
 
  .item-picture {
    width: 40%;
    height: auto;
  }
</style>

<div class="item">
  <div class="item-cont">
    <a class="item-link" href={item.link} target="_blank">{item.title}</a>
    <div class="item-date"> {new Date(item.isoDate).toLocaleString()} </div>
    <div class="item-content">{@html item.content}</div>
    {#if Object.getOwnPropertyNames(item).includes('image')}
      <img class="item-picture" src={item.image.url} alt="picture"/>
    {:else if Object.getOwnPropertyNames(item).includes('enclosure')}
      <img class="item-picture" src={item.enclosure.url} alt="picture"/>
    {/if}
  </div>
</div>
