<template>
  <div class="row">

    <div class="col-12 row">
      <div class="col-3">
        <p>Parts</p>
      </div>
      <div class="col-9"><slot name="parts_count"></slot></div>
      
      <div class="col-3">
        <p>Time</p>
      </div>
        <div class="col-9 d-flex justify-content-between">
          <slot name="start"></slot>
          <p> - </p>
          <slot name="end"></slot>
        </div>
      
      <div class="col-3">
        <p>Cluster</p>
      </div>
      <div class="col-9"><slot name="cluster"></slot></div>
      
      <div class="col-12"><p>Progress</p></div>
      <!-- <div class="progress col-12 " role="progressbar" aria-label="Basic" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100">
        <div class="progress-bar w-75">75%</div>
      </div> -->
    </div>
  </div>
</template>
