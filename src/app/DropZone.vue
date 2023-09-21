<template>
  <div
    ref="dropEl"
    class="dropzone"
  >
    <slot />
    <input
      ref="fileInput"
      type="file"
    >
  </div>
</template>

<script>
/* eslint-disable no-alert, no-console */
import { SimpleDropzone } from "simple-dropzone";
import path from "path";

export default {
  name: "DropZone",
  data: function () {
    return {
      objectURLs: [],
    };
  },
  mounted: function () {
    const dropCtrl = new SimpleDropzone(
      this.$refs.dropEl,
      this.$refs.fileInput
    );
    dropCtrl.on("drop", ({ files }) => {
      this.localDrop(files);
    });
  },
  methods: {
    createMetadataObjectURLs: function (text, list) {
      let content = text;
      for (const [key, file] of Object.entries(list)) {
        if (content.includes(key)) {
          const objectURL = URL.createObjectURL(file);
          const re = new RegExp(key, "g");
          content = content.replace(re, objectURL);
          this.objectURLs.push(objectURL);
        }
      }
      let blob = new Blob([content], { type: "application/json" });
      const metaURL = URL.createObjectURL(blob);
      this.objectURLs.push(metaURL);
      this.$emit("files-drop", { url: metaURL, format : "metadata" } );
    },
    createGLTFURL: function (content, binary) {
      let type =  binary ? 'model/gltf+binary' : 'model/gltf+json';
      let blob = new Blob([content], { type });
      const gltfURL = URL.createObjectURL(blob);
      this.objectURLs.push(gltfURL);
      this.$emit("files-drop", { url: gltfURL, format : "gltf" });
    },
    revokeURLs: function () {
      this.objectURLs.forEach(objectURL => URL.revokeObjectURL(objectURL));
      this.objectURLs = [];    
    },
    localDrop: function (fileMap) {
      let list = {};
      let metadata = undefined;
      let gltf = undefined;
      let binary = false;
      const flatarray = Array.from(fileMap);
      let rootPath = "";
      for (let i = 0; i < flatarray.length; i++) {
        if (flatarray[i][1].name.includes("metadata.json")) {
          rootPath = flatarray[i][0].replace(flatarray[i][1].name, "");
          metadata = { rootPath, file: flatarray[i][1] };
          break;
        }
        if (flatarray[i][1].name.includes(".glb")) {
          gltf = { rootPath, file: flatarray[i][1] };
          binary = true;
          break;
        }
        if (flatarray[i][1].name.includes(".gltf")) {
          gltf = { rootPath, file: flatarray[i][1] };
          binary = false;
          break;
        }
      }
      if (metadata) {
        flatarray.forEach(([filePath, file]) => {
          if (file.name.match(/\.(json)$/)) {
            const relativePath = path.relative(rootPath, filePath);
            list[relativePath] = file;
          }
        });
        const metaFileURL = URL.createObjectURL(metadata.file);
        fetch(metaFileURL)
          .then((response) => response.text())
          .then((text) => this.createMetadataObjectURLs(text, list));
        URL.revokeObjectURL(metaFileURL);
      }
      if (gltf) {
        this.createGLTFURL(gltf.file, binary);
      }
    },
  },
};
</script>

<style scoped lang="scss">
.dropzone {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>
