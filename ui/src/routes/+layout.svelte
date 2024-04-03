<script>
	import Sidebar from '$lib/components/Sidebar.svelte';
	import '../app.pcss';
	import FooterToolbar from '../lib/components/FooterToolbar.svelte';
</script>

<div class="h-dvh w-full flex flex-col">
	<div class="flex w-full h-full">
		<Sidebar />
		<slot />
	</div>

	<FooterToolbar />
</div>
