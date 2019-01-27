const { src, task, exec, context, tsc, bumpVersion, npmPublish } = require("fuse-box/sparky");
const { FuseBox, QuantumPlugin, CSSPlugin, SassPlugin, WebIndexPlugin } = require("fuse-box");
const path = require("path");
const express = require("express");
task("default", async context => {
	await context.clean();
	await context.development();
});

task("tsc", async () => {
	await tsc("src", {
		target: "esnext",
		declaration: true,
		outDir: "dist/"
	});
});

task("test", async context => {
	await context.test();
});
task("dist", async context => {
	await context.clean();
	await exec("tsc");
});

task("publish", async context => {
	await exec("dist");
	await context.prepareDistFolder();
	await npmPublish({ path: "dist" });
});

context(
	class {
		getConfig() {
			return FuseBox.init({
				homeDir: "src",
				target: "browser@es5",
				output: "dist/$name.js",
				plugins: [
					[SassPlugin(), CSSPlugin()],
					WebIndexPlugin({
						template: "src/index.html",
						path: "/static"
						//resolve  : "/static"
					})
				]
			});
		}
		async tsc() {
			await tsc("src", {
				target: "esnext"
			});
		}

		async clean() {
			await src("./dist")
				.clean("dist/")
				.exec();
		}

		async prepareDistFolder() {
			await bumpVersion("package.json", { type: "patch" });
			await src("./package.json")
				.dest("dist/")
				.exec();
		}

		development() {
			this.target = "server@esnext";
			this.bundleName = "app";
			this.isProduction = false;
			this.instructions = ">dev/dev.tsx";
			const fuse = this.getConfig();
			fuse.dev({ root: false }, server => {
				const dist = path.resolve("./dist");
				const app = server.httpServer.app;
				app.use("/static/", express.static(path.join(dist)));
				app.get("*", function(req, res) {
					res.sendFile(path.join(dist, "index.html"));
				});
			});
			const bundle = fuse
				.bundle(this.bundleName)
				.hmr()
				.instructions(this.instructions)
				.watch();
			return fuse.run();
		}
	}
);
