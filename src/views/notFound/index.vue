<template>
  <div class="flex justify-center items-center text-white bg-[#131313] h-[100vh] text-8xl">
    <div title="404" class=" notfound">404</div>
  </div>



</template>

<script setup>
</script>

<style lang="css" scoped>
.notfound {
  animation: glitch 1s linear infinite;
}

@keyframes glitch {

  2%,
  64% {
    transform: translate(2px, 0) skew(0deg);
  }

  4%,
  60% {
    transform: translate(-2px, 0) skew(0deg);
  }

  62% {
    transform: translate(0, 0) skew(5deg);
  }
}

.notfound:before,
.notfound:after {
  content: attr(title);
  position: absolute;
  left: 0;
}

.notfound:before {
  animation: glitchTop 1s linear infinite;
  clip-path: polygon(0 0, 100% 0, 100% 33%, 0 33%);
  -webkit-clip-path: polygon(0 0, 100% 0, 100% 33%, 0 33%);
}

@keyframes glitchTop {

  2%,
  64% {
    transform: translate(2px, -2px);
  }

  4%,
  60% {
    transform: translate(-2px, 2px);
  }

  62% {
    transform: translate(13px, -1px) skew(-13deg);
  }
}

.notfound:after {
  animation: glitchBotom 1.5s linear infinite;
  clip-path: polygon(0 67%, 100% 67%, 100% 100%, 0 100%);
  -webkit-clip-path: polygon(0 67%, 100% 67%, 100% 100%, 0 100%);
}

@keyframes glitchBotom {

  2%,
  64% {
    transform: translate(-2px, 0);
  }

  4%,
  60% {
    transform: translate(-2px, 0);
  }

  62% {
    transform: translate(-22px, 5px) skew(21deg);
  }
}
</style>
