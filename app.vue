<template>
    <a class="skip-link" href="#main-content">Skip to content</a>
    <Header/>
    <main id="main-content">
        <NuxtPage/>
    </main>
    <Footer/>
    <Sprite/>
</template>

<style>
main
{
    flex: 1 0 auto;
}

.skip-link
{
    position: absolute;
    left: 12px;
    top: -40px;
    background: #ffffff;
    color: #1c1c1f;
    padding: 8px 12px;
    border-radius: 8px;
    box-shadow: 0 10px 20px rgba(28, 28, 31, 0.15);
    z-index: 100;
    transition: top 0.2s ease;
}

.skip-link:focus
{
    top: 12px;
}
</style>
