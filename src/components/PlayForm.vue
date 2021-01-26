<template>
    <div class="playform" >
        <div class="conter">
            <div class="pimg">
                <img :src="product.smallImg">
            </div>
            <div class="p-txt">
                <p class="name">{{product.name}}<span class="rule">{{product.rule}}</span></p>
                <p>{{product.enname}}</p>
                <p><i>￥</i>{{product.price}}<span class="much">数量:×{{product.count}}</span></p>
            </div>
        </div>
    </div>
</template>
<script>
import '../assets/less/playform.less'
export default {
    name:'PlayForm',
    props: {
        product:{
            type:Object,
            default(){
                return {};
            }
        }
    },
    mounted(){
        
    }
}
</script>