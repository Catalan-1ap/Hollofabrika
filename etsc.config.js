export default {
	esbuild: {
		target: "esnext",
		platform: "node",
		format: "esm"
	},
	postbuild: async () => {
		const cpy = (await import("cpy")).default;
		await cpy(
			[
				"src/**/*.graphql",
				".env"
			],
			"dist"
		);
	},
};