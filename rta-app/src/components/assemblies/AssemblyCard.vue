<template>
  <div class="row">

    <div class="col-12 row">
      <div class="col-3">
        <p>Parts</p>
      </div>
      <div class="col-9"><slot name="parts_count"></slot></div>
      
      <div class="col-3"><p>Time</p></div>
      <div class="col-9">
        <p class="d-flex w-100 justify-content-between">
          <slot name="start"></slot>
          <p> - </p>
          <slot name="end"></slot>
        </p>
      </div>
      
      <div class="col-12"><p>Progress</p></div>
      <div class="progress col-12 " role="progressbar" aria-label="Basic" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100">
        <div class="progress-bar w-75">75%</div>
      </div>
    </div>
  </div>
</template>

<!-- <style scoped>
  .item {
    margin-top: 2rem;
    display: flex;
    position: relative;
  }
  
  .details {
    flex: 1;
    margin-left: 1rem;
  }
  
  i {
    display: flex;
    place-items: center;
    place-content: center;
    width: 32px;
    height: 32px;
    color: var(--color-text);
  }
  
  h3 {
    font-size: 1.2rem;
    font-weight: 500;
    margin-bottom: 0.4rem;
    color: var(--color-heading);
  }
  
  @media (min-width: 1024px) {
    .item {
      margin-top: 0;
      padding: 0.4rem 0 1rem calc(var(--section-gap) / 2);
    }
  
    i {
      top: calc(50% - 25px);
      left: -26px;
      position: absolute;
      border: 1px solid var(--color-border);
      background: var(--color-background);
      border-radius: 8px;
      width: 50px;
      height: 50px;
    }
  
    .item:before {
      content: " ";
      border-left: 1px solid var(--color-border);
      position: absolute;
      left: 0;
      bottom: calc(50% + 25px);
      height: calc(50% - 25px);
    }
  
    .item:after {
      content: " ";
      border-left: 1px solid var(--color-border);
      position: absolute;
      left: 0;
      top: calc(50% + 25px);
      height: calc(50% - 25px);
    }
  
    .item:first-of-type:before {
      display: none;
    }
  
    .item:last-of-type:after {
      display: none;
    }
  }
  </style> -->
