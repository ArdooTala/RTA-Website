<script setup>
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <div class="bg-dark background d-flex flex-column">
    <nav
      class="navbar navbar-expand-lg bg-dark border-bottom border-bottom-light"
      data-bs-theme="dark"
    >
      <div class="container-fluid ">
        <h1 class="navbar-brand">RECONWOOD</h1>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse ms-5" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item me-2">
              <RouterLink to="/" class="nav-link">HOME</RouterLink>
              <!-- <a class="nav-link active" aria-current="page" href="#">Home</a> -->
            </li>
            <li class="nav-item me-2">
              <RouterLink to="/projects" class="nav-link">PROJECTS</RouterLink>
            </li>
            <li class="nav-item me-2">
              <RouterLink to="/assemblies" class="nav-link"
                >ASSEMBLIES</RouterLink
              >
            </li>
            <li class="nav-item me-2">
              <RouterLink to="/materialpassports" class="nav-link"
                >MATERIALS</RouterLink
              >
            </li>
            <li class="nav-item dropdown me-2">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                ABOUT
              </a>
              <ul class="dropdown-menu">
                <li>
                  <RouterLink to="/about" class="dropdown-item"
                    >ABOUT</RouterLink
                  >
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

    <div class="container-fluid flex-fill" data-bs-theme="dark">
      <RouterView class="" />
    </div>
  </div>
</template>

<style>
.background {
  height: 100vh;
  width: 100vw;
}

/*
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}*/
</style>
