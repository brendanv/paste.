<script lang="ts">
	import type { PageData, ActionData } from './$types';
	export let data: PageData;
	export let form: ActionData;
</script>

{#if data.session?.user}
	<h1>Hello, {data.session.user.name}!</h1>

	<h2>Create New Paste</h2>

	{#if form?.error}
		<div class="error" style="color: red; background: #ffe6e6; padding: 10px; border: 1px solid #ff0000; border-radius: 4px; margin-bottom: 15px;">
			{form.error}
		</div>
	{/if}

	<form method="POST" action="?/createPaste">
		<div>
			<label for="title">Title (optional):</label>
			<input type="text" id="title" name="title" />
		</div>

		<div>
			<label for="content">Content *:</label>
			<textarea id="content" name="content" rows="10" cols="80" required></textarea>
		</div>

		<div>
			<label for="visibility">Visibility:</label>
			<select id="visibility" name="visibility" required>
				<option value="private">Private</option>
				<option value="logged_in">All logged in users</option>
				<option value="public">Public</option>
			</select>
		</div>

		<div>
			<label for="expiration">Expiration:</label>
			<select id="expiration" name="expiration" required>
				<option value="never">Never</option>
				<option value="1hour">1 hour</option>
				<option value="1day">1 day</option>
				<option value="1week">1 week</option>
				<option value="1month">1 month</option>
				<option value="6months">6 months</option>
				<option value="1year">1 year</option>
			</select>
		</div>

		<div>
			<label for="customSlug">Custom URL slug (optional):</label>
			<input type="text" id="customSlug" name="customSlug" pattern="[a-zA-Z0-9_\-]+" minlength="3" maxlength="50" title="3-50 characters: letters, numbers, hyphens, and underscores only" />
		</div>

		<button type="submit">Create Paste</button>
	</form>

	<hr />

	<form method="POST" action="/auth/signout">
		<button>Sign Out</button>
	</form>
{:else}
	<p>Not signed in.</p>
{/if}
