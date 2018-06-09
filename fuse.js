const { src, task, exec,  context, tsc, bumpVersion, npmPublish } = require("fuse-box/sparky");
const { FuseBox, QuantumPlugin, WebIndexPlugin } = require("fuse-box");

task("default", async context => {
    await context.clean();
    await context.development();
});

task("tsc", async () => {
    await tsc("src", {
        target : "esnext",
        declaration : true,
        outDir : "dist/"
    });
});

task("test", async context => {
    await context.test();
})
task("dist", async context => {
    await context.clean();
    await context.prepareDistFolder();
    await exec("tsc")
});

task("publish", async () => {
    await exec("dist")
    await npmPublish({path : "dist"});
})

context(class {
    getConfig() {
        return FuseBox.init({
            homeDir: "src",
            target: "browser",
            output: "dist/$name.js",
            plugins : [
                WebIndexPlugin({
                    template : "src/index.html"
                })
            ]
        });
    }
    async tsc(){
        await tsc("src", {
            target : "esnext"
        });
    }

    async clean() {
        await src("./dist").clean("dist/").exec();
    }

    async prepareDistFolder() {
        await bumpVersion("package.json", {type : "patch"});
        await src("./package.json").dest("dist/").exec();
    }

    development() {
        this.target = "server@esnext";
        this.bundleName = "app";
        this.isProduction = false;
        this.instructions = ">dev.tsx";
        const fuse = this.getConfig();
        fuse.dev();
        
        const bundle = fuse.bundle(this.bundleName)
            .hmr()
            .instructions(this.instructions).watch();
        return fuse.run();
    }
});