<script setup>
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
    <div class="bg-dark background d-flex flex-column overflow-scroll">
        <nav class="navbar navbar-expand-lg bg-dark border-bottom border-bottom-light">
            <div class="container-fluid">
                <h1 class="navbar-brand">RECONWOOD</h1>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse ms-5 justify-content-center" id="navbarNav">
                    <ul class="navbar-nav">
                        <li class="nav-item me-2">
                            <RouterLink to="/" class="nav-link">HOME</RouterLink>
                            <!-- <a class="nav-link active" aria-current="page" href="#">Home</a> -->
                        </li>
                        <li class="nav-item me-2">
                            <RouterLink to="/projects" class="nav-link disabled">PROJECTS</RouterLink>
                        </li>
                        <li class="nav-item me-2">
                            <RouterLink to="/assemblies" class="nav-link">ASSEMBLIES</RouterLink>
                        </li>
                        <li class="nav-item me-2">
                            <RouterLink to="/mps" class="nav-link">MATERIALS</RouterLink>
                        </li>
                        <li class="nav-item dropdown me-2">
                            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
                                aria-expanded="false">
                                ABOUT
                            </a>
                            <ul class="dropdown-menu">
                                <li>
                                    <RouterLink to="/about" class="dropdown-item">ABOUT</RouterLink>
                                </li>
                                <li>
                                    <RouterLink to="/team" class="dropdown-item">TEAM</RouterLink>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>

        <div class="container-fluid flex-fill">
            <RouterView class="" />
        </div>
    </div>
</template>

<style>
.background {
    height: 100vh;
    width: 100vw;
    background-attachment: scroll;
    padding: 1em;
    padding-top: 0px;
}
</style>
