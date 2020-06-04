import { spawn } from "child_process";
import { fusebox, sparky } from "fuse-box";
import { tsc } from "fuse-box/sparky/tsc";

import * as path from "path";

async function npmPublish(opts: { path: string; tag?: string }) {
	opts.tag = opts.tag || "latest";

	return new Promise((resolve, reject) => {
		const publish = spawn("npm", ["publish", "--tag", opts.tag], {
			cwd: path.join(__dirname, opts.path),
			stdio: "inherit",
		});
		publish.on("close", function (code) {
			if (code === 8) {
				return reject("Error detected, waiting for changes...");
			}
			return resolve();
		});
	});
}

class Context {
	isProduction;
	runServer;
	getDevConfig() {
		return fusebox({
			cache: true,
			devServer: !this.isProduction,
			entry: "src/dev/index.tsx",
			target: "browser",
			watcher: { include: ["src"] },
			webIndex: { template: "src/index.html" },
		});
	}
}
const { exec, rm, src, task } = sparky<Context>(Context);

task("default", async (ctx) => {
	rm("./dist");
	const fuse = ctx.getDevConfig();
	await fuse.runDev();
});

task("dist", async (ctx) => {
	rm("./dist");
	await exec("bump-version");
	await exec("transpile");
});

task("publish", async (ctx) => {
	await exec("dist");
	await npmPublish({ path: "dist/" });
});

task("transpile", async (c) => {
	await tsc(
		{
			declaration: true,
			module: "CommonJS",
			skipLibCheck: true,
			moduleResolution: "Node",
			jsx: "React",
			target: "ES2017",
			outDir: "dist",
		},
		["src/index.ts"]
	);
});

task("bump-version", async (ctx) => {
	await src("package.json").bumpVersion("package.json", { type: "patch" }).write().dest("dist/", __dirname).exec();
});

task("preview", async (ctx) => {
	rm("./dist");

	ctx.isProduction = false;
	const fuse = ctx.getDevConfig();
	await fuse.runProd();
});
