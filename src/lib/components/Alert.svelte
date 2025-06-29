<script lang="ts">
	export let type: 'error' | 'success' = 'error';
	export let message: string;
</script>

<div class={type}>
	{message}
</div>
