<template>
<div class="wrap-element">
  <iframe class="wrapped-iframe" height="100%" width=100% :src="`${getFilePath}`" ></iframe>
</div>
  
</template>

<script>
export default {
  name: 'PDFJSViewer',
  props: {
    fileName: String,
    path:String
  },
  computed:{ 
    getFilePath: function () {
      if(this.fileName!==''){
        console.log( this.path +'?file=' + this.fileName)
          return this.path +'?file=' + this.fileName
      }
      return this.path 
    }
  }
}
</script>
<style scoped>
.wrap-element {
  position: relative;
  overflow: hidden;
  padding-top: 56.25%;
}

.wrapped-iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 0;
}
</style>