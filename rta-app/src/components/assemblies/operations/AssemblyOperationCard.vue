<template>
    <div class="row">

        <div class="col-12 row">
            <div class="col-3">
                <p>Time</p>
            </div>
            <div class="col-9 d-flex justify-content-between">
                <slot name="start"></slot>
                <p> - </p>
                <slot name="end"></slot>
            </div>

            <div class="col-3">
                <p>Reports</p>
            </div>
            <div class="col-9">
                <slot name="report"></slot>
            </div>

        </div>
    </div>
</template>
  