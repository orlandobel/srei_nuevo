<template>
  <div class="row ">
        <sidebar />
        <div class="col-lg-10">
            <div class="row justify-content-center h-100 mh-100">
                <div class="col-lg-12 d-flex flex-column">
                    <div class="row justify-content-end my-3">
                        <div class="card-header border-0">
                               <PDFJSViewer :path="`${path}`" :fileName="`${name}`"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Sidebar from '@/components/Sidebar.vue';
import PDFJSViewer from './PDFViewer.vue';
import { pdf } from '@/api_queries/equipo';

export default {
    name: "CatalogosViewer",
    components: { 
      Sidebar,
      PDFJSViewer 
    },
    data(){
        return{
            name: "",
            path: '../../lib/web/viewer.html', //path of the PDF.js viewer.html
        }
    },
    methods: {
        async initData() {
            // añadimos consulta
            const lab = this.$route.params.laboratorio
            const tipo = this.$route.params.tipo

            try {
                await pdf(lab,tipo);
                this.name = "pdfs/doc_"+lab+"_"+tipo.toLowerCase().replace(" ", "_")+".pdf"
            } catch (error) {
                console.error(error)
            }
            //en el caso de existir más cambiar a un labOfUser.foreach(eq=>{labOfUser.push(eq)})
        },
    },
    mounted() {
        this.initData()
    },

}
</script>

<style>

</style>